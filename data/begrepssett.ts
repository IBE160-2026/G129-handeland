/**
 * Lagring og henting av Begrepssett — FR-7, FR-9, AD-13, AD-15.
 *
 * Dette er kalleren generatorlaget ikke er: `generatorer/faguttrykk.ts` er rent
 * (AD-10) og returnerer bare verdier. Her er stedet de blir rader.
 *
 * ## Oversettelsen som skjer her
 *
 * Generatoren snakker i AVSNITTSNUMRE, fordi det er det modellen fikk se og
 * det eneste den kan referere til (AD-2, AD-10). Databasen snakker i
 * AVSNITTS-ID-ER, fordi fremmednøkler peker på rader. Oversettelsen mellom de
 * to hører ett sted, og det er her — ikke i generatoren, som da hadde trengt
 * databasen, og ikke i visningen, som da hadde gjort den to ganger.
 */

import { and, eq, inArray } from "drizzle-orm";
import {
  avsnitt as avsnittTabell,
  begrep,
  begrepssett,
  forekomst,
} from "./skjema";
import { db } from "./db";
import { IkkeFunnet, type Tilgang } from "./tilgang";
import { tekst } from "./skjema";
import type { Faguttrykksresultat } from "../generatorer/faguttrykk";
import type { LaastTekst } from "../tekst/las";

/**
 * Lagrer et Begrepssett for en låst Tekst.
 *
 * Tar `LaastTekst` og ikke en id. Det er AD-15 håndhevet i typesystemet: det
 * finnes ingen måte å kalle denne funksjonen på uten først å ha gått gjennom
 * `laasTekst` eller `hentLaast`, og «glemte å sjekke låsen» er derfor ikke en
 * feil som kompilerer.
 *
 * AD-15 krever også at det finnes høyst ett Begrepssett per Tekst. Det
 * håndheves av `begrepssett_tekst_unik` i databasen, ikke av en sjekk her —
 * to samtidige kall ville ellers begge sett «finnes ikke» og begge satt inn.
 */
export async function lagreBegrepssett(
  laast: LaastTekst,
  resultat: Faguttrykksresultat,
): Promise<string> {
  // Avsnittsnummer → avsnitts-id. Hentes én gang, før transaksjonen.
  const rader = await db
    .select({ id: avsnittTabell.id, nummer: avsnittTabell.nummer })
    .from(avsnittTabell)
    .where(eq(avsnittTabell.tekstId, laast.id));

  const idFor = new Map(rader.map((r) => [r.nummer, r.id]));

  return db.transaction(async (tx) => {
    const [sett] = await tx
      .insert(begrepssett)
      .values({
        tekstId: laast.id,
        promptversjon: resultat.promptversjon,
        modell: resultat.modell,
      })
      .returning({ id: begrepssett.id });

    for (const b of resultat.begreper) {
      const kildeavsnittId = idFor.get(b.kildeavsnittNummer);
      if (!kildeavsnittId) {
        // Skal ikke kunne skje: `harGyldigKildeavsnitt` i AD-11 har alt
        // forkastet kandidater med nummer utenfor listen. Men en feil her
        // ville gitt en fremmednøkkelfeil uten forklaring, så den navngis.
        throw new Error(
          `Kildeavsnitt ${b.kildeavsnittNummer} finnes ikke for teksten. ` +
            "Valideringen i AD-11 skulle fanget dette.",
        );
      }

      const [rad] = await tx
        .insert(begrep)
        .values({
          begrepssettId: sett.id,
          uttrykk: b.uttrykk,
          forklaring: b.forklaring,
          viktighetsrangering: b.viktighetsrangering,
          kildeavsnittId,
        })
        .returning({ id: begrep.id });

      // AD-13: forekomstsettet lagres, det regnes ikke ut på nytt ved visning.
      if (b.forekomster.length > 0) {
        await tx.insert(forekomst).values(
          b.forekomster.map((f) => ({
            begrepId: rad.id,
            avsnittId: idFor.get(f.avsnittNummer)!,
            start: f.start,
            slutt: f.slutt,
          })),
        );
      }
    }

    return sett.id;
  });
}

/** Et Begrep slik Lesevisningen trenger det. */
export type LagretBegrep = {
  id: string;
  uttrykk: string;
  forklaring: string;
  viktighetsrangering: number;
  forekomster: { avsnittNummer: number; start: number; slutt: number }[];
};

export type LagretBegrepssett = {
  id: string;
  promptversjon: string;
  modell: string;
  begreper: LagretBegrep[];
};

/**
 * Henter Begrepssettet for en Tekst, eller `null` om det ikke er generert.
 *
 * Eierskapet sjekkes ved å gå via Tekst-tabellen med `kontoId` i
 * where-klausulen (AD-8). Å spørre direkte på `begrepssett.tekstId` ville
 * hoppet over eierskapssjekken helt.
 */
export async function hentBegrepssett(
  t: Tilgang,
  tekstId: string,
): Promise<LagretBegrepssett | null> {
  const eid = await db
    .select({ id: tekst.id })
    .from(tekst)
    .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);

  if (eid.length === 0) throw new IkkeFunnet("Teksten");

  const sett = await db
    .select()
    .from(begrepssett)
    .where(eq(begrepssett.tekstId, tekstId))
    .limit(1);

  if (sett.length === 0) return null;

  const begreper = await db
    .select()
    .from(begrep)
    .where(eq(begrep.begrepssettId, sett[0].id))
    .orderBy(begrep.viktighetsrangering);

  if (begreper.length === 0) {
    return {
      id: sett[0].id,
      promptversjon: sett[0].promptversjon,
      modell: sett[0].modell,
      begreper: [],
    };
  }

  // Forekomstene hentes i én spørring og grupperes i minnet, framfor én
  // spørring per Begrep. Lesevisningen er den viktigste flaten (§5), og et
  // N+1-mønster her ville vært merkbart med tjue begreper.
  const alle = await db
    .select({
      begrepId: forekomst.begrepId,
      start: forekomst.start,
      slutt: forekomst.slutt,
      avsnittNummer: avsnittTabell.nummer,
    })
    .from(forekomst)
    .innerJoin(avsnittTabell, eq(forekomst.avsnittId, avsnittTabell.id))
    .where(
      inArray(
        forekomst.begrepId,
        begreper.map((b) => b.id),
      ),
    );

  return {
    id: sett[0].id,
    promptversjon: sett[0].promptversjon,
    modell: sett[0].modell,
    begreper: begreper.map((b) => ({
      id: b.id,
      uttrykk: b.uttrykk,
      forklaring: b.forklaring,
      viktighetsrangering: b.viktighetsrangering,
      forekomster: alle
        .filter((f) => f.begrepId === b.id)
        .map((f) => ({
          avsnittNummer: f.avsnittNummer,
          start: f.start,
          slutt: f.slutt,
        })),
    })),
  };
}
