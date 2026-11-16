/**
 * Visningen av en PDF-feiltilstand — FR-4.
 *
 * Ren visning uten tilstand, så testen kan tegne den og sjekke at meldingen
 * og knappene for de anbefalte handlingene faktisk er der (FR-4: «testen
 * sjekker at riktig melding vises, og at den anbefalte handlingen faktisk er
 * tilgjengelig i grensesnittet»).
 */

import { VALGTEKST, pdfFeilmelding, type PdfFeildetaljer, type PdfFeilkode, type Valg } from "../../opplasting/pdf-feil";
import { KNAPP_SEKUNDAER } from "./knapper";

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
    <div role="alert" data-feilkode={kode} className="rounded-md border-s-4 border-fare bg-fareflate p-4">
      <p className="font-bold">{f.melding}</p>
      <p className="mt-1">{f.handling}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {valg.map((v) => (
          <button
            key={v}
            type="button"
            data-valg={v}
            onClick={() => onValg(v)}
            className={KNAPP_SEKUNDAER}
          >
            {VALGTEKST[v]}
          </button>
        ))}
      </div>
    </div>
  );
}
