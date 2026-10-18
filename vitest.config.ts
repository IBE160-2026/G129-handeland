import { defineConfig } from "vitest/config";

/**
 * Hver datatest starter sin egen Postgres i minnet (PGlite) og kjører alle
 * migrasjonene i `beforeAll`. Hver for seg tar det et par sekunder; når
 * mange filer gjør det samtidig, tok det over standardgrensen på 10 sekunder
 * (18.10, ved sju datatestfiler og sju migrasjoner), og alle datatestene
 * feilet på tidsavbrudd uten at noe var galt i koden.
 */
export default defineConfig({
  test: {
    hookTimeout: 60_000,
  },
});
