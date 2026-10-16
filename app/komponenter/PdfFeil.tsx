/**
 * Visningen av en PDF-feiltilstand — FR-4.
 *
 * Ren visning uten tilstand, så testen kan tegne den og sjekke at meldingen
 * og knappene for de anbefalte handlingene faktisk er der (FR-4: «testen
 * sjekker at riktig melding vises, og at den anbefalte handlingen faktisk er
 * tilgjengelig i grensesnittet»).
 */

import { VALGTEKST, pdfFeilmelding, type PdfFeildetaljer, type PdfFeilkode, type Valg } from "../../opplasting/pdf-feil";

export function PdfFeil({
  kode,
  detaljer,
  bildeTilgjengelig,
  onValg,
}: {
  kode: PdfFeilkode;
  detaljer?: PdfFeildetaljer;
  /** Bildeinnlesingen (FR-44). Uten den vises ikke knappen — en knapp som ikke virker, er en blindvei. */
  bildeTilgjengelig: boolean;
  onValg: (v: Valg) => void;
}) {
  const f = pdfFeilmelding(kode, detaljer);
  const valg = f.valg.filter((v) => v !== "bilde" || bildeTilgjengelig);
  return (
    <div role="alert" data-feilkode={kode} className="rounded-md border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/40">
      <p className="font-medium text-red-900 dark:text-red-200">{f.melding}</p>
      <p className="mt-1 text-red-800 dark:text-red-300">{f.handling}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {valg.map((v) => (
          <button
            key={v}
            type="button"
            data-valg={v}
            onClick={() => onValg(v)}
            className="rounded-md border border-red-400 bg-white px-4 py-2 font-medium text-red-900 hover:bg-red-100 focus:outline-2 focus:outline-offset-2 focus:outline-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
          >
            {VALGTEKST[v]}
          </button>
        ))}
      </div>
    </div>
  );
}
