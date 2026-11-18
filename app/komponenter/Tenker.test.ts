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
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { adresseUtenFeil, feilIAdressen } from "../feiladresse";
import { Ordmerke } from "./Ordmerke";
import {
  abonnerAvslutning,
  avslutningFerdig,
  giAvslutningVidere,
  hentAvslutning,
  klikkForlater,
  lagOverlevering,
  Tenker,
  TenkerVert,
} from "./Tenker";

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

/*
 * Overleveringen (17.11): en indikator som forsvinner mens den venter, gir
 * avslutningen videre til verten i rotlayouten. Ren logikk, uten React.
 */
describe("Tenker, overleveringen til verten", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    const a = hentAvslutning();
    if (a) avslutningFerdig(a.id);
    vi.useRealTimers();
  });

  const SISTE = {
    aktiv: true,
    ferdigStatus: "Teksten er klar.",
    form: "flate",
    bareAvslutning: false,
    kjentSvar: false,
    forlatt: false,
  } as const;

  test("feil i adressen: «feil» og «fagordfeil» stopper avslutningen, andre parametre gjør det ikke", () => {
    expect(feilIAdressen("?feil=vurdering&kode=x")).toBe(true);
    expect(feilIAdressen("?fagordfeil=ukjent")).toBe(true);
    expect(feilIAdressen("")).toBe(false);
    expect(feilIAdressen("?sok=mitose")).toBe(false);
    expect(feilIAdressen("?kode=x")).toBe(false);
  });

  test("retry-stedene: samme sti uten feilparametrene, de andre står", () => {
    expect(adresseUtenFeil("/tekst/1/lesing", "?fagordfeil=tidsavbrudd")).toBe("/tekst/1/lesing");
    expect(adresseUtenFeil("/tekst/1/samtale/2", "?feil=vurdering&kode=429")).toBe("/tekst/1/samtale/2");
    expect(adresseUtenFeil("/tekst/1/samtale/2", "?feil=oppfolging&vis=alt")).toBe("/tekst/1/samtale/2?vis=alt");
    expect(adresseUtenFeil("/x", "?feil=a&fagordfeil=b&kode=c")).toBe("/x");
  });

  test("gitt videre: verten får statusen etter tegningen, og lytterne varsles", () => {
    const lytter = vi.fn();
    const slutt = abonnerAvslutning(lytter);
    giAvslutningVidere("Teksten er klar.", { sok: () => "" });
    expect(hentAvslutning()).toBeNull();
    vi.runAllTimers();
    expect(hentAvslutning()?.status).toBe("Teksten er klar.");
    expect(lytter).toHaveBeenCalledTimes(1);
    slutt();
  });

  test("«tilbake» mens det ventet: tidsbryteren ser det, og ingen avslutning", () => {
    giAvslutningVidere("Teksten er klar.", { sok: () => "", gikkTilbake: () => true });
    vi.runAllTimers();
    expect(hentAvslutning()).toBeNull();
  });

  test("serverskjema: siden eleven havner på har en feil i adressen, ingen avslutning", () => {
    giAvslutningVidere("Teksten er klar.", { sok: () => "?fagordfeil=tidsavbrudd" });
    giAvslutningVidere("Buddy har lest svaret ditt.", { sok: () => "?feil=vurdering" });
    vi.runAllTimers();
    expect(hentAvslutning()).toBeNull();
  });

  test("kjent svar: adressen sjekkes ikke, fordi stedet selv vet at kallet lyktes", () => {
    giAvslutningVidere("Neste spørsmål er klart.", { sjekkAdressen: false, sok: () => "?feil=oppfolging" });
    vi.runAllTimers();
    expect(hentAvslutning()?.status).toBe("Neste spørsmål er klart.");
  });

  test("lagOverlevering: serverskjemaet ber om adressesjekk, et sted med kjent svar gjør det ikke", () => {
    const gi = vi.fn<(status: string, sjekkAdressen: boolean, gikkTilbake?: () => boolean) => () => void>(() => () => {});
    const o = lagOverlevering(gi);
    o.gaar(SISTE);
    o.gaar({ ...SISTE, ferdigStatus: "Quizen er klar.", kjentSvar: true });
    expect(gi).toHaveBeenNthCalledWith(1, "Teksten er klar.", true, undefined);
    expect(gi).toHaveBeenNthCalledWith(2, "Quizen er klar.", false, undefined);
  });

  test("avslutningFerdig fjerner bare den avslutningen verten spilte, ikke en nyere", () => {
    giAvslutningVidere("Quizen er klar.", { sok: () => "" });
    vi.runAllTimers();
    const gammel = hentAvslutning()!;
    giAvslutningVidere("Verset er klart.", { sok: () => "" });
    vi.runAllTimers();
    const ny = hentAvslutning()!;
    expect(ny.id).not.toBe(gammel.id);
    avslutningFerdig(gammel.id);
    expect(hentAvslutning()).toBe(ny);
    avslutningFerdig(ny.id);
    expect(hentAvslutning()).toBeNull();
  });

  test("komponenten går mens den venter, med ferdigStatus: avslutningen gis videre", () => {
    const gi = vi.fn(() => () => {});
    const o = lagOverlevering(gi);
    o.montert();
    o.gaar(SISTE);
    expect(gi).toHaveBeenCalledWith("Teksten er klar.", true, undefined);
  });

  test("StrictMode: montert, gått og montert igjen gir ingen avslutning", () => {
    const o = lagOverlevering((status, sjekkAdressen) => giAvslutningVidere(status, { sjekkAdressen, sok: () => "" }));
    o.montert();
    o.gaar(SISTE);
    o.montert();
    vi.runAllTimers();
    expect(hentAvslutning()).toBeNull();
  });

  test("ingen overlevering: ikke aktiv (feil, komponenten står), uten ferdigStatus, linjeformen og bareAvslutning", () => {
    const gi = vi.fn(() => () => {});
    const o = lagOverlevering(gi);
    o.gaar({ ...SISTE, aktiv: false });
    o.gaar({ ...SISTE, ferdigStatus: undefined });
    o.gaar({ ...SISTE, form: "linje" });
    o.gaar({ ...SISTE, bareAvslutning: true });
    expect(gi).not.toHaveBeenCalled();
    o.gaar({ ...SISTE, form: "knapp" });
    expect(gi).toHaveBeenCalledTimes(1);
  });

  test("forlat-vernet: eleven gikk selv fra siden mens det ventet, ingen overlevering", () => {
    const gi = vi.fn(() => () => {});
    const o = lagOverlevering(gi);
    o.montert();
    o.gaar({ ...SISTE, forlatt: true });
    o.gaar({ ...SISTE, form: "knapp", kjentSvar: true, forlatt: true });
    expect(gi).not.toHaveBeenCalled();
  });

  test("forlat-vernet: et vanlig klikk på en lenke forlater siden, nye faner og ankre gjør det ikke", () => {
    const HER = "https://lesevenn.test/tekst/1/aktivering";
    const vanlig = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };
    const lenke = (href: string, target = "", download = false) => ({ href, target, download });
    expect(klikkForlater(vanlig, lenke("/samling"), HER)).toBe(true);
    expect(klikkForlater(vanlig, lenke("/tekst/1/aktivering"), HER)).toBe(true);
    expect(klikkForlater(vanlig, lenke("/samling", "_self"), HER)).toBe(true);
    expect(klikkForlater(vanlig, null, HER)).toBe(false);
    expect(klikkForlater(vanlig, lenke("#innhold"), HER)).toBe(false);
    expect(klikkForlater(vanlig, lenke("#"), HER)).toBe(false);
    expect(klikkForlater(vanlig, lenke("mailto:laerer@skole.no"), HER)).toBe(false);
    expect(klikkForlater(vanlig, lenke("/samling", "_blank"), HER)).toBe(false);
    expect(klikkForlater(vanlig, lenke("/fil.txt", "", true), HER)).toBe(false);
    expect(klikkForlater({ ...vanlig, ctrlKey: true }, lenke("/samling"), HER)).toBe(false);
    expect(klikkForlater({ ...vanlig, metaKey: true }, lenke("/samling"), HER)).toBe(false);
    expect(klikkForlater({ ...vanlig, button: 1 }, lenke("/samling"), HER)).toBe(false);
  });

  test("verten: én tom statusregion fra første tegning, og ikke noe merke", () => {
    const html = renderToStaticMarkup(createElement(TenkerVert));
    expect(html).toBe('<div class="contents"><div role="status" aria-live="polite" class="sr-only"></div></div>');
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
