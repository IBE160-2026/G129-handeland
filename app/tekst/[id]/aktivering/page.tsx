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
import { tilgang } from "../../../../data/konto";
import { hentMorsmaal, hentOversettelse, kildeHash } from "../../../../data/morsmaal";
import { overskriftElementer, somOppslag } from "../../../../morsmaal/elementer";
import { KVALITETSSIKRET } from "../../../../morsmaal/spraak";
import { HentOversettelse } from "../../../komponenter/Morsmaal";
import { Morsmaalstekst, Spraakmerknad } from "../../../komponenter/Tospraak";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { delIAvsnitt, overskrifter } from "../../../../tekst/avsnittsdeling";
import { lagOversettelse, lagreAktivering } from "../../../handlinger";
import { AktiveringSkjema } from "../../../komponenter/Skjemaer";

export default async function Aktivering({
  params,
}: PageProps<"/tekst/[id]/aktivering">) {
  // FR-35: uten innlogging sendes eleven til innloggingssiden. Hentes før
  // noen try-blokk, fordi omdirigeringen er et unntak en catch ville fanget.
  const t = await tilgang();

  const { id } = await params;

  let tekst;
  try {
    tekst = await hentTekst(t, id);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }

  const avsnitt = delIAvsnitt(tekst.redigertTekst);
  const titler = overskrifter(avsnitt);

  // FR-26: overskriftene på begge språk. Mangler oversettelsen, vises de på
  // norsk med en gang, og oversettelsen hentes etterpå (FR-29).
  const spraak = await hentMorsmaal(t);
  const elementer = overskriftElementer(avsnitt);
  const oversatt =
    spraak && elementer.length > 0
      ? await hentOversettelse(t, id, spraak.kode, "overskrifter", kildeHash(elementer))
      : null;
  const mm = somOppslag(oversatt);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Steg 1 av 4 — før du leser
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {tekst.tittel}
      </h1>

      {titler.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-medium">Overskriftene i teksten</h2>
          {spraak && !oversatt && (
            <HentOversettelse handling={lagOversettelse.bind(null, id, "overskrifter")} hva="overskriftene" />
          )}
          <ul className="mt-3 space-y-2 border-l-2 border-slate-300 pl-4 dark:border-slate-700">
            {titler.map((o) => (
              <li key={o.nummer} className="text-lg">
                {o.innhold}
                {spraak && <Morsmaalstekst spraak={spraak} tekst={mm.get(`o${o.nummer}`)} className="text-base" />}
              </li>
            ))}
          </ul>
          {spraak && (
            <div className="mt-3">
              <Spraakmerknad spraak={spraak} kvalitetssikret={KVALITETSSIKRET.has(spraak.kode)} />
            </div>
          )}
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
