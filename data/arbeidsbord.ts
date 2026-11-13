/**
 * Arbeidsbordet — FR-48 og FR-49 (EXPERIENCE.md, State Patterns).
 *
 * `hentArbeidsbord` er den eneste funksjonen her som snakker med databasen.
 * Den henter alle elevens Tekster med det bordet trenger: når teksten sist
 * var aktiv, og status per aktivitet. Eierskapet står i where-klausulen i
 * hver av spørringene (AD-8), og antallet spørringer er det samme uansett
 * hvor mange tekster eleven har (ingen N+1).
 *
 * Reglene for neste steg, status på kortene i viften og hvilke fem bunker som
 * ligger på bordet, er rene funksjoner over resultatet, så de kan testes uten
 * database (data/arbeidsbord.test.ts).
 *
 * «Sist aktiv» regnes ut fra tidsstemplene som finnes (beslutning 13.11, uten
 * nytt felt og uten migrering). Å åpne lesevisningen og å merke øvekort har
 * ingen tidsstempel, og teller derfor ikke.
 */

import { count, desc, eq, max, sql } from "drizzle-orm";
import { MAKS_RUNDER } from "../generatorer/fagsamtale";
import { db } from "./db";
import { begrep, begrepssett, fagsamtale, minnevers, quiz, quizforsoek, samtalerunde, tekst } from "./skjema";
import type { Tilgang } from "./tilgang";

export type Tilstand = "innlest" | "aktivert" | "laast";

/** Én Tekst på bordet, med det reglene trenger. */
export type Bunke = {
  id: string;
  tittel: string;
  tilstand: Tilstand;
  opprettet: Date;
  /** Den nyeste av tidsstemplene, se `regnSistAktiv`. */
  sistAktiv: Date;
  /** Antall Faguttrykk i Begrepssettet. `null`: fagordene er ikke funnet ennå. */
  antallFagord: number | null;
  /** Øvekort merket «kan». */
  antallKan: number;
  /** Øvekort merket i det hele tatt («kan» eller «må øve»). */
  antallMerket: number;
  /** Det nyeste quizforsøket. Bare fullførte forsøk lagres. */
  sisteQuiz: { antallRiktige: number; antallTotalt: number } | null;
  /**
   * Samtalen kortet og neste steg handler om: den nyeste som ikke er
   * avsluttet, ellers den nyeste. `besvarteRunder` er runder eleven har svart på.
   */
  samtale: { id: string; avsluttet: boolean; besvarteRunder: number } | null;
  harMinnevers: boolean;
};

/* ------------------------------------------------------------------ *
 * Rene funksjoner
 * ------------------------------------------------------------------ */

/**
 * «Sist aktiv» er den nyeste av: teksten ble lagt inn, fikk godkjent
 * overskriftene eller ble låst, et quizforsøk, en samtale eller samtalerunde,
 * og et minnevers.
 */
export function regnSistAktiv(tider: readonly (Date | null | undefined)[]): Date {
  let nyest = 0;
  for (const t of tider) if (t && t.getTime() > nyest) nyest = t.getTime();
  return new Date(nyest);
}

/** Sist aktiv først. Likt: sist lagt inn først, og til slutt id, så rekkefølgen er stabil. */
export function sorterEtterSistAktiv<T extends Pick<Bunke, "id" | "sistAktiv" | "opprettet">>(bunker: readonly T[]): T[] {
  return [...bunker].sort(
    (a, b) =>
      b.sistAktiv.getTime() - a.sistAktiv.getTime() ||
      b.opprettet.getTime() - a.opprettet.getTime() ||
      a.id.localeCompare(b.id),
  );
}

export const PLASSER_PAA_BORDET = 5;

/**
 * De fem som sist var aktive, med hovedbunken (den som sist var aktiv) først.
 * `antall` er alle tekstene, så siden kan vise «Se alle N tekstene i samlingen».
 */
export function velgBordet<T extends Pick<Bunke, "id" | "sistAktiv" | "opprettet">>(
  bunker: readonly T[],
): { hoved: T | null; smaa: T[]; antall: number } {
  const sortert = sorterEtterSistAktiv(bunker).slice(0, PLASSER_PAA_BORDET);
  return { hoved: sortert[0] ?? null, smaa: sortert.slice(1), antall: bunker.length };
}

