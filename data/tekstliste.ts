/**
 * Tekstlisten på forsiden — FR-36: «kan sorteres på dato og søkes i på tittel».
 *
 * Ren funksjon over en liste som alt er hentet med eierskapet i where-
 * klausulen (AD-8). Søket gjøres her og ikke i SQL fordi listen er én elevs
 * tekster — noen titalls — og fordi samme regel da kan testes uten database.
 */

export type Sortering = "nyest" | "eldst";

export function tolkSortering(v: unknown): Sortering {
  return v === "eldst" ? "eldst" : "nyest";
}

/** Søket er ufølsomt for store og små bokstaver, og hvert ord må finnes. */
export function filtrerTekster<T extends { tittel: string; opprettet: Date }>(
  tekster: T[],
  sok: string,
  sortering: Sortering,
): T[] {
  const ord = sok.toLowerCase().split(/\s+/).filter(Boolean);
  const treff = tekster.filter((t) => ord.every((o) => t.tittel.toLowerCase().includes(o)));
  const retning = sortering === "eldst" ? 1 : -1;
  return [...treff].sort((a, b) => retning * (a.opprettet.getTime() - b.opprettet.getTime()));
}
