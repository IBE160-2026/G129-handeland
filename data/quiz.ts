/**
 * Lagring og retting av Quiz — FR-13, FR-14, FR-15.
 *
 * Eierskapet går gjennom Teksten (AD-8): en Quiz har ingen egen kontoId, så
 * hver funksjon finner Teksten med kontoen i where-klausulen først.
 * Opprettelse tar `LaastTekst`, slik AD-15 krever.
 */

import { and, asc, desc, eq } from "drizzle-orm";
import type { Quizresultat } from "../generatorer/quiz";
import type { LaastTekst } from "../tekst/las";
import { db } from "./db";
import {
  avsnitt as avsnittTabell,
  quiz,
  quizforsoek,
  quizsporsmal,
  tekst,
} from "./skjema";
import { IkkeFunnet, type Tilgang } from "./tilgang";

export type LagretSporsmal = {
  id: string;
  nummer: number;
  sporsmal: string;
  erFlervalg: boolean;
  alternativer: string[];
  /** Fasit ved flervalg, eksempelsvar ved kortsvar. ALDRI til nettleseren før levering. */
  riktigSvar: string;
  kildeavsnitt: { nummer: number; innhold: string };
};

export type LagretQuiz = {
  id: string;
  promptversjon: string;
  modell: string;
  sporsmal: LagretSporsmal[];
};

/** Elevens svar på ett spørsmål, slik nettleseren sender det. */
export type Elevsvar = {
  sporsmalId: string;
  /** Flervalg: alternativet eleven valgte. */
  valgt?: string;
  /** Kortsvar: det eleven skrev. */
  skrevet?: string;
  /**
   * Kortsvar: elevens egen vurdering etter å ha sett eksempelsvaret. Settes
   * bare i resultatet, etter levering (`oppdaterSelvvurdering`).
   */
  selvvurdertRiktig?: boolean;
};

export type Retting = {
  per: { sporsmalId: string; riktig: boolean }[];
  antallRiktige: number;
  antallTotalt: number;
};

/**
 * Svarene slik de lagres ved levering. Selvvurderingen tas bort: et kortsvar
 * teller ikke før eleven har krysset av i resultatet (`oppdaterSelvvurdering`),
 * uansett hva nettleseren sender med.
 */
export function tilElevsvar(svar: Elevsvar[]): Elevsvar[] {
  return svar.map((s) => ({ sporsmalId: s.sporsmalId, valgt: s.valgt, skrevet: s.skrevet }));
}

/* ------------------------------------------------------------------ *
 * Retting — ren funksjon
 * ------------------------------------------------------------------ */

/**
 * Retter et forsøk. Flervalg rettes mot fasiten; kortsvar etter elevens egen
 * vurdering, men bare hvis eleven faktisk skrev noe — et tomt svar kan ikke
 * vurderes som riktig. Et spørsmål uten svar er feil, ikke utelatt: FR-15
 * sier «antall riktige av totalt», og totalt er alle spørsmålene.
 */
export function rettQuiz(sporsmal: LagretSporsmal[], svar: Elevsvar[]): Retting {
  const svarFor = new Map(svar.map((s) => [s.sporsmalId, s]));
  const per = sporsmal.map((s) => {
    const e = svarFor.get(s.id);
    const riktig = s.erFlervalg
      ? e?.valgt?.trim() === s.riktigSvar
      : (e?.skrevet?.trim().length ?? 0) > 0 && e?.selvvurdertRiktig === true;
    return { sporsmalId: s.id, riktig };
  });
  return {
    per,
    antallRiktige: per.filter((p) => p.riktig).length,
    antallTotalt: sporsmal.length,
  };
}

/* ------------------------------------------------------------------ *
 * Opprettelse
 * ------------------------------------------------------------------ */

/**
 * Lagrer en generert Quiz på Teksten. Finnes det allerede en (to faner som
 * genererte samtidig), vinner den første — den unike indeksen per Tekst
 * (AD-15) avviser den andre, og id-en til den som finnes returneres.
 */
