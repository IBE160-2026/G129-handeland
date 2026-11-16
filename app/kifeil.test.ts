/**
 * Meldingene per funksjon — PRD §5, FR-7, FR-13, FR-19 og FR-20.
 *
 * Hver feilkode gås gjennom: de som `kjoerGenerator` prøver på nytt, gir
 * funksjonens egen melding (`KI_FEIL.*`). De andre beholder feilens egen
 * melding, fordi rådet der er et annet («prøv igjen» hjelper ikke mot en
 * avslått nøkkel).
 */

import { describe, expect, test } from "vitest";
import { FASTE_TEKSTER, FEILKODER, GeneratorFeil, kanProevesPaaNytt } from "../generatorer/feil";
import { KI_FEIL, NETTFEIL, UKJENT_KODE, feilkodeFor, feiltekstForKode, kiFeil, somFeil } from "./kifeil";

const egen = (kode: (typeof FEILKODER)[number]) => new GeneratorFeil(kode, `egen melding (${kode})`, `eget råd (${kode})`);

describe("kiFeil, for hver feilkode", () => {
  for (const funksjon of Object.keys(KI_FEIL) as (keyof typeof KI_FEIL)[]) {
    for (const kode of FEILKODER) {
      test(`${funksjon}: ${kode}`, () => {
        const svar = kiFeil(egen(kode), KI_FEIL[funksjon]);
        if (kanProevesPaaNytt(kode)) expect(svar.feil).toEqual(KI_FEIL[funksjon]);
        else expect(svar.feil).toEqual({ melding: `egen melding (${kode})`, handling: `eget råd (${kode})` });
      });
    }
  }

  test("en feil som ikke er en GeneratorFeil (databasen), gir en generell melding, aldri en teknisk", () => {
    const svar = kiFeil(new Error("connection refused 127.0.0.1:5432"), KI_FEIL.quiz);
    expect(svar.feil.melding).not.toMatch(/connection|5432/);
    expect(svar).toEqual(somFeil(new Error("x")));
  });
});

describe("feiltekstForKode — når bare koden kom fram i adressen", () => {
  test("koder som prøves på nytt, en manglende kode og en kode som ikke finnes, gir standardmeldingen", () => {
    for (const kode of [...FEILKODER.filter(kanProevesPaaNytt), undefined, "<script>"]) {
      expect(feiltekstForKode(KI_FEIL.vurdering, kode), String(kode)).toEqual(KI_FEIL.vurdering);
    }
  });

  test("andre koder: første linje sier fortsatt hva som feilet, rådet er feilens eget", () => {
    for (const kode of FEILKODER.filter((k) => !kanProevesPaaNytt(k))) {
      const t = FASTE_TEKSTER[kode as keyof typeof FASTE_TEKSTER];
      expect(feiltekstForKode(KI_FEIL.vurdering, kode), kode).toEqual({
        melding: KI_FEIL.vurdering.melding,
        handling: `${t.elevmelding} ${t.anbefaltHandling}`,
      });
    }
  });

  test("ukjent (for eksempel databasen) gir det generelle rådet", () => {
    expect(feiltekstForKode(KI_FEIL.fagord, UKJENT_KODE).melding).toBe(KI_FEIL.fagord.melding);
    expect(feiltekstForKode(KI_FEIL.fagord, UKJENT_KODE).handling).toBe(somFeil(new Error()).feil.handling);
  });

  test("feilkodeFor gir koden, eller «ukjent» for andre feil", () => {
    expect(feilkodeFor(egen("for_mange_kall"))).toBe("for_mange_kall");
    expect(feilkodeFor(new Error("db"))).toBe(UKJENT_KODE);
  });
});

test("nettfeilen sier ikke noe om hva som er lagret, fordi det vet ikke nettleseren", () => {
  expect(`${NETTFEIL.melding} ${NETTFEIL.handling}`).toBe("Svaret kom ikke fram. Sjekk nettet og prøv igjen.");
});
