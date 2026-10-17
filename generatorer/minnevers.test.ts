/**
 * Tester for den maskinelle delen av FR-31 og formkravene i FR-30.
 */

import { describe, expect, test } from "vitest";
import { brukesIVers, kontrollerVers, stavelser } from "./minnevers";

const SETT = ["mitose", "meiose", "kromosom", "celledeling"];
const vers = (linjer: string[], faguttrykk = ["mitose", "meiose", "kromosom"], stil = "") => ({ linjer, faguttrykk, stil });
const GODT = ["Mitosen deler cella i to,", "meiose lager kjønnsceller, jo!", "Hvert kromosom blir kopiert,", "så arvestoff blir fordelt."];

describe("brukesIVers — grunnform eller vanlig bøyning", () => {
  test.each([
    ["mitose", "Mitosen deler", true],
    ["mitose", "to mitosene", true],
    ["mitose", "mitosefasene", false],
    ["mitose", "amitose", false],
    ["kromosom", "kromosomer", true],
  ])("«%s» i «%s»: %s", (u, v, svar) => {
    expect(brukesIVers(u, v)).toBe(svar);
  });
});

describe("stavelser", () => {
  test.each([
    ["Tretti dager har september", 8],
    ["Radiobølger har lav frekvens og lang bølgelengde", 14],
    ["øy og stein", 3],
  ])("«%s»: %i", (l, n) => expect(stavelser(l)).toBe(n));
});

describe("FR-30/31 — kontrollen", () => {
  test("en oppramsing med lange linjer er ikke et minnevers", () => {
    const langt = [...GODT.slice(0, 3), "Mikrobølger har bølgelengder mellom en millimeter og en meter"];
    expect(kontrollerVers(vers(langt), "vers", SETT)[0]).toMatch(/stavelser, høyst 14/);
  });

  test("et godt vers har ingen brudd", () => {
    expect(kontrollerVers(vers(GODT), "vers", SETT)).toEqual([]);
  });

  test("for få og for mange linjer", () => {
    expect(kontrollerVers(vers(GODT.slice(0, 3)), "vers", SETT)[0]).toMatch(/3 linjer/);
    expect(kontrollerVers(vers([...GODT, ...GODT, "ni"]), "vers", SETT)[0]).toMatch(/9 linjer/);
  });

  test("100 prosent: et oppgitt fagord utenfor Begrepssettet er et brudd", () => {
    expect(kontrollerVers(vers(GODT, ["mitose", "DNA-replikasjon"]), "vers", SETT)).toContain(
      "«DNA-replikasjon» står ikke i Begrepssettet",
    );
  });

  test("det som teller er hva verset sier, ikke hva modellen påstår", () => {
    const tynt = ["Mitosen deler cella i to,", "og det er fint,", "det går så bra,", "hurra hurra."];
    expect(kontrollerVers(vers(tynt), "vers", SETT)).toEqual([
      "1 Faguttrykk fra Begrepssettet i verset, skal være minst 3",
    ]);
  });

  test("Suno-prompten krever en stil, høyst 120 tegn", () => {
    expect(kontrollerVers(vers(GODT), "suno", SETT)).toEqual(["Suno-prompten mangler stil"]);
    expect(kontrollerVers(vers(GODT, undefined, "upbeat pop"), "suno", SETT)).toEqual([]);
    expect(kontrollerVers(vers(GODT, undefined, "x".repeat(121)), "suno", SETT)[0]).toMatch(/121 tegn/);
  });
});
