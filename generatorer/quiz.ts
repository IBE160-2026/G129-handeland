/**
 * Quizgenerering — FR-13 og FR-14.
 *
 * Modellen lager TI kandidater, og koden velger åtte. Grunnen er at FR-13 har
 * krav til hele settet — åtte spørsmål, minst fem flervalg, minst ett
 * kortsvar, alle deler av teksten dekket — og et sett på nøyaktig åtte der
 * ett spørsmål forkastes, oppfyller ikke lenger kravene. Med ti å velge fra
 * tåler settet at noen faller ut, og valget gjøres av kode som kan testes,
 * ikke av modellen.
 *
 * Valideringen følger AD-11: et spørsmål som bryter et formkrav, er et
 * elementbrudd og forkastes. At det etterpå er for få igjen, er et settbrudd,
 * og da sier generatoren fra framfor å levere en quiz som ikke er en quiz.
 *
 * Det koden IKKE kan sjekke, er FR-14s kjerne: at det riktige alternativet
 * faktisk støttes av teksten og at de gale er gale. Det krever en leser, og
 * måles manuelt på Quiz-gullsettet (24 spørsmål, M1).
 */

import { randomInt } from "node:crypto";
import { z } from "zod";
import type { Avsnitt } from "../tekst/avsnittsdeling";
import {
  GeneratorFeil,
  formaterAvsnitt,
  kjoerGenerator,
} from "./kontrakt";

export const QuizSkjema = z.object({
  sporsmal: z
    .array(
      z.object({
        type: z
          .enum(["flervalg", "kortsvar"])
          .describe("flervalg har fire alternativer; kortsvar besvares med egne ord."),
        sporsmal: z.string().describe("Spørsmålet, på klar og enkel norsk."),
        alternativer: z
          .array(z.string())
          .describe("Nøyaktig fire ved flervalg. Tom liste ved kortsvar."),
        riktigSvar: z
          .string()
          .describe(
            "Ved flervalg: det riktige alternativet, ordrett likt det i alternativer. Ved kortsvar: et eksempelsvar på én eller to setninger.",
          ),
        kildeavsnitt: z
          .number()
          .int()
          .describe("Nummeret på avsnittet der svaret står. Aldri en overskrift."),
      }),
    )
    .describe("Ti spørsmål, det beste først."),
});

type Kandidat = z.infer<typeof QuizSkjema>["sporsmal"][number];

/** FR-13. */
export const ANTALL_SPORSMAL = 8;
export const MINST_FLERVALG = 5;
export const MINST_KORTSVAR = 1;
/** Dekningskravet i FR-13 gjelder bare tekster med så mange deler eller færre. */
export const MAKS_DELER_MED_DEKNINGSKRAV = 4;

export type QuizSporsmal = {
  erFlervalg: boolean;
  sporsmal: string;
  /** Fire ved flervalg, i tilfeldig rekkefølge. Tom ved kortsvar. */
  alternativer: string[];
  /** Ved flervalg: ett av alternativene. Ved kortsvar: eksempelsvaret. */
  riktigSvar: string;
  kildeavsnittNummer: number;
};

export type Quizresultat = {
  sporsmal: QuizSporsmal[];
  /** Hvorfor kandidater ble forkastet. Rapporteres, ikke skjules (AD-11). */
  forkastet: { sporsmal: string; grunn: string }[];
  /**
   * Deler av teksten uten spørsmål, når dekningskravet gjelder. Tom når
   * kravet er oppfylt. Rapporteres framfor å felle quizen: et sett med åtte
   * gode spørsmål er mer verdt for eleven enn ingen quiz.
   */
  udekkedeDeler: number[];
  promptversjon: string;
  modell: string;
};

/* ------------------------------------------------------------------ *
 * Tekstens deler
 * ------------------------------------------------------------------ */

/**
 * Hvilken del hvert avsnitt hører til. En del begynner ved en overskrift;
 * brødtekst før første overskrift er en egen del. Bare deler med brødtekst
 * telles — en overskrift uten noe under har ingenting å spørre om.
 */
export function delerITeksten(avsnitt: Avsnitt[]): Map<number, number> {
  const delFor = new Map<number, number>();
  let del = 0;
  let harBroedtekst = false;
  for (const a of avsnitt) {
    if (a.erOverskrift) {
      if (harBroedtekst) del++;
      harBroedtekst = false;
      continue;
    }
    delFor.set(a.nummer, del);
    harBroedtekst = true;
  }
  return delFor;
}

