/**
 * Sperretiden etter for mange innloggingsforsøk — FR-35.
 *
 * Better Auth svarer 429 med `X-Retry-After` i hele sekunder. Rene
 * funksjoner, så de kan testes uten nettleser.
 */

/** Brukes når overskriften mangler eller ikke er et positivt heltall. */
export const STANDARD_SPERRETID = 60;

/**
 * Lengste sperre skjemaet viser (10 min). Serverens vindu er 60 s; en feil
 * eller fiendtlig overskrift skal ikke låse skjemaet i dagevis.
 */
export const LENGSTE_SPERRETID = 600;

/** Sekundene i `X-Retry-After`: et heltall fra 1 til 600, ellers 60. */
export function sekunderFraOverskrift(verdi: string | null | undefined): number {
  if (verdi == null || !/^\s*\d+\s*$/.test(verdi)) return STANDARD_SPERRETID;
  const sek = Number(verdi);
  if (!Number.isSafeInteger(sek) || sek < 1) return STANDARD_SPERRETID;
  return Math.min(sek, LENGSTE_SPERRETID);
}

/** Sekundene i et 429-svar fra Better Auth (overskriften `X-Retry-After`). */
export function sekunderFraSvar(svar: Response): number {
  return sekunderFraOverskrift(svar.headers.get("X-Retry-After"));
}

/**
 * Om skjemaet kan sendes: ikke mens et forsøk går, og ikke under sperren.
 * Knappen er bare `aria-disabled` under sperren, og Enter i et felt sender
 * skjemaet uansett, så skjemaet må selv spørre.
 */
export function kanSende({ venter, sperret }: { venter: boolean; sperret: boolean }): boolean {
  return !venter && !sperret;
}

/** «1 sekund» eller «N sekunder». */
export function ventetekst(sek: number): string {
  return sek === 1 ? "1 sekund" : `${sek} sekunder`;
}

/**
 * Meldingen ved 429, i §5-form: hva skjedde, og hva eleven kan gjøre.
 * Uten `sek` (svaret sa ikke hvor lenge, som ved utlogging og sletting)
 * står det «et minutt», ikke et tall serveren ikke har gitt.
 */
export function sperremelding(sek?: number): { melding: string; handling: string } {
  return {
    melding: "For mange forsøk på kort tid.",
    handling:
      sek === undefined
        ? "Vent et minutt, og prøv igjen."
        : `Vent ${ventetekst(sek)}, og prøv igjen.`,
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
