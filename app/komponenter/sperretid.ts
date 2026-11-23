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
