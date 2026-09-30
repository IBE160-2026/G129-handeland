import { defineConfig } from "drizzle-kit";

/**
 * Drizzle-konfigurasjon.
 *
 * Migrasjoner kjøres ved utrulling (driftsomslutningen i arkitekturspinen).
 * DATABASE_URL settes to steder: .env.local lokalt, og i Vercels dashbord.
 * De snakker ikke sammen.
 */
export default defineConfig({
  schema: "./data/skjema.ts",
  out: "./data/migrasjoner",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Norske tabellnavn er alt i skjemaet; ingen ekstra kasusomforming.
  casing: "snake_case",
});
