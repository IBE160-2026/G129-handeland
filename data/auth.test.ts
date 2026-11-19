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
import { eq, sql } from "drizzle-orm";
import { beforeAll, describe, expect, test } from "vitest";
import * as skjema from "./skjema";
import {
  ALDER_HEADER,
  INVITASJONSKODE_HEADER,
  VILKAAR_HEADER,
  VILKAARSVERSJON,
  gyldigInvitasjonskode,
  hashTellernoekkel,
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

/** Det skjemaet sender når eleven har krysset av for begge (FR-53). */
const VILKAAR = { [ALDER_HEADER]: "ja", [VILKAAR_HEADER]: VILKAARSVERSJON };

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
    ...VILKAAR,
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
      headers: new Headers({ [INVITASJONSKODE_HEADER]: KODE, ...VILKAAR }),
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
      ...VILKAAR,
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
    // De tre første er innenfor grensen (3 per 10 s); sperren kom etterpå.
    expect(statuser.slice(0, 3)).not.toContain(429);
  });

  test("telleren lagrer ikke IP-adressen i klartekst — kodefunn 28", async () => {
    const begrenset = lagAuth(db, {
      secret: "x".repeat(32),
      baseURL: BASE,
      begrensForsoek: true,
    });
    const ip = "192.0.2.44";
    await begrenset.handler(
      new Request(`${BASE}/api/auth/sign-in/email`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: BASE, "x-forwarded-for": ip },
        body: JSON.stringify({ email: "ingen@test.no", password: "feil-passord-xx" }),
      }),
    );
    const rader = await db.select().from(skjema.rateLimit);
    expect(rader.length).toBeGreaterThan(0);
    for (const r of rader) {
      expect(r.key).not.toContain(ip);
      expect(r.key).not.toContain("198.51.100.9");
      expect(r.key).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  test("samme adresse gir samme nøkkel, en annen adresse en annen", () => {
    const a = hashTellernoekkel("192.0.2.44/sign-in/email", "hemmelig");
    expect(hashTellernoekkel("192.0.2.44/sign-in/email", "hemmelig")).toBe(a);
    expect(hashTellernoekkel("192.0.2.45/sign-in/email", "hemmelig")).not.toBe(a);
    expect(hashTellernoekkel("192.0.2.44/sign-in/email", "en-annen")).not.toBe(a);
  });

  test("en annen IP-adresse sperres ikke av den første", async () => {
    const begrenset = lagAuth(db, {
      secret: "x".repeat(32),
      baseURL: BASE,
      begrensForsoek: true,
    });
    const forsoek = (ip: string) =>
      begrenset.handler(
        new Request(`${BASE}/api/auth/sign-in/email`, {
          method: "POST",
          headers: { "content-type": "application/json", origin: BASE, "x-forwarded-for": ip },
          body: JSON.stringify({ email: "ingen@test.no", password: "feil-passord-xx" }),
        }),
      );
    const statuser: number[] = [];
    for (let i = 0; i < 5; i++) statuser.push((await forsoek("198.51.100.20")).status);
    expect(statuser).toContain(429);
    expect((await forsoek("198.51.100.21")).status).not.toBe(429);
  });
});

/* ------------------------------------------------------------------ */

async function bekreftelser(epost: string) {
  const [bruker] = await db.select().from(skjema.user).where(eq(skjema.user.email, epost));
  if (!bruker) return { bruker: undefined, rader: [] };
  const rader = await db
    .select()
    .from(skjema.vilkaarsbekreftelse)
    .where(eq(skjema.vilkaarsbekreftelse.kontoId, bruker.id));
  return { bruker, rader };
}

