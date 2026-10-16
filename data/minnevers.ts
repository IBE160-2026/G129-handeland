/**
 * Minnevers — FR-30 og FR-31.
 *
 * Bare vers som har bestått kontrollen i generatoren lagres. `innhold` er JSON
 * med linjene, fagordene og stilen; kolonnen er tekst fordi skjemaet ble laget
 * før formen var bestemt, og en egen migrasjon for det er ikke verdt det.
 *
 * Eierskapet går gjennom Teksten (AD-8).
 */

import { and, desc, eq } from "drizzle-orm";
import type { Minneversresultat, Versform } from "../generatorer/minnevers";
import { db } from "./db";
import { minnevers, tekst } from "./skjema";
import { IkkeFunnet, type Tilgang } from "./tilgang";

export type LagretMinnevers = {
  id: string;
  form: Versform;
  linjer: string[];
  faguttrykk: string[];
  stil: string;
  promptversjon: string;
  modell: string;
};

async function sjekkEierskap(t: Tilgang, tekstId: string): Promise<void> {
  const eid = await db
    .select({ id: tekst.id })
    .from(tekst)
    .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);
  if (eid.length === 0) throw new IkkeFunnet("Teksten");
}

export async function lagreMinnevers(t: Tilgang, tekstId: string, r: Minneversresultat): Promise<void> {
  await sjekkEierskap(t, tekstId);
  await db.insert(minnevers).values({
    tekstId,
    innhold: JSON.stringify({ linjer: r.linjer, faguttrykk: r.faguttrykk, stil: r.stil }),
    erSunoPrompt: r.form === "suno",
    promptversjon: r.promptversjon,
    modell: r.modell,
  });
}

/** Det nyeste verset og den nyeste Suno-prompten, hver for seg. */
export async function hentMinnevers(
  t: Tilgang,
  tekstId: string,
): Promise<{ vers: LagretMinnevers | null; suno: LagretMinnevers | null }> {
  await sjekkEierskap(t, tekstId);
  const rader = await db
    .select()
    .from(minnevers)
    .where(eq(minnevers.tekstId, tekstId))
    .orderBy(desc(minnevers.opprettet));
  const tolk = (r: (typeof rader)[number]): LagretMinnevers => {
    const i = JSON.parse(r.innhold) as { linjer: string[]; faguttrykk: string[]; stil: string };
    return { id: r.id, form: r.erSunoPrompt ? "suno" : "vers", ...i, promptversjon: r.promptversjon, modell: r.modell };
  };
  const vers = rader.find((r) => !r.erSunoPrompt);
  const suno = rader.find((r) => r.erSunoPrompt);
  return { vers: vers ? tolk(vers) : null, suno: suno ? tolk(suno) : null };
}
