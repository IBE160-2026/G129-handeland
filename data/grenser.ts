/**
 * Bruksgrensene i PRD §6.4: tallene og feilen som sier at en er nådd.
 *
 * Egen fil uten import, fordi visningene i nettleseren også trenger dem
 * (`app/kifeil.ts`), og ikke skal dra med seg databaseklienten fra
 * `data/forbruk.ts`.
 */

/** Per konto og døgn (norsk tid). Telles fra `tekst.opprettet` og `fagsamtale.opprettet`. */
export const BRUKSGRENSER = {
  tekster: 5,
  samtaler: 5,
} as const;

/** Samlet forbruk for hele appen per døgn, i kroner. Over dette starter ingen nye KI-kall. */
export const DAGSTAK_KRONER = 30;

/**
 * Koden en omdirigering bærer når dagstaket stoppet kallet (`feilkodeFor` i
 * app/kifeil.ts). Siden viser takmeldingen bare om taket fortsatt er nådd
 * (`kodeSomGjelder` i data/forbruk.ts), så en gammel adresse gir ikke
 * meldingen dagen etter.
 */
export const TAK_KODE = "dagstak";

/** Hvilken grense som er nådd: Tekster eller Fagsamtaler for kontoen, eller taket for appen. */
export type Grense = "tekster" | "samtaler" | "taket";

/**
 * EXPERIENCE.md (State Patterns: Bruksgrenser): hva eleven får vite når en
 * grense er nådd. Det eneste stedet tekstene står. Ordlyden er EXPERIENCE.md
 * sin, delt i hva som er nådd (`melding`) og hva eleven kan gjøre
 * (`handling`), som i Feilmelding. `grense` gjør at visningene ikke tilbyr
 * «Prøv igjen», som ikke kan virke før i morgen.
 */
export const GRENSE_FEIL = {
  tekster: {
    melding: `Du har lagt inn ${BRUKSGRENSER.tekster} tekster i dag.`,
    handling: "Du kan legge inn flere i morgen.",
    grense: "tekster",
  },
  samtaler: {
    melding: `Dagens ${BRUKSGRENSER.samtaler} samtaler er brukt.`,
    handling: "Du kan starte en ny i morgen.",
    grense: "samtaler",
  },
  taket: {
    melding: "LeseBuddy har nådd dagens grense for nye oppgaver.",
    handling: "Alt du har laget, kan du fortsatt åpne. Prøv igjen i morgen.",
    grense: "taket",
  },
} as const satisfies Record<Grense, { melding: string; handling: string; grense: Grense }>;

/**
 * Kastes når en grense er nådd, før noe er laget eller kalt. Handlingene
 * oversetter den til meldingen i EXPERIENCE.md (State Patterns: Bruksgrenser)
 * via `somFeil` og `kiFeil` i `app/kifeil.ts`.
 */
export class GrenseNaadd extends Error {
  constructor(readonly grense: Grense) {
    super(`Bruksgrensen «${grense}» er nådd for i dag.`);
    this.name = "GrenseNaadd";
  }
}
