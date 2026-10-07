/**
 * Tester for AD-11, valideringen av generert utdata.
 *
 * Alle er deterministiske og kaller ikke modellen — `npm test`-halvdelen av
 * AD-5. De maskinelle kravene som MÅ ha et modellsvar å se på (FR-20, FR-21)
 * hører i `npm run maal`, ikke her.
 */

import { describe, expect, test } from "vitest";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import {
  erVerbatim,
  erSirkulaer,
  harGyldigKildeavsnitt,
  filtrerUgyldige,
  maalTetthet,
  kappEtterRangering,
  TETTHETSTAK,
  type Begrepskandidat,
  type Forekomst,
} from "./validering";

const TEKST = delIAvsnitt(
  [
    "Celledeling",
    "",
    "Mitose er den vanligste formen for celledeling hos mennesker. Under mitosen kopieres arvestoffet først, og deretter deler cellen seg i to.",
    "",
    "Når delingen går galt",
    "",
    "Noen ganger kopieres arvestoffet feil. Da kan det oppstå en mutasjon.",
  ].join("\n"),
);

/* ------------------------------------------------------------------ */

describe("FR-7 — verbatim-kravet, terskel 100 prosent", () => {
  test("godtar uttrykk som står ordrett i teksten", () => {
    expect(erVerbatim("mitose", TEKST)).toBe(true);
    expect(erVerbatim("arvestoffet", TEKST)).toBe(true);
  });

  test("godtar uavhengig av store og små bokstaver", () => {
    // «Mitose» står med stor forbokstav i teksten.
    expect(erVerbatim("Mitose", TEKST)).toBe(true);
    expect(erVerbatim("MITOSE", TEKST)).toBe(true);
  });

  test("avviser oppdiktede uttrykk", () => {
    // Dette er feilen kravet finnes for: modellen finner opp et fagord.
    expect(erVerbatim("fotosyntese", TEKST)).toBe(false);
  });

  test("avviser tomt uttrykk", () => {
    expect(erVerbatim("", TEKST)).toBe(false);
    expect(erVerbatim("   ", TEKST)).toBe(false);
  });
});

describe("FR-7 — sirkulære forklaringer", () => {
  test("fanger den åpenbare sirkulariteten", () => {
    expect(erSirkulaer("mitose", "Mitose er mitose.")).toBe(true);
    expect(erSirkulaer("mutasjon", "En mutasjon.")).toBe(true);
  });

  test("fanger bøyning av uttrykket som eneste innhold", () => {
    expect(erSirkulaer("mitose", "Det er mitosen.")).toBe(true);
  });

  test("godtar en forklaring med reelt innhold", () => {
    expect(
      erSirkulaer(
        "mitose",
        "Deling der cellen lager to like kopier av seg selv.",
      ),
    ).toBe(false);
  });

  test("avviser tomt uttrykk som sirkulært", () => {
    expect(erSirkulaer("", "hva som helst")).toBe(true);
  });
});

describe("AD-10 — kildeavsnitt må finnes i den mottatte listen", () => {
  const kandidat = (nummer: number): Begrepskandidat => ({
    uttrykk: "mitose",
    forklaring: "Deling der cellen lager to like kopier.",
    viktighetsrangering: 1,
    kildeavsnittNummer: nummer,
  });

  test("godtar et nummer som finnes", () => {
    expect(harGyldigKildeavsnitt(kandidat(2), TEKST)).toBe(true);
  });

  test("avviser et nummer utenfor listen", () => {
    // Forskyvning på én er nøyaktig feilen AD-10 ble omskrevet for å fange.
    expect(harGyldigKildeavsnitt(kandidat(99), TEKST)).toBe(false);
    expect(harGyldigKildeavsnitt(kandidat(0), TEKST)).toBe(false);
  });
});

describe("AD-11 — elementbrudd forkastes, med årsak", () => {
  test("skiller bestått fra forkastet og oppgir hvorfor", () => {
    const kandidater: Begrepskandidat[] = [
      {
        uttrykk: "mitose",
        forklaring: "Deling der cellen lager to like kopier.",
        viktighetsrangering: 1,
        kildeavsnittNummer: 2,
      },
      {
        uttrykk: "fotosyntese",
        forklaring: "Prosess der planter lager energi fra lys.",
        viktighetsrangering: 2,
        kildeavsnittNummer: 2,
      },
      {
        uttrykk: "mutasjon",
        forklaring: "En mutasjon.",
        viktighetsrangering: 3,
        kildeavsnittNummer: 4,
      },
      {
        uttrykk: "arvestoffet",
        forklaring: "Det som bærer informasjonen videre til nye celler.",
        viktighetsrangering: 4,
        kildeavsnittNummer: 99,
      },
    ];

    const { bestaatt, forkastet } = filtrerUgyldige(kandidater, TEKST);

    expect(bestaatt.map((b) => b.uttrykk)).toEqual(["mitose"]);
    expect(forkastet.map((f) => f.aarsak)).toEqual([
      "ikke verbatim i teksten",
      "sirkulær forklaring",
      "kildeavsnitt utenfor listen",
    ]);
  });
});

