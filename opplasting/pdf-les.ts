/**
 * PDF-uttrekket — FR-2, FR-4. Kjører i nettleseren (AD-16): filen forlater
 * aldri elevens maskin, bare teksten sendes videre.
 *
 * pdfjs tas inn som parameter. Nettleseren gir sin utgave (pdfjs-nettleser.ts),
 * testene Node-utgaven — samme kode, samme feiltilstander.
 */

import { PdfFeil } from "./pdf-feil";
import {
  GRENSER,
  byggTekst,
  fjernToppOgBunntekst,
  linjerPaaSide,
  muligTabellEllerFormel,
  vurderMengde,
  type Linje,
  type Tekstbit,
} from "./pdf-tekst";

/** Den delen av pdfjs uttrekket bruker. */
export type Pdfjs = {
  getDocument(src: { data: Uint8Array; verbosity?: number; isEvalSupported?: boolean }): {
    promise: Promise<{
      numPages: number;
      getPage(n: number): Promise<{ getTextContent(): Promise<{ items: unknown[] }> }>;
      destroy?(): Promise<void>;
    }>;
  };
};

/** Det gjennomsynet viser om uttrekket (FR-3). */
export type Innlesingsrapport = {
  sider: number;
  /** Linjene som ble fjernet som topp-/bunntekst, slik de sto. */
  fjernedeLinjer: string[];
  sammenslaatteOrddelinger: number;
  muligTabellEllerFormel: boolean;
};

export type Uttrekk = { raatekst: string; rapport: Innlesingsrapport };

/** PF-3: en PDF begynner med «%PDF-», gjerne etter litt søppel foran. */
export function harPdfSignatur(bytes: Uint8Array): boolean {
  const start = new TextDecoder("latin1").decode(bytes.slice(0, 1024));
  return start.includes("%PDF-");
}

function somTekstbit(item: unknown): Tekstbit | null {
  const i = item as { str?: string; transform?: number[]; height?: number };
  if (typeof i.str !== "string" || !Array.isArray(i.transform)) return null;
  return { str: i.str, x: i.transform[4], y: i.transform[5], h: i.height ?? 0 };
}

/** Én gjennomlesing av filen, uten tidsavbrudd og nye forsøk. */
async function lesEnGang(bytes: Uint8Array, pdfjs: Pdfjs): Promise<Uttrekk> {
  if (!harPdfSignatur(bytes)) throw new PdfFeil("PF-3");

  let pdf;
  try {
    // En kopi: pdfjs kan overta bufferet, og et nytt forsøk trenger det intakt.
    pdf = await pdfjs.getDocument({ data: bytes.slice(), verbosity: 0, isEvalSupported: false }).promise;
  } catch (e) {
    const navn = (e as { name?: string }).name;
    if (navn === "PasswordException") throw new PdfFeil("PF-2", {}, e);
    if (navn === "InvalidPDFException" || navn === "FormatError") throw new PdfFeil("PF-3", {}, e);
    throw e; // ukjent: behandles som PF-7 av kalleren
  }

  try {
    if (pdf.numPages > GRENSER.maksSider) throw new PdfFeil("PF-5", { sider: pdf.numPages });

    const sider: Linje[][] = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const side = await pdf.getPage(n);
      const innhold = await side.getTextContent();
      sider.push(linjerPaaSide(innhold.items.map(somTekstbit).filter((b): b is Tekstbit => b !== null)));
    }

    // PF-1 og PF-6 regnes før topp/bunn fjernes: et sidetall er også tekst
    // fra filen, men en skannet side har nesten ingen.
    const mengde = vurderMengde(sider.map((s) => s.reduce((a, l) => a + l.tekst.length, 0)));
    if (mengde) throw new PdfFeil(mengde);

    const { sider: vasket, fjernet } = fjernToppOgBunntekst(sider);
    const { tekst, sammenslaatte } = byggTekst(vasket);
    return {
      raatekst: tekst,
      rapport: {
        sider: pdf.numPages,
        fjernedeLinjer: fjernet,
        sammenslaatteOrddelinger: sammenslaatte,
        muligTabellEllerFormel: muligTabellEllerFormel(tekst),
      },
    };
  } finally {
    await pdf.destroy?.();
  }
}

function medTidsavbrudd<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((ok, feil) => {
    const t = setTimeout(() => feil(new PdfFeil("PF-7")), ms);
    p.then(
      (v) => (clearTimeout(t), ok(v)),
      (e) => (clearTimeout(t), feil(e)),
    );
  });
}

/**
 * Trekker ut teksten fra en PDF. Kaster PdfFeil med en av kodene i FR-4.
 *
 * Kjente feil (PF-1, 2, 3, 5, 6) prøves ikke på nytt — de blir ikke bedre av
 * det. Tidsavbrudd og ukjente feil får ETT automatisk nytt forsøk, og blir
 * deretter PF-7 (FR-4).
 */
export async function trekkUtPdf(
  fil: { size: number; bytes(): Promise<Uint8Array> },
  pdfjs: Pdfjs,
  valg: { tidsavbruddMs?: number } = {},
): Promise<Uttrekk> {
  // FR-2: avvis før uttrekk.
  if (fil.size > GRENSER.maksBytes) throw new PdfFeil("PF-5", { storrelse: fil.size });
  const bytes = await fil.bytes();
  const ms = valg.tidsavbruddMs ?? GRENSER.tidsavbruddMs;

  let sisteFeil: unknown;
  for (let forsok = 0; forsok < 2; forsok++) {
    try {
      return await medTidsavbrudd(lesEnGang(bytes, pdfjs), ms);
    } catch (e) {
      if (e instanceof PdfFeil && e.kode !== "PF-7") throw e;
      sisteFeil = e;
    }
  }
  throw sisteFeil instanceof PdfFeil ? sisteFeil : new PdfFeil("PF-7", {}, sisteFeil);
}
