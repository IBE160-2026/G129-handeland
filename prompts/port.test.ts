/**
 * AD-6 som byggtest: en prompt med sikkerhetsport kan ikke stå som gjeldende
 * uten et bestått portresultat for akkurat den fila.
 *
 * Før 10.11 hvilte regelen bare på at noen husket den. Testen feiler hvis
 * (1) en ny versjon settes som gjeldende uten å ha vært gjennom FR-21, eller
 * (2) promptfila endres etter at den ble målt — da er det ikke lenger den
 * målte prompten som står som «målt og bestått».
 *
 * Bare oppgaver med port er med. De andre oppgavene har målinger, men ingen
 * port, og et krav om portresultat for dem ville tvunget fram falske resultater.
 */

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROT = path.join(process.cwd(), "prompts");
const OPPGAVER_MED_PORT = ["svarvurdering"] as const;

type Portresultat = { sha256: string; bestatt: boolean; avgjort: string };

/** sha256 med LF-linjeskift, så hashen er lik på Windows og Linux. */
export function promptHash(innhold: string): string {
  return createHash("sha256").update(innhold.replace(/\r\n/g, "\n")).digest("hex");
}

describe("AD-6 — sikkerhetsporten er en utgivelsesport", () => {
  test.each(OPPGAVER_MED_PORT)("%s: gjeldende versjon har bestått porten, og fila er den som ble målt", async (oppgave) => {
    const manifest = JSON.parse(await readFile(path.join(ROT, "gjeldende.json"), "utf8")) as {
      oppgaver: Record<string, { versjon: string }>;
    };
    const porter = JSON.parse(await readFile(path.join(ROT, "portresultater.json"), "utf8")) as Record<
      string,
      Record<string, Portresultat>
    >;
    const versjon = manifest.oppgaver[oppgave].versjon;
    const resultat = porter[oppgave]?.[versjon];

    expect(
      resultat,
      `${oppgave} ${versjon} står som gjeldende uten portresultat. Kjør FR-21 og før resultatet i prompts/portresultater.json (AD-6).`,
    ).toBeDefined();
    expect(resultat!.bestatt, `${oppgave} ${versjon} besto ikke porten og kan ikke stå som gjeldende (AD-6).`).toBe(true);

    const fil = await readFile(path.join(ROT, oppgave, `${versjon}.md`), "utf8");
    expect(
      promptHash(fil),
      `${oppgave}/${versjon}.md er endret etter at den ble målt. Lag en ny versjon og mål den, i stedet for å endre den målte.`,
    ).toBe(resultat!.sha256);
  });

  test("hashen tåler CRLF fra en Windows-utsjekk", () => {
    expect(promptHash("a\r\nb\n")).toBe(promptHash("a\nb\n"));
  });
});