/* ------------------------------------------------------------------ */

describe("FR-7 og AD-13 — tetthet regnes på forekomstsettet", () => {
  test("skiller markeringer fra unike uttrykk", () => {
    // Samme uttrykk to steder er to markeringer for eleven, men ett
    // Faguttrykk. FR-7 har ulike tak for de to, så de må kunne skilles:
    // andelen av løpende ord gjelder markeringene, mens taket på 12 per
    // 1 000 ord gjelder unike uttrykk.
    const forekomster: Forekomst[] = [
      { uttrykk: "mitose", avsnittNummer: 2, start: 0, slutt: 6 },
      { uttrykk: "mitose", avsnittNummer: 2, start: 50, slutt: 56 },
    ];
    const m = maalTetthet(forekomster, TEKST);
    expect(m.antallForekomster).toBe(2);
    expect(m.antallUnike).toBe(1);
  });

  test("ulik bøyning av samme skrivemåte teller som ett uttrykk", () => {
    // Store og små bokstaver skal ikke gjøre ett begrep til to i målingen.
    const m = maalTetthet(
      [
        { uttrykk: "Mitose", avsnittNummer: 2, start: 0, slutt: 6 },
        { uttrykk: "mitose", avsnittNummer: 2, start: 50, slutt: 56 },
      ],
      TEKST,
    );
    expect(m.antallUnike).toBe(1);
  });

  test("et tomt sett er innenfor", () => {
    expect(maalTetthet([], TEKST).innenfor).toBe(true);
  });

  test("glidende vindu fanger et nedlesset avsnitt som snittet skjuler", () => {
    // Fire markeringer tett sammen i starten av ett avsnitt. Andelen over hele
    // teksten er lav, men vinduet på 100 ord bryter taket på 3.
    const tett: Forekomst[] = [
      { uttrykk: "ett", avsnittNummer: 2, start: 0, slutt: 6 },
      { uttrykk: "to", avsnittNummer: 2, start: 7, slutt: 9 },
      { uttrykk: "tre", avsnittNummer: 2, start: 10, slutt: 13 },
      { uttrykk: "fire", avsnittNummer: 2, start: 14, slutt: 22 },
    ];
    const m = maalTetthet(tett, TEKST);

    expect(m.hoeyesteVindu).toBeGreaterThan(
      TETTHETSTAK.perHundreSammenhengende,
    );
    expect(m.innenfor).toBe(false);
  });

  test("tåler tom avsnittsliste uten å dele på null", () => {
    const m = maalTetthet([], []);
    expect(m.andelAvOrd).toBe(0);
    expect(m.unikePerTusenOrd).toBe(0);
    expect(m.innenfor).toBe(true);
  });
});

describe("AD-11 — settbrudd kappes etter rangering, ikke forkastes", () => {
  const mange: Begrepskandidat[] = Array.from({ length: 12 }, (_, i) => ({
    uttrykk: `uttrykk${i}`,
    forklaring: `Forklaring nummer ${i} med reelt innhold.`,
    viktighetsrangering: i + 1,
    kildeavsnittNummer: 2,
  }));

  // Hver kandidat har én forekomst, alle tett sammen i avsnitt 2.
  const forekomsterFor = (uttrykk: string): Forekomst[] => {
    const i = mange.findIndex((k) => k.uttrykk === uttrykk);
    return i === -1 ? [] : [{ uttrykk, avsnittNummer: 2, start: i, slutt: i + 1 }];
  };

  test("beholder de høyest rangerte og kutter nedenfra", () => {
    const beholdt = kappEtterRangering(mange, forekomsterFor, TEKST);

    expect(beholdt.length).toBeLessThan(mange.length);
    // Rangering 1 er høyest prioritet og skal alltid overleve.
    expect(beholdt[0].viktighetsrangering).toBe(1);
    // Kappingen skjer nedenfra, så rangeringene er sammenhengende fra 1.
    expect(beholdt.map((b) => b.viktighetsrangering)).toEqual(
      beholdt.map((_, i) => i + 1),
    );
  });

  test("kapper aldri under gulvet på fem", () => {
    const beholdt = kappEtterRangering(mange, forekomsterFor, TEKST);
    expect(beholdt.length).toBeGreaterThanOrEqual(
      TETTHETSTAK.gulvForKorteTekster,
    );
  });

  test("gulvet er «inntil fem», ikke «minst fem»", () => {
    // Tre gyldige kandidater skal gi tre — ikke fem oppdiktede.
    const tre = mange.slice(0, 3);
    const beholdt = kappEtterRangering(tre, forekomsterFor, TEKST);
    expect(beholdt).toHaveLength(3);
  });

  test("null kandidater gir null, ikke et gulv", () => {
    expect(kappEtterRangering([], forekomsterFor, TEKST)).toHaveLength(0);
  });
});
