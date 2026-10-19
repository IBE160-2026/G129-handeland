/**
 * Promptloggen: hver prompt utvikleren har skrevet til Claude Code i
 * IBE160-prosjektet, ordrett, med tidspunkt, modell og commitene som ble
 * gjort i samme økt.
 *
 *   node ki-okter/lag-promptlogg.mjs          alle lagrede økter
 *   node ki-okter/lag-promptlogg.mjs --hook   fra en Claude Code-hook (stdin)
 *
 * Sensorveiledningen (del 1, kriterium 1) ser etter «lagrede prompts og
 * KI-økter» koblet til konkrete endringer. Claude Code lagrer øktene i
 * ~/.claude/projects/, men sletter dem etter en tid. Derfor samles promptene
 * i promptlogg.json, som bare vokser: en prompt som er hentet én gang, blir
 * liggende selv om økta senere er borte. Markdown-loggen lages på nytt fra
 * arkivet hver gang.
 *
 * Loggen er rå og ugradert, med vilje: den viser hva som faktisk ble skrevet.
 * Vurderingen av hva som ble godtatt, endret eller forkastet står i
 * ki-logg.md, og appens egne prompter i prompts/REGISTER.md.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HER = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HER, "..");
const ARKIV = path.join(HER, "promptlogg.json");
const LOGG = path.join(REPO, "_bmad-output", "planning-artifacts", "promptlogg.md");

// Øktene ligger i en mappe per arbeidsmappe, med stien som navn
// («c--Users-admin-Documents-IBE160»). Både IBE160 og mapper under teller.
const PROSJEKTER = path.join(os.homedir(), ".claude", "projects");
const PREFIKS = path.dirname(REPO).replace(/[:\\/]/g, "-").toLowerCase();

/** Lange innlimte dokumenter er ikke prompter; de kortes ned i loggen. */
const MAKS_INNLIMT = 1500;

function sensurer(tekst) {
  return tekst
    .replace(/sk-ant-[\w-]+/g, "[API-NØKKEL FJERNET]")
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "[DATABASE-URL FJERNET]")
    .replace(/\b([A-Z_]*(?:PASSWORD|PASSORD|SECRET|TOKEN|API_KEY|INVITASJONSKODE)[A-Z_]*)\s*[=:]\s*\S+/g, "$1=[FJERNET]");
}

function rens(tekst) {
  let t = tekst
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .replace(/<ide_opened_file>[\s\S]*?<\/ide_opened_file>/g, "")
    .replace(/<ide_selection>[\s\S]*?<\/ide_selection>/g, "[markert tekst i editoren]")
    .replace(/<local-command-caveat>[\s\S]*?<\/local-command-caveat>/g, "")
    .replace(/<local-command-stdout>[\s\S]*?<\/local-command-stdout>/g, "")
    .replace(/<command-message>[\s\S]*?<\/command-message>/g, "")
    .replace(/<command-name>([\s\S]*?)<\/command-name>/g, "[kommando: $1]")
    .replace(/<command-args>([\s\S]*?)<\/command-args>/g, (_, a) => (a.trim() ? ` ${a.trim()}` : ""))
    .replace(/<pasted_content[^>]*>([\s\S]*?)<\/pasted_content[^>]*>/g, (_, innhold) =>
      innhold.length > MAKS_INNLIMT
        ? `[innlimt tekst, ${innhold.length} tegn, første del:]\n${innhold.slice(0, MAKS_INNLIMT)} …`
        : `[innlimt tekst:]\n${innhold}`,
    );
  return sensurer(t.trim());
}

/** Teksten i en brukermelding, eller null når den bare er verktøysvar. */
function brukertekst(innhold) {
  if (typeof innhold === "string") return rens(innhold);
  if (!Array.isArray(innhold)) return null;
  const deler = [];
  for (const d of innhold) {
    if (d.type === "text") deler.push(rens(d.text));
    else if (d.type === "document") deler.push(`[vedlegg: ${d.title ?? d.source?.media_type ?? "dokument"}]`);
    else if (d.type === "image") deler.push("[vedlegg: bilde]");
  }
  const t = deler.filter(Boolean).join("\n\n");
  return t || null;
}

