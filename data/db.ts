/**
 * Databaseklienten.
 *
 * Importeres BARE av `data/`, `tekst/` og `app/`. Generatorlaget skal aldri se
 * denne fila — det er AD-10, og det er den regelen som gjør at måleharnessen
 * kan kjøre uten database.
 *
 * ## Hvorfor Neons driver og ikke node-postgres
 *
 * Driveren er `@neondatabase/serverless` over WebSocket, ikke `pg` over TCP.
 * To grunner, i rekkefølge etter hvor tungt de veier:
 *
 * 1. **Porten.** `pg` kobler på 5432, og det nettet utviklingen skjer fra
 *    slipper ikke gjennom på den porten — verifisert 2. oktober: TCP til 443
 *    gikk, TCP til 5432 tidsavbrøt. Neons driver går gjennom deres proxy på
 *    standard web-porter, så sperren slutter å være et problem.
 * 2. **Én kodevei.** Samme driver i utvikling og i drift betyr én oppførsel å
 *    feilsøke framfor to.
 *
 * ## Hvorfor WebSocket og ikke HTTP
 *
 * Neon tilbyr begge. HTTP-varianten (`drizzle-orm/neon-http`) er raskere for
 * enkeltspørringer, men støtter bare ikke-interaktive batcher. `laasTekst` i
 * `tekst/las.ts` trenger en ekte transaksjon: innsettingen av avsnittslisten er
 * avhengig av at oppdateringen til `laast` traff. Uten transaksjon kan man ende
 * med en låst Tekst uten avsnitt — nøyaktig korrupsjonen AD-9 og AD-15 finnes
 * for å hindre, siden alt generert innhold peker på avsnittsnumre.
 *
 * ## Migrasjoner er et unntak
 *
 * `drizzle-kit` bruker `pg` over 5432 og `DATABASE_URL_UNPOOLED` (se
 * `drizzle.config.ts`). Migrasjoner må derfor kjøres fra et nett som slipper
 * gjennom på 5432. Det er akseptabelt fordi de kjøres sjelden og bevisst, men
 * det er verdt å kjenne før man står fast.
 */

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as skjema from "./skjema";

/**
 * Neon-driveren trenger en WebSocket-konstruktør i Node. Node 22 og nyere har
 * en global, så dette er bare å gi driveren den eksplisitt framfor å håpe at
 * den finner den selv. I nettleser- og edge-miljøer finnes den alltid.
 */
if (typeof globalThis.WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = globalThis.WebSocket;
}

function lagPool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL mangler. Lokalt: kjør `npx vercel env pull .env.local`. " +
        "I drift: variabelen settes av Neon-integrasjonen i Vercel.",
    );
  }
  return new Pool({ connectionString: url });
}

/**
 * Én pool per prosess. Under `next dev` lastes moduler på nytt ved hver
 * endring, og uten dette ville hver omlasting åpnet en ny pool.
 */
const globalForDb = globalThis as unknown as { lesevennPool?: Pool };
const pool = globalForDb.lesevennPool ?? lagPool();
if (process.env.NODE_ENV !== "production") globalForDb.lesevennPool = pool;

export const db = drizzle(pool, { schema: skjema, casing: "snake_case" });
export type Db = typeof db;
