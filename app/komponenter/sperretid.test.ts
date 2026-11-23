/**
 * Sperretiden etter for mange innloggingsforsøk — FR-35. Kanttilfellene i
 * spec-runde-3-1-innloggingssperre: overskriften kan mangle eller være
 * ugyldig, og «1 sekund» er entall.
 */

import { describe, expect, test } from "vitest";
import {
  SPERRE_OVER,
  STANDARD_SPERRETID,
  knappetekstUnderSperre,
  nedtelling,
  sekunderFraOverskrift,
  sperremelding,
  ventetekst,
} from "./sperretid";

describe("meldingen og knappen under sperren", () => {
  test("meldingen sier det faktiske antallet sekunder", () => {
    expect(sperremelding(47)).toEqual({
      melding: "For mange forsøk på kort tid.",
      handling: "Vent 47 sekunder, og prøv igjen.",
    });
    expect(sperremelding(1).handling).toBe("Vent 1 sekund, og prøv igjen.");
    expect(knappetekstUnderSperre(47)).toBe("Vent 47 s");
  });
});

describe("nedtelling", () => {
  const slutt = 100_000;
  test("teller ned i hele sekunder, rundet opp", () => {
    expect(nedtelling(slutt, slutt - 47_000)).toBe(47);
    expect(nedtelling(slutt, slutt - 46_200)).toBe(47);
    expect(nedtelling(slutt, slutt - 1)).toBe(1);
  });

  test("ferdig ved 0, også om tikket kommer for sent (bakgrunnsfane)", () => {
    expect(nedtelling(slutt, slutt)).toBe("ferdig");
    expect(nedtelling(slutt, slutt + 30_000)).toBe("ferdig");
    expect(SPERRE_OVER).toBe("Du kan prøve igjen nå.");
  });
});

describe("sekunderFraOverskrift", () => {
  test("et gyldig antall sekunder brukes som det er", () => {
    expect(sekunderFraOverskrift("47")).toBe(47);
    expect(sekunderFraOverskrift("1")).toBe(1);
    expect(sekunderFraOverskrift("60")).toBe(60);
  });

  test("mangler eller er ugyldig: 60 sekunder", () => {
    expect(STANDARD_SPERRETID).toBe(60);
    for (const verdi of [null, undefined, "", "abc", "0", "-3", "1.5", "12abc"]) {
      expect(sekunderFraOverskrift(verdi), String(verdi)).toBe(60);
    }
  });
});

describe("ventetekst", () => {
  test("entall og flertall", () => {
    expect(ventetekst(1)).toBe("1 sekund");
    expect(ventetekst(2)).toBe("2 sekunder");
    expect(ventetekst(47)).toBe("47 sekunder");
  });
});
