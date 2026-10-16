/**
 * Øvekort — FR-16, FR-17. Ett kort per Faguttrykk i Begrepssettet.
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { tilgang } from "../../../../data/konto";
import { hentOevekort } from "../../../../data/oevekort";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { Oevekort } from "../../../komponenter/Oevekort";

export default async function Oevekortside({ params }: PageProps<"/tekst/[id]/oevekort">) {
  // FR-35: hentes før noen try-blokk, se data/konto.ts.
  const t = await tilgang();
  const { id } = await params;

  let tekst, sett;
  try {
    [tekst, sett] = await Promise.all([hentTekst(t, id), hentOevekort(t, id)]);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }
  if (tekst.tilstand !== "laast") redirect(`/tekst/${id}/aktivering`);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">Øvekort</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{tekst.tittel}</h1>

      <div className="mt-8">
        {sett.status === "klar" ? (
          <Oevekort tekstId={id} kort={sett.kort} />
        ) : sett.status === "tomt" ? (
          // FR-16: ingen kort av ingenting, og grunnen sies.
          <p className="rounded-md border border-slate-300 p-5 dark:border-slate-700">
            Det ble ikke funnet fagbegreper i denne teksten, så det finnes ingen
            øvekort å øve på. Quizen og fagsamtalen virker likevel.
          </p>
        ) : (
          <div className="rounded-md border border-slate-300 p-5 dark:border-slate-700">
            <p>Fagordene er ikke funnet ennå, og øvekortene lages av dem.</p>
            <p className="mt-2">
              <Link href={`/tekst/${id}/lesing`} className="underline underline-offset-4">
                Gå til teksten
              </Link>{" "}
              — der kan du prøve å finne fagordene igjen.
            </p>
          </div>
        )}
      </div>

      <p className="mt-12 text-sm">
        <Link href={`/tekst/${id}/oppgaver`} className="underline decoration-slate-400 underline-offset-4">
          Tilbake til oppgavene
        </Link>
      </p>
    </main>
  );
}
