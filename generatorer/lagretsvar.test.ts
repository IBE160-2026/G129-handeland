/**
 * Tester for testmodus.
 *
 * Den viktigste testen her er «les-modus trenger ingen API-nøkkel». Det er
 * hele begrunnelsen for at mekanismen finnes, og det er en påstand som er lett
 * å tro man har innfridd uten å ha det: så lenge nøkkelen ligger i miljøet
 * under utvikling, vil en testmodus som likevel kaller modellen virke.
 * Testen fjerner nøkkelen for å lukke det hullet.
 *
 * Testene skriver til `testdata/modellsvar/` under kjøring og rydder etter seg.
 * De bruker brukermeldinger ingen ekte tekst vil ha, så de kan ikke overskrive
 * et lagret svar som hører til eksempelteksten.
 */

import { rm } from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { z } from "zod";
import { GeneratorFeil, hentPrompt, kjoerGenerator } from "./kontrakt";
import { hentLagret, lagreSvar, noekkel, testmodus } from "./lagretsvar";

/**
 * Versjonen hentes fra manifestet framfor aa hardkodes. Ellers brekker hele
 * testfila hver gang en promptversjon forfremmes legitimt (AD-14), og da
 * tester den manifestets innhold i stedet for mekanismen den skal teste.
 */
const GJELDENDE = await hentPrompt("faguttrykk");
const ANNEN_VERSJON = GJELDENDE.versjon === "v1" ? "v2" : "v1";

const MELDING = "__test__ denne strengen finnes ikke i noen ekte tekst";

const skjema = z.object({
  uttrykk: z.array(z.object({ ord: z.string(), kildeavsnitt: z.number() })),
});

/**
 * Miljøvariabler er prosessglobale, og vitest kjører flere testfiler i samme
 * prosess. Uten lagring og gjenoppretting her ville en test som setter
 * testmodus kunne endre oppførselen i en helt annen fil.
 */
let foer: { modus?: string; noekkel?: string };

beforeEach(() => {
  foer = {
    modus: process.env.LESEVENN_TESTMODUS,
    noekkel: process.env.ANTHROPIC_API_KEY,
  };
});

afterEach(async () => {
  if (foer.modus === undefined) delete process.env.LESEVENN_TESTMODUS;
  else process.env.LESEVENN_TESTMODUS = foer.modus;

  if (foer.noekkel === undefined) delete process.env.ANTHROPIC_API_KEY;
  else process.env.ANTHROPIC_API_KEY = foer.noekkel;

  await rm(
    path.join(
      process.cwd(),
      "testdata",
      "modellsvar",
      "faguttrykk",
      `${noekkel("faguttrykk", GJELDENDE.versjon, MELDING)}.json`,
    ),
    { force: true },
  );
});

describe("modusvalget", () => {
  test("standard er av, slik at en glemt variabel ikke stille gir lagrede svar", () => {
    delete process.env.LESEVENN_TESTMODUS;
    expect(testmodus()).toBe("av");
  });

  test("les, 1 og true betyr alle lesemodus", () => {
    for (const v of ["les", "1", "true", "LES", " les "]) {
      process.env.LESEVENN_TESTMODUS = v;
      expect(testmodus(), `«${v}» skulle gitt les`).toBe("les");
    }
  });

  test("skriv gjenkjennes", () => {
    process.env.LESEVENN_TESTMODUS = "skriv";
    expect(testmodus()).toBe("skriv");
  });

  test("ukjent verdi faller til av framfor å gjette", () => {
    process.env.LESEVENN_TESTMODUS = "kanskje";
    expect(testmodus()).toBe("av");
  });
});

