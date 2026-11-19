/**
 * Tusj (design runde 2, bolk 10): hvordan navnet deles i ord med strøk.
 */

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Tusj } from "./Tusj";

const tegn = (tekst: string) => renderToStaticMarkup(createElement(Tusj, null, tekst));
const ordMedStrok = (html: string) => [...html.matchAll(/<span class="tusj"[^>]*>([^<]*)<svg/g)].map((m) => m[1]);

describe("Tusj", () => {
  test("hvert ord får sitt strøk, løse tegn får det ikke", () => {
    const html = tegn("Fysikk 1 – kapittel 4");
    expect(ordMedStrok(html)).toEqual(["Fysikk", "1", "kapittel", "4"]);
    expect(html).toContain(" – ");
  });

  test("et hardt mellomrom holder ordene sammen under ett strøk", () => {
    expect(ordMedStrok(tegn("Kap. 4 Bølger"))).toEqual(["Kap. 4", "Bølger"]);
  });

  test("forsinkelsen har et tak, så siste ord i et langt navn ikke venter lenge", () => {
    const html = tegn("en to tre fire fem seks sju åtte");
    const nr = [...html.matchAll(/--tusj-nr:(\d+)/g)].map((m) => Number(m[1]));
    expect(Math.max(...nr)).toBe(4);
  });

  test("teksten leses som før: strøkene er skjult for skjermlesere", () => {
    const html = tegn("EM-bølger");
    expect(html).toContain('aria-hidden="true"');
    expect(html.replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, "")).toBe("EM-bølger");
  });
});
