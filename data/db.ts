/**
 * Databaseklienten.
 *
 * Importeres BARE av `data/`, `tekst/` og `app/`. Generatorlaget skal aldri se
 * denne fila — det er AD-10, og det er den regelen som gjør at måleharnessen
 * kan kjøre uten database.
 *
 * ## To drivere, valgt ut fra tilkoblingsstrengen
 *
 * Appen kjører mot Neon i drift og mot en vanlig Postgres lokalt, og de to
 * krever ulike drivere. Neons `@neondatabase/serverless` går over WebSocket
 * gjennom Neons egen proxy og kan ikke snakke med en Postgres som ikke står
 * bak den proxyen. `pg` snakker standard Postgres-protokoll over TCP, men mot
 * Neon fra et nett som sperrer 5432 kommer den ikke fram.
 *
 * Valget tas derfor på vertsnavnet: peker URL-en på Neon, brukes Neons driver;
 * ellers brukes `pg`. Det betyr at samme kodebase kjører både i drift og mot en
 * lokal database i Docker, uten at noen må bytte driver for hånd.
 *
 * Grunnen til at det i det hele tatt skal være mulig å kjøre lokalt: en app som
 * bare kan kjøres av den som eier skytjenestene og nøklene, kan ingen
 * utenforstående vurdere. Se også testmodus i `generatorer/lagretsvar.ts`, som
 * gjør det samme for språkmodellkallene.
 *
 * ## Hvorfor WebSocket og ikke HTTP på Neon-siden
 *
 * Neon tilbyr begge. HTTP-varianten (`drizzle-orm/neon-http`) er raskere for
 * enkeltspørringer, men støtter bare ikke-interaktive batcher. `laasTekst` i
 * `tekst/las.ts` trenger en ekte transaksjon: innsettingen av avsnittslisten er
 * avhengig av at oppdateringen til `laast` traff. Uten transaksjon kan man ende
 * med en låst Tekst uten avsnitt — nøyaktig korrupsjonen AD-9 og AD-15 finnes
 * for å hindre, siden alt generert innhold peker på avsnittsnumre.
 *
 * ## Migrasjoner
 *
 * `drizzle-kit` bruker alltid `pg` (se `drizzle.config.ts`). Mot Neon går den
 * på 5432 og må derfor kjøres fra et nett som slipper gjennom der; mot en
 * lokal database er det aldri et problem.
 */

import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as PgPool } from "pg";
import * as skjema from "./skjema";

/**
 * Neon-driveren trenger en WebSocket-konstruktør i Node. Node 22 og nyere har
 * en global, så dette er bare å gi driveren den eksplisitt framfor å håpe at
 * den finner den selv. I nettleser- og edge-miljøer finnes den alltid.
 */
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

/**
 * Typen er Neon-variantens. De to drizzle-adapterne har identisk
 * spørringsflate — forskjellen ligger under, i hvordan de snakker med
 * databasen — men typene deres er nominelt ulike. Å la den ene bære typen og
 * kaste den andre til den holder alle kallsteder uendret, og er her det
 * ærligste alternativet: alternativet var en unionstype som hadde tvunget hvert
 * kallsted til å håndtere et skille som ikke finnes i praksis.
 */
type Database = NeonDatabase<typeof skjema>;

function hentUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL mangler. Lokalt: kopier .env.example til .env.local, " +
        "eller kjør `npx vercel env pull .env.local` for å hente fra Vercel. " +
        "I drift: variabelen settes av Neon-integrasjonen i Vercel.",
    );
  }
  return url;
}

/**
 * Peker tilkoblingsstrengen på Neon?
 *
 * Sjekken går på vertsnavnet og ikke på hele strengen, slik at et passord som
 * tilfeldigvis inneholder «neon» ikke velger driver.
 */
export function erNeon(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}

function lagDb(): Database {
  const url = hentUrl();

  if (erNeon(url)) {
    const pool = new NeonPool({ connectionString: url });
    return drizzleNeon(pool, { schema: skjema, casing: "snake_case" });
  }

  const pool = new PgPool({ connectionString: url });
  return drizzlePg(pool, {
    schema: skjema,
    casing: "snake_case",
  }) as unknown as Database;
}

/**
 * Én klient per prosess. Under `next dev` lastes moduler på nytt ved hver
 * endring, og uten dette ville hver omlasting åpnet en ny pool.
 */
const globalForDb = globalThis as unknown as { lesevennDb?: Database };
export const db: Database = globalForDb.lesevennDb ?? lagDb();
if (process.env.NODE_ENV !== "production") globalForDb.lesevennDb = db;

export type Db = typeof db;
