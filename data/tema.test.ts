/**
 * Tester for temavalget — EXPERIENCE.md, Gjelder overalt (bolk 4).
 */

import { describe, expect, test } from "vitest";
import { tolkTema } from "./tema";

describe("tolkTema", () => {
  test("lys og moerk er gyldige valg", () => {
    expect(tolkTema("lys")).toBe("lys");
    expect(tolkTema("moerk")).toBe("moerk");
  });

  test("ingen verdi betyr «Følg enheten»", () => {
    expect(tolkTema(undefined)).toBeNull();
    expect(tolkTema(null)).toBeNull();
    expect(tolkTema("")).toBeNull();
  });

  test("ugyldige verdier ignoreres", () => {
    expect(tolkTema("rosa")).toBeNull();
    expect(tolkTema("mørk")).toBeNull();
    expect(tolkTema("Moerk")).toBeNull();
    expect(tolkTema(" lys")).toBeNull();
    expect(tolkTema("enhet")).toBeNull();
    expect(tolkTema(1)).toBeNull();
  });
});
