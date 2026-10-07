/**
 * Tester for faguttrykk-generatoren.
 *
 * Testene kaller `hentFaguttrykk` for fullt, men modellen kalles aldri: de
 * legger et svar i testmodus-lageret først og kjører i `les`. Det er samme
 * mekanisme sensor bruker (AD-18), og den gjør hele kjeden testbar —
 * skjemavalidering, verbatim-sjekk, forekomstberegning, kapping — uten en
 * API-nøkkel og uten at svaret endrer seg mellom kjøringer.
 *
 * Det disse testene IKKE sier noe om, er om modellen finner de riktige
 * uttrykkene. Det er FR-8, det måles mot gullsettet, og det kan bare gjøres
 * med ekte kall. Skillet er AD-5.
 */

import { rm } from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import { hentFaguttrykk } from "./faguttrykk";
import { formaterAvsnitt } from "./kontrakt";
import { lagreSvar, noekkel } from "./lagretsvar";

const TEKST =
  "Celledeling\n\n" +
  "Mitose er den vanligste formen for celledeling hos planter og dyr. " +
  "Under mitosen kopieres arvestoffet, og cellen deler seg i to like celler. " +
  "Prosessen er nøye styrt, og feil i kopieringen kan gi skader.\n\n" +
  "Når det går galt\n\n" +
  "Hvis arvestoffet kopieres feil, kan cellen få en mutasjon. " +
  "De fleste mutasjoner er harmløse, men noen kan føre til sykdom.";

const avsnitt = delIAvsnitt(TEKST);
const melding = formaterAvsnitt(avsnitt);

let foer: { modus?: string; noekkel?: string };

beforeEach(() => {
  foer = {
    modus: process.env.LESEVENN_TESTMODUS,
    noekkel: process.env.ANTHROPIC_API_KEY,
  };
  delete process.env.ANTHROPIC_API_KEY;
  process.env.LESEVENN_TESTMODUS = "les";
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
      `${noekkel("faguttrykk", "v1", melding)}.json`,
    ),
    { force: true },
  );
});

/** Legger et modellsvar i lageret, slik at les-modus finner det. */
async function gittSvar(faguttrykk: unknown[]) {
  await lagreSvar("faguttrykk", "v1", "claude-haiku-4-5", melding, {
    faguttrykk,
  });
}