/* ------------------------------------------------------------------ *
 * Validering — elementbrudd (AD-11)
 * ------------------------------------------------------------------ */

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Grunnen til at en kandidat forkastes, eller `null` om den holder. */
export function grunnTilForkasting(
  k: Kandidat,
  brodtekstNumre: Set<number>,
  alleNumre: Set<number>,
): string | null {
  if (k.sporsmal.trim().length === 0) return "tomt spørsmål";
  if (!alleNumre.has(k.kildeavsnitt)) {
    return `kildeavsnitt ${k.kildeavsnitt} finnes ikke i teksten`;
  }
  if (!brodtekstNumre.has(k.kildeavsnitt)) {
    return `kildeavsnitt ${k.kildeavsnitt} er en overskrift`;
  }
  if (k.riktigSvar.trim().length === 0) return "mangler riktig svar";

  if (k.type === "flervalg") {
    if (k.alternativer.length !== 4) {
      return `har ${k.alternativer.length} alternativer, ikke fire`;
    }
    if (k.alternativer.some((a) => a.trim().length === 0)) return "tomt alternativ";
    if (new Set(k.alternativer.map(norm)).size !== 4) return "to like alternativer";
    const treff = k.alternativer.filter((a) => a.trim() === k.riktigSvar.trim());
    if (treff.length !== 1) return "det riktige svaret er ikke ett av alternativene";
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * Valg av åtte — settkravene i FR-13
 * ------------------------------------------------------------------ */

/**
 * Velger åtte av de gyldige kandidatene, i modellens prioritet, slik at
 * settkravene holder:
 *
 *   1. minst ett kortsvar
 *   2. minst ett spørsmål per del, når teksten har fire deler eller færre
 *   3. minst fem flervalg
 *   4. resten fylles opp i modellens rekkefølge
 *
 * Kaster om kravene ikke kan oppfylles. Returnerer spørsmålene i tekstens
 * rekkefølge, slik at quizen følger lesingen.
 */
export function velgAatte(
  gyldige: Kandidat[],
  delFor: Map<number, number>,
): { valgt: Kandidat[]; udekkedeDeler: number[] } {
  const flervalg = gyldige.filter((k) => k.type === "flervalg");
  const kortsvar = gyldige.filter((k) => k.type === "kortsvar");

  if (
    gyldige.length < ANTALL_SPORSMAL ||
    flervalg.length < MINST_FLERVALG ||
    kortsvar.length < MINST_KORTSVAR
  ) {
    throw new GeneratorFeil(
      "ugyldig_utdata",
      "Lesevenn klarte ikke å lage en hel quiz av denne teksten.",
      "Prøv igjen — quizen lages på nytt hver gang. Skjer det flere ganger, kan teksten være for kort til åtte spørsmål.",
    );
  }

  const valgt: Kandidat[] = [];
  const ta = (k: Kandidat) => {
    if (!valgt.includes(k) && valgt.length < ANTALL_SPORSMAL) valgt.push(k);
  };
  const antallFlervalg = () => valgt.filter((k) => k.type === "flervalg").length;

  // 1. Minst ett kortsvar.
  ta(kortsvar[0]);

  // 2. Dekning, når kravet gjelder. Flervalg foretrekkes, siden det er det
  //    flest av skal være.
  const deler = [...new Set(delFor.values())].sort((a, b) => a - b);
  const dekningGjelder = deler.length <= MAKS_DELER_MED_DEKNINGSKRAV;
  if (dekningGjelder) {
    for (const del of deler) {
      if (valgt.some((k) => delFor.get(k.kildeavsnitt) === del)) continue;
      const iDelen = gyldige.filter((k) => delFor.get(k.kildeavsnitt) === del);
      const beste = iDelen.find((k) => k.type === "flervalg") ?? iDelen[0];
      if (beste) ta(beste);
    }
  }

  // 3. Minst fem flervalg.
  for (const k of flervalg) {
    if (antallFlervalg() >= MINST_FLERVALG) break;
    ta(k);
  }

  // 4. Fyll opp i modellens rekkefølge.
  for (const k of gyldige) ta(k);

  const udekkedeDeler = dekningGjelder
    ? deler.filter((d) => !valgt.some((k) => delFor.get(k.kildeavsnitt) === d))
    : [];

  // Tekstens rekkefølge; ved samme avsnitt, modellens.
  valgt.sort(
    (a, b) => a.kildeavsnitt - b.kildeavsnitt || gyldige.indexOf(a) - gyldige.indexOf(b),
  );
  return { valgt, udekkedeDeler };
}

/** Fisher–Yates. Modeller legger ofte det riktige svaret først. */
function stokk<T>(liste: T[]): T[] {
  const ut = [...liste];
  for (let i = ut.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [ut[i], ut[j]] = [ut[j], ut[i]];
  }
  return ut;
}

/* ------------------------------------------------------------------ */

/**
 * Lager en Quiz fra Teksten. `avsnitt` skal komme fra `delIAvsnitt` (AD-12),
 * av samme grunn som for faguttrykkene.
 */
export async function genererQuiz(avsnitt: Avsnitt[]): Promise<Quizresultat> {
  const svar = await kjoerGenerator({
    oppgave: "quiz",
    skjema: QuizSkjema,
    brukermelding: formaterAvsnitt(avsnitt),
  });

  const alleNumre = new Set(avsnitt.map((a) => a.nummer));
  const brodtekstNumre = new Set(
    avsnitt.filter((a) => !a.erOverskrift).map((a) => a.nummer),
  );

  const gyldige: Kandidat[] = [];
  const forkastet: Quizresultat["forkastet"] = [];
  const sett = new Set<string>();
  for (const k of svar.data.sporsmal) {
    let grunn = grunnTilForkasting(k, brodtekstNumre, alleNumre);
    if (!grunn && sett.has(norm(k.sporsmal))) grunn = "samme spørsmål to ganger";
    if (grunn) forkastet.push({ sporsmal: k.sporsmal, grunn });
    else {
      gyldige.push(k);
      sett.add(norm(k.sporsmal));
    }
  }

  const { valgt, udekkedeDeler } = velgAatte(gyldige, delerITeksten(avsnitt));

  return {
    sporsmal: valgt.map((k) => ({
      erFlervalg: k.type === "flervalg",
      sporsmal: k.sporsmal.trim(),
      alternativer: k.type === "flervalg" ? stokk(k.alternativer.map((a) => a.trim())) : [],
      riktigSvar: k.riktigSvar.trim(),
      kildeavsnittNummer: k.kildeavsnitt,
    })),
    forkastet,
    udekkedeDeler,
    promptversjon: svar.promptversjon,
    modell: svar.modell,
  };
}
