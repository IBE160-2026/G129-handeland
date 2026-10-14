/**
 * Migrasjoner mot Neon over HTTPS, for nett der port 5432 er blokkert.
 *
 *   npm run db:migrer:https            viser hvilke migrasjoner som mangler
 *   npm run db:migrer:https -- --kjoer kjører dem
 *
 * `drizzle-kit migrate` bruker `pg` over 5432, og arkitekturen noterer at den
 * porten ikke slipper gjennom på alle nett utviklingen skjer fra. Drizzles
 * HTTP-migrator skriver i den samme journaltabellen
 * (`drizzle.__drizzle_migrations`), så de to kan brukes om hverandre.
 *
 * Uten `--kjoer` endres ingenting. Dette peker som regel mot
 * produksjonsdatabasen, og en migrasjon er ikke noe som skal skje ved et uhell.
 */

import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local", quiet: true });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url || !new URL(url).hostname.endsWith(".neon.tech")) {
  console.error(
    "Fant ingen Neon-tilkobling. Dette skriptet er for Neon; mot en lokal " +
      "database, bruk `npm run db:migrer`.",
  );
  process.exit(1);
}

const sql = neon(url);
const journal = JSON.parse(
  await readFile("data/migrasjoner/meta/_journal.json", "utf8"),
);

let kjoert = 0;
try {
  const [rad] = await sql`select count(*)::int as n from drizzle.__drizzle_migrations`;
  kjoert = rad.n;
} catch {
  // Tabellen finnes ikke før første migrasjon.
}

const mangler = journal.entries.slice(kjoert);
console.log(`Vert: ${new URL(url).hostname}`);
console.log(`Kjørt: ${kjoert} av ${journal.entries.length}`);
for (const m of mangler) console.log(`  mangler: ${m.tag}`);

if (mangler.length === 0) {
  console.log("Databasen er à jour.");
} else if (!process.argv.includes("--kjoer")) {
  console.log("\nIngenting er endret. Kjør med `-- --kjoer` for å migrere.");
} else {
  await migrate(drizzle(sql), { migrationsFolder: "data/migrasjoner" });
  console.log("Migrert.");
}
