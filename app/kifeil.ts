/**
 * PRD §5, FR-7, FR-13, FR-19 og FR-20: hva eleven får vite når et KI-kall har
 * feilet etter det ene nye forsøket i `kjoerGenerator`.
 *
 * Hver melding sier hva som ikke ble laget og hva som er lagret, og vises med
 * «Prøv igjen» (Feilmelding). Ordlyden i FR-19 er PRD-ens egen.
 *
 * Egen fil fordi både handlingene (`handlinger.ts`, som bare kan eksportere
 * async-funksjoner) og visningene trenger tekstene. Rene funksjoner, og
 * importen fra generatorlaget er bare `generatorer/feil.ts`, som er uten
 * SDK og filsystem, så klientkoden kan bruke fila.
 */

import { FASTE_TEKSTER, FEILKODER, GeneratorFeil, kanProevesPaaNytt, type Feilkode } from "../generatorer/feil";
import { GRENSE_FEIL, GrenseNaadd, TAK_KODE, type Grense } from "../data/grenser";

/**
 * `grense`: meldingen gjelder en bruksgrense (PRD §6.4). Da viser
 * Feilmelding ingen «Prøv igjen», fordi et nytt trykk ikke kan virke før i
 * morgen, og en knapp som aldri virker, er en blindvei med et skilt på.
 */
export type Feiltekst = { melding: string; handling: string; grense?: Grense };

// Grensetekstene (`GRENSE_FEIL`) står i data/grenser.ts, det eneste stedet.

export { TAK_KODE };

/** Når kallet til handlingen ikke kom fram (nettet borte). Ikke en KI-feil. */
export const NETTFEIL: Feiltekst = {
  melding: "Svaret kom ikke fram.",
  handling: "Sjekk nettet og prøv igjen.",
};

const UKJENT_FEIL: Feiltekst = {
  melding: "Noe gikk galt hos oss.",
  handling: "Prøv igjen. Står det ved, er det en feil vi må rette.",
};

/**
 * Oversetter en feil til elevrettet form. En GeneratorFeil bærer sin egen
 * melding; alt annet får en generell, som aldri er en teknisk feilmelding.
 *
 * Grunnen til at dette er en egen funksjon er at §5-kravet ellers måtte
 * gjentas i hver handling som kaller en generator — og da ville den første
 * som ble glemt gitt eleven en teknisk feilmelding.
 */
export function somFeil(e: unknown): { feil: Feiltekst } {
  if (e instanceof GrenseNaadd) return { feil: GRENSE_FEIL[e.grense] };
  if (e instanceof GeneratorFeil) return { feil: { melding: e.elevmelding, handling: e.anbefaltHandling } };
  return { feil: UKJENT_FEIL };
}

/**
 * PRD §5, FR-7, FR-13, FR-19 og FR-20: har modellkallet feilet også etter det
 * nye forsøket i `kjoerGenerator`, får eleven funksjonens egen melding — hva
 * som ikke ble laget, og hva som er lagret. De andre feilene (avslått tilgang,
 * 429, en feil forespørsel, testmodus) beholder sin egen melding, fordi rådet
 * der er et annet.
 */
export function kiFeil(e: unknown, melding: Feiltekst): { feil: Feiltekst } {
  if (e instanceof GeneratorFeil && kanProevesPaaNytt(e.kode)) return { feil: melding };
  return somFeil(e);
}

/** Koden en omdirigering bærer, når feilen ikke er en GeneratorFeil (for eksempel databasen). */
export const UKJENT_KODE = "ukjent";

/** Koden som sendes videre i en omdirigering, så siden kan vise riktig melding (`feiltekstForKode`). */
export function feilkodeFor(e: unknown): Feilkode | typeof UKJENT_KODE | typeof TAK_KODE {
  if (e instanceof GrenseNaadd && e.grense === "taket") return TAK_KODE;
  return e instanceof GeneratorFeil ? e.kode : UKJENT_KODE;
}

/**
 * Meldingen en side viser når bare koden kom fram i adressen. Koder som
 * prøves på nytt (og en kode som mangler eller er ukjent for adressen), gir
 * funksjonens standardmelding. Ellers sier første linje fortsatt hva som ikke
 * ble laget, og rådet er feilens eget. Stoppet dagstaket kallet, er det
 * takmeldingen (PRD §6.4).
 */
export function feiltekstForKode(standard: Feiltekst, kode: string | undefined): Feiltekst {
  if (kode === TAK_KODE) return GRENSE_FEIL.taket;
  if (kode === UKJENT_KODE) return { melding: standard.melding, handling: UKJENT_FEIL.handling };
  const k = FEILKODER.find((x) => x === kode);
  if (!k || kanProevesPaaNytt(k)) return standard;
  const t = FASTE_TEKSTER[k as keyof typeof FASTE_TEKSTER];
  return { melding: standard.melding, handling: `${t.elevmelding} ${t.anbefaltHandling}` };
}

export const KI_FEIL = {
  /** FR-7: Teksten og Aktiveringen er lagret. */
  fagord: {
    melding: "Fagordene kunne ikke lages nå.",
    handling:
      "Teksten og det du skrev før du leste, er lagret. Trykk «Prøv igjen», eller les teksten uten markeringer i mellomtiden.",
  },
  /** FR-13: ingen Quiz lagres fra et mislykket kall. */
  quiz: {
    melding: "Quizen kunne ikke lages nå.",
    handling: "Ingen quiz er lagret ennå. Trykk «Prøv igjen», så lager Buddy den på nytt.",
  },
  /** FR-19: svaret ligger i databasen, og runden telles ikke. */
  vurdering: {
    melding: "Vurderingen feilet. Svaret ditt er lagret.",
    handling: "Trykk «Prøv igjen», så leser Buddy svaret ditt på nytt. Runden teller ikke før svaret er vurdert.",
  },
  /** FR-20: vurderingen beholdes, og samtalen avsluttes ikke. */
  oppfolging: {
    melding: "Neste spørsmål kunne ikke lages nå. Svaret ditt og vurderingen er lagret.",
    handling: "Trykk «Prøv igjen» for å få neste spørsmål. Samtalen er fortsatt åpen.",
  },
} as const satisfies Record<string, Feiltekst>;
