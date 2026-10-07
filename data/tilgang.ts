/**
 * AD-8 — autorisasjon i datatilgangslaget, aldri bare i proxy.
 *
 * Regelen er at hver datatilgangsfunksjon verifiserer at innlogget konto eier
 * raden. Problemet med en slik regel er at den er lett å glemme: en funksjon
 * som tar en id og returnerer raden ser helt rimelig ut, og feilen er usynlig
 * til noen gjetter en annens id.
 *
 * Håndhevingen her er derfor i typesystemet, ikke i disiplin:
 *
 *   1. Hver funksjon krever `Tilgang` som FØRSTE parameter. Den kan ikke
 *      utledes fra en id, og den kan ikke utelates — da kompilerer det ikke.
 *   2. Eierskapet er alltid del av where-klausulen, ikke en sjekk etterpå.
 *      En rad som ikke eies blir ikke funnet, framfor å bli funnet og avvist.
 *      Forskjellen betyr noe: den første kan ikke lekke ved en feil i
 *      rekkefølgen på to if-setninger.
 *
 * Begrunnelsen for at proxy-laget ikke er nok, står i AD-8: en server action
 * er ikke en egen rute, men en POST til ruten komponenten brukes i. Flytter du
 * komponenten, forsvinner proxy-dekningen stille.
 */

import { and, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { avsnitt, tekst } from "./skjema";
import type { Avsnitt } from "../tekst/avsnittsdeling";

/**
 * Beviset på hvem som spør. Konstrueres av innloggingslaget, aldri av en
 * datatilgangsfunksjon og aldri fra en forespørselsparameter.
 */
export type Tilgang = {
  readonly kontoId: string;
};

/** Kastes når en rad ikke finnes, eller ikke eies av den som spør. */
export class IkkeFunnet extends Error {
  constructor(hva: string) {
    super(`${hva} finnes ikke, eller tilhører ikke denne kontoen.`);
    this.name = "IkkeFunnet";
  }
}

/**
 * Merk at IkkeFunnet ikke skiller mellom «finnes ikke» og «eies ikke».
 * Det er med vilje: en melding som skiller dem forteller en utenforstående
 * at raden eksisterer, og det er en lekkasje i seg selv.
 */

/* ------------------------------------------------------------------ *
 * Tekst
 * ------------------------------------------------------------------ */

export type TekstRad = typeof tekst.$inferSelect;

/** Elevens egne tekster, nyeste først. FR-36. */
export async function listTekster(t: Tilgang): Promise<TekstRad[]> {
  return db
    .select()
    .from(tekst)
    .where(eq(tekst.kontoId, t.kontoId))
    .orderBy(desc(tekst.opprettet));
}

/**
 * Én Tekst. Eierskapet ligger i where-klausulen, så en annen kontos tekst
 * blir aldri funnet — den gir IkkeFunnet på samme måte som en id som ikke
 * eksisterer.
 */
export async function hentTekst(t: Tilgang, tekstId: string): Promise<TekstRad> {
  const rader = await db
    .select()
    .from(tekst)
    .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
    .limit(1);

  if (rader.length === 0) throw new IkkeFunnet("Teksten");
  return rader[0];
}

/** Avsnittene til en Tekst eleven eier. AD-2. */
export async function hentAvsnitt(
  t: Tilgang,
  tekstId: string,
): Promise<Avsnitt[]> {
  // Eierskapet sjekkes ved å hente Teksten først. Avsnitt har ingen egen
  // kontoId, så eierskapet må gå gjennom Teksten — og det skal det, siden
  // avsnittslisten er en egenskap ved Teksten og ikke en selvstendig entitet.
  await hentTekst(t, tekstId);

  const rader = await db
    .select()
    .from(avsnitt)
    .where(eq(avsnitt.tekstId, tekstId))
    .orderBy(avsnitt.nummer);

  return rader.map((r) => ({
    nummer: r.nummer,
    innhold: r.innhold,
    erOverskrift: r.erOverskrift,
  }));
}

/* ------------------------------------------------------------------ *
 * Opprettelse og sletting
 * ------------------------------------------------------------------ */

export type NyTekst = {
  tittel: string;
  raatekst: string;
  redigertTekst: string;
  vei: "liming" | "pdf" | "bilde";
};

/**
 * Oppretter en Tekst i tilstanden `innlest` (AD-9). Avsnittslisten lages
 * ikke her — den lages av `tekst/las.ts` når eleven godkjenner fase 3b,
 * fordi AD-9 sier at avsnittslisten fryses ved låsing.
 */
export async function opprettTekst(
  t: Tilgang,
  ny: NyTekst,
): Promise<TekstRad> {
  const [rad] = await db
    .insert(tekst)
    .values({ ...ny, kontoId: t.kontoId, tilstand: "innlest" })
    .returning();

  return rad;
}

/** FR-37: sletter Teksten og alt generert innhold knyttet til den. */
export async function slettTekst(t: Tilgang, tekstId: string): Promise<void> {
  const slettet = await db
    .delete(tekst)
    .where(and(eq(tekst.id, tekstId), eq(tekst.kontoId, t.kontoId)))
    .returning({ id: tekst.id });

  if (slettet.length === 0) throw new IkkeFunnet("Teksten");
  // Alt annet forsvinner med, fordi fremmednøklene i skjemaet har
  // onDelete: "cascade". Det er FR-37s «alt generert innhold slettes med».
}

/**
 * FR-6: lagrer forkunnskapssvaret og flytter Teksten til `aktivert`.
 *
 * Overgangen hører her og ikke i `tekst/las.ts`, fordi den ikke oppretter
 * noen LåstTekst — men den er like endelig: AD-9 sier at overgangene bare
 * går framover, så where-klausulen krever tilstanden `innlest`. Et andre
 * kall gir IkkeFunnet framfor å skrive over svaret.
 */
export async function lagreForkunnskapssvar(
  t: Tilgang,
  tekstId: string,
  svar: string,
): Promise<void> {
  const oppdatert = await db
    .update(tekst)
    .set({ forkunnskapssvar: svar, tilstand: "aktivert" })
    .where(
      and(
        eq(tekst.id, tekstId),
        eq(tekst.kontoId, t.kontoId),
        eq(tekst.tilstand, "innlest"),
      ),
    )
    .returning({ id: tekst.id });

  if (oppdatert.length === 0) {
    throw new IkkeFunnet("Teksten i tilstanden innlest");
  }
}
