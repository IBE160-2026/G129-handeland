/**
 * Tester for arbeidsbordet — FR-48, FR-49 (EXPERIENCE.md, State Patterns).
 *
 * De rene reglene (neste steg, status på kortene, sist aktiv og hvilke
 * bunker som ligger på bordet) testes uten database. `hentArbeidsbord` testes
 * mot en ekte Postgres i minnet (PGlite), som data/quiz.test.ts: eierskapet
 * (AD-8) og at sist aktiv følger tidsstemplene.
 */

import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const a = await import("./arbeidsbord");
const { opprettTekst, lagreForkunnskapssvar } = await import("./tilgang");
const { laasTekst } = await import("../tekst/las");
type Bunke = import("./arbeidsbord").Bunke;

const DAG = 86_400_000;
const T0 = new Date("2026-11-10T10:00:00Z");

function bunke(over: Partial<Bunke> = {}): Bunke {
  return {
    id: "b1",
    tittel: "Celledeling",
    tilstand: "laast",
    opprettet: T0,
    sistAktiv: T0,
    antallFagord: 14,
    antallKan: 0,
    antallMerket: 0,
    sisteQuiz: null,
    samtale: null,
    harMinnevers: false,
    ...over,
  };
}

/* ------------------------------------------------------------------ */

describe("Neste steg — første regel som passer", () => {
  test("innlest: «Fortsett: Før du leser» til aktiveringen", () => {
    expect(a.nesteSteg(bunke({ tilstand: "innlest" }))).toMatchObject({ tekst: "Fortsett: Før du leser", href: "/tekst/b1/aktivering" });
  });

  test("aktivert: «Fortsett: Se over teksten» til gjennomsynet", () => {
    expect(a.nesteSteg(bunke({ tilstand: "aktivert" }))).toMatchObject({ tekst: "Fortsett: Se over teksten", href: "/tekst/b1/gjennomsyn" });
  });

  test("påbegynt samtale med 3 runder: «Fortsett: Fagsamtale, runde 4 av 6» til samtalen", () => {
    const b = bunke({ samtale: { id: "s1", avsluttet: false, besvarteRunder: 3 }, sisteQuiz: { antallRiktige: 6, antallTotalt: 8 } });
    expect(a.nesteSteg(b)).toMatchObject({ tekst: "Fortsett: Fagsamtale, runde 4 av 6", href: "/tekst/b1/samtale/s1" });
  });

  test("påbegynt samtale går foran quizen", () => {
    expect(a.nesteSteg(bunke({ samtale: { id: "s1", avsluttet: false, besvarteRunder: 0 } })).tekst).toBe("Fortsett: Fagsamtale, runde 1 av 6");
  });

  test("runden går aldri over taket", () => {
    expect(a.nesteSteg(bunke({ samtale: { id: "s1", avsluttet: false, besvarteRunder: 6 } })).tekst).toBe("Fortsett: Fagsamtale, runde 6 av 6");
  });

  test("ingen quizforsøk: «Neste: Ta quizen»", () => {
    expect(a.nesteSteg(bunke())).toMatchObject({ tekst: "Neste: Ta quizen", href: "/tekst/b1/quiz" });
  });

  test("quiz tatt, ingen fagsamtale: «Neste: Fagsamtale»", () => {
    expect(a.nesteSteg(bunke({ sisteQuiz: { antallRiktige: 6, antallTotalt: 8 } }))).toMatchObject({
      tekst: "Neste: Fagsamtale",
      href: "/tekst/b1/oppgaver",
    });
  });

  test("fagsamtalen tatt før quizen: regelen hopper til quizen (FR-18)", () => {
    expect(a.nesteSteg(bunke({ samtale: { id: "s1", avsluttet: true, besvarteRunder: 6 } })).tekst).toBe("Neste: Ta quizen");
  });

  test("quiz og samtale tatt, fagord finnes: «Øv videre med kortene»", () => {
    const b = bunke({ sisteQuiz: { antallRiktige: 6, antallTotalt: 8 }, samtale: { id: "s1", avsluttet: true, besvarteRunder: 6 } });
    expect(a.nesteSteg(b)).toMatchObject({ tekst: "Øv videre med kortene", href: "/tekst/b1/oevekort" });
  });

  test("ellers: «Les teksten igjen»", () => {
    const ferdig = { sisteQuiz: { antallRiktige: 8, antallTotalt: 8 }, samtale: { id: "s1", avsluttet: true, besvarteRunder: 4 } };
    expect(a.nesteSteg(bunke({ ...ferdig, antallFagord: 0 }))).toMatchObject({ tekst: "Les teksten igjen", href: "/tekst/b1/lesing" });
    expect(a.nesteSteg(bunke({ ...ferdig, antallFagord: null })).tekst).toBe("Les teksten igjen");
  });

  test("minnevers er aldri neste steg", () => {
    const b = bunke({ sisteQuiz: { antallRiktige: 8, antallTotalt: 8 }, samtale: { id: "s1", avsluttet: true, besvarteRunder: 4 }, antallFagord: 0 });
    expect(a.nesteSteg({ ...b, harMinnevers: false }).tekst).toBe(a.nesteSteg({ ...b, harMinnevers: true }).tekst);
  });
});

