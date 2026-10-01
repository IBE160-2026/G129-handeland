import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Miljøvariablene hentes fra Vercel med `npx vercel env pull .env.local`.
// drizzle-kit leser ikke .env.local av seg selv.
config({ path: ".env.local" });

/**
 * Drizzle-konfigurasjon.
 *
 * MERK valget av tilkobling: migrasjoner bruker DATABASE_URL_UNPOOLED, ikke
 * DATABASE_URL. Neon leverer begge. Den pullede går gjennom en connection
 * pooler, og en pooler i transaksjonsmodus støtter ikke pålitelig den
 * sesjonstilstanden og DDL-en migrasjoner trenger. Appen i drift bruker den
 * pullede; migrasjoner bruker den direkte.
 *
 * Migrasjoner kjøres ved utrulling (driftsomslutningen i arkitekturspinen).
 */
export default defineConfig({
  schema: "./data/skjema.ts",
  out: "./data/migrasjoner",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
  casing: "snake_case",
});
