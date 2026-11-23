/**
 * Sperretiden etter for mange innloggingsforsøk — FR-35. Kanttilfellene i
 * spec-runde-3-1-innloggingssperre: overskriften kan mangle eller være
 * ugyldig, og «1 sekund» er entall.
 */

import { describe, expect, test } from "vitest";
import { STANDARD_SPERRETID, sekunderFraOverskrift, ventetekst } from "./sperretid";

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
