/**
 * Hva en Tekst i en Mappe mangler — FR-51, FR-52 (I/O-matrisen i
 * spec-mapper-lett.md). Mappesidene viser quizknappen bare når minst én
 * Tekst har `quizmangel(...) === null`, og lister resten med hva som mangler.
 */

import { describe, expect, test } from "vitest";
import type { Mappetekst } from "../../data/mapper";
import { kortmangel, quizmangel } from "./Mappemangler";

const tekst = (over: Partial<Mappetekst>): Mappetekst => ({
  id: "t1",
  tittel: "Celler",
  tilstand: "laast",
  antallFagord: 3,
  antallSporsmal: 8,
  ...over,
});

describe("quizmangel", () => {
  test("en låst Tekst med Quiz mangler ingenting", () => {
    expect(quizmangel(tekst({}))).toBeNull();
  });

  test("uten Quiz: «Quiz ikke laget ennå» med lenke til tekstens quiz", () => {
    expect(quizmangel(tekst({ antallSporsmal: null }))).toEqual({
      tekst: "Quiz ikke laget ennå.",
      lenke: { href: "/tekst/t1/quiz", tekst: "Lag quizen i teksten" },
    });
  });

  test("ikke låst: lenke til aktiveringen", () => {
    expect(quizmangel(tekst({ tilstand: "aktivert", antallSporsmal: null }))?.lenke.href).toBe("/tekst/t1/aktivering");
  });

  test("ingen Tekst med Quiz gir ingen quizknapp", () => {
    const tekster = [tekst({ antallSporsmal: null }), tekst({ id: "t2", tilstand: "innlest" })];
    expect(tekster.filter((x) => quizmangel(x) === null)).toHaveLength(0);
  });
});

describe("kortmangel", () => {
  test("en låst Tekst med fagord mangler ingenting", () => {
    expect(kortmangel(tekst({}))).toBeNull();
  });

  test("tomt Begrepssett: ingen fagord, og grunnen oppgis", () => {
    expect(kortmangel(tekst({ antallFagord: 0 }))?.tekst).toBe("Ingen fagord i teksten, så den har ingen øvekort.");
  });

  test("uten Begrepssett: fagordene er ikke funnet ennå", () => {
    expect(kortmangel(tekst({ antallFagord: null }))?.lenke.href).toBe("/tekst/t1/lesing");
  });
});
