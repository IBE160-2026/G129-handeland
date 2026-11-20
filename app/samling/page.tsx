/**
 * Samlingen — FR-49, med tekstlisten fra den gamle startsiden (FR-36, FR-37).
 *
 * EXPERIENCE.md, Tekstrad: tittelen er en lenke til neste steg (samme regel
 * som hovedbunken), tilstanden står i klartekst, og datoen teksten ble lagt
 * inn. Søk og sortering ligger i adressen og virker uten JavaScript, med et
 * vanlig skjema. Sletting ber om bekreftelse (SlettTekstKnapp).
 */

import Link from "next/link";
import { type Bunke, type Kontostatus, hentArbeidsbord, nesteSteg, tilstandsord } from "../../data/arbeidsbord";
import { samtalegrenseNaadd } from "../../data/forbruk";
import { tilgang } from "../../data/konto";
import { listMapper, MAPPEGRENSER, type Mapperad } from "../../data/mapper";
import { filtrerTekster, tolkSortering } from "../../data/tekstliste";
import { opprettMappeHandling } from "../handlinger";
import { NyMappeSkjema } from "../komponenter/Mappeskjemaer";
import { Hentefeil } from "../komponenter/Hentefeil";
import { KNAPP_PRIMAER, KNAPP_SEKUNDAER } from "../komponenter/knapper";
import { SlettTekstKnapp } from "../komponenter/SlettTekstKnapp";
import { Tusj } from "../komponenter/Tusj";

