/**
 * Tester for Mapper lett — FR-50, FR-51, FR-52, AD-8, FR-37.
 *
 * Mot PGlite, migrert med de samme filene som Neon, som de andre
 * datatestene. Tekstene lages gjennom de samme funksjonene appen bruker, så
 * en Mappe peker på ekte Begrepssett og Quizer.
 */

import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import type { Faguttrykksresultat } from "../generatorer/faguttrykk";
import type { Quizresultat } from "../generatorer/quiz";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const m = await import("./mapper");
const { hentOevekort, merkOevekort } = await import("./oevekort");
const { lagreBegrepssett } = await import("./begrepssett");
const { lagreQuiz, rettQuiz, hentQuiz, UgyldigVurdering, tilElevsvar } = await import("./quiz");
const { opprettTekst, lagreForkunnskapssvar, slettTekst, IkkeFunnet } = await import("./tilgang");
const { laasTekst } = await import("../tekst/las");

const TEKST = "Celler\n\nMitose er celledeling.\n\nEn mutasjon er en endring i arvestoffet.";

let n = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `m${++n}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}

/** Åtte spørsmål, nummerert 1–8: annethvert flervalg og kortsvar. */
function quizresultat(navn: string): Quizresultat {
  return {
    sporsmal: Array.from({ length: 8 }, (_, i) =>
      i % 2 === 0
        ? { erFlervalg: true, sporsmal: `${navn} ${i + 1}?`, alternativer: ["A", "B", "C", "D"], riktigSvar: "A", kildeavsnittNummer: 2 }
        : { erFlervalg: false, sporsmal: `${navn} ${i + 1}?`, alternativer: [], riktigSvar: "Eksempel.", kildeavsnittNummer: 3 },
    ),
    forkastet: [],
    udekkedeDeler: [],
    promptversjon: "v1",
    modell: "testmodell",
  };
}

/**
 * En Tekst i ønsket tilstand: `begreper` null gir ingen Begrepssett, og
 * `quiz` false ingen Quiz. `laast` false gir en Tekst som bare er lest inn.
 */
async function lagTekst(
  t: { kontoId: string },
  tittel: string,
  { laast = true, begreper = ["Mitose"] as string[] | null, quiz = true } = {},
) {
  const ny = await opprettTekst(t, { tittel, raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
  if (!laast) return ny.id;
  await lagreForkunnskapssvar(t, ny.id, {});
  const l = await laasTekst(t, ny.id, TEKST);
  if (begreper) {
    await lagreBegrepssett(l, {
      begreper: begreper.map((u, i) => ({
        uttrykk: u,
        forklaring: `Forklaring av ${u}.`,
        viktighetsrangering: i + 1,
        kildeavsnittNummer: 2,
        forekomster: [],
      })),
      promptversjon: "v3",
      modell: "testmodell",
    } as unknown as Faguttrykksresultat);
  }
  if (quiz) await lagreQuiz(l, quizresultat(tittel));
  return ny.id;
}

/** En Tekst rett i tabellen, forbi dagsgrensen på fem nye Tekster (PRD §6.4). */
async function raaTekst(t: { kontoId: string }, tittel: string) {
  const [r] = await db
    .insert(skjema.tekst)
    .values({ kontoId: t.kontoId, tittel, raatekst: TEKST, redigertTekst: TEKST, vei: "liming" })
    .returning({ id: skjema.tekst.id });
  return r.id;
}

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("FR-50 — Mappe og medlemskap", () => {
  test("en Mappe lages, får tekster i den rekkefølgen de legges til, og kan få nytt navn", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "  Naturfag  ");
    const a = await lagTekst(t, "Celler");
    const b = await lagTekst(t, "Arv");
    await m.leggTilTekst(t, mappeId, b);
    await m.leggTilTekst(t, mappeId, a);
    await m.leggTilTekst(t, mappeId, a); // to ganger: skjer ingenting

    const mappe = await m.hentMappe(t, mappeId);
    expect(mappe.tittel).toBe("Naturfag");
    expect(mappe.tekster.map((x) => x.tittel)).toEqual(["Arv", "Celler"]);
    expect(mappe.tekster[0]).toMatchObject({ tilstand: "laast", antallFagord: 1, antallSporsmal: 8 });

    await m.giNyttNavn(t, mappeId, "Naturfag, prøve 2");
    expect((await m.listMapper(t))[0]).toMatchObject({ tittel: "Naturfag, prøve 2", antallTekster: 2 });
  });

  test("en Tekst kan ligge i flere Mapper, og kan tas ut uten at Teksten slettes", async () => {
    const t = await nyKonto();
    const a = await lagTekst(t, "Celler");
    const m1 = await m.opprettMappe(t, "Biologi");
    const m2 = await m.opprettMappe(t, "Eksamen");
    await m.leggTilTekst(t, m1, a);
    await m.leggTilTekst(t, m2, a);
    await m.fjernTekst(t, m1, a);
    expect((await m.hentMappe(t, m1)).tekster).toHaveLength(0);
    expect((await m.hentMappe(t, m2)).tekster).toHaveLength(1);
    expect(await db.select().from(skjema.tekst).where(eq(skjema.tekst.id, a))).toHaveLength(1);
  });

  test("mapperPerTekst gir Mappene hver Tekst ligger i, bare for egen konto", async () => {
    const t = await nyKonto();
    const annen = await nyKonto();
    const a = await raaTekst(t, "Celler");
    const b = await raaTekst(t, "Arv");
    const uten = await raaTekst(t, "Uten mappe");
    const m1 = await m.opprettMappe(t, "Biologi");
    const m2 = await m.opprettMappe(t, "Eksamen");
    await m.leggTilTekst(t, m1, a);
    await m.leggTilTekst(t, m2, a);
    await m.leggTilTekst(t, m2, b);
    // Den andre kontoen har sin egen Mappe og Tekst; de skal ikke komme med.
    const fremmedMappe = await m.opprettMappe(annen, "Fremmed");
    const fremmed = await raaTekst(annen, "Fremmed tekst");
    await m.leggTilTekst(annen, fremmedMappe, fremmed);

    const kart = await m.mapperPerTekst(t);
    expect([...(kart.get(a) ?? [])].sort()).toEqual([m1, m2].sort());
    expect(kart.get(b)).toEqual([m2]);
    expect(kart.has(uten)).toBe(false);
    expect(kart.has(fremmed)).toBe(false);
    expect([...kart.values()].flat()).not.toContain(fremmedMappe);
    expect([...(await m.mapperPerTekst(annen)).entries()]).toEqual([[fremmed, [fremmedMappe]]]);
  });

  test("tittelen må ha 1–80 tegn", async () => {
    const t = await nyKonto();
    await expect(m.opprettMappe(t, "   ")).rejects.toThrow(m.MappeAvvist);
    await expect(m.opprettMappe(t, "x".repeat(81))).rejects.toThrow(/høyst 80 tegn/);
    expect(await m.opprettMappe(t, "x".repeat(80))).toBeTruthy();
  });
});

describe("FR-50 — grensene", () => {
  test("den 21. Mappen avvises med en melding som navngir grensen", async () => {
    const t = await nyKonto();
    for (let i = 0; i < 20; i++) await m.opprettMappe(t, `Mappe ${i + 1}`);
    const feil = await m.opprettMappe(t, "Mappe 21").catch((e) => e);
    expect(feil).toBeInstanceOf(m.MappeAvvist);
    expect(feil.melding).toContain("20 mapper");
    expect(feil.handling).toMatch(/Slett en mappe/);
    expect(await m.listMapper(t)).toHaveLength(20);
  });

  test("den 9. Teksten i en Mappe avvises med en melding som navngir grensen", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Full");
    for (let i = 0; i < 8; i++) await m.leggTilTekst(t, mappeId, await raaTekst(t, `Tekst ${i + 1}`));
    const feil = await m.leggTilTekst(t, mappeId, await raaTekst(t, "Tekst 9")).catch((e) => e);
    expect(feil).toBeInstanceOf(m.MappeAvvist);
    expect(feil.melding).toContain("8 tekster");
    expect((await m.hentMappe(t, mappeId)).tekster).toHaveLength(8);
  });
});

describe("eierskap — AD-8", () => {
  test("en fremmed Tekst kan ikke legges i min Mappe", async () => {
    const t = await nyKonto();
    const annen = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Min");
    const fremmed = await lagTekst(annen, "Ikke min");
    await expect(m.leggTilTekst(t, mappeId, fremmed)).rejects.toThrow(IkkeFunnet);
    expect((await m.hentMappe(t, mappeId)).tekster).toHaveLength(0);
  });

  test("en fremmed Mappe finnes ikke for meg, i noen av funksjonene", async () => {
    const eier = await nyKonto();
    const annen = await nyKonto();
    const mappeId = await m.opprettMappe(eier, "Eiers");
    const tekstId = await lagTekst(eier, "Celler");
    await m.leggTilTekst(eier, mappeId, tekstId);
    const egen = await raaTekst(annen, "Egen");

    await expect(m.hentMappe(annen, mappeId)).rejects.toThrow(IkkeFunnet);
    await expect(m.hentMappekort(annen, mappeId)).rejects.toThrow(IkkeFunnet);
    await expect(m.hentMappequiz(annen, mappeId, "alle")).rejects.toThrow(IkkeFunnet);
    await expect(m.listMappeforsoek(annen, mappeId)).rejects.toThrow(IkkeFunnet);
    await expect(m.lagreMappeforsoek(annen, mappeId, "kort", [], { antallRiktige: 0, antallTotalt: 0 })).rejects.toThrow(IkkeFunnet);
    await expect(m.leggTilTekst(annen, mappeId, egen)).rejects.toThrow(IkkeFunnet);
    await expect(m.fjernTekst(annen, mappeId, tekstId)).rejects.toThrow(IkkeFunnet);
    await expect(m.giNyttNavn(annen, mappeId, "Stjålet")).rejects.toThrow(IkkeFunnet);
    await expect(m.slettMappe(annen, mappeId)).rejects.toThrow(IkkeFunnet);
    expect(await m.listMapper(annen)).toHaveLength(0);
    expect((await m.hentMappe(eier, mappeId)).tittel).toBe("Eiers");
  });

  test("en id som ikke er en uuid, gir IkkeFunnet og ikke en databasefeil", async () => {
    const t = await nyKonto();
    await expect(m.hentMappe(t, "ikke-en-id")).rejects.toThrow(IkkeFunnet);
  });
});

describe("FR-51 — samlet øving", () => {
  test("alle kortene fra de låste tekstene, tekst for tekst; tekster uten kort sier hvorfor", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Naturfag");
    const a = await lagTekst(t, "Celler", { begreper: ["Mitose", "mutasjon"] });
    const b = await lagTekst(t, "Arv", { begreper: ["arvestoffet"] });
    const tom = await lagTekst(t, "Tom", { begreper: [] });
    const uten = await lagTekst(t, "Uten sett", { begreper: null });
    const ulaast = await lagTekst(t, "Ikke lest", { laast: false });
    for (const id of [a, b, tom, uten, ulaast]) await m.leggTilTekst(t, mappeId, id);

    const kort = await m.hentMappekort(t, mappeId);
    expect(kort.map((k) => [k.tekst.tittel, k.uttrykk])).toEqual([
      ["Celler", "Mitose"],
      ["Celler", "mutasjon"],
      ["Arv", "arvestoffet"],
    ]);
    expect(kort[0].kildeavsnitt.nummer).toBe(2);

    const tekster = (await m.hentMappe(t, mappeId)).tekster;
    const status = Object.fromEntries(tekster.map((x) => [x.tittel, [x.tilstand, x.antallFagord]]));
    expect(status).toEqual({
      Celler: ["laast", 2],
      Arv: ["laast", 1],
      Tom: ["laast", 0],
      "Uten sett": ["laast", null],
      "Ikke lest": ["innlest", null],
    });
  });

  test("et kort merket i Mappen er merket i Teksten (begrep.merking)", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Naturfag");
    const a = await lagTekst(t, "Celler");
    await m.leggTilTekst(t, mappeId, a);
    const [kortet] = await m.hentMappekort(t, mappeId);

    // Samme vei som merkKort fra mappesiden: kortets egen Tekst.
    await merkOevekort(t, kortet.tekst.id, kortet.id, "kan");
    const alene = await hentOevekort(t, a);
    if (alene.status !== "klar") throw new Error("ventet kort");
    expect(alene.kort[0].merking).toBe("kan");
    expect((await m.hentMappekort(t, mappeId))[0].merking).toBe("kan");
  });
});

describe("FR-52 — samlet quiz", () => {
  test("utvalget er fast og jevnt fordelt over spørsmålsnumrene", () => {
    const s = Array.from({ length: 8 }, (_, i) => ({ nummer: i + 1 }));
    expect(m.velgSporsmal(s, 4).map((x) => x.nummer)).toEqual([1, 3, 5, 7]);
    expect(m.velgSporsmal(s, 2).map((x) => x.nummer)).toEqual([1, 5]);
    expect(m.velgSporsmal(s, 8).map((x) => x.nummer)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(m.velgSporsmal(s.slice(0, 3), 4).map((x) => x.nummer)).toEqual([1, 2, 3]);
    expect(m.velgSporsmal([...s].reverse(), 2).map((x) => x.nummer)).toEqual([1, 5]);
  });

  test("spørsmålene fra tekstene med quiz; samme lengde gir de samme spørsmålene", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Naturfag");
    const a = await lagTekst(t, "Celler");
    const b = await lagTekst(t, "Arv");
    const c = await lagTekst(t, "Uten quiz", { quiz: false });
    for (const id of [a, b, c]) await m.leggTilTekst(t, mappeId, id);

    const middels = await m.hentMappequiz(t, mappeId, "middels");
    expect(middels.map((s) => [s.tekst.tittel, s.nummer])).toEqual([
      ["Celler", 1], ["Celler", 3], ["Celler", 5], ["Celler", 7],
      ["Arv", 1], ["Arv", 3], ["Arv", 5], ["Arv", 7],
    ]);
    expect((await m.hentMappequiz(t, mappeId, "middels")).map((s) => s.id)).toEqual(middels.map((s) => s.id));
    expect(await m.hentMappequiz(t, mappeId, "kort")).toHaveLength(4);
    expect(await m.hentMappequiz(t, mappeId, "alle")).toHaveLength(16);

    // Spørsmålet er det samme som i tekstens egen quiz, med sitt Kildeavsnitt.
    const egen = (await hentQuiz(t, a))!;
    expect(middels[0]).toMatchObject({ id: egen.sporsmal[0].id, kildeavsnitt: egen.sporsmal[0].kildeavsnitt });

    const status = (await m.hentMappe(t, mappeId)).tekster.find((x) => x.id === c)!;
    expect(status.antallSporsmal).toBeNull();
  });

  test("uten tekster med quiz er quizen tom", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Tom");
    await m.leggTilTekst(t, mappeId, await lagTekst(t, "Uten quiz", { quiz: false }));
    await m.leggTilTekst(t, mappeId, await lagTekst(t, "Ikke lest", { laast: false }));
    expect(await m.hentMappequiz(t, mappeId, "alle")).toEqual([]);
  });

  /** Leverer slik leverMappequiz gjør: tilElevsvar → rettQuiz → lagreMappeforsoek. */
  async function levert() {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Naturfag");
    const a = await lagTekst(t, "Celler");
    const b = await lagTekst(t, "Arv");
    await m.leggTilTekst(t, mappeId, a);
    await m.leggTilTekst(t, mappeId, b);
    const sporsmal = await m.hentMappequiz(t, mappeId, "kort"); // nr. 1 og 5 fra hver: alle flervalg
    const alle = await m.hentMappequiz(t, mappeId, "alle");
    const kortsvar = alle.find((s) => !s.erFlervalg)!;
    const utvalg = [...sporsmal, kortsvar];
    const svar = tilElevsvar(
      utvalg.map((s, i) =>
        s.erFlervalg ? { sporsmalId: s.id, valgt: i === 0 ? "B" : "A" } : { sporsmalId: s.id, skrevet: "Mitt svar", selvvurdertRiktig: true },
      ),
    );
    const retting = rettQuiz(utvalg, svar);
    const forsoekId = await m.lagreMappeforsoek(t, mappeId, "kort", svar, retting);
    return { t, mappeId, a, b, forsoekId, kortsvar, flervalg: sporsmal[0], retting };
  }

  test("rettes med rettQuiz, og forsøket står under tidligere forsøk med lengden", async () => {
    const { t, mappeId, retting } = await levert();
    // Fire flervalg, ett feil; kortsvaret teller ikke før eleven har krysset av.
    expect(retting).toMatchObject({ antallRiktige: 3, antallTotalt: 5 });
    const [f] = await m.listMappeforsoek(t, mappeId);
    expect(f).toMatchObject({ lengde: "kort", antallRiktige: 3, antallTotalt: 5 });
  });

  test("selvvurderingen av et kortsvar endrer antallet, og flervalg kan ikke endres", async () => {
    const { t, mappeId, forsoekId, kortsvar, flervalg } = await levert();
    expect(await m.oppdaterMappeSelvvurdering(t, mappeId, forsoekId, kortsvar.id, true)).toEqual({ antallRiktige: 4, antallTotalt: 5 });
    expect((await m.listMappeforsoek(t, mappeId))[0].antallRiktige).toBe(4);
    expect(await m.oppdaterMappeSelvvurdering(t, mappeId, forsoekId, kortsvar.id, false)).toEqual({ antallRiktige: 3, antallTotalt: 5 });
    await expect(m.oppdaterMappeSelvvurdering(t, mappeId, forsoekId, flervalg.id, true)).rejects.toThrow(UgyldigVurdering);

    const [rad] = await db.select().from(skjema.mappeforsoek).where(eq(skjema.mappeforsoek.id, forsoekId));
    expect(JSON.parse(rad.svar).find((s: { sporsmalId: string }) => s.sporsmalId === kortsvar.id)).toMatchObject({
      skrevet: "Mitt svar",
      selvvurdertRiktig: false,
    });
  });

  test("en annen konto kan ikke vurdere forsøket, og et spørsmål utenfor forsøket finnes ikke", async () => {
    const { t, mappeId, forsoekId, kortsvar } = await levert();
    const annen = await nyKonto();
    await expect(m.oppdaterMappeSelvvurdering(annen, mappeId, forsoekId, kortsvar.id, true)).rejects.toThrow(IkkeFunnet);

    const annenMappe = await m.opprettMappe(t, "Annen");
    await expect(m.oppdaterMappeSelvvurdering(t, annenMappe, forsoekId, kortsvar.id, true)).rejects.toThrow(IkkeFunnet);

    const utenfor = (await m.hentMappequiz(t, mappeId, "alle")).find((s) => !s.erFlervalg && s.id !== kortsvar.id)!;
    await expect(m.oppdaterMappeSelvvurdering(t, mappeId, forsoekId, utenfor.id, true)).rejects.toThrow(IkkeFunnet);
    expect((await m.listMappeforsoek(t, mappeId))[0].antallRiktige).toBe(3);
  });
});

describe("sletting — FR-37", () => {
  test("slettes en Tekst, forsvinner den fra Mappen; gamle forsøk står med sitt antall", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Naturfag");
    const a = await lagTekst(t, "Celler");
    const b = await lagTekst(t, "Arv");
    await m.leggTilTekst(t, mappeId, a);
    await m.leggTilTekst(t, mappeId, b);
    await m.lagreMappeforsoek(t, mappeId, "middels", [], { antallRiktige: 5, antallTotalt: 8 });

    await slettTekst(t, a);

    const mappe = await m.hentMappe(t, mappeId);
    expect(mappe.tekster.map((x) => x.tittel)).toEqual(["Arv"]);
    expect(await db.select().from(skjema.mappeTekst).where(eq(skjema.mappeTekst.tekstId, a))).toHaveLength(0);
    expect((await m.listMappeforsoek(t, mappeId))[0]).toMatchObject({ antallRiktige: 5, antallTotalt: 8 });
    expect(await m.hentMappequiz(t, mappeId, "middels")).toHaveLength(4);
  });

  test("et kortsvar kan vurderes selv om en annen Tekst er slettet etter levering", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Naturfag");
    const a = await lagTekst(t, "Celler");
    const b = await lagTekst(t, "Arv");
    await m.leggTilTekst(t, mappeId, a);
    await m.leggTilTekst(t, mappeId, b);
    const alle = await m.hentMappequiz(t, mappeId, "alle");
    const svar = alle.map((s) => (s.erFlervalg ? { sporsmalId: s.id, valgt: "A" } : { sporsmalId: s.id, skrevet: "Svar" }));
    const forsoekId = await m.lagreMappeforsoek(t, mappeId, "alle", svar, rettQuiz(alle, svar));
    const kortsvarIArv = alle.find((s) => s.tekst.id === b && !s.erFlervalg)!;

    await slettTekst(t, a);

    expect(await m.oppdaterMappeSelvvurdering(t, mappeId, forsoekId, kortsvarIArv.id, true)).toEqual({ antallRiktige: 9, antallTotalt: 16 });
  });

  test("slettes Mappen, forsvinner koblingene og forsøkene, men Tekstene står", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Naturfag");
    const a = await lagTekst(t, "Celler");
    await m.leggTilTekst(t, mappeId, a);
    await m.lagreMappeforsoek(t, mappeId, "kort", [], { antallRiktige: 1, antallTotalt: 2 });

    await m.slettMappe(t, mappeId);

    expect(await db.select().from(skjema.mappeTekst).where(eq(skjema.mappeTekst.mappeId, mappeId))).toHaveLength(0);
    expect(await db.select().from(skjema.mappeforsoek).where(eq(skjema.mappeforsoek.mappeId, mappeId))).toHaveLength(0);
    expect(await db.select().from(skjema.tekst).where(eq(skjema.tekst.id, a))).toHaveLength(1);
    await expect(m.hentMappe(t, mappeId)).rejects.toThrow(IkkeFunnet);
  });

  test("slettes kontoen, forsvinner Mappene", async () => {
    const t = await nyKonto();
    const mappeId = await m.opprettMappe(t, "Naturfag");
    await db.delete(skjema.user).where(eq(skjema.user.id, t.kontoId));
    expect(await db.select().from(skjema.mappe).where(eq(skjema.mappe.id, mappeId))).toHaveLength(0);
  });
});
