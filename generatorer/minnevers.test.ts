/**
 * Tester for den maskinelle delen av FR-31 og formkravene i FR-30.
 */

import { describe, expect, test } from "vitest";
import { brukesIVers, kontrollerVers } from "./minnevers";

const SETT = ["mitose", "meiose", "kromosom", "celledeling"];
const vers = (linjer: string[], faguttrykk = ["mitose", "meiose", "kromosom"], stil = "") => ({ linjer, faguttrykk, stil });
const GODT = ["Mitosen deler cella i to,", "meiose gir kjønnsceller å bo,", "hvert kromosom blir kopiert,", "så arvestoffet blir fordelt."];

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

describe("FR-30/31 — kontrollen", () => {
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
