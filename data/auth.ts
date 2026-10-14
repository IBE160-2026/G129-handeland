/**
 * Innlogging — FR-35. Better Auth, med e-post og passord.
 *
 * ## Hva denne fila bestemmer
 *
 * - **Hvem som kan registrere seg:** bare den som har invitasjonskoden
 *   (`LESEVENN_INVITASJONSKODE`). Appen ligger på en offentlig adresse, og
 *   hver tekst koster modellkall på prosjektets nøkkel. PRD-en forutsetter
 *   frivillige testbrukere som har samtykket, ikke åpen drift.
 * - **Hva som lagres:** e-post og passordhash. Ikke navn, ikke IP-adresse,
 *   ikke nettleserinfo (FR-35, minst mulig data).
 * - **Hvordan forsøk begrenses:** i databasen, ikke i minnet, fordi Vercel
 *   kjører mange kortlivede instanser.
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

import { createHash, timingSafeEqual } from "node:crypto";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import { INVITASJONSKODE_HEADER } from "./invitasjon";
import * as skjema from "./skjema";

export { INVITASJONSKODE_HEADER };

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
  return betterAuth({
    secret: valg.secret ?? process.env.BETTER_AUTH_SECRET,
    baseURL: valg.baseURL ?? process.env.BETTER_AUTH_URL,

    database: drizzleAdapter(database, {
      provider: "pg",
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
    rateLimit: { storage: "database", enabled: valg.begrensForsoek },

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
      session: {
        create: {
          // IP-adressen BRUKES til å begrense innloggingsforsøk, men
          // LAGRES ikke på økten. Det samme gjelder nettleserinfo.
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