describe("nøkkelen", () => {
  test("er stabil for samme inndata", () => {
    expect(noekkel("faguttrykk", GJELDENDE.versjon, MELDING)).toBe(
      noekkel("faguttrykk", GJELDENDE.versjon, MELDING),
    );
  });

  test("endrer seg med promptversjonen", () => {
    // Et svar lagret under v1 er ikke dokumentasjon på hva v2 gjør.
    expect(noekkel("faguttrykk", GJELDENDE.versjon, MELDING)).not.toBe(
      noekkel("faguttrykk", ANNEN_VERSJON, MELDING),
    );
  });

  test("endrer seg med teksten", () => {
    expect(noekkel("faguttrykk", GJELDENDE.versjon, MELDING)).not.toBe(
      noekkel("faguttrykk", GJELDENDE.versjon, `${MELDING} mer`),
    );
  });

  test("endrer seg med oppgaven", () => {
    expect(noekkel("faguttrykk", GJELDENDE.versjon, MELDING)).not.toBe(
      noekkel("quiz", GJELDENDE.versjon, MELDING),
    );
  });
});

describe("lagring og henting", () => {
  test("det som lagres kan hentes tilbake", async () => {
    const data = { uttrykk: [{ ord: "mitosen", kildeavsnitt: 2 }] };
    await lagreSvar("faguttrykk", GJELDENDE.versjon, GJELDENDE.modell, MELDING, data);

    const lagret = await hentLagret("faguttrykk", GJELDENDE.versjon, MELDING);
    expect(lagret).not.toBeNull();
    expect(lagret?.data).toEqual(data);
    // AD-4: promptversjon og modell stemples, også på lagrede svar.
    expect(lagret?.modell).toBe(GJELDENDE.modell);
    expect(lagret?.promptversjon).toBe(GJELDENDE.versjon);
  });

  test("et svar som ikke finnes gir null, ikke en feil", async () => {
    expect(
      await hentLagret("faguttrykk", GJELDENDE.versjon, "finnes ikke"),
    ).toBeNull();
  });
});

describe("les-modus i generatoren", () => {
  test("virker uten API-nøkkel — hele poenget med mekanismen", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    process.env.LESEVENN_TESTMODUS = "les";

    const data = { uttrykk: [{ ord: "mitosen", kildeavsnitt: 2 }] };
    await lagreSvar("faguttrykk", GJELDENDE.versjon, GJELDENDE.modell, MELDING, data);

    const r = await kjoerGenerator({
      oppgave: "faguttrykk",
      skjema,
      brukermelding: MELDING,
    });

    expect(r.data).toEqual(data);
    expect(r.promptversjon).toBe(GJELDENDE.versjon);
    expect(r.modell).toBe(GJELDENDE.modell);
  });

  test("manglende svar gir en feil som sier hva man kan gjøre", async () => {
    delete process.env.ANTHROPIC_API_KEY;
    process.env.LESEVENN_TESTMODUS = "les";

    try {
      await kjoerGenerator({
        oppgave: "faguttrykk",
        skjema,
        brukermelding: "__test__ ingen lagret fil for denne",
      });
      throw new Error("skulle kastet");
    } catch (e) {
      expect(e).toBeInstanceOf(GeneratorFeil);
      const f = e as GeneratorFeil;
      expect(f.kode).toBe("lagret_svar_mangler");
      // §5: ingen feiltilstand er en blindvei.
      expect(f.anbefaltHandling).toContain("LESEVENN_TESTMODUS");
    }
  });

  test("lagret svar valideres mot skjemaet, som et ferskt svar", async () => {
    // En testmodus som hoppet over valideringen ville demonstrert en kodevei
    // som ikke finnes i drift.
    delete process.env.ANTHROPIC_API_KEY;
    process.env.LESEVENN_TESTMODUS = "les";

    await lagreSvar("faguttrykk", GJELDENDE.versjon, GJELDENDE.modell, MELDING, {
      uttrykk: [{ ord: "mitosen", kildeavsnitt: "to" }],
    });

    try {
      await kjoerGenerator({ oppgave: "faguttrykk", skjema, brukermelding: MELDING });
      throw new Error("skulle kastet");
    } catch (e) {
      expect(e).toBeInstanceOf(GeneratorFeil);
      expect((e as GeneratorFeil).kode).toBe("ugyldig_utdata");
    }
  });
});
