/**
 * Visningen av en feiltilstand ved bildeinnlesing — FR-44. Ren visning, så
 * testen kan tegne den, som PdfFeil.
 */

import { BILDEVALGTEKST, bildeFeilmelding, type BildeFeildetaljer, type BildeFeilkode, type BildeValg } from "../../opplasting/bilde-feil";
import { KNAPP_SEKUNDAER } from "./knapper";

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
    <div role="alert" data-feilkode={kode} className="rounded-md border-s-4 border-fare bg-fareflate p-4">
      <p className="font-bold">{f.melding}</p>
      <p className="mt-1">{f.handling}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {f.valg.map((v) => (
          <button
            key={v}
            type="button"
            data-valg={v}
            onClick={() => onValg(v)}
            className={KNAPP_SEKUNDAER}
          >
            {BILDEVALGTEKST[v]}
          </button>
        ))}
      </div>
    </div>
  );
}