/* ------------------------------------------------------------------ */

describe("Status på kortene i viften", () => {
  const status = (b: Bunke) => a.kortstatus(b).map((k) => k.status);
  const kort = (b: Bunke, navn: string) => a.kortstatus(b).find((k) => k.navn === navn)!;

  test("akkurat fem kort, alltid i samme rekkefølge", () => {
    for (const tilstand of ["innlest", "aktivert", "laast"] as const) {
      expect(a.kortstatus(bunke({ tilstand })).map((k) => k.navn)).toEqual(["Teksten", "Quiz", "Øvekort", "Fagsamtale", "Minnevers"]);
    }
  });

  test("Teksten: innlest, aktivert og låst med antall fagord", () => {
    expect(kort(bunke({ tilstand: "innlest" }), "Teksten")).toMatchObject({ status: "Ikke begynt", paabegynt: false, href: "/tekst/b1/aktivering" });
    expect(kort(bunke({ tilstand: "aktivert" }), "Teksten")).toMatchObject({ status: "Venter på gjennomsyn", paabegynt: true, href: "/tekst/b1/gjennomsyn" });
    expect(kort(bunke(), "Teksten")).toMatchObject({ status: "Klar til lesing · 14 fagord", paabegynt: true, href: "/tekst/b1/lesing" });
  });

  test("før teksten er låst: Quiz, Øvekort, Fagsamtale og Minnevers er låst, og ikke lenker", () => {
    for (const tilstand of ["innlest", "aktivert"] as const) {
      const [, ...resten] = a.kortstatus(bunke({ tilstand }));
      for (const k of resten) expect(k).toMatchObject({ href: null, status: "Låst. Åpnes når du har lest teksten.", paabegynt: false });
    }
  });

  test("Quiz: «Ikke tatt», eller «Sist: 6 av 8 riktig» med pille", () => {
    expect(kort(bunke(), "Quiz")).toMatchObject({ status: "Ikke tatt", paabegynt: false });
    expect(kort(bunke({ sisteQuiz: { antallRiktige: 6, antallTotalt: 8 } }), "Quiz")).toMatchObject({
      status: "Sist: 6 av 8 riktig",
      pille: "6 av 8",
      paabegynt: true,
    });
  });

  test("Øvekort: «Ikke øvd», «9 av 14 kan du», og FR-16-teksten ved tomt Begrepssett", () => {
    expect(kort(bunke(), "Øvekort")).toMatchObject({ status: "Ikke øvd", paabegynt: false });
    expect(kort(bunke({ antallKan: 9, antallMerket: 11 }), "Øvekort")).toMatchObject({ status: "9 av 14 kan du", paabegynt: true });
    expect(kort(bunke({ antallKan: 0, antallMerket: 2 }), "Øvekort")).toMatchObject({ status: "0 av 14 kan du", paabegynt: true });
    expect(kort(bunke({ antallFagord: 0 }), "Øvekort").status).toBe("Fant ingen fagord i teksten, så det er ingen kort å øve på.");
  });

  test("Fagsamtale: «Ikke startet», «Runde 3 av 6» og «Fullført»", () => {
    expect(kort(bunke(), "Fagsamtale")).toMatchObject({ status: "Ikke startet", paabegynt: false, href: "/tekst/b1/oppgaver" });
    expect(kort(bunke({ samtale: { id: "s1", avsluttet: false, besvarteRunder: 2 } }), "Fagsamtale")).toMatchObject({
      status: "Runde 3 av 6",
      paabegynt: true,
      href: "/tekst/b1/samtale/s1",
    });
    expect(kort(bunke({ samtale: { id: "s1", avsluttet: true, besvarteRunder: 6 } }), "Fagsamtale")).toMatchObject({ status: "Fullført", paabegynt: true });
  });

  test("Minnevers: «Ikke laget» eller «Laget»", () => {
    expect(kort(bunke(), "Minnevers")).toMatchObject({ status: "Ikke laget", paabegynt: false });
    expect(kort(bunke({ harMinnevers: true }), "Minnevers")).toMatchObject({ status: "Laget", paabegynt: true });
  });

  test("pillen står alltid inni statusen", () => {
    const b = bunke({ sisteQuiz: { antallRiktige: 6, antallTotalt: 8 }, antallKan: 9, antallMerket: 9, samtale: { id: "s", avsluttet: false, besvarteRunder: 1 } });
    for (const k of a.kortstatus(b)) if (k.pille) expect(k.status).toContain(k.pille);
  });

  test("ulåst tekst (matrisen): Teksten «Ikke begynt», de fire andre låst", () => {
    expect(status(bunke({ tilstand: "innlest" }))).toEqual(["Ikke begynt", a.LAAST, a.LAAST, a.LAAST, a.LAAST]);
  });
});

