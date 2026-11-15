/**
 * Lys eller mørk modus — EXPERIENCE.md, Gjelder overalt (bolk 4).
 *
 * Valget lagres i en informasjonskapsel per enhet, ikke på kontoen: ingen
 * migrering og ingen tabell (avveining godkjent 15.11). Ren modul uten
 * rammeverkskode, så både rotlayouten og server action kan bruke den, og den
 * kan testes alene.
 */

export type Tema = "lys" | "moerk";

/** Navnet på informasjonskapselen. */
export const TEMA_KAPSEL = "tema";

/** Ett år, i sekunder. */
export const TEMA_LEVETID = 60 * 60 * 24 * 365;

/**
 * Tolker verdien fra informasjonskapselen eller skjemaet. Alt annet enn
 * `lys` og `moerk` (også `rosa`, tom streng og ingenting) betyr «Følg
 * enheten», altså null.
 */
export function tolkTema(verdi: unknown): Tema | null {
  return verdi === "lys" || verdi === "moerk" ? verdi : null;
}
