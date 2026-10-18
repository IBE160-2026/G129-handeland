/**
 * Quiz-gullsettet — FR-14: 24 genererte spørsmål til manuell vurdering.
 *
 *   npm run maal:fr14              regner om fra lagrede modellsvar, gratis
 *   npm run maal:fr14:ferskt       kaller modellen og lagrer svarene
 *
 * FR-14: «Måles på et Gullsett av 24 genererte spørsmål (tre Tekster × åtte
 * spørsmål), manuelt vurdert av utvikleren: minst 85 prosent passerer
 * forankringskravet.» Intervallet skal rapporteres sammen med andelen.
 *
 * Koden lager quizene med samme funksjon som appen (AD-1) og skriver
 * vurderingsarket. Utvikleren vurderer.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import { describe, expect, test } from "vitest";

// Se maal-faguttrykk.test.ts: testmodus avgjøres før .env.local lastes.
const modusFraKommandolinjen = process.env.LESEVENN_TESTMODUS;
config({ path: ".env.local" });
process.env.LESEVENN_TESTMODUS = modusFraKommandolinjen ?? "les";

import { genererQuiz, type Quizresultat } from "../generatorer/quiz";
import { delIAvsnitt } from "../tekst/avsnittsdeling";

/**
 * Tre av FR-8-tekstene: ulike fag, både fokusert tekst og oversikt. Andre
 * enn de fire i FR-28, så quizvurderingen ikke farges av at utvikleren alt
 * har lest tekstene nøye. Endres her.
 */
export const TEKSTER = ["naturfag-em-bolger", "norsk-sprakligebilder", "teknologi-domeneoppbygning"];
const MAPPE = path.join(process.cwd(), "testdata", "gullsett");
const RESULTATER = path.join(process.cwd(), "maaling", "resultater");

describe("FR-14 — 24 quizspørsmål til vurdering", () => {
  const quizer: { tekst: string; tittel: string; r: Quizresultat; avsnitt: Map<number, string> }[] = [];

  test.each(TEKSTER)("%s", { timeout: 180000 }, async (navn) => {
    const raa = await readFile(path.join(MAPPE, `${navn}.txt`), "utf8");
    const meta = JSON.parse(await readFile(path.join(MAPPE, `${navn}.meta.json`), "utf8")) as { tittel: string };
    const avsnitt = delIAvsnitt(raa);
    const r = await genererQuiz(avsnitt);
    quizer.push({ tekst: navn, tittel: meta.tittel, r, avsnitt: new Map(avsnitt.map((a) => [a.nummer, a.innhold])) });
    console.log(
      `\n= ${navn}: ${r.sporsmal.length} spørsmål, ${r.forkastet.length} forkastet` +
        (r.udekkedeDeler.length ? `, udekkede deler: ${r.udekkedeDeler.join(", ")}` : ""),
    );
  });

  test("vurderingsarket", async () => {
    expect(quizer).toHaveLength(TEKSTER.length);
    quizer.sort((a, b) => TEKSTER.indexOf(a.tekst) - TEKSTER.indexOf(b.tekst));
    const versjon = quizer[0].r.promptversjon;
    const deler = [
      `# Vurderingsark — quiz (FR-14), prompt ${versjon}`,
      "",
      "Kravet: hvert spørsmål kan besvares fra teksten alene, og for flervalg støttes **nøyaktig ett** alternativ av teksten — de andre er gale ut fra teksten, ikke bare mindre gode. Terskel: **minst 85 prosent** av de 24 passerer. Ingen spørsmål som krever kunnskap utenfor teksten tolereres i det som vises eleven.",
      "",
      "For hvert spørsmål, svar på tre ting:",
      "",
      "- **A. Det riktige svaret støttes av teksten** (se kildeavsnittet under spørsmålet).",
      "- **B. De gale alternativene er gale ut fra teksten** — ikke bare mindre gode. Gjelder bare flervalg.",
      "- **C. Spørsmålet krever kunnskap utenfor teksten.**",
      "",
      "Et spørsmål **passerer** når A er ja, B er ja (eller ikke aktuelt), og C er nei. Skriv kort hva som er galt i kommentaren.",
      "",
    ];
    let n = 0;
    for (const q of quizer) {
      deler.push("---", "", `## ${q.tittel}`, "", `Tekst: \`testdata/gullsett/${q.tekst}.txt\``, "");
      for (const s of q.r.sporsmal) {
        n++;
        deler.push(`### ${n}. ${s.sporsmal} _(${s.erFlervalg ? "flervalg" : "kortsvar"})_`, "");
        if (s.erFlervalg) {
          for (const a of s.alternativer) deler.push(`- ${a === s.riktigSvar ? "**✓ " + a + "**" : a}`);
        } else {
          deler.push(`Eksempelsvar: ${s.riktigSvar}`);
        }
        deler.push(
          "",
          `> **Avsnitt ${s.kildeavsnittNummer}:** ${q.avsnitt.get(s.kildeavsnittNummer) ?? "(finnes ikke)"}`,
          "",
          `**A** ☐ ja ☐ nei · **B** ${s.erFlervalg ? "☐ ja ☐ nei" : "ikke aktuelt"} · **C** ☐ ja ☐ nei · **Passerer** ☐ ja ☐ nei`,
          "",
          "**Kommentar:**",
          "",
        );
      }
    }
    deler.push(
      "---",
      "",
      `**Passerer:** ____ av ${n}  ·  **Krever kunnskap utenfor teksten (C = ja):** ____ (mål 0)`,
      "",
      "Når arket er fylt ut, regner Claude andelen og konfidensintervallet (FR-14 krever begge).",
      "",
    );
    await mkdir(RESULTATER, { recursive: true });
    await writeFile(path.join(RESULTATER, `fr14-vurderingsark-${versjon}.md`), deler.join("\n"));
    await writeFile(
      path.join(RESULTATER, `fr14-quiz-${versjon}.json`),
      JSON.stringify({ krav: "FR-14", quizer: quizer.map((q) => ({ tekst: q.tekst, ...q.r })) }, null, 2) + "\n",
    );
  });
});
