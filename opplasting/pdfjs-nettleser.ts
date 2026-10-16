/**
 * pdfjs i nettleseren. Lastes først når eleven velger en PDF, så resten av
 * appen ikke betaler for biblioteket.
 *
 * Arbeidertråden hentes fra public/ (kopiert av kopier-pdf-worker.mjs før
 * hver bygging), ikke fra en ekstern CDN: PDF-uttrekket skal ikke avhenge av
 * en tredjepart (AD-16, §6.2).
 */

import type { Pdfjs } from "./pdf-les";

export async function hentPdfjs(): Promise<Pdfjs> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs as unknown as Pdfjs;
}
