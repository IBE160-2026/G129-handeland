/**
 * Tester for låsen på oppsummeringen — PRD §6, FR-26. Mot PGlite.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import type { Quizresultat } from "../generatorer/quiz";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const { harSjekketForstaaelsen } = await import("./sjekket");
const { lagreQuiz, lagreForsoek } = await import("./quiz");
const { opprettTekst, lagreForkunnskapssvar, IkkeFunnet } = await import("./tilgang");
const { laasTekst } = await import("../tekst/las");

const TEKST = "Celler\n\nMitose er celledeling.";

let n = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `s${++n}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}
async function laastTekst(t: { kontoId: string }) {
  const ny = await opprettTekst(t, { tittel: "Celler", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
  await lagreForkunnskapssvar(t, ny.id, "Noe om celler.");
  return laasTekst(t, ny.id, TEKST);
}
const QUIZ = {
  sporsmal: [{ erFlervalg: false, sporsmal: "Hva er mitose?", alternativer: [], riktigSvar: "Celledeling.", kildeavsnittNummer: 2 }],
  forkastet: [],
  udekkedeDeler: [],
  promptversjon: "v1",
  modell: "testmodell",
} as Quizresultat;

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("§6 — oppsummeringen er låst til eleven er sjekket", () => {
  test("bare lest: låst", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    expect(await harSjekketForstaaelsen(t, laast.id)).toBe(false);
  });

  test("quiz laget men ikke levert: fortsatt låst", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, QUIZ);
    expect(await harSjekketForstaaelsen(t, laast.id)).toBe(false);
  });

  test("levert quiz: låst opp", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, QUIZ);
    await lagreForsoek(t, laast.id, [], { per: [], antallRiktige: 0, antallTotalt: 1 });
    expect(await harSjekketForstaaelsen(t, laast.id)).toBe(true);
  });

  test("gjelder bare elevens egen tekst (AD-8)", async () => {
    const eier = await nyKonto();
    const laast = await laastTekst(eier);
    await expect(harSjekketForstaaelsen(await nyKonto(), laast.id)).rejects.toBeInstanceOf(IkkeFunnet);
  });
});
