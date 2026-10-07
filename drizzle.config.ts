import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Miljøvariablene hentes fra Vercel med `npx vercel env pull .env.local`.
// drizzle-kit leser ikke .env.local av seg selv.
config({ path: ".env.local" });

/**
 * Drizzle-konfigurasjon.
 *
 * MERK valget av tilkobling: migrasjoner bruker DATABASE_URL_UNPOOLED når den
 * finnes, ikke DATABASE_URL. Neon leverer begge. Den pullede går gjennom en
 * connection pooler, og en pooler i transaksjonsmodus støtter ikke pålitelig
 * den sesjonstilstanden og DDL-en migrasjoner trenger. Appen i drift bruker den
 * pullede; migrasjoner bruker den direkte.
 *
 * En lokal Postgres har ingen pooler og dermed ingen UNPOOLED-variant, så
 * DATABASE_URL er riktig der. Derfor fallbacken: uten den måtte den som kjører
 * appen lokalt sette en variabel som ikke betyr noe i oppsettet deres.
 *
 * Migrasjoner kjøres ved utrulling (driftsomslutningen i arkitekturspinen).
 */
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "Mangler DATABASE_URL_UNPOOLED eller DATABASE_URL. Mot Neon: kjør " +
      "`npx vercel env pull .env.local`. Lokalt: start databasen med " +
      "`npm run db:opp` og bruk DATABASE_URL fra .env.example.",
  );
}

export default defineConfig({
  schema: "./data/skjema.ts",
  out: "./data/migrasjoner",
  dialect: "postgresql",
  dbCredentials: { url },
  casing: "snake_case",
});
