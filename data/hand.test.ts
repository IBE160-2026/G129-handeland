/**
 * Tester for valget «Venstrehendt» — EXPERIENCE.md, Øvekortene (bolk 9).
 */

import { describe, expect, test } from "vitest";
import { tolkHand } from "./hand";

describe("tolkHand", () => {
  test("«venstre» er venstrehendt", () => {
    expect(tolkHand("venstre")).toBe("venstre");
  });

  test("ingenting betyr standardoppsettet", () => {
    expect(tolkHand(undefined)).toBeNull();
    expect(tolkHand(null)).toBeNull();
    expect(tolkHand("")).toBeNull();
  });

  test("alt annet betyr standardoppsettet", () => {
    expect(tolkHand("hoeyre")).toBeNull();
    expect(tolkHand("Venstre")).toBeNull();
    expect(tolkHand(" venstre")).toBeNull();
    expect(tolkHand("on")).toBeNull();
    expect(tolkHand(true)).toBeNull();
    expect(tolkHand(1)).toBeNull();
  });
});
