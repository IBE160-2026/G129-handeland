/**
 * AD-12 — den ene avsnittsdelingen.
 *
 * Alle tre innlesingsveiene (liming, PDF, bilde) kaller denne, og
 * måleharnessen skal kalle den samme funksjonen framfor å lage sin egen.
 *
 * Grunnen står i spinen, men er verdt å gjenta her: deler harnessen på
 * linjeskift og appen på tom linje, får samme tekst 48 avsnitt i målingen og
 * 9 i produksjon. Avsnittstesten i FR-21 blir da nesten gratis å bestå i den
 * ene og meningsfull i den andre, og påstanden «det som måles er det brukeren
 * møter» blir usann for forankringen.
 *
 * Funksjonen er ren og deterministisk: samme inndata gir alltid samme
 * avsnittsliste. Den kjenner ikke databasen og ikke rammeverket.
 */

/** Ett avsnitt. Nummeret er 1-basert og i dokumentrekkefølge. */
export type Avsnitt = {
  nummer: number;
  innhold: string;
  erOverskrift: boolean;
};

/**
 * DELINGSREGELEN, normativ:
 *
 * 1. Linjeskift normaliseres til `\n`.
 * 2. Teksten deles i blokker på én eller flere tomme linjer.
 * 3. Innenfor en blokk slås enkle linjeskift sammen til mellomrom. PDF-uttrekk
 *    gir ofte ett linjeskift per visuelle linje, ikke per avsnitt, og uten dette
 *    ville hver tekstlinje blitt et eget avsnitt.
 * 4. Tomme blokker forkastes.
 * 5. En blokk er en OVERSKRIFT når alle disse holder:
 *      - den består av én linje etter sammenslåing
 *      - den er høyst 100 tegn
 *      - den slutter ikke med `.`, `!`, `?` eller `:`
 *    Ellers er den brødtekst.
 *
 * KJENT BEGRENSNING, bevisst: finnes det ingen tomme linjer i teksten i det hele
 * tatt, blir hele teksten ett avsnitt. Det er riktig oppførsel framfor å gjette
 * på setningsgrenser — gjennomsynet i FR-3 fase 3b er der eleven ser resultatet
 * og kan sette inn avsnittsskiller selv. Samme prinsipp som resten av
 * innlesingen: gjør feilen synlig og rettbar framfor smart og stille gal.
 */
export function delIAvsnitt(tekst: string): Avsnitt[] {
  const normalisert = tekst.replace(/\r\n?/g, "\n");

  const blokker = normalisert
    .split(/\n[ \t]*\n+/)
    .map(slaaSammenLinjer)
    .filter((blokk) => blokk.length > 0);

  return blokker.map((innhold, i) => ({
    nummer: i + 1,
    innhold,
    erOverskrift: erOverskrift(innhold),
  }));
}

/** Regel 3: enkle linjeskift innenfor en blokk blir mellomrom. */
function slaaSammenLinjer(blokk: string): string {
  return blokk
    .split("\n")
    .map((linje) => linje.trim())
    .filter((linje) => linje.length > 0)
    .join(" ")
    .trim();
}

/** Regel 5. Eksportert fordi FR-5 og testene trenger den samme vurderingen. */
export function erOverskrift(innhold: string): boolean {
  if (innhold.length === 0) return false;
  if (innhold.length > 100) return false;
  return /[.!?:]$/.test(innhold) === false;
}

/**
 * FR-5: Aktiveringen viser overskriftene og ikke brødteksten.
 * Skilt ut hit slik at ingen flate trenger å gjenta utvalgsregelen.
 */
export function overskrifter(avsnitt: Avsnitt[]): Avsnitt[] {
  return avsnitt.filter((a) => a.erOverskrift);
}

/**
 * FR-7: tetthetstakene regnes på løpende ord. Eksportert her fordi ordtellingen
 * må være den samme i uttrekket, i kappingen og i måleharnessen — tre steder som
 * ellers ville regnet litt ulikt.
 */
export function antallOrd(avsnitt: Avsnitt[]): number {
  return avsnitt.reduce(
    (sum, a) => sum + a.innhold.split(/\s+/).filter((o) => o.length > 0).length,
    0,
  );
}
