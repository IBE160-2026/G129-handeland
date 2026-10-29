/**
 * Leser et utfylt FR-14-vurderingsark (quiz) og skriver fr14-dommer-<versjon>.json.
 * Kalles fra les-vurderingsark.mjs, som kjenner arktypen på overskriften.
 *
 * FR-14: et spørsmål passerer når A (riktig svar støttes av teksten) er ja,
 * B (de gale alternativene er gale ut fra teksten) er ja eller ikke aktuelt,
 * og C (krever kunnskap utenfor teksten) er nei. Minst 85 prosent av de 24
 * skal passere, og andelen rapporteres med konfidensintervall. C = ja er
 * null tolerert i det som vises eleven.
 *
 * «Passerer» regnes ut fra A, B og C. Har utvikleren også krysset av for
 * passerer, og det ikke stemmer med regelen, stopper lesingen: da er enten
 * krysset eller regelen feil, og det må avgjøres av et menneske.
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";

/** Ja, nei eller null ut fra et «☐ ja ☐ nei»-felt der ett er krysset. */
function kryss(linje, felt) {
  const m = linje.match(new RegExp(`\\*\\*${felt}\\*\\*\\s*([^·]*)`));
  if (!m) return undefined;
  const f = m[1];
  if (/ikke aktuelt/.test(f)) return "ikke aktuelt";
  const ja = /[Xx☒]\s*ja/.test(f);
  const nei = /[Xx☒]\s*nei/.test(f);
  if (ja === nei) return null;
  return ja;
}

/**
 * Wilson-intervallet, 95 prosent. Brukes i stedet for normaltilnærmingen
 * fordi n = 24 og andelen ligger nær 1, der normaltilnærmingen gir grenser
 * over 1. FR-14 sier [0,73, 0,98] rundt 0,9, som er Wilson.
 */
export function wilson(k, n, z = 1.96) {
  if (n === 0) return [0, 0];
  const p = k / n;
  const nevner = 1 + (z * z) / n;
  const midt = (p + (z * z) / (2 * n)) / nevner;
  const halv = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / nevner;
  return [Math.max(0, midt - halv), Math.min(1, midt + halv)];
}

export async function lesQuizark(fil, tekst, versjon) {
  const sporsmal = [];
  let tittel = "";
  for (const del of tekst.split(/\n(?=## |### )/)) {
    const t = del.match(/^## (.+)$/m);
    if (t && !del.startsWith("###")) tittel = t[1];
    const s = del.match(/^### (\d+)\. (.+?) _\((flervalg|kortsvar)\)_$/m);
    if (!s) continue;
    const linje = del.split("\n").find((l) => l.startsWith("**A**")) ?? "";
    const A = kryss(linje, "A");
    const B = kryss(linje, "B");
    const C = kryss(linje, "C");
    const merket = kryss(linje, "Passerer");
    const kommentar = (del.match(/\*\*Kommentar:\*\*([\s\S]*?)(?=\n---|\n### |$)/)?.[1] ?? "").trim();
    sporsmal.push({ nummer: Number(s[1]), tekst: tittel, sporsmal: s[2], type: s[3], A, B, C, merket, kommentar });
  }

  const mangler = sporsmal.filter((q) => q.A == null || q.B == null || q.C == null);
  if (mangler.length > 0) {
    throw new Error(`Arket er ikke ferdig utfylt (A, B eller C mangler): spørsmål ${mangler.map((q) => q.nummer).join(", ")}`);
  }
  for (const q of sporsmal) {
    q.passerer = q.A === true && (q.B === true || q.B === "ikke aktuelt") && q.C === false;
  }
  const uenige = sporsmal.filter((q) => typeof q.merket === "boolean" && q.merket !== q.passerer);
  if (uenige.length > 0) {
    throw new Error(
      `«Passerer» er krysset motsatt av det A, B og C gir: spørsmål ${uenige.map((q) => q.nummer).join(", ")}. Rett krysset eller vurderingen.`,
    );
  }

  const n = sporsmal.length;
  const k = sporsmal.filter((q) => q.passerer).length;
  const utenfor = sporsmal.filter((q) => q.C === true).length;
  const [lav, hoey] = wilson(k, n);
  const ut = {
    krav: "FR-14",
    promptversjon: versjon,
    vurdert: new Date().toISOString().slice(0, 10),
    vurdertAv: "utvikleren",
    passerer: { antall: k, av: n, andel: n ? k / n : 0, intervall95: [lav, hoey], terskel: 0.85, bestaatt: n > 0 && k / n >= 0.85 },
    utenforTeksten: { antall: utenfor, maal: 0, bestaatt: utenfor === 0 },
    sporsmal: sporsmal.map(({ merket, ...q }) => q),
  };
  const malfil = path.join(path.dirname(fil), `fr14-dommer-${versjon}.json`);
  await writeFile(malfil, JSON.stringify(ut, null, 2) + "\n");
  console.log(
    `${malfil}: ${k} av ${n} passerer (${(ut.passerer.andel * 100).toFixed(0)} %, 95 % [${lav.toFixed(2)}, ${hoey.toFixed(2)}]), ` +
      `${utenfor} krever kunnskap utenfor teksten`,
  );
}
