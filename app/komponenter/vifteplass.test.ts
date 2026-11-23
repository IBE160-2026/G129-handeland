/**
 * Tester for plasseringen av kortene i viften — kortene dekker aldri bunken
 * eller hverandre, og uten plass faller viften tilbake til rutenettet.
 */

import { describe, expect, test } from "vitest";
import { plasserRundt } from "./vifteplass";

const SENTER = { b: 240, h: 168 };
const KORT = Array.from({ length: 5 }, () => ({ b: 168, h: 118 }));
const LUFT = 24;

function overlapper(a: { x: number; y: number; b: number; h: number }, b: { x: number; y: number; b: number; h: number }) {
  return Math.abs(a.x - b.x) < (a.b + b.b) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2;
}

describe("viften rundt bunken", () => {
  test("på en bred skjerm får fem kort plass, uten å dekke bunken eller hverandre", () => {
    const p = plasserRundt(1040, SENTER, KORT, LUFT);
    expect(p).not.toBeNull();
    const flater = [{ ...p!.senter, ...SENTER }, ...p!.kort.map((k, i) => ({ ...k, ...KORT[i] }))];
    for (let i = 0; i < flater.length; i++)
      for (let j = i + 1; j < flater.length; j++) expect(overlapper(flater[i], flater[j]), `${i} og ${j}`).toBe(false);
  });

  test("alt ligger innenfor flaten, og høyden er nok", () => {
    const bredde = 1040;
    const p = plasserRundt(bredde, SENTER, KORT, LUFT)!;
    for (const [i, k] of p.kort.entries()) {
      expect(k.x - KORT[i].b / 2).toBeGreaterThanOrEqual(0);
      expect(k.x + KORT[i].b / 2).toBeLessThanOrEqual(bredde);
      expect(k.y - KORT[i].h / 2).toBeGreaterThanOrEqual(0);
      expect(k.y + KORT[i].h / 2).toBeLessThanOrEqual(p.hoeyde);
    }
  });

  test("høye kort (stor tekst eller lang status) skyver kortene lenger ut, men dekker fortsatt ikke", () => {
    const hoeye = KORT.map((k, i) => (i === 2 ? { b: 168, h: 260 } : k));
    const p = plasserRundt(1200, SENTER, hoeye, LUFT);
    expect(p).not.toBeNull();
    const flater = [{ ...p!.senter, ...SENTER }, ...p!.kort.map((k, i) => ({ ...k, ...hoeye[i] }))];
    for (let i = 0; i < flater.length; i++)
      for (let j = i + 1; j < flater.length; j++) expect(overlapper(flater[i], flater[j])).toBe(false);
  });

  test("minst `luft` mellom alle flatene, og til kanten av flaten", () => {
    const bredde = 1040;
    const p = plasserRundt(bredde, SENTER, KORT, LUFT)!;
    const flater = [{ ...p.senter, ...SENTER }, ...p.kort.map((k, i) => ({ ...k, ...KORT[i] }))];
    for (let i = 0; i < flater.length; i++) {
      for (let j = i + 1; j < flater.length; j++) {
        const [f, g] = [flater[i], flater[j]];
        // Avstanden mellom to rektangler er størst av gapet vannrett og loddrett.
        const vannrett = Math.abs(f.x - g.x) - (f.b + g.b) / 2;
        const loddrett = Math.abs(f.y - g.y) - (f.h + g.h) / 2;
        expect(Math.max(vannrett, loddrett), `${i} og ${j}`).toBeGreaterThanOrEqual(LUFT - 0.001);
      }
      const f = flater[i];
      expect(f.x - f.b / 2).toBeGreaterThanOrEqual(LUFT - 0.001);
      expect(bredde - (f.x + f.b / 2)).toBeGreaterThanOrEqual(LUFT - 0.001);
      expect(f.y - f.h / 2).toBeGreaterThanOrEqual(LUFT - 0.001);
      expect(p.hoeyde - (f.y + f.h / 2)).toBeGreaterThanOrEqual(LUFT - 0.001);
    }
  });

  test("0 kort, eller flere enn 10, gir null", () => {
    expect(plasserRundt(1040, SENTER, [], LUFT)).toBeNull();
    expect(plasserRundt(1600, SENTER, Array.from({ length: 11 }, () => KORT[0]), LUFT)).toBeNull();
  });

  test("fem kort ligger der de alltid har ligget: øverst, så med klokka", () => {
    const p = plasserRundt(1040, SENTER, KORT, LUFT)!;
    const [topp, oppeH, nedeH, nedeV, oppeV] = p.kort;
    expect(Math.abs(topp.x - p.senter.x)).toBeLessThan(0.001);
    expect(topp.y).toBeLessThan(p.senter.y);
    expect(oppeH.x).toBeGreaterThan(p.senter.x);
    expect(nedeH.x).toBeGreaterThan(p.senter.x);
    expect(nedeH.y).toBeGreaterThan(p.senter.y);
    expect(nedeV.x).toBeLessThan(p.senter.x);
    expect(oppeV.x).toBeLessThan(p.senter.x);
    expect(oppeV.y).toBeLessThan(p.senter.y);
  });

  // Runde 3, bolk 5: en Mappe har opptil 8 Tekster og 2 samlede kort.
  for (const antall of [3, 7, 10]) {
    test(`en mappe med ${antall} kort: ingen dekker bunken eller hverandre, eller null`, () => {
      const kort = Array.from({ length: antall }, () => ({ b: 168, h: 118 }));
      const p = plasserRundt(1600, SENTER, kort, LUFT);
      if (antall <= 7) expect(p).not.toBeNull();
      if (!p) return;
      expect(p.kort).toHaveLength(antall);
      const flater = [{ ...p.senter, ...SENTER }, ...p.kort.map((k, i) => ({ ...k, ...kort[i] }))];
      for (let i = 0; i < flater.length; i++)
        for (let j = i + 1; j < flater.length; j++) expect(overlapper(flater[i], flater[j]), `${i} og ${j}`).toBe(false);
    });
  }

  test("uten plass i bredden gir den null, og viften blir et rutenett", () => {
    expect(plasserRundt(600, SENTER, KORT, LUFT)).toBeNull();
    // 200 % tekst: alt er dobbelt så stort.
    const dobbel = (m: { b: number; h: number }) => ({ b: m.b * 2, h: m.h * 2 });
    expect(plasserRundt(1040, dobbel(SENTER), KORT.map(dobbel), LUFT * 2)).toBeNull();
  });
});
