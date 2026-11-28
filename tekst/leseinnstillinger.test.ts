/**
 * Tester for leseinnstillingene — FR-12.
 */

import { describe, expect, test } from "vitest";
import { LINJELENGDE_EM, STANDARD, lesestil, tolkInnstillinger } from "./leseinnstillinger";

describe("FR-12 — leseinnstillinger", () => {
  test("gyldige trinn tolkes som de er", () => {
    expect(tolkInnstillinger({ tekststorrelse: "stor", linjeavstand: "romslig" })).toEqual({
      tekststorrelse: "stor",
      linjeavstand: "romslig",
    });
  });

  test("ukjente eller manglende verdier gir standarden, aldri en feil", () => {
    expect(tolkInnstillinger({ tekststorrelse: "gigantisk", linjeavstand: null })).toEqual(STANDARD);
    expect(tolkInnstillinger({})).toEqual(STANDARD);
    // «constructor» finnes på alle objekter; det skal ikke regnes som et trinn.
    expect(tolkInnstillinger({ tekststorrelse: "constructor" }).tekststorrelse).toBe("normal");
  });

  test("linjelengden regnes i em, så den følger tekststørrelsen", () => {
    expect(lesestil(STANDARD).maxWidth).toBe(`${LINJELENGDE_EM}em`);
    expect(lesestil({ tekststorrelse: "ekstra", linjeavstand: "tett" })).toMatchObject({ fontSize: "2rem", lineHeight: 1.5, "--avsnittsavstand": "0.8em" });
  });
});
