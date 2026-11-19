/**
 * Tester for innsynsskriptet (data/innsyn.mjs) — FR-53, retten til en kopi.
 *
 * Mot PGlite, migrert med de samme filene som Neon. Kontoen lages gjennom
 * Better Auth, så passordhash og økttoken finnes og kan sjekkes for.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, test } from "vitest";
import { spawnSync } from "node:child_process";
import * as skjema from "./skjema";
import { ALDER_HEADER, INVITASJONSKODE_HEADER, VILKAAR_HEADER, VILKAARSVERSJON, lagAuth } from "./auth";
import { samleInnsyn } from "./innsyn.mjs";

const BASE = "http://localhost:3000";
const klient = new PGlite();
const db = drizzle(klient, { schema: skjema, casing: "snake_case" });
const auth = lagAuth(db, { secret: "x".repeat(32), baseURL: BASE });
const sporring = async (tekst: string, parametre: unknown[]) =>
  (await klient.query<Record<string, unknown>>(tekst, parametre)).rows;

async function registrer(epost: string) {
  const svar = await auth.handler(
    new Request(`${BASE}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: BASE,
        [INVITASJONSKODE_HEADER]: "kode",
        [ALDER_HEADER]: "ja",
        [VILKAAR_HEADER]: VILKAARSVERSJON,
      },
      body: JSON.stringify({ email: epost, password: "et-langt-passord", name: "" }),
    }),
  );
  expect(svar.status, await svar.clone().text()).toBe(200);
  const [u] = await db.select().from(skjema.user).where(eq(skjema.user.email, epost.toLowerCase()));
  return u.id;
}

/** En Tekst med ett Avsnitt, en Quiz med ett spørsmål og ett forsøk, og en Mappe. */
async function fyll(kontoId: string, tittel: string) {
  const [t] = await db
    .insert(skjema.tekst)
    .values({ kontoId, tittel, raatekst: "x", redigertTekst: "x", vei: "liming" })
    .returning();
  const [a] = await db.insert(skjema.avsnitt).values({ tekstId: t.id, nummer: 1, innhold: "x", erOverskrift: false }).returning();
  const [q] = await db.insert(skjema.quiz).values({ tekstId: t.id, promptversjon: "v1", modell: "m" }).returning();
  await db.insert(skjema.quizsporsmal).values({
    quizId: q.id,
    nummer: 1,
    sporsmal: `${tittel}?`,
    erFlervalg: false,
    riktigSvar: "x",
    kildeavsnittId: a.id,
  });
  await db.insert(skjema.quizforsoek).values({ quizId: q.id, svar: "[]", antallRiktige: 1, antallTotalt: 1 });
  const [m] = await db.insert(skjema.mappe).values({ kontoId, tittel: `Mappe ${tittel}` }).returning();
  await db.insert(skjema.mappeTekst).values({ mappeId: m.id, tekstId: t.id });
  await db.insert(skjema.forbruk).values({
    kontoId,
    oppgave: "quiz",
    modell: "m",
    tokensInn: 1,
    tokensUt: 1,
    mikrodollar: 1,
  });
  return t.id;
}

let eleven: string;
let tekstId: string;

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
  process.env.LESEVENN_INVITASJONSKODE = "kode";
  eleven = await registrer("Eleven@Innsyn.no");
  tekstId = await fyll(eleven, "Mitose");
  const annen = await registrer("annen@innsyn.no");
  await fyll(annen, "Hemmelig");
});

describe("innsyn — FR-53", () => {
  test("tar med alle radene som hører til kontoen", async () => {
    const innsyn = await samleInnsyn(sporring, "eleven@innsyn.no");
    expect(innsyn).not.toBeNull();
    const t = innsyn!.tabeller;
    expect(innsyn!.kontoId).toBe(eleven);
    for (const tabell of [
      "user",
      "account",
      "session",
      "vilkaarsbekreftelse",
      "tekst",
      "avsnitt",
      "quiz",
      "quizsporsmal",
      "quizforsoek",
      "mappe",
      "mappe_tekst",
      "forbruk",
    ]) {
      expect(t[tabell], tabell).toHaveLength(1);
    }
    expect(t.tekst[0].id).toBe(tekstId);
    expect(t.vilkaarsbekreftelse[0].versjon).toBe(VILKAARSVERSJON);
  });

  test("tar ikke med en annen kontos rader", async () => {
    const innsyn = await samleInnsyn(sporring, "eleven@innsyn.no");
    expect(JSON.stringify(innsyn)).not.toContain("Hemmelig");
    expect(JSON.stringify(innsyn)).not.toContain("annen@innsyn.no");
  });

  test("uten passordhash og økttokener", async () => {
    const [konto] = await db.select().from(skjema.account).where(eq(skjema.account.userId, eleven));
    const [oekt] = await db.select().from(skjema.session).where(eq(skjema.session.userId, eleven));
    expect(konto.password).toBeTruthy();
    const innsyn = await samleInnsyn(sporring, "eleven@innsyn.no");
    const json = JSON.stringify(innsyn);
    expect(json).not.toContain(konto.password!);
    expect(json).not.toContain(oekt.token);
    expect(innsyn!.tabeller.account[0]).not.toHaveProperty("password");
    expect(innsyn!.tabeller.session[0]).not.toHaveProperty("token");
  });

  test("ukjent e-post gir null", async () => {
    expect(await samleInnsyn(sporring, "finnes-ikke@innsyn.no")).toBeNull();
  });

  test("skriptet uten e-post sier hvordan det brukes, og avslutter med feil", () => {
    const ut = spawnSync(process.execPath, ["data/innsyn.mjs"], { encoding: "utf8" });
    expect(ut.status).not.toBe(0);
    expect(ut.stderr).toContain("Bruk: node data/innsyn.mjs");
  });
});
