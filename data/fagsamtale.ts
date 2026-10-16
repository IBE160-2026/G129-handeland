/**
 * Lagring av Fagsamtaler — FR-18, FR-19, FR-22.
 *
 * Eierskapet går gjennom Teksten (AD-8). Opprettelse tar `LaastTekst` (AD-15).
 *
 * En runde er ett Samtalespørsmål, elevens svar og vurderingen av det.
 * `maal` på runden sier hvorfor spørsmålet ble stilt — for første runde er det
 * `nytt_aspekt`, siden samtalen begynner med noe som ikke er dekket ennå.
 */

import { and, asc, desc, eq, gt, isNotNull, isNull } from "drizzle-orm";
import type { Maal, Tilstand } from "../generatorer/fagsamtale";
import type { Avsnitt } from "../tekst/avsnittsdeling";
import type { LaastTekst } from "../tekst/las";
import { db } from "./db";
import { avsnitt as avsnittTabell, fagsamtale, samtalerunde, tekst } from "./skjema";
import { IkkeFunnet, type Tilgang } from "./tilgang";

export type Runde = {
  nummer: number;
  sporsmal: string;
  kildeavsnitt: { nummer: number; innhold: string };
  maal: Maal;
  elevsvar: string | null;
  svarvurdering: Tilstand | null;
  vurderingsbegrunnelse: string | null;
  revurdert: boolean;
};

export type LagretFagsamtale = {
  id: string;
  tekstId: string;
  promptversjon: string;
  modell: string;
  avsluttet: Date | null;
  opprettet: Date;
  runder: Runde[];
};

async function sjekkTekst(t: Tilgang, tekstId: string) {
  const eid = await db
    .select({ id: tekst.id })
    .from(tekst)
    .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);
  if (eid.length === 0) throw new IkkeFunnet("Teksten");
}

