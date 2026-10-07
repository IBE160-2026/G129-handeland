/**
 * AD-9 og AD-15 — låsingen av en Tekst, og beviset på at den er låst.
 *
 * AD-9 sier at generert innhold bare kan opprettes mot en låst Tekst.
 * Problemet er at den som skriver et Begrepssett skriver til Begrepssett-
 * tabellen og aldri til Tekst-tabellen, og dermed ikke har noen pålagt grunn
 * til å lese låsetilstanden. Invarianten hadde da ingen håndhever — bare
 * kallsteder som måtte huske den, og det er formen AD-8 forkaster.
 *
 * Løsningen er `LaastTekst`: en type bare denne modulen kan konstruere.
 * Hver funksjon som oppretter generert innhold tar `LaastTekst` som
 * parameter, ikke en id. Da er «glemte å sjekke låsen» ikke en feil man kan
 * gjøre — det kompilerer ikke.
 */

import { and, eq } from "drizzle-orm";
import { db } from "../data/db";
import { avsnitt, tekst } from "../data/skjema";
import { IkkeFunnet, type Tilgang } from "../data/tilgang";
import { delIAvsnitt, type Avsnitt } from "./avsnittsdeling";

/**
 * Merket er ikke eksportert. Det er hele mekanismen: ingen annen modul kan
 * lage et objekt som tilfredsstiller typen, uansett hvor mange felt den
 * fyller inn riktig.
 */
declare const laastMerke: unique symbol;

/** Bevis på at en Tekst er låst, og at avsnittslisten er den endelige. */
export type LaastTekst = {
  readonly [laastMerke]: true;
  readonly id: string;
  readonly kontoId: string;
  readonly avsnitt: Avsnitt[];
};

/**
 * Låser Teksten og fryser avsnittslisten.
 *
 * Avsnittslisten lages HER, ved låsing, og ikke ved opprettelse. Grunnen er
 * AD-9: lages den tidligere, kan den endres mens eleven fortsatt redigerer
 * brødteksten i fase 3b, og da peker ingenting der det skal. Delingen bruker
 * `delIAvsnitt` fra AD-12 — den ene funksjonen alle bruker, også harnessen.
 *
 * Overgangen krever tilstanden `aktivert`. Det håndhever AD-9s «bare framover»:
 * en Tekst som ikke har vært gjennom Aktiveringen kan ikke låses, og en som
 * alt er låst kan ikke låses om.
 */
export async function laasTekst(
  t: Tilgang,
  tekstId: string,
  redigertTekst: string,
): Promise<LaastTekst> {
  const deling = delIAvsnitt(redigertTekst);
  if (deling.length === 0) {
    throw new Error("Teksten gav ingen avsnitt. Kan ikke låses.");
  }

  return db.transaction(async (tx) => {
    const laast = await tx
      .update(tekst)
      .set({
        redigertTekst,
        tilstand: "laast",
        laastTidspunkt: new Date(),
      })
      .where(
        and(
          eq(tekst.id, tekstId),
          eq(tekst.kontoId, t.kontoId),
          eq(tekst.tilstand, "aktivert"),
        ),
      )
      .returning({ id: tekst.id, kontoId: tekst.kontoId });

    if (laast.length === 0) {
      throw new IkkeFunnet("Teksten i tilstanden aktivert");
    }

    await tx.insert(avsnitt).values(
      deling.map((a) => ({
        tekstId,
        nummer: a.nummer,
        innhold: a.innhold,
        erOverskrift: a.erOverskrift,
      })),
    );

    return {
      id: laast[0].id,
      kontoId: laast[0].kontoId,
      avsnitt: deling,
    } as LaastTekst;
  });
}

/**
 * Henter beviset for en Tekst som alt er låst, slik at generatorer kan kalles
 * på nytt uten å låse om. Returnerer bare når tilstanden faktisk er `laast`.
 */
export async function hentLaast(
  t: Tilgang,
  tekstId: string,
): Promise<LaastTekst> {
  const rader = await db
    .select({ id: tekst.id, kontoId: tekst.kontoId })
    .from(tekst)
    .where(
      and(
        eq(tekst.id, tekstId),
        eq(tekst.kontoId, t.kontoId),
        eq(tekst.tilstand, "laast"),
      ),
    )
    .limit(1);

  if (rader.length === 0) throw new IkkeFunnet("Låst tekst");

  const rader2 = await db
    .select()
    .from(avsnitt)
    .where(eq(avsnitt.tekstId, tekstId))
    .orderBy(avsnitt.nummer);

  return {
    id: rader[0].id,
    kontoId: rader[0].kontoId,
    avsnitt: rader2.map((r) => ({
      nummer: r.nummer,
      innhold: r.innhold,
      erOverskrift: r.erOverskrift,
    })),
  } as LaastTekst;
}