function lesOekt(fil, arkiv) {
  const linjer = readFileSync(fil, "utf8").split("\n");
  const poster = [];
  for (const l of linjer) {
    if (!l) continue;
    try {
      poster.push(JSON.parse(l));
    } catch {
      // En økt som skrives til mens vi leser, kan ha en halv siste linje.
    }
  }
  let nye = 0;
  for (let i = 0; i < poster.length; i++) {
    const p = poster[i];
    if (p.type !== "user" || p.isMeta || p.isSidechain || !p.uuid || !p.timestamp) continue;
    // Sammendrag Claude Code selv skriver når en lang økt komprimeres, og
    // varsler om bakgrunnsjobber, kommer som brukermeldinger. De er ikke prompter.
    if (p.isCompactSummary || p.isVisibleInTranscriptOnly) continue;
    const tekst = brukertekst(p.message?.content);
    if (!tekst || /^\[Request interrupted by user/.test(tekst)) continue;
    if (/^This session is being continued|<task-notification>|\[SYSTEM NOTIFICATION/.test(tekst)) continue;
    const svar = poster.slice(i + 1).find((q) => q.type === "assistant" && q.message?.model && q.message.model !== "<synthetic>");
    // Siste tidspunkt før neste prompt: vinduet commitene hentes fra.
    let slutt = p.timestamp;
    for (const q of poster.slice(i + 1)) {
      if (q.type === "user" && !q.isMeta && !q.isSidechain && brukertekst(q.message?.content)) break;
      if (q.timestamp) slutt = q.timestamp;
    }
    if (!arkiv.has(p.uuid)) nye++;
    arkiv.set(p.uuid, {
      uuid: p.uuid,
      okt: p.sessionId,
      tid: p.timestamp,
      slutt,
      modell: svar?.message.model ?? arkiv.get(p.uuid)?.modell ?? null,
      tekst,
    });
  }
  return nye;
}

function commits(fra, til) {
  try {
    const ut = execFileSync("git", ["log", `--since=${fra}`, `--until=${til}`, "--format=%h %s", "--reverse"], {
      cwd: REPO,
      encoding: "utf8",
    });
    return ut.split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

const OSLO = { timeZone: "Europe/Oslo" };
const dato = (iso) => new Date(iso).toLocaleDateString("sv-SE", OSLO);
const klokke = (iso) => new Date(iso).toLocaleTimeString("nb-NO", { ...OSLO, hour: "2-digit", minute: "2-digit" });

function lagMarkdown(prompter) {
  // Én seksjon per økt per dag: noen økter er gjenopptatt over flere uker.
  const grupper = new Map();
  for (const p of prompter) {
    const n = `${dato(p.tid)} ${p.okt}`;
    if (!grupper.has(n)) grupper.set(n, []);
    grupper.get(n).push(p);
  }
  const ut = [
    "---",
    "title: Promptlogg — Lesevenn",
    "status: løpende, generert",
    "---",
    "",
    "# Promptlogg",
    "",
    "Hver prompt jeg har skrevet til Claude Code i IBE160-prosjektet, **ordrett**, med tidspunkt, modell og commitene som ble gjort i samme økt. Loggen er generert fra de lagrede øktene av [`ki-okter/lag-promptlogg.mjs`](../../ki-okter/lag-promptlogg.mjs) og oppdateres av en hook etter hvert svar. Den skal ikke redigeres for hånd.",
    "",
    "- **Hva som ble godtatt, endret eller forkastet, og hvorfor:** [`ki-logg.md`](ki-logg.md).",
    "- **Appens egne prompter og versjonene av dem:** [`prompts/REGISTER.md`](../../prompts/REGISTER.md).",
    "",
    "Systemmeldinger fra verktøyet og innholdet i vedlegg er utelatt; lange innlimte tekster er kortet ned. Nøkler og passord fjernes automatisk.",
    "",
    `**${prompter.length} prompter i ${grupper.size} økter**, ${dato(prompter[0].tid)} til ${dato(prompter.at(-1).tid)}.`,
    "",
  ];
  for (const [, gruppe] of grupper) {
    const foerste = gruppe[0];
    const modeller = [...new Set(gruppe.map((p) => p.modell).filter(Boolean))].join(", ") || "ukjent modell";
    ut.push("---", "", `## ${dato(foerste.tid)} · økt \`${foerste.okt.slice(0, 8)}\` · ${modeller}`, "");
    for (const p of gruppe) {
      ut.push(`**${klokke(p.tid)}**`, "", ...p.tekst.split("\n").map((l) => `> ${l}`.trimEnd()), "");
    }
    const c = commits(foerste.tid, gruppe.at(-1).slutt);
    if (c.length > 0) {
      ut.push(`<details><summary>Commits i økta (${c.length})</summary>`, "", ...c.map((m) => `- \`${m.slice(0, 7)}\` ${m.slice(8)}`), "", "</details>", "");
    }
  }
  return ut.join("\n");
}

// --- Kjøring ------------------------------------------------------------

const arkiv = new Map(
  existsSync(ARKIV) ? JSON.parse(readFileSync(ARKIV, "utf8")).prompter.map((p) => [p.uuid, p]) : [],
);

let filer;
if (process.argv.includes("--hook")) {
  // Hooken sender økta som JSON på stdin. Feil her skal aldri stoppe Claude Code.
  try {
    const inn = JSON.parse(readFileSync(0, "utf8"));
    filer = inn.transcript_path && existsSync(inn.transcript_path) ? [inn.transcript_path] : [];
  } catch {
    process.exit(0);
  }
} else {
  filer = readdirSync(PROSJEKTER)
    .filter((m) => m.toLowerCase().startsWith(PREFIKS))
    .flatMap((m) =>
      readdirSync(path.join(PROSJEKTER, m))
        .filter((f) => f.endsWith(".jsonl"))
        .map((f) => path.join(PROSJEKTER, m, f)),
    );
}

let nye = 0;
for (const f of filer) nye += lesOekt(f, arkiv);

const prompter = [...arkiv.values()].sort((a, b) => a.tid.localeCompare(b.tid));
if (prompter.length === 0) process.exit(0);
writeFileSync(ARKIV, JSON.stringify({ _om: "Generert av lag-promptlogg.mjs. Bare vokser; se kommentaren øverst i skriptet.", prompter }, null, 2) + "\n");
writeFileSync(LOGG, lagMarkdown(prompter));
if (!process.argv.includes("--hook")) {
  console.log(`${filer.length} økter lest, ${nye} nye prompter, ${prompter.length} i alt → ${path.relative(REPO, LOGG)}`);
}
