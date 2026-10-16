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
  /** Kortsvar: elevens egen vurdering etter å ha sett eksempelsvaret. */
  selvvurdertRiktig?: boolean;
};

export type Retting = {
  per: { sporsmalId: string; riktig: boolean }[];
  antallRiktige: number;
  antallTotalt: number;
};

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

/** Lagrer et rettet forsøk. Rettingen gjøres av kalleren med `rettQuiz`. */
export async function lagreForsoek(
  t: Tilgang,
  tekstId: string,
  svar: Elevsvar[],
  retting: Retting,
): Promise<void> {
  await sjekkEierskap(t, tekstId);
  const q = await db.select({ id: quiz.id }).from(quiz).where(eq(quiz.tekstId, tekstId)).limit(1);
  if (q.length === 0) throw new IkkeFunnet("Quizen");

  await db.insert(quizforsoek).values({
    quizId: q[0].id,
    svar: JSON.stringify(svar),
    antallRiktige: retting.antallRiktige,
    antallTotalt: retting.antallTotalt,
  });
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
