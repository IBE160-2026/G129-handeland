/**
 * Handlingene i fagsamtalen når KI-kallet feiler — FR-19, FR-20, FR-22.
 *
 * Mot en ekte Postgres i minnet (PGlite), som datatestene, med Next og
 * innloggingen byttet ut (mønsteret i data/konto.test.ts) og en falsk
 * modellklient (testmodus av). Modellen kalles aldri (AD-5).
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import * as skjema from "../data/skjema";

const { innlogget, kapsler, tilgang, revalidatePath, Omdirigert } = vi.hoisted(() => {
  const innlogget = { kontoId: "" };
  const verdier = new Map<string, string>();
  return {
    innlogget,
    /** Informasjonskapslene, med formen til Nexts `cookies()`: `get` gir `{ name, value }`. */
    kapsler: {
      verdier,
      get: (name: string) => (verdier.has(name) ? { name, value: verdier.get(name)! } : undefined),
      has: (name: string) => verdier.has(name),
      set: (name: string, value: string) => void verdier.set(name, value),
      delete: (name: string) => void verdier.delete(name),
    },
    /** Styrbar per test; standard er den innloggede kontoen. */
    tilgang: vi.fn(async () => innlogget),
    revalidatePath: vi.fn(),
    Omdirigert: class Omdirigert extends Error {
      constructor(readonly adresse: string) {
        super(`omdirigert til ${adresse}`);
      }
    },
  };
});
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("next/headers", () => ({ cookies: async () => kapsler, headers: async () => new Headers() }));
vi.mock("next/navigation", () => ({
  redirect: (adresse: string) => {
    throw new Omdirigert(adresse);
  },
}));
vi.mock("../data/konto", () => ({ tilgang: () => tilgang() }));

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const h = await import("./handlinger");
const f = await import("../data/fagsamtale");
const { godkjennOverskrifter, opprettTekst, lagreForkunnskapssvar } = await import("../data/tilgang");
const { laasTekst } = await import("../tekst/las");
const { settKlientForTest } = await import("../generatorer/kontrakt");
const { KI_FEIL } = await import("./kifeil");
const { GRENSE_FEIL } = await import("../data/grenser");
const { hentQuiz } = await import("../data/quiz");
const { hentLaast } = await import("../tekst/las");
const { hentBegrepssett, lagreBegrepssett } = await import("../data/begrepssett");
const { velgMorsmaal } = await import("../data/morsmaal");

const TEKST =
  "Mikrobølger\n\nMikrobølger får vannmolekyler til å riste.\n\nDerfor blir maten varm.\n\n" +
  "Tallerkenen\n\nEn tallerken uten vann blir ikke varm.";
// 1 overskrift, 2-3 brødtekst, 4 overskrift, 5 brødtekst

const SVAR = "Vannmolekylene rister og blir varme.";
const ugyldig = { parsed_output: null, stop_reason: "max_tokens", usage: { output_tokens: 16000 } };
const svar = (data: unknown) => ({ parsed_output: data, stop_reason: "end_turn", usage: { output_tokens: 100 } });
const vurdering = (maal: string) => ({
  tilstand: "dekkende",
  begrunnelse: "Du forklarer godt at vannmolekylene rister.",
  oppfolging: { sporsmal: "Hva skjer med en tallerken uten vann når vannmolekylene rister?", kildeavsnitt: 5, maal },
});

let n = 0;
async function nySamtale() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `h${++n}@test.no` }).returning({ id: skjema.user.id });
  innlogget.kontoId = u.id;
  const ny = await opprettTekst(innlogget, { tittel: "Mikrobølger", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
  await lagreForkunnskapssvar(innlogget, ny.id, { lurerPaa: "Noe om ovner." });
  const laast = await laasTekst(innlogget, ny.id, TEKST);
  const id = await f.opprettFagsamtale(laast, {
    sporsmal: "Hvorfor blir maten varm?",
    kildeavsnittNummer: 3,
    promptversjon: "samtalestart:v1",
    modell: "testmodell",
  });
  return { id, tekstId: ny.id };
}

/** Sender svaret som skjemaet gjør, og gir adressen handlingen omdirigerte til (eller null). */
async function send(samtaleId: string, nummer: number, tekst: string): Promise<string | null> {
  const data = new FormData();
  data.set("svar", tekst);
  try {
    const r = await h.svarISamtale(samtaleId, nummer, {}, data);
    expect(r.feil).toBeUndefined();
    return null;
  } catch (e) {
    if (e instanceof Omdirigert) return e.adresse;
    throw e;
  }
}

let foerModus: string | undefined;
beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});
beforeEach(async () => {
  // PRD §6.4: kallene registreres, og summen skal ikke vokse mot taket over testene.
  await db.delete(skjema.forbruk);
  foerModus = process.env.LESEVENN_TESTMODUS;
  process.env.LESEVENN_TESTMODUS = "av";
  vi.spyOn(console, "warn").mockImplementation(() => {});
  kapsler.verdier.clear();
  revalidatePath.mockClear();
  tilgang.mockImplementation(async () => innlogget);
});
afterEach(() => {
  settKlientForTest(null);
  vi.restoreAllMocks();
  if (foerModus === undefined) delete process.env.LESEVENN_TESTMODUS;
  else process.env.LESEVENN_TESTMODUS = foerModus;
});

