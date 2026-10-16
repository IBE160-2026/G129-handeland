/**
 * Tester for elementkontrollene i morsmålsgeneratorene — FR-26 og FR-27.
 * Modellen kalles ikke: kontrollene er rene funksjoner.
 */

import { describe, expect, test } from "vitest";
import { begrepElementer, oppsummeringElementer, overskriftElementer, utpekingElementer } from "../morsmaal/elementer";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import { MAKS_SETNINGER, kontrollerOppsummering, kontrollerUtpeking, utpekingstak, type Utpekt } from "./morsmaal";

const AVSNITT = delIAvsnitt(
  [
    "Maktfordeling",
    "Statsmaktene er tredelt. Det er en forutsetning for demokratiet.",
    "Stortinget vedtar lovene, og regjeringen setter dem i verk.",
  ].join("\n\n"),
);

const u = (uttrykk: string, kategori: Utpekt["kategori"], kildeavsnitt = 2): Utpekt => ({
  uttrykk,
  kategori,
  forklaring: "Forklaring.",
  kildeavsnitt,
});

describe("FR-26 — oppsummeringen", () => {
  test("setninger med gyldig kildeavsnitt beholdes", () => {
    const r = kontrollerOppsummering([{ tekst: "Makten er delt.", kildeavsnitt: 2 }], AVSNITT);
    expect(r.setninger).toHaveLength(1);
    expect(r.forkastet).toEqual([]);
  });

  test("en overskrift er aldri kildeavsnitt", () => {
    const r = kontrollerOppsummering([{ tekst: "Om maktfordeling.", kildeavsnitt: 1 }], AVSNITT);
    expect(r.setninger).toEqual([]);
    expect(r.forkastet[0].grunn).toMatch(/brødtekst/);
  });

  test("et avsnitt som ikke finnes forkastes", () => {
    expect(kontrollerOppsummering([{ tekst: "X.", kildeavsnitt: 9 }], AVSNITT).setninger).toEqual([]);
  });

  test("høyst fem setninger — resten forkastes og rapporteres", () => {
    const seks = Array.from({ length: 6 }, (_, i) => ({ tekst: `Setning ${i}.`, kildeavsnitt: 3 }));
    const r = kontrollerOppsummering(seks, AVSNITT);
    expect(r.setninger).toHaveLength(MAKS_SETNINGER);
    expect(r.forkastet).toEqual([{ tekst: "Setning 5.", grunn: "over fem setninger" }]);
  });
});

describe("FR-27 — utpekingen", () => {
  test("ordrette uttrykk i riktig avsnitt beholdes", () => {
    const r = kontrollerUtpeking([u("er tredelt", "spraklig_bilde"), u("forutsetning", "akademisk")], AVSNITT, []);
    expect(r.uttrykk.map((x) => x.uttrykk)).toEqual(["er tredelt", "forutsetning"]);
  });

  test("ikke ordrett, feil avsnitt, dublett og Faguttrykk forkastes med grunn", () => {
    const r = kontrollerUtpeking(
      [
        u("forutsetninger", "akademisk"),
        u("forutsetning", "akademisk", 3),
        u("forutsetning", "akademisk"),
        u("Forutsetning", "akademisk"),
        u("Stortinget vedtar", "spraklig_bilde", 3),
      ],
      AVSNITT,
      ["Stortinget"],
    );
    expect(r.uttrykk.map((x) => x.uttrykk)).toEqual(["forutsetning"]);
    expect(r.forkastet.map((f) => f.grunn)).toEqual([
      "står ikke ordrett i teksten",
      "står ikke i kildeavsnittet",
      "dublett",
      "er et Faguttrykk",
    ]);
  });

  test("taket: høyst åtte per 1 000 ord per kategori, minst ett", () => {
    expect(utpekingstak(AVSNITT)).toBe(1);
    const r = kontrollerUtpeking([u("forutsetning", "akademisk"), u("demokratiet", "akademisk")], AVSNITT, []);
    expect(r.uttrykk).toHaveLength(1);
    expect(r.forkastet[0].grunn).toBe("over taket i FR-27");
  });

  test("taket gjelder hver kategori for seg", () => {
    const r = kontrollerUtpeking([u("forutsetning", "akademisk"), u("er tredelt", "spraklig_bilde")], AVSNITT, []);
    expect(r.uttrykk).toHaveLength(2);
  });
});

describe("hva som oversettes (FR-24)", () => {
  test("bare overskriftene fra aktiveringen", () => {
    expect(overskriftElementer(AVSNITT)).toEqual([{ id: "o1", type: "overskrift", tekst: "Maktfordeling" }]);
  });

  test("uttrykk og forklaring for hvert Faguttrykk", () => {
    expect(begrepElementer([{ id: "b", uttrykk: "Stortinget", forklaring: "Nasjonalforsamlingen." }]).map((e) => e.id)).toEqual([
      "u:b",
      "f:b",
    ]);
  });

  test("et språklig bilde oversettes ikke ord for ord — bare forklaringen", () => {
    const el = utpekingElementer([u("er tredelt", "spraklig_bilde")]);
    expect(el).toEqual([{ id: "f0", type: "forklaring", tekst: "Forklaring." }]);
  });

  test("oppsummeringen setning for setning", () => {
    expect(oppsummeringElementer([{ tekst: "A.", kildeavsnitt: 2 }])).toEqual([{ id: "s0", type: "setning", tekst: "A." }]);
  });
});
