/**
 * Aktiveringssiden — FR-5 og FR-6.
 *
 * Eleven ser BARE overskriftene, ikke brødteksten. Det er hele poenget med
 * steget: å hente fram det eleven allerede vet før teksten leses, framfor å
 * lese den kaldt. Viser vi brødteksten her, er det ikke lenger en aktivering —
 * det er bare lesing med et spørsmål foran.
 *
 * Overskriftene regnes ut fra `delIAvsnitt` (AD-12) og lagres IKKE. Avsnitts-
 * listen fryses først ved låsing (AD-9), fordi eleven fortsatt kan endre
 * brødteksten i gjennomsynet etter dette steget.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { innloggingKlar, tilgang } from "../../../../data/konto";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { delIAvsnitt, overskrifter } from "../../../../tekst/avsnittsdeling";
import { lagreAktivering } from "../../../handlinger";
import { AktiveringSkjema } from "../../../komponenter/Skjemaer";
import { IkkeKlar } from "../../../komponenter/IkkeKlar";

export default async function Aktivering({
  params,
}: PageProps<"/tekst/[id]/aktivering">) {
  // FR-35: ingen datatilgang uten noe som kan gi en Tilgang. Se konto.ts.
  if (!innloggingKlar()) return <IkkeKlar />;

  const { id } = await params;

  let tekst;
  try {
    tekst = await hentTekst(tilgang(), id);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }

  const avsnitt = delIAvsnitt(tekst.redigertTekst);
  const titler = overskrifter(avsnitt);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Steg 1 av 3 — før du leser
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {tekst.tittel}
      </h1>

      {titler.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-medium">Overskriftene i teksten</h2>
          <ul className="mt-3 space-y-2 border-l-2 border-slate-300 pl-4 dark:border-slate-700">
            {titler.map((o) => (
              <li key={o.nummer} className="text-lg">
                {o.innhold}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        /*
         * FR-5: teksten kan mangle overskrifter. Da degraderer steget ærlig
         * framfor å finne på overskrifter eleven tror står i teksten.
         */
        <section className="mt-8 rounded-md border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <p>
            Lesevenn fant ingen overskrifter i denne teksten. Da er det
            vanskelig å gjette hva den handler om på forhånd — så skriv heller
            kort om hva du vet om emnet fra før.
          </p>
        </section>
      )}

      <section className="mt-8">
        <AktiveringSkjema handling={lagreAktivering.bind(null, id)} />
      </section>

      <p className="mt-10 text-sm">
        <Link
          href="/"
          className="underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100"
        >
          Tilbake
        </Link>
      </p>
    </main>
  );
}
