/**
 * Øvekort — FR-16, FR-17. Ett kort per Faguttrykk i Begrepssettet.
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { tilgang } from "../../../../data/konto";
import { hentOevekort } from "../../../../data/oevekort";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { LENKE_TILBAKE } from "../../../komponenter/knapper";
import { Oevekort } from "../../../komponenter/Oevekort";
import { Tusj } from "../../../komponenter/Tusj";

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
    <main className="mx-auto w-full max-w-2xl px-4 py-10 min-[760px]:max-w-[64rem] min-[760px]:px-8">
      {/*
        Runde 3, bolk 2b: tilbakelenken øverst, som del av headeren (telefontest 23.11).
        Runde 3, bolk 3: bare under 760 px. Fra 760 px står den nederst på siden
        (se under). Den andre er `display: none`, så bare én er synlig og i
        tilgjengelighetstreet om gangen. Fra 760 px er siden opptil 1024 px
        bred med 32 px marg, så kortet blir opptil 960 px.
      */}
      <header>
        <p className="min-[760px]:hidden">
          <Link href={`/tekst/${id}/oppgaver`} className={LENKE_TILBAKE}>
            <span aria-hidden="true">←&nbsp;</span>Tilbake til oppgavene
          </Link>
        </p>
        <p className="mt-4 min-[760px]:mt-0 text-sm text-slate-600 dark:text-slate-400">Øvekort</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight"><Tusj>{tekst.tittel}</Tusj></h1>
      </header>

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

      {/*
        Runde 3, bolk 3 (avgjort av Arve 23.11): på stor skjerm står
        tilbakelenken nederst på siden, venstrejustert og 24 px lenger ut mot
        kanten enn kortet. Den ruller med siden; ingen fast posisjon.
      */}
      <p className="mt-10 hidden min-[760px]:-ml-6 min-[760px]:block">
        <Link href={`/tekst/${id}/oppgaver`} className={LENKE_TILBAKE}>
          <span aria-hidden="true">←&nbsp;</span>Tilbake til oppgavene
        </Link>
      </p>
    </main>
  );
}
