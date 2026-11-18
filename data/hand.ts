/**
 * Venstrehendt — EXPERIENCE.md, Øvekortene (design runde 2, bolk 9).
 *
 * Valget speiler øvekortene, så «Må øve mer» og «Kan» står til venstre.
 * Det lagres i en informasjonskapsel per enhet, som temavalget (data/tema.ts):
 * ingen migrering og ingen tabell. Ren modul uten rammeverkskode, så både
 * rotlayouten og server action kan bruke den, og den kan testes alene.
 */

export type Hand = "venstre";

/** Navnet på informasjonskapselen. */
export const HAND_KAPSEL = "hand";

/** Ett år, i sekunder, som temaet. */
export const HAND_LEVETID = 60 * 60 * 24 * 365;

/**
 * Tolker verdien fra informasjonskapselen eller skjemaet. Bare `venstre`
 * betyr venstrehendt; alt annet (også `hoeyre`, tom streng og ingenting)
 * betyr standardoppsettet, altså null.
 */
export function tolkHand(verdi: unknown): Hand | null {
  return verdi === "venstre" ? verdi : null;
}
