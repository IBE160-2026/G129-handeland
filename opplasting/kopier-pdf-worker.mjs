/**
 * Kopierer pdfjs sin arbeidertråd til public/, så nettleseren kan hente den.
 *
 * Kjøres automatisk før `dev` og `build` (npm sine pre-skript), også på
 * Vercel. Fila er avledet av den installerte pdfjs-dist-versjonen, så den
 * committes ikke — da kan den aldri komme ut av takt med biblioteket.
 */
import { copyFile, mkdir } from "node:fs/promises";
await mkdir("public", { recursive: true });
await copyFile("node_modules/pdfjs-dist/build/pdf.worker.min.mjs", "public/pdf.worker.min.mjs");
console.log("pdfjs-arbeideren kopiert til public/pdf.worker.min.mjs");
