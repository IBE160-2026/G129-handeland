/**
 * Kjører målingen med ferske modellkall, og lagrer svarene.
 *
 *   npm run maal:ferskt
 *
 * Finnes fordi `LESEVENN_TESTMODUS=skriv vitest …` ikke virker i et
 * npm-skript på Windows — cmd.exe kjenner ikke formen `VAR=verdi kommando`.
 * En wrapper på ti linjer er bedre enn å dra inn `cross-env` for det.
 *
 * DETTE KOSTER PENGER. Hvert kall går til modellen. Etterpå ligger svarene i
 * `testdata/modellsvar/`, og `npm run maal` regner om fra dem gratis (AD-7).
 */

import { spawn } from "node:child_process";

const argv = [
  "vitest",
  "run",
  "maaling/maal-faguttrykk.test.ts",
  "--silent=false",
  ...process.argv.slice(2),
];

console.log(
  "Kjører med LESEVENN_TESTMODUS=skriv — dette gjør ekte modellkall og koster penger.\n" +
    "Svarene lagres, så «npm run maal» er gratis etterpå.\n",
);

// `shell: true` er nødvendig på Windows: npx er en .cmd-fil, og `spawn`
// nekter å starte den direkte med EINVAL.
const barn = spawn("npx", argv, {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, LESEVENN_TESTMODUS: "skriv" },
});

barn.on("exit", (kode) => process.exit(kode ?? 1));
