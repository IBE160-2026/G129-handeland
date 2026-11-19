/**
 * Grensene og de rene reglene for Mapper — FR-50 og FR-52.
 *
 * Egen fil uten import, som data/grenser.ts, fordi skjemaene i nettleseren
 * også trenger tallene, og ikke skal dra med seg databaseklienten fra
 * data/mapper.ts.
 */

/* ------------------------------------------------------------------ *
 * Grenser — FR-50
 * ------------------------------------------------------------------ */

export const MAPPEGRENSER = {
  /** Mapper per konto. */
  mapper: 20,
  /** Tekster per Mappe. */
  tekster: 8,
  /** Tegn i tittelen. */
  tittel: 80,
} as const;

/**
 * En grense for Mapper er nådd, eller tittelen er ugyldig. Bærer teksten
 * eleven får (§5: hva som skjedde, hvorfor, og hva hun kan gjøre), så
 * handlingene kan vise den direkte.
 */
export class MappeAvvist extends Error {
  constructor(
    readonly melding: string,
    readonly handling: string,
  ) {
    super(melding);
    this.name = "MappeAvvist";
  }
}

export const MAPPE_AVVIST = {
  forMangeMapper: () =>
    new MappeAvvist(
      `Du har ${MAPPEGRENSER.mapper} mapper, og det er flest LeseBuddy tar.`,
      "Grensen holder Samlingen oversiktlig. Slett en mappe du ikke bruker lenger, så kan du lage en ny.",
    ),
  forMangeTekster: () =>
    new MappeAvvist(
      `Mappen har ${MAPPEGRENSER.tekster} tekster, og det er flest en mappe kan ha.`,
      "Grensen holder den samlede quizen kort nok til én økt. Ta ut en tekst, eller lag en ny mappe til resten.",
    ),
  tomTittel: () => new MappeAvvist("Mappen må ha et navn.", "Skriv et navn, for eksempel faget eller prøven."),
  langTittel: (lengde: number) =>
    new MappeAvvist(
      `Navnet er på ${lengde} tegn. En mappe kan hete høyst ${MAPPEGRENSER.tittel} tegn.`,
      "Skriv et kortere navn.",
    ),
};

/** 1–80 tegn etter at mellomrom i endene er tatt bort. Gir tittelen slik den lagres. */
export function tolkTittel(raa: string): string {
  const tittel = raa.trim().replace(/\s+/g, " ");
  if (tittel.length === 0) throw MAPPE_AVVIST.tomTittel();
  if (tittel.length > MAPPEGRENSER.tittel) throw MAPPE_AVVIST.langTittel(tittel.length);
  return tittel;
}

/* ------------------------------------------------------------------ *
 * Quizlengde — FR-52 (beslutning 19.11: eleven velger)
 * ------------------------------------------------------------------ */

export type Quizlengde = "kort" | "middels" | "alle";

export const QUIZLENGDER: Quizlengde[] = ["kort", "middels", "alle"];

/** Hvor mange spørsmål hver Tekst bidrar med. En Quiz har åtte (FR-13). */
export const SPORSMAL_PER_TEKST: Record<Quizlengde, number> = { kort: 2, middels: 4, alle: 8 };

export const LENGDENAVN: Record<Quizlengde, string> = { kort: "Kort", middels: "Middels", alle: "Alle" };

export function tolkLengde(v: unknown): Quizlengde | null {
  return QUIZLENGDER.find((l) => l === v) ?? null;
}

/**
 * Fast og jevnt fordelt utvalg over spørsmålsnumrene: samme lengde gir alltid
 * de samme spørsmålene. Med åtte spørsmål gir 4 nr. 1, 3, 5 og 7, og 2 gir
 * nr. 1 og 5. Har Teksten færre enn antallet, tas alle.
 */
export function velgSporsmal<T extends { nummer: number }>(sporsmal: T[], antall: number): T[] {
  const sortert = [...sporsmal].sort((a, b) => a.nummer - b.nummer);
  if (sortert.length <= antall) return sortert;
  return Array.from({ length: antall }, (_, i) => sortert[Math.floor((i * sortert.length) / antall)]);
}
