/**
 * Bruksgrensene i visningene — PRD §6.4, EXPERIENCE.md (State Patterns:
 * Bruksgrenser). Når en grense er nådd, står meldingen uten «Prøv igjen»,
 * fordi et nytt trykk ikke kan virke før i morgen. Tegnet på serveren
 * (renderToStaticMarkup), som Feilmelding.test.ts.
 */

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: () => {} }) }));

const { GRENSE_FEIL } = await import("../../data/grenser");
const { KI_FEIL } = await import("../kifeil");
const { FinnFagordPaaNytt } = await import("./Skjemaer");
const { OversettelseFeil } = await import("./Morsmaal");

const handling = async () => ({});

describe("FinnFagordPaaNytt", () => {
  test("ved en vanlig KI-feil: «Prøv igjen»", () => {
    const html = renderToStaticMarkup(createElement(FinnFagordPaaNytt, { handling, standard: KI_FEIL.fagord, fokus: false }));
    expect(html).toContain(">Prøv igjen<");
  });

  test("med takmeldingen: meldingen står, uten «Prøv igjen»", () => {
    const html = renderToStaticMarkup(createElement(FinnFagordPaaNytt, { handling, standard: GRENSE_FEIL.taket, fokus: true }));
    expect(html).toContain(GRENSE_FEIL.taket.melding);
    expect(html).not.toContain("Prøv igjen<");
    expect(html).not.toMatch(/<button[^>]*>[^<]*Prøv igjen/);
  });
});

describe("HentOversettelse (OversettelseFeil)", () => {
  test("ved en vanlig feil: «Prøv igjen»", () => {
    const html = renderToStaticMarkup(
      createElement(OversettelseFeil, { feil: { melding: "x", handling: "y" }, melding: "Oversettelsen kom ikke fram.", kjoer: () => {} }),
    );
    expect(html).toContain("Oversettelsen kom ikke fram.");
    expect(html).toContain(">Prøv igjen<");
  });

  test("med takmeldingen: meldingen står, uten «Prøv igjen»", () => {
    const html = renderToStaticMarkup(
      createElement(OversettelseFeil, { feil: GRENSE_FEIL.taket, melding: "Oversettelsen kom ikke fram.", kjoer: () => {} }),
    );
    expect(html).toContain(GRENSE_FEIL.taket.melding);
    expect(html).not.toContain("<button");
  });
});
