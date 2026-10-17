/**
 * Tester for tittelforslaget (FR-1) og fagtekstvarselet (FR-7).
 */

import { describe, expect, test } from "vitest";
import { delIAvsnitt } from "./avsnittsdeling";
import { trekkBortFraFagtekst, visFagtekstvarsel } from "./fagtekstpreg";
import { foreslaaTittel } from "./tittel";

describe("FR-1 — tittelforslag", () => {
  test("første overskrift", () => {
    expect(foreslaaTittel(delIAvsnitt("Celler\n\nAlle levende ting består av celler."))).toBe("Celler");
  });

  test("ellers første setning, uten punktum", () => {
    expect(foreslaaTittel(delIAvsnitt("Alle levende ting består av celler. De deler seg."))).toBe(
      "Alle levende ting består av celler",
    );
  });

  test("lang setning kuttes på ordgrense, aldri midt i et ord", () => {
    const t = foreslaaTittel(delIAvsnitt(`${"elektromagnetisk stråling ".repeat(6)}er overalt.`));
    expect(t.length).toBeLessThanOrEqual(82);
    expect(t.endsWith(" …")).toBe(true);
    expect(t.replace(" …", "").split(" ").every((o) => ["elektromagnetisk", "stråling"].includes(o))).toBe(true);
  });

  test("tom tekst", () => {
    expect(foreslaaTittel([])).toBe("Uten tittel");
  });
});

describe("FR-7 — mykt varsel når teksten ikke ser ut som fagtekst", () => {
  const FAG =
    "Fotosyntesen er prosessen der planter bruker lysenergi til å lage sukker av karbondioksid og vann. " +
    "Den foregår i kloroplastene, og oksygen frigis som et biprodukt av reaksjonen.";
  const DIALOG = "– Hei.\n– Hei, hvordan går det?\n– Bra.\n– Skal vi gå?\n– Ja.\nHan gikk.";
  const LISTE = "Handleliste\n- melk\n- brød\n- egg\n- ost\n- smør";

  test("en fagtekst gir ingen grunner", () => {
    expect(trekkBortFraFagtekst(FAG)).toEqual([]);
  });

  test("dialog: replikker og korte setninger", () => {
    expect(trekkBortFraFagtekst(DIALOG)).toEqual(["svært korte setninger", "replikker"]);
  });

  test("liste: listepreg", () => {
    expect(trekkBortFraFagtekst(LISTE)).toContain("listepreg");
  });

  test("varselet vises bare når Begrepssettet er tomt eller nær tomt", () => {
    expect(visFagtekstvarsel(DIALOG, 0).length).toBeGreaterThan(0);
    expect(visFagtekstvarsel(DIALOG, 2).length).toBeGreaterThan(0);
    expect(visFagtekstvarsel(DIALOG, 3)).toEqual([]);
  });
});
