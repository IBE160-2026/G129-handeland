/**
 * Feilmelding — EXPERIENCE.md (Component Patterns): `role="alert"`, og «Prøv
 * igjen» inne i meldingen når det finnes en vei videre. Fokusflyttingen er en
 * effekt og kjører ikke i serverrendringen; den dekkes av nettlesersjekkene.
 */

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Feilmelding } from "./Feilmelding";

const tekst = { melding: "Quizen kunne ikke lages nå.", handling: "Trykk «Prøv igjen»." };

/** Det som står inne i elementet med `role="alert"`. */
function iVarselet(html: string): string {
  const m = html.match(/<div[^>]*role="alert"[^>]*>([\s\S]*)<\/div>$/);
  if (!m) throw new Error(`fant ikke role="alert" i ${html}`);
  return m[1];
}

describe("Feilmelding", () => {
  test("med proevIgjen: en knapp «Prøv igjen» inne i role=alert", () => {
    const html = renderToStaticMarkup(createElement(Feilmelding, { ...tekst, proevIgjen: () => {} }));
    const inni = iVarselet(html);
    expect(inni).toContain(tekst.melding);
    expect(inni).toMatch(/<button[^>]*type="button"[^>]*>Prøv igjen<\/button>/);
  });

  test("med en egen knapp som children: knappen står inne i role=alert", () => {
    const html = renderToStaticMarkup(
      createElement(Feilmelding, { ...tekst, fokus: false }, createElement("button", { type: "button" }, "Prøv igjen")),
    );
    expect(iVarselet(html)).toContain("<button");
  });

  test("uten proevIgjen: ingen knapp, men fortsatt melding og råd i role=alert", () => {
    const html = renderToStaticMarkup(createElement(Feilmelding, tekst));
    const inni = iVarselet(html);
    expect(inni).not.toContain("<button");
    expect(inni).toContain(tekst.handling);
  });
});

describe("Feilmelding ved en bruksgrense (PRD §6.4)", () => {
  test("med grense: meldingen står, men ingen «Prøv igjen», heller ikke en egen knapp", () => {
    const html = renderToStaticMarkup(
      createElement(
        Feilmelding,
        { ...tekst, grense: "taket", proevIgjen: () => {} },
        createElement("button", { type: "button" }, "Prøv igjen"),
      ),
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain(tekst.melding);
    expect(html).not.toContain("<button");
  });
});