describe("hentFaguttrykk — den gyldige veien", () => {
  test("gyldige uttrykk kommer gjennom, med markeringer", async () => {
    await gittSvar([
      {
        uttrykk: "Mitose",
        forklaring: "Celledeling der arvestoffet kopieres og cellen deler seg i to like celler.",
        viktighetsrangering: 1,
        kildeavsnitt: 2,
      },
      {
        uttrykk: "mutasjon",
        forklaring: "En endring i arvestoffet, ofte etter en feil i kopieringen.",
        viktighetsrangering: 2,
        kildeavsnitt: 4,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);

    expect(r.begreper.map((b) => b.uttrykk)).toEqual(["Mitose", "mutasjon"]);
    expect(r.forkastet).toEqual([]);
    // AD-13: hvert begrep har markeringene sine, og settet er samlet.
    expect(r.begreper[0].forekomster.length).toBeGreaterThan(0);
    expect(r.forekomster.length).toBeGreaterThan(0);
    // AD-4: begge stemples.
    expect(r.promptversjon).toBe("v1");
    expect(r.modell).toBe("claude-haiku-4-5");
  });

  test("begrepene kommer i rangeringsrekkefølge, ikke modellens rekkefølge", async () => {
    await gittSvar([
      {
        uttrykk: "mutasjon",
        forklaring: "En endring i arvestoffet.",
        viktighetsrangering: 3,
        kildeavsnitt: 4,
      },
      {
        uttrykk: "Mitose",
        forklaring: "Celledeling der cellen deler seg i to like celler.",
        viktighetsrangering: 1,
        kildeavsnitt: 2,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.begreper.map((b) => b.uttrykk)).toEqual(["Mitose", "mutasjon"]);
  });

  test("tom liste er et gyldig svar", async () => {
    // FR-7: det finnes ingen nedre grense. En tekst uten fagspråk skal gi et
    // tomt Begrepssett, ikke oppdiktede ord.
    await gittSvar([]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.begreper).toEqual([]);
    expect(r.forekomster).toEqual([]);
    expect(r.tetthet.antallForekomster).toBe(0);
  });
});

describe("hentFaguttrykk — forkasting med begrunnelse", () => {
  test("uttrykk som ikke står i teksten forkastes", async () => {
    await gittSvar([
      {
        uttrykk: "fotosyntese",
        forklaring: "Prosessen der planter lager sukker av lys.",
        viktighetsrangering: 1,
        kildeavsnitt: 2,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.begreper).toEqual([]);
    expect(r.forkastet).toHaveLength(1);
    expect(r.forkastet[0].aarsak).toContain("verbatim");
  });

  test("kildeavsnitt utenfor listen forkastes", async () => {
    await gittSvar([
      {
        uttrykk: "Mitose",
        forklaring: "Celledeling der cellen deler seg i to.",
        viktighetsrangering: 1,
        kildeavsnitt: 99,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.begreper).toEqual([]);
    expect(r.forkastet[0].aarsak).toContain("kildeavsnitt");
  });

  test("sirkulær forklaring forkastes", async () => {
    await gittSvar([
      {
        uttrykk: "Mitose",
        forklaring: "Mitose er mitose.",
        viktighetsrangering: 1,
        kildeavsnitt: 2,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.begreper).toEqual([]);
    expect(r.forkastet[0].aarsak).toContain("sirkulær");
  });

  test("duplikater slås sammen, og beste rangering vinner", async () => {
    await gittSvar([
      {
        uttrykk: "Mitose",
        forklaring: "Celledeling der cellen deler seg i to like celler.",
        viktighetsrangering: 4,
        kildeavsnitt: 2,
      },
      {
        uttrykk: "mitose",
        forklaring: "Den vanligste formen for celledeling hos planter og dyr.",
        viktighetsrangering: 1,
        kildeavsnitt: 2,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.begreper).toHaveLength(1);
    expect(r.begreper[0].viktighetsrangering).toBe(1);
  });

  test("forkastede uttrykk tar ikke med seg de gyldige", async () => {
    // Elementbrudd forkaster elementet, ikke settet. AD-11.
    await gittSvar([
      {
        uttrykk: "fotosyntese",
        forklaring: "Finnes ikke i denne teksten.",
        viktighetsrangering: 1,
        kildeavsnitt: 2,
      },
      {
        uttrykk: "mutasjon",
        forklaring: "En endring i arvestoffet, ofte etter en kopieringsfeil.",
        viktighetsrangering: 2,
        kildeavsnitt: 4,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.begreper.map((b) => b.uttrykk)).toEqual(["mutasjon"]);
    expect(r.forkastet).toHaveLength(1);
  });
});

describe("hentFaguttrykk — tetthet", () => {
  test("tetthetsmålet er målt på det endelige settet", async () => {
    await gittSvar([
      {
        uttrykk: "Mitose",
        forklaring: "Celledeling der cellen deler seg i to like celler.",
        viktighetsrangering: 1,
        kildeavsnitt: 2,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.tetthet.antallOrd).toBeGreaterThan(0);
    expect(r.tetthet.antallForekomster).toBe(r.forekomster.length);
  });

  test("kort tekst: gulvet beholder settet selv om målet er utenfor", async () => {
    // Dette er ikke en kantsak, det er normaltilfellet for korte tekster.
    // Teksten her er om lag 55 ord. Én eneste markering gir 1/55 × 1000 ≈ 18
    // unike per tusen ord, mot taket på 12 — altså `innenfor: false` med bare
    // ett begrep. Gulvet i FR-7 («inntil 5») er det som gjør at settet
    // likevel leveres.
    //
    // Konsekvensen er at `tetthet.innenfor` er et MÅLETALL og ikke en port:
    // et sett kan være utenfor og likevel være det riktige å vise. Leses det
    // som en port, forsvinner markeringene i enhver kort tekst.
    await gittSvar([
      {
        uttrykk: "Mitose",
        forklaring: "Celledeling der cellen deler seg i to like celler.",
        viktighetsrangering: 1,
        kildeavsnitt: 2,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    expect(r.tetthet.antallOrd).toBeLessThan(100);
    expect(r.tetthet.unikePerTusenOrd).toBeGreaterThan(12);
    expect(r.tetthet.innenfor).toBe(false);
    // Og likevel beholdt, fordi gulvet er fem:
    expect(r.begreper).toHaveLength(1);
    expect(r.forkastet).toEqual([]);
  });

  test("lang tekst med et spredt begrep er innenfor", async () => {
    // Samme ene begrep, men nok tekst rundt og nok avstand mellom
    // forekomstene. Det viser at testen over handler om tekstlengde og
    // tetthet, ikke om en feil i regnestykket.
    const lang = delIAvsnitt(
      "Celledeling\n\n" +
        ("Mitose er den vanligste formen for celledeling hos planter og dyr. " +
          "Cellen kopierer arvestoffet sitt og deler seg deretter i to nye celler " +
          "som hver inneholder en fullstendig kopi av det opprinnelige arvestoffet. " +
          "Prosessen er nøye styrt av en rekke kontrollpunkter underveis, og dersom " +
          "noe går galt, stopper cellen opp framfor å dele seg videre med en feil. " +
          "Dette er en viktig del av kroppens forsvar mot skadelige endringer. ").repeat(
          3,
        ),
    );
    const langMelding = formaterAvsnitt(lang);

    await lagreSvar("faguttrykk", "v1", "claude-haiku-4-5", langMelding, {
      faguttrykk: [
        {
          uttrykk: "kontrollpunkter",
          forklaring:
            "Steder i celledelingen der cellen sjekker at alt er riktig før den går videre.",
          viktighetsrangering: 1,
          kildeavsnitt: 2,
        },
      ],
    });

    try {
      const r = await hentFaguttrykk(lang);
      expect(r.tetthet.antallOrd).toBeGreaterThan(200);
      expect(r.begreper).toHaveLength(1);
      expect(r.tetthet.unikePerTusenOrd).toBeLessThan(12);
      expect(r.tetthet.hoeyesteVindu).toBeLessThanOrEqual(3);
      expect(r.tetthet.innenfor).toBe(true);
    } finally {
      await rm(
        path.join(
          process.cwd(),
          "testdata",
          "modellsvar",
          "faguttrykk",
          `${noekkel("faguttrykk", "v1", langMelding)}.json`,
        ),
        { force: true },
      );
    }
  });

  test("ETT begrep som gjentas bryter taket, og kappingen kan ikke redde det", async () => {
    // Funn fra å kjøre dette: et eneste Faguttrykk som forfatteren gjentar
    // ofte bryter tetthetstakene alene — både andelen av løpende ord og
    // vinduet på 100 ord — selv om det bare er ett unikt uttrykk i settet.
    //
    // Og kappingen kan ikke gjøre noe med det: `kappEtterRangering` kutter
    // hele begreper nedenfra og stopper ved gulvet på fem. Med ett begrep er
    // det ingenting å kutte. Settet leveres altså med `innenfor: false`.
    //
    // Det er riktig oppførsel — alternativet ville vært å droppe tekstens
    // viktigste begrep fordi forfatteren gjentar det — men det betyr at
    // tetthetstakene IKKE er en garanti om det eleven ser. De er måletall som
    // kan stå som brutt, fordi FR-7s kapping er grovkornet med vilje: den
    // kutter begreper, ikke enkeltmarkeringer. Verdt å vite før noen leser
    // `innenfor` som et løfte, eller bygger en sperre på det.
    const tett = delIAvsnitt(
      "Arvestoff\n\n" +
        ("Arvestoffet kopieres før delingen. Arvestoffet må være helt likt i " +
          "begge de nye cellene, og arvestoffet sjekkes derfor nøye underveis. " +
          "Er arvestoffet skadet, stopper prosessen. ").repeat(3),
    );
    const tettMelding = formaterAvsnitt(tett);

    await lagreSvar("faguttrykk", "v1", "claude-haiku-4-5", tettMelding, {
      faguttrykk: [
        {
          uttrykk: "Arvestoffet",
          forklaring: "Molekylet som bærer cellens oppskrift, altså DNA-et.",
          viktighetsrangering: 1,
          kildeavsnitt: 2,
        },
      ],
    });

    try {
      const r = await hentFaguttrykk(tett);
      // Ett unikt uttrykk, mange markeringer — det er hele poenget.
      expect(r.tetthet.antallUnike).toBe(1);
      expect(r.tetthet.antallForekomster).toBeGreaterThan(5);
      expect(r.tetthet.hoeyesteVindu).toBeGreaterThan(3);
      expect(r.tetthet.innenfor).toBe(false);
      // Og begrepet leveres likevel, med alle markeringene sine.
      expect(r.begreper).toHaveLength(1);
      expect(r.forkastet).toEqual([]);
    } finally {
      await rm(
        path.join(
          process.cwd(),
          "testdata",
          "modellsvar",
          "faguttrykk",
          `${noekkel("faguttrykk", "v1", tettMelding)}.json`,
        ),
        { force: true },
      );
    }
  });

  test("overlappende uttrykk gir ikke dobbel markering", async () => {
    // «celledeling» står inni «Celledeling» (overskriften) og i avsnitt 2.
    // Begge er egne ord, så begge skal markeres — men ingen markering skal
    // tegnes to ganger på samme sted.
    await gittSvar([
      {
        uttrykk: "celledeling",
        forklaring: "Når en celle deler seg i to nye celler.",
        viktighetsrangering: 1,
        kildeavsnitt: 1,
      },
    ]);

    const r = await hentFaguttrykk(avsnitt);
    const nøkler = r.forekomster.map(
      (f) => `${f.avsnittNummer}:${f.start}:${f.slutt}`,
    );
    expect(new Set(nøkler).size).toBe(nøkler.length);
  });
});
