/**
 * Vilkår og aldersgrense ved registrering (FR-35, FR-53).
 *
 * Egen fil, som `invitasjon.ts`, fordi registreringsskjemaet kjører i
 * nettleseren og ikke kan importere data/auth.ts. Siden (`/vilkaar`),
 * skjemaet og serveren bruker de samme konstantene, så versjonen bare står
 * ett sted.
 *
 * Behandlingsgrunnlaget er avtale (GDPR art. 6(1)(b)), ikke samtykke.
 * Avkrysningene er elevens bekreftelse på at hun er 15 eller eldre og har
 * fått informasjonen. Ingen alder eller fødselsdato lagres, bare at, når og
 * hvilken versjon (tabellen `vilkaarsbekreftelse`).
 */

/**
 * Gjeldende versjon av «Vilkår og personvern», som dato. Endres teksten på
 * `/vilkaar`, endres denne, og registreringer med den gamle avvises med
 * «Vilkårene er endret» (et skjema lastet før endringen sender den gamle).
 */
export const VILKAARSVERSJON = "2026-11-20";

/** Header med `ja` når eleven har krysset av for «Jeg er 15 år eller eldre». */
export const ALDER_HEADER = "x-lesevenn-alder-15";

/** Header med vilkårsversjonen eleven krysset av for. */
export const VILKAAR_HEADER = "x-lesevenn-vilkaarsversjon";

/** Verdien i `ALDER_HEADER` som betyr at alderen er bekreftet. */
export const ALDER_BEKREFTET = "ja";

/**
 * Behandlingsansvarlig og kontakt, slik de står på `/vilkaar`. Arves eget
 * valg 19.11.2026; siden er offentlig. Står bare her, så den kan byttes.
 */
export const BEHANDLINGSANSVARLIG = "Arve Handeland";
export const KONTAKT_EPOST = "arvehand@gmail.com";

/** Feilkodene serveren svarer med, og som skjemaet oversetter (§5). */
export const VILKAAR_FEIL = {
  alder: "ALDER_IKKE_BEKREFTET",
  vilkaar: "VILKAAR_IKKE_GODTATT",
  endret: "VILKAAR_ENDRET",
} as const;