export async function lagreQuiz(
  laast: LaastTekst,
  resultat: Quizresultat,
): Promise<string> {
  const rader = await db
    .select({ id: avsnittTabell.id, nummer: avsnittTabell.nummer })
    .from(avsnittTabell)
    .where(eq(avsnittTabell.tekstId, laast.id));
  const idFor = new Map(rader.map((r) => [r.nummer, r.id]));

  try {
    return await db.transaction(async (tx) => {
      const [q] = await tx
        .insert(quiz)
        .values({
          tekstId: laast.id,
          promptversjon: resultat.promptversjon,
          modell: resultat.modell,
        })
        .returning({ id: quiz.id });

      await tx.insert(quizsporsmal).values(
        resultat.sporsmal.map((s, i) => {
          const kildeavsnittId = idFor.get(s.kildeavsnittNummer);
          if (!kildeavsnittId) {
            throw new Error(
              `Kildeavsnitt ${s.kildeavsnittNummer} finnes ikke for teksten. ` +
                "Valideringen i generatorer/quiz.ts skulle fanget dette.",
            );
          }
          return {
            quizId: q.id,
            nummer: i + 1,
            sporsmal: s.sporsmal,
            erFlervalg: s.erFlervalg,
            alternativer: s.erFlervalg ? s.alternativer : null,
            riktigSvar: s.riktigSvar,
            kildeavsnittId,
          };
        }),
      );
      return q.id;
    });
  } catch (e) {
    const finnes = await db
      .select({ id: quiz.id })
      .from(quiz)
      .where(eq(quiz.tekstId, laast.id))
      .limit(1);
    if (finnes.length > 0) return finnes[0].id;
    throw e;
  }
}

/* ------------------------------------------------------------------ *
 * Henting
 * ------------------------------------------------------------------ */

async function sjekkEierskap(t: Tilgang, tekstId: string) {
  const eid = await db
    .select({ id: tekst.id })
    .from(tekst)
    .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);
  if (eid.length === 0) throw new IkkeFunnet("Teksten");
}

/** Quizen på en Tekst eleven eier, eller `null` om den ikke er laget ennå. */
export async function hentQuiz(
  t: Tilgang,
  tekstId: string,
): Promise<LagretQuiz | null> {
  await sjekkEierskap(t, tekstId);

  const q = await db.select().from(quiz).where(eq(quiz.tekstId, tekstId)).limit(1);
  if (q.length === 0) return null;

  const rader = await db
    .select({
      id: quizsporsmal.id,
      nummer: quizsporsmal.nummer,
      sporsmal: quizsporsmal.sporsmal,
      erFlervalg: quizsporsmal.erFlervalg,
      alternativer: quizsporsmal.alternativer,
      riktigSvar: quizsporsmal.riktigSvar,
      kildeNummer: avsnittTabell.nummer,
      kildeInnhold: avsnittTabell.innhold,
    })
    .from(quizsporsmal)
    .innerJoin(avsnittTabell, eq(quizsporsmal.kildeavsnittId, avsnittTabell.id))
    .where(eq(quizsporsmal.quizId, q[0].id))
    .orderBy(asc(quizsporsmal.nummer));

  return {
    id: q[0].id,
    promptversjon: q[0].promptversjon,
    modell: q[0].modell,
    sporsmal: rader.map((r) => ({
      id: r.id,
      nummer: r.nummer,
      sporsmal: r.sporsmal,
      erFlervalg: r.erFlervalg,
      alternativer: r.alternativer ?? [],
      riktigSvar: r.riktigSvar,
      kildeavsnitt: { nummer: r.kildeNummer, innhold: r.kildeInnhold },
    })),
  };
}

/* ------------------------------------------------------------------ *
 * Forsøk — FR-15
 * ------------------------------------------------------------------ */

export type Forsoek = {
  id: string;
  antallRiktige: number;
  antallTotalt: number;
  gjennomfoert: Date;
};

