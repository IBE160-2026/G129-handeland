/**
 * Tester for overskriftskontrollen — FR-3 fase 3a.
 */

import { describe, expect, test } from "vitest";
import { delIAvsnitt } from "./avsnittsdeling";
import { byttOverskrifter, overskriftsfeil, overskriftsplasser } from "./overskrifter";

const TEKST = "Celler\n\nAlle levende ting består av celler.\n\nMitose\n\nMitose er celledeling.\nDen skjer hele tiden.";
const brodtekst = (t: string) => delIAvsnitt(t).filter((a) => !a.erOverskrift).map((a) => a.innhold);

describe("FR-3 fase 3a", () => {
  test("bare overskriftene, med plassen sin", () => {
    expect(overskriftsplasser(TEKST)).toEqual([
      { nummer: 1, tekst: "Celler" },
      { nummer: 3, tekst: "Mitose" },
    ]);
  });

  test("rette: ny tekst på samme plass, brødteksten urørt", () => {
    const ut = byttOverskrifter(TEKST, new Map([[3, "Celledeling"]]));
    expect(overskriftsplasser(ut).map((o) => o.tekst)).toEqual(["Celler", "Celledeling"]);
    expect(brodtekst(ut)).toEqual(brodtekst(TEKST));
  });

  test("slette: tom tekst fjerner overskriften", () => {
    const ut = byttOverskrifter(TEKST, new Map([[1, ""]]));
    expect(overskriftsplasser(ut).map((o) => o.tekst)).toEqual(["Mitose"]);
    expect(brodtekst(ut)).toEqual(brodtekst(TEKST));
  });

  test("flytte: tekstene bytter plass, brødteksten blir stående", () => {
    const ut = byttOverskrifter(TEKST, new Map([[1, "Mitose"], [3, "Celler"]]));
    const a = delIAvsnitt(ut);
    expect(a.map((x) => x.innhold)).toEqual([
      "Mitose",
      "Alle levende ting består av celler.",
      "Celler",
      "Mitose er celledeling. Den skjer hele tiden.",
    ]);
  });

  test("legge til øverst", () => {
    const ut = byttOverskrifter(TEKST, new Map(), "Biologi 1");
    expect(overskriftsplasser(ut).map((o) => o.tekst)).toEqual(["Biologi 1", "Celler", "Mitose"]);
  });

  test("ingen endringer gir samme avsnitt", () => {
    expect(delIAvsnitt(byttOverskrifter(TEKST, new Map()))).toEqual(delIAvsnitt(TEKST));
  });

  test("en overskrift som ville blitt lest som brødtekst, avvises", () => {
    expect(overskriftsfeil("Celledeling")).toBeNull();
    expect(overskriftsfeil("Hva er mitose?")).toBeNull();
    expect(overskriftsfeil("Dette er en setning.")).toMatch(/punktum/);
    expect(overskriftsfeil("en to tre fire fem seks sju åtte ni ti elleve")).toMatch(/ti ord/);
  });
});
