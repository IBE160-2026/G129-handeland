/**
 * Øvekort — FR-16, FR-17.
 *
 * Det finnes ingen egen tabell for øvekort, og det er med vilje (PRD §4.5):
 * Øvekortsettet ER Begrepssettet. Ett kort per Faguttrykk, med uttrykket på
 * forsiden og forklaringen og Kildeavsnittet på baksiden. Merkingen «kan» /
 * «må øve mer» ligger på begrepet selv. Én kilde betyr at kvalitetsmålingen i
 * FR-8 også dekker kortene, og at ordet eleven møtte markert i teksten er det
 * samme ordet hun øver på.
 *
 * Eierskapet går gjennom Teksten (AD-8).
 */

import { and, asc, eq } from "drizzle-orm";
import { db } from "./db";
import { avsnitt, begrep, begrepssett, tekst } from "./skjema";
import { IkkeFunnet, type Tilgang } from "./tilgang";

export type Merking = "kan" | "maa_oeve";

export type Oevekort = {
  id: string;
  uttrykk: string;
  forklaring: string;
  kildeavsnitt: { nummer: number; innhold: string };
  merking: Merking | null;
};

export type Oevekortsett =
  /** Fagordene er ikke funnet ennå — uttrekket kan ha feilet. */
  | { status: "mangler" }
  /** FR-16: tomt Begrepssett gir ingen kort, og grunnen oppgis. */
  | { status: "tomt" }
  | { status: "klar"; kort: Oevekort[] };

/** Begrepssettet til en Tekst eleven eier, eller null. */
async function eidSett(t: Tilgang, tekstId: string): Promise<string | null> {
  const eid = await db
    .select({ id: tekst.id })
    .from(tekst)
    .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);
  if (eid.length === 0) throw new IkkeFunnet("Teksten");
  const sett = await db
    .select({ id: begrepssett.id })
    .from(begrepssett)
    .where(eq(begrepssett.tekstId, tekstId))
    .limit(1);
  return sett[0]?.id ?? null;
}

/** FR-16: ett kort per Faguttrykk, i samme rekkefølge som begrepslisten. */
export async function hentOevekort(t: Tilgang, tekstId: string): Promise<Oevekortsett> {
  const settId = await eidSett(t, tekstId);
  if (!settId) return { status: "mangler" };

  const rader = await db
    .select({
      id: begrep.id,
      uttrykk: begrep.uttrykk,
      forklaring: begrep.forklaring,
      merking: begrep.merking,
      kildeNummer: avsnitt.nummer,
      kildeInnhold: avsnitt.innhold,
    })
    .from(begrep)
    .innerJoin(avsnitt, eq(begrep.kildeavsnittId, avsnitt.id))
    .where(eq(begrep.begrepssettId, settId))
    .orderBy(asc(begrep.viktighetsrangering));

  if (rader.length === 0) return { status: "tomt" };
  return {
    status: "klar",
    kort: rader.map((r) => ({
      id: r.id,
      uttrykk: r.uttrykk,
      forklaring: r.forklaring,
      kildeavsnitt: { nummer: r.kildeNummer, innhold: r.kildeInnhold },
      merking: r.merking,
    })),
  };
}

/**
 * FR-17: lagrer elevens merking av ett kort, eller fjerner den (null).
 * Begrepet må høre til Begrepssettet på en Tekst eleven eier — ellers blir det
 * ikke funnet, på samme måte som en id som ikke finnes.
 */
export async function merkOevekort(
  t: Tilgang,
  tekstId: string,
  begrepId: string,
  merking: Merking | null,
): Promise<void> {
  const settId = await eidSett(t, tekstId);
  if (!settId) throw new IkkeFunnet("Øvekortet");
  const oppdatert = await db
    .update(begrep)
    .set({ merking })
    .where(and(eq(begrep.id, begrepId), eq(begrep.begrepssettId, settId)))
    .returning({ id: begrep.id });
  if (oppdatert.length === 0) throw new IkkeFunnet("Øvekortet");
}
