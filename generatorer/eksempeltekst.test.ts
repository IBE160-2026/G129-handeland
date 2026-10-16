/**
 * Demoen i testmodus — FR-46, AD-18.
 *
 * README lover at kjerneløypen kan gås gjennom uten API-nøkkel, med
 * eksempelteksten `testdata/eksempeltekst/em-egenskaper.txt`. Det løftet
 * holder bare så lenge det finnes lagrede modellsvar for den teksten under
 * GJELDENDE promptversjon. Da v2 og senere v3 ble forfremmet, sluttet demoen
 * å virke, og ingenting sa fra. Denne testen er det som sier fra.
 *
 *   npm test            sjekker at svarene finnes (ingen nøkkel, ingen kall)
 *   npm run demo:lag    lager dem på nytt etter en forfremmelse (koster kall)
 *
 * Merk: demoteksten er byte for byte den samme som gullsett-teksten
 * `testdata/gullsett/naturfag-em-bolger.txt`. De deler derfor svarfiler:
 * `npm run maal:ferskt` lager også demoens svar, og en ny måling endrer det
 * demoen viser. Det er greit — begge er ekte svar fra gjeldende prompt — men
 * det er grunnen til at demoen virket igjen etter v3-målingen uten at noen
 * hadde laget svar for den.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { config } from "dotenv";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import { hentFaguttrykk } from "./faguttrykk";
import { genererQuiz } from "./quiz";
import { GeneratorFeil, hentPrompt } from "./kontrakt";

const FIL = path.join(process.cwd(), "testdata", "eksempeltekst", "em-egenskaper.txt");

// `demo:lag` setter skriv eksplisitt. Da lages BARE svar som mangler: det
// som finnes, leses. Grunnen er at demoteksten deler svarfiler med gullsettet
// (se over) — å lage faguttrykkene på nytt her ville endret tallene en
// omregning av FR-8-målingen gir. Alt annet er les, også når .env.local sier
// noe annet (samme felle som kodefunn 10).
const LAG_MANGLENDE = process.env.LESEVENN_TESTMODUS === "skriv";

let foer: { modus?: string; noekkel?: string };

beforeAll(() => {
  foer = {
    modus: process.env.LESEVENN_TESTMODUS,
    noekkel: process.env.ANTHROPIC_API_KEY,
  };
  if (LAG_MANGLENDE) config({ path: ".env.local", quiet: true });
  // Uten nøkkel: beviser at demoen ikke trenger en.
  else delete process.env.ANTHROPIC_API_KEY;
  process.env.LESEVENN_TESTMODUS = "les";
});

afterAll(() => {
  if (foer.modus === undefined) delete process.env.LESEVENN_TESTMODUS;
  else process.env.LESEVENN_TESTMODUS = foer.modus;
  if (foer.noekkel === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = foer.noekkel;
});

/**
 * Leser det lagrede svaret. Mangler det, lages det — men bare under
 * `demo:lag`. Ellers feiler testen med beskjed om hva som må gjøres.
 */
async function lesEllerLag<T>(oppgave: "faguttrykk" | "quiz", kall: () => Promise<T>): Promise<T> {
  try {
    return await kall();
  } catch (e) {
    if (!(e instanceof GeneratorFeil && e.kode === "lagret_svar_mangler")) throw e;
    if (!LAG_MANGLENDE) {
      const { versjon } = await hentPrompt(oppgave);
      throw new Error(
        `Demoen mangler lagrede svar for ${oppgave}, prompt ${versjon}. ` +
          "Det skjer etter en forfremmelse eller en ny oppgave. Kjør «npm run demo:lag» " +
          "(koster noen få modellkall) og commit filene i testdata/modellsvar/.",
      );
    }
    process.env.LESEVENN_TESTMODUS = "skriv";
    try {
      return await kall();
    } finally {
      process.env.LESEVENN_TESTMODUS = "les";
    }
  }
}

describe("demoteksten", () => {
  test("Windows-linjeskift fra et tekstfelt gir de samme avsnittene", async () => {
    // Nettlesere sender tekstfelt med CRLF. Gir det andre avsnitt enn fila,
    // blir nøkkelen til de lagrede svarene en annen, og demoen feiler for
    // den som limer inn teksten — selv om svarene finnes.
    const tekst = await readFile(FIL, "utf8");
    const lf = tekst.split("\r\n").join("\n");
    expect(delIAvsnitt(lf.split("\n").join("\r\n"))).toEqual(delIAvsnitt(lf));
  });

  test("faguttrykkene finnes for gjeldende prompt", { timeout: 300000 }, async () => {
    const avsnitt = delIAvsnitt(await readFile(FIL, "utf8"));
    const r = await lesEllerLag("faguttrykk", () => hentFaguttrykk(avsnitt));
    expect(r.promptversjon).toBe((await hentPrompt("faguttrykk")).versjon);
    expect(r.begreper.length).toBeGreaterThan(0);
  });

  test("quizen finnes for gjeldende prompt, og holder settkravene", { timeout: 300000 }, async () => {
    const avsnitt = delIAvsnitt(await readFile(FIL, "utf8"));
    const r = await lesEllerLag("quiz", () => genererQuiz(avsnitt));
    expect(r.promptversjon).toBe((await hentPrompt("quiz")).versjon);
    expect(r.sporsmal).toHaveLength(8);
  });
});
