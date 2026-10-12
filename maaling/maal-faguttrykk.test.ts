/**
 * Måling av uttrekket mot Gullsettet — FR-8, FR-40.
 *
 *   npm run maal                 regner om fra lagrede modellsvar, gratis
 *   npm run maal:ferskt          kaller modellen og lagrer svarene
 *
 * ## Hvorfor `les` er standard
 *
 * AD-7: rå modellsvar lagres som filer i repoet, og måletall regnes om fra de
 * lagrede svarene framfor fra nye kall. Målingen kjøres mange ganger mens man
 * justerer sammenligningsregelen eller rapporteringen, og den skal ikke koste
 * penger hver gang. Mangler et lagret svar, sier den hva du skal kjøre.
 *
 * ## Hvorfor dette er en vitest-fil
 *
 * Samme grunn som `sjekk-gullsett`: den må bruke `hentFaguttrykk`,
 * `delIAvsnitt` og kappingen fra appen, ikke en kopi. AD-1 sier at harnessen
 * bruker de samme funksjonene som produksjonskoden — ellers måler den noe
 * annet enn det eleven møter.
 */

import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import { describe, expect, test } from "vitest";
config({ path: ".env.local" });

import { hentFaguttrykk } from "../generatorer/faguttrykk";
import { delIAvsnitt } from "../tekst/avsnittsdeling";

const MAPPE = path.join(process.cwd(), "testdata", "gullsett");
const RESULTATER = path.join(process.cwd(), "maaling", "resultater");
const RUNDE = process.env.MAAL_RUNDE ?? "1";

if (!process.env.LESEVENN_TESTMODUS) process.env.LESEVENN_TESTMODUS = "les";

/* ------------------------------------------------------------------ *
 * Sammenligningsregelen — FR-8
 * ------------------------------------------------------------------ */

/**
 * Normaliserer et uttrykk før sammenligning.
 *
 * Dette ER sammenligningsregelen, og den står på ett sted med vilje: den skal
 * kunne pekes på i rapporten, og den skal ikke kunne være litt forskjellig i
 * gjenkallingen og i presisjonen.
 *
 * Regelen, som fastsatt i annotering.md steg 4:
 *
 *   - ufølsom for store og små bokstaver — «Mitose» er «mitose»
 *   - FØLSOM for bøyning — «mitosen» er IKKE «mitose», fordi `erVerbatim`
 *     krever ordrett treff og en modell som svarer grunnformen får uttrykket
 *     forkastet. Å være mild her ville målt noe appen ikke gjør.
 *   - flerordsuttrykk må matche helt — «indre energi» er ikke «energi»
 *
 * Mellomrom normaliseres, fordi «indre  energi» og «indre energi» er samme
 * uttrykk og forskjellen er en skrivefeil, ikke en faglig uenighet.
 */
function normaliser(uttrykk: string): string {
  return uttrykk.trim().toLowerCase().replace(/\s+/g, " ");
}

type Maal = {
  tekst: string;
  tittel: string;
  fag: string;
  fagtype: string;
  kilde: string;
  type: string;
  antallGull: number;
  antallLevert: number;
  budsjett: number;
  treff: number;
  gjenkalling: number;
  presisjon: number;
  f1: number;
  bommet: string[];
  stoey: string[];
  promptversjon: string;
  modell: string;
  konsistens: string;
};

const snitt = (t: number[]) =>
  t.length === 0 ? 0 : t.reduce((a, b) => a + b, 0) / t.length;

/* ------------------------------------------------------------------ */

const filer = (await readdir(MAPPE))
  .filter((f) => f.endsWith(`.runde${RUNDE}.gullsett.json`))
  .sort();

