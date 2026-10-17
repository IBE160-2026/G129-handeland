/**
 * Fase 3a — overskriftskontrollen (FR-3).
 *
 * Rett etter innlesing og før aktiveringen. Eleven ser bare overskriftene,
 * og retter dem før aktiveringen bygger på dem (FR-5). Fasen kan ikke hoppes
 * over, heller ikke for innlimt tekst.
 *
 * Bare overskriftene sendes til nettleseren. Brødteksten er ikke i sidens
 * kildekode — det er hele poenget med å dele gjennomsynet i to.
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { tilgang } from "../../../../data/konto";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { overskriftsplasser } from "../../../../tekst/overskrifter";
import { lagreOverskrifter } from "../../../handlinger";
import { Overskriftskontroll } from "../../../komponenter/Overskriftskontroll";

export default async function Overskrifter({ params }: PageProps<"/tekst/[id]/overskrifter">) {
  // FR-35: hentes før noen try-blokk, se data/konto.ts.
  const t = await tilgang();
  const { id } = await params;

  let tekst;
  try {
    tekst = await hentTekst(t, id);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }
  // Etter aktiveringen er overskriftene brukt, og kan ikke endres her (AD-9).
  if (tekst.tilstand !== "innlest") redirect(`/tekst/${id}/aktivering`);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">Steg 1 av 4 — før du leser</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Stemmer overskriftene?</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Dette er overskriftene Lesevenn fant i «{tekst.tittel}». Rett det som er feil, slett det som ikke er en
        overskrift, og flytt dem om rekkefølgen er gal. Selve teksten ser du etterpå — først skal du gjette hva den
        handler om.
      </p>
      <div className="mt-8">
        <Overskriftskontroll
          handling={lagreOverskrifter.bind(null, id)}
          plasser={overskriftsplasser(tekst.redigertTekst)}
        />
      </div>
      <p className="mt-10 text-sm">
        <Link href="/" className="underline decoration-slate-400 underline-offset-4">
          Tilbake
        </Link>
      </p>
    </main>
  );
}
