/**
 * Leseinnstillinger på kontoen — FR-12.
 */

import { eq } from "drizzle-orm";
import { STANDARD, tolkInnstillinger, type Leseinnstillinger } from "../tekst/leseinnstillinger";
import { db } from "./db";
import { leseinnstillinger } from "./skjema";
import type { Tilgang } from "./tilgang";

export async function hentLeseinnstillinger(t: Tilgang): Promise<Leseinnstillinger> {
  const rad = await db
    .select()
    .from(leseinnstillinger)
    .where(eq(leseinnstillinger.kontoId, t.kontoId))
    .limit(1);
  return rad.length === 0 ? STANDARD : tolkInnstillinger(rad[0]);
}

export async function lagreLeseinnstillinger(t: Tilgang, i: Leseinnstillinger): Promise<void> {
  const verdi = { ...i, endret: new Date() };
  await db
    .insert(leseinnstillinger)
    .values({ kontoId: t.kontoId, ...verdi })
    .onConflictDoUpdate({ target: leseinnstillinger.kontoId, set: verdi });
}
