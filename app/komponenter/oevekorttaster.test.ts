/**
 * Tastene på øvekortene — matrisen i spec-runde-3-2b: piler bytter kort,
 * mellomrom snur, men aldri i skjemafelt, med modifikator eller dobbelt på
 * en knapp.
 */

import { describe, expect, test } from "vitest";
import { tastehandling } from "./oevekorttaster";

const body = { tag: "BODY" };
const kortknapp = { tag: "BUTTON" };

describe("pilene", () => {
  test("→ og ← bytter kort med fokus på kortet, på body eller uten fokus", () => {
    expect(tastehandling({ key: "ArrowRight", maal: kortknapp })).toBe("neste");
    expect(tastehandling({ key: "ArrowLeft", maal: kortknapp })).toBe("forrige");
    expect(tastehandling({ key: "ArrowRight", maal: body })).toBe("neste");
    expect(tastehandling({ key: "ArrowLeft", maal: null })).toBe("forrige");
  });

  test("pilene virker også med fokus på en lenke eller summary", () => {
    expect(tastehandling({ key: "ArrowRight", maal: { tag: "a" } })).toBe("neste");
    expect(tastehandling({ key: "ArrowRight", maal: { tag: "SUMMARY" } })).toBe("neste");
  });

  test("en tast som holdes inne, teller bare første gang", () => {
    expect(tastehandling({ key: "ArrowRight", repeat: true, maal: body })).toBeNull();
    expect(tastehandling({ key: "ArrowLeft", repeat: true, maal: body })).toBeNull();
    expect(tastehandling({ key: " ", repeat: true, maal: body })).toBeNull();
  });

  test("Shift gir nettleserens egen (Shift+mellomrom ruller opp)", () => {
    expect(tastehandling({ key: " ", shift: true, maal: body })).toBeNull();
    expect(tastehandling({ key: "ArrowRight", shift: true, maal: body })).toBeNull();
  });

  test("Ctrl, Alt og Meta gir nettleserens egen", () => {
    expect(tastehandling({ key: "ArrowRight", ctrl: true, maal: body })).toBeNull();
    expect(tastehandling({ key: "ArrowLeft", alt: true, maal: body })).toBeNull();
    expect(tastehandling({ key: "ArrowRight", meta: true, maal: body })).toBeNull();
    expect(tastehandling({ key: " ", ctrl: true, maal: body })).toBeNull();
  });
});

describe("mellomrom", () => {
  test("snur kortet med fokus på body eller uten fokus", () => {
    expect(tastehandling({ key: " ", maal: body })).toBe("snu");
    expect(tastehandling({ key: " ", maal: null })).toBe("snu");
    expect(tastehandling({ key: "Spacebar", maal: { tag: "div" } })).toBe("snu");
  });

  test("på kortknappen eller «Har kontroll» gjør knappen det selv (snus én gang, ikke to)", () => {
    expect(tastehandling({ key: " ", maal: kortknapp })).toBeNull();
  });

  test("på lenke, summary og knapperoller gjør elementet det selv", () => {
    expect(tastehandling({ key: " ", maal: { tag: "A" } })).toBeNull();
    expect(tastehandling({ key: " ", maal: { tag: "summary" } })).toBeNull();
  });

  test("på hver rolle der mellomrom virker fra før, gjør elementet det selv", () => {
    for (const rolle of ["button", "link", "checkbox", "radio", "switch", "menuitem", "tab", "option"]) {
      expect(tastehandling({ key: " ", maal: { tag: "div", rolle } })).toBeNull();
      expect(tastehandling({ key: "ArrowRight", maal: { tag: "div", rolle } })).toBe("neste");
    }
  });
});

describe("skjemafelt", () => {
  test("ingenting fanges i input, textarea, select eller contenteditable", () => {
    for (const maal of [
      { tag: "INPUT" },
      { tag: "textarea" },
      { tag: "SELECT" },
      { tag: "div", redigerbar: true },
      ...["textbox", "searchbox", "combobox", "spinbutton", "slider"].map((rolle) => ({ tag: "div", rolle })),
    ]) {
      expect(tastehandling({ key: "ArrowRight", maal })).toBeNull();
      expect(tastehandling({ key: "ArrowLeft", maal })).toBeNull();
      expect(tastehandling({ key: " ", maal })).toBeNull();
    }
  });
});

test("andre taster gir ingenting", () => {
  expect(tastehandling({ key: "Enter", maal: body })).toBeNull();
  expect(tastehandling({ key: "ArrowUp", maal: body })).toBeNull();
  expect(tastehandling({ key: "a", maal: body })).toBeNull();
});
