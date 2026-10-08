/**
 * Kontroll av gullsett-tekstene: viser deg teksten slik Lesevenn leser den.
 *
 *   npm run gullsett:sjekk
 *
 * ## Hvorfor dette er en vitest-fil og ikke et .mjs-skript
 *
 * Den må bruke `delIAvsnitt` og `erOverskrift` fra `tekst/avsnittsdeling.ts`,
 * altså den ENE implementasjonen AD-12 krever at alle bruker. En egen kopi i
 * et .mjs-skript ville vært en andre implementasjon, og da kunne kontrollen
 * si «ser bra ut» om en tekst appen deler annerledes. Vitest er det som kjører
 * TypeScript i dette prosjektet, så kontrollen bor her.
 *
 * ## Hva den feiler på, og hva den bare rapporterer
 *
 * Den feiler bare på det som gjør en tekst ubrukelig: ingen avsnitt, eller
 * ingen overskrifter i det hele tatt. Alt annet er rapportert som noe du skal
 * SE PÅ, fordi det er en redaksjonell vurdering om det er feil — en
 * eksempelsetning på egen linje kan være helt riktig i en lærebok.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { antallOrd, delIAvsnitt, erOverskrift } from "../tekst/avsnittsdeling";

const MAPPE = path.join(process.cwd(), "testdata", "gullsett");

/** Ord som avslører en henvisning til noe som ikke lenger står i teksten. */
const PEKER_PAA_BORTE = [
  /\b(figuren?|bildet|illustrasjonen|tabellen|filmen|animasjonen|videoen|grafen)\b/i,
  /\bved siden av\b/i,
  /\b(under|over|nedenfor|ovenfor) (ser|finner|kan) du\b/i,
  /\bse (filmen|videoen|animasjonen|bildet|figur)\b/i,
];

/** Oppgavetekst, som ikke er fagprosa. */
const OPPGAVEPREG =
  /^(Diskuter|Skriv|Finn|Forklar|Velg|Lag|Les |Se nærmere|Hva forbinder|Kan du|Prøv)\b/i;

const filer = (await readdir(MAPPE))
  .filter((f) => f.endsWith(".txt"))
  .sort();

