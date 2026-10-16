/**
 * Morsmål — FR-24 til FR-27.
 *
 * Valget ligger på kontoen (FR-24). Oversettelser, oppsummering og utpeking
 * ligger på Teksten, og eierskapet går gjennom Teksten (AD-8): ingen funksjon
 * her spør på `tekst_id` uten først å ha sjekket at Teksten er elevens.
 *
 * Oversettelser lagres og gjenbrukes (FR-36). `kildeHash` sier hvilket norsk
 * de ble laget fra — passer den ikke lenger, regnes oversettelsen som borte.
 */

import { createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { Oversatt, Oppsummeringssetning, Utpekt } from "../generatorer/morsmaal";
import { finnSpraak, nivaaFor, type Spraak } from "../morsmaal/spraak";
import { db } from "./db";
import { morsmaalsvalg, oppsummering, oversettelse, tekst, utpekingssett } from "./skjema";
import { IkkeFunnet, type Tilgang } from "./tilgang";

export type Oversettelsestype = "overskrifter" | "begreper" | "oppsummering" | "utpekinger";

/** Sammendraget av det norske som oversettes. Samme elementer gir samme hash. */
export function kildeHash(elementer: { id: string; tekst: string }[]): string {
  return createHash("sha256")
    .update(JSON.stringify(elementer.map((e) => [e.id, e.tekst])))
    .digest("hex")
    .slice(0, 32);
}

async function sjekkEierskap(t: Tilgang, tekstId: string): Promise<void> {
  const eid = await db
    .select({ id: tekst.id })
    .from(tekst)
    .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);
  if (eid.length === 0) throw new IkkeFunnet("Teksten");
}

/* ------------------------------------------------------------------ *
 * FR-24 — valget
 * ------------------------------------------------------------------ */

/** Elevens Morsmål, eller null. Et språk som ikke lenger står på listen, regnes som ikke valgt. */
export async function hentMorsmaal(t: Tilgang): Promise<Spraak | null> {
  const rad = await db
    .select({ spraak: morsmaalsvalg.spraak })
    .from(morsmaalsvalg)
    .where(eq(morsmaalsvalg.kontoId, t.kontoId))
    .limit(1);
  return finnSpraak(rad[0]?.spraak);
}

/** Lagrer valget, eller fjerner det med `null`. Ukjente koder avvises — listen er lukket. */
export async function velgMorsmaal(t: Tilgang, kode: string | null): Promise<void> {
  if (kode === null) {
    await db.delete(morsmaalsvalg).where(eq(morsmaalsvalg.kontoId, t.kontoId));
    return;
  }
  if (!finnSpraak(kode)) throw new Error(`Ukjent språk: ${kode}`);
  // Nivået lagres for sporbarhet, men visningen leser det fra spraak.ts — et
  // språk som består FR-28 senere, skal ikke vente på at eleven velger på nytt.
  const verdi = { spraak: kode, nivaa: nivaaFor(kode), endret: new Date() };
  await db
    .insert(morsmaalsvalg)
    .values({ kontoId: t.kontoId, ...verdi })
    .onConflictDoUpdate({ target: morsmaalsvalg.kontoId, set: verdi });
}

/* ------------------------------------------------------------------ *
 * FR-25, FR-26 — oversettelser
 * ------------------------------------------------------------------ */

/** Den lagrede oversettelsen, eller null om den mangler eller er laget fra et annet norsk. */
export async function hentOversettelse(
  t: Tilgang,
  tekstId: string,
  spraak: string,
  type: Oversettelsestype,
  hash: string,
): Promise<Oversatt[] | null> {
  await sjekkEierskap(t, tekstId);
  const rad = await db
    .select({ kildeHash: oversettelse.kildeHash, innhold: oversettelse.innhold })
    .from(oversettelse)
    .where(and(eq(oversettelse.tekstId, tekstId), eq(oversettelse.spraak, spraak), eq(oversettelse.type, type)))
    .limit(1);
  if (rad.length === 0 || rad[0].kildeHash !== hash) return null;
  return rad[0].innhold as Oversatt[];
}

export async function lagreOversettelse(
  t: Tilgang,
  tekstId: string,
  spraak: string,
  type: Oversettelsestype,
  hash: string,
  innhold: Oversatt[],
  stempel: { promptversjon: string; modell: string },
): Promise<void> {
  await sjekkEierskap(t, tekstId);
  const verdi = { kildeHash: hash, innhold, ...stempel, opprettet: new Date() };
  await db
    .insert(oversettelse)
    .values({ tekstId, spraak, type, ...verdi })
    .onConflictDoUpdate({ target: [oversettelse.tekstId, oversettelse.spraak, oversettelse.type], set: verdi });
}

/* ------------------------------------------------------------------ *
 * FR-26 — oppsummeringen (norsk)
 * ------------------------------------------------------------------ */

export async function hentOppsummering(t: Tilgang, tekstId: string): Promise<Oppsummeringssetning[] | null> {
  await sjekkEierskap(t, tekstId);
  const rad = await db
    .select({ setninger: oppsummering.setninger })
    .from(oppsummering)
    .where(eq(oppsummering.tekstId, tekstId))
    .limit(1);
  return rad.length === 0 ? null : (rad[0].setninger as Oppsummeringssetning[]);
}

export async function lagreOppsummering(
  t: Tilgang,
  tekstId: string,
  setninger: Oppsummeringssetning[],
  stempel: { promptversjon: string; modell: string },
): Promise<void> {
  await sjekkEierskap(t, tekstId);
  const verdi = { setninger, ...stempel, opprettet: new Date() };
  await db
    .insert(oppsummering)
    .values({ tekstId, ...verdi })
    .onConflictDoUpdate({ target: oppsummering.tekstId, set: verdi });
}

/* ------------------------------------------------------------------ *
 * FR-27 — utpekingen (norsk)
 * ------------------------------------------------------------------ */

export async function hentUtpeking(t: Tilgang, tekstId: string): Promise<Utpekt[] | null> {
  await sjekkEierskap(t, tekstId);
  const rad = await db
    .select({ uttrykk: utpekingssett.uttrykk })
    .from(utpekingssett)
    .where(eq(utpekingssett.tekstId, tekstId))
    .limit(1);
  return rad.length === 0 ? null : (rad[0].uttrykk as Utpekt[]);
}

export async function lagreUtpeking(
  t: Tilgang,
  tekstId: string,
  uttrykk: Utpekt[],
  stempel: { promptversjon: string; modell: string },
): Promise<void> {
  await sjekkEierskap(t, tekstId);
  const verdi = { uttrykk, ...stempel, opprettet: new Date() };
  await db
    .insert(utpekingssett)
    .values({ tekstId, ...verdi })
    .onConflictDoUpdate({ target: utpekingssett.tekstId, set: verdi });
}
