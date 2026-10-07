/**
 * Tester for forekomstsettet (AD-13).
 *
 * De to reglene som koster mest om de er feil, er ordgrensen og
 * overlappsfjerningen. Begge er usynlige i koden og svært synlige i
 * lesevisningen: uten ordgrensen understrekes halve ord, og uten
 * overlappsfjerningen tegnes to markeringer oppå hverandre.
 */

import { describe, expect, test } from "vitest";
import { delIAvsnitt } from "./avsnittsdeling";
import { fjernOverlapp, finnForekomster } from "./forekomster";

const avsnitt = delIAvsnitt(
  "Celledeling\n\n" +
    "Mitose er den vanligste formen for celledeling. Under mitosen kopieres arvestoffet.\n\n" +
    "Mitosefasen er noe annet enn mitose, selv om ordene likner.",
);

describe("finnForekomster", () => {
  test("finner uttrykket der det står", () => {
    const f = finnForekomster("mitose", avsnitt);
    expect(f.length).toBeGreaterThan(0);
    expect(f[0].avsnittNummer).toBe(2);
  });

  test("spennet peker på den faktiske teksten", () => {
    const f = finnForekomster("mitose", avsnitt);
    const a = avsnitt.find((x) => x.nummer === f[0].avsnittNummer)!;
    expect(a.innhold.slice(f[0].start, f[0].slutt).toLowerCase()).toBe(
      "mitose",
    );
  });

  test("er ufølsom for store og små bokstaver", () => {
    // Må være enig med erVerbatim i valideringen. Er de uenige, kan et
    // uttrykk bestå verbatim-kravet og likevel ikke få noen markering.
    expect(finnForekomster("MITOSE", avsnitt).length).toBeGreaterThan(0);
  });

  test("markerer ikke inni et sammensatt ord", () => {
    // «mitose» står inni «Mitosefasen» i avsnitt 3. Den forekomsten skal ikke
    // være med — ellers understreker visningen de seks første bokstavene i et
    // ord, som ser ut som en feil.
    const f = finnForekomster("mitose", avsnitt);
    const iTredje = f.filter((x) => x.avsnittNummer === 3);
    // Avsnitt 3 har «mitose» som eget ord én gang, og inni «Mitosefasen» én
    // gang. Bare den frittstående skal telle.
    expect(iTredje).toHaveLength(1);
    const a = avsnitt.find((x) => x.nummer === 3)!;
    expect(a.innhold[iTredje[0].slutt]).not.toMatch(/[a-zæøå]/i);
  });

  test("bøyning er et annet ord", () => {
    // «mitosen» og «mitose» er ulike strenger, og generatoren skal oppgi den
    // formen teksten bruker. Et søk på grunnformen finner ikke bøyningen som
    // eget treff — det er riktig, og det er grunnen til at prompten krever
    // formen slik den står.
    const bøyd = finnForekomster("mitosen", avsnitt);
    expect(bøyd).toHaveLength(1);
  });

  test("flerordsuttrykk finnes", () => {
    const a = delIAvsnitt("Den indre energien i systemet endres ikke.");
    expect(finnForekomster("indre energien", a)).toHaveLength(1);
  });

  test("uttrykk som ikke finnes gir tom liste", () => {
    expect(finnForekomster("fotosyntese", avsnitt)).toEqual([]);
  });

  test("tom streng gir tom liste framfor å treffe overalt", () => {
    expect(finnForekomster("   ", avsnitt)).toEqual([]);
  });

  test("finner alle forekomster, ikke bare den første", () => {
    const a = delIAvsnitt("Energi er energi, og energi bevares.");
    expect(finnForekomster("energi", a)).toHaveLength(3);
  });
});

describe("fjernOverlapp", () => {
  const a = delIAvsnitt("Den indre energien i systemet er konstant.");

  test("lengste treff vinner over det korteste", () => {
    const samlet = [
      ...finnForekomster("energien", a),
      ...finnForekomster("indre energien", a),
    ];
    const rent = fjernOverlapp(samlet);

    expect(rent).toHaveLength(1);
    expect(a[0].innhold.slice(rent[0].start, rent[0].slutt)).toBe(
      "indre energien",
    );
  });

  test("markeringer som ikke overlapper beholdes alle", () => {
    const samlet = [
      ...finnForekomster("indre", a),
      ...finnForekomster("systemet", a),
    ];
    expect(fjernOverlapp(samlet)).toHaveLength(2);
  });

  test("resultatet står i dokumentrekkefølge", () => {
    // Visningen leser settet i rekkefølge. Sorteringen inne i funksjonen er
    // etter lengde, så rekkefølgen må gjenopprettes før den returneres.
    const samlet = [
      ...finnForekomster("systemet", a),
      ...finnForekomster("indre", a),
    ];
    const rent = fjernOverlapp(samlet);
    expect(rent.map((f) => f.start)).toEqual(
      [...rent.map((f) => f.start)].sort((x, y) => x - y),
    );
  });

  test("tomt sett gir tomt sett", () => {
    expect(fjernOverlapp([])).toEqual([]);
  });

  test("markeringer i ulike avsnitt overlapper aldri", () => {
    // Spennene er per avsnitt, så to markeringer kan ha samme tallspenn uten
    // å ha noe med hverandre å gjøre. Å sammenligne dem uten å se på
    // avsnittsnummeret ville fjernet den ene.
    const rent = fjernOverlapp([
      { uttrykk: "a", avsnittNummer: 1, start: 0, slutt: 5 },
      { uttrykk: "a", avsnittNummer: 2, start: 0, slutt: 5 },
    ]);
    expect(rent).toHaveLength(2);
  });
});