describe("svarISamtale når KI-kallet feiler", () => {
  test("FR-19: vurderingen feiler to ganger — svaret er lagret uten vurdering, og siden får vite det", async () => {
    const { id, tekstId } = await nySamtale();
    const parse = vi.fn().mockResolvedValue(ugyldig);
    settKlientForTest({ messages: { parse } });

    const adresse = await send(id, 1, SVAR);
    expect(adresse).toBe(`/tekst/${tekstId}/samtale/${id}?feil=vurdering&kode=ugyldig_utdata`);
    expect(parse).toHaveBeenCalledTimes(2); // ett nytt forsøk, ikke flere

    const s = await f.hentFagsamtale(innlogget, id);
    expect(s.runder).toHaveLength(1);
    expect(s.runder[0]).toMatchObject({ elevsvar: SVAR, svarvurdering: null });
    expect(s.avsluttet).toBeNull();
    // Runden telles ikke (FR-22).
    expect((await f.listFagsamtaler(innlogget, tekstId))[0].antallRunder).toBe(0);
  });

  test("FR-19, «Prøv igjen»: det lagrede svaret vurderes, og samtalen går videre", async () => {
    const { id } = await nySamtale();
    settKlientForTest({ messages: { parse: vi.fn().mockResolvedValue(ugyldig) } });
    await send(id, 1, SVAR);

    settKlientForTest({ messages: { parse: vi.fn().mockResolvedValue(svar(vurdering("nytt_aspekt"))) } });
    expect(await h.vurderLagretSvar(id, 1)).toEqual({});
    const s = await f.hentFagsamtale(innlogget, id);
    expect(s.runder.map((r) => [r.nummer, r.elevsvar, r.svarvurdering])).toEqual([
      [1, SVAR, "dekkende"],
      [2, null, null],
    ]);
  });

  test("FR-20: oppfølgingen holder ikke — vurderingen lagres, samtalen er åpen og uten runde 2", async () => {
    const { id, tekstId } = await nySamtale();
    // «deler_opp» passer ikke tilstanden «dekkende» (FR-19): et hardt brudd i oppfølgingen.
    settKlientForTest({ messages: { parse: vi.fn().mockResolvedValue(svar(vurdering("deler_opp"))) } });

    expect(await send(id, 1, SVAR)).toBe(`/tekst/${tekstId}/samtale/${id}?feil=oppfolging`);
    const s = await f.hentFagsamtale(innlogget, id);
    expect(s.avsluttet).toBeNull();
    expect(s.runder).toHaveLength(1);
    expect(s.runder[0]).toMatchObject({ elevsvar: SVAR, svarvurdering: "dekkende" });

    // «Prøv igjen» for neste spørsmål: oppfølgingen som passer, legges til.
    settKlientForTest({ messages: { parse: vi.fn().mockResolvedValue(svar(vurdering("nytt_aspekt"))) } });
    expect(await h.lagNesteSporsmal(id, 1)).toEqual({});
    expect((await f.hentFagsamtale(innlogget, id)).runder.map((r) => r.nummer)).toEqual([1, 2]);
    // Et forsøk til (en fane til) er ikke en feil: neste spørsmål finnes alt.
    expect(await h.lagNesteSporsmal(id, 1)).toEqual({});
  });

  test("en feil som ikke prøves på nytt (429), bærer koden sin til siden", async () => {
    const { id, tekstId } = await nySamtale();
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const parse = vi.fn().mockRejectedValue(new Anthropic.RateLimitError(429, undefined, "for mange", new Headers()));
    settKlientForTest({ messages: { parse } });
    expect(await send(id, 1, SVAR)).toBe(`/tekst/${tekstId}/samtale/${id}?feil=vurdering&kode=for_mange_kall`);
    expect(parse).toHaveBeenCalledTimes(1);
  });
});