describe("gullsett-tekstene, slik Lesevenn leser dem", () => {
  test.each(filer)("%s", async (fil) => {
    const raa = await readFile(path.join(MAPPE, fil), "utf8");
    const avsnitt = delIAvsnitt(raa);
    const ord = antallOrd(avsnitt);
    const overskrifter = avsnitt.filter((a) => a.erOverskrift);

    const linjer: string[] = [];
    const si = (s: string) => linjer.push(s);

    si(`\n════════ ${fil}`);
    si(
      `  ${avsnitt.length} avsnitt | ${ord} ord | ${raa.length} tegn | ` +
        `${overskrifter.length} overskrifter | begrepsbudsjett ${Math.max(Math.floor((12 * ord) / 1000), 5)}`,
    );

    /*
     * 1. OVERSKRIFTER SOM IKKE BLIR OVERSKRIFTER.
     * `erOverskrift` krever at linja ikke slutter på .!?: — så «Hva er
     * allegori?» leses som brødtekst. Konsekvensen er at aktiveringssiden
     * (FR-5) ikke viser den, og eleven mister tekstens struktur før lesing.
     */
    const tapteOverskrifter = avsnitt.filter(
      (a) =>
        !a.erOverskrift &&
        a.innhold.length <= 100 &&
        /[?:!]$/.test(a.innhold) &&
        !/[.]\s/.test(a.innhold),
    );
    if (tapteOverskrifter.length > 0) {
      si(`\n  SER UT SOM OVERSKRIFT, MEN BLIR BRØDTEKST (${tapteOverskrifter.length}):`);
      si("  Grunn: erOverskrift godtar ikke linjer som slutter på ? : !");
      for (const a of tapteOverskrifter) si(`    ${a.nummer}: «${a.innhold}»`);
    }

    /*
     * 2. BRØDTEKST SOM BLIR OVERSKRIFT.
     * En kort setning uten sluttpunktum leses som overskrift. Da havner den i
     * aktiveringen som om den var en del av tekstens struktur.
     */
    const falskeOverskrifter = overskrifter.filter(
      (a) => a.innhold.split(/\s+/).length > 8,
    );
    if (falskeOverskrifter.length > 0) {
      si(`\n  LEST SOM OVERSKRIFT, MEN ER NOK BRØDTEKST (${falskeOverskrifter.length}):`);
      for (const a of falskeOverskrifter) si(`    ${a.nummer}: «${a.innhold}»`);
    }

    /*
     * 3. HENVISNINGER TIL NOE SOM ER FJERNET.
     * Bilder, figurer, tabeller og videoer er tatt ut, men setningene som
     * peker på dem står igjen. «Ved siden av ser du verdens første
     * røntgenbilde» er da en setning uten referanse — og modellen kan finne
     * «faguttrykk» i en billedtekst som ikke finnes.
     */
    const peker = avsnitt.filter(
      (a) => !a.erOverskrift && PEKER_PAA_BORTE.some((m) => m.test(a.innhold)),
    );
    if (peker.length > 0) {
      si(`\n  PEKER PÅ NOE SOM ER FJERNET (${peker.length}):`);
      for (const a of peker) {
        si(`    ${a.nummer}: «${a.innhold.slice(0, 110)}${a.innhold.length > 110 ? "…" : ""}»`);
      }
    }

    /* 4. OPPGAVETEKST — imperativer og spørsmål, ikke fagprosa. */
    const oppgaver = avsnitt.filter((a) => OPPGAVEPREG.test(a.innhold));
    if (oppgaver.length > 0) {
      si(`\n  OPPGAVEPREG (${oppgaver.length}):`);
      for (const a of oppgaver) si(`    ${a.nummer}: «${a.innhold.slice(0, 90)}…»`);
    }

    /*
     * 5. SVÆRT KORTE AVSNITT.
     * Eksempelsetninger på egen linje er ofte riktig i en lærebok, men de
     * teller som avsnitt og får avsnittsnumre. Blir det mange, blir
     * kildeavsnitt-tallene lite informative.
     */
    const korte = avsnitt.filter(
      (a) => !a.erOverskrift && a.innhold.split(/\s+/).length < 8,
    );
    if (korte.length > 0) {
      si(`\n  AVSNITT PÅ UNDER ÅTTE ORD (${korte.length}):`);
      for (const a of korte.slice(0, 8)) si(`    ${a.nummer}: «${a.innhold}»`);
      if (korte.length > 8) si(`    … og ${korte.length - 8} flere`);
    }

    /* 6. RESTER FRA HTML. */
    const rester = avsnitt.filter((a) =>
      /&[a-z]+;|&#\d|\s{2,}| /.test(a.innhold),
    );
    if (rester.length > 0) {
      si(`\n  HTML-RESTER ELLER DOBLE MELLOMROM (${rester.length}):`);
      for (const a of rester.slice(0, 5)) si(`    ${a.nummer}: «${a.innhold.slice(0, 90)}…»`);
    }

    /* 7. FR-8s tegngrense. */
    if (raa.length < 1500 || raa.length > 7500) {
      si(
        `\n  UTENFOR FR-8s 1 500–7 500 TEGN: ${raa.length}. ` +
          "Om grensen skal justeres eller teksten kuttes er din avgjørelse.",
      );
    }

    console.log(linjer.join("\n"));

    // Harde krav: under dette er teksten ubrukelig, ikke bare rotete.
    expect(avsnitt.length, "ingen avsnitt — mangler teksten blanke linjer?").toBeGreaterThan(1);
    expect(
      overskrifter.length,
      "ingen overskrifter — aktiveringssiden (FR-5) har da ingenting å vise",
    ).toBeGreaterThan(0);
  });
});
