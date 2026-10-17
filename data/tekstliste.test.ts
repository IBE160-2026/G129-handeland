/**
 * Tester for søk og sortering i tekstlisten — FR-36.
 */

import { describe, expect, test } from "vitest";
import { filtrerTekster, tolkSortering } from "./tekstliste";

const T = [
  { tittel: "EM-bølger", opprettet: new Date("2026-10-01") },
  { tittel: "Prisvekst og renter", opprettet: new Date("2026-10-10") },
  { tittel: "Bølger i havet", opprettet: new Date("2026-10-05") },
];

describe("FR-36 — tekstlisten", () => {
  test("nyest først som standard", () => {
    expect(filtrerTekster(T, "", "nyest").map((t) => t.tittel)).toEqual(["Prisvekst og renter", "Bølger i havet", "EM-bølger"]);
  });

  test("eldst først", () => {
    expect(filtrerTekster(T, "", "eldst")[0].tittel).toBe("EM-bølger");
  });

  test("søk på tittel, uten hensyn til store og små bokstaver", () => {
    expect(filtrerTekster(T, "BØLGER", "nyest").map((t) => t.tittel)).toEqual(["Bølger i havet", "EM-bølger"]);
  });

  test("alle ordene må finnes", () => {
    expect(filtrerTekster(T, "renter prisvekst", "nyest")).toHaveLength(1);
    expect(filtrerTekster(T, "renter bølger", "nyest")).toHaveLength(0);
  });

  test("ukjent sortering gir nyest", () => {
    expect(tolkSortering("tilfeldig")).toBe("nyest");
    expect(tolkSortering("eldst")).toBe("eldst");
  });
});
