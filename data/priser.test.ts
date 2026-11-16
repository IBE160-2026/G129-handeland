/**
 * Tester for prisene — PRD §6.4. Rene funksjoner, ingen database.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, test, vi } from "vitest";
import { KRONER_PER_DOLLAR, PRISER, UkjentModell, kostnadMikrodollar, tilKroner } from "./priser";

describe("kostnaden per kall", () => {
  test("Haiku 5.5: $0,10 inn og $0,50 ut per million tokens", () => {
    // 1 000 000 inn = $0,10 = 100 000 mikrodollar; 1 000 000 ut = $0,50.
    expect(kostnadMikrodollar("claude-haiku-5-5", 1_000_000, 0)).toBe(100_000);
    expect(kostnadMikrodollar("claude-haiku-5-5", 0, 1_000_000)).toBe(500_000);
  });

  test("Sonnet 5.5: $2 inn og $10 ut per million tokens", () => {
    expect(kostnadMikrodollar("claude-sonnet-5-5", 1_000_000, 1_000_000)).toBe(12_000_000);
    expect(kostnadMikrodollar("claude-sonnet-5-5", 1000, 500)).toBe(2000 + 5000);
  });

  test("skriving til hurtigbufferen koster dobbel inn-pris", () => {
    // 1 000 inn, hvorav 400 skrevet til bufferen: 600 × 2 + 400 × 2 × 2 = 2 800.
    expect(kostnadMikrodollar("claude-sonnet-5-5", 1000, 0, 400)).toBe(2800);
    expect(kostnadMikrodollar("claude-sonnet-5-5", 1000, 0)).toBe(2000);
  });

  test("brøkdeler rundes opp, så summen aldri blir for lav", () => {
    // 3 tokens inn på Haiku er 0,3 mikrodollar.
    expect(kostnadMikrodollar("claude-haiku-5-5", 3, 0)).toBe(1);
    expect(kostnadMikrodollar("claude-haiku-5-5", 0, 0)).toBe(0);
  });

  test("kursen er 10,5 kroner per dollar", () => {
    expect(KRONER_PER_DOLLAR).toBe(10.5);
    expect(tilKroner(1_000_000)).toBeCloseTo(10.5);
    // Dagstaket: 30 kr er om lag $2,86.
    expect(tilKroner(2_857_143)).toBeGreaterThanOrEqual(30);
  });
});

describe("ukjent modell", () => {
  test("gir en tydelig feil i testene", () => {
    expect(() => kostnadMikrodollar("claude-ukjent-9", 10, 10)).toThrow(UkjentModell);
    expect(() => kostnadMikrodollar("claude-ukjent-9", 10, 10)).toThrow(/data\/priser\.ts/);
  });

  test("regnes til Sonnet-pris i drift", () => {
    const foer = process.env.VITEST;
    delete process.env.VITEST;
    const advarsel = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(kostnadMikrodollar("claude-ukjent-9", 1000, 1000)).toBe(kostnadMikrodollar("claude-sonnet-5-5", 1000, 1000));
      expect(advarsel).toHaveBeenCalledOnce();
    } finally {
      process.env.VITEST = foer;
      advarsel.mockRestore();
    }
  });

  test("hver modell i manifestet har en pris", async () => {
    // AD-14: en ny modell forfremmes i manifestet. Uten pris ville taket
    // regnet den til Sonnet-pris uten at noen visste det.
    const manifest = JSON.parse(await readFile(path.join(process.cwd(), "prompts", "gjeldende.json"), "utf8")) as {
      oppgaver: Record<string, { modell: string }>;
    };
    for (const [oppgave, o] of Object.entries(manifest.oppgaver)) {
      expect(PRISER[o.modell], `${oppgave}: ${o.modell}`).toBeDefined();
    }
  });
});
