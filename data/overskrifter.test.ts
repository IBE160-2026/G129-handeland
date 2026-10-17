/**
 * Tester for fase 3a i datalaget — FR-3, AD-8, AD-9. Mot PGlite.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, test } from "vitest";
import * as skjema from "./skjema";

const db = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;

const { opprettTekst, hentTekst, godkjennOverskrifter, lagreForkunnskapssvar, IkkeFunnet } = await import("./tilgang");

const TEKST = "Celler\n\nMitose er celledeling.";
let n = 0;
async function nyKonto() {
  const [u] = await db.insert(skjema.user).values({ name: "", email: `h${++n}@test.no` }).returning({ id: skjema.user.id });
  return { kontoId: u.id };
}
const ny = (t: { kontoId: string }) => opprettTekst(t, { tittel: "Celler", raatekst: TEKST, redigertTekst: TEKST, vei: "liming" });

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
});

describe("FR-3 fase 3a", () => {
  test("en ny tekst er ikke godkjent; godkjenning lagrer teksten og tidspunktet", async () => {
    const t = await nyKonto();
    const rad = await ny(t);
    expect(rad.overskrifterGodkjent).toBeNull();
    await godkjennOverskrifter(t, rad.id, "Cellebiologi\n\nMitose er celledeling.");
    const etter = await hentTekst(t, rad.id);
    expect(etter.overskrifterGodkjent).not.toBeNull();
    expect(etter.redigertTekst).toBe("Cellebiologi\n\nMitose er celledeling.");
    expect(etter.raatekst).toBe(TEKST);
  });

  test("AD-9: etter aktiveringen kan overskriftene ikke endres", async () => {
    const t = await nyKonto();
    const rad = await ny(t);
    await godkjennOverskrifter(t, rad.id, TEKST);
    await lagreForkunnskapssvar(t, rad.id, "Noe om celler.");
    await expect(godkjennOverskrifter(t, rad.id, "Annet\n\nTekst.")).rejects.toBeInstanceOf(IkkeFunnet);
  });

  test("AD-8: en annen konto kan ikke godkjenne", async () => {
    const rad = await ny(await nyKonto());
    await expect(godkjennOverskrifter(await nyKonto(), rad.id, TEKST)).rejects.toBeInstanceOf(IkkeFunnet);
  });
});

describe("FR-5 — genererte etiketter", () => {
  test("lagres én gang, sammen med listen over hvilke de er", async () => {
    const { lagreEtiketter } = await import("./tilgang");
    const t = await nyKonto();
    const rad = await ny(t);
    await lagreEtiketter(t, rad.id, "Om celler\n\nMitose er celledeling.", ["Om celler"]);
    const etter = await hentTekst(t, rad.id);
    expect(etter.genererteOverskrifter).toEqual(["Om celler"]);
    await expect(lagreEtiketter(t, rad.id, "Annet\n\nX.", ["Annet"])).rejects.toBeInstanceOf(IkkeFunnet);
  });
});
