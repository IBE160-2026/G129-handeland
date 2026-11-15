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

/*
 * Bolk 5: tre former. Statusregionen finnes tom før ventingen i alle, det er
 * bare én region per indikator, og merket er pynt.
 */
const antallRegioner = (html: string) => html.match(/role="status"/g)?.length ?? 0;

describe("Tenker, formene", () => {
  const MINI = /<svg viewBox="0 35 120 51" class="merke mini tenker[^>]*style="height:var\(--tenker-merke\);width:auto"[^>]*aria-hidden="true"/;

  test("flate: det store merket (64 px fra 760 px) og mini-merket (pillen), begge skjult for skjermlesere", () => {
    const html = renderToStaticMarkup(createElement(Tenker, { form: "flate", aktiv: true, status: STATUS }));
    expect(region(html)).toBe("");
    expect(antallRegioner(html)).toBe(1);
    expect(html).toMatch(/<div class="tenker-flate /);
    expect(html).toMatch(/<svg viewBox="-4 -4 128 128" class="merke tenker[^>]*style="height:var\(--tenker-merke\);width:var\(--tenker-merke\)"[^>]*aria-hidden="true"/);
    expect(html).toMatch(MINI);
    expect(html).toContain('<g class="krymp">');
  });

  test("linje: mini-Buddy foran statusen, regionen tom før montering", () => {
    const tom = renderToStaticMarkup(createElement(Tenker, { form: "linje", aktiv: false, status: STATUS }));
    expect(region(tom)).toBe("");
    expect(tom).not.toContain("<svg");

    const html = renderToStaticMarkup(createElement(Tenker, { form: "linje", aktiv: true, status: STATUS }));
    expect(region(html)).toBe("");
    expect(antallRegioner(html)).toBe(1);
    expect(html).toMatch(/<div class="tenker-linje /);
    expect(html.match(/<svg/g)).toHaveLength(1);
    expect(html).toMatch(MINI);
    expect(html).toMatch(new RegExp(`<div aria-hidden="true"[^>]*><p class="font-bold">${STATUS}</p>`));
  });

  test("knapp, ikke aktiv: vanlig knappetekst, ikke låst, ikke noe merke, tom region", () => {
    const html = renderToStaticMarkup(
      createElement(Tenker, { form: "knapp", aktiv: false, status: STATUS, className: "k" }, "Svar"),
    );
    expect(html).toMatch(/^<button type="button" class="tenker-knapp [^"]*k">Svar<\/button>/);
    expect(html).not.toContain("disabled");
    expect(html).not.toContain("<svg");
    expect(region(html)).toBe("");
    expect(antallRegioner(html)).toBe(1);
  });

  test("knapp, aktiv: låst med aria-disabled (fokus blir på knappen), mini-Buddy og statusen som knappetekst", () => {
    const html = renderToStaticMarkup(
      createElement(Tenker, { form: "knapp", type: "submit", aktiv: true, status: STATUS, className: "k" }, "Svar"),
    );
    expect(html).toMatch(/^<button type="submit" aria-disabled="true" class="tenker-knapp /);
    expect(html).not.toMatch(/ disabled=/);
    expect(html).toMatch(MINI);
    expect(html).toMatch(new RegExp(`</svg><span>${STATUS}</span></button>`));
    expect(html).not.toContain(">Svar<");
    // Regionen ligger utenfor knappen, er bare for skjermlesere, og er tom til etter montering.
    expect(html).toMatch(/<\/button><div role="status" aria-live="polite" class="sr-only"><\/div>$/);
    expect(antallRegioner(html)).toBe(1);
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
