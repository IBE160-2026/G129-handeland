/**
 * Mapper lett — FR-50, FR-51, FR-52 (PRD §4.9, tatt inn 19.11.2026).
 *
 * En Mappe er elevens egen samling av Tekster. Den har to samlede
 * aktiviteter, og begge LESER bare det Tekstene alt har lagret:
 *
 *   - FR-51: alle Øvekortene fra Tekstene i Mappen. Merkingen skrives til
 *     `begrep.merking` som før (`merkOevekort`), så et kort merket i Mappen er
 *     merket i Teksten også.
 *   - FR-52: en samlet Quiz satt sammen av spørsmålene Tekstene alt har.
 *     Rettes med `rettQuiz`, og fasiten når aldri nettleseren før levering.
 *
 * Ingen funksjon her kaller en generator eller lager noe. En Tekst som mangler
 * fagord eller quiz, vises med hva som mangler (`Mappetekst`), og eleven
 * sendes til Teksten for å lage det der.
 *
 * AD-8: hver funksjon finner Mappen med kontoen i where-klausulen, og hver
 * Tekst med kontoen i where-klausulen. En annen kontos Mappe eller Tekst blir
 * ikke funnet, og gir `IkkeFunnet` på samme måte som en id som ikke finnes.
 */

import { and, asc, count, desc, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import type { Merking, Oevekort } from "./oevekort";
import { rettQuiz, UgyldigVurdering, type Elevsvar, type LagretSporsmal } from "./quiz";
import {
  avsnitt,
  begrep,
  begrepssett,
  mappe,
  mappeforsoek,
  mappeTekst,
  quiz,
  quizsporsmal,
  tekst,
  user,
} from "./skjema";
import { IkkeFunnet, type Tilgang } from "./tilgang";
import {
  MAPPE_AVVIST,
  MAPPEGRENSER,
  SPORSMAL_PER_TEKST,
  tolkTittel,
  velgSporsmal,
  type Quizlengde,
} from "./mappegrenser";

export * from "./mappegrenser";

/* ------------------------------------------------------------------ *
 * Mappe og medlemskap — FR-50
 * ------------------------------------------------------------------ */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type Mapperad = { id: string; tittel: string; opprettet: Date; antallTekster: number };

/** Mappen hvis kontoen eier den, ellers IkkeFunnet. */
async function eidMappe(t: Tilgang, mappeId: string) {
  // En adresse som ikke er en uuid, finnes ikke. Uten sjekken ville Postgres
  // avvist spørringen, og siden gitt en serverfeil framfor «finnes ikke».
  if (!UUID.test(mappeId)) throw new IkkeFunnet("Mappen");
  const [m] = await db
    .select({ id: mappe.id, tittel: mappe.tittel, opprettet: mappe.opprettet })
    .from(mappe)
    .where(and(eq(mappe.id, mappeId), eq(mappe.kontoId, t.kontoId)))
    .limit(1);
  if (!m) throw new IkkeFunnet("Mappen");
  return m;
}

/** Elevens Mapper med antall Tekster, nyeste først. */
export async function listMapper(t: Tilgang): Promise<Mapperad[]> {
  const rader = await db
    .select({
      id: mappe.id,
      tittel: mappe.tittel,
      opprettet: mappe.opprettet,
      antallTekster: count(mappeTekst.id),
    })
    .from(mappe)
    .leftJoin(mappeTekst, eq(mappeTekst.mappeId, mappe.id))
    .where(eq(mappe.kontoId, t.kontoId))
    .groupBy(mappe.id)
    .orderBy(desc(mappe.opprettet));
  return rader.map((r) => ({ ...r, antallTekster: Number(r.antallTekster) }));
}

/**
 * Hvilke av elevens Mapper hver Tekst ligger i: tekstId → mappeIder.
 * Samlinger bruker det til «(alt med)» i «Legg i mappe». Bare kontoens egne
 * Mapper og Tekster (AD-8); en Tekst uten Mappe er ikke med i kartet.
 */
export async function mapperPerTekst(t: Tilgang): Promise<Map<string, string[]>> {
  const rader = await db
    .select({ tekstId: mappeTekst.tekstId, mappeId: mappeTekst.mappeId })
    .from(mappeTekst)
    .innerJoin(mappe, eq(mappeTekst.mappeId, mappe.id))
    .innerJoin(tekst, eq(mappeTekst.tekstId, tekst.id))
    .where(and(eq(mappe.kontoId, t.kontoId), eq(tekst.kontoId, t.kontoId)));
  const kart = new Map<string, string[]>();
  for (const r of rader) kart.set(r.tekstId, [...(kart.get(r.tekstId) ?? []), r.mappeId]);
  return kart;
}

/**
 * Lager en Mappe. Høyst 20 per konto: telles i samme transaksjon som
 * innsettingen, med kontoraden låst, så to samtidige forespørsler ikke begge
 * blir den tjuende.
 */
export async function opprettMappe(t: Tilgang, raaTittel: string): Promise<string> {
  const tittel = tolkTittel(raaTittel);
  return db.transaction(async (tx) => {
    await tx.select({ id: user.id }).from(user).where(eq(user.id, t.kontoId)).for("update");
    const [{ antall }] = await tx.select({ antall: count() }).from(mappe).where(eq(mappe.kontoId, t.kontoId));
    if (Number(antall) >= MAPPEGRENSER.mapper) throw MAPPE_AVVIST.forMangeMapper();
    const [ny] = await tx.insert(mappe).values({ kontoId: t.kontoId, tittel }).returning({ id: mappe.id });
    return ny.id;
  });
}

export async function giNyttNavn(t: Tilgang, mappeId: string, raaTittel: string): Promise<void> {
  const tittel = tolkTittel(raaTittel);
  if (!UUID.test(mappeId)) throw new IkkeFunnet("Mappen");
  const oppdatert = await db
    .update(mappe)
    .set({ tittel })
    .where(and(eq(mappe.id, mappeId), eq(mappe.kontoId, t.kontoId)))
    .returning({ id: mappe.id });
  if (oppdatert.length === 0) throw new IkkeFunnet("Mappen");
}

/**
 * Sletter Mappen og forsøkene på den samlede quizen. Tekstene står igjen:
 * koblingen slettes, ikke Teksten.
 */
export async function slettMappe(t: Tilgang, mappeId: string): Promise<void> {
  if (!UUID.test(mappeId)) throw new IkkeFunnet("Mappen");
  const slettet = await db
    .delete(mappe)
    .where(and(eq(mappe.id, mappeId), eq(mappe.kontoId, t.kontoId)))
    .returning({ id: mappe.id });
  if (slettet.length === 0) throw new IkkeFunnet("Mappen");
}

/**
 * Legger en Tekst eleven eier i en Mappe eleven eier. Ligger den der fra
 * før, skjer ingenting. Høyst 8 per Mappe, telt med Mapperaden låst.
 */
export async function leggTilTekst(t: Tilgang, mappeId: string, tekstId: string): Promise<void> {
  if (!UUID.test(mappeId)) throw new IkkeFunnet("Mappen");
  if (!UUID.test(tekstId)) throw new IkkeFunnet("Teksten");
  await db.transaction(async (tx) => {
    const [m] = await tx
      .select({ id: mappe.id })
      .from(mappe)
      .where(and(eq(mappe.id, mappeId), eq(mappe.kontoId, t.kontoId)))
      .for("update");
    if (!m) throw new IkkeFunnet("Mappen");
    const [eid] = await tx
      .select({ id: tekst.id })
      .from(tekst)
      .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
      .limit(1);
    if (!eid) throw new IkkeFunnet("Teksten");

    const finnes = await tx
      .select({ id: mappeTekst.id })
      .from(mappeTekst)
      .where(and(eq(mappeTekst.mappeId, mappeId), eq(mappeTekst.tekstId, tekstId)))
      .limit(1);
    if (finnes.length > 0) return;

    const [{ antall }] = await tx.select({ antall: count() }).from(mappeTekst).where(eq(mappeTekst.mappeId, mappeId));
    if (Number(antall) >= MAPPEGRENSER.tekster) throw MAPPE_AVVIST.forMangeTekster();
    await tx.insert(mappeTekst).values({ mappeId, tekstId }).onConflictDoNothing();
  });
}

/** Tar en Tekst ut av Mappen. Teksten selv står. */
export async function fjernTekst(t: Tilgang, mappeId: string, tekstId: string): Promise<void> {
  await eidMappe(t, mappeId);
  if (!UUID.test(tekstId)) throw new IkkeFunnet("Teksten i mappen");
  const fjernet = await db
    .delete(mappeTekst)
    .where(and(eq(mappeTekst.mappeId, mappeId), eq(mappeTekst.tekstId, tekstId)))
    .returning({ id: mappeTekst.id });
  if (fjernet.length === 0) throw new IkkeFunnet("Teksten i mappen");
}

/* ------------------------------------------------------------------ *
 * Mappen med status per Tekst
 * ------------------------------------------------------------------ */

/**
 * Én Tekst i Mappen, med det de samlede aktivitetene trenger å vite.
 * `antallFagord` er null når fagordene ikke er funnet ennå (ingen
 * Begrepssett), og `antallSporsmal` er null når Quizen ikke er laget.
 */
export type Mappetekst = {
  id: string;
  tittel: string;
  tilstand: "innlest" | "aktivert" | "laast";
  antallFagord: number | null;
  antallSporsmal: number | null;
};

export type Mappe = {
  id: string;
  tittel: string;
  opprettet: Date;
  tekster: Mappetekst[];
};

/** Tekstene i Mappen, i den rekkefølgen de ble lagt til. Eierskap på begge. */
async function eideTekster(t: Tilgang, mappeId: string) {
  return db
    .select({ id: tekst.id, tittel: tekst.tittel, tilstand: tekst.tilstand })
    .from(mappeTekst)
    .innerJoin(tekst, eq(mappeTekst.tekstId, tekst.id))
    .where(and(eq(mappeTekst.mappeId, mappeId), eq(tekst.kontoId, t.kontoId)))
    .orderBy(asc(mappeTekst.lagtTil), asc(tekst.tittel));
}

export async function hentMappe(t: Tilgang, mappeId: string): Promise<Mappe> {
  const m = await eidMappe(t, mappeId);
  const tekster = await eideTekster(t, mappeId);
  const ider = tekster.map((x) => x.id);

  const [fagord, sporsmal] =
    ider.length === 0
      ? [[], []]
      : await Promise.all([
          db
            .select({ tekstId: begrepssett.tekstId, antall: count(begrep.id) })
            .from(begrepssett)
            .leftJoin(begrep, eq(begrep.begrepssettId, begrepssett.id))
            .where(inArray(begrepssett.tekstId, ider))
            .groupBy(begrepssett.tekstId),
          db
            .select({ tekstId: quiz.tekstId, antall: count(quizsporsmal.id) })
            .from(quiz)
            .leftJoin(quizsporsmal, eq(quizsporsmal.quizId, quiz.id))
            .where(inArray(quiz.tekstId, ider))
            .groupBy(quiz.tekstId),
        ]);
  const fagordFor = new Map(fagord.map((r) => [r.tekstId, Number(r.antall)]));
  const sporsmalFor = new Map(sporsmal.map((r) => [r.tekstId, Number(r.antall)]));

  return {
    ...m,
    tekster: tekster.map((x) => ({
      ...x,
      antallFagord: fagordFor.get(x.id) ?? null,
      antallSporsmal: sporsmalFor.get(x.id) ?? null,
    })),
  };
}

/* ------------------------------------------------------------------ *
 * FR-51 — samlet øving
 * ------------------------------------------------------------------ */

/** Et øvekort i Mappen: kortet slik Teksten har det, og hvilken Tekst det er fra. */
export type Mappekort = Oevekort & { tekst: { id: string; tittel: string } };

/**
 * Alle Øvekortene fra de låste Tekstene i Mappen, Tekst for Tekst i
 * rekkefølgen de ble lagt til, og innen hver Tekst i begrepslistens
 * rekkefølge (som `hentOevekort`). Tekster som ikke er låst, ikke har
 * Begrepssett eller har et tomt, gir ingen kort; `hentMappe` sier hvorfor.
 */
export async function hentMappekort(t: Tilgang, mappeId: string): Promise<Mappekort[]> {
  await eidMappe(t, mappeId);
  const tekster = (await eideTekster(t, mappeId)).filter((x) => x.tilstand === "laast");
  if (tekster.length === 0) return [];
  const rekkefoelge = new Map(tekster.map((x, i) => [x.id, i]));

  const rader = await db
    .select({
      id: begrep.id,
      uttrykk: begrep.uttrykk,
      forklaring: begrep.forklaring,
      merking: begrep.merking,
      viktighetsrangering: begrep.viktighetsrangering,
      kildeNummer: avsnitt.nummer,
      kildeInnhold: avsnitt.innhold,
      tekstId: begrepssett.tekstId,
    })
    .from(begrep)
    .innerJoin(begrepssett, eq(begrep.begrepssettId, begrepssett.id))
    .innerJoin(avsnitt, eq(begrep.kildeavsnittId, avsnitt.id))
    .where(inArray(begrepssett.tekstId, tekster.map((x) => x.id)));

  const tittelFor = new Map(tekster.map((x) => [x.id, x.tittel]));
  return rader
    .sort(
      (a, b) =>
        rekkefoelge.get(a.tekstId)! - rekkefoelge.get(b.tekstId)! || a.viktighetsrangering - b.viktighetsrangering,
    )
    .map((r) => ({
      id: r.id,
      uttrykk: r.uttrykk,
      forklaring: r.forklaring,
      merking: r.merking as Merking | null,
      kildeavsnitt: { nummer: r.kildeNummer, innhold: r.kildeInnhold },
      tekst: { id: r.tekstId, tittel: tittelFor.get(r.tekstId)! },
    }));
}

/* ------------------------------------------------------------------ *
 * FR-52 — samlet quiz
 * ------------------------------------------------------------------ */

/** Et spørsmål i den samlede quizen. Fasiten (`riktigSvar`) går ALDRI til nettleseren før levering. */
export type Mappesporsmal = LagretSporsmal & { tekst: { id: string; tittel: string } };

/**
 * Spørsmålene til den samlede quizen med den valgte lengden: fra hver låste
 * Tekst med Quiz, i rekkefølgen Tekstene ble lagt til, et fast utvalg
 * (`velgSporsmal`). Tom liste når ingen Tekst har Quiz.
 */
export async function hentMappequiz(t: Tilgang, mappeId: string, lengde: Quizlengde): Promise<Mappesporsmal[]> {
  await eidMappe(t, mappeId);
  const tekster = (await eideTekster(t, mappeId)).filter((x) => x.tilstand === "laast");
  if (tekster.length === 0) return [];

  const rader = await db
    .select({
      id: quizsporsmal.id,
      nummer: quizsporsmal.nummer,
      sporsmal: quizsporsmal.sporsmal,
      erFlervalg: quizsporsmal.erFlervalg,
      alternativer: quizsporsmal.alternativer,
      riktigSvar: quizsporsmal.riktigSvar,
      kildeNummer: avsnitt.nummer,
      kildeInnhold: avsnitt.innhold,
      tekstId: quiz.tekstId,
    })
    .from(quizsporsmal)
    .innerJoin(quiz, eq(quizsporsmal.quizId, quiz.id))
    .innerJoin(avsnitt, eq(quizsporsmal.kildeavsnittId, avsnitt.id))
    .where(inArray(quiz.tekstId, tekster.map((x) => x.id)));

  return tekster.flatMap((x) =>
    velgSporsmal(
      rader.filter((r) => r.tekstId === x.id),
      SPORSMAL_PER_TEKST[lengde],
    ).map((r) => ({
      id: r.id,
      nummer: r.nummer,
      sporsmal: r.sporsmal,
      erFlervalg: r.erFlervalg,
      alternativer: r.alternativer ?? [],
      riktigSvar: r.riktigSvar,
      kildeavsnitt: { nummer: r.kildeNummer, innhold: r.kildeInnhold },
      tekst: { id: x.id, tittel: x.tittel },
    })),
  );
}

export type Mappeforsoek = {
  id: string;
  lengde: Quizlengde;
  antallRiktige: number;
  antallTotalt: number;
  gjennomfoert: Date;
};

/** Lagrer et rettet forsøk. Rettingen gjøres av kalleren med `rettQuiz`. */
export async function lagreMappeforsoek(
  t: Tilgang,
  mappeId: string,
  lengde: Quizlengde,
  svar: Elevsvar[],
  retting: { antallRiktige: number; antallTotalt: number },
): Promise<string> {
  await eidMappe(t, mappeId);
  const [rad] = await db
    .insert(mappeforsoek)
    .values({
      mappeId,
      lengde,
      svar: JSON.stringify(svar),
      antallRiktige: retting.antallRiktige,
      antallTotalt: retting.antallTotalt,
    })
    .returning({ id: mappeforsoek.id });
  return rad.id;
}

/** Tidligere forsøk på den samlede quizen, nyeste først (FR-15). */
export async function listMappeforsoek(t: Tilgang, mappeId: string): Promise<Mappeforsoek[]> {
  await eidMappe(t, mappeId);
  return db
    .select({
      id: mappeforsoek.id,
      lengde: mappeforsoek.lengde,
      antallRiktige: mappeforsoek.antallRiktige,
      antallTotalt: mappeforsoek.antallTotalt,
      gjennomfoert: mappeforsoek.gjennomfoert,
    })
    .from(mappeforsoek)
    .where(eq(mappeforsoek.mappeId, mappeId))
    .orderBy(desc(mappeforsoek.gjennomfoert));
}

/**
 * Selvvurdering av et kortsvar etter levering, som `oppdaterSelvvurdering`
 * i tekstquizen. Spørsmålet må høre til en Tekst eleven eier, og være med i
 * forsøket.
 *
 * Antallet regnes som før minus spørsmålets gamle retting pluss den nye,
 * begge med `rettQuiz`, så regelen er den samme som ved levering. Det er
 * ikke en ny regel, men gjør at forsøket kan rettes selv om en annen Tekst
 * i Mappen er slettet etter levering: da finnes ikke de spørsmålene lenger,
 * og en ny retting av hele forsøket ville gitt et annet antall.
 */
export async function oppdaterMappeSelvvurdering(
  t: Tilgang,
  mappeId: string,
  forsoekId: string,
  sporsmalId: string,
  riktig: boolean,
): Promise<{ antallRiktige: number; antallTotalt: number }> {
  await eidMappe(t, mappeId);
  if (!UUID.test(forsoekId)) throw new IkkeFunnet("Forsøket");
  if (!UUID.test(sporsmalId)) throw new IkkeFunnet("Spørsmålet");
  const [f] = await db
    .select({
      id: mappeforsoek.id,
      svar: mappeforsoek.svar,
      antallRiktige: mappeforsoek.antallRiktige,
      antallTotalt: mappeforsoek.antallTotalt,
    })
    .from(mappeforsoek)
    .where(and(eq(mappeforsoek.id, forsoekId), eq(mappeforsoek.mappeId, mappeId)))
    .limit(1);
  if (!f) throw new IkkeFunnet("Forsøket");

  const svar: Elevsvar[] = JSON.parse(f.svar);
  const gammelt = svar.find((s) => s.sporsmalId === sporsmalId);
  if (!gammelt) throw new IkkeFunnet("Spørsmålet");

  const [rad] = await db
    .select({
      id: quizsporsmal.id,
      nummer: quizsporsmal.nummer,
      sporsmal: quizsporsmal.sporsmal,
      erFlervalg: quizsporsmal.erFlervalg,
      alternativer: quizsporsmal.alternativer,
      riktigSvar: quizsporsmal.riktigSvar,
      kildeNummer: avsnitt.nummer,
      kildeInnhold: avsnitt.innhold,
    })
    .from(quizsporsmal)
    .innerJoin(quiz, eq(quizsporsmal.quizId, quiz.id))
    .innerJoin(tekst, eq(quiz.tekstId, tekst.id))
    .innerJoin(avsnitt, eq(quizsporsmal.kildeavsnittId, avsnitt.id))
    .where(and(eq(quizsporsmal.id, sporsmalId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);
  if (!rad) throw new IkkeFunnet("Spørsmålet");
  const sporsmal: LagretSporsmal = {
    id: rad.id,
    nummer: rad.nummer,
    sporsmal: rad.sporsmal,
    erFlervalg: rad.erFlervalg,
    alternativer: rad.alternativer ?? [],
    riktigSvar: rad.riktigSvar,
    kildeavsnitt: { nummer: rad.kildeNummer, innhold: rad.kildeInnhold },
  };
  if (sporsmal.erFlervalg) throw new UgyldigVurdering("Flervalgssvar kan ikke endres etter levering.");
  if (riktig && !gammelt.skrevet?.trim()) throw new UgyldigVurdering("Et tomt svar kan ikke vurderes som riktig.");

  const nytt: Elevsvar = { ...gammelt, selvvurdertRiktig: riktig };
  const foer = rettQuiz([sporsmal], [gammelt]).antallRiktige;
  const etter = rettQuiz([sporsmal], [nytt]).antallRiktige;
  const antallRiktige = f.antallRiktige - foer + etter;

  await db
    .update(mappeforsoek)
    .set({
      svar: JSON.stringify(svar.map((s) => (s.sporsmalId === sporsmalId ? nytt : s))),
      antallRiktige,
    })
    .where(eq(mappeforsoek.id, f.id));
  return { antallRiktige, antallTotalt: f.antallTotalt };
}
