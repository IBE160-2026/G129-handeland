/**
 * Tester for lagring og retting av Quiz — FR-13, FR-15, AD-8, AD-15.
 *
 * Mot en ekte Postgres i minnet (PGlite), migrert med de samme filene som
 * Neon, som i data/auth.test.ts.
 */

import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import type { Quizresultat } from "../generatorer/quiz";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const { lagreQuiz, hentQuiz, rettQuiz, lagreForsoek, listForsoek, oppdaterSelvvurdering, UgyldigVurdering, tilElevsvar } =
  await import("./quiz");
const { opprettTekst, lagreForkunnskapssvar, slettTekst, IkkeFunnet } = await import("./tilgang");
const { laasTekst } = await import("../tekst/las");

const TEKST =
  "Celledeling\n\nMitose er den vanligste formen for celledeling.\n\n" +
  "Meiose\n\nMeiose gir kjønnsceller.";

let nummer = 0;
async function nyKonto() {
  const [u] = await db
    .insert(skjema.user)
    .values({ name: "", email: `elev${++nummer}@test.no` })
    .returning({ id: skjema.user.id });
  return { kontoId: u.id };
}

/** En låst Tekst, gjennom de samme funksjonene appen bruker (AD-9, AD-15). */
async function laastTekst(t: { kontoId: string }) {
  const ny = await opprettTekst(t, { tittel: "Celler", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });
  await lagreForkunnskapssvar(t, ny.id, "Noe om celler.");
  return laasTekst(t, ny.id, TEKST);
}

const RESULTAT: Quizresultat = {
  sporsmal: [
    { erFlervalg: true, sporsmal: "Hva er mitose?", alternativer: ["Celledeling", "Fotosyntese", "Respirasjon", "Mutasjon"], riktigSvar: "Celledeling", kildeavsnittNummer: 2 },
    { erFlervalg: false, sporsmal: "Hva gir meiose?", alternativer: [], riktigSvar: "Kjønnsceller.", kildeavsnittNummer: 4 },
  ],
  forkastet: [],
  udekkedeDeler: [],
  promptversjon: "v1",
  modell: "testmodell",
};

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("lagring og henting", () => {
  test("quizen lagres på teksten med kildeavsnittene", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, RESULTAT);

    const q = await hentQuiz(t, laast.id);
    expect(q?.sporsmal.map((s) => s.nummer)).toEqual([1, 2]);
    expect(q?.sporsmal[0].kildeavsnitt).toEqual({ nummer: 2, innhold: "Mitose er den vanligste formen for celledeling." });
    expect(q?.sporsmal[1].alternativer).toEqual([]);
  });

  test("uten quiz gir hentQuiz null, ikke en feil", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    expect(await hentQuiz(t, laast.id)).toBeNull();
  });

  test("høyst én quiz per tekst: en ny lagring gir den som finnes (AD-15)", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    const foerste = await lagreQuiz(laast, RESULTAT);
    const andre = await lagreQuiz(laast, RESULTAT);
    expect(andre).toBe(foerste);
    expect(await db.select().from(skjema.quiz).where(eq(skjema.quiz.tekstId, laast.id))).toHaveLength(1);
  });
});

