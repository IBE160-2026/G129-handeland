/**
 * Tester for morsmålsdatalaget — FR-24, FR-26, FR-36 og AD-8. Mot PGlite,
 * som de andre datatestene.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const m = await import("./morsmaal");
const { opprettTekst, slettTekst, IkkeFunnet } = await import("./tilgang");

let n = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `m${++n}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}

async function nyTekst(t: { kontoId: string }) {
  const tekst = "Celler\n\nMitose er celledeling.";
  return (await opprettTekst(t, { tittel: "Celler", raatekst: tekst, redigertTekst: tekst, vei: "liming" })).id;
}

const STEMPEL = { promptversjon: "v1", modell: "testmodell" };

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("FR-24 — valget på kontoen", () => {
  test("ingen valgt fra start; valget lagres og kan endres og fjernes", async () => {
    const t = await nyKonto();
    expect(await m.hentMorsmaal(t)).toBeNull();
    await m.velgMorsmaal(t, "uk");
    expect((await m.hentMorsmaal(t))?.kode).toBe("uk");
    await m.velgMorsmaal(t, "ar");
    expect((await m.hentMorsmaal(t))?.retning).toBe("rtl");
    await m.velgMorsmaal(t, null);
    expect(await m.hentMorsmaal(t)).toBeNull();
  });

  test("listen er lukket: en ukjent kode avvises", async () => {
    await expect(m.velgMorsmaal(await nyKonto(), "klingon")).rejects.toThrow();
  });

  test("valget er per konto", async () => {
    const a = await nyKonto();
    const b = await nyKonto();
    await m.velgMorsmaal(a, "pl");
    expect(await m.hentMorsmaal(b)).toBeNull();
  });
});

describe("FR-36 — oversettelser lagres og gjenbrukes", () => {
  test("samme kilde gir den lagrede; endret kilde gir null", async () => {
    const t = await nyKonto();
    const id = await nyTekst(t);
    const el = [{ id: "o1", tekst: "Celler" }];
    const hash = m.kildeHash(el);
    await m.lagreOversettelse(t, id, "uk", "overskrifter", hash, [{ id: "o1", oversatt: "Клітини" }], STEMPEL);
    expect(await m.hentOversettelse(t, id, "uk", "overskrifter", hash)).toEqual([{ id: "o1", oversatt: "Клітини" }]);
    expect(await m.hentOversettelse(t, id, "uk", "overskrifter", m.kildeHash([{ id: "o1", tekst: "Celler og vev" }]))).toBeNull();
    expect(await m.hentOversettelse(t, id, "ar", "overskrifter", hash)).toBeNull();
  });

  test("en ny oversettelse av samme type erstatter den gamle", async () => {
    const t = await nyKonto();
    const id = await nyTekst(t);
    await m.lagreOversettelse(t, id, "uk", "begreper", "a", [{ id: "x", oversatt: "1" }], STEMPEL);
    await m.lagreOversettelse(t, id, "uk", "begreper", "b", [{ id: "x", oversatt: "2" }], STEMPEL);
    expect(await m.hentOversettelse(t, id, "uk", "begreper", "b")).toEqual([{ id: "x", oversatt: "2" }]);
  });

  test("oppsummering og utpeking lagres per Tekst", async () => {
    const t = await nyKonto();
    const id = await nyTekst(t);
    expect(await m.hentOppsummering(t, id)).toBeNull();
    await m.lagreOppsummering(t, id, [{ tekst: "Mitose er celledeling.", kildeavsnitt: 2 }], STEMPEL);
    expect(await m.hentOppsummering(t, id)).toHaveLength(1);
    await m.lagreUtpeking(t, id, [], STEMPEL);
    expect(await m.hentUtpeking(t, id)).toEqual([]);
  });

  test("slettes sammen med Teksten", async () => {
    const t = await nyKonto();
    const id = await nyTekst(t);
    await m.lagreOversettelse(t, id, "uk", "overskrifter", "h", [], STEMPEL);
    await m.lagreOppsummering(t, id, [], STEMPEL);
    await slettTekst(t, id);
    expect(await db.select().from(skjema.oversettelse)).not.toContainEqual(expect.objectContaining({ tekstId: id }));
    expect(await db.select().from(skjema.oppsummering)).not.toContainEqual(expect.objectContaining({ tekstId: id }));
  });
});

describe("AD-8 — eierskapet går gjennom Teksten", () => {
  test("en annen konto kan verken lese eller skrive", async () => {
    const eier = await nyKonto();
    const annen = await nyKonto();
    const id = await nyTekst(eier);
    await m.lagreOppsummering(eier, id, [{ tekst: "A.", kildeavsnitt: 2 }], STEMPEL);
    await expect(m.hentOppsummering(annen, id)).rejects.toBeInstanceOf(IkkeFunnet);
    await expect(m.hentOversettelse(annen, id, "uk", "begreper", "h")).rejects.toBeInstanceOf(IkkeFunnet);
    await expect(m.lagreUtpeking(annen, id, [], STEMPEL)).rejects.toBeInstanceOf(IkkeFunnet);
  });
});
