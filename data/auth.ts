/**
 * Innlogging — FR-35. Better Auth, med e-post og passord.
 *
 * ## Hva denne fila bestemmer
 *
 * - **Hvem som kan registrere seg:** bare den som har invitasjonskoden
 *   (`LESEVENN_INVITASJONSKODE`). Appen ligger på en offentlig adresse, og
 *   hver tekst koster modellkall på prosjektets nøkkel. PRD-en forutsetter
 *   frivillige testbrukere som har samtykket, ikke åpen drift.
 * - **Hvem som kan registrere seg:** bare den som er 15 år eller eldre og har
 *   lest vilkårene (FR-53). Eleven krysser av for begge; serveren avviser
 *   registreringen uten dem, og lagrer bare at, når og hvilken versjon
 *   (`vilkaarsbekreftelse`). Behandlingsgrunnlaget er avtale, ikke samtykke.
 * - **Hva som lagres:** e-post og passordhash. Ikke navn, ikke alder, ikke
 *   IP-adresse på økten, ikke nettleserinfo (FR-35, minst mulig data).
 * - **Hvordan forsøk begrenses:** i databasen, ikke i minnet, fordi Vercel
 *   kjører mange kortlivede instanser. Telleren er per IP-adresse, men
 *   nøkkelen hashes før den lagres, så adressen står ikke i klartekst i
 *   `rate_limit` (kodefunn 28).
 *
 * Ingen e-post sendes i v1: ingen bekreftelse av adressen, ingen «glemt
 * passord». Det er et bevisst valg — en e-posttjeneste er en ny tredjepart
 * som behandler elevenes adresser. Konsekvensen er at et glemt passord betyr
 * ny konto.
 *
 * ## Hvorfor skjemaene går via HTTP og ikke via `auth.api`
 *
 * Begrensningen av innloggingsforsøk ligger i Better Auths HTTP-ruter. Et
 * kall til `auth.api.signInEmail` fra serveren går forbi den — målt: åtte
 * feil passord på rad ga åtte avslag og ingen sperre. Skjemaene bruker derfor
 * Better Auths klient i nettleseren (app/komponenter/authKlient.ts), som går
 * gjennom `/api/auth/*`. Eleven og en angriper går da gjennom samme dør, med
 * samme sperre. Se kodefunn 11.
 *
 * ## Hvorfor invitasjonskoden sjekkes HER og ikke i skjemaet
 *
 * Better Auth eksponerer `/api/auth/sign-up/email` som en åpen rute. En sjekk
 * bare i registreringsskjemaet ville vært en sjekk bare for dem som bruker
 * skjemaet — en POST rett mot ruten ville gått forbi. Kroken under kjører for
 * hver registrering, uansett vei inn. Samme resonnement som AD-8.
 */

