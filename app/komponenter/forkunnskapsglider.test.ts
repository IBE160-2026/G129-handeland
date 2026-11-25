/**
 * Forkunnskapen som glider — matrisen i spec-runde-3-2a: urørt sender
 * ingenting, alle tre trinnene kan velges fra urørt, og «Skjønner ikke
 * overskriften» overstyrer til glideren røres igjen.
 */

import { describe, expect, test } from "vitest";
import { lesMerking, merkefelt } from "../../tekst/forkunnskap";
import {
  IKKE_MERKET,
  SATT_TIL_SIDE,
  URORT,
  dempet,
  dragPosisjon,
  naermesteTrinn,
  sendtKode,
  smettInn,
  somTrinn,
  TRINN,
  trinnFraPeker,
  underDrag,
  vedTast,
  velgGjeldende,
  velgTrinn,
  verditekst,
  vekslUklar,
  type Glidertilstand,
} from "./forkunnskapsglider";

const tast = (t: Glidertilstand, key: string) => {
  const ny = vedTast(t, { key });
  if (!ny) throw new Error(`${key} ble ikke håndtert`);
  return ny;
};

describe("urørt", () => {
  test("ingenting sendes, glideren sier «Ikke merket ennå», står i midten og er dempet", () => {
    expect(sendtKode(URORT)).toBe("");
    expect(verditekst(URORT)).toBe(IKKE_MERKET);
    expect(URORT.trinn).toBe(1);
    expect(dempet(URORT)).toBe(true);
  });

  test("lesMerking lagrer ingenting for en overskrift uten felt", () => {
    const data = new FormData();
    expect(lesMerking(data, [{ nummer: 1, erOverskrift: true, innhold: "Hva er lys?" }])).toEqual([]);
  });
});

describe("glideren", () => {
  test("trinnene fra venstre er «Ingenting ennå», «Litt», «Mye»", () => {
    expect(TRINN).toEqual(["nytt", "litt", "kjent"]);
  });

  test("dra til høyre: `kjent`, «Mye»", () => {
    const t = velgTrinn(URORT, 2);
    expect(sendtKode(t)).toBe("kjent");
    expect(verditekst(t)).toBe("Mye");
    expect(dempet(t)).toBe(false);
  });

  test("dra til venstre: `nytt`, «Ingenting ennå»", () => {
    const t = velgTrinn(URORT, "0");
    expect(sendtKode(t)).toBe("nytt");
    expect(verditekst(t)).toBe("Ingenting ennå");
  });

  test("«Litt» fra urørt: klikk på håndtaket i midten", () => {
    const t = velgGjeldende(URORT);
    expect(sendtKode(t)).toBe("litt");
    expect(verditekst(t)).toBe("Litt");
  });

  test("«Litt» fra urørt: mellomrom eller Enter", () => {
    expect(sendtKode(tast(URORT, " "))).toBe("litt");
    expect(sendtKode(tast(URORT, "Enter"))).toBe("litt");
  });

  test("pekeren: nærmeste av de tre trinnene, regnet mot håndtakets strekning", () => {
    // Glideren 100–300 px, håndtaket 28 px (halvt 14): trinnene ligger på 114, 200 og 286.
    const boks = { left: 100, width: 200 };
    expect(trinnFraPeker(114, boks, 14)).toBe(0);
    expect(trinnFraPeker(150, boks, 14)).toBe(0);
    expect(trinnFraPeker(160, boks, 14)).toBe(1);
    expect(trinnFraPeker(200, boks, 14)).toBe(1);
    expect(trinnFraPeker(240, boks, 14)).toBe(1);
    expect(trinnFraPeker(250, boks, 14)).toBe(2);
    expect(trinnFraPeker(286, boks, 14)).toBe(2);
  });

  test("pekeren utenfor endene gir endetrinnet; uten bredde midten", () => {
    const boks = { left: 100, width: 200 };
    expect(trinnFraPeker(90, boks, 14)).toBe(0);
    expect(trinnFraPeker(400, boks, 14)).toBe(2);
    expect(trinnFraPeker(150, { left: 0, width: 0 }, 14)).toBe(1);
    expect(trinnFraPeker(299, boks)).toBe(2);
  });

  test("ugyldige verdier blir et gyldig trinn", () => {
    expect(somTrinn(7)).toBe(2);
    expect(somTrinn(-3)).toBe(0);
    expect(somTrinn("tull")).toBe(1);
  });
});

