/**
 * Tester for AD-12, avsnittsdelingen.
 *
 * Ligger i `npm test` og ikke i `npm run maal`, fordi de er deterministiske og
 * ikke kaller språkmodellen — aksen i AD-5.
 *
 * Den viktigste testen er den siste: identisk avsnittsliste gjennom alle tre
 * innlesingsveiene. Det er den AD-12 krever, og den som ville fanget hullet
 * begge gjennomgangene fant.
 */

import { describe, expect, test } from "vitest";
import {
  delIAvsnitt,
  overskrifter,
  antallOrd,
  erOverskrift,
} from "./avsnittsdeling";

describe("delingsregelen", () => {
  test("deler på tom linje, ikke på enkelt linjeskift", () => {
    const tekst = "Celledeling\n\nEn celle deler seg\ni to like deler.";
    const a = delIAvsnitt(tekst);

    expect(a).toHaveLength(2);
    expect(a[1].innhold).toBe("En celle deler seg i to like deler.");
  });

  test("slår sammen hardbrutte linjer fra PDF-uttrekk", () => {
    // Slik ser uttrekk fra PDF ofte ut: ett linjeskift per visuelle linje.
    const fraPdf =
      "Mitose er den vanligste\nformen for celledeling\nhos mennesker.";
    const a = delIAvsnitt(fraPdf);

    expect(a).toHaveLength(1);
    expect(a[0].innhold).toBe(
      "Mitose er den vanligste formen for celledeling hos mennesker.",
    );
  });

  test("nummererer 1-basert i dokumentrekkefølge", () => {
    const a = delIAvsnitt("Én.\n\nTo.\n\nTre.");
    expect(a.map((x) => x.nummer)).toEqual([1, 2, 3]);
  });

  test("forkaster tomme blokker og tåler vilkårlig mange tomme linjer", () => {
    const a = delIAvsnitt("\n\n\nFørste.\n\n\n\n   \n\nAndre.\n\n");
    expect(a).toHaveLength(2);
    expect(a[0].innhold).toBe("Første.");
    expect(a[1].innhold).toBe("Andre.");
  });

  test("normaliserer Windows-linjeskift", () => {
    const a = delIAvsnitt("Overskrift\r\n\r\nBrødtekst her.");
    expect(a).toHaveLength(2);
    expect(a[0].innhold).toBe("Overskrift");
  });

  test("er deterministisk — samme inndata gir samme utdata", () => {
    const tekst = "Overskrift\n\nEt avsnitt med tekst.\n\nEnda ett.";
    expect(delIAvsnitt(tekst)).toEqual(delIAvsnitt(tekst));
  });
});

describe("overskriftsgjenkjenning", () => {
  test("kort linje uten sluttpunktum er overskrift", () => {
    expect(erOverskrift("Når delingen går galt")).toBe(true);
  });

  test("setning med punktum er ikke overskrift", () => {
    expect(erOverskrift("Cellen deler seg i to.")).toBe(false);
  });

  test("lang linje er ikke overskrift selv uten punktum", () => {
    const lang = "ord ".repeat(40).trim();
    expect(lang.length).toBeGreaterThan(100);
    expect(erOverskrift(lang)).toBe(false);
  });

  test("kolon avslutter en innledning, ikke en overskrift", () => {
    expect(erOverskrift("Tre ting skjer under mitose:")).toBe(false);
  });

  /*
   * Endret 8. oktober. Den gamle regelen avviste `?` og `!`, og ingen test
   * fanget at den gjorde det — regelen ble endret og testpakken sa ingenting.
   * Disse lukker hullet i begge retninger.
   */
  test("spørsmål er overskrift, fordi lærebokoverskrifter ofte er det", () => {
    // «Hva er allegori?» er en seksjonsoverskrift hos NDLA. Leses den som
    // brødtekst, mister aktiveringssiden i FR-5 tekstens struktur.
    expect(erOverskrift("Hva er allegori?")).toBe(true);
    expect(erOverskrift("Hvorfor modernisme?")).toBe(true);
  });

  test("utropstegn er overskrift", () => {
    // «Du som er i himmelen!» er en overskrift i NDLAs artikkel om allusjon.
    expect(erOverskrift("Du som er i himmelen!")).toBe(true);
  });

  test("over ti ord er ikke overskrift, selv under 100 tegn", () => {
    // Dette er grunnen til at ordgrensen kom samtidig som `?` ble tillatt:
    // tegngrensen alene slipper gjennom en hel setning. Denne er 98 tegn.
    const setning =
      'Under ser du orda som Jacobsen bruker om "jeget" og "duet". Hvilke konnotasjoner vekker disse?';
    expect(setning.length).toBeLessThanOrEqual(100);
    expect(setning.split(/\s+/).length).toBeGreaterThan(10);
    expect(erOverskrift(setning)).toBe(false);
  });

  test("ti ord er innenfor, elleve er utenfor", () => {
    expect(erOverskrift("ett to tre fire fem seks sju aatte ni ti")).toBe(true);
    expect(erOverskrift("ett to tre fire fem seks sju aatte ni ti elleve")).toBe(
      false,
    );
  });

  test("overskrifter kan plukkes ut for Aktiveringen (FR-5)", () => {
    const a = delIAvsnitt(
      "Celledeling\n\nAlle celler deler seg.\n\nMitose\n\nDette skjer i fire faser.",
    );
    expect(overskrifter(a).map((o) => o.innhold)).toEqual([
      "Celledeling",
      "Mitose",
    ]);
  });
});

