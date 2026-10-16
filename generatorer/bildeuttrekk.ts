/**
 * Bildeuttrekk — FR-44, FR-45.
 *
 * Ett bilde av en bokside inn, teksten ut. Bildet holdes i minnet gjennom
 * kallet og skrives aldri noe sted (AD-16).
 *
 * Uttrekket er bevisst ikke målt i v1 (FR-45): det finnes ingen terskel og
 * ingen påstand om treffsikkerhet, og grensesnittet sier at teksten bør leses
 * ekstra nøye. Sikkerhetsnettet er gjennomsynet i FR-3.
 */

import { z } from "zod";
import { kjoerGenerator } from "./kontrakt";

export const BildeSkjema = z.object({
  lesbar: z.boolean().describe("false om bildet ikke viser lesbar tekst."),
  tekst: z
    .string()
    .describe("Teksten på siden, ordrett, med en tom linje mellom avsnitt og overskrifter på egen linje."),
});

export type Bildetekst = { tekst: string; promptversjon: string; modell: string };

/** BF-1: bildet viser ingen lesbar tekst. Egen klasse, så ruten kan skille den fra BF-5. */
export class IngenTekstIBilde extends Error {
  constructor() {
    super("Det ble ikke funnet tekst i bildet.");
    this.name = "IngenTekstIBilde";
  }
}

/** Under så mange tegn regnes et bilde som uten lesbar tekst (BF-1). */
export const MIN_TEGN_PER_BILDE = 20;

export async function lesTekstFraBilde(bilde: {
  mediaType: "image/jpeg" | "image/png";
  data: string;
}): Promise<Bildetekst> {
  const r = await kjoerGenerator({
    oppgave: "bildeuttrekk",
    skjema: BildeSkjema,
    brukermelding: "Skriv av teksten på denne siden.",
    bilde,
    maksTokens: 8000,
  });
  const tekst = r.data.tekst.trim();
  if (!r.data.lesbar || tekst.length < MIN_TEGN_PER_BILDE) {
    throw new IngenTekstIBilde();
  }
  return { tekst, promptversjon: r.promptversjon, modell: r.modell };
}
