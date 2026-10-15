/**
 * Lager de lagrede modellsvarene for demoteksten på nytt.
 *
 *   npm run demo:lag
 *
 * Trengs etter at en promptversjon er forfremmet: svarene er nøklet på
 * versjonen (AD-18), så de gamle finnes ikke lenger for appen. Se
 * generatorer/eksempeltekst.test.ts.
 *
 * DETTE KOSTER PENGER — fem modellkall med selvkonsistens. Commit filene i
 * testdata/modellsvar/ etterpå.
 *
 * Wrapper av samme grunn som maaling/maal-ferskt.mjs: `VAR=verdi kommando`
 * virker ikke i npm-skript på Windows.
 */

import { spawn } from "node:child_process";

console.log("Kjører med LESEVENN_TESTMODUS=skriv — ekte modellkall.\n");

const barn = spawn(
  "npx",
  ["vitest", "run", "generatorer/eksempeltekst.test.ts"],
  { stdio: "inherit", shell: true, env: { ...process.env, LESEVENN_TESTMODUS: "skriv" } },
);
barn.on("exit", (kode) => process.exit(kode ?? 1));
