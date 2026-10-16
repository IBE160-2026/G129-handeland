/**
 * Tester for Øvekort — FR-16, FR-17, AD-8. Mot PGlite, som de andre
 * datatestene.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import type { Faguttrykksresultat } from "../generatorer/faguttrykk";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const { hentOevekort, merkOevekort } = await import("./oevekort");
const { lagreBegrepssett, hentBegrepssett } = await import("./begrepssett");
const { opprettTekst, lagreForkunnskapssvar, IkkeFunnet } = await import("./tilgang");
const { laasTekst } = await import("../tekst/las");

const TEKST = "Celler\n\nMitose er celledeling.\n\nEn mutasjon er en endring i arvestoffet.";

let n = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `o${++n}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}

/** En låst tekst med et Begrepssett på de gitte uttrykkene. */
async function medSett(t: { kontoId: string }, uttrykk: [string, number][]) {
  const ny = await opprettTekst(t, { tittel: "Celler", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
  await lagreForkunnskapssvar(t, ny.id, "Noe om celler.");
  const laast = await laasTekst(t, ny.id, TEKST);
  const resultat = {
    begreper: uttrykk.map(([u, avsnitt], i) => ({
      uttrykk: u,
      forklaring: `Forklaring av ${u}.`,
      viktighetsrangering: i + 1,
      kildeavsnittNummer: avsnitt,
      forekomster: [],
    })),
    promptversjon: "v3",
    modell: "testmodell",
  } as unknown as Faguttrykksresultat;
  await lagreBegrepssett(laast, resultat);
  return ny.id;
}

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("FR-16 — øvekortsettet er Begrepssettet", () => {
  test("avvikstest: samme uttrykk, samme rekkefølge, ingen lagt til eller fjernet", async () => {
    const t = await nyKonto();
    const id = await medSett(t, [["Mitose", 2], ["mutasjon", 3]]);
    const sett = await hentOevekort(t, id);
    const begreper = await hentBegrepssett(t, id);
    expect(sett.status).toBe("klar");
    if (sett.status !== "klar") return;
    expect(sett.kort.map((k) => k.uttrykk)).toEqual(begreper!.begreper.map((b) => b.uttrykk));
    expect(sett.kort.map((k) => k.id)).toEqual(begreper!.begreper.map((b) => b.id));
  });

  test("baksiden har forklaringen og Kildeavsnittet", async () => {
    const t = await nyKonto();
    const id = await medSett(t, [["Mitose", 2]]);
    const sett = await hentOevekort(t, id);
    if (sett.status !== "klar") throw new Error("ventet kort");
    expect(sett.kort[0]).toMatchObject({
      forklaring: "Forklaring av Mitose.",
      kildeavsnitt: { nummer: 2, innhold: "Mitose er celledeling." },
      merking: null,
    });
  });

  test("tomt Begrepssett gir ingen kort, og sier det", async () => {
    const t = await nyKonto();
    const id = await medSett(t, []);
    expect(await hentOevekort(t, id)).toEqual({ status: "tomt" });
  });

  test("uten Begrepssett sier den at fagordene mangler", async () => {
    const t = await nyKonto();
    const ny = await opprettTekst(t, { tittel: "Uten", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
    expect(await hentOevekort(t, ny.id)).toEqual({ status: "mangler" });
  });
});

describe("FR-17 — merkingen", () => {
  test("lagres, kan endres og kan fjernes", async () => {
    const t = await nyKonto();
    const id = await medSett(t, [["Mitose", 2], ["mutasjon", 3]]);
    const s0 = await hentOevekort(t, id);
    if (s0.status !== "klar") throw new Error("ventet kort");
    const [a, b] = s0.kort;

    await merkOevekort(t, id, a.id, "kan");
    await merkOevekort(t, id, b.id, "maa_oeve");
    let s = await hentOevekort(t, id);
    if (s.status !== "klar") throw new Error();
    expect(s.kort.map((k) => k.merking)).toEqual(["kan", "maa_oeve"]);

    await merkOevekort(t, id, b.id, null);
    s = await hentOevekort(t, id);
    if (s.status !== "klar") throw new Error();
    expect(s.kort[1].merking).toBeNull();
  });
});

describe("eierskap — AD-8", () => {
  test("en annen konto ser ikke kortene og kan ikke merke dem", async () => {
    const eier = await nyKonto();
    const annen = await nyKonto();
    const id = await medSett(eier, [["Mitose", 2]]);
    const s = await hentOevekort(eier, id);
    if (s.status !== "klar") throw new Error();
    await expect(hentOevekort(annen, id)).rejects.toThrow(IkkeFunnet);
    await expect(merkOevekort(annen, id, s.kort[0].id, "kan")).rejects.toThrow(IkkeFunnet);
  });

  test("et kort fra en annen tekst kan ikke merkes gjennom min tekst", async () => {
    const t = await nyKonto();
    const min = await medSett(t, [["Mitose", 2]]);
    const annenTekst = await medSett(await nyKonto(), [["mutasjon", 3]]);
    const fremmed = (await db.select({ id: skjema.begrep.id }).from(skjema.begrep))
      .map((r) => r.id);
    const s = await hentOevekort(t, min);
    if (s.status !== "klar") throw new Error();
    const ikkeMitt = fremmed.find((x) => !s.kort.some((k) => k.id === x))!;
    expect(annenTekst).toBeTruthy();
    await expect(merkOevekort(t, min, ikkeMitt, "kan")).rejects.toThrow(IkkeFunnet);
  });
});
