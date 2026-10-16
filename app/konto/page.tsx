/**
 * Kontosiden — morsmål, utlogging og sletting (FR-24, FR-35, FR-37).
 *
 * FR-37 krever at slettingen navngir hva som forsvinner. Derfor står antallet
 * tekster og e-postadressen her, rett over skjemaet, og ikke bare «kontoen».
 */

import Link from "next/link";
import { innloggetEpost, tilgang } from "../../data/konto";
import { hentMorsmaal } from "../../data/morsmaal";
import { listTekster } from "../../data/tilgang";
import { velgMorsmaalHandling } from "../handlinger";
import { MorsmaalVelger } from "../komponenter/Morsmaal";
import { LoggUtKnapp, SlettKontoSkjema } from "../komponenter/KontoSkjemaer";

export default async function Konto() {
  const t = await tilgang();
  const [epost, tekster, spraak] = await Promise.all([innloggetEpost(), listTekster(t), hentMorsmaal(t)]);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <p>
        <Link href="/" className="underline underline-offset-4">← Til tekstene</Link>
      </p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Konto</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Logget inn som {epost}.</p>

      {/* FR-24: valget lagres på kontoen og gjelder til eleven endrer det. */}
      <section className="mt-8">
        <MorsmaalVelger handling={velgMorsmaalHandling} valgt={spraak?.kode ?? null} />
      </section>

      <section className="mt-8">
        <LoggUtKnapp />
      </section>

      <section className="mt-12 rounded-md border border-red-300 p-5 dark:border-red-800">
        <h2 className="text-xl font-semibold tracking-tight">Slett kontoen</h2>
        <p className="mt-2">Dette forsvinner for godt, og kan ikke hentes tilbake:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>kontoen for {epost}</li>
          <li>
            {tekster.length === 1 ? "1 tekst" : `${tekster.length} tekster`}, med alt som hører til:
            fagordene, svarene dine og quizene
          </li>
        </ul>
        <div className="mt-6">
          <SlettKontoSkjema />
        </div>
      </section>
    </main>
  );
}
