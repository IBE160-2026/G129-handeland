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
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import * as skjema from "../data/skjema";

const { innlogget, Omdirigert } = vi.hoisted(() => ({
  innlogget: { kontoId: "" },
  Omdirigert: class Omdirigert extends Error {
    constructor(readonly adresse: string) {
      super(`omdirigert til ${adresse}`);
    }
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => new Map(), headers: async () => new Headers() }));
vi.mock("next/navigation", () => ({
  redirect: (adresse: string) => {
    throw new Omdirigert(adresse);
  },
}));
vi.mock("../data/konto", () => ({ tilgang: async () => innlogget }));

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const h = await import("./handlinger");
const f = await import("../data/fagsamtale");
const { opprettTekst, lagreForkunnskapssvar } = await import("../data/tilgang");
const { laasTekst } = await import("../tekst/las");
const { settKlientForTest } = await import("../generatorer/kontrakt");
const { KI_FEIL } = await import("./kifeil");

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
  await lagreForkunnskapssvar(innlogget, ny.id, "Noe om ovner.");
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
beforeEach(() => {
  foerModus = process.env.LESEVENN_TESTMODUS;
  process.env.LESEVENN_TESTMODUS = "av";
  vi.spyOn(console, "warn").mockImplementation(() => {});
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