export type Steg = {
  tekst: string;
  href: string;
  /** Hvilken regel som slo til. Brukes til Buddys boble. */
  slag: "aktivering" | "gjennomsyn" | "samtale" | "quiz" | "fagsamtale" | "oevekort" | "lesing";
};

/** Runden eleven står i: én etter de besvarte, men aldri over taket (FR-22). */
function gjeldendeRunde(besvarte: number): number {
  return Math.min(besvarte + 1, MAKS_RUNDER);
}

/**
 * Neste steg på hovedbunken og i Samlingen: den første regelen som passer.
 *
 * Fagsamtalen kan tas før quizen (FR-18, UJ-3); da finnes det en samtale, og
 * regelen «Neste: Fagsamtale» hoppes over. Minnevers er aldri neste steg.
 * Bruksgrensene finnes ikke ennå, så dagens samtalegrense regnes som ikke nådd.
 */
export function nesteSteg(b: Bunke): Steg {
  const rot = `/tekst/${b.id}`;
  if (b.tilstand === "innlest") return { tekst: "Fortsett: Før du leser", href: `${rot}/aktivering`, slag: "aktivering" };
  if (b.tilstand === "aktivert") return { tekst: "Fortsett: Se over teksten", href: `${rot}/gjennomsyn`, slag: "gjennomsyn" };
  if (b.samtale && !b.samtale.avsluttet) {
    return {
      tekst: `Fortsett: Fagsamtale, runde ${gjeldendeRunde(b.samtale.besvarteRunder)} av ${MAKS_RUNDER}`,
      href: `${rot}/samtale/${b.samtale.id}`,
      slag: "samtale",
    };
  }
  if (!b.sisteQuiz) return { tekst: "Neste: Ta quizen", href: `${rot}/quiz`, slag: "quiz" };
  // Samtalen startes med et skjema på oppgavesiden (den lager første spørsmål).
  if (!b.samtale) return { tekst: "Neste: Fagsamtale", href: `${rot}/oppgaver`, slag: "fagsamtale" };
  if (b.antallFagord !== null && b.antallFagord > 0) return { tekst: "Øv videre med kortene", href: `${rot}/oevekort`, slag: "oevekort" };
  return { tekst: "Les teksten igjen", href: `${rot}/lesing`, slag: "lesing" };
}

export type Aktivitet = "Teksten" | "Quiz" | "Øvekort" | "Fagsamtale" | "Minnevers";

export type Kort = {
  navn: Aktivitet;
  /** `null`: kortet er låst, og er ikke en lenke. */
  href: string | null;
  status: string;
  /** Et tall i statusen som vises som pille, for eksempel «6 av 8». Står alltid inni `status`. */
  pille?: string;
  /** Teller i framdriften («3 av 5 påbegynt»). */
  paabegynt: boolean;
};

export const LAAST = "Låst. Åpnes når du har lest teksten.";
export const INGEN_FAGORD = "Fant ingen fagord i teksten, så det er ingen kort å øve på.";
const TEKSTSTATUS: Record<Tilstand, string> = {
  innlest: "Ikke begynt",
  aktivert: "Venter på gjennomsyn",
  laast: "Klar til lesing",
};

/** Tilstanden i klartekst (Samlingen og Teksten-kortet). */
export function tilstandsord(t: Tilstand): string {
  return TEKSTSTATUS[t];
}

/**
 * De fem kortene i viften, alltid i denne rekkefølgen: Teksten, Quiz,
 * Øvekort, Fagsamtale, Minnevers. Før teksten er låst, er de fire siste
 * låst, slik sidene krever i dag.
 */
