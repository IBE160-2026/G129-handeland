/**
 * Tester for samsvarsmålene i samsvar.ts. Kjøres av `npm test`.
 */

import { describe, expect, test } from "vitest";
import { dagerMellom, ordformer, regnSamsvar, tolkDato } from "./samsvar";

const ord = (n: number, prefiks: string) => Array.from({ length: n }, (_, i) => `${prefiks}${i}`);

describe("hvorfor unionsmetoden ikke virker", () => {
  test("κ over unionen er aldri positiv, selv med godt samsvar", () => {
    // 8 felles, 1 ulikt hver vei: positivt samsvar 0,89 — men κ over
    // unionen er negativ. Dette er feilen i den første utgaven av
    // annotering.md, og grunnen til at sakssettet er alle ordformer.
    const felles = ord(8, "f");
    const r1 = [...felles, "bare1"];
    const r2 = [...felles, "bare2"];
    const union = new Set([...r1, ...r2]);
    const s = regnSamsvar(r1, r2, union);
    expect(s.ingen).toBe(0);
    expect(s.kappa).toBeLessThanOrEqual(0);
    expect(s.positivtSamsvar).toBeCloseTo(16 / 18);
  });

  test("telleren er −2·b·c for ethvert utfall uten nei-saker", () => {
    for (const [a, b, c] of [[5, 2, 3], [10, 1, 1], [1, 4, 4], [7, 0, 2]]) {
      const s = regnSamsvar(
        [...ord(a, "f"), ...ord(b, "x")],
        [...ord(a, "f"), ...ord(c, "y")],
        new Set(),
      );
      expect(s.kappa).toBeLessThanOrEqual(0);
    }
  });
});

describe("de to målene som brukes", () => {
  test("like runder gir 1 på begge", () => {
    const r = ord(6, "f");
    const s = regnSamsvar(r, r, new Set([...r, ...ord(200, "tekst")]));
    expect(s.positivtSamsvar).toBe(1);
    expect(s.kappa).toBeCloseTo(1);
  });

  test("helt ulike runder gir 0 i positivt samsvar og κ under null", () => {
    const s = regnSamsvar(ord(5, "a"), ord(5, "b"), new Set(ord(200, "tekst")));
    expect(s.positivtSamsvar).toBe(0);
    expect(s.kappa).toBeLessThan(0);
  });

  test("med mange ord ingen valgte, ligger κ tett på det positive samsvaret", () => {
    const felles = ord(8, "f");
    const s = regnSamsvar([...felles, "bare1"], [...felles, "bare2"], new Set(ord(600, "tekst")));
    expect(Math.abs(s.kappa - s.positivtSamsvar)).toBeLessThan(0.02);
  });

  test("sammenligningsregelen fra FR-8 gjelder: store bokstaver teller ikke, bøyning gjør", () => {
    const s = regnSamsvar(["Mitose", "cellen"], ["mitose", "celle"], new Set());
    expect(s.begge).toBe(1);
    expect(s.bareForste + s.bareAndre).toBe(2);
  });
});

describe("hjelperne", () => {
  test("ordformer: ulike, normaliserte, med bindestrek i ordet", () => {
    expect(ordformer("EM-bølger og em-bølger. Radio, radio!")).toEqual(new Set(["em-bølger", "og", "radio"]));
  });

  test("begge datoformatene i annoteringsfilene tolkes", () => {
    expect(tolkDato("13.10.2026")?.toISOString().slice(0, 10)).toBe("2026-10-13");
    expect(tolkDato("2026-10-13")?.toISOString().slice(0, 10)).toBe("2026-10-13");
    expect(tolkDato("i går")).toBeNull();
  });

  test("dager mellom rundene", () => {
    expect(dagerMellom(tolkDato("13.10.2026")!, tolkDato("20.10.2026")!)).toBe(7);
  });
});