describe("retting — FR-15", () => {
  test("flervalg rettes mot fasiten, kortsvar etter elevens vurdering", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, RESULTAT);
    const q = (await hentQuiz(t, laast.id))!;
    const [fv, ks] = q.sporsmal;

    expect(rettQuiz(q.sporsmal, [
      { sporsmalId: fv.id, valgt: "Celledeling" },
      { sporsmalId: ks.id, skrevet: "Kjønnsceller", selvvurdertRiktig: true },
    ]).antallRiktige).toBe(2);

    expect(rettQuiz(q.sporsmal, [
      { sporsmalId: fv.id, valgt: "Fotosyntese" },
      { sporsmalId: ks.id, skrevet: "Vet ikke", selvvurdertRiktig: false },
    ]).antallRiktige).toBe(0);
  });

  test("et tomt kortsvar er ikke riktig, selv om eleven krysset av for det", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, RESULTAT);
    const q = (await hentQuiz(t, laast.id))!;
    const r = rettQuiz(q.sporsmal, [{ sporsmalId: q.sporsmal[1].id, skrevet: "   ", selvvurdertRiktig: true }]);
    expect(r.per[1].riktig).toBe(false);
  });

  test("ubesvarte spørsmål teller som ikke riktige, og totalt er alle", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, RESULTAT);
    const q = (await hentQuiz(t, laast.id))!;
    const r = rettQuiz(q.sporsmal, []);
    expect(r).toMatchObject({ antallRiktige: 0, antallTotalt: 2 });
  });
});

describe("forsøk — FR-15", () => {
  test("forsøkene beholdes, nyeste først", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, RESULTAT);
    const q = (await hentQuiz(t, laast.id))!;

    await lagreForsoek(t, laast.id, [], { per: [], antallRiktige: 1, antallTotalt: 2 });
    await new Promise((r) => setTimeout(r, 5));
    await lagreForsoek(t, laast.id, [], { per: [], antallRiktige: 2, antallTotalt: 2 });

    const f = await listForsoek(t, laast.id);
    expect(f.map((x) => x.antallRiktige)).toEqual([2, 1]);
    expect(q.id).toBeTruthy();
  });
});

describe("selvvurdering etter levering — FR-15", () => {
  /** Leverer slik leverQuiz gjør: rettet med rettQuiz, kortsvaret ikke vurdert ennå. */
  async function levert(skrevet: string) {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, RESULTAT);
    const q = (await hentQuiz(t, laast.id))!;
    const [fv, ks] = q.sporsmal;
    const svar = [
      { sporsmalId: fv.id, valgt: "Celledeling" },
      { sporsmalId: ks.id, skrevet },
    ];
    const forsoekId = await lagreForsoek(t, laast.id, svar, rettQuiz(q.sporsmal, svar));
    return { t, tekstId: laast.id, forsoekId, fv, ks };
  }

  test("kortsvaret teller ikke ved levering", async () => {
    const { t, tekstId } = await levert("Kjønnsceller");
    expect((await listForsoek(t, tekstId))[0].antallRiktige).toBe(1);
  });

  test("leveringen tar bort en selvvurdering nettleseren sender med (tilElevsvar)", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    await lagreQuiz(laast, RESULTAT);
    const q = (await hentQuiz(t, laast.id))!;
    const [fv, ks] = q.sporsmal;

    // Samme vei som leverQuiz: tilElevsvar → rettQuiz → lagreForsoek.
    const elevsvar = tilElevsvar([
      { sporsmalId: fv.id, valgt: "Celledeling" },
      { sporsmalId: ks.id, skrevet: "Kjønnsceller", selvvurdertRiktig: true },
    ]);
    const retting = rettQuiz(q.sporsmal, elevsvar);
    const forsoekId = await lagreForsoek(t, laast.id, elevsvar, retting);

    expect(retting.antallRiktige).toBe(1);
    expect(retting.per.find((p) => p.sporsmalId === ks.id)?.riktig).toBe(false);
    const [rad] = await db.select().from(skjema.quizforsoek).where(eq(skjema.quizforsoek.id, forsoekId));
    expect(rad.antallRiktige).toBe(1);
    const lagret = JSON.parse(rad.svar).find((s: { sporsmalId: string }) => s.sporsmalId === ks.id);
    expect(lagret.skrevet).toBe("Kjønnsceller");
    expect(lagret).not.toHaveProperty("selvvurdertRiktig");
  });

  test("«ja» øker antallet, «nei» etterpå senker det igjen — også i det lagrede forsøket", async () => {
    const { t, tekstId, forsoekId, ks } = await levert("Kjønnsceller");

    const ja = await oppdaterSelvvurdering(t, tekstId, forsoekId, ks.id, true);
    expect(ja.antallRiktige).toBe(2);
    expect((await listForsoek(t, tekstId))[0].antallRiktige).toBe(2);

    const nei = await oppdaterSelvvurdering(t, tekstId, forsoekId, ks.id, false);
    expect(nei.antallRiktige).toBe(1);
    expect((await listForsoek(t, tekstId))[0].antallRiktige).toBe(1);

    const [rad] = await db.select().from(skjema.quizforsoek).where(eq(skjema.quizforsoek.id, forsoekId));
    expect(JSON.parse(rad.svar).find((s: { sporsmalId: string }) => s.sporsmalId === ks.id)).toMatchObject({
      skrevet: "Kjønnsceller",
      selvvurdertRiktig: false,
    });
  });

  test("et tomt kortsvar kan ikke bli riktig", async () => {
    const { t, tekstId, forsoekId, ks } = await levert("   ");
    await expect(oppdaterSelvvurdering(t, tekstId, forsoekId, ks.id, true)).rejects.toThrow(UgyldigVurdering);
    expect((await listForsoek(t, tekstId))[0].antallRiktige).toBe(1);
  });

  test("flervalg kan ikke endres etter levering", async () => {
    const { t, tekstId, forsoekId, fv } = await levert("Kjønnsceller");
    await expect(oppdaterSelvvurdering(t, tekstId, forsoekId, fv.id, false)).rejects.toThrow(UgyldigVurdering);
    expect((await listForsoek(t, tekstId))[0].antallRiktige).toBe(1);
  });

  test("en annen konto får IkkeFunnet og endrer ingenting", async () => {
    const { t, tekstId, forsoekId, ks } = await levert("Kjønnsceller");
    const annen = await nyKonto();
    await expect(oppdaterSelvvurdering(annen, tekstId, forsoekId, ks.id, true)).rejects.toThrow(IkkeFunnet);

    // Heller ikke via en egen tekst: forsøk-id-en hører til en annen quiz.
    const egen = await laastTekst(annen);
    await lagreQuiz(egen, RESULTAT);
    await expect(oppdaterSelvvurdering(annen, egen.id, forsoekId, ks.id, true)).rejects.toThrow(IkkeFunnet);

    expect((await listForsoek(t, tekstId))[0].antallRiktige).toBe(1);
  });
});

