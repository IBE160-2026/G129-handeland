/**
 * «Steg n av N» øverst på sidene i løypen.
 *
 * Innlimt tekst har ikke gjennomsynet (FR-3, endret 11.11.2026), og har derfor
 * tre steg; PDF og bilde har fire. Uten dette hoppet en innlimt tekst fra
 * «Steg 1 av 4» rett til «Steg 3 av 4».
 */

import type { NyTekst } from "../data/tilgang";

/** Samme union som databasens innlesingsvei, hentet derfra så de ikke kan skille lag. */
export type Vei = NyTekst["vei"];
export type Steg = "aktivering" | "gjennomsyn" | "lesing" | "oppgaver";

const MED_GJENNOMSYN: Steg[] = ["aktivering", "gjennomsyn", "lesing", "oppgaver"];
const UTEN_GJENNOMSYN: Steg[] = ["aktivering", "lesing", "oppgaver"];

export function stegtekst(vei: Vei, steg: Steg): string {
  // En innlimt tekst fra før endringen kan stå i gjennomsynet; da teller den fire.
  const rekke = vei === "liming" && steg !== "gjennomsyn" ? UTEN_GJENNOMSYN : MED_GJENNOMSYN;
  return `Steg ${rekke.indexOf(steg) + 1} av ${rekke.length}`;
}