describe("draget (runde 3, bolk 8)", () => {
  test("posisjonen under draget er fri mellom endene, ikke avrundet", () => {
    expect(dragPosisjon("1.37")).toBeCloseTo(1.37);
    expect(dragPosisjon(0.04)).toBeCloseTo(0.04);
    expect(dragPosisjon(-1)).toBe(0);
    expect(dragPosisjon(3)).toBe(2);
    expect(dragPosisjon("tull")).toBe(1);
    expect(dragPosisjon("")).toBe(1);
  });

  test("trinnet nærmest posisjonen lyser opp", () => {
    expect(naermesteTrinn(0.2)).toBe(0);
    expect(naermesteTrinn(0.6)).toBe(1);
    expect(naermesteTrinn(1.4)).toBe(1);
    expect(naermesteTrinn(1.6)).toBe(2);
  });

  test("dra fra «Litt» mot høyre: håndtaket følger uten hopp, og «Mye» lyser når det er nærmest", () => {
    const litt = velgTrinn(URORT, 1);
    const steg = [1.1, 1.3, 1.49, 1.51, 1.8].map((v) => underDrag(litt, String(v)));
    expect(steg.map((s) => s.pos)).toEqual([1.1, 1.3, 1.49, 1.51, 1.8]);
    expect(steg.map((s) => verditekst(s.tilstand))).toEqual(["Litt", "Litt", "Litt", "Mye", "Mye"]);
  });

  test("under draget er aria-valuetext et trinnavn og det som sendes et helt trinn, aldri et desimaltall", () => {
    for (const v of ["0.01", "0.5", "0.77", "1.25", "1.99"]) {
      const { tilstand } = underDrag(URORT, v);
      expect(["Ingenting ennå", "Litt", "Mye"]).toContain(verditekst(tilstand));
      expect(["nytt", "litt", "kjent"]).toContain(sendtKode(tilstand));
      expect(Number.isInteger(tilstand.trinn)).toBe(true);
    }
  });

  test("draget slår av «Skjønner ikke overskriften»", () => {
    expect(underDrag(vekslUklar(URORT), "1.8").tilstand).toEqual({ rort: true, trinn: 2, uklar: false });
  });

  test("slipp mellom «Litt» og «Mye», nærmest «Mye»: smetter til «Mye» og sender `kjent`", () => {
    const { pos, tilstand } = underDrag(velgTrinn(URORT, 1), "1.7");
    const t = smettInn(tilstand, { pos, peker: null });
    expect(t).toEqual({ rort: true, trinn: 2, uklar: false });
    expect(verditekst(t)).toBe("Mye");
    expect(sendtKode(t)).toBe("kjent");
  });

  test("slipp utenfor glideren eller avbrutt drag (`pointercancel`): trinnet nærmest der håndtaket sto", () => {
    // Pekeren er sluppet utenfor (eller avbrutt), så `peker` er null; posisjonen avgjør.
    expect(smettInn(velgTrinn(URORT, 1), { pos: 0.3, peker: null }).trinn).toBe(0);
    expect(smettInn(velgTrinn(URORT, 0), { pos: 1.2, peker: null }).trinn).toBe(1);
    // Posisjonen går foran pekeren: håndtaket kan være grepet litt ved siden av midten.
    expect(smettInn(URORT, { pos: 1.6, peker: 1 }).trinn).toBe(2);
  });

  test("trykk uten drag: trinnet nærmest pekeren, også ytterst på sporet (iOS Safari)", () => {
    const boks = { left: 100, width: 200 };
    const ytterstVenstre = smettInn(URORT, { pos: null, peker: trinnFraPeker(101, boks, 14) });
    expect(ytterstVenstre).toEqual({ rort: true, trinn: 0, uklar: false });
    expect(verditekst(ytterstVenstre)).toBe("Ingenting ennå");
    expect(sendtKode(smettInn(URORT, { pos: null, peker: trinnFraPeker(299, boks, 14) }))).toBe("kjent");
    expect(sendtKode(smettInn(URORT, { pos: null, peker: trinnFraPeker(200, boks, 14) }))).toBe("litt");
  });

  test("urørt og avbrutt uten at håndtaket flyttet seg: ingenting endres, og ingenting sendes", () => {
    const t = smettInn(URORT, { pos: null, peker: null });
    expect(t).toEqual(URORT);
    expect(sendtKode(t)).toBe("");
    expect(verditekst(t)).toBe(IKKE_MERKET);
    expect(smettInn(vekslUklar(URORT), { pos: null, peker: null })).toEqual(vekslUklar(URORT));
  });
});