describe("revurderRunde (FR-22)", () => {
  test("en runde uten vurdering avvises, uten modellkall og uten å bruke opp den nye vurderingen", async () => {
    const { id } = await nySamtale();
    settKlientForTest({ messages: { parse: vi.fn().mockResolvedValue(ugyldig) } });
    await send(id, 1, SVAR);

    const parse = vi.fn();
    settKlientForTest({ messages: { parse } });
    expect(await h.revurderRunde(id, 1)).toEqual({ feil: KI_FEIL.vurdering });
    expect(parse).not.toHaveBeenCalled();
    expect((await f.hentFagsamtale(innlogget, id)).runder[0]).toMatchObject({ svarvurdering: null, revurdert: false });
  });

  test("oppfølgingen feiler, og neste spørsmål er ubesvart: ingenting lagres, og den gamle vurderingen står", async () => {
    const { id } = await nySamtale();
    settKlientForTest({ messages: { parse: vi.fn().mockResolvedValue(svar(vurdering("nytt_aspekt"))) } });
    await send(id, 1, SVAR);

    const ny = { ...vurdering("nytt_aspekt"), tilstand: "delvis", begrunnelse: "Noe sentralt mangler." }; // maal passer ikke «delvis»
    settKlientForTest({ messages: { parse: vi.fn().mockResolvedValue(svar(ny)) } });
    expect(await h.revurderRunde(id, 1)).toEqual({ feil: KI_FEIL.oppfolging });
    const s = await f.hentFagsamtale(innlogget, id);
    expect(s.runder[0]).toMatchObject({ svarvurdering: "dekkende", revurdert: false });
    expect(s.runder).toHaveLength(2);
  });
});

/* ------------------------------------------------------------------ *
 * PRD §6.4 — bruksgrensene
 * ------------------------------------------------------------------ */

/** Åtte gyldige spørsmål til TEKST: sju flervalg og ett kortsvar, på brødtekstavsnittene 2, 3 og 5. */
const QUIZ = {
  sporsmal: [
    ...[2, 3, 5, 2, 3, 5, 2].map((kildeavsnitt, i) => ({
      type: "flervalg",
      sporsmal: `Spørsmål ${i + 1} om mikrobølger?`,
      alternativer: [`Riktig ${i}`, `Feil a${i}`, `Feil b${i}`, `Feil c${i}`],
      riktigSvar: `Riktig ${i}`,
      kildeavsnitt,
    })),
    { type: "kortsvar", sporsmal: "Hvorfor blir maten varm?", alternativer: [], riktigSvar: "Vannet rister.", kildeavsnitt: 3 },
  ],
};

/** Radene for API-kall (ikke hendelsene for ny Tekst og ny Fagsamtale). */
async function apiKall() {
  return (await db.select().from(skjema.forbruk)).filter((r) => r.hendelse === null);
}

/** Dagens forbruk over taket på 30 kr. */
async function overTaket() {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  await db.insert(skjema.forbruk).values({ oppgave: "test", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 3_000_000 });
}

async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `g${++n}@test.no` }).returning({ id: skjema.user.id });
  innlogget.kontoId = u.id;
}

