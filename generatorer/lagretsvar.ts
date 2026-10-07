/**
 * Lagrede modellsvar — testmodus.
 *
 * ## Hvorfor dette finnes
 *
 * Nesten alt Lesevenn gjør er språkmodellkall. Uten noe som dette kan appen
 * bare kjøres av den som har en API-nøkkel og betaler for kallene, og
 * kjerneløypen kan ikke demonstreres av noen andre. Det er et reelt problem:
 * en app ingen utenforstående kan kjøre, kan ingen utenforstående vurdere.
 *
 * Testmodus løser det ved å lese svaret fra disk framfor å kalle modellen.
 * Mekanismen er den samme som AD-5 alt bruker til måling: rå modellsvar
 * lagres som filer i repoet, og tall regnes om fra lagrede svar framfor nye
 * kall. Her peker den samme mekanismen mot appen i stedet for harnessen.
 *
 * ## De tre modusene
 *
 *   av      (standard)  modellen kalles
 *   les                 svaret leses fra disk; mangler det, er det en feil
 *   skriv               modellen kalles, og svaret lagres til disk
 *
 * `skriv` er hvordan filene lages: kjør kjerneløypen én gang med en ekte
 * nøkkel, og commit det som havner i `testdata/modellsvar/`. Etterpå kjører
 * `les` den samme løypen gratis, og på presis de samme svarene.
 *
 * ## Hvorfor valideringen fortsatt kjører
 *
 * Et lagret svar går gjennom nøyaktig samme skjemavalidering som et ferskt
 * (AD-11). Det er med vilje: en testmodus som hopper over valideringen ville
 * demonstrert en kodevei som ikke finnes i drift, og da beviser den ingenting.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Testmodus = "av" | "les" | "skriv";

/**
 * Leses ved hvert kall, ikke bufret. Grunnen er testbarhet: en test som setter
 * variabelen skal få effekt uten å laste modulen om. Kostnaden er et oppslag
 * i `process.env` per generatorkall, som er ingenting mot et modellkall.
 */
export function testmodus(): Testmodus {
  const v = process.env.LESEVENN_TESTMODUS?.trim().toLowerCase();
  if (v === "skriv") return "skriv";
  if (v === "les" || v === "1" || v === "true") return "les";
  return "av";
}

const LAGERROT = path.join(process.cwd(), "testdata", "modellsvar");

/**
 * Nøkkelen er et hashsammendrag av oppgave, promptversjon og den fulle
 * brukermeldingen.
 *
 * At promptversjonen er med betyr at en ny promptversjon ikke arver gamle
 * svar. Det er riktig: svaret hører til prompten som produserte det, og et
 * svar lagret under v1 er ikke dokumentasjon på hva v2 gjør.
 *
 * At den fulle brukermeldingen er med betyr at testmodus bare dekker de
 * tekstene det finnes lagrede svar for. Det er en bevisst begrensning framfor
 * en lekkasje: et oppslag som «nesten traff» ville vist et svar som hører til
 * en annen tekst, og det er verre enn en tydelig feilmelding.
 */
export function noekkel(
  oppgave: string,
  promptversjon: string,
  brukermelding: string,
): string {
  return createHash("sha256")
    .update(`${oppgave}\n${promptversjon}\n${brukermelding}`)
    .digest("hex")
    .slice(0, 16);
}

function sti(oppgave: string, n: string): string {
  return path.join(LAGERROT, oppgave, `${n}.json`);
}

type Lagret = {
  oppgave: string;
  promptversjon: string;
  modell: string;
  /** Bare for at et menneske skal kunne se hvilken tekst fila hører til. */
  utdrag: string;
  lagret: string;
  data: unknown;
};

/**
 * Henter et lagret svar, eller `null` om det ikke finnes.
 *
 * Returnerer `null` framfor å kaste, fordi det ikke er denne modulens jobb å
 * avgjøre hva et manglende svar betyr: i `les` er det en feil, i `skriv` er
 * det bare det normale før svaret er lagret.
 */
export async function hentLagret(
  oppgave: string,
  promptversjon: string,
  brukermelding: string,
): Promise<Lagret | null> {
  const n = noekkel(oppgave, promptversjon, brukermelding);
  try {
    const rå = await readFile(sti(oppgave, n), "utf8");
    return JSON.parse(rå) as Lagret;
  } catch {
    return null;
  }
}

/** Lagrer et svar. Overskriver et eksisterende svar med samme nøkkel. */
export async function lagreSvar(
  oppgave: string,
  promptversjon: string,
  modell: string,
  brukermelding: string,
  data: unknown,
): Promise<string> {
  const n = noekkel(oppgave, promptversjon, brukermelding);
  const filsti = sti(oppgave, n);
  await mkdir(path.dirname(filsti), { recursive: true });

  const innhold: Lagret = {
    oppgave,
    promptversjon,
    modell,
    utdrag: brukermelding.slice(0, 200).replace(/\s+/g, " ").trim(),
    lagret: new Date().toISOString(),
    data,
  };

  await writeFile(filsti, `${JSON.stringify(innhold, null, 2)}\n`, "utf8");
  return filsti;
}
