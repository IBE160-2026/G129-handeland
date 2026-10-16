/**
 * Visningen av en feiltilstand ved bildeinnlesing — FR-44. Ren visning, så
 * testen kan tegne den, som PdfFeil.
 */

import { BILDEVALGTEKST, bildeFeilmelding, type BildeFeildetaljer, type BildeFeilkode, type BildeValg } from "../../opplasting/bilde-feil";

export function BildeFeil({
  kode,
  detaljer,
  onValg,
}: {
  kode: BildeFeilkode;
  detaljer?: BildeFeildetaljer;
  onValg: (v: BildeValg) => void;
}) {
  const f = bildeFeilmelding(kode, detaljer);
  return (
    <div role="alert" data-feilkode={kode} className="rounded-md border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/40">
      <p className="font-medium text-red-900 dark:text-red-200">{f.melding}</p>
      <p className="mt-1 text-red-800 dark:text-red-300">{f.handling}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {f.valg.map((v) => (
          <button
            key={v}
            type="button"
            data-valg={v}
            onClick={() => onValg(v)}
            className="rounded-md border border-red-400 bg-white px-4 py-2 font-medium text-red-900 hover:bg-red-100 focus:outline-2 focus:outline-offset-2 focus:outline-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
          >
            {BILDEVALGTEKST[v]}
          </button>
        ))}
      </div>
    </div>
  );
}