async function nyLaastTekst() {
  await nyKonto();
  const ny = await opprettTekst(innlogget, { tittel: "Mikrobølger", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
  await lagreForkunnskapssvar(innlogget, ny.id, { lurerPaa: "Noe om ovner." });
  await laasTekst(innlogget, ny.id, TEKST);
  return ny.id;
}

describe("bruksgrensene (PRD §6.4)", () => {
  test("en fullført quizlaging gir én rad i forbruk per API-kall, med tokens og kostnad", async () => {
    const tekstId = await nyLaastTekst();
    const bruk = { input_tokens: 2000, output_tokens: 1500 };
    // Første svar ugyldig, så ett nytt forsøk: to kall, to rader.
    settKlientForTest({
      messages: {
        parse: vi
          .fn()
          .mockResolvedValueOnce({ ...ugyldig, usage: bruk })
          .mockResolvedValueOnce({ parsed_output: QUIZ, stop_reason: "end_turn", usage: bruk }),
      },
    });
    expect(await h.lagQuiz(tekstId, {})).toEqual({});
    expect(await hentQuiz(innlogget, tekstId)).not.toBeNull();
    const rader = await apiKall();
    expect(rader).toHaveLength(2);
    for (const r of rader) {
      expect(r).toMatchObject({
        kontoId: innlogget.kontoId,
        oppgave: "quiz",
        modell: "claude-haiku-5-5",
        tokensInn: 2000,
        tokensUt: 1500,
      });
      // Haiku: 2000 × 0,10 + 1500 × 0,50 = 950 mikrodollar.
      expect(r.mikrodollar).toBe(950);
    }
  });

  test("taket er nådd: modellen kalles ikke, og eleven får takmeldingen uten «Prøv igjen»", async () => {
    const tekstId = await nyLaastTekst();
    await db.insert(skjema.forbruk).values({ oppgave: "quiz", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 2_857_143 });
    const parse = vi.fn();
    settKlientForTest({ messages: { parse } });
    expect(await h.lagQuiz(tekstId, {})).toEqual({ feil: GRENSE_FEIL.taket });
    expect(parse).not.toHaveBeenCalled();
    expect(await hentQuiz(innlogget, tekstId)).toBeNull();
  });

  test("taket midt i en samtale: svaret lagres, ingen modellkall, og siden får takkoden", async () => {
    const { id, tekstId } = await nySamtale();
    await db.insert(skjema.forbruk).values({ oppgave: "quiz", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 5_000_000 });
    const parse = vi.fn();
    settKlientForTest({ messages: { parse } });
    expect(await send(id, 1, SVAR)).toBe(`/tekst/${tekstId}/samtale/${id}?feil=vurdering&kode=dagstak`);
    expect(parse).not.toHaveBeenCalled();
    expect((await f.hentFagsamtale(innlogget, id)).runder[0].elevsvar).toBe(SVAR);
  });

  test("sjette tekst i dag: handlingen avviser, også ved en direkte POST", async () => {
    const [u] = await db.insert(skjema.user).values({ name: "", email: `g${++n}@test.no` }).returning({ id: skjema.user.id });
    innlogget.kontoId = u.id;
    for (let i = 0; i < 5; i++) {
      await opprettTekst(innlogget, { tittel: "T", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
    }
    const data = new FormData();
    data.set("tittel", "Den sjette");
    data.set("tekst", `${TEKST}\n\n${"Mer tekst om mikrobølger og varme. ".repeat(20)}`);
    expect(await h.limInnTekst({}, data)).toEqual({ feil: GRENSE_FEIL.tekster });
  });

  test("sjette tekst i dag via PDF og via bilde: handlingene avviser også", async () => {
    await nyKonto();
    for (let i = 0; i < 5; i++) {
      await opprettTekst(innlogget, { tittel: "T", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
    }
    const pdf = new FormData();
    const parse = vi.fn();
    settKlientForTest({ messages: { parse } });
    pdf.set("tittel", "Den sjette");
    pdf.set("raatekst", TEKST);
    pdf.set(
      "rapport",
      JSON.stringify({ sider: 1, fjernedeLinjer: [], sammenslaatteOrddelinger: 0, muligTabellEllerFormel: false }),
    );
    expect(await h.limInnPdf({}, pdf)).toEqual({ feil: GRENSE_FEIL.tekster });

    const bilde = new FormData();
    bilde.set("tittel", "Den sjette");
    bilde.set("raatekst", TEKST);
    expect(await h.limInnBilde({}, bilde)).toEqual({ feil: GRENSE_FEIL.tekster });

    // Ingen av dem ble lagret, modellen ble ikke kalt, og ingenting ble registrert som forbruk.
    expect(await db.select().from(skjema.tekst).where(eq(skjema.tekst.kontoId, innlogget.kontoId))).toHaveLength(5);
    expect(parse).not.toHaveBeenCalled();
    expect(await apiKall()).toHaveLength(0);
    expect(await db.select().from(skjema.forbruk).where(eq(skjema.forbruk.kontoId, innlogget.kontoId))).toHaveLength(5);
  });

  test("sjette fagsamtale i dag: avvist før første spørsmål lages", async () => {
    const tekstId = await nyLaastTekst();
    const laast = await hentLaast(innlogget, tekstId);
    for (let i = 0; i < 5; i++) {
      await f.opprettFagsamtale(laast, { sporsmal: "Hvorfor?", kildeavsnittNummer: 3, promptversjon: "v", modell: "m" });
    }
    const parse = vi.fn();
    settKlientForTest({ messages: { parse } });
    expect(await h.startFagsamtale(tekstId, {})).toEqual({ feil: GRENSE_FEIL.samtaler });
    expect(parse).not.toHaveBeenCalled();
  });
});

/** En samtale med første runde besvart og vurdert, uten neste spørsmål. */
async function vurdertSamtale() {
  const s = await nySamtale();
  await f.lagreElevsvar(innlogget, s.id, 1, SVAR);
  await f.lagreVurdering(innlogget, s.id, 1, { tilstand: "dekkende", begrunnelse: "Godt forklart." }, "mangler");
  return s;
}

const UTEN_OVERSKRIFTER =
  "Mikrobølger får vannmolekylene i maten til å riste, og da blir maten varm.\n\n" +
  "En tallerken uten vann blir ikke varm, fordi den ikke har noe som kan riste.\n\n" +
  "Derfor kan du ta tallerkenen ut med bare hender etter at maten er varmet.";

/**
 * Handlingene som kaller modellen, utenom quizen og samtalesvaret over.
 * `forbered` lager det handlingen trenger og gir tilbake kallet.
 */
const HANDLINGER: { navn: string; oppgave: string; forbered: () => Promise<() => Promise<{ feil?: unknown }>> }[] = [
  {
    navn: "genererPaaNytt",
    oppgave: "faguttrykk",
    forbered: async () => {
      const id = await nyLaastTekst();
      return () => h.genererPaaNytt(id);
    },
  },
  {
    navn: "lagOppsummering",
    oppgave: "oppsummering",
    forbered: async () => {
      const { tekstId } = await vurdertSamtale();
      return () => h.lagOppsummering(tekstId, {});
    },
  },
  {
    navn: "lagOversettelse",
    oppgave: "oversettelse",
    forbered: async () => {
      const id = await nyLaastTekst();
      await velgMorsmaal(innlogget, "uk");
      return () => h.lagOversettelse(id, "overskrifter");
    },
  },
  {
    navn: "lagVers",
    oppgave: "minnevers",
    forbered: async () => {
      const id = await nyLaastTekst();
      const begreper = ["mikrobølger", "vannmolekyler", "tallerken"].map((uttrykk, i) => ({
        uttrykk,
        forklaring: `Forklaring av ${uttrykk}.`,
        viktighetsrangering: i + 1,
        kildeavsnittNummer: i === 2 ? 5 : 2,
        forekomster: [],
      }));
      await lagreBegrepssett(await hentLaast(innlogget, id), {
        begreper,
        promptversjon: "v",
        modell: "m",
      } as unknown as Parameters<typeof lagreBegrepssett>[1]);
      return () => h.lagVers(id, "vers", {});
    },
  },
  {
    navn: "lagEtiketterHandling",
    oppgave: "etiketter",
    forbered: async () => {
      await nyKonto();
      const ny = await opprettTekst(innlogget, {
        tittel: "Mikrobølger",
        raatekst: UTEN_OVERSKRIFTER,
        redigertTekst: UTEN_OVERSKRIFTER,
        vei: "liming",
      });
      return () => h.lagEtiketterHandling(ny.id);
    },
  },
  {
    navn: "revurderRunde",
    oppgave: "svarvurdering",
    forbered: async () => {
      const { id } = await vurdertSamtale();
      return () => h.revurderRunde(id, 1);
    },
  },
  {
    navn: "lagNesteSporsmal",
    oppgave: "svarvurdering",
    forbered: async () => {
      const { id } = await vurdertSamtale();
      return () => h.lagNesteSporsmal(id, 1);
    },
  },
];

describe("bruksgrensene, for hver handling som kaller modellen (PRD §6.4)", () => {
  for (const { navn, oppgave, forbered } of HANDLINGER) {
    test(`${navn}: kallene registreres med oppgave «${oppgave}» og kontoen`, async () => {
      const kall = await forbered();
      const parse = vi.fn().mockResolvedValue({ ...ugyldig, usage: { input_tokens: 500, output_tokens: 100 } });
      settKlientForTest({ messages: { parse } });
      await kall();
      expect(parse).toHaveBeenCalled();
      const rader = await apiKall();
      expect(rader).toHaveLength(parse.mock.calls.length);
      for (const r of rader) expect(r).toMatchObject({ oppgave, kontoId: innlogget.kontoId, tokensInn: 500, tokensUt: 100 });
    });

    test(`${navn}: over taket kalles ikke modellen, og svaret er takmeldingen`, async () => {
      const kall = await forbered();
      await overTaket();
      const parse = vi.fn();
      settKlientForTest({ messages: { parse } });
      expect(await kall()).toEqual({ feil: GRENSE_FEIL.taket });
      expect(parse).not.toHaveBeenCalled();
    });
  }

  test("vakten: taket nås midt i en handling, og neste kall gjøres ikke", async () => {
    const { id } = await vurdertSamtale();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    // Første kall koster over taket (Sonnet, 300 000 tokens ut = 31,5 kr) og er ugyldig.
    const parse = vi.fn().mockResolvedValue({ ...ugyldig, usage: { input_tokens: 0, output_tokens: 300_000 } });
    settKlientForTest({ messages: { parse } });
    expect(await h.revurderRunde(id, 1)).toEqual({ feil: GRENSE_FEIL.taket });
    expect(parse).toHaveBeenCalledOnce();
    expect(await apiKall()).toHaveLength(1);
  });

  test("sletting nullstiller ikke tekstgrensen", async () => {
    await nyKonto();
    const ider: string[] = [];
    for (let i = 0; i < 5; i++) {
      ider.push((await opprettTekst(innlogget, { tittel: "T", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" })).id);
    }
    expect(await h.slett(ider[0])).toEqual({ slettet: true });
    const data = new FormData();
    data.set("tekst", `${TEKST}\n\n${"Mer tekst om mikrobølger og varme. ".repeat(20)}`);
    expect(await h.limInnTekst({}, data)).toEqual({ feil: GRENSE_FEIL.tekster });
  });
});

/* ------------------------------------------------------------------ *
 * FR-3 (endret 11.11) og FR-6 — aktiveringen av innlimt tekst låser
 * ------------------------------------------------------------------ */

/** En innlimt tekst med godkjente overskrifter, klar for aktiveringen. */
async function innlimtTekst(redigert = TEKST) {
  await nyKonto();
  const ny = await opprettTekst(innlogget, { tittel: "Mikrobølger", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
  await godkjennOverskrifter(innlogget, ny.id, redigert);
  return ny.id;
}

/**
 * Sender aktiveringen som skjemaet gjør: gir adressen den omdirigerte til,
 * eller svaret. Standard er et spørsmål og ingen merker (FR-6, endret 17.11).
 */
async function aktiver(
  tekstId: string,
  felt: Record<string, string> = { lurerPaa: "Noe om ovner og varme." },
): Promise<{ adresse?: string; svar?: unknown }> {
  const data = new FormData();
  for (const [navn, verdi] of Object.entries(felt)) data.set(navn, verdi);
  try {
    return { svar: await h.lagreAktivering(tekstId, {}, data) };
  } catch (e) {
    if (e instanceof Omdirigert) return { adresse: e.adresse };
    throw e;
  }
}

async function tilstand(tekstId: string) {
  const [rad] = await db.select().from(skjema.tekst).where(eq(skjema.tekst.id, tekstId));
  return rad.tilstand;
}

describe("lagreAktivering for innlimt tekst (FR-3, FR-6)", () => {
  test("vellykket: teksten låses, fagordene lagres, og eleven sendes til lesevisningen", async () => {
    const tekstId = await innlimtTekst();
    const parse = vi.fn().mockResolvedValue(
      svar({
        faguttrykk: [
          { uttrykk: "vannmolekyler", forklaring: "De minste delene av vann.", viktighetsrangering: 1, kildeavsnitt: 2 },
        ],
      }),
    );
    settKlientForTest({ messages: { parse } });

    expect(await aktiver(tekstId)).toEqual({ adresse: `/tekst/${tekstId}/lesing` });
    expect(await tilstand(tekstId)).toBe("laast");
    const sett = await hentBegrepssett(innlogget, tekstId);
    expect(sett?.begreper.map((b) => b.uttrykk)).toEqual(["vannmolekyler"]);
  });

  test("låsingen feiler: feilen vises på aktiveringen, teksten står som aktivert, og modellen kalles ikke", async () => {
    // Bare blanke linjer gir ingen avsnitt, og laasTekst nekter å låse.
    const tekstId = await innlimtTekst("   \n\n   ");
    const parse = vi.fn();
    settKlientForTest({ messages: { parse } });

    const { adresse, svar: r } = await aktiver(tekstId);
    expect(adresse).toBeUndefined();
    expect(r).toMatchObject({ feil: { melding: "Teksten kunne ikke låses." } });
    expect(await tilstand(tekstId)).toBe("aktivert");
    expect(parse).not.toHaveBeenCalled();
  });

  test("nytt forsøk etter låsefeil: teksten blir i aktiveringen (ikke gjennomsynet), og et nytt trykk låser den", async () => {
    const tekstId = await innlimtTekst("   \n\n   ");
    settKlientForTest({ messages: { parse: vi.fn() } });
    expect((await aktiver(tekstId)).svar).toMatchObject({ feil: { melding: "Teksten kunne ikke låses." } });
    expect(await tilstand(tekstId)).toBe("aktivert");

    // Det som stoppet låsingen, er borte (her: teksten er rettet i databasen).
    await db.update(skjema.tekst).set({ redigertTekst: TEKST }).where(eq(skjema.tekst.id, tekstId));
    settKlientForTest({
      messages: {
        parse: vi.fn().mockResolvedValue(
          svar({ faguttrykk: [{ uttrykk: "vannmolekyler", forklaring: "Vann.", viktighetsrangering: 1, kildeavsnitt: 2 }] }),
        ),
      },
    });
    // Skjemaet for nytt forsøk sender ikke svaret på nytt; det første er lagret.
    const data = new FormData();
    let adresse: string | undefined;
    try {
      await h.lagreAktivering(tekstId, {}, data);
    } catch (e) {
      if (!(e instanceof Omdirigert)) throw e;
      adresse = e.adresse;
    }
    expect(adresse).toBe(`/tekst/${tekstId}/lesing`);
    expect(await tilstand(tekstId)).toBe("laast");
    const [rad] = await db.select().from(skjema.tekst).where(eq(skjema.tekst.id, tekstId));
    expect(rad.lurerPaa).toBe("Noe om ovner og varme.");
  });

  test("genereringen feiler: teksten er låst uten fagord, og lesevisningen får feilkoden", async () => {
    const tekstId = await innlimtTekst();
    settKlientForTest({ messages: { parse: vi.fn().mockResolvedValue(ugyldig) } });

    expect(await aktiver(tekstId)).toEqual({ adresse: `/tekst/${tekstId}/lesing?fagordfeil=ugyldig_utdata` });
    expect(await tilstand(tekstId)).toBe("laast");
    expect(await hentBegrepssett(innlogget, tekstId)).toBeNull();
  });
});

/* ------------------------------------------------------------------ *
 * FR-6 (endret 17.11) — merking av overskriftene og «lurer på»
 * ------------------------------------------------------------------ */

/**
 * En PDF-tekst med godkjente overskrifter. PDF går til gjennomsynet etter
 * aktiveringen, uten låsing og uten modellkall, så bare forkunnskapen prøves.
 * TEKST har overskriftene «Mikrobølger» (1) og «Tallerkenen» (4).
 */
async function pdfTekst(redigert = TEKST) {
  await nyKonto();
  const ny = await opprettTekst(innlogget, { tittel: "Mikrobølger", raatekst: redigert, redigertTekst: redigert, vei: "pdf" });
  await godkjennOverskrifter(innlogget, ny.id, redigert);
  return ny.id;
}

async function rad(tekstId: string) {
  const [r] = await db.select().from(skjema.tekst).where(eq(skjema.tekst.id, tekstId));
  return r;
}

describe("lagreAktivering: forkunnskapen (FR-6, endret 17.11)", () => {
  test("alt fylt ut: merkene lagres med overskriftens tekst, spørsmålet lagres, og teksten blir aktivert", async () => {
    const tekstId = await pdfTekst();
    const r = await aktiver(tekstId, { "merke-1": "kjent", "merke-4": "nytt", lurerPaa: "  Hvorfor blir maten varm?  " });
    expect(r).toEqual({ adresse: `/tekst/${tekstId}/gjennomsyn` });
    const lagret = await rad(tekstId);
    expect(lagret.tilstand).toBe("aktivert");
    expect(lagret.forkunnskapMerking).toEqual([
      { overskrift: "Mikrobølger", merke: "kjent" },
      { overskrift: "Tallerkenen", merke: "nytt" },
    ]);
    expect(lagret.lurerPaa).toBe("Hvorfor blir maten varm?");
    expect(lagret.forkunnskapssvar).toBeNull();
  });

  test("innlimt tekst, alt fylt ut: teksten låses som før, og forkunnskapen er lagret", async () => {
    const tekstId = await innlimtTekst();
    settKlientForTest({
      messages: {
        parse: vi.fn().mockResolvedValue(
          svar({ faguttrykk: [{ uttrykk: "vannmolekyler", forklaring: "Vann.", viktighetsrangering: 1, kildeavsnitt: 2 }] }),
        ),
      },
    });
    const r = await aktiver(tekstId, { "merke-1": "litt", "merke-4": "nytt", lurerPaa: "Hvorfor blir maten varm?" });
    expect(r).toEqual({ adresse: `/tekst/${tekstId}/lesing` });
    const lagret = await rad(tekstId);
    expect(lagret.tilstand).toBe("laast");
    expect(lagret.forkunnskapMerking).toEqual([
      { overskrift: "Mikrobølger", merke: "litt" },
      { overskrift: "Tallerkenen", merke: "nytt" },
    ]);
    expect(lagret.lurerPaa).toBe("Hvorfor blir maten varm?");
  });

  test("bare merking: lagres uten oppfordring, og umerkede overskrifter lagres ikke", async () => {
    const tekstId = await pdfTekst();
    expect(await aktiver(tekstId, { "merke-4": "litt" })).toEqual({ adresse: `/tekst/${tekstId}/gjennomsyn` });
    const lagret = await rad(tekstId);
    expect(lagret.forkunnskapMerking).toEqual([{ overskrift: "Tallerkenen", merke: "litt" }]);
    expect(lagret.lurerPaa).toBeNull();
  });

  test("ingenting: første gang én oppfordring, andre gang lagres tom forkunnskap", async () => {
    const tekstId = await pdfTekst();
    const foerste = await aktiver(tekstId, { lurerPaa: "   " });
    expect(foerste.adresse).toBeUndefined();
    expect(foerste.svar).toMatchObject({ feil: { melding: "Du har ikke merket noe ennå." } });
    expect((await rad(tekstId)).tilstand).toBe("innlest");

    expect(await aktiver(tekstId, { tomtEtterOppfordring: "1" })).toEqual({ adresse: `/tekst/${tekstId}/gjennomsyn` });
    const lagret = await rad(tekstId);
    expect(lagret.tilstand).toBe("aktivert");
    expect(lagret.forkunnskapMerking).toEqual([]);
    expect(lagret.lurerPaa).toBeNull();
  });

  test("ingen overskrifter: spørsmålet alene holder, og et merke kan ikke lagres", async () => {
    const uten = "Mikrobølger får vannmolekyler til å riste.\n\nDerfor blir maten varm.";
    const tekstId = await pdfTekst(uten);
    expect(await aktiver(tekstId, { "merke-1": "kjent", lurerPaa: "Hva er en mikrobølge?" })).toEqual({
      adresse: `/tekst/${tekstId}/gjennomsyn`,
    });
    const lagret = await rad(tekstId);
    expect(lagret.forkunnskapMerking).toEqual([]);
    expect(lagret.lurerPaa).toBe("Hva er en mikrobølge?");
  });

  test("ingen overskrifter og tomt skjema: oppfordringen handler om spørsmålet, ikke om merking", async () => {
    const tekstId = await pdfTekst("Mikrobølger får vannmolekyler til å riste.\n\nDerfor blir maten varm.");
    const r = await aktiver(tekstId, {});
    expect(r.adresse).toBeUndefined();
    expect(r.svar).toMatchObject({ feil: { melding: "Du har ikke skrevet noe ennå." } });
    expect((r.svar as { feil: { handling: string } }).feil.handling).not.toContain("Merk en overskrift");
    expect((await rad(tekstId)).tilstand).toBe("innlest");
  });

  test("forfalsket skjema: ukjent nummer, brødtekstnummer og ukjent verdi forkastes stille", async () => {
    const tekstId = await pdfTekst();
    // Bare forfalskede felt: ingenting gjenstår, så oppfordringen kommer.
    const r = await aktiver(tekstId, { "merke-99": "kjent", "merke-2": "nytt", "merke-1": "feil" });
    expect(r.svar).toMatchObject({ feil: { melding: "Du har ikke merket noe ennå." } });

    expect(
      await aktiver(tekstId, { "merke-99": "kjent", "merke-1": "feil", "merke-4": "kjent", tomtEtterOppfordring: "1" }),
    ).toEqual({ adresse: `/tekst/${tekstId}/gjennomsyn` });
    expect((await rad(tekstId)).forkunnskapMerking).toEqual([{ overskrift: "Tallerkenen", merke: "kjent" }]);
  });

  test("langt spørsmål: kappes til 500 tegn på serveren", async () => {
    const tekstId = await pdfTekst();
    await aktiver(tekstId, { lurerPaa: "a".repeat(800) });
    expect((await rad(tekstId)).lurerPaa).toBe("a".repeat(500));
  });
});

/* ------------------------------------------------------------------ *
 * Temaet ved utlogging (bolk 4)
 * ------------------------------------------------------------------ */

describe("slettTemaHandling", () => {
  test("sletter temakapselen, også uten innlogging (etter signOut)", async () => {
    tilgang.mockImplementation(async () => {
      throw new Omdirigert("/logg-inn");
    });
    kapsler.set("tema", "moerk");
    await h.slettTemaHandling();
    expect(kapsler.get("tema")).toBeUndefined();
    expect(revalidatePath).toHaveBeenCalledOnce();
    expect(tilgang).not.toHaveBeenCalled();
  });

  test("uten kapsel gjør den ingenting, og hurtigbufferen står", async () => {
    await h.slettTemaHandling();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

describe("velgTemaHandling", () => {
  test("«Mørk» setter kapselen, og get gir den som { name, value }", async () => {
    const data = new FormData();
    data.set("tema", "moerk");
    await expect(h.velgTemaHandling(data)).rejects.toBeInstanceOf(Omdirigert);
    expect(kapsler.get("tema")).toEqual({ name: "tema", value: "moerk" });
  });
});
