/**
 * De sju PDF-feiltilstandene i FR-4, med testfilene i testdata/pdf/.
 *
 * FR-4: «Hver av PF-1 til PF-7 har en reproduserbar test med tilhørende
 * testfil i repoet. Testen sjekker at riktig melding vises, og at den
 * anbefalte handlingen faktisk er tilgjengelig i grensesnittet.»
 *
 * Uttrekket kjøres med pdfjs sin Node-utgave — samme kode som nettleseren
 * bruker, bare en annen pdfjs. Visningen sjekkes ved å tegne PdfFeil-
 * komponenten til HTML. Testfilene lages av opplasting/lag-testfiler.mjs.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import * as pdfjsNode from "pdfjs-dist/legacy/build/pdf.mjs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Innlesingsrapport } from "../app/komponenter/Innlesingsrapport";
import { PdfFeil as PdfFeilVisning } from "../app/komponenter/PdfFeil";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import { PdfFeil, VALGTEKST, pdfFeilmelding, type PdfFeilkode, type Valg } from "./pdf-feil";
import { trekkUtPdf, type Pdfjs } from "./pdf-les";

const pdfjs = pdfjsNode as unknown as Pdfjs;

async function fil(navn: string) {
  const bytes = new Uint8Array(await readFile(path.join(process.cwd(), "testdata", "pdf", navn)));
  return { size: bytes.length, bytes: async () => bytes };
}

async function feilkode(p: Promise<unknown>): Promise<PdfFeil> {
  const e = await p.then(
    () => null,
    (x) => x,
  );
  expect(e, "ventet en PdfFeil").toBeInstanceOf(PdfFeil);
  return e as PdfFeil;
}

/** Tegner feilvisningen og sjekker melding og knapper. */
function visesMed(kode: PdfFeilkode, forventetValg: Valg[], detaljer = {}) {
  const html = renderToStaticMarkup(
    createElement(PdfFeilVisning, { kode, detaljer, bildeTilgjengelig: true, onValg: () => {} }),
  );
  expect(html).toContain(pdfFeilmelding(kode, detaljer).melding);
  for (const v of forventetValg) expect(html).toContain(`data-valg="${v}"`);
  for (const v of forventetValg) expect(html).toContain(VALGTEKST[v]);
  // Aldri et teknisk spor eller «noe gikk galt».
  expect(html).not.toMatch(/Exception|stack|noe gikk galt/i);
}

describe("vanlig fil", () => {
  test("teksten hentes ut, topp- og bunntekst fjernes, orddeling slås sammen", async () => {
    const { raatekst, rapport } = await trekkUtPdf(await fil("vanlig.pdf"), pdfjs);
    expect(rapport.sider).toBe(3);
    expect(rapport.fjernedeLinjer).toContain("Naturfag for videregående — kapittel 4");
    expect(rapport.fjernedeLinjer).toContain("Side 2");
    expect(raatekst).not.toContain("kapittel 4");
    expect(raatekst).toContain("informasjon");
    expect(raatekst).toContain("KI-Assistert");
    expect(rapport.sammenslaatteOrddelinger).toBeGreaterThanOrEqual(1);
  });

  test("overskriftene blir egne avsnitt, slik delIAvsnitt (AD-12) trenger", async () => {
    const { raatekst } = await trekkUtPdf(await fil("vanlig.pdf"), pdfjs);
    const overskrifter = delIAvsnitt(raatekst).filter((a) => a.erOverskrift).map((a) => a.innhold);
    expect(overskrifter).toEqual(["Celledeling", "Mitose", "Når det går galt"]);
  });
});

