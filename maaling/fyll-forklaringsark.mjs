/**
 * Fører utviklerens vurderinger inn i forklaringsarket (FR-8), når
 * vurderingen gjøres i chat i stedet for i fila.
 *
 *   node maaling/fyll-forklaringsark.mjs <ark> <nr> <riktig|gal|misvisende> [kommentar]
 */
import { readFileSync, writeFileSync } from "node:fs";

const [ark, nr, dom, ...rest] = process.argv.slice(2);
if (!["riktig", "gal", "misvisende"].includes(dom)) throw new Error(`ukjent vurdering: ${dom}`);
const kommentar = rest.join(" ");
let s = readFileSync(ark, "utf8");
const start = s.indexOf(`\n### ${nr}. `);
if (start === -1) throw new Error(`fant ikke forklaring ${nr}`);
const slutt = s.indexOf("\n### ", start + 1) === -1 ? s.indexOf("\n---", start + 1) : Math.min(...[s.indexOf("\n### ", start + 1), s.indexOf("\n---", start + 1)].filter((i) => i !== -1));
let blokk = s.slice(start, slutt);
const valg = ["riktig", "gal", "misvisende"].map((v) => `${v === dom ? "☒" : "☐"} ${v}`).join(" ");
blokk = blokk.replace(/\*\*Vurdering:\*\* .*/, `**Vurdering:** ${valg}`).replace(/\*\*Kommentar:\*\*.*/, `**Kommentar:**${kommentar ? " " + kommentar : ""}`);
writeFileSync(ark, s.slice(0, start) + blokk + s.slice(slutt));
console.log(`${nr}: ${dom}${kommentar ? " — " + kommentar : ""}`);