describe("vilkår og aldersgrense — FR-53", () => {
  test("godkjent: kontoen lages, med én rad med gjeldende versjon og tidspunkt", async () => {
    const foer = Date.now();
    await registrer("godkjent@vilkaar.no");
    const { bruker, rader } = await bekreftelser("godkjent@vilkaar.no");
    expect(bruker).toBeTruthy();
    expect(rader).toHaveLength(1);
    expect(rader[0].versjon).toBe(VILKAARSVERSJON);
    expect(rader[0].bekreftet.getTime()).toBeGreaterThanOrEqual(foer - 5000);
    // FR-35: bare at, når og hvilken versjon. Ingen alder.
    expect(Object.keys(rader[0]).sort()).toEqual(["bekreftet", "kontoId", "versjon"]);
  });

  test("mangler alder: ingen konto, ingen rad, og meldingen sier aldersgrensen", async () => {
    const svar = await registrerViaRuten("alder@vilkaar.no", "et-langt-passord", {
      [INVITASJONSKODE_HEADER]: KODE,
      [VILKAAR_HEADER]: VILKAARSVERSJON,
    });
    expect(svar.status).toBe(403);
    const kropp = await svar.json();
    expect(kropp.code).toBe("ALDER_IKKE_BEKREFTET");
    expect(kropp.message).toContain("15 år");
    expect((await bekreftelser("alder@vilkaar.no")).bruker).toBeUndefined();
  });

  test("mangler vilkår: ingen konto, og meldingen viser til siden", async () => {
    const svar = await registrerViaRuten("vilkaar@vilkaar.no", "et-langt-passord", {
      [INVITASJONSKODE_HEADER]: KODE,
      [ALDER_HEADER]: "ja",
    });
    expect(svar.status).toBe(403);
    const kropp = await svar.json();
    expect(kropp.code).toBe("VILKAAR_IKKE_GODTATT");
    expect(kropp.message).toContain("/vilkaar");
    expect((await bekreftelser("vilkaar@vilkaar.no")).bruker).toBeUndefined();
  });

  test("rett mot ruten med riktig kode, men uten headerne: avvist", async () => {
    const svar = await registrerViaRuten("rute@vilkaar.no", "et-langt-passord", {
      [INVITASJONSKODE_HEADER]: KODE,
    });
    expect(svar.status).toBe(403);
    expect((await svar.json()).message).toMatch(/15 år/);
    expect((await bekreftelser("rute@vilkaar.no")).bruker).toBeUndefined();
  });

  test("alder må være nettopp «ja», ikke hva som helst", async () => {
    const svar = await registrerViaRuten("nei@vilkaar.no", "et-langt-passord", {
      [INVITASJONSKODE_HEADER]: KODE,
      [ALDER_HEADER]: "nei",
      [VILKAAR_HEADER]: VILKAARSVERSJON,
    });
    expect(svar.status).toBe(403);
  });

  test("gammel versjon: avvist med «Vilkårene er endret — last siden på nytt»", async () => {
    const svar = await registrerViaRuten("gammel@vilkaar.no", "et-langt-passord", {
      [INVITASJONSKODE_HEADER]: KODE,
      [ALDER_HEADER]: "ja",
      [VILKAAR_HEADER]: "2025-01-01",
    });
    expect(svar.status).toBe(403);
    const kropp = await svar.json();
    expect(kropp.code).toBe("VILKAAR_ENDRET");
    expect(kropp.message).toBe("Vilkårene er endret — last siden på nytt.");
    expect((await bekreftelser("gammel@vilkaar.no")).bruker).toBeUndefined();
  });

  test("serverkallet går også gjennom vilkårssjekken", async () => {
    await expect(
      auth.api.signUpEmail({
        body: { email: "server@vilkaar.no", password: "et-langt-passord", name: "" },
        headers: new Headers({ [INVITASJONSKODE_HEADER]: KODE }),
      }),
    ).rejects.toThrow("15 år");
  });

  test("eksisterende konto uten bekreftelse logger inn som før", async () => {
    await registrer("gammel-konto@vilkaar.no", "gammelt-passord-her");
    const { bruker } = await bekreftelser("gammel-konto@vilkaar.no");
    // Slik ser en konto fra før 19.11 ut: ingen rad.
    await db
      .delete(skjema.vilkaarsbekreftelse)
      .where(eq(skjema.vilkaarsbekreftelse.kontoId, bruker!.id));
    const svar = await auth.handler(
      new Request(`${BASE}/api/auth/sign-in/email`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: BASE },
        body: JSON.stringify({ email: "gammel-konto@vilkaar.no", password: "gammelt-passord-her" }),
      }),
    );
    expect(svar.status, await svar.clone().text()).toBe(200);
  });

  test("kontosletting tar med bekreftelsen (cascade)", async () => {
    const passord = "slett-vilkaar-passord";
    const { bruker, cookie } = await registrer("slett@vilkaar.no", passord);
    expect((await bekreftelser("slett@vilkaar.no")).rader).toHaveLength(1);
    const svar = await auth.handler(
      new Request(`${BASE}/api/auth/delete-user`, {
        method: "POST",
        headers: { "content-type": "application/json", origin: BASE, cookie },
        body: JSON.stringify({ password: passord }),
      }),
    );
    expect(svar.status, await svar.clone().text()).toBe(200);
    const rader = await db
      .select()
      .from(skjema.vilkaarsbekreftelse)
      .where(eq(skjema.vilkaarsbekreftelse.kontoId, bruker.id));
    expect(rader).toHaveLength(0);
  });

  test("ingen konto uten bekreftelse: mislykkes lagringen, finnes ikke kontoen", async () => {
    // En egen database der tabellen mangler, så lagringen av bekreftelsen feiler.
    const annen = drizzle(new PGlite(), { schema: skjema, casing: "snake_case" });
    await migrate(annen, { migrationsFolder: "data/migrasjoner" });
    await annen.execute(sql`DROP TABLE "vilkaarsbekreftelse"`);
    const annenAuth = lagAuth(annen, { secret: "x".repeat(32), baseURL: BASE });
    const svar = await annenAuth.handler(
      new Request(`${BASE}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: BASE,
          [INVITASJONSKODE_HEADER]: KODE,
          ...VILKAAR,
        },
        body: JSON.stringify({ email: "atomisk@vilkaar.no", password: "et-langt-passord", name: "" }),
      }),
    );
    expect(svar.status).not.toBe(200);
    expect(await annen.select().from(skjema.user)).toHaveLength(0);
    expect(await annen.select().from(skjema.account)).toHaveLength(0);
    expect(await annen.select().from(skjema.session)).toHaveLength(0);
  }, 60_000);
});
