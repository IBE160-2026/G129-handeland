/**
 * Tester for de rene funksjonene i PDF-uttrekket — FR-1, FR-2.
 */

import { describe, expect, test } from "vitest";
import {
  GRENSER,
  byggTekst,
  fjernToppOgBunntekst,
  kuttVedTak,
  linjerPaaSide,
  muligTabellEllerFormel,
  skjoet,
  vurderMengde,
  type Linje,
} from "./pdf-tekst";

const L = (tekst: string, y: number, h = 11): Linje => ({ tekst, y, h });

describe("linjer", () => {
  test("biter på samme høyde blir én linje, sortert fra venstre", () => {
    const l = linjerPaaSide([
      { str: "verden", x: 100, y: 700, h: 11 },
      { str: "Hei", x: 50, y: 700.5, h: 11 },
      { str: "Neste linje", x: 50, y: 686, h: 11 },
    ]);
    expect(l.map((x) => x.tekst)).toEqual(["Hei verden", "Neste linje"]);
  });
});

describe("orddeling — FR-2", () => {
  test("liten + liten slås sammen", () => {
    expect(skjoet("informa-", "sjon som")).toEqual({ tekst: "informasjon som", slaattSammen: true });
  });
  test("stor bokstav eller siffer beholder bindestreken", () => {
    expect(skjoet("KI-", "assistert").tekst).toBe("KI-assistert");
    expect(skjoet("en 20-", "åring").tekst).toBe("en 20-åring");
    expect(skjoet("e-", "Post").tekst).toBe("e-Post");
  });
  test("vanlig linjeskift blir mellomrom", () => {
    expect(skjoet("første", "andre").tekst).toBe("første andre");
  });
});

describe("topp- og bunntekst — FR-2", () => {
  const side = (n: number) => [
    L("Naturfag — kapittel 4", 810, 9),
    L(`Første linje på side ${n} med vanlig tekst.`, 760),
    L(`Innhold ${n}`, 700),
    L(`Siste linje på side ${n} med vanlig tekst.`, 640),
    L(`Side ${n}`, 30, 9),
  ];

  test("linjer på mer enn halvparten av sidene fjernes, sidetall regnes som like", () => {
    const { sider, fjernet } = fjernToppOgBunntekst([side(1), side(2), side(3)]);
    expect(fjernet).toContain("Naturfag — kapittel 4");
    expect(fjernet).toContain("Side 2");
    expect(sider[0].map((l) => l.tekst)).not.toContain("Side 1");
  });

  test("linjer midt på siden fjernes aldri, selv om de bare skiller seg på et tall", () => {
    const { sider } = fjernToppOgBunntekst([side(1), side(2), side(3)]);
    expect(sider.map((s) => s.some((l) => l.tekst.startsWith("Innhold")))).toEqual([true, true, true]);
  });
  test("én side: ingenting fjernes", () => {
    expect(fjernToppOgBunntekst([[L("Overskrift", 800)]]).fjernet).toEqual([]);
  });
});

describe("avsnitt", () => {
  test("stort mellomrom og skriftskifte gir nytt avsnitt, orddeling slås sammen", () => {
    const { tekst, sammenslaatte } = byggTekst([
      [L("Celledeling", 760, 16), L("Cellen kopierer informa-", 730), L("sjon før den deler seg.", 716), L("Nytt avsnitt her.", 680)],
    ]);
    expect(tekst).toBe("Celledeling\n\nCellen kopierer informasjon før den deler seg.\n\nNytt avsnitt her.");
    expect(sammenslaatte).toBe(1);
  });
});

describe("PF-1 og PF-6", () => {
  test("under 100 tegn per side i snitt er PF-1", () => {
    expect(vurderMengde([10, 0, 30])).toBe("PF-1");
  });
  test("over 100 per side, men under 400 totalt, er PF-6", () => {
    expect(vurderMengde([120, 120, 120])).toBe("PF-6");
  });
  test("nok tekst er i orden", () => {
    expect(vurderMengde([900, 900])).toBeNull();
  });
});

describe("tabell eller formel — FR-3", () => {
  test("formeltegn eller talllinjer gir advarsel", () => {
    expect(muligTabellEllerFormel("E = m × c^2 og a = b")).toBe(true);
    expect(muligTabellEllerFormel("2019 4,2 3,1\n2020 4,5 3,3\n2021 4,8 3,6")).toBe(true);
  });
  test("vanlig tekst gir ingen", () => {
    expect(muligTabellEllerFormel("Celler deler seg for at kroppen skal vokse.")).toBe(false);
  });
});

describe("taket på 8 000 tegn — FR-1", () => {
  test("kort tekst kuttes ikke", () => {
    expect(kuttVedTak("kort").kuttet).toBe(false);
  });
  test("kuttes ved siste avsnittsgrense før taket, aldri midt i et ord", () => {
    const avsnitt = "Dette er et avsnitt med noen ord. ".repeat(40).trim(); // ~1360 tegn
    const tekst = Array.from({ length: 8 }, () => avsnitt).join("\n\n");
    const k = kuttVedTak(tekst);
    expect(k.kuttet).toBe(true);
    expect(k.tekst.length).toBeLessThanOrEqual(GRENSER.maksTegn);
    expect(k.tekst.endsWith("ord.")).toBe(true);
    expect(k.restTegn).toBe(tekst.length - k.tekst.length);
  });
  test("uten avsnittsgrenser kuttes det ved setningsslutt", () => {
    const tekst = "En setning her. ".repeat(700);
    const k = kuttVedTak(tekst);
    expect(k.tekst.endsWith(".")).toBe(true);
  });
});
