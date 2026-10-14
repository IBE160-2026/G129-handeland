/**
 * Tester for innloggingen — FR-35, FR-37 og AD-8.
 *
 * Kjører mot en ekte Postgres i minnet (PGlite), migrert med de samme
 * migrasjonsfilene som Neon. Ingen nettverk, ingen Docker, og ingenting
 * havner i produksjonsdatabasen.
 *
 * Det disse testene skal fange, er de feilene en KI-generert innlogging
 * typisk har: en sjekk som ligger i skjemaet men ikke i ruten, data som
 * lagres fordi biblioteket lagrer det som standard, og sletting som sletter
 * kontoen men lar innholdet ligge igjen.
 */

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, test } from "vitest";
import * as skjema from "./skjema";
import {
  INVITASJONSKODE_HEADER,
  gyldigInvitasjonskode,
  lagAuth,
} from "./auth";

const KODE = "test-invitasjon-123";
const BASE = "http://localhost:3000";

const klient = new PGlite();
const db = drizzle(klient, { schema: skjema, casing: "snake_case" });

// Datatilgangslaget (data/tilgang.ts) bruker den globale databasen. Den
// pekes hit FØR modulen importeres, så AD-8-testene går mot samme database.
(globalThis as unknown as { lesevennDb?: unknown }).lesevennDb = db;
const { hentTekst, listTekster, opprettTekst, IkkeFunnet } = await import(
  "./tilgang"
);

const auth = lagAuth(db, { secret: "x".repeat(32), baseURL: BASE });

beforeAll(async () => {
  await migrate(db, { migrationsFolder: "data/migrasjoner" });
  process.env.LESEVENN_INVITASJONSKODE = KODE;
});