export function kortstatus(b: Bunke): Kort[] {
  const rot = `/tekst/${b.id}`;
  const laast = b.tilstand === "laast";

  const teksten: Kort = {
    navn: "Teksten",
    href: b.tilstand === "innlest" ? `${rot}/aktivering` : b.tilstand === "aktivert" ? `${rot}/gjennomsyn` : `${rot}/lesing`,
    status: laast && b.antallFagord !== null ? `${TEKSTSTATUS.laast} · ${b.antallFagord} fagord` : TEKSTSTATUS[b.tilstand],
    paabegynt: b.tilstand !== "innlest",
  };
  if (!laast) {
    const laaste = (["Quiz", "Øvekort", "Fagsamtale", "Minnevers"] as const).map(
      (navn): Kort => ({ navn, href: null, status: LAAST, paabegynt: false }),
    );
    return [teksten, ...laaste];
  }

  const q = b.sisteQuiz;
  const quizkort: Kort = q
    ? { navn: "Quiz", href: `${rot}/quiz`, status: `Sist: ${q.antallRiktige} av ${q.antallTotalt} riktig`, pille: `${q.antallRiktige} av ${q.antallTotalt}`, paabegynt: true }
    : { navn: "Quiz", href: `${rot}/quiz`, status: "Ikke tatt", paabegynt: false };

  const oevekort: Kort =
    b.antallFagord === 0
      ? { navn: "Øvekort", href: `${rot}/oevekort`, status: INGEN_FAGORD, paabegynt: false }
      : b.antallMerket > 0 && b.antallFagord !== null
        ? { navn: "Øvekort", href: `${rot}/oevekort`, status: `${b.antallKan} av ${b.antallFagord} kan du`, pille: `${b.antallKan} av ${b.antallFagord}`, paabegynt: true }
        : { navn: "Øvekort", href: `${rot}/oevekort`, status: "Ikke øvd", paabegynt: false };

  const s = b.samtale;
  const samtalekort: Kort = !s
    ? { navn: "Fagsamtale", href: `${rot}/oppgaver`, status: "Ikke startet", paabegynt: false }
    : s.avsluttet
      ? { navn: "Fagsamtale", href: `${rot}/samtale/${s.id}`, status: "Fullført", paabegynt: true }
      : {
          navn: "Fagsamtale",
          href: `${rot}/samtale/${s.id}`,
          status: `Runde ${gjeldendeRunde(s.besvarteRunder)} av ${MAKS_RUNDER}`,
          pille: `${gjeldendeRunde(s.besvarteRunder)} av ${MAKS_RUNDER}`,
          paabegynt: true,
        };

  const verskort: Kort = {
    navn: "Minnevers",
    href: `${rot}/minnevers`,
    status: b.harMinnevers ? "Laget" : "Ikke laget",
    paabegynt: b.harMinnevers,
  };

  return [teksten, quizkort, oevekort, samtalekort, verskort];
}

const DAG = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Oslo", year: "numeric", month: "2-digit", day: "2-digit" });
const KORT_DATO = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", timeZone: "Europe/Oslo" });

/** Kalenderdagen i Oslo, som et dagnummer, så «i går» følger norsk midnatt og ikke UTC. */
function dagnummer(d: Date): number {
  const [aar, mnd, dag] = DAG.format(d).split("-").map(Number);
  return Math.round(Date.UTC(aar, mnd - 1, dag) / 86_400_000);
}

/** «i dag», «i går», «for 3 dager siden» eller «den 11. nov.». */
export function relativDag(dato: Date, naa: Date): string {
  const dager = dagnummer(naa) - dagnummer(dato);
  if (dager <= 0) return "i dag";
  if (dager === 1) return "i går";
  if (dager < 7) return `for ${dager} dager siden`;
  return `den ${KORT_DATO.format(dato)}`;
}

/** «11. nov.», til bunkens forside. */
export function kortDato(dato: Date): string {
  return KORT_DATO.format(dato);
}

/* ------------------------------------------------------------------ *
 * Datatilgang
 * ------------------------------------------------------------------ */

/**
 * Alle elevens Tekster med det bordet trenger, sist aktiv først.
 *
 * Fem spørringer i parallell, hver med eierskapet i where-klausulen (AD-8):
 * tekstene, fagordene, quizforsøkene, samtalene og minneversene. Antallet er
 * fast, uansett hvor mange tekster eleven har.
 */