/* ------------------------------------------------------------------ */

describe("Sist aktiv og bordet", () => {
  test("sist aktiv er den nyeste av tidsstemplene, og tomme hoppes over", () => {
    const nyest = new Date(T0.getTime() + 3 * DAG);
    expect(a.regnSistAktiv([T0, null, nyest, undefined, new Date(T0.getTime() + DAG)])).toEqual(nyest);
  });

  test("sortering: sist aktiv først, så sist lagt inn", () => {
    const b = [
      bunke({ id: "a", sistAktiv: T0 }),
      bunke({ id: "b", sistAktiv: new Date(T0.getTime() + 2 * DAG) }),
      bunke({ id: "c", sistAktiv: T0, opprettet: new Date(T0.getTime() - DAG) }),
      bunke({ id: "d", sistAktiv: new Date(T0.getTime() + DAG) }),
    ];
    expect(a.sorterEtterSistAktiv(b).map((x) => x.id)).toEqual(["b", "d", "a", "c"]);
  });

  const mange = (n: number) => Array.from({ length: n }, (_, i) => bunke({ id: `t${i}`, sistAktiv: new Date(T0.getTime() + i * DAG) }));

  test("0 tekster: tomt bord", () => {
    expect(a.velgBordet([])).toEqual({ hoved: null, smaa: [], antall: 0 });
  });

  test("4 tekster: hovedbunke og tre små, uten tomme plasser", () => {
    const bord = a.velgBordet(mange(4));
    expect(bord.hoved?.id).toBe("t3");
    expect(bord.smaa.map((b) => b.id)).toEqual(["t2", "t1", "t0"]);
    expect(bord.antall).toBe(4);
  });

  test("8 tekster: de fem som sist var aktive, og antallet til «Se alle 8»", () => {
    const bord = a.velgBordet(mange(8));
    expect([bord.hoved?.id, ...bord.smaa.map((b) => b.id)]).toEqual(["t7", "t6", "t5", "t4", "t3"]);
    expect(bord.antall).toBe(8);
  });
});

describe("relativ dag (norsk tid)", () => {
  const naa = new Date("2026-11-13T09:00:00Z"); // 10:00 i Oslo

  test("i dag, i går, for N dager siden, og dato etter en uke", () => {
    expect(a.relativDag(new Date("2026-11-13T00:30:00+01:00"), naa)).toBe("i dag");
    expect(a.relativDag(new Date("2026-11-12T23:30:00+01:00"), naa)).toBe("i går");
    expect(a.relativDag(new Date("2026-11-10T12:00:00+01:00"), naa)).toBe("for 3 dager siden");
    expect(a.relativDag(new Date("2026-10-03T12:00:00+02:00"), naa)).toBe("den 3. okt.");
  });

  test("midnatt i Oslo, ikke i UTC: 23:30 UTC 12.11 er 13.11 i Oslo", () => {
    expect(a.relativDag(new Date("2026-11-12T23:30:00Z"), naa)).toBe("i dag");
  });
});

/* ------------------------------------------------------------------ *
 * hentArbeidsbord mot databasen
 * ------------------------------------------------------------------ */

const TEKST = "Celledeling\n\nMitose er den vanligste formen for celledeling.\n\nMeiose\n\nMeiose gir kjønnsceller.";

