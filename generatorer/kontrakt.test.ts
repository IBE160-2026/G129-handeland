/**
 * Tester for generatorkontrakten.
 *
 * Alt her er deterministisk og kaller ikke modellen — `npm test`-halvdelen av
 * AD-5. Det selve modellkallet gjør, hører i `npm run maal`.
 *
 * Den viktigste testen er den siste: at hver versjon manifestet navngir
 * faktisk finnes på disk. Det er feilen AD-14 gjør mulig å gjøre — å
 * forfremme en versjon som ikke er der — og den ville ellers først vist seg
 * når en elev trykket på en knapp.
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import {
  GeneratorFeil,
  formaterAvsnitt,
  hentPrompt,
  kjoerGenerator,
  type Oppgave,
} from "./kontrakt";

const PROMPTROT = path.join(process.cwd(), "prompts");

describe("AD-14 — manifestet bestemmer hva som er gjeldende", () => {
  test("hentPrompt gir versjonen manifestet navngir", async () => {
    const p = await hentPrompt("faguttrykk");
    expect(p.versjon).toBe("v1");
    expect(p.modell).toBe("claude-haiku-4-5");
    expect(p.tekst.length).toBeGreaterThan(100);
  });

  test("promptteksten beskriver avsnittsformatet den faktisk får", async () => {
    // Teksten sendes som brukermelding, ikke bakt inn i systemprompten.
    // Da må systemprompten beskrive formatet i stedet — ellers må modellen
    // gjette hva merkelappene betyr, og kildeavsnittene blir upålitelige.
    //
    // Denne testen erstatter en tidligere som sjekket at prompten inneholdt
    // plassholderen {{AVSNITT}}. Plassholderen ble aldri fylt ut av noen:
    // `kjoerGenerator` sender prompten som system og teksten som melding.
    // Testen bestod, og beskyttet ingenting.
    const p = await hentPrompt("faguttrykk");
    expect(p.tekst).toContain("[avsnitt 1, overskrift]");
    expect(p.tekst).not.toContain("{{");
  });

  test("harnessen kan overstyre versjonen", async () => {
    // AD-5: måleharnessen skal kunne kjøre en vilkårlig versjon for å
    // sammenligne to. Webappen gjør det aldri.
    const p = await hentPrompt("faguttrykk", "v1");
    expect(p.versjon).toBe("v1");
  });

  test("ukjent oppgave gir GeneratorFeil med kode og anbefalt handling", async () => {
    await expect(
      hentPrompt("finnes_ikke" as Oppgave),
    ).rejects.toThrowError(GeneratorFeil);

    try {
      await hentPrompt("finnes_ikke" as Oppgave);
    } catch (e) {
      const f = e as GeneratorFeil;
      expect(f.kode).toBe("ukjent_oppgave");
      // §5: ingen feiltilstand er en blindvei. Alle tre feltene må finnes.
      expect(f.elevmelding.length).toBeGreaterThan(0);
      expect(f.anbefaltHandling.length).toBeGreaterThan(0);
    }
  });

  test("versjon som ikke finnes på disk gir prompt_mangler", async () => {
    try {
      await hentPrompt("faguttrykk", "v99");
      throw new Error("skulle kastet");
    } catch (e) {
      expect(e).toBeInstanceOf(GeneratorFeil);
      expect((e as GeneratorFeil).kode).toBe("prompt_mangler");
    }
  });

  test("hver versjon manifestet navngir finnes faktisk på disk", async () => {
    const manifest = JSON.parse(
      await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8"),
    ) as { oppgaver: Record<string, { versjon: string; modell: string }> };

    for (const [oppgave, oppføring] of Object.entries(manifest.oppgaver)) {
      const filer = await readdir(path.join(PROMPTROT, oppgave));
      expect(filer, `${oppgave} mangler ${oppføring.versjon}.md`).toContain(
        `${oppføring.versjon}.md`,
      );
    }
  });

  test("hver oppføring navngir en modell", async () => {
    // AD-4: modellidentitet stemples på alt generert. Mangler den i
    // manifestet, har stempelet ingen kilde.
    const manifest = JSON.parse(
      await readFile(path.join(PROMPTROT, "gjeldende.json"), "utf8"),
    ) as { oppgaver: Record<string, { versjon: string; modell: string }> };

    for (const [oppgave, oppføring] of Object.entries(manifest.oppgaver)) {
      expect(oppføring.modell, `${oppgave} mangler modell`).toMatch(
        /^claude-/,
      );
    }
  });
});

describe("§5 — tilgangsfeil gir ikke rådet «prøv igjen»", () => {
  test("manglende nøkkel gir tilgang_avslaatt, ikke modellfeil", async () => {
    // Samme feilkode som en utløpt eller tilbaketrukket nøkkel gir, fordi det
    // er samme problem for eleven: appen kommer ikke til modellen, og det er
    // ingenting eleven kan gjøre med det.
    //
    // Det som gjør skillet verdt en egen kode er RÅDET. Den generelle
    // modellfeil-grenen sier «prøv igjen om litt», og det kan aldri virke mot
    // en utløpt nøkkel. §5 krever minst én konkret ting eleven kan gjøre, og
    // et råd som ikke kan virke er ikke det.
    const foerModus = process.env.LESEVENN_TESTMODUS;
    const foerNoekkel = process.env.ANTHROPIC_API_KEY;
    process.env.LESEVENN_TESTMODUS = "av";
    delete process.env.ANTHROPIC_API_KEY;

    try {
      await kjoerGenerator({
        oppgave: "faguttrykk",
        skjema: z.object({ noe: z.string() }),
        brukermelding: "hva som helst",
      });
      throw new Error("skulle kastet");
    } catch (e) {
      expect(e).toBeInstanceOf(GeneratorFeil);
      const f = e as GeneratorFeil;
      expect(f.kode).toBe("tilgang_avslaatt");
      expect(f.anbefaltHandling).not.toMatch(/prøv igjen/i);
      // Og eleven skal få vite at arbeidet ikke er tapt.
      expect(f.anbefaltHandling).toMatch(/lagret/i);
    } finally {
      if (foerModus === undefined) delete process.env.LESEVENN_TESTMODUS;
      else process.env.LESEVENN_TESTMODUS = foerModus;
      if (foerNoekkel === undefined) delete process.env.ANTHROPIC_API_KEY;
      else process.env.ANTHROPIC_API_KEY = foerNoekkel;
    }
  });
});

describe("AD-10 — avsnittslisten sendes med, numrene gjettes ikke", () => {
  const avsnitt = delIAvsnitt(
    "Celledeling\n\nMitose er den vanligste formen.\n\nNår det går galt\n\nArvestoffet kopieres feil.",
  );

  test("hvert avsnittsnummer er synlig for modellen", () => {
    const formatert = formaterAvsnitt(avsnitt);
    for (const a of avsnitt) {
      expect(formatert).toContain(`[avsnitt ${a.nummer}`);
    }
  });

  test("overskrifter er merket, slik at modellen kan skille dem", () => {
    const formatert = formaterAvsnitt(avsnitt);
    expect(formatert).toContain("[avsnitt 1, overskrift]");
    expect(formatert).toContain("[avsnitt 2]");
  });

  test("innholdet følger med", () => {
    const formatert = formaterAvsnitt(avsnitt);
    expect(formatert).toContain("Mitose er den vanligste formen.");
  });

  test("tom liste gir tom streng framfor å kaste", () => {
    expect(formaterAvsnitt([])).toBe("");
  });
});
