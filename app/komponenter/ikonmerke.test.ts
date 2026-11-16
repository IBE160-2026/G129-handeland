/**
 * PNG-ikonene (app/icon1.tsx, app/apple-icon.tsx) tegner B-merket fra
 * ikonmerke.ts. Stiene der er kopiert fra app/icon.svg; denne testen holder
 * dem like, så de to ikonene ikke glir fra hverandre.
 */

import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { B_MERKE_DATA_URI, B_MERKE_SVG } from "./ikonmerke";

const stier = (svg: string) => [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);
const transformer = (svg: string) => [...svg.matchAll(/transform="([^"]+)"/g)].map((m) => m[1]);

describe("B-merket som PNG-ikon", () => {
  const ikonSvg = readFileSync("app/icon.svg", "utf8");

  test("de samme stiene, i samme rekkefølge, som app/icon.svg", () => {
    expect(stier(B_MERKE_SVG)).toEqual(stier(ikonSvg));
    expect(stier(B_MERKE_SVG)).toHaveLength(6);
  });

  test("de samme transformene og den samme flaten", () => {
    expect(transformer(B_MERKE_SVG)).toEqual(transformer(ikonSvg));
    expect(B_MERKE_SVG).toContain('viewBox="10 10 100 100"');
    expect(ikonSvg).toContain('viewBox="10 10 100 100"');
  });

  test("data-URI-en er SVG-en, kodet uten Buffer", () => {
    expect(decodeURIComponent(B_MERKE_DATA_URI.replace(/^data:image\/svg\+xml;charset=utf-8,/, ""))).toBe(B_MERKE_SVG);
  });
});