let nummer = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `bord${++nummer}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("hentArbeidsbord", () => {
  test("ny elev: ingen tekster", async () => {
    expect(await a.hentArbeidsbord(await nyKonto())).toEqual([]);
  });

  test("bare egne tekster (AD-8)", async () => {
    const meg = await nyKonto();
    const annen = await nyKonto();
    await opprettTekst(annen, { tittel: "Ikke min", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
    await opprettTekst(meg, { tittel: "Min", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
    expect((await a.hentArbeidsbord(meg)).map((b) => b.tittel)).toEqual(["Min"]);
  });

  test("status og sist aktiv fra fagord, quiz, samtale og minnevers", async () => {
    const t = await nyKonto();
    const gammel = await opprettTekst(t, { tittel: "Gammel", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
    const ny = await opprettTekst(t, { tittel: "Ny", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
    // «Gammel» lagt inn for en uke siden, «Ny» for to dager siden.
    await db.update(skjema.tekst).set({ opprettet: new Date(Date.now() - 7 * DAG) }).where(eq(skjema.tekst.id, gammel.id));
    await db.update(skjema.tekst).set({ opprettet: new Date(Date.now() - 2 * DAG) }).where(eq(skjema.tekst.id, ny.id));

    let bord = await a.hentArbeidsbord(t);
    expect(bord.map((b) => b.tittel)).toEqual(["Ny", "Gammel"]);
    expect(bord[1]).toMatchObject({ tilstand: "innlest", antallFagord: null, sisteQuiz: null, samtale: null, harMinnevers: false });

    // Den gamle teksten låses og brukes: den blir hovedbunken.
    await lagreForkunnskapssvar(t, gammel.id, "Noe om celler.");
    const laast = await laasTekst(t, gammel.id, TEKST);
    const [avsnitt] = await db.select().from(skjema.avsnitt).where(eq(skjema.avsnitt.tekstId, laast.id)).limit(1);
    const [sett] = await db.insert(skjema.begrepssett).values({ tekstId: laast.id, promptversjon: "v1", modell: "m" }).returning();
    await db.insert(skjema.begrep).values([
      { begrepssettId: sett.id, uttrykk: "mitose", forklaring: "x", viktighetsrangering: 1, kildeavsnittId: avsnitt.id, merking: "kan" },
      { begrepssettId: sett.id, uttrykk: "meiose", forklaring: "x", viktighetsrangering: 2, kildeavsnittId: avsnitt.id, merking: "maa_oeve" },
      { begrepssettId: sett.id, uttrykk: "celle", forklaring: "x", viktighetsrangering: 3, kildeavsnittId: avsnitt.id },
    ]);
    const [q] = await db.insert(skjema.quiz).values({ tekstId: laast.id, promptversjon: "v1", modell: "m" }).returning();
    await db.insert(skjema.quizforsoek).values([
      { quizId: q.id, svar: "[]", antallRiktige: 3, antallTotalt: 8, gjennomfoert: new Date(Date.now() - 3 * DAG) },
      { quizId: q.id, svar: "[]", antallRiktige: 6, antallTotalt: 8, gjennomfoert: new Date(Date.now() - DAG) },
    ]);
    const [s] = await db.insert(skjema.fagsamtale).values({ tekstId: laast.id, promptversjon: "v1", modell: "m" }).returning();
    await db.insert(skjema.samtalerunde).values([
      { fagsamtaleId: s.id, nummer: 1, sporsmal: "?", kildeavsnittId: avsnitt.id, maal: "nytt_aspekt", elevsvar: "svar" },
      { fagsamtaleId: s.id, nummer: 2, sporsmal: "?", kildeavsnittId: avsnitt.id, maal: "nytt_aspekt" },
    ]);

    bord = await a.hentArbeidsbord(t);
    expect(bord.map((b) => b.tittel)).toEqual(["Gammel", "Ny"]);
    expect(bord[0]).toMatchObject({
      tilstand: "laast",
      antallFagord: 3,
      antallKan: 1,
      antallMerket: 2,
      sisteQuiz: { antallRiktige: 6, antallTotalt: 8 },
      samtale: { id: s.id, avsluttet: false, besvarteRunder: 1 },
      harMinnevers: false,
    });
    expect(a.nesteSteg(bord[0]).tekst).toBe("Fortsett: Fagsamtale, runde 2 av 6");

    await db.insert(skjema.minnevers).values({ tekstId: laast.id, innhold: "{}", promptversjon: "v1", modell: "m" });
    expect((await a.hentArbeidsbord(t))[0].harMinnevers).toBe(true);
  });

  /** En konto med to låste tekster, A og B, der B sist var aktiv (for 4 og 5 dager siden). */
  async function toLaasteTekster() {
    const t = await nyKonto();
    const laast = [];
    for (const [tittel, dager] of [["A", 5], ["B", 4]] as const) {
      const ny = await opprettTekst(t, { tittel, raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
      await lagreForkunnskapssvar(t, ny.id, "Noe.");
      await laasTekst(t, ny.id, TEKST);
      const da = new Date(Date.now() - dager * DAG);
      await db.update(skjema.tekst).set({ opprettet: da, laastTidspunkt: da }).where(eq(skjema.tekst.id, ny.id));
      const [av] = await db.select().from(skjema.avsnitt).where(eq(skjema.avsnitt.tekstId, ny.id)).limit(1);
      laast.push({ id: ny.id, avsnittId: av.id });
    }
    const titler = async () => (await a.hentArbeidsbord(t)).map((b) => b.tittel);
    expect(await titler()).toEqual(["B", "A"]);
    return { t, a: laast[0], titler };
  }

  test("sist aktiv: et nytt quizforsøk alene snur rekkefølgen", async () => {
    const { a: tekstA, titler } = await toLaasteTekster();
    const [q] = await db.insert(skjema.quiz).values({ tekstId: tekstA.id, promptversjon: "v1", modell: "m" }).returning();
    await db.insert(skjema.quizforsoek).values({ quizId: q.id, svar: "[]", antallRiktige: 5, antallTotalt: 8 });
    expect(await titler()).toEqual(["A", "B"]);
  });

  test("sist aktiv: en ny samtalerunde alene snur rekkefølgen", async () => {
    const { a: tekstA, titler } = await toLaasteTekster();
    // Samtalen ble startet for lenge siden, så den alene endrer ingenting.
    const [s] = await db
      .insert(skjema.fagsamtale)
      .values({ tekstId: tekstA.id, promptversjon: "v1", modell: "m", opprettet: new Date(Date.now() - 9 * DAG) })
      .returning();
    expect(await titler()).toEqual(["B", "A"]);
    await db.insert(skjema.samtalerunde).values({ fagsamtaleId: s.id, nummer: 1, sporsmal: "?", kildeavsnittId: tekstA.avsnittId, maal: "nytt_aspekt" });
    expect(await titler()).toEqual(["A", "B"]);
  });

  test("sist aktiv: et nytt minnevers alene snur rekkefølgen", async () => {
    const { a: tekstA, titler } = await toLaasteTekster();
    await db.insert(skjema.minnevers).values({ tekstId: tekstA.id, innhold: "{}", promptversjon: "v1", modell: "m" });
    expect(await titler()).toEqual(["A", "B"]);
  });

  test("en eldre åpen samtale går foran en nyere avsluttet, og neste steg fortsetter den", async () => {
    const { t, a: tekstA } = await toLaasteTekster();
    const naa = Date.now();
    const [aapen] = await db
      .insert(skjema.fagsamtale)
      .values({ tekstId: tekstA.id, promptversjon: "v1", modell: "m", opprettet: new Date(naa - 3 * DAG) })
      .returning();
    await db.insert(skjema.samtalerunde).values([
      { fagsamtaleId: aapen.id, nummer: 1, sporsmal: "?", kildeavsnittId: tekstA.avsnittId, maal: "nytt_aspekt", elevsvar: "svar", opprettet: new Date(naa - 3 * DAG) },
      { fagsamtaleId: aapen.id, nummer: 2, sporsmal: "?", kildeavsnittId: tekstA.avsnittId, maal: "nytt_aspekt", opprettet: new Date(naa - 3 * DAG) },
    ]);
    await db
      .insert(skjema.fagsamtale)
      .values({ tekstId: tekstA.id, promptversjon: "v1", modell: "m", opprettet: new Date(naa - DAG), avsluttet: new Date(naa - DAG) });

    const bunke = (await a.hentArbeidsbord(t)).find((b) => b.id === tekstA.id)!;
    expect(bunke.samtale).toEqual({ id: aapen.id, avsluttet: false, besvarteRunder: 1 });
    expect(a.nesteSteg(bunke)).toMatchObject({ tekst: "Fortsett: Fagsamtale, runde 2 av 6", href: `/tekst/${tekstA.id}/samtale/${aapen.id}` });
  });

  test("et tomt Begrepssett gir 0 fagord, ikke null", async () => {
    const t = await nyKonto();
    const ny = await opprettTekst(t, { tittel: "Tom", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
    await db.insert(skjema.begrepssett).values({ tekstId: ny.id, promptversjon: "v1", modell: "m" });
    expect((await a.hentArbeidsbord(t))[0].antallFagord).toBe(0);
  });
});
