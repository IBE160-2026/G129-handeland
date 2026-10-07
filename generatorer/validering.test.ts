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
  begrepsbudsjett,
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

/* ------------------------------------------------------------------ */

describe("FR-7 — begrepsbudsjettet er antallstaket regnet ut", () => {
  test("12 per tusen ord gir 9 for 794 ord", () => {
    // Tallet fra NDLA-teksten vi måler mot. floor(12 × 794/1000) = 9.
    const lang = delIAvsnitt("ord ".repeat(794).trim());
    expect(begrepsbudsjett(lang)).toBe(9);
  });

  test("korte tekster får gulvet, ikke taket", () => {
    // 200 ord ville gitt 2. FR-7 sier inntil 5 kan beholdes likevel, slik at
    // en kort tekst ikke ender med ett markert ord.
    const kort = delIAvsnitt("ord ".repeat(200).trim());
    expect(begrepsbudsjett(kort)).toBe(TETTHETSTAK.gulvForKorteTekster);
  });

  test("budsjettet er et tak, ikke et mål", () => {
    // Tom tekst gir gulvet, men gulvet betyr «inntil», og kappingen under
    // legger aldri til noe. Jf. «ingen nedre grense» i FR-7.
    expect(begrepsbudsjett([])).toBe(TETTHETSTAK.gulvForKorteTekster);
  });
});

describe("AD-11 — kappingen bruker den billigste knappen først", () => {
  /** Lang tekst, så budsjettet blir 9 og ikke gulvet. */
  const LANG = delIAvsnitt(
    "Overskrift\n\n" + "fyllord ".repeat(800).trim(),
  );

  const kandidater = (antall: number): Begrepskandidat[] =>
    Array.from({ length: antall }, (_, i) => ({
      uttrykk: `uttrykk${i}`,
      forklaring: `Forklaring nummer ${i} med reelt innhold.`,
      viktighetsrangering: i + 1,
      kildeavsnittNummer: 2,
    }));

  /** Hvert uttrykk står én gang, spredt utover avsnitt 2. */
  const spredt =
    (alle: Begrepskandidat[]) =>
    (uttrykk: string): Forekomst[] => {
      const i = alle.findIndex((k) => k.uttrykk === uttrykk);
      return i === -1
        ? []
        : [{ uttrykk, avsnittNummer: 2, start: i * 400, slutt: i * 400 + 5 }];
    };

  test("trinn 1: kutter til budsjettet, ikke til gulvet", () => {
    // Dette er feilen fra den ekte kjøringen: 26 kandidater ble kuttet til 5
    // (gulvet) når budsjettet var 9. Nå skal den stoppe på budsjettet.
    const alle = kandidater(26);
    const r = kappEtterRangering(alle, spredt(alle), LANG);

    expect(r.beholdt).toHaveLength(begrepsbudsjett(LANG));
    expect(r.beholdt.length).toBeGreaterThan(TETTHETSTAK.gulvForKorteTekster);
    expect(r.beholdt[0].viktighetsrangering).toBe(1);
  });

  test("er settet innenfor fra før, røres ingenting", () => {
    const alle = kandidater(4);
    const r = kappEtterRangering(alle, spredt(alle), LANG);
    expect(r.beholdt).toHaveLength(4);
    expect(r.trinn).toBe("ingen");
    expect(r.forekomster).toHaveLength(4);
  });

  test("trinn 2: markeringer begrenses før begreper fjernes", () => {
    // Fem begreper som hvert står tjue ganger, tett sammen. Alle fem er
    // innenfor budsjettet, så svaret skal være å vise færre markeringer —
    // ikke å fjerne fagord eleven da ikke får forklart.
    // Hvert begrep har sin egen klynge, langt fra de andre: første forekomst
    // ligger ~150 ord fra forrige begreps, mens de åtte innenfor klyngen står
    // tett. Da er det klyngene som bryter vinduet, og ikke antallet begreper —
    // som er nøyaktig situasjonen fra NDLA-kjøringen.
    const alle = kandidater(5);
    const mange = (uttrykk: string): Forekomst[] => {
      const i = alle.findIndex((k) => k.uttrykk === uttrykk);
      if (i === -1) return [];
      return Array.from({ length: 8 }, (_, j) => ({
        uttrykk,
        avsnittNummer: 2,
        start: i * 1200 + j * 40,
        slutt: i * 1200 + j * 40 + 5,
      }));
    };

    const r = kappEtterRangering(alle, mange, LANG);

    // Alle fem begrepene beholdt.
    expect(r.beholdt).toHaveLength(5);
    // Men ikke alle hundre markeringene.
    expect(r.forekomster.length).toBeLessThan(40);
    expect(r.trinn).not.toBe("ingen");
    expect(r.trinn).not.toBe("kuttet_videre");
  });

  test("uoppnåelig vindustak rapporteres, begrepene ofres ikke", () => {
    // Umulig sett: alle begrepene har markeringer på samme sted, så ingen
    // begrensning av markeringer kan få vinduet innenfor. Dette er NDLA-
    // tilfellet i rendyrket form — fagspråket introduseres samlet, og
    // førsteforekomstene klumper seg.
    //
    // Den gamle utgaven kuttet da begreper til den nådde gulvet, og brøt
    // taket likevel. Nå beholdes budsjettet, og bruddet rapporteres.
    const alle = kandidater(26);
    const umulig = (uttrykk: string): Forekomst[] =>
      Array.from({ length: 20 }, (_, j) => ({
        uttrykk,
        avsnittNummer: 2,
        start: j,
        slutt: j + 1,
      }));

    const r = kappEtterRangering(alle, umulig, LANG);

    expect(r.beholdt).toHaveLength(begrepsbudsjett(LANG));
    expect(r.trinn).toBe("rapportert_brutt");
    // Én markering per begrep, altså det billigste virkemidlet brukt fullt ut.
    expect(r.forekomster).toHaveLength(begrepsbudsjett(LANG));
    expect(maalTetthet(r.forekomster, LANG).innenfor).toBe(false);
  });

  test("gulvet er «inntil fem», ikke «minst fem»", () => {
    const alle = kandidater(3);
    const r = kappEtterRangering(alle, spredt(alle), LANG);
    expect(r.beholdt).toHaveLength(3);
  });

  test("null kandidater gir null, ikke et gulv", () => {
    const r = kappEtterRangering([], spredt([]), LANG);
    expect(r.beholdt).toHaveLength(0);
    expect(r.forekomster).toHaveLength(0);
  });
});