describe("eierskap — AD-8", () => {
  test("en annen konto finner ikke quizen, og kan ikke lagre forsøk på den", async () => {
    const eier = await nyKonto();
    const annen = await nyKonto();
    const laast = await laastTekst(eier);
    await lagreQuiz(laast, RESULTAT);

    await expect(hentQuiz(annen, laast.id)).rejects.toThrow(IkkeFunnet);
    await expect(listForsoek(annen, laast.id)).rejects.toThrow(IkkeFunnet);
    await expect(
      lagreForsoek(annen, laast.id, [], { per: [], antallRiktige: 2, antallTotalt: 2 }),
    ).rejects.toThrow(IkkeFunnet);
  });
});

describe("sletting — FR-37", () => {
  test("slettes teksten, forsvinner quizen, spørsmålene og forsøkene", async () => {
    const t = await nyKonto();
    const laast = await laastTekst(t);
    const quizId = await lagreQuiz(laast, RESULTAT);
    await lagreForsoek(t, laast.id, [], { per: [], antallRiktige: 1, antallTotalt: 2 });

    await slettTekst(t, laast.id);

    expect(await db.select().from(skjema.quiz).where(eq(skjema.quiz.id, quizId))).toHaveLength(0);
    expect(await db.select().from(skjema.quizsporsmal).where(eq(skjema.quizsporsmal.quizId, quizId))).toHaveLength(0);
    expect(await db.select().from(skjema.quizforsoek).where(eq(skjema.quizforsoek.quizId, quizId))).toHaveLength(0);
  });
});
