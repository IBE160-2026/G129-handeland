/**
 * Tester for leseinnstillingene — FR-12.
 */

import { describe, expect, test } from "vitest";
import { LINJELENGDE_CH, STANDARD, lesestil, tolkInnstillinger } from "./leseinnstillinger";

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

  test("linjelengden regnes i tegn, så den følger tekststørrelsen", () => {
    expect(lesestil(STANDARD).maxWidth).toBe(`${LINJELENGDE_CH}ch`);
    expect(lesestil({ tekststorrelse: "ekstra", linjeavstand: "tett" })).toMatchObject({ fontSize: "1.625rem", lineHeight: 1.5 });
  });
});