const DATO = new Intl.DateTimeFormat("nb-NO", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Oslo" });
const FELT = "min-h-11 rounded-md border border-slate-500 bg-flate px-3 dark:border-slate-400";
const LENKE = "underline decoration-primaer underline-offset-4";

export default async function Samling({ searchParams }: PageProps<"/samling">) {
  // FR-35: hentes før try-blokken, se data/konto.ts.
  const t = await tilgang();
  let alle: Bunke[] | null = null;
  // PRD §6.4: «Neste: Fagsamtale» hoppes over når dagens samtaler er brukt.
  let konto: Kontostatus = {};
  let mapper: Mapperad[] = [];
  try {
    [alle, konto, mapper] = await Promise.all([
      hentArbeidsbord(t),
      // Feiler oppslaget, vises listen likevel, som om grensen ikke er nådd.
      samtalegrenseNaadd(t)
        .catch(() => false)
        .then((naadd) => ({ samtalegrenseNaadd: naadd })),
      // Feiler mappeoppslaget, vises tekstene likevel, uten mapper.
      listMapper(t).catch((e) => {
        console.error("Kunne ikke hente mappene til Samlingen:", e);
        return [];
      }),
    ]);
  } catch (e) {
    console.error("Kunne ikke hente tekstene til Samlingen:", e);
    alle = null;
  }

  const sp = await searchParams;
  const sok = typeof sp.sok === "string" ? sp.sok.trim() : "";
  const sortering = tolkSortering(sp.sorter);
  const tekster = alle ? filtrerTekster(alle, sok, sortering) : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0">
          <h1>
            <Tusj>Samlingen</Tusj>
          </h1>
          {alle && alle.length > 0 && (
            <p className="mt-1 text-dempet">{alle.length === 1 ? "1 tekst" : `Alle de ${alle.length} tekstene dine`}.</p>
          )}
        </div>
        {alle && alle.length > 0 && (
          <Link href="/ny" className={`ml-auto ${KNAPP_SEKUNDAER}`}>
            + Ny tekst
          </Link>
        )}
      </div>

      {alle !== null && <Mapper mapper={mapper} />}

      {alle === null ? (
        <Hentefeil igjen="/samling" />
      ) : alle.length === 0 ? (
        <div className="mt-8">
          <p>Du har ingen tekster ennå.</p>
          <p className="mt-4">
            <Link href="/ny" className={KNAPP_PRIMAER}>
              + Ny tekst
            </Link>
          </p>
        </div>
      ) : (
        <>
          {alle.length > 1 && (
            // FR-36: et vanlig skjema til samme adresse, så det virker uten JavaScript.
            <form role="search" action="/samling" className="mt-8 flex flex-wrap items-end gap-3">
              <div className="flex min-w-0 grow basis-64 flex-col">
                <label htmlFor="sok" className="font-bold">
                  Søk i titlene
                </label>
                <input id="sok" name="sok" type="search" defaultValue={sok} className={`mt-1 w-full ${FELT}`} />
              </div>
              <div className="flex flex-col">
                <label htmlFor="sorter" className="font-bold">
                  Sorter
                </label>
                <select id="sorter" name="sorter" defaultValue={sortering} className={`mt-1 ${FELT}`}>
                  <option value="nyest">Nyeste først</option>
                  <option value="eldst">Eldste først</option>
                </select>
              </div>
              <button type="submit" className={KNAPP_SEKUNDAER}>
                Vis
              </button>
            </form>
          )}

          {tekster.length === 0 ? (
            <p className="mt-8">
              Ingen titler inneholder «{sok}».{" "}
              <Link href="/samling" className={`inline-flex min-h-11 items-center font-bold ${LENKE}`}>
                Vis alle
              </Link>
            </p>
          ) : (
            <ul className="mt-8 divide-y divide-kant border-y border-kant">
              {tekster.map((b) => {
                const steg = nesteSteg(b, konto);
                return (
                  <li key={b.id} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 py-5">
                    <div className="min-w-0 basis-80 grow">
                      <h2 className="text-[1.5rem] [overflow-wrap:anywhere]">
                        <Link href={steg.href} aria-describedby={`steg-${b.id}`} className={LENKE}>
                          {b.tittel}
                        </Link>
                      </h2>
                      <p className="mt-1 text-dempet">
                        {tilstandsord(b.tilstand)} · lagt inn {DATO.format(b.opprettet)}
                      </p>
                      <p id={`steg-${b.id}`} className="mt-1">
                        {steg.tekst}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <SlettTekstKnapp tekstId={b.id} tittel={b.tittel} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </main>
  );
}

/**
 * FR-50: Mappene øverst i Samlingen (beslutning 19.11). Hver Mappe er en
 * lenke med antall Tekster. Er grensen på 20 nådd, står det i stedet for
 * skjemaet, med hvorfor og hva eleven kan gjøre (§5).
 */
function Mapper({ mapper }: { mapper: Mapperad[] }) {
  return (
    <section id="mapper" aria-labelledby="mapper-tittel" className="mt-8 rounded-lg border border-kant bg-flate p-5">
      <h2 id="mapper-tittel" className="text-[1.75rem]">
        Mappene dine
      </h2>
      <p className="mt-1 text-dempet">
        Samle tekstene til samme prøve, og øv på øvekortene og quizene deres samlet.
      </p>
      {mapper.length > 0 && (
        <ul className="mt-4 divide-y divide-kant border-y border-kant">
          {mapper.map((m) => (
            <li key={m.id} className="flex flex-wrap items-baseline justify-between gap-x-4 py-2">
              <Link href={`/mappe/${m.id}`} className={`inline-flex min-h-11 items-center text-[1.25rem] font-bold [overflow-wrap:anywhere] ${LENKE}`}>
                {m.tittel}
              </Link>
              <span className="text-dempet">{m.antallTekster === 1 ? "1 tekst" : `${m.antallTekster} tekster`}</span>
            </li>
          ))}
        </ul>
      )}
      {mapper.length >= MAPPEGRENSER.mapper ? (
        <p className="mt-4">
          Du har {MAPPEGRENSER.mapper} mapper, og det er flest LeseBuddy tar, så Samlingen holder seg oversiktlig.
          Slett en mappe du ikke bruker lenger, så kan du lage en ny.
        </p>
      ) : (
        <NyMappeSkjema handling={opprettMappeHandling} />
      )}
    </section>
  );
}