import { AsyncLocalStorage } from "node:async_hooks";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { lt, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { db } from "./db";
import { INVITASJONSKODE_HEADER } from "./invitasjon";
import * as skjema from "./skjema";
import {
  ALDER_BEKREFTET,
  ALDER_HEADER,
  VILKAAR_FEIL,
  VILKAAR_HEADER,
  VILKAARSVERSJON,
} from "./vilkaar";

export { ALDER_HEADER, INVITASJONSKODE_HEADER, VILKAAR_HEADER, VILKAARSVERSJON };

/**
 * Er den oppgitte koden riktig?
 *
 * Mangler koden i miljøet, er registreringen STENGT, ikke åpen. En glemt
 * variabel skal ikke gjøre appen tilgjengelig for alle.
 *
 * Sammenligningen tar like lang tid uansett hvor mange tegn som er riktige,
 * så koden ikke kan gjettes tegn for tegn ved å måle svartiden. Begge sider
 * hashes først fordi `timingSafeEqual` krever like lange verdier.
 */
export function gyldigInvitasjonskode(
  oppgitt: string | null | undefined,
  forventet: string | undefined = process.env.LESEVENN_INVITASJONSKODE,
): boolean {
  if (!forventet || !oppgitt) return false;
  const a = createHash("sha256").update(oppgitt.trim()).digest();
  const b = createHash("sha256").update(forventet.trim()).digest();
  return timingSafeEqual(a, b);
}

type Database = Parameters<typeof drizzleAdapter>[0];
type Drizzle = PgDatabase<PgQueryResultHKT, Record<string, unknown>>;

/**
 * FR-53: er alder og vilkår bekreftet, med gjeldende versjon? Gir feilen
 * som skal kastes, eller `null`.
 */
export function vilkaarsfeil(headere: Headers | undefined): APIError | null {
  if (headere?.get(ALDER_HEADER) !== ALDER_BEKREFTET) {
    return new APIError("FORBIDDEN", {
      code: VILKAAR_FEIL.alder,
      message:
        "Du må bekrefte at du er 15 år eller eldre. LeseBuddy er for elever fra 15 år.",
    });
  }
  const versjon = headere.get(VILKAAR_HEADER);
  if (!versjon) {
    return new APIError("FORBIDDEN", {
      code: VILKAAR_FEIL.vilkaar,
      message:
        "Du må bekrefte at du har lest vilkårene og personvernerklæringen. Les dem på /vilkaar.",
    });
  }
  if (versjon !== VILKAARSVERSJON) {
    return new APIError("FORBIDDEN", {
      code: VILKAAR_FEIL.endret,
      message: "Vilkårene er endret — last siden på nytt.",
    });
  }
  return null;
}

/**
 * Nøkkelen i `rate_limit`, hashet. Better Auth lager nøkkelen av IP-adressen
 * og stien; HMAC med `BETTER_AUTH_SECRET` gjør at den ikke kan føres tilbake
 * til adressen uten hemmeligheten, heller ikke ved å prøve alle
 * IPv4-adresser. Samme adresse gir samme nøkkel, så telleren virker som før.
 * Hemmeligheten finnes alt i Vercel, så ingen ny miljøvariabel trengs.
 */
export function hashTellernoekkel(noekkel: string, hemmelighet: string): string {
  return createHmac("sha256", hemmelighet).update(noekkel).digest("hex");
}

/** Rader eldre enn dette slettes når en teller startes på nytt. */
const TELLER_LEVETID_MS = 10 * 60 * 1000;

/**
 * Telleren for innloggingsforsøk, i `rate_limit`, med hashet nøkkel
 * (Better Auth `rateLimit.customStorage`). Erstatter `storage: "database"`,
 * som lagret IP-adressen i klartekst i nøkkelen (kodefunn 28).
 *
 * Samme regel som Better Auths egen databaseteller: er forrige forsøk eldre
 * enn vinduet, starter telleren på 1; ellers telles det opp til `max`, og
 * forsøket etter det avvises. Hele avgjørelsen er én `INSERT … ON CONFLICT`,
 * så to samtidige forsøk ikke kan lese samme gamle tall.
 */
function hashetTeller(database: Drizzle, hemmelighet: () => string) {
  const rl = skjema.rateLimit;
  return {
    async consume(noekkel: string, regel: { window: number; max: number }) {
      const key = hashTellernoekkel(noekkel, hemmelighet());
      const naa = Date.now();
      const vinduStart = naa - regel.window * 1000;
      const utloept = sql`${rl.lastRequest} <= ${vinduStart}`;
      const [rad] = await database
        .insert(rl)
        .values({ key, count: 1, lastRequest: naa })
        .onConflictDoUpdate({
          target: rl.key,
          set: {
            count: sql`CASE WHEN ${utloept} THEN 1 WHEN ${rl.count} < ${regel.max} THEN ${rl.count} + 1 ELSE ${rl.count} END`,
            lastRequest: sql`CASE WHEN ${utloept} OR ${rl.count} < ${regel.max} THEN ${naa}::bigint ELSE ${rl.lastRequest} END`,
          },
        })
        .returning({ count: rl.count, lastRequest: rl.lastRequest });

      // Forsøket ble talt, og dermed sluppet gjennom, bare hvis tidspunktet ble satt.
      const sist = Number(rad.lastRequest);
      if (sist === naa) {
        if (rad.count === 1) {
          // Ny eller nullstilt teller: rydd bort gamle rader, som Better Auth gjør.
          await database
            .delete(rl)
            .where(lt(rl.lastRequest, naa - TELLER_LEVETID_MS))
            .catch((e: unknown) => console.error("Kunne ikke rydde i rate_limit:", e));
        }
        return { allowed: true, retryAfter: null };
      }
      return {
        allowed: false,
        retryAfter: Math.max(1, Math.ceil((sist + regel.window * 1000 - naa) / 1000)),
      };
    },
  };
}

/**
 * Transaksjonen Better Auth kjører registreringen i, så vilkårsbekreftelsen
 * kan skrives i den samme (se `account.create.before` i `lagAuth`).
 *
 * Better Auth gir krokene sin egen adapter, ikke Drizzle-transaksjonen, og
 * den adapteren kjenner bare Better Auths egne tabeller. Derfor pakkes
 * databasen inn: når adapteren starter en transaksjon, huskes den her for
 * resten av kallet.
 */
const aktivTransaksjon = new AsyncLocalStorage<Drizzle>();

function medHuskettransaksjon(database: Database): Database {
  return new Proxy(database, {
    get(maal, egenskap) {
      const verdi = Reflect.get(maal, egenskap);
      if (egenskap !== "transaction" || typeof verdi !== "function") return verdi;
      return (fn: (tx: Drizzle) => unknown, ...resten: unknown[]) =>
        verdi.call(
          maal,
          (tx: Drizzle) => aktivTransaksjon.run(tx, () => fn(tx)),
          ...resten,
        );
    },
  });
}

/**
 * Bygger innloggingen mot en gitt database.
 *
 * Fabrikk framfor modulkonstant, av to grunner: testene bygger den mot en
 * database i minnet (PGlite), og `next build` evaluerer moduler uten at
 * hemmeligheten nødvendigvis finnes. Appen bruker `hentAuth()` under.
 */
export function lagAuth(
  database: Database,
  valg: { secret?: string; baseURL?: string; begrensForsoek?: boolean } = {},
) {
  const hemmelighet = () => {
    const h = valg.secret ?? process.env.BETTER_AUTH_SECRET;
    if (!h) {
      throw new Error(
        "BETTER_AUTH_SECRET mangler, så telleren for innloggingsforsøk kan ikke hashe nøkkelen.",
      );
    }
    return h;
  };

  return betterAuth({
    secret: valg.secret ?? process.env.BETTER_AUTH_SECRET,
    baseURL: valg.baseURL ?? process.env.BETTER_AUTH_URL,

    database: drizzleAdapter(medHuskettransaksjon(database), {
      provider: "pg",
      // Registreringen (bruker, innlogging, økt) i én transaksjon, så
      // vilkårsbekreftelsen kan skrives i den samme: mislykkes den, finnes
      // heller ikke kontoen (FR-53).
      transaction: true,
      schema: {
        user: skjema.user,
        session: skjema.session,
        account: skjema.account,
        verification: skjema.verification,
        rateLimit: skjema.rateLimit,
      },
    }),

    emailAndPassword: {
      enabled: true,
      // Ingen e-post i v1, altså ingen bekreftelse å vente på.
      requireEmailVerification: false,
      autoSignIn: true,
    },

    // FR-37: eleven kan slette kontoen sin. Alt annet går med via
    // fremmednøklenes cascade (data/skjema.ts).
    user: { deleteUser: { enabled: true } },

    // Standard er på i drift og av ellers; `begrensForsoek` lar testene slå
    // den på for å vise at den virker.
    // Telleren ligger i `rate_limit` som før, men med hashet nøkkel, så
    // IP-adressen ikke lagres i klartekst (kodefunn 28).
    rateLimit: {
      enabled: valg.begrensForsoek,
      customStorage: hashetTeller(database as unknown as Drizzle, hemmelighet),
      // Innlogging: 5 forsøk per 60 s. Better Auths standard for /sign-in er
      // 3 per 10 s, som sperrer en elev som skriver feil passord to–tre
      // ganger på rad. Fem per minutt gir rom for skrivefeil og er fortsatt
      // for lite til å gjette passord. Registreringen beholder standarden.
      // Stien er uten /api/auth; telleren rydder rader eldre enn 10 min,
      // som er lengre enn vinduet.
      customRules: {
        "/sign-in/email": { window: 60, max: 5 },
      },
    },

    advanced: {
      // UUID, slik at tekst.kontoId kan ha fremmednøkkel til user.id.
      database: { generateId: "uuid" },
    },

    databaseHooks: {
      user: {
        create: {
          // FR-35: ingen navn og ingen bilde, uansett hva klienten sendte.
          // Better Auth krever feltet `name`, så det får en tom streng.
          before: async (bruker) => ({
            data: { ...bruker, name: "", image: null },
          }),
        },
      },
      account: {
        create: {
          // FR-53: bekreftelsen lagres når kontoen lages, i samme transaksjon
          // som brukeren (se `medHuskettransaksjon`). Et kast her ruller
          // tilbake brukeren også: ingen konto uten bekreftelse.
          //
          // Her og ikke i `user.create.after`: after-krokene kjører først
          // etter at transaksjonen er committet, og da finnes kontoen
          // allerede. Innloggingen (account) lages rett etter brukeren, i
          // samme transaksjon, og bare ved registrering.
          before: async (konto, ctx) => {
            if (ctx?.path !== "/sign-up/email") return;
            const tx = aktivTransaksjon.getStore();
            if (!tx) {
              throw new Error("Vilkårsbekreftelsen må lagres i samme transaksjon som kontoen.");
            }
            await tx.insert(skjema.vilkaarsbekreftelse).values({
              kontoId: konto.userId,
              versjon: VILKAARSVERSJON,
            });
          },
        },
      },
      session: {
        create: {
          // IP-adressen BRUKES til å begrense innloggingsforsøk, men LAGRES
          // ikke på økten, og i telleren bare som hash (kodefunn 28).
          // Nettleserinfo lagres ikke i det hele tatt.
          before: async (oekt) => ({
            data: { ...oekt, ipAddress: null, userAgent: null },
          }),
        },
      },
    },

    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/sign-up/email") return;
        if (!gyldigInvitasjonskode(ctx.headers?.get(INVITASJONSKODE_HEADER))) {
          throw new APIError("FORBIDDEN", {
            message: "Invitasjonskoden er feil.",
          });
        }
        // FR-53: alder og vilkår, på serveren, uansett vei inn.
        const feil = vilkaarsfeil(ctx.headers);
        if (feil) throw feil;
      }),
    },

    // Må stå sist: lar server actions sette innloggingscookien.
    plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof lagAuth>;

const globalForAuth = globalThis as unknown as { lesevennAuth?: Auth };

/** Innloggingen appen bruker, bygget første gang den trengs. */
export function hentAuth(): Auth {
  if (!globalForAuth.lesevennAuth) {
    globalForAuth.lesevennAuth = lagAuth(db);
  }
  return globalForAuth.lesevennAuth;
}
