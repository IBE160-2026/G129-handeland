/**
 * Gullsettet for FR-31 — ti genererte vers til manuell vurdering.
 *
 *   npm run maal:fr31              regner om fra lagrede modellsvar, gratis
 *   npm run maal:fr31:ferskt       kaller modellen og lagrer svarene
 *
 * FR-31: «Ingen påstand i verset motsier Teksten. Måles på et Gullsett av 10
 * genererte vers, manuelt vurdert av utvikleren: antall usanne påstander i
 * det som vises eleven er null.» Koden lager versene og vurderingsarket. Det
 * er utvikleren som teller.
 *
 * Fagordene er Gullsettets (FR-8), uten forklaring. Uttrekket kjøres ikke
 * her: i skrivemodus ville det overskrevet de lagrede FR-8-svarene.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import { describe, expect, test } from "vitest";

// Se maal-faguttrykk.test.ts: testmodus avgjøres før .env.local lastes.
const modusFraKommandolinjen = process.env.LESEVENN_TESTMODUS;
config({ path: ".env.local" });
process.env.LESEVENN_TESTMODUS = modusFraKommandolinjen ?? "les";

import { lagMinnevers, type Minneversresultat, type Versform } from "../generatorer/minnevers";
import { delIAvsnitt } from "../tekst/avsnittsdeling";

const TEKSTER = [
  "naturfag-em-bolger",
  "samfunnsfag-prisvekst",
  "norsk-metafor",
  "teknologi-domeneoppbygning",
  "teknologi-operativsystem",
];
const FORMER: Versform[] = ["vers", "suno"];
const MAPPE = path.join(process.cwd(), "testdata", "gullsett");
const RESULTATER = path.join(process.cwd(), "maaling", "resultater");

const tilfeller = TEKSTER.flatMap((t) => FORMER.map((f) => [t, f] as const));

describe("FR-31 — ti vers til vurdering", () => {
  const vers: { tekst: string; tittel: string; r: Minneversresultat }[] = [];

  test.each(tilfeller)("%s (%s)", { timeout: 120000 }, async (navn, form) => {
    const raa = await readFile(path.join(MAPPE, `${navn}.txt`), "utf8");
    const gull = JSON.parse(await readFile(path.join(MAPPE, `${navn}.runde1.gullsett.json`), "utf8")) as {
      tittel: string;
      faguttrykk: string[];
    };
    // Et vers generatoren avviser, vises aldri eleven. Årsaken skrives ut, så
    // avvisningen kan føres i KI-loggen, og tilfellet feiler.
    const r = await lagMinnevers({
      avsnitt: delIAvsnitt(raa),
      begreper: gull.faguttrykk.map((uttrykk) => ({ uttrykk: uttrykk.trim(), forklaring: "" })),
      form,
    }).catch((e: Error) => {
      console.log(`
= ${navn} (${form}): AVVIST — ${e.message}${e.cause instanceof Error ? ` (${e.cause.message})` : ""}`);
      throw e;
    });
    vers.push({ tekst: navn, tittel: gull.tittel, r });
    console.log(`\n= ${navn} (${form}): ${r.linjer.length} linjer, fagord: ${r.faguttrykk.join(", ")}`);
  });

  test("vurderingsarket", async () => {
    expect(vers).toHaveLength(10);
    vers.sort((a, b) => tilfeller.findIndex(([t, f]) => t === a.tekst && f === a.r.form) - tilfeller.findIndex(([t, f]) => t === b.tekst && f === b.r.form));
    const deler = [
      "# Vurderingsark — minnevers (FR-31)",
      "",
      "Kravet: **ingen påstand i verset motsier Teksten.** Måltall: null usanne påstander i de ti versene.",
      "",
      "For hvert vers: les det mot teksten (lenket under), og tell påstandene som er usanne eller ikke står i teksten. En forenkling som fortsatt er riktig, er ikke en usann påstand. Skriv funnet i kommentarfeltet — det brukes til å stramme prompten.",
      "",
    ];
    vers.forEach((v, i) => {
      deler.push(
        "---",
        "",
        `## ${i + 1}. ${v.tittel} — ${v.r.form === "suno" ? "Suno-prompt" : "vers"}`,
        "",
        `Tekst: \`testdata/gullsett/${v.tekst}.txt\` · fagord i verset: ${v.r.faguttrykk.join(", ")}`,
        "",
        ...(v.r.form === "suno" ? [`Stil: \`${v.r.stil}\``, ""] : []),
        ...v.r.linjer.map((l) => `> ${l}  `),
        "",
        "**Usanne påstander:** ____  **Kommentar:**",
        "",
      );
    });
    deler.push("---", "", "**Sum usanne påstander:** ____ av mål 0", "");
    await mkdir(RESULTATER, { recursive: true });
    await writeFile(path.join(RESULTATER, "fr31-vurderingsark.md"), deler.join("\n"));
    await writeFile(
      path.join(RESULTATER, "fr31-vers.json"),
      JSON.stringify({ krav: "FR-31", vers: vers.map((v) => ({ tekst: v.tekst, ...v.r })) }, null, 2) + "\n",
    );
  });
});
