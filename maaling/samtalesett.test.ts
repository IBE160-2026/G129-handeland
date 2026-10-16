/**
 * Tester for valideringen og målingene i samtalesett.ts (FR-21).
 * Kjøres av `npm test`.
 */

import { describe, expect, test } from "vitest";
import { MAAL_FOR, type Tilstand } from "../generatorer/fagsamtale";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import { FASIT, VARIANTER, regnMaal, validerSamtalesett, type Samtalesett, type Tilfelle, type Variant } from "./samtalesett";

const avsnitt = delIAvsnitt("Renter\n\nRenter er prisen for å låne.\n\nAvdrag\n\nAvdrag er tilbakebetaling.\n\nMer om lån.");
// 1 overskrift, 2 brødtekst, 3 overskrift, 4-5 brødtekst

function fyltSett(): Samtalesett {
  const svar = () =>
    Object.fromEntries(
      VARIANTER.map((v) => [v, { tekst: `svar ${v} ${Math.random()}`, ...(v.startsWith("misoppfatning") ? { motsigendeAvsnitt: 4 } : {}) }]),
    ) as Samtalesett["startsporsmal"][number]["svar"];
  return {
    tekst: "x.txt",
    tittel: "Renter",
    annotert: "20.10.2026",
    startsporsmal: [
      { id: "A", sporsmal: "Hva er renter?", kildeavsnitt: 2, svar: svar() },
      { id: "B", sporsmal: "Hva er et avdrag?", kildeavsnitt: 4, svar: svar() },
    ],
  };
}

describe("validering", () => {
  test("et fullt og riktig utfylt sett har ingen innvendinger", () => {
    expect(validerSamtalesett(fyltSett(), avsnitt)).toEqual([]);
  });

  test("overskrift som kildeavsnitt, manglende motsigende avsnitt og tomt svar fanges", () => {
    const s = fyltSett();
    s.startsporsmal[0].kildeavsnitt = 1;
    s.startsporsmal[0].svar.misoppfatning1.motsigendeAvsnitt = null;
    s.startsporsmal[1].svar.uklart.tekst = "  ";
    const f = validerSamtalesett(s, avsnitt).join(" | ");
    expect(f).toMatch(/A: «kildeavsnitt»/);
    expect(f).toMatch(/misoppfatning1: «motsigendeAvsnitt»/);
    expect(f).toMatch(/B, uklart: svaret er tomt/);
  });

  test("dobbeltspørsmål og manglende dato fanges", () => {
    const s = fyltSett();
    s.annotert = null;
    s.startsporsmal[0].sporsmal = "Hva er renter, og hvorfor betaler man dem?";
    const f = validerSamtalesett(s, avsnitt).join(" | ");
    expect(f).toMatch(/annotert/);
    expect(f).toMatch(/bundet/);
  });
});

/* ------------------------------------------------------------------ */

/** Et tilfelle der modellen svarte nøyaktig etter fasiten, med gitte avsnitt. */
function perfekt(startId: string, variant: Variant, avs: number): Tilfelle {
  const fasit = FASIT[variant];
  return {
    tekst: "T",
    startId,
    variant,
    fasit,
    motsigendeAvsnitt: variant.startsWith("misoppfatning") ? 4 : null,
    elevsvar: variant,
    tilstand: fasit,
    begrunnelse: "b",
    oppfolging: { sporsmal: "?", kildeavsnittNummer: avs, maal: MAAL_FOR[fasit] },
  };
}

function settMedPerfekte(): Tilfelle[] {
  return ["A", "B"].flatMap((id) =>
    VARIANTER.map((v) => perfekt(id, v, v === "dekkende" ? 5 : v.startsWith("misoppfatning") ? 4 : 2)),
  );
}

describe("målingene", () => {
  test("et perfekt sett består alt", () => {
    const m = regnMaal(settMedPerfekte());
    expect(m.sikkerhetsport.bestatt).toBe(true);
    expect(m.gjenkalling.verdi).toBe(1);
    expect(m.maaltest.bestatt).toBe(m.maaltest.avMulige);
    expect(m.avsnittstest.ok).toBe(true);
    expect(m.treffForhandsvalgt.verdi).toBe(1);
  });

  test("én misoppfatning lest som dekkende stenger porten", () => {
    const t = settMedPerfekte();
    const m1 = t.find((x) => x.variant === "misoppfatning2")!;
    m1.tilstand = "dekkende";
    expect(regnMaal(t).sikkerhetsport.bestatt).toBe(false);
  });

  test("avsnittstesten feiler når misoppfatningen peker samme sted som det dekkende", () => {
    const t = settMedPerfekte();
    t.find((x) => x.startId === "A" && x.variant === "misoppfatning1")!.oppfolging!.kildeavsnittNummer = 5;
    expect(regnMaal(t).avsnittstest.ok).toBe(false);
  });

  test("måltesten krever at målene følger fasiten og er ulike", () => {
    const t = settMedPerfekte();
    t.find((x) => x.startId === "A" && x.variant === "utenfor")!.oppfolging!.maal = "ber_om_utdyping";
    const m = regnMaal(t);
    expect(m.maaltest.bestatt).toBe(m.maaltest.avMulige - 1);
  });

  test("forvekslingsmatrisen teller fasit mot det modellen svarte", () => {
    const t = settMedPerfekte();
    t.find((x) => x.startId === "A" && x.variant === "delvis")!.tilstand = "uklart" as Tilstand;
    const m = regnMaal(t);
    expect(m.forveksling.delvis.uklart).toBe(1);
    expect(m.forveksling.misoppfatning.misoppfatning).toBe(4);
  });
});
