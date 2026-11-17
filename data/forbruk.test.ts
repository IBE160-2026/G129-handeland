/**
 * Tester for bruksgrensene — PRD §6.4. Mot en ekte Postgres i minnet
 * (PGlite), som de andre datatestene.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const fb = await import("./forbruk");
const { opprettTekst, lagreForkunnskapssvar } = await import("./tilgang");
const { opprettFagsamtale } = await import("./fagsamtale");
const { laasTekst } = await import("../tekst/las");
const { GrenseNaadd } = await import("./grenser");

const TEKST = "Mikrobølger\n\nMikrobølger får vannmolekyler til å riste.\n\nDerfor blir maten varm.";

let n = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `f${++n}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}
const nyTekst = (t: { kontoId: string }) =>
  opprettTekst(t, { tittel: "Mikrobølger", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });

let foerModus: string | undefined;
beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});
beforeEach(async () => {
  foerModus = process.env.LESEVENN_TESTMODUS;
  process.env.LESEVENN_TESTMODUS = "av";
  await db.delete(skjema.forbruk);
});
afterEach(() => {
  if (foerModus === undefined) delete process.env.LESEVENN_TESTMODUS;
  else process.env.LESEVENN_TESTMODUS = foerModus;
  vi.restoreAllMocks();
});

describe("startPaaDoegnet — midnatt i Oslo", () => {
  test("vintertid: UTC+1", () => {
    expect(fb.startPaaDoegnet(new Date("2026-11-16T12:00:00Z")).toISOString()).toBe("2026-11-15T23:00:00.000Z");
  });
  test("sommertid: UTC+2", () => {
    expect(fb.startPaaDoegnet(new Date("2026-07-01T12:00:00Z")).toISOString()).toBe("2026-06-30T22:00:00.000Z");
  });
  test("dagen klokka stilles fram: midnatt var ennå vintertid", () => {
    // 29.03.2026 kl. 12 i Oslo er sommertid, men midnatt var UTC+1.
    expect(fb.startPaaDoegnet(new Date("2026-03-29T10:00:00Z")).toISOString()).toBe("2026-03-28T23:00:00.000Z");
  });
  test("23:59 og 00:01 i Oslo er to døgn", () => {
    const foer = fb.startPaaDoegnet(new Date("2026-11-16T22:59:00Z")); // 23:59 den 16.
    const etter = fb.startPaaDoegnet(new Date("2026-11-16T23:01:00Z")); // 00:01 den 17.
    expect(foer.toISOString()).toBe("2026-11-15T23:00:00.000Z");
    expect(etter.toISOString()).toBe("2026-11-16T23:00:00.000Z");
  });
  test("like etter midnatt i Oslo, men før midnatt i UTC", () => {
    expect(fb.startPaaDoegnet(new Date("2026-11-16T23:30:00Z")).toISOString()).toBe("2026-11-16T23:00:00.000Z");
  });
});

describe("taket for hele appen", () => {
  test("registrerForbruk lagrer én rad per kall, med kostnaden etter prisene", async () => {
    await fb.registrerForbruk([
      { oppgave: "quiz", modell: "claude-haiku-5-5", inn: 10_000, ut: 2_000 },
      { oppgave: "svarvurdering", modell: "claude-sonnet-5-5", inn: 1_000, ut: 500 },
    ]);
    const rader = await db.select().from(skjema.forbruk);
    expect(rader).toHaveLength(2);
    expect(rader.find((r) => r.oppgave === "quiz")).toMatchObject({ tokensInn: 10_000, tokensUt: 2_000, mikrodollar: 2_000 });
    expect(rader.find((r) => r.oppgave === "svarvurdering")).toMatchObject({ mikrodollar: 7_000 });
    // 9 000 mikrodollar = 0,0945 kr.
    expect(await fb.dagensKroner()).toBeCloseTo(0.0945);
  });

  test("en tom liste gjør ingenting", async () => {
    await fb.registrerForbruk([]);
    expect(await db.select().from(skjema.forbruk)).toHaveLength(0);
  });

  test("taket er nådd ved 30 kroner, ikke før", async () => {
    // 2 857 142 mikrodollar = 29,99999 kr.
    await db.insert(skjema.forbruk).values({ oppgave: "quiz", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 2_857_142 });
    expect(await fb.taketNaadd()).toBe(false);
    await db.insert(skjema.forbruk).values({ oppgave: "quiz", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 1 });
    expect(await fb.taketNaadd()).toBe(true);
  });

  test("forbruk fra i går teller ikke (midnatt i Oslo)", async () => {
    const naa = new Date("2026-11-16T23:01:00Z"); // 00:01 den 17.
    await db.insert(skjema.forbruk).values({
      opprettet: new Date("2026-11-16T22:59:00Z"), // 23:59 den 16.
      oppgave: "quiz",
      modell: "x",
      tokensInn: 0,
      tokensUt: 0,
      mikrodollar: 5_000_000,
    });
    expect(await fb.taketNaadd(new Date("2026-11-16T22:59:30Z"))).toBe(true);
    expect(await fb.dagensKroner(naa)).toBe(0);
    expect(await fb.taketNaadd(naa)).toBe(false);
  });

  test("testmodus les stoppes aldri av taket", async () => {
    await db.insert(skjema.forbruk).values({ oppgave: "quiz", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 5_000_000 });
    process.env.LESEVENN_TESTMODUS = "les";
    expect(await fb.taketNaadd()).toBe(false);
  });

  test("underTaket: over taket kastes GrenseNaadd før arbeidet, og arbeidet kjører ikke", async () => {
    await db.insert(skjema.forbruk).values({ oppgave: "quiz", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 5_000_000 });
    const arbeid = vi.fn();
    const e = await fb.underTaket(null, arbeid).catch((x: unknown) => x);
    expect(e).toBeInstanceOf(GrenseNaadd);
    expect((e as InstanceType<typeof GrenseNaadd>).grense).toBe("taket");
    expect(arbeid).not.toHaveBeenCalled();
  });

  test("underTaket registrerer kallene med kontoen, også når arbeidet feiler", async () => {
    const t = await nyKonto();
    const feil = new Error("modellen feilet");
    const e = await fb
      .underTaket(t, async ({ paaForbruk }) => {
        paaForbruk!({ oppgave: "quiz", modell: "claude-haiku-5-5", inn: 100, ut: 100 });
        paaForbruk!({ oppgave: "quiz", modell: "claude-haiku-5-5", inn: 100, ut: 100 });
        throw feil;
      })
      .catch((x: unknown) => x);
    expect(e).toBe(feil);
    const rader = await db.select().from(skjema.forbruk);
    expect(rader).toHaveLength(2);
    expect(rader.every((r) => r.kontoId === t.kontoId && r.hendelse === null)).toBe(true);
  });

  test("vakten: registrerer kallene så langt, og stopper neste kall når taket er nådd", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const e = await fb
      .underTaket(null, async ({ paaForbruk, foerKall }) => {
        await foerKall!();
        // Ett dyrt kall: 3 000 000 mikrodollar er 31,5 kr.
        paaForbruk!({ oppgave: "svarvurdering", modell: "claude-sonnet-5-5", inn: 0, ut: 300_000 });
        await foerKall!();
        throw new Error("skulle vært stoppet");
      })
      .catch((x: unknown) => x);
    expect(e).toBeInstanceOf(GrenseNaadd);
    expect(await db.select().from(skjema.forbruk)).toHaveLength(1);
  });

  test("taket meldes i loggen første gang i døgnet, ikke ved hvert kall", async () => {
    const advarsel = vi.spyOn(console, "warn").mockImplementation(() => {});
    // Et annet døgn enn de andre testene, så meldingen ikke alt er gitt.
    const naa = new Date("2030-01-15T12:00:00Z");
    await db.insert(skjema.forbruk).values({ opprettet: naa, oppgave: "quiz", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 5_000_000 });
    await fb.taketNaadd(naa);
    await fb.taketNaadd(naa);
    expect(advarsel).toHaveBeenCalledOnce();
  });

  test("kodeSomGjelder: takkoden gjelder bare mens taket er nådd", async () => {
    expect(await fb.kodeSomGjelder("dagstak")).toBeUndefined();
    expect(await fb.kodeSomGjelder("ugyldig_utdata")).toBe("ugyldig_utdata");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await db.insert(skjema.forbruk).values({ oppgave: "quiz", modell: "x", tokensInn: 0, tokensUt: 0, mikrodollar: 5_000_000 });
    expect(await fb.kodeSomGjelder("dagstak")).toBe("dagstak");
  });
});

describe("grensene per konto (AD-8)", () => {
  test("5 Tekster i dag: den sjette avvises i opprettTekst", async () => {
    const t = await nyKonto();
    for (let i = 0; i < 5; i++) await nyTekst(t);
    expect(await fb.teksterIDag(t)).toBe(5);
    expect(await fb.tekstgrenseNaadd(t)).toBe(true);
    const e = await nyTekst(t).catch((x) => x);
    expect(e).toBeInstanceOf(GrenseNaadd);
    expect(e.grense).toBe("tekster");
  });

  test("sletting gir ikke en ny plass samme dag", async () => {
    const { slettTekst } = await import("./tilgang");
    const t = await nyKonto();
    const tekster = [];
    for (let i = 0; i < 5; i++) tekster.push(await nyTekst(t));
    await slettTekst(t, tekster[0].id);
    expect(await fb.teksterIDag(t)).toBe(5);
    await expect(nyTekst(t)).rejects.toBeInstanceOf(GrenseNaadd);
  });

  test("en avvist tekst lagres ikke, og skriver ingen hendelse", async () => {
    const t = await nyKonto();
    for (let i = 0; i < 5; i++) await nyTekst(t);
    await nyTekst(t).catch(() => {});
    const { listTekster } = await import("./tilgang");
    expect(await listTekster(t)).toHaveLength(5);
    expect(await fb.teksterIDag(t)).toBe(5);
  });

  test("grensen gjelder kontoen, ikke andre kontoer", async () => {
    const a = await nyKonto();
    const b = await nyKonto();
    for (let i = 0; i < 5; i++) await nyTekst(a);
    expect(await fb.tekstgrenseNaadd(b)).toBe(false);
    expect(await fb.teksterIDag(b)).toBe(0);
  });

  test("Tekster fra i går telles ikke", async () => {
    const t = await nyKonto();
    for (let i = 0; i < 5; i++) await nyTekst(t);
    const iMorgen = new Date(Date.now() + 86_400_000 + 3_600_000);
    expect(await fb.teksterIDag(t, iMorgen)).toBe(0);
  });

  test("Fagsamtaler telles per konto og døgn", async () => {
    const t = await nyKonto();
    const ny = await nyTekst(t);
    await lagreForkunnskapssvar(t, ny.id, { lurerPaa: "Noe om ovner." });
    const laast = await laasTekst(t, ny.id, TEKST);
    for (let i = 0; i < 5; i++) {
      await opprettFagsamtale(laast, { sporsmal: "Hvorfor?", kildeavsnittNummer: 3, promptversjon: "v", modell: "m" });
    }
    expect(await fb.samtalerIDag(t)).toBe(5);
    expect(await fb.samtalegrenseNaadd(t)).toBe(true);
    expect(await fb.samtalegrenseNaadd(await nyKonto())).toBe(false);
    // Den sjette avvises i transaksjonen som oppretter samtalen.
    await expect(
      opprettFagsamtale(laast, { sporsmal: "Hvorfor?", kildeavsnittNummer: 3, promptversjon: "v", modell: "m" }),
    ).rejects.toBeInstanceOf(GrenseNaadd);
  });
});
