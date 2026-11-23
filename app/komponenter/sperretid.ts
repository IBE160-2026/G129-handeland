/**
 * Sperretiden etter for mange innloggingsforsøk — FR-35.
 *
 * Better Auth svarer 429 med `X-Retry-After` i hele sekunder. Rene
 * funksjoner, så de kan testes uten nettleser.
 */

/** Brukes når overskriften mangler eller ikke er et positivt heltall. */
export const STANDARD_SPERRETID = 60;

/** Sekundene i `X-Retry-After`: et heltall ≥ 1, ellers 60. */
export function sekunderFraOverskrift(verdi: string | null | undefined): number {
  if (verdi == null || !/^\s*\d+\s*$/.test(verdi)) return STANDARD_SPERRETID;
  const sek = Number(verdi);
  return Number.isSafeInteger(sek) && sek >= 1 ? sek : STANDARD_SPERRETID;
}

/** «1 sekund» eller «N sekunder». */
export function ventetekst(sek: number): string {
  return sek === 1 ? "1 sekund" : `${sek} sekunder`;
}

/** Meldingen ved 429, i §5-form: hva skjedde, og hva eleven kan gjøre. */
export function sperremelding(sek: number): { melding: string; handling: string } {
  return {
    melding: "For mange forsøk på kort tid.",
    handling: `Vent ${ventetekst(sek)}, og prøv igjen.`,
  };
}

/** Teksten på send-knappen mens sperren står. */
export function knappetekstUnderSperre(sek: number): string {
  return `Vent ${sek} s`;
}

/** Det statusregionen sier én gang når sperren er over. */
export const SPERRE_OVER = "Du kan prøve igjen nå.";

/**
 * Ett tikk i nedtellingen: sekunder som gjenstår til `slutt`, eller
 * `"ferdig"` når tiden er ute. Regnes fra sluttidspunktet, så en fane som
 * har ligget i bakgrunnen viser riktig tall når eleven kommer tilbake.
 */
export function nedtelling(slutt: number, naa: number): number | "ferdig" {
  const sek = Math.ceil((slutt - naa) / 1000);
  return sek > 0 ? sek : "ferdig";
}
