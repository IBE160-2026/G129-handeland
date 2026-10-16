/**
 * Tester for innholdsordene i FR-20.
 */

import { describe, expect, test } from "vitest";
import { STOPPORD, brukerNoenAv, innfortAvEleven, innholdsord, jaccard, sammeOrd } from "./innholdsord";

describe("innholdsord", () => {
  test("funksjonsord, tall og tegnsetting faller bort", () => {
    expect(innholdsord("Hvorfor blir maten varm i en mikrobølgeovn, 2 ganger?")).toEqual(
      new Set(["maten", "varm", "mikrobølgeovn", "ganger"]),
    );
  });

  test("store bokstaver teller ikke, bindestrek i ord beholdes", () => {
    expect(innholdsord("EM-bølger og em-bølger")).toEqual(new Set(["em-bølger"]));
  });

  test("stoppordlista er fast og har ingen flerordsoppføringer", () => {
    for (const o of STOPPORD) expect(o).not.toMatch(/\s/);
  });
});

describe("jaccard — «ingen gjentakelse»", () => {
  test("like og ulike mengder", () => {
    expect(jaccard(new Set(["a", "b"]), new Set(["a", "b"]))).toBe(1);
    expect(jaccard(new Set(["a"]), new Set(["b"]))).toBe(0);
    expect(jaccard(new Set(["a", "b", "c"]), new Set(["a", "b", "d"]))).toBeCloseTo(0.5);
  });

  test("to helt ulike spørsmål kommer ikke over grensen på funksjonsord alene", () => {
    // FR-20s begrunnelse for stoppordlista: uten den deler slike spørsmål
    // mange småord og kan se like ut.
    const a = innholdsord("Hva er det som skjer med cellen når den deler seg?");
    const b = innholdsord("Hva er det som skjer med renten når banken låner ut?");
    expect(jaccard(a, b)).toBeLessThan(0.6);
  });
});

describe("innfortAvEleven — sporbarhet", () => {
  test("ord i svaret som ikke sto i spørsmålet", () => {
    const sporsmal = "Hvorfor blir maten varm i en mikrobølgeovn?";
    const svar = "Fordi vannmolekylene i maten rister når mikrobølgene treffer dem.";
    expect(innfortAvEleven(svar, sporsmal)).toEqual(new Set(["vannmolekylene", "rister", "mikrobølgene", "treffer"]));
  });

  test("«vet ikke» innfører ingenting", () => {
    expect(innfortAvEleven("Vet ikke", "Hva er mitose?").size).toBe(0);
  });
});

describe("sammeOrd — bøyning i sporbarhetssjekken", () => {
  test("vanlige endelser regnes som samme ord", () => {
    expect(sammeOrd("bevegelse", "bevegelsen")).toBe(true);
    expect(sammeOrd("konto", "kontoen")).toBe(true);
    expect(sammeOrd("renter", "rentene")).toBe(false); // «renter» + «e» er ikke en endelse på «renter»
    expect(sammeOrd("rente", "rentene")).toBe(true);
  });

  test("sammensatte ord og korte ord regnes ikke som samme", () => {
    expect(sammeOrd("lån", "lånet")).toBe(false); // for kort til å skille trygt
    expect(sammeOrd("konto", "kontoutskrift")).toBe(false);
  });

  test("brukerNoenAv finner ordet i bøyd form", () => {
    expect(brukerNoenAv("Hva sier teksten om bevegelsen du nevner?", new Set(["bevegelse"]))).toBe(true);
  });
});