describe("kjent begrensning", () => {
  test("tekst uten tomme linjer blir ett avsnitt, med vilje", () => {
    // Regelen gjetter ikke på setningsgrenser. Gjennomsynet i FR-3 fase 3b er
    // der eleven ser dette og setter inn avsnittsskiller selv.
    const uten = "Første setning. Andre setning. Tredje setning.";
    const a = delIAvsnitt(uten);

    expect(a).toHaveLength(1);
  });
});

describe("AD-12 — de tre innlesingsveiene gir identisk avsnittsliste", () => {
  // Samme tekst, slik den ville sett ut fra hver av de tre veiene inn.
  // Dette er kravet i AD-12: harnessen og appen skal ikke kunne dele ulikt.

  const fraLiming = [
    "Celledeling",
    "",
    "Alle levende celler deler seg. Prosessen kalles mitose.",
    "",
    "Når delingen går galt",
    "",
    "Noen ganger kopieres arvestoffet feil.",
  ].join("\n");

  // PDF-uttrekk: hardbrutte linjer, og tomme linjer mellom avsnitt.
  const fraPdf = [
    "Celledeling",
    "",
    "Alle levende celler deler seg.",
    "Prosessen kalles mitose.",
    "",
    "Når delingen går galt",
    "",
    "Noen ganger kopieres",
    "arvestoffet feil.",
  ].join("\n");

  // Bildeuttrekk: Windows-linjeskift og ekstra tomme linjer.
  const fraBilde = [
    "Celledeling",
    "",
    "",
    "Alle levende celler deler seg. Prosessen kalles mitose.",
    "",
    "Når delingen går galt",
    "",
    "Noen ganger kopieres arvestoffet feil.",
  ].join("\r\n");

  test("liming og PDF gir samme liste", () => {
    expect(delIAvsnitt(fraPdf)).toEqual(delIAvsnitt(fraLiming));
  });

  test("liming og bilde gir samme liste", () => {
    expect(delIAvsnitt(fraBilde)).toEqual(delIAvsnitt(fraLiming));
  });

  test("listen har forventet form", () => {
    const a = delIAvsnitt(fraLiming);
    expect(a).toHaveLength(4);
    expect(a.map((x) => x.erOverskrift)).toEqual([true, false, true, false]);
  });
});

describe("ordtelling for tetthetstakene i FR-7", () => {
  test("teller løpende ord over alle avsnitt", () => {
    const a = delIAvsnitt("Overskrift\n\nTre ord her.");
    expect(antallOrd(a)).toBe(4);
  });

  test("tåler flere mellomrom uten å telle tomme ord", () => {
    const a = delIAvsnitt("ett   to \t tre");
    expect(antallOrd(a)).toBe(3);
  });
});