/** Samtalen, hvis den finnes og eleven eier teksten den hører til. */
async function eidSamtale(t: Tilgang, samtaleId: string) {
  const rad = await db
    .select({ id: fagsamtale.id, tekstId: fagsamtale.tekstId, avsluttet: fagsamtale.avsluttet })
    .from(fagsamtale)
    .innerJoin(tekst, eq(fagsamtale.tekstId, tekst.id))
    .where(and(eq(fagsamtale.id, samtaleId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);
  if (rad.length === 0) throw new IkkeFunnet("Samtalen");
  return rad[0];
}

async function avsnittId(tekstId: string, nummer: number): Promise<string> {
  const rad = await db
    .select({ id: avsnittTabell.id })
    .from(avsnittTabell)
    .where(and(eq(avsnittTabell.tekstId, tekstId), eq(avsnittTabell.nummer, nummer)))
    .limit(1);
  if (rad.length === 0) {
    throw new Error(`Avsnitt ${nummer} finnes ikke for teksten. Valideringen skulle fanget dette.`);
  }
  return rad[0].id;
}

/* ------------------------------------------------------------------ */

/** FR-18: oppretter samtalen med første spørsmål. */
export async function opprettFagsamtale(
  laast: LaastTekst,
  start: { sporsmal: string; kildeavsnittNummer: number; promptversjon: string; modell: string },
): Promise<string> {
  const kilde = await avsnittId(laast.id, start.kildeavsnittNummer);
  return db.transaction(async (tx) => {
    const [s] = await tx
      .insert(fagsamtale)
      .values({ tekstId: laast.id, promptversjon: start.promptversjon, modell: start.modell })
      .returning({ id: fagsamtale.id });
    await tx.insert(samtalerunde).values({
      fagsamtaleId: s.id,
      nummer: 1,
      sporsmal: start.sporsmal,
      kildeavsnittId: kilde,
      maal: "nytt_aspekt",
    });
    return s.id;
  });
}

export async function hentFagsamtale(t: Tilgang, samtaleId: string): Promise<LagretFagsamtale> {
  await eidSamtale(t, samtaleId);
  const [s] = await db.select().from(fagsamtale).where(eq(fagsamtale.id, samtaleId));
  const runder = await db
    .select({
      nummer: samtalerunde.nummer,
      sporsmal: samtalerunde.sporsmal,
      kildeNummer: avsnittTabell.nummer,
      kildeInnhold: avsnittTabell.innhold,
      maal: samtalerunde.maal,
      elevsvar: samtalerunde.elevsvar,
      svarvurdering: samtalerunde.svarvurdering,
      vurderingsbegrunnelse: samtalerunde.vurderingsbegrunnelse,
      revurdert: samtalerunde.revurdert,
    })
    .from(samtalerunde)
    .innerJoin(avsnittTabell, eq(samtalerunde.kildeavsnittId, avsnittTabell.id))
    .where(eq(samtalerunde.fagsamtaleId, samtaleId))
    .orderBy(asc(samtalerunde.nummer));

  return {
    id: s.id,
    tekstId: s.tekstId,
    promptversjon: s.promptversjon,
    modell: s.modell,
    avsluttet: s.avsluttet,
    opprettet: s.opprettet,
    runder: runder.map((r) => ({
      nummer: r.nummer,
      sporsmal: r.sporsmal,
      kildeavsnitt: { nummer: r.kildeNummer, innhold: r.kildeInnhold },
      maal: r.maal,
      elevsvar: r.elevsvar,
      svarvurdering: r.svarvurdering,
      vurderingsbegrunnelse: r.vurderingsbegrunnelse,
      revurdert: r.revurdert,
    })),
  };
}

export type Samtaleliste = { id: string; opprettet: Date; avsluttet: Date | null; antallRunder: number }[];

/** Samtalene om en Tekst, nyeste først (FR-22: kan leses om senere). */
export async function listFagsamtaler(t: Tilgang, tekstId: string): Promise<Samtaleliste> {
  await sjekkTekst(t, tekstId);
  const samtaler = await db
    .select({ id: fagsamtale.id, opprettet: fagsamtale.opprettet, avsluttet: fagsamtale.avsluttet })
    .from(fagsamtale)
    .where(eq(fagsamtale.tekstId, tekstId))
    .orderBy(desc(fagsamtale.opprettet));
  const ut: Samtaleliste = [];
  for (const s of samtaler) {
    const r = await db
      .select({ nummer: samtalerunde.nummer })
      .from(samtalerunde)
      .where(and(eq(samtalerunde.fagsamtaleId, s.id), isNotNull(samtalerunde.elevsvar)));
    ut.push({ ...s, antallRunder: r.length });
  }
  return ut;
}

/**
 * Lagrer elevens svar og vurderingen, og legger til neste spørsmål — eller
 * avslutter samtalen, når `neste` er null (siste runde, FR-22).
 *
 * Svaret lagres bare om runden ikke alt er besvart: et dobbeltklikk skal ikke
 * gi to vurderinger, og en vurdering skal ikke kunne skrives over her
 * (ny vurdering har sin egen funksjon).
 */
export async function lagreSvar(
  t: Tilgang,
  samtaleId: string,
  nummer: number,
  elevsvar: string,
  vurdering: { tilstand: Tilstand; begrunnelse: string },
  neste: { sporsmal: string; kildeavsnittNummer: number; maal: Maal } | null,
): Promise<void> {
  const s = await eidSamtale(t, samtaleId);
  if (s.avsluttet) throw new IkkeFunnet("En åpen samtale");
  const kilde = neste ? await avsnittId(s.tekstId, neste.kildeavsnittNummer) : null;

  await db.transaction(async (tx) => {
    const oppdatert = await tx
      .update(samtalerunde)
      .set({ elevsvar, svarvurdering: vurdering.tilstand, vurderingsbegrunnelse: vurdering.begrunnelse })
      .where(
        and(
          eq(samtalerunde.fagsamtaleId, samtaleId),
          eq(samtalerunde.nummer, nummer),
          isNull(samtalerunde.elevsvar),
        ),
      )
      .returning({ id: samtalerunde.id });
    if (oppdatert.length === 0) throw new IkkeFunnet(`Runde ${nummer} uten svar`);

    if (neste && kilde) {
      await tx.insert(samtalerunde).values({
        fagsamtaleId: samtaleId,
        nummer: nummer + 1,
        sporsmal: neste.sporsmal,
        kildeavsnittId: kilde,
        maal: neste.maal,
      });
    } else {
      await tx.update(fagsamtale).set({ avsluttet: new Date() }).where(eq(fagsamtale.id, samtaleId));
    }
  });
}

/**
 * FR-22: «jeg tror du misforsto svaret mitt». Vurderingen av runden byttes ut.
 *
 * Er det siste besvarte runde, og neste spørsmål ikke er besvart ennå, byttes
 * også neste spørsmål — det bygde på vurderingen som nå er endret. Er
 * samtalen kommet lenger, endres bare vurderingen; spørsmålene etter er alt
 * svart på og blir stående.
 */
export async function lagreNyVurdering(
  t: Tilgang,
  samtaleId: string,
  nummer: number,
  vurdering: { tilstand: Tilstand; begrunnelse: string },
  neste: { sporsmal: string; kildeavsnittNummer: number; maal: Maal } | null,
): Promise<void> {
  const s = await eidSamtale(t, samtaleId);
  const kilde = neste ? await avsnittId(s.tekstId, neste.kildeavsnittNummer) : null;

  await db.transaction(async (tx) => {
    const oppdatert = await tx
      .update(samtalerunde)
      .set({ svarvurdering: vurdering.tilstand, vurderingsbegrunnelse: vurdering.begrunnelse, revurdert: true })
      .where(and(eq(samtalerunde.fagsamtaleId, samtaleId), eq(samtalerunde.nummer, nummer)))
      .returning({ id: samtalerunde.id });
    if (oppdatert.length === 0) throw new IkkeFunnet(`Runde ${nummer}`);

    if (neste && kilde) {
      const etter = await tx
        .select({ nummer: samtalerunde.nummer, elevsvar: samtalerunde.elevsvar })
        .from(samtalerunde)
        .where(and(eq(samtalerunde.fagsamtaleId, samtaleId), gt(samtalerunde.nummer, nummer)));
      if (etter.length === 1 && etter[0].elevsvar === null) {
        await tx
          .update(samtalerunde)
          .set({ sporsmal: neste.sporsmal, kildeavsnittId: kilde, maal: neste.maal })
          .where(and(eq(samtalerunde.fagsamtaleId, samtaleId), eq(samtalerunde.nummer, nummer + 1)));
      }
    }
  });
}

/** FR-22: eleven avslutter selv. */
export async function avsluttFagsamtale(t: Tilgang, samtaleId: string): Promise<void> {
  await eidSamtale(t, samtaleId);
  await db
    .update(fagsamtale)
    .set({ avsluttet: new Date() })
    .where(and(eq(fagsamtale.id, samtaleId), isNull(fagsamtale.avsluttet)));
}

/* ------------------------------------------------------------------ *
 * Oppsummeringen — FR-22, ren funksjon
 * ------------------------------------------------------------------ */

export type Oppsummering = {
  /** Overskriftene til delene av teksten samtalen var innom. */
  berorteDeler: string[];
  misoppfatninger: Runde[];
  /** Det som ble godtatt. FR-22: elevens siste sjanse til å oppdage at noe glapp. */
  dekkende: Runde[];
};

/**
 * Hvilke deler av teksten samtalen var innom, og hvilke svar som falt som
 * misoppfatning og som dekkende. En del er brødteksten under en overskrift;
 * brødtekst før første overskrift heter «Innledningen».
 */
export function oppsummer(runder: Runde[], avsnitt: Avsnitt[]): Oppsummering {
  const delFor = new Map<number, string>();
  let gjeldende = "Innledningen";
  for (const a of avsnitt) {
    if (a.erOverskrift) gjeldende = a.innhold;
    else delFor.set(a.nummer, gjeldende);
  }
  const berorte: string[] = [];
  for (const r of runder) {
    const del = delFor.get(r.kildeavsnitt.nummer);
    if (del && !berorte.includes(del)) berorte.push(del);
  }
  return {
    berorteDeler: berorte,
    misoppfatninger: runder.filter((r) => r.svarvurdering === "misoppfatning"),
    dekkende: runder.filter((r) => r.svarvurdering === "dekkende"),
  };
}
