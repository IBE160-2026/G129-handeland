/**
 * Tester for minnevers-datalaget — FR-30, AD-8. Mot PGlite.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import type { Minneversresultat } from "../generatorer/minnevers";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const { hentMinnevers, lagreMinnevers } = await import("./minnevers");
const { opprettTekst, IkkeFunnet } = await import("./tilgang");

let n = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `v${++n}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}
async function nyTekst(t: { kontoId: string }) {
  return (await opprettTekst(t, { tittel: "Celler", raatekst: "Mitose.", redigertTekst: "Mitose.", vei: "liming" })).id;
}
const r = (form: "vers" | "suno", linje: string): Minneversresultat => ({
  form,
  linjer: [linje],
  kildeavsnitt: [2],
  faguttrykk: ["mitose"],
  stil: form === "suno" ? "pop" : "",
  promptversjon: "v1",
  modell: "testmodell",
});

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("FR-30 — vers og Suno-prompt hver for seg", () => {
  test("ingen fra start", async () => {
    const t = await nyKonto();
    expect(await hentMinnevers(t, await nyTekst(t))).toEqual({ vers: null, suno: null });
  });

  test("det nyeste av hver form vises", async () => {
    const t = await nyKonto();
    const id = await nyTekst(t);
    await lagreMinnevers(t, id, r("vers", "første"));
    await lagreMinnevers(t, id, r("suno", "sang"));
    await new Promise((ok) => setTimeout(ok, 5));
    await lagreMinnevers(t, id, r("vers", "andre"));
    const m = await hentMinnevers(t, id);
    expect(m.vers?.linjer).toEqual(["andre"]);
    expect(m.suno).toMatchObject({ form: "suno", stil: "pop", linjer: ["sang"] });
  });

  test("AD-8: en annen konto når dem ikke", async () => {
    const eier = await nyKonto();
    const id = await nyTekst(eier);
    await expect(hentMinnevers(await nyKonto(), id)).rejects.toBeInstanceOf(IkkeFunnet);
    await expect(lagreMinnevers(await nyKonto(), id, r("vers", "x"))).rejects.toBeInstanceOf(IkkeFunnet);
  });
});