describe(`FR-8 — uttrekket mot Gullsettet, runde ${RUNDE}`, () => {
  const resultater: Maal[] = [];

  // Selvkonsistens gjør fem parallelle modellkall per tekst, så standardens
  // fem sekunder holder ikke. Målt til om lag tolv sekunder per tekst.
  test.each(filer)("%s", { timeout: 300000 }, async (fil) => {
    const gull = JSON.parse(await readFile(path.join(MAPPE, fil), "utf8")) as {
      tekst: string;
      tittel: string;
      fag: string;
      fagtype: string;
      kilde: string;
      type: string;
      annotert: string | null;
      faguttrykk: string[];
    };

    if (gull.faguttrykk.length === 0) {
      console.log(
        `\n= ${fil}: ikke annotert ennå (tom faguttrykk-liste). Hoppet over.`,
      );
      return;
    }
    expect(
      gull.annotert,
      `${fil}: sett «annotert» til datoen du annoterte. Den trengs for κ-målingen, som krever sju dagers avstand mellom rundene.`,
    ).not.toBeNull();

    const avsnitt = delIAvsnitt(
      await readFile(path.join(MAPPE, gull.tekst), "utf8"),
    );

    let r: Awaited<ReturnType<typeof hentFaguttrykk>>;
    try {
      r = await hentFaguttrykk(avsnitt);
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      if (m.includes("lagret_svar_mangler")) {
        throw new Error(
          `${gull.tekst}: ingen lagret modellsvar. Kjør «npm run maal:ferskt» ` +
            "én gang for å hente og lagre dem, så er alle senere kjøringer gratis (AD-7).",
        );
      }
      throw e;
    }

    // MÅLES MOT DET KAPPEDE SETTET (FR-8, FR-11). Råsvaret tilhører en app
    // som ikke finnes: eleven ser bare det som kom gjennom kappingen.
    const levert = new Set(r.begreper.map((b) => normaliser(b.uttrykk)));
    const gullsett = new Set(gull.faguttrykk.map(normaliser));

    const treff = [...gullsett].filter((u) => levert.has(u));
    const gjenkalling = gullsett.size === 0 ? 0 : treff.length / gullsett.size;
    const presisjon = levert.size === 0 ? 0 : treff.length / levert.size;
    const f1 =
      gjenkalling + presisjon === 0
        ? 0
        : (2 * gjenkalling * presisjon) / (gjenkalling + presisjon);

    const m: Maal = {
      tekst: gull.tekst,
      tittel: gull.tittel,
      fag: gull.fag,
      fagtype: gull.fagtype,
      kilde: gull.kilde,
      type: gull.type,
      antallGull: gullsett.size,
      antallLevert: levert.size,
      budsjett: Math.max(Math.floor((12 * r.tetthet.antallOrd) / 1000), 5),
      treff: treff.length,
      gjenkalling,
      presisjon,
      f1,
      // Hva som ble bommet og hva som var støy er det som gjør tallet
      // handlingsbart. Et tall uten listene sier ikke hva som skal rettes.
      bommet: [...gullsett].filter((u) => !levert.has(u)),
      stoey: [...levert].filter((u) => !gullsett.has(u)),
      promptversjon: r.promptversjon,
      modell: r.modell,
      konsistens: r.konsistens
        ? `${r.konsistens.kjoeringer} kjøringer, minst ${r.konsistens.minstEnighet}`
        : "ett kall",
    };
    resultater.push(m);

    console.log(
      `\n════════ ${m.tittel}  (${m.fag}, ${m.kilde}, ${m.type})\n` +
        `  gull ${m.antallGull} | levert ${m.antallLevert} | budsjett ${m.budsjett} | treff ${m.treff}\n` +
        `  GJENKALLING ${gjenkalling.toFixed(3)} (krav 0,75)   ` +
        `PRESISJON ${presisjon.toFixed(3)} (krav 0,70)   F1 ${f1.toFixed(3)}\n` +
        `  bommet:  ${m.bommet.join(", ") || "(ingen)"}\n` +
        `  støy:    ${m.stoey.join(", ") || "(ingen)"}`,
    );

    if (m.antallGull > Math.floor(m.budsjett / 0.75)) {
      console.log(
        `  MERK: ${m.antallGull} annoterte mot budsjett ${m.budsjett}. ` +
          `Maks nåbar gjenkalling er ${(Math.min(m.budsjett, m.antallGull) / m.antallGull).toFixed(2)} — ` +
          "terskelen er strukturelt utenfor rekkevidde. Se FR-8.",
      );
    }
  });

  test("FR-40 — oppsummeringstabellen", async () => {
    if (resultater.length === 0) {
      console.log(
        "\nIngen annoterte tekster ennå. Fyll inn en .gullsett.json og kjør om.",
      );
      return;
    }

    const grupper = (nokkel: keyof Maal) => {
      const ut = new Map<string, Maal[]>();
      for (const r of resultater) {
        const k = String(r[nokkel]);
        ut.set(k, [...(ut.get(k) ?? []), r]);
      }
      return ut;
    };

    const g = snitt(resultater.map((r) => r.gjenkalling));
    const p = snitt(resultater.map((r) => r.presisjon));

    const linjer = [
      `# Måleresultat FR-8 — runde ${RUNDE}`,
      "",
      `Kjørt ${new Date().toISOString().slice(0, 10)} på ${resultater.length} av ${filer.length} tekster.`,
      `Modell ${resultater[0].modell}, prompt ${resultater[0].promptversjon}, ${resultater[0].konsistens}.`,
      "",
      "## Terskler",
      "",
      "| Krav | Terskel | Målt | Status |",
      "|---|---|---|---|",
      `| FR-8 gjenkalling | ≥ 0,75 | ${g.toFixed(3)} | ${g >= 0.75 ? "bestått" : "**IKKE bestått**"} |`,
      `| FR-8 presisjon | ≥ 0,70 | ${p.toFixed(3)} | ${p >= 0.7 ? "bestått" : "**IKKE bestått**"} |`,
      "",
      "## Per tekst",
      "",
      "| Tekst | Fag | Kilde | Type | Gull | Levert | Treff | Gjenkalling | Presisjon | F1 |",
      "|---|---|---|---|---|---|---|---|---|---|",
      ...resultater.map(
        (r) =>
          `| ${r.tittel} | ${r.fag} | ${r.kilde} | ${r.type} | ${r.antallGull} | ${r.antallLevert} | ${r.treff} | ${r.gjenkalling.toFixed(3)} | ${r.presisjon.toFixed(3)} | ${r.f1.toFixed(3)} |`,
      ),
      "",
      "Ingen av inndelingene under har egen terskel. Med én eller to tekster per",
      "celle er tallet en observasjon og ikke en måling — men en systematisk",
      "forskjell skal være synlig framfor skjult i et snitt (FR-8).",
      "",
    ];

    for (const [navn, nokkel] of [
      ["fag", "fag"],
      ["fagtype", "fagtype"],
      ["tekstkilde", "kilde"],
      ["teksttype", "type"],
    ] as const) {
      linjer.push(`### Per ${navn}`, "", `| ${navn} | n | Gjenkalling | Presisjon |`, "|---|---|---|---|");
      for (const [k, rs] of grupper(nokkel)) {
        linjer.push(
          `| ${k} | ${rs.length} | ${snitt(rs.map((r) => r.gjenkalling)).toFixed(3)} | ${snitt(rs.map((r) => r.presisjon)).toFixed(3)} |`,
        );
      }
      linjer.push("");
    }

    const rapport = linjer.join("\n");
    console.log(`\n${rapport}`);

    await mkdir(RESULTATER, { recursive: true });
    const dato = new Date().toISOString().slice(0, 10);
    await writeFile(
      path.join(RESULTATER, `${dato}-fr8-runde${RUNDE}.md`),
      rapport,
      "utf8",
    );
    // Og som data, ikke bare som tabell (FR-40).
    await writeFile(
      path.join(RESULTATER, `${dato}-fr8-runde${RUNDE}.json`),
      `${JSON.stringify({ runde: RUNDE, dato, resultater }, null, 2)}\n`,
      "utf8",
    );
  });
});
