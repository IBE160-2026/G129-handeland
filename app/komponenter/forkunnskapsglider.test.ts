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
  sendtKode,
  somTrinn,
  TRINN,
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

  test("ugyldige verdier blir et gyldig trinn", () => {
    expect(somTrinn(7)).toBe(2);
    expect(somTrinn(-3)).toBe(0);
    expect(somTrinn("tull")).toBe(1);
  });
});

describe("tastaturet", () => {
  test("→ fra urørt: `kjent` («Mye»); ← fra urørt: `nytt`", () => {
    expect(sendtKode(tast(URORT, "ArrowRight"))).toBe("kjent");
    expect(verditekst(tast(URORT, "ArrowRight"))).toBe("Mye");
    expect(sendtKode(tast(URORT, "ArrowLeft"))).toBe("nytt");
    expect(sendtKode(tast(URORT, "ArrowUp"))).toBe("kjent");
    expect(sendtKode(tast(URORT, "ArrowDown"))).toBe("nytt");
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