export async function hentArbeidsbord(t: Tilgang): Promise<Bunke[]> {
  const eier = eq(tekst.kontoId, t.kontoId);

  const [tekster, fagord, forsoek, samtaler, vers] = await Promise.all([
    db
      .select({
        id: tekst.id,
        tittel: tekst.tittel,
        tilstand: tekst.tilstand,
        opprettet: tekst.opprettet,
        laastTidspunkt: tekst.laastTidspunkt,
        overskrifterGodkjent: tekst.overskrifterGodkjent,
      })
      .from(tekst)
      .where(eier),
    db
      .select({
        tekstId: begrepssett.tekstId,
        antall: count(begrep.id),
        kan: sql<number>`count(*) filter (where ${begrep.merking} = 'kan')`.mapWith(Number),
        merket: count(begrep.merking),
      })
      .from(begrepssett)
      .innerJoin(tekst, eq(begrepssett.tekstId, tekst.id))
      .leftJoin(begrep, eq(begrep.begrepssettId, begrepssett.id))
      .where(eier)
      .groupBy(begrepssett.tekstId),
    db
      .select({
        tekstId: quiz.tekstId,
        antallRiktige: quizforsoek.antallRiktige,
        antallTotalt: quizforsoek.antallTotalt,
        gjennomfoert: quizforsoek.gjennomfoert,
      })
      .from(quizforsoek)
      .innerJoin(quiz, eq(quizforsoek.quizId, quiz.id))
      .innerJoin(tekst, eq(quiz.tekstId, tekst.id))
      .where(eier)
      .orderBy(desc(quizforsoek.gjennomfoert)),
    db
      .select({
        id: fagsamtale.id,
        tekstId: fagsamtale.tekstId,
        avsluttet: fagsamtale.avsluttet,
        opprettet: fagsamtale.opprettet,
        besvarte: count(samtalerunde.elevsvar),
        sisteRunde: max(samtalerunde.opprettet),
      })
      .from(fagsamtale)
      .innerJoin(tekst, eq(fagsamtale.tekstId, tekst.id))
      .leftJoin(samtalerunde, eq(samtalerunde.fagsamtaleId, fagsamtale.id))
      .where(eier)
      .groupBy(fagsamtale.id)
      .orderBy(desc(fagsamtale.opprettet)),
    db
      .select({ tekstId: minnevers.tekstId, sist: max(minnevers.opprettet) })
      .from(minnevers)
      .innerJoin(tekst, eq(minnevers.tekstId, tekst.id))
      .where(eier)
      .groupBy(minnevers.tekstId),
  ]);

  const fagordFor = new Map(fagord.map((f) => [f.tekstId, f]));
  const versFor = new Map(vers.map((v) => [v.tekstId, v.sist]));
  const forsoekFor = new Map<string, typeof forsoek>();
  for (const f of forsoek) forsoekFor.set(f.tekstId, [...(forsoekFor.get(f.tekstId) ?? []), f]);
  const samtalerFor = new Map<string, typeof samtaler>();
  for (const s of samtaler) samtalerFor.set(s.tekstId, [...(samtalerFor.get(s.tekstId) ?? []), s]);

  const bunker = tekster.map((r): Bunke => {
    const f = fagordFor.get(r.id);
    const q = forsoekFor.get(r.id) ?? []; // nyeste først
    const s = samtalerFor.get(r.id) ?? []; // nyeste først
    const valgt = s.find((x) => x.avsluttet === null) ?? s[0];
    const versTid = versFor.get(r.id) ?? null;
    return {
      id: r.id,
      tittel: r.tittel,
      tilstand: r.tilstand,
      opprettet: r.opprettet,
      sistAktiv: regnSistAktiv([
        r.opprettet,
        r.overskrifterGodkjent,
        r.laastTidspunkt,
        q[0]?.gjennomfoert,
        ...s.flatMap((x) => [x.opprettet, x.sisteRunde]),
        versTid,
      ]),
      antallFagord: f ? f.antall : null,
      antallKan: f?.kan ?? 0,
      antallMerket: f?.merket ?? 0,
      sisteQuiz: q[0] ? { antallRiktige: q[0].antallRiktige, antallTotalt: q[0].antallTotalt } : null,
      samtale: valgt ? { id: valgt.id, avsluttet: valgt.avsluttet !== null, besvarteRunder: valgt.besvarte } : null,
      harMinnevers: versTid !== null,
    };
  });

  return sorterEtterSistAktiv(bunker);
}