describe("tastaturet", () => {
  test("→ fra urørt, deretter ←: «Mye», så «Litt»; aldri desimaler", () => {
    const mye = tast(URORT, "ArrowRight");
    const litt = tast(mye, "ArrowLeft");
    expect([verditekst(mye), verditekst(litt)]).toEqual(["Mye", "Litt"]);
    expect([mye.trinn, litt.trinn]).toEqual([2, 1]);
  });

  test("→ fra urørt: `kjent` («Mye»); ← fra urørt: `nytt`", () => {
    expect(sendtKode(tast(URORT, "ArrowRight"))).toBe("kjent");
    expect(verditekst(tast(URORT, "ArrowRight"))).toBe("Mye");
    expect(sendtKode(tast(URORT, "ArrowLeft"))).toBe("nytt");
    expect(sendtKode(tast(URORT, "ArrowUp"))).toBe("kjent");
    expect(sendtKode(tast(URORT, "ArrowDown"))).toBe("nytt");
  });

  test("PageUp og PageDown går et trinn, som piltastene", () => {
    expect(sendtKode(tast(URORT, "PageUp"))).toBe("kjent");
    expect(sendtKode(tast(URORT, "PageDown"))).toBe("nytt");
    expect(sendtKode(tast(velgTrinn(URORT, 0), "PageUp"))).toBe("litt");
  });

  test("Home og End går til endene", () => {
    expect(sendtKode(tast(URORT, "Home"))).toBe("nytt");
    expect(sendtKode(tast(URORT, "End"))).toBe("kjent");
  });

  test("mot kanten blir trinnet stående, men glideren er rørt", () => {
    const venstre = tast(URORT, "ArrowLeft");
    expect(tast(venstre, "ArrowLeft")).toEqual({ rort: true, trinn: 0, uklar: false });
  });

  test("Tab, bokstaver og tastekombinasjoner er ikke gliderens", () => {
    expect(vedTast(URORT, { key: "Tab" })).toBeNull();
    expect(vedTast(URORT, { key: "a" })).toBeNull();
    expect(vedTast(URORT, { key: "ArrowRight", alt: true })).toBeNull();
    expect(vedTast(URORT, { key: "ArrowLeft", meta: true })).toBeNull();
  });
});

describe("«Skjønner ikke overskriften»", () => {
  test("på: `uklar`, glideren «Satt til side» og dempet", () => {
    const t = vekslUklar(URORT);
    expect(t.uklar).toBe(true);
    expect(sendtKode(t)).toBe("uklar");
    expect(verditekst(t)).toBe(SATT_TIL_SIDE);
    expect(dempet(t)).toBe(true);
  });

  test("på over en rørt glider: `uklar` overstyrer", () => {
    expect(sendtKode(vekslUklar(velgTrinn(URORT, 2)))).toBe("uklar");
  });

  test("glideren etter knappen: ← gir `nytt`, og knappen går av", () => {
    const t = tast(vekslUklar(URORT), "ArrowLeft");
    expect(sendtKode(t)).toBe("nytt");
    expect(t.uklar).toBe(false);
  });

  test("dra eller klikk etter knappen: glideren gjelder, knappen av", () => {
    expect(velgTrinn(vekslUklar(URORT), 2)).toEqual({ rort: true, trinn: 2, uklar: false });
    expect(velgGjeldende(vekslUklar(URORT))).toEqual({ rort: true, trinn: 1, uklar: false });
  });

  test("av igjen: urørt hvis glideren aldri ble rørt", () => {
    const t = vekslUklar(vekslUklar(URORT));
    expect(t).toEqual(URORT);
    expect(sendtKode(t)).toBe("");
    expect(verditekst(t)).toBe(IKKE_MERKET);
  });

  test("av igjen: ellers sin verdi", () => {
    const t = vekslUklar(vekslUklar(velgTrinn(URORT, 0)));
    expect(sendtKode(t)).toBe("nytt");
    expect(verditekst(t)).toBe("Ingenting ennå");
  });
});

describe("skjemaet", () => {
  test("kodene som sendes, leses av lesMerking som før", () => {
    const titler = [
      { nummer: 1, erOverskrift: true, innhold: "A" },
      { nummer: 2, erOverskrift: true, innhold: "B" },
      { nummer: 3, erOverskrift: true, innhold: "C" },
    ];
    const data = new FormData();
    const tilstander = [velgTrinn(URORT, 2), URORT, vekslUklar(URORT)];
    tilstander.forEach((t, i) => {
      const kode = sendtKode(t);
      if (kode) data.set(merkefelt(i + 1), kode);
    });
    expect(lesMerking(data, titler)).toEqual([
      { overskrift: "A", merke: "kjent" },
      { overskrift: "C", merke: "uklar" },
    ]);
  });
});