describe("FR-4 — feiltilstandene", () => {
  test("PF-1: skannet PDF uten tekstlag", async () => {
    const e = await feilkode(trekkUtPdf(await fil("pf1-skannet.pdf"), pdfjs));
    expect(e.kode).toBe("PF-1");
    visesMed("PF-1", ["bilde", "lim_inn"]);
  });

  test("PF-2: passordbeskyttet fil", async () => {
    const e = await feilkode(trekkUtPdf(await fil("pf2-passord.pdf"), pdfjs));
    expect(e.kode).toBe("PF-2");
    visesMed("PF-2", ["velg_annen", "lim_inn"]);
  });

  test("PF-3: ikke en PDF (feil filsignatur)", async () => {
    const e = await feilkode(trekkUtPdf(await fil("pf3-ikke-pdf.pdf"), pdfjs));
    expect(e.kode).toBe("PF-3");
    visesMed("PF-3", ["velg_annen", "lim_inn"]);
  });

  test("PF-3: ødelagt PDF (parsefeil)", async () => {
    const e = await feilkode(trekkUtPdf(await fil("pf3-oedelagt.pdf"), pdfjs));
    expect(e.kode).toBe("PF-3");
  });

  test("PF-4: spaltetekst gir ingen feil — den fanges av gjennomsynet", async () => {
    // PF-4 oppdages ikke automatisk (FR-4). Uttrekket lykkes, og gjennomsynet
    // sier fra om spalter; den meldingen sjekkes i gjennomsynstesten.
    const { raatekst, rapport } = await trekkUtPdf(await fil("pf4-spalter.pdf"), pdfjs);
    expect(raatekst.length).toBeGreaterThan(400);
    const html = renderToStaticMarkup(createElement(Innlesingsrapport, { rapport }));
    expect(html).toMatch(/data-pf4/);
    expect(html).toContain("flere spalter");
  });

  test("FR-3: gjennomsynet viser de fjernede linjene og tellingene", async () => {
    const { rapport } = await trekkUtPdf(await fil("vanlig.pdf"), pdfjs);
    const html = renderToStaticMarkup(createElement(Innlesingsrapport, { rapport }));
    expect(html).toContain("3 sider lest");
    expect(html).toContain("Naturfag for videregående — kapittel 4");
    expect(html).toMatch(/orddelinger slått sammen/);
  });

  test("PF-5: flere sider enn 40, med faktisk sidetall i meldingen", async () => {
    const e = await feilkode(trekkUtPdf(await fil("pf5-for-mange-sider.pdf"), pdfjs));
    expect(e.kode).toBe("PF-5");
    expect(e.detaljer.sider).toBe(41);
    expect(pdfFeilmelding("PF-5", e.detaljer).melding).toContain("41 sider");
    visesMed("PF-5", ["velg_annen", "lim_inn"], e.detaljer);
  });

  test("PF-5: over 10 MB avvises før uttrekk, med faktisk størrelse", async () => {
    let lest = false;
    const stor = { size: 11.4 * 1024 * 1024, bytes: async () => ((lest = true), new Uint8Array()) };
    const e = await feilkode(trekkUtPdf(stor, pdfjs));
    expect(e.kode).toBe("PF-5");
    expect(lest).toBe(false); // avvist før filen ble lest
    expect(pdfFeilmelding("PF-5", e.detaljer).melding).toContain("11,4 MB");
  });

  test("PF-6: for lite tekst til en leseløype", async () => {
    const e = await feilkode(trekkUtPdf(await fil("pf6-lite-tekst.pdf"), pdfjs));
    expect(e.kode).toBe("PF-6");
    visesMed("PF-6", ["lim_inn", "velg_annen"]);
  });

  test("PF-7: tidsavbrudd gir ett automatisk nytt forsøk, deretter prøv-igjen", async () => {
    let forsok = 0;
    const henger: Pdfjs = {
      getDocument: () => {
        forsok++;
        return { promise: new Promise(() => {}) };
      },
    };
    const e = await feilkode(trekkUtPdf(await fil("vanlig.pdf"), henger, { tidsavbruddMs: 30 }));
    expect(e.kode).toBe("PF-7");
    expect(forsok).toBe(2);
    visesMed("PF-7", ["prov_igjen", "lim_inn"]);
  });

  test("PF-7: en ukjent feil som går over ved andre forsøk, gir ingen feil", async () => {
    let forsok = 0;
    const ustabil: Pdfjs = {
      getDocument: (src) => {
        forsok++;
        if (forsok === 1) return { promise: Promise.reject(new Error("tilfeldig feil")) };
        return pdfjs.getDocument(src);
      },
    };
    const { rapport } = await trekkUtPdf(await fil("vanlig.pdf"), ustabil);
    expect(rapport.sider).toBe(3);
  });

  test("uten bildeinnlesing vises ikke knappen for bilder (ingen blindvei)", () => {
    const html = renderToStaticMarkup(
      createElement(PdfFeilVisning, { kode: "PF-1", bildeTilgjengelig: false, onValg: () => {} }),
    );
    expect(html).not.toContain('data-valg="bilde"');
    expect(html).toContain('data-valg="lim_inn"');
  });
});
