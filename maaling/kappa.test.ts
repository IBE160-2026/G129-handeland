/**
 * Egen annoteringsstøy — FR-8. Runde 1 mot runde 2 for de samme tekstene.
 *
 *   npm run gullsett:samsvar
 *
 * Lag malene for runde 2 med `npm run gullsett:maler -- 2`, og annoter dem
 * uten å se på runde 1, minst sju dager etter. Målene og hvorfor det er to av
 * dem, står i samsvar.ts.
 */

import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "vitest";
import {
  MINST_DAGER_MELLOM,
  dagerMellom,
  ordformer,
  regnSamsvar,
  tolkDato,
  type Samsvar,
} from "./samsvar";

const MAPPE = path.join(process.cwd(), "testdata", "gullsett");
const RESULTATER = path.join(process.cwd(), "maaling", "resultater");

type Annotering = { tekst: string; tittel: string; annotert: string | null; faguttrykk: string[] };
const les = async (fil: string) =>
  JSON.parse(await readFile(path.join(MAPPE, fil), "utf8")) as Annotering;

test("samsvar mellom runde 1 og runde 2", async () => {
  const andre = (await readdir(MAPPE)).filter((f) => f.endsWith(".runde2.gullsett.json")).sort();

  const rader: { tittel: string; dager: number; s: Samsvar; r1: number; r2: number }[] = [];
  const advarsler: string[] = [];

  for (const fil2 of andre) {
    const r2 = await les(fil2);
    if (r2.faguttrykk.length === 0) continue; // mal, ikke annotert ennå
    const r1 = await les(fil2.replace(".runde2.", ".runde1."));

    const d1 = r1.annotert ? tolkDato(r1.annotert) : null;
    const d2 = r2.annotert ? tolkDato(r2.annotert) : null;
    expect(d1, `${fil2}: runde 1 mangler gyldig dato i «annotert»`).not.toBeNull();
    expect(d2, `${fil2}: sett «annotert» til datoen, f.eks. 20.10.2026`).not.toBeNull();
    const dager = dagerMellom(d1!, d2!);
    if (dager < MINST_DAGER_MELLOM) {
      advarsler.push(
        `${r2.tittel}: bare ${dager} dager mellom rundene (krav: ${MINST_DAGER_MELLOM}). ` +
          "Tallet rapporteres, men oppfyller ikke FR-8.",
      );
    }

    const tekst = await readFile(path.join(MAPPE, r2.tekst), "utf8");
    const s = regnSamsvar(r1.faguttrykk, r2.faguttrykk, ordformer(tekst));
    rader.push({ tittel: r2.tittel, dager, s, r1: r1.faguttrykk.length, r2: r2.faguttrykk.length });
  }

  if (rader.length === 0) {
    console.log(
      "\nIngen annotert runde 2 ennå. Lag malene med «npm run gullsett:maler -- 2», " +
        `velg to tekster, og annoter dem uten å se på runde 1, tidligst ${MINST_DAGER_MELLOM} dager etter.`,
    );
    return;
  }

  const f = (x: number) => x.toFixed(3);
  const snitt = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const dato = new Date().toISOString().slice(0, 10);

  const rapport = [
    `# Egen annoteringsstøy — ${dato}`,
    "",
    "Runde 1 mot runde 2 av samme annotatør, samme tekster. Sammenligningsregelen er",
    "den samme som i FR-8-målingen (maaling/sammenligning.ts).",
    "",
    "| Tekst | Dager mellom | Runde 1 | Runde 2 | Begge | Bare 1 | Bare 2 | Positivt samsvar | κ (alle ordformer) |",
    "|---|---|---|---|---|---|---|---|---|",
    ...rader.map(
      (r) =>
        `| ${r.tittel} | ${r.dager} | ${r.r1} | ${r.r2} | ${r.s.begge} | ${r.s.bareForste} | ${r.s.bareAndre} | ${f(r.s.positivtSamsvar)} | ${f(r.s.kappa)} |`,
    ),
    `| **Snitt** | | | | | | | **${f(snitt(rader.map((r) => r.s.positivtSamsvar)))}** | **${f(snitt(rader.map((r) => r.s.kappa)))}** |`,
    "",
    ...(advarsler.length ? ["**Advarsler:**", "", ...advarsler.map((a) => `- ${a}`), ""] : []),
    "## Slik leses tallene",
    "",
    "- **Positivt samsvar** er andelen av valgene som går igjen i begge runder, 2·begge / (2·begge + bare 1 + bare 2).",
    "  Det er F1 mellom rundene, og kan sammenlignes direkte med F1 mellom modellen og Gullsettet:",
    "  ligger modellens F1 nær dette tallet, er modellen omtrent så enig med deg som du er med deg selv.",
    "- **κ** er regnet med hver ulike ordform i teksten som sak. Med mange ord ingen runde valgte,",
    "  ligger κ tett på det positive samsvaret — det er en egenskap ved metoden.",
    "- **Begrensning:** to tekster er et lite grunnlag. Tallet sier noe om retningen, ikke en presis verdi.",
    "",
  ].join("\n");

  console.log(`\n${rapport}`);
  await mkdir(RESULTATER, { recursive: true });
  await writeFile(path.join(RESULTATER, `${dato}-annoteringsstoey.md`), rapport, "utf8");
  await writeFile(
    path.join(RESULTATER, `${dato}-annoteringsstoey.json`),
    `${JSON.stringify({ dato, rader, advarsler }, null, 2)}\n`,
    "utf8",
  );
});
