/**
 * Lager tomme annoteringsfiler, ferdig utfylt med metadata.
 *
 *   node maaling/lag-annoteringsmaler.mjs
 *
 * Én fil per tekst per runde: `<navn>.runde1.gullsett.json`. Fag, fagtype,
 * kilde og teksttype hentes fra `.meta.json`, slik at merkingen FR-8 krever
 * ikke kan bli glemt eller skrevet ulikt i seks filer.
 *
 * Feltet `budsjett` er regnet ut og lagt inn som en PÅMINNELSE: det er høyeste
 * antall Faguttrykk Lesevenn kan levere for denne teksten, og annoterer du
 * mange flere, er gjenkallingen i FR-8 strukturelt begrenset. Se FR-8 for
 * regnestykket.
 *
 * Skriptet overskriver aldri en fil som finnes. Annoteringen er timer med
 * arbeid som ikke kan gjenskapes.
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const MAPPE = path.join(process.cwd(), "testdata", "gullsett");
const RUNDE = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 1);

const metafiler = (await readdir(MAPPE)).filter((f) => f.endsWith(".meta.json"));

/** Ordtelling som i AD-12, slik at budsjettet stemmer med appens. */
function budsjett(ord) {
  return Math.max(Math.floor((12 * ord) / 1000), 5);
}

let laget = 0;
let hoppet = 0;

for (const mf of metafiler.sort()) {
  const m = JSON.parse(await readFile(path.join(MAPPE, mf), "utf8"));
  const navn = mf.replace(".meta.json", "");
  const ut = path.join(MAPPE, `${navn}.runde${RUNDE}.gullsett.json`);

  try {
    await readFile(ut);
    console.log(`= ${navn.padEnd(30)} runde ${RUNDE} finnes alt, rører den ikke`);
    hoppet++;
    continue;
  } catch {
    /* finnes ikke, vi lager den */
  }

  const innhold = {
    _om: "Faguttrykkene du mener Lesevenn BØR markere i denne teksten. Skriv formen slik den står i teksten, ikke grunnformen. Se annotering.md.",
    tekst: m.tekst,
    tittel: m.tittel,
    fag: m.fag,
    fagtype: m.fagtype,
    kilde: m.kilde,
    type: m.type,
    runde: RUNDE,
    annotert: null,
    _budsjett_paaminnelse: `Lesevenn kan levere høyst ${budsjett(m.ord)} Faguttrykk for denne teksten (${m.ord} ord). Annoterer du mer enn ${Math.floor(budsjett(m.ord) / 0.75)}, kan gjenkallingen ikke nå 0,75 uansett hvor godt uttrekket er.`,
    faguttrykk: [],
  };

  await writeFile(ut, `${JSON.stringify(innhold, null, 2)}\n`, "utf8");
  console.log(
    `+ ${navn.padEnd(30)} runde ${RUNDE} | ${String(m.ord).padStart(4)} ord | budsjett ${budsjett(m.ord)} | maks ${Math.floor(budsjett(m.ord) / 0.75)}`,
  );
  laget++;
}

console.log(`\n${laget} malfil(er) laget, ${hoppet} hoppet over.`);
if (laget > 0) {
  console.log(
    "\nFyll inn `faguttrykk` og sett `annotert` til datoen. Og husk rekkefølgen:\n" +
      "  ta de tre avgjørelsene i annotering.md steg 2 FØRST, og se ikke noe\n" +
      "  modellutdata før alle seks er annotert.",
  );
}