/** En registrering slik en utenforstående ville sendt den: rett mot ruten. */
function registrerViaRuten(
  epost: string,
  passord: string,
  ekstra: Record<string, string> = {},
) {
  return auth.handler(
    new Request(`${BASE}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: BASE, ...ekstra },
      body: JSON.stringify({ email: epost, password: passord, name: "Ola Nordmann" }),
    }),
  );
}

async function registrer(epost: string, passord = "et-langt-passord") {
  const svar = await registrerViaRuten(epost, passord, {
    [INVITASJONSKODE_HEADER]: KODE,
  });
  expect(svar.status, await svar.clone().text()).toBe(200);
  const cookie = svar.headers.get("set-cookie") ?? "";
  const bruker = (await db.select().from(skjema.user).where(eq(skjema.user.email, epost)))[0];
  return { bruker, cookie: cookie.split(";")[0] };
}

describe("invitasjonskoden", () => {
  test("riktig kode godtas, feil eller manglende avvises", () => {
    expect(gyldigInvitasjonskode(KODE, KODE)).toBe(true);
    expect(gyldigInvitasjonskode(` ${KODE} `, KODE)).toBe(true);
    expect(gyldigInvitasjonskode("feil", KODE)).toBe(false);
    expect(gyldigInvitasjonskode("", KODE)).toBe(false);
    expect(gyldigInvitasjonskode(null, KODE)).toBe(false);
  });

  test("uten kode i miljøet er registreringen stengt, ikke åpen", () => {
    expect(gyldigInvitasjonskode("hva som helst", undefined)).toBe(false);
    expect(gyldigInvitasjonskode("", "")).toBe(false);
  });

  test("en POST rett mot ruten uten kode avvises", async () => {
    const svar = await registrerViaRuten("uten@kode.no", "et-langt-passord");
    expect(svar.status).toBe(403);
    const finnes = await db.select().from(skjema.user).where(eq(skjema.user.email, "uten@kode.no"));
    expect(finnes).toHaveLength(0);
  });

  test("en POST rett mot ruten med feil kode avvises", async () => {
    const svar = await registrerViaRuten("feil@kode.no", "et-langt-passord", {
      [INVITASJONSKODE_HEADER]: "gjettet",
    });
    expect(svar.status).toBe(403);
  });

  test("serverkallet går også gjennom sjekken", async () => {
    // Registreringsskjemaet bruker auth.api, ikke HTTP. Kroken må gjelde der
    // også — ellers ville sjekken bare stått i én av to veier inn.
    await expect(
      auth.api.signUpEmail({
        body: { email: "server@kode.no", password: "et-langt-passord", name: "" },
        headers: new Headers(),
      }),
    ).rejects.toThrow("Invitasjonskoden er feil.");
  });

  test("serverkallet med riktig kode i headeren lykkes", async () => {
    // Dette er veien registreringsskjemaet bruker.
    const svar = await auth.api.signUpEmail({
      body: { email: "server-ok@kode.no", password: "et-langt-passord", name: "" },
      headers: new Headers({ [INVITASJONSKODE_HEADER]: KODE }),
    });
    expect(svar.user.email).toBe("server-ok@kode.no");
  });
});

describe("hva som lagres — FR-35", () => {
  test("navnet klienten sendte lagres ikke", async () => {
    const { bruker } = await registrer("navn@test.no");
    expect(bruker.name).toBe("");
    expect(bruker.image).toBeNull();
  });

  test("passordet lagres aldri i klartekst", async () => {
    const passord = "mitt-hemmelige-passord";
    const { bruker } = await registrer("hash@test.no", passord);
    const [konto] = await db
      .select()
      .from(skjema.account)
      .where(eq(skjema.account.userId, bruker.id));
    expect(konto.password).toBeTruthy();
    expect(konto.password).not.toContain(passord);
  });

  test("økten lagrer verken IP-adresse eller nettleserinfo", async () => {
    const svar = await registrerViaRuten("ip@test.no", "et-langt-passord", {
      [INVITASJONSKODE_HEADER]: KODE,
      "x-forwarded-for": "203.0.113.7",
      "user-agent": "Testleser/1.0",
    });
    expect(svar.status).toBe(200);
    const [bruker] = await db.select().from(skjema.user).where(eq(skjema.user.email, "ip@test.no"));
    const oekter = await db
      .select()
      .from(skjema.session)
      .where(eq(skjema.session.userId, bruker.id));
    expect(oekter.length).toBeGreaterThan(0);
    for (const o of oekter) {
      expect(o.ipAddress).toBeNull();
      expect(o.userAgent).toBeNull();
    }
  });

  test("id-ene er UUID, slik fremmednøkkelen fra tekst krever", async () => {
    const { bruker } = await registrer("uuid@test.no");
    expect(bruker.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });
});

describe("eierskap — AD-8", () => {
  test("én konto finner ikke en annens tekst, selv med riktig id", async () => {
    const a = await registrer("a@eierskap.no");
    const b = await registrer("b@eierskap.no");

    const tekst = await opprettTekst(
      { kontoId: a.bruker.id },
      { tittel: "Mitose", raatekst: "x", redigertTekst: "x", vei: "liming" },
    );

    await expect(hentTekst({ kontoId: a.bruker.id }, tekst.id)).resolves.toBeTruthy();
    await expect(hentTekst({ kontoId: b.bruker.id }, tekst.id)).rejects.toThrow(IkkeFunnet);
    expect(await listTekster({ kontoId: b.bruker.id })).toHaveLength(0);
  });
});

describe("sletting av konto — FR-37", () => {
  test("feil passord sletter ingenting", async () => {
    const { bruker, cookie } = await registrer("feilpassord@slett.no", "riktig-passord-her");
    const svar = await auth.handler(
      new Request(`${BASE}/api/auth/delete-user`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: BASE, cookie },
        body: JSON.stringify({ password: "feil-passord-her" }),
      }),
    );
    expect(svar.status).not.toBe(200);
    const finnes = await db.select().from(skjema.user).where(eq(skjema.user.id, bruker.id));
    expect(finnes).toHaveLength(1);
  });

  test("kontoen og alt innholdet forsvinner", async () => {
    const passord = "slett-meg-passord";
    const { bruker, cookie } = await registrer("slett@slett.no", passord);
    const tekst = await opprettTekst(
      { kontoId: bruker.id },
      { tittel: "Skal bort", raatekst: "x", redigertTekst: "x", vei: "liming" },
    );
    await db.insert(skjema.avsnitt).values({
      tekstId: tekst.id,
      nummer: 1,
      innhold: "x",
      erOverskrift: false,
    });

    const svar = await auth.handler(
      new Request(`${BASE}/api/auth/delete-user`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: BASE, cookie },
        body: JSON.stringify({ password: passord }),
      }),
    );
    expect(svar.status, await svar.clone().text()).toBe(200);

    expect(await db.select().from(skjema.user).where(eq(skjema.user.id, bruker.id))).toHaveLength(0);
    expect(await db.select().from(skjema.account).where(eq(skjema.account.userId, bruker.id))).toHaveLength(0);
    expect(await db.select().from(skjema.session).where(eq(skjema.session.userId, bruker.id))).toHaveLength(0);
    expect(await db.select().from(skjema.tekst).where(eq(skjema.tekst.id, tekst.id))).toHaveLength(0);
    expect(await db.select().from(skjema.avsnitt).where(eq(skjema.avsnitt.tekstId, tekst.id))).toHaveLength(0);
  });
});

describe("begrensning av innloggingsforsøk", () => {
  test("gjentatte feil passord stoppes", async () => {
    const begrenset = lagAuth(db, {
      secret: "x".repeat(32),
      baseURL: BASE,
      begrensForsoek: true,
    });
    await registrer("gjett@test.no", "riktig-passord-her");

    const statuser: number[] = [];
    for (let i = 0; i < 6; i++) {
      const svar = await begrenset.handler(
        new Request(`${BASE}/api/auth/sign-in/email`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            origin: BASE,
            "x-forwarded-for": "198.51.100.9",
          },
          body: JSON.stringify({ email: "gjett@test.no", password: `gjett-${i}-xxxx` }),
        }),
      );
      statuser.push(svar.status);
    }
    expect(statuser).toContain(429);
  });
});