/** Lagrer et rettet forsøk og gir id-en. Rettingen gjøres av kalleren med `rettQuiz`. */
export async function lagreForsoek(
  t: Tilgang,
  tekstId: string,
  svar: Elevsvar[],
  retting: Retting,
): Promise<string> {
  await sjekkEierskap(t, tekstId);
  const q = await db.select({ id: quiz.id }).from(quiz).where(eq(quiz.tekstId, tekstId)).limit(1);
  if (q.length === 0) throw new IkkeFunnet("Quizen");

  const [rad] = await db
    .insert(quizforsoek)
    .values({
      quizId: q[0].id,
      svar: JSON.stringify(svar),
      antallRiktige: retting.antallRiktige,
      antallTotalt: retting.antallTotalt,
    })
    .returning({ id: quizforsoek.id });
  return rad.id;
}

/**
 * Selvvurderingen kan ikke gjøres: spørsmålet er flervalg (det kan ikke
 * endres etter levering), eller kortsvaret er tomt og kan ikke bli riktig.
 */
export class UgyldigVurdering extends Error {
  constructor(grunn: string) {
    super(grunn);
    this.name = "UgyldigVurdering";
  }
}

/**
 * FR-15 (endret 11.11): eleven krysser av for et kortsvar i resultatet, etter
 * levering. Forsøket leses, svaret endres, og hele forsøket rettes på nytt
 * med `rettQuiz` — samme regel som ved levering, så det ikke finnes to regler
 * for hva som er riktig. Nettleseren sender bare ja/nei, aldri et antall.
 *
 * Eierskapet sjekkes gjennom Teksten (AD-8): et forsøk på en annen kontos
 * quiz, eller på en annen tekst, gir IkkeFunnet.
 */
export async function oppdaterSelvvurdering(
  t: Tilgang,
  tekstId: string,
  forsoekId: string,
  sporsmalId: string,
  riktig: boolean,
): Promise<Retting> {
  const q = await hentQuiz(t, tekstId);
  if (!q) throw new IkkeFunnet("Quizen");

  const [f] = await db
    .select({ id: quizforsoek.id, svar: quizforsoek.svar })
    .from(quizforsoek)
    .where(and(eq(quizforsoek.id, forsoekId), eq(quizforsoek.quizId, q.id)))
    .limit(1);
  if (!f) throw new IkkeFunnet("Forsøket");

  const sporsmal = q.sporsmal.find((s) => s.id === sporsmalId);
  if (!sporsmal) throw new IkkeFunnet("Spørsmålet");
  if (sporsmal.erFlervalg) throw new UgyldigVurdering("Flervalgssvar kan ikke endres etter levering.");

  const svar: Elevsvar[] = JSON.parse(f.svar);
  const gammelt = svar.find((s) => s.sporsmalId === sporsmalId);
  if (riktig && !gammelt?.skrevet?.trim()) {
    throw new UgyldigVurdering("Et tomt svar kan ikke vurderes som riktig.");
  }
  const nye = gammelt
    ? svar.map((s) => (s.sporsmalId === sporsmalId ? { ...s, selvvurdertRiktig: riktig } : s))
    : [...svar, { sporsmalId, selvvurdertRiktig: riktig }];

  const retting = rettQuiz(q.sporsmal, nye);
  await db
    .update(quizforsoek)
    .set({ svar: JSON.stringify(nye), antallRiktige: retting.antallRiktige })
    .where(eq(quizforsoek.id, f.id));
  return retting;
}

/** Tidligere forsøk, nyeste først, slik at eleven ser utviklingen (FR-15). */
export async function listForsoek(t: Tilgang, tekstId: string): Promise<Forsoek[]> {
  await sjekkEierskap(t, tekstId);
  return db
    .select({
      id: quizforsoek.id,
      antallRiktige: quizforsoek.antallRiktige,
      antallTotalt: quizforsoek.antallTotalt,
      gjennomfoert: quizforsoek.gjennomfoert,
    })
    .from(quizforsoek)
    .innerJoin(quiz, eq(quizforsoek.quizId, quiz.id))
    .where(eq(quiz.tekstId, tekstId))
    .orderBy(desc(quizforsoek.gjennomfoert));
}
