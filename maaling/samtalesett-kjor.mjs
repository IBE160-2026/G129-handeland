/**
 * Inngangen til verktøyet for Gullsettet til Fagsamtalen (FR-21).
 *
 *   npm run samtalesett -- forbered norsk-metafor teknologi-operativsystem naturfag-em-bolger [--forslag]
 *   npm run samtalesett -- valider
 *   npm run samtalesett -- maal
 *   npm run samtalesett -- maal-ferskt
 *
 * Wrapper av samme grunn som maal-ferskt.mjs: `VAR=verdi kommando` virker ikke
 * i npm-skript på Windows. `--forslag` og `maal-ferskt` gjør ekte modellkall.
 */

import { spawn } from "node:child_process";

const [kommando = "valider", ...rest] = process.argv.slice(2);
const forslag = rest.includes("--forslag");
const tekster = rest.filter((a) => !a.startsWith("--"));

const env = {
  ...process.env,
  SAMTALESETT_KOMMANDO: kommando === "maal-ferskt" ? "maal" : kommando,
  SAMTALESETT_TEKSTER: tekster.join(","),
  SAMTALESETT_FORSLAG: forslag ? "1" : "0",
};
if (kommando === "maal-ferskt") env.LESEVENN_TESTMODUS = "skriv";
if (forslag) env.LESEVENN_TESTMODUS = "av";

if (kommando === "maal-ferskt" || forslag) {
  console.log("Dette gjør ekte modellkall og koster penger.\n");
}

const barn = spawn("npx", ["vitest", "run", "maaling/samtalesett-verktoy.test.ts", "--silent=false"], {
  stdio: "inherit",
  shell: true,
  env,
});
barn.on("exit", (kode) => process.exit(kode ?? 1));
