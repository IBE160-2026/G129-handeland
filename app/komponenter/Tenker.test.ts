/**
 * Tenkeindikatoren og ordmerket, slik serveren tegner dem (EXPERIENCE.md,
 * Accessibility Floor).
 *
 * - Statusregionen finnes i den serverrendrede siden og er tom, også når
 *   indikatoren er aktiv: teksten skrives inn først etter montering, så
 *   skjermleseren får med seg at den kommer.
 * - Merket er pynt (`aria-hidden`).
 * - Ordmerket har navnet «LeseBuddy, forsiden», og delene er skjult.
 */

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Ordmerke } from "./Ordmerke";
import { Tenker } from "./Tenker";

const STATUS = "Buddy lager quizen din …";

function region(html: string): string | null {
  const m = html.match(/<div role="status" aria-live="polite"[^>]*>(.*?)<\/div>/);
  return m ? m[1] : null;
}

describe("Tenker", () => {
  test("ikke aktiv: en tom statusregion og ikke noe merke", () => {
    const html = renderToStaticMarkup(createElement(Tenker, { aktiv: false, status: STATUS }));
    expect(region(html)).toBe("");
    expect(html).not.toContain("<svg");
  });

  test("aktiv: statusregionen er tom før montering, merket er aria-hidden", () => {
    const html = renderToStaticMarkup(createElement(Tenker, { aktiv: true, status: STATUS }));
    expect(region(html)).toBe("");
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
    expect(html).toMatch(/<svg[^>]*class="merke tenker/);
    // Den synlige teksten står med en gang, men utenfor regionen og skjult for skjermlesere.
    expect(html).toMatch(new RegExp(`<div aria-hidden="true"[^>]*><p class="font-bold">${STATUS}</p>`));
  });

  test("bareAvslutning: ingenting synlig mens det ventes, men regionen finnes", () => {
    const html = renderToStaticMarkup(createElement(Tenker, { aktiv: true, status: STATUS, bareAvslutning: true }));
    expect(region(html)).toBe("");
    expect(html).not.toContain("<svg");
    expect(html).not.toContain(STATUS);
  });
});

describe("Ordmerke", () => {
  test("lenke til forsiden med navnet «LeseBuddy, forsiden», delene skjult", () => {
    const html = renderToStaticMarkup(createElement(Ordmerke));
    expect(html).toMatch(/^<a [^>]*href="\/"/);
    expect(html).not.toContain("aria-label");
    // Navnet kommer fra den skjulte teksten; alt annet i lenken er aria-hidden.
    const uten = html.replace(/<span aria-hidden="true".*?<\/span><\/span>/, "");
    expect(uten.replace(/<[^>]+>/g, "")).toBe("LeseBuddy, forsiden");
    expect(html).toMatch(/<span aria-hidden="true"[^>]*><span[^>]*>lese<\/span><svg/);
  });
});
