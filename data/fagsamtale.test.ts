/**
 * Tester for lagring av Fagsamtaler — FR-18, FR-22, AD-8.
 * Mot en ekte Postgres i minnet (PGlite), som data/quiz.test.ts.
 */

import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const f = await import("./fagsamtale");
const { opprettTekst, lagreForkunnskapssvar, slettTekst, IkkeFunnet } = await import("./tilgang");
const { laasTekst } = await import("../tekst/las");
const { delIAvsnitt } = await import("../tekst/avsnittsdeling");

const TEKST =
  "Mikrobølger\n\nMikrobølger får vannmolekyler til å riste.\n\nDerfor blir maten varm.\n\n" +
  "Tallerkenen\n\nEn tallerken uten vann blir ikke varm.";
// 1 overskrift, 2-3 brødtekst, 4 overskrift, 5 brødtekst

let n = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `s${++n}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}
async function nySamtale(t: { kontoId: string }) {
  const ny = await opprettTekst(t, { tittel: "Mikrobølger", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
  await lagreForkunnskapssvar(t, ny.id, "Noe om ovner.");
  const laast = await laasTekst(t, ny.id, TEKST);
  const id = await f.opprettFagsamtale(laast, {
    sporsmal: "Hvorfor blir maten varm?",
    kildeavsnittNummer: 3,
    promptversjon: "samtalestart:v1",
    modell: "testmodell",
  });
  return { tekstId: ny.id, id };
}
const DEKKENDE = { tilstand: "dekkende" as const, begrunnelse: "Godt forklart." };
const NESTE = { sporsmal: "Hva med tallerkenen?", kildeavsnittNummer: 5, maal: "nytt_aspekt" as const };

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("en samtale, runde for runde", () => {
  test("første spørsmål lagres med kildeavsnitt og maal nytt_aspekt", async () => {
    const t = await nyKonto();
    const { id } = await nySamtale(t);
    const s = await f.hentFagsamtale(t, id);
    expect(s.runder).toHaveLength(1);
    expect(s.runder[0]).toMatchObject({ nummer: 1, maal: "nytt_aspekt", elevsvar: null, kildeavsnitt: { nummer: 3 } });
  });

  test("et svar lagrer vurderingen og legger til neste spørsmål", async () => {
    const t = await nyKonto();
    const { id } = await nySamtale(t);
    await f.lagreSvar(t, id, 1, "Vannet rister.", DEKKENDE, NESTE);
    const s = await f.hentFagsamtale(t, id);
    expect(s.runder.map((r) => [r.nummer, r.svarvurdering])).toEqual([[1, "dekkende"], [2, null]]);
    expect(s.runder[1].kildeavsnitt.nummer).toBe(5);
    expect(s.avsluttet).toBeNull();
  });

  test("samme runde kan ikke besvares to ganger (dobbeltklikk)", async () => {
    const t = await nyKonto();
    const { id } = await nySamtale(t);
    await f.lagreSvar(t, id, 1, "Vannet rister.", DEKKENDE, NESTE);
    await expect(f.lagreSvar(t, id, 1, "Et annet svar.", DEKKENDE, NESTE)).rejects.toThrow(IkkeFunnet);
  });

  test("uten neste spørsmål avsluttes samtalen (siste runde, FR-22)", async () => {
    const t = await nyKonto();
    const { id } = await nySamtale(t);
    await f.lagreSvar(t, id, 1, "Vannet rister.", DEKKENDE, null);
    expect((await f.hentFagsamtale(t, id)).avsluttet).not.toBeNull();
  });

  test("en avsluttet samtale tar ikke imot svar", async () => {
    const t = await nyKonto();
    const { id } = await nySamtale(t);
    await f.avsluttFagsamtale(t, id);
    await expect(f.lagreSvar(t, id, 1, "Sent svar.", DEKKENDE, NESTE)).rejects.toThrow(IkkeFunnet);
  });
});

describe("ny vurdering — FR-22", () => {
  test("bytter vurderingen og det ubesvarte neste spørsmålet", async () => {
    const t = await nyKonto();
    const { id } = await nySamtale(t);
    await f.lagreSvar(t, id, 1, "Vannet rister.", DEKKENDE, NESTE);
    await f.lagreNyVurdering(t, id, 1, { tilstand: "delvis", begrunnelse: "Noe mangler." }, {
      sporsmal: "Hva rister?",
      kildeavsnittNummer: 2,
      maal: "peker_mot_manglende",
    });
    const s = await f.hentFagsamtale(t, id);
    expect(s.runder[0]).toMatchObject({ svarvurdering: "delvis", revurdert: true });
    expect(s.runder[1]).toMatchObject({ sporsmal: "Hva rister?", maal: "peker_mot_manglende", kildeavsnitt: { nummer: 2 } });
  });

  test("et neste spørsmål som alt er besvart, røres ikke", async () => {
    const t = await nyKonto();
    const { id } = await nySamtale(t);
    await f.lagreSvar(t, id, 1, "Vannet rister.", DEKKENDE, NESTE);
    await f.lagreSvar(t, id, 2, "Den blir ikke varm.", DEKKENDE, { ...NESTE, sporsmal: "Tredje?" });
    await f.lagreNyVurdering(t, id, 1, { tilstand: "delvis", begrunnelse: "Noe mangler." }, {
      sporsmal: "Skal ikke brukes?",
      kildeavsnittNummer: 2,
      maal: "peker_mot_manglende",
    });
    const s = await f.hentFagsamtale(t, id);
    expect(s.runder[1].sporsmal).toBe("Hva med tallerkenen?");
  });
});

describe("eierskap — AD-8", () => {
  test("en annen konto finner ikke samtalen og kan ikke svare i den", async () => {
    const eier = await nyKonto();
    const annen = await nyKonto();
    const { id, tekstId } = await nySamtale(eier);
    await expect(f.hentFagsamtale(annen, id)).rejects.toThrow(IkkeFunnet);
    await expect(f.listFagsamtaler(annen, tekstId)).rejects.toThrow(IkkeFunnet);
    await expect(f.lagreSvar(annen, id, 1, "Innbrudd.", DEKKENDE, NESTE)).rejects.toThrow(IkkeFunnet);
    await expect(f.avsluttFagsamtale(annen, id)).rejects.toThrow(IkkeFunnet);
  });
});

describe("oppsummeringen — FR-22", () => {
  test("delene som ble berørt, misoppfatningene og det som ble godtatt", () => {
    const avsnitt = delIAvsnitt(TEKST);
    const runde = (nummer: number, kilde: number, svarvurdering: "dekkende" | "misoppfatning") => ({
      nummer, sporsmal: "?", kildeavsnitt: { nummer: kilde, innhold: "" }, maal: "nytt_aspekt" as const,
      elevsvar: "svar", svarvurdering, vurderingsbegrunnelse: "b", revurdert: false,
    });
    const o = f.oppsummer([runde(1, 3, "dekkende"), runde(2, 5, "misoppfatning"), runde(3, 2, "dekkende")], avsnitt);
    expect(o.berorteDeler).toEqual(["Mikrobølger", "Tallerkenen"]);
    expect(o.misoppfatninger.map((r) => r.nummer)).toEqual([2]);
    expect(o.dekkende.map((r) => r.nummer)).toEqual([1, 3]);
  });
});

describe("sletting — FR-37", () => {
  test("slettes teksten, forsvinner samtalen og rundene", async () => {
    const t = await nyKonto();
    const { id, tekstId } = await nySamtale(t);
    await slettTekst(t, tekstId);
    expect(await db.select().from(skjema.fagsamtale).where(eq(skjema.fagsamtale.id, id))).toHaveLength(0);
    expect(await db.select().from(skjema.samtalerunde).where(eq(skjema.samtalerunde.fagsamtaleId, id))).toHaveLength(0);
  });
});
