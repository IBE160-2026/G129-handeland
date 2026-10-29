/**
 * Forklaringene til Faguttrykkene — FR-8, «Forklaringenes riktighet».
 *
 *   npm run maal:fr8-forklaringer     lager vurderingsarket fra lagrede modellsvar, gratis
 *   MAAL_PROMPTVERSJON=v4 …            samme for en kandidatversjon (AD-14), før den forfremmes
 *
 * FR-8: «utvikleren vurderer manuelt om forklaringen til hvert Faguttrykk i
 * Gullsettet er faglig riktig og i samsvar med Kildeavsnittet. Antall gale
 * forklaringer i det som vises eleven: null.» Presisjon og gjenkalling måler
 * bare hvilke uttrykk som ble funnet; dette arket er for det som står om dem.
 *
 * Bruker `hentFaguttrykk` med samme selvkonsistens og kapping som appen
 * (AD-1), så arket viser det eleven faktisk ser. Kjøres bare i les-modus:
 * nye kall ville gitt andre forklaringer enn dem FR-8-tallene gjelder for.
 */

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";

process.env.LESEVENN_TESTMODUS = "les";

import { hentFaguttrykk, type Faguttrykksresultat } from "../generatorer/faguttrykk";
import { delIAvsnitt } from "../tekst/avsnittsdeling";

const MAPPE = path.join(process.cwd(), "testdata", "gullsett");
const RESULTATER = path.join(process.cwd(), "maaling", "resultater");
const PROMPTVERSJON = process.env.MAAL_PROMPTVERSJON || undefined;

const filer = (await readdir(MAPPE)).filter((f) => f.endsWith(".runde1.gullsett.json")).sort();

describe("FR-8 — forklaringene til vurdering", () => {
  const tekster: { tekst: string; tittel: string; r: Faguttrykksresultat; avsnitt: Map<number, string> }[] = [];

  test.each(filer)("%s", { timeout: 60000 }, async (fil) => {
    const gull = JSON.parse(await readFile(path.join(MAPPE, fil), "utf8")) as { tekst: string; tittel: string };
    const avsnitt = delIAvsnitt(await readFile(path.join(MAPPE, gull.tekst), "utf8"));
    const r = await hentFaguttrykk(avsnitt, { overstyrVersjon: PROMPTVERSJON });
    tekster.push({ tekst: gull.tekst, tittel: gull.tittel, r, avsnitt: new Map(avsnitt.map((a) => [a.nummer, a.innhold])) });
    console.log(`\n= ${gull.tittel}: ${r.begreper.length} forklaringer`);
  });

  test("vurderingsarket", async () => {
    expect(tekster.length).toBe(filer.length);
    tekster.sort((a, b) => a.tekst.localeCompare(b.tekst));
    const versjon = tekster[0].r.promptversjon;
    const antall = tekster.reduce((n, t) => n + t.r.begreper.length, 0);
    let nr = 0;
    const deler = [
      `# Vurderingsark — forklaringene til fagordene (FR-8), prompt ${versjon}`,
      "",
      "Kravet: **null faglig gale forklaringer** i det som vises eleven. Dette er en gjennomgang av leveransen, ikke en statistisk terskel: forklaringene er det eleven pugger på øvekortene, og en gal forklaring pugges like godt som en riktig.",
      "",
      `Arket viser de ${antall} fagordene appen leverer for de seks tekstene, etter selvkonsistens og kapping — det eleven ser. For hver forklaring:`,
      "",
      "- **Vurdering:** `riktig`, `gal` (motsier teksten eller faget) eller `misvisende` (riktig ord for ord, men gir eleven et galt bilde). En forenkling som fortsatt er riktig, er riktig.",
      "- **Kommentar:** bare ved gal eller misvisende — hva som er galt, og hva teksten sier.",
      "",
      "Kildeavsnittet står under forklaringen. Forklaringen skal stemme med det, men kan bruke vanlig fagkunnskap så lenge den ikke motsier teksten.",
      "",
    ];
    for (const t of tekster) {
      deler.push("---", "", `## ${t.tittel}`, "", `Tekst: \`testdata/gullsett/${t.tekst}\``, "");
      for (const b of t.r.begreper) {
        nr++;
        deler.push(
          `### ${nr}. ${b.uttrykk}`,
          "",
          `> ${b.forklaring}`,
          "",
          `<details><summary>Avsnitt ${b.kildeavsnittNummer}</summary>`,
          "",
          t.avsnitt.get(b.kildeavsnittNummer) ?? "(finnes ikke)",
          "",
          "</details>",
          "",
          "**Vurdering:** ☐ riktig ☐ gal ☐ misvisende",
          "",
          "**Kommentar:**",
          "",
        );
      }
    }
    deler.push("---", "", `**Sum:** ____ riktig · ____ gal · ____ misvisende av ${antall}  ·  **Krav:** 0 gale`, "");

    await mkdir(RESULTATER, { recursive: true });
    await writeFile(path.join(RESULTATER, `fr8-forklaringer-vurderingsark-${versjon}.md`), deler.join("\n"));
    await writeFile(
      path.join(RESULTATER, `fr8-forklaringer-${versjon}.json`),
      JSON.stringify(
        {
          krav: "FR-8, forklaringenes riktighet",
          promptversjon: versjon,
          modell: tekster[0].r.modell,
          tekster: tekster.map((t) => ({
            tekst: t.tekst,
            begreper: t.r.begreper.map((b) => ({ uttrykk: b.uttrykk, forklaring: b.forklaring, kildeavsnitt: b.kildeavsnittNummer })),
          })),
        },
        null,
        2,
      ) + "\n",
    );
  });
});
