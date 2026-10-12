/**
 * Kontroll av annoteringene, FØR måling.
 *
 *   npm run gullsett:valider
 *
 * ## Hva den finnes for
 *
 * Sammenligningen i FR-8 er følsom for bøyning, fordi `erVerbatim` krever
 * ordrett treff: en modell som svarer grunnformen når teksten har bøyningen
 * får uttrykket forkastet før eleven ser det. Da må annoteringen følge samme
 * krav — annoterer du «mitose» der teksten har «mitosen», kan det treffet
 * ALDRI oppstå, uansett hvor god modellen er.
 *
 * Den feilen er usynlig i et måletall: den ser ut som dårlig gjenkalling. Og
 * den oppdages først etter at man har annotert i to timer. Derfor kjøres
 * denne først.
 *
 * Kontrollen bruker de samme funksjonene appen bruker (AD-1): `erVerbatim` og
 * `finnForekomster`. Den kan altså ikke si «ser bra ut» om noe appen vil
 * forkaste.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { erVerbatim } from "../generatorer/validering";
import { delIAvsnitt, antallOrd } from "../tekst/avsnittsdeling";
import { finnForekomster } from "../tekst/forekomster";

const MAPPE = path.join(process.cwd(), "testdata", "gullsett");

const filer = (await readdir(MAPPE))
  .filter((f) => f.endsWith(".gullsett.json"))
  .sort();

describe("annoteringene, før måling", () => {
  test.each(filer)("%s", async (fil) => {
    const g = JSON.parse(await readFile(path.join(MAPPE, fil), "utf8")) as {
      tekst: string;
      tittel: string;
      annotert: string | null;
      faguttrykk: string[];
    };

    if (g.faguttrykk.length === 0) {
      console.log(`\n= ${fil}: ikke annotert ennå.`);
      return;
    }

    const avsnitt = delIAvsnitt(
      await readFile(path.join(MAPPE, g.tekst), "utf8"),
    );
    const ord = antallOrd(avsnitt);
    const budsjett = Math.max(Math.floor((12 * ord) / 1000), 5);
    const maks = Math.floor(budsjett / 0.75);

    const linjer: string[] = [`\n════════ ${g.tittel}  (${fil})`];
    linjer.push(
      `  ${g.faguttrykk.length} annoterte | ${ord} ord | budsjett ${budsjett} | maks ${maks}`,
    );

    /*
     * 1. STÅR UTTRYKKET ORDRETT I TEKSTEN?
     * Dette er den feilen som koster mest og er vanskeligst å se: et uttrykk
     * som ikke står ordrett kan aldri bli et treff.
     */
    const ikkeVerbatim = g.faguttrykk.filter((u) => !erVerbatim(u, avsnitt));
    if (ikkeVerbatim.length > 0) {
      linjer.push(
        `\n  STÅR IKKE ORDRETT I TEKSTEN (${ikkeVerbatim.length}) — disse kan ALDRI bli treff:`,
      );
      for (const u of ikkeVerbatim) linjer.push(`    «${u}»`);
      linjer.push(
        "  Rett dem: kopiér formen fra .txt-fila framfor å skrive den selv.",
      );
    }

    /*
     * 2. FÅR UTTRYKKET EN MARKERING?
     * Et uttrykk kan stå ordrett og likevel aldri markeres, hvis det bare
     * finnes inni et sammensatt ord — `finnForekomster` krever ordgrenser.
     */
    const utenMarkering = g.faguttrykk.filter(
      (u) => erVerbatim(u, avsnitt) && finnForekomster(u, avsnitt).length === 0,
    );
    if (utenMarkering.length > 0) {
      linjer.push(
        `\n  STÅR BARE I SAMMENSATTE ORD (${utenMarkering.length}) — får ingen markering:`,
      );
      for (const u of utenMarkering) linjer.push(`    «${u}»`);
    }

    /* 3. DUBLETTER etter normalisering. */
    const sett = new Map<string, string[]>();
    for (const u of g.faguttrykk) {
      const n = u.trim().toLowerCase().replace(/\s+/g, " ");
      sett.set(n, [...(sett.get(n) ?? []), u]);
    }
    const dubletter = [...sett.values()].filter((v) => v.length > 1);
    if (dubletter.length > 0) {
      linjer.push(`\n  DUBLETTER (${dubletter.length}):`);
      for (const d of dubletter) linjer.push(`    ${d.join(" / ")}`);
    }

    /*
     * 4. BEGGE FORMER AV SAMME ORD.
     * Står både «metafor» og «metaforer» i annoteringen, teller de som to
     * begreper mot budsjettet — og modellen vil normalt bare finne én av dem,
     * så den andre blir en garantert bom. Det er kanttilfellet der
     * boeyningsregelen faktisk koster noe.
     */
    /*
     * Regelen er at det ene uttrykket er et PREFIKS av det andre: «metafor»
     * er et prefiks av «metaforer». Første utgave grupperte på en stamme
     * regnet ut fra hvert ords egen lengde, og da fikk «metafor» stammen
     * «meta» og «metaforer» stammen «metafo» — de ble ikke sammenlignet, og
     * testen min gikk gjennom med nettopp det paret i seg.
     */
    const norm = (u: string) => u.trim().toLowerCase();
    const toFormer: string[][] = [];
    const sett2 = [...new Set(g.faguttrykk.map(norm))];
    for (let i = 0; i < sett2.length; i++) {
      for (let j = i + 1; j < sett2.length; j++) {
        const [a, b] = [sett2[i], sett2[j]].sort((x, y) => x.length - y.length);
        if (a.length >= 4 && b.startsWith(a)) toFormer.push([a, b]);
      }
    }
    if (toFormer.length > 0) {
      linjer.push(`\n  TO FORMER AV SAMME ORD (${toFormer.length}):`);
      for (const t of toFormer) linjer.push(`    ${t.join(" / ")}`);
      linjer.push(
        "  Velg én. Modellen finner normalt bare den ene, så den andre blir en",
      );
      linjer.push("  garantert bom — og begge teller mot budsjettet.");
    }

    /* 5. BUDSJETTET. */
    if (g.faguttrykk.length > maks) {
      const naabar = Math.min(budsjett, g.faguttrykk.length) / g.faguttrykk.length;
      linjer.push(
        `\n  OVER BUDSJETTET: ${g.faguttrykk.length} annoterte, budsjett ${budsjett}.` +
          `\n  Maks nåbar gjenkalling er ${naabar.toFixed(2)} — terskelen på 0,75 er` +
          `\n  strukturelt utenfor rekkevidde. Kutt til ${maks} eller færre (FR-8).`,
      );
    }

    if (linjer.length === 2) linjer.push("  Ingen innvendinger.");
    console.log(linjer.join("\n"));

    // Harde krav: dette er feil som gjør målingen gal, ikke bare rotete.
    expect(
      ikkeVerbatim,
      `${fil}: uttrykk som ikke står ordrett i teksten kan aldri bli treff`,
    ).toEqual([]);
    expect(g.annotert, `${fil}: sett «annotert» til datoen`).not.toBeNull();
  });
});
