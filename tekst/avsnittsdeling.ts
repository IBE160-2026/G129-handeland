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
 *      - den er høyst 100 tegn OG høyst 10 ord
 *      - den slutter ikke med `.` eller `:`
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

/** Høyst så mange ord i en overskrift. Se begrunnelsen under. */
const MAKS_ORD_I_OVERSKRIFT = 10;

/**
 * Regel 5. Eksportert fordi FR-5 og testene trenger den samme vurderingen.
 *
 * ## Hvorfor `?` og `!` er tillatt — endret 8. oktober, etter måling
 *
 * Den første utgaven avviste alt som sluttet på `.`, `!`, `?` eller `:`. Det
 * koster ekte overskrifter, fordi norske lærebokoverskrifter svært ofte er
 * spørsmål: «Hva er allegori?», «Hva er en allusjon?», «Hvorfor modernisme?».
 * Leses de som brødtekst, mister aktiveringssiden i FR-5 tekstens struktur —
 * altså det eleven skal aktivere forkunnskaper ut fra.
 *
 * Målt over Gullsettets seks Tekster gav endringen to ekte overskrifter
 * tilbake, og kostet to blokker: et bibelsitat som FAKTISK er en overskrift i
 * kilden, og én brødtekstsetning på 16 ord.
 *
 * ## Hvorfor ordgrensen kom med samtidig
 *
 * Den siste kostnaden er grunnen. Tegngrensen på 100 slipper gjennom en hel
 * setning — «Under ser du orda som Jacobsen bruker om jeget og duet. Hvilke
 * konnotasjoner vekker disse orda?» er 98 tegn. En overskrift er ikke lang,
 * den er *kort*, og ord er et bedre mål på det enn tegn. Grensen fanger
 * dessuten en feil som alt fantes: SSBs undertittel på elleve ord ble lest som
 * overskrift før denne endringen.
 *
 * `.` og `:` er fortsatt avvisende. Et punktum markerer en setning, og et
 * kolon markerer en innledning til en liste — ingen av dem er overskrifter.
 */
export function erOverskrift(innhold: string): boolean {
  if (innhold.length === 0) return false;
  if (innhold.length > 100) return false;
  if (innhold.split(/\s+/).filter((o) => o.length > 0).length > MAKS_ORD_I_OVERSKRIFT) {
    return false;
  }
  return /[.:]$/.test(innhold) === false;
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
