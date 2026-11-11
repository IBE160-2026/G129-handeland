import { describe, expect, test } from "vitest";
import { stegtekst } from "./steg";

describe("stegtekst — innlimt tekst har ett steg mindre (FR-3)", () => {
  test("innlimt tekst: tre steg, uten gjennomsyn", () => {
    expect(stegtekst("liming", "aktivering")).toBe("Steg 1 av 3");
    expect(stegtekst("liming", "lesing")).toBe("Steg 2 av 3");
    expect(stegtekst("liming", "oppgaver")).toBe("Steg 3 av 3");
  });

  test("PDF og bilde: fire steg, med gjennomsyn", () => {
    expect(stegtekst("pdf", "aktivering")).toBe("Steg 1 av 4");
    expect(stegtekst("pdf", "gjennomsyn")).toBe("Steg 2 av 4");
    expect(stegtekst("bilde", "oppgaver")).toBe("Steg 4 av 4");
    expect(stegtekst("bilde", "lesing")).toBe("Steg 3 av 4");
  });

  test("en innlimt tekst fra før endringen som står i gjennomsynet, får ikke «Steg 0»", () => {
    expect(stegtekst("liming", "gjennomsyn")).toBe("Steg 2 av 4");
  });
});
