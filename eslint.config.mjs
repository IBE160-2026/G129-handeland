import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-sjekk/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Kopiert fra pdfjs-dist av predev/prebuild, ikke i git og ikke vår kode.
    "public/pdf.worker.min.mjs",
  ]),
]);

export default eslintConfig;
