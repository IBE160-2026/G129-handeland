/**
 * Gjør et utfylt vurderingsark om til en datafil — AD-17: «manuelle
 * dommer lagres som datafiler i repoet, i en fast form».
 *
 *   node maaling/les-vurderingsark.mjs maaling/resultater/fr31-vurderingsark-v3.md
 *   node maaling/les-vurderingsark.mjs maaling/resultater/fr14-vurderingsark-v2.md
 *
 * Arktypen kjennes på overskriften. FR-14 (quiz) leses i les-quizark.mjs.
 *
 * Leser hvert vers: antall usanne påstander, huskeregel ja/nei og
 * kommentaren, og skriver fr31-dommer-<versjon>.json ved siden av arket.
 * Arket er utviklerens; denne fila endrer det ikke.
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const fil = process.argv[2];
if (!fil) throw new Error("Oppgi arket som argument.");
const tekst = (await readFile(fil, "utf8")).replace(/\r\n/g, "\n");
const versjon = tekst.match(/prompt (v\d+)/)?.[1] ?? "ukjent";

if (/^# Vurderingsark — quiz \(FR-14\)/m.test(tekst)) {
  const { lesQuizark } = await import("./les-quizark.mjs");
  await lesQuizark(fil, tekst, versjon);
  process.exit(0);
}

const vers = [];
for (const blokk of tekst.split(/\n---\n/)) {
  const tittel = blokk.match(/^## (\d+)\. (.+?) — (vers|Suno-prompt)(?: \d+)?$/m);
  if (!tittel) continue;
  const usanne = blokk.match(/\*\*Usanne påstander:\s*(\d+)/)?.[1];
  const ja = /Huskeregel:\*\*\s*[Xx☒]\s*ja/.test(blokk);
  const nei = /[Xx☒]\s*nei/.test(blokk);
  const kommentar = blokk.match(/\*\*Kommentar:\s*([\s\S]*?)\*\*/)?.[1]?.trim() ?? "";
  vers.push({
    nummer: Number(tittel[1]),
    tekst: tittel[2],
    form: tittel[3] === "vers" ? "vers" : "suno",
    usannePaastander: usanne === undefined ? null : Number(usanne),
    huskeregel: ja ? true : nei ? false : null,
    kommentar,
  });
}

const mangler = vers.filter((v) => v.usannePaastander === null || v.huskeregel === null);
if (mangler.length > 0) {
  throw new Error(`Arket er ikke ferdig utfylt: vers ${mangler.map((v) => v.nummer).join(", ")}`);
}

const sum = vers.reduce((s, v) => s + v.usannePaastander, 0);
const ut = {
  krav: "FR-31",
  promptversjon: versjon,
  vurdert: new Date().toISOString().slice(0, 10),
  vurdertAv: "utvikleren",
  usannePaastander: { sum, maal: 0, bestaatt: sum === 0 },
  huskeregel: { ja: vers.filter((v) => v.huskeregel).length, av: vers.length },
  vers,
};
const malfil = path.join(path.dirname(fil), `fr31-dommer-${versjon}.json`);
await writeFile(malfil, JSON.stringify(ut, null, 2) + "\n");
console.log(`${malfil}: ${sum} usanne påstander, huskeregel ${ut.huskeregel.ja} av ${ut.huskeregel.av}`);
