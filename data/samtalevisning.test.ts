/**
 * Reglene for hva samtalesiden viser under hver runde — FR-19, FR-20, FR-22.
 */

import { describe, expect, test } from "vitest";
import type { Runde } from "./fagsamtale";
import { samtalevisning } from "./samtalevisning";

function runde(nummer: number, endring: Partial<Runde> = {}): Runde {
  return {
    nummer,
    sporsmal: `Spørsmål ${nummer}?`,
    kildeavsnitt: { nummer: 2, innhold: "Et avsnitt." },
    maal: "nytt_aspekt",
    elevsvar: null,
    svarvurdering: null,
    vurderingsbegrunnelse: null,
    revurdert: false,
    ...endring,
  };
}

const besvart = (nummer: number, endring: Partial<Runde> = {}) =>
  runde(nummer, { elevsvar: "Et svar.", svarvurdering: "dekkende", vurderingsbegrunnelse: "Godt.", ...endring });

describe("samtalevisning", () => {
  test("ny samtale: bare svarskjemaet på første spørsmål", () => {
    expect(samtalevisning([runde(1)], false)).toEqual([
      { nummer: 1, vurderingFeilet: false, oppfolgingFeilet: false, kanRevurderes: false, svarSkjema: true },
    ]);
  });

  test("vanlig gang: vurdert runde kan revurderes, og skjemaet står på neste spørsmål", () => {
    const v = samtalevisning([besvart(1), runde(2)], false);
    expect(v[0]).toMatchObject({ vurderingFeilet: false, oppfolgingFeilet: false, kanRevurderes: true, svarSkjema: false });
    expect(v[1]).toMatchObject({ vurderingFeilet: false, oppfolgingFeilet: false, kanRevurderes: false, svarSkjema: true });
  });

  test("FR-19: svaret er lagret, vurderingen mangler — «vurderingen feilet», ingen revurdering og ikke noe skjema", () => {
    const [v] = samtalevisning([runde(1, { elevsvar: "Et svar." })], false);
    expect(v).toMatchObject({ vurderingFeilet: true, oppfolgingFeilet: false, kanRevurderes: false, svarSkjema: false });
  });

  test("FR-20: siste runde er vurdert uten neste spørsmål — «oppfølgingen feilet»", () => {
    const v = samtalevisning([besvart(1), besvart(2)], false);
    expect(v.map((r) => r.oppfolgingFeilet)).toEqual([false, true]);
    expect(v.every((r) => !r.svarSkjema)).toBe(true);
  });

  test("FR-22: en runde som alt er vurdert på nytt, kan ikke revurderes igjen", () => {
    const [v] = samtalevisning([besvart(1, { revurdert: true }), runde(2)], false);
    expect(v.kanRevurderes).toBe(false);
  });

  test("avsluttet samtale: ingen feil og ikke noe skjema, men revurdering står", () => {
    const v = samtalevisning([besvart(1), runde(2, { elevsvar: "Et svar." }), runde(3)], true);
    expect(v.map((r) => [r.vurderingFeilet, r.oppfolgingFeilet, r.svarSkjema])).toEqual([
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]);
    expect(v[0].kanRevurderes).toBe(true);
  });

  test("ingen runder: ingenting å vise", () => {
    expect(samtalevisning([], false)).toEqual([]);
  });
});
