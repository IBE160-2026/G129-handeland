/**
 * Mappen — FR-50. Tekstene i Mappen, og de to samlede aktivitetene:
 * Øvekort (FR-51) og Quiz (FR-52).
 *
 * Siden lager ingenting. Hver Tekst står med hva den har og hva den mangler,
 * med lenke til Teksten der det lages.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { tilgang } from "../../../data/konto";
import { hentMappe, MAPPEGRENSER, type Mappe } from "../../../data/mapper";
import { IkkeFunnet, listTekster, type TekstRad } from "../../../data/tilgang";
import { fjernFraMappe, giMappeNyttNavn, leggTilIMappe } from "../../handlinger";
import { KNAPP_PRIMAER, KNAPP_SEKUNDAER } from "../../komponenter/knapper";
import { kortmangel, quizmangel } from "../../komponenter/Mappemangler";
import {
  FjernFraMappeKnapp,
  LeggTilTekstSkjema,
  NyttNavnSkjema,
  SlettMappeKnapp,
} from "../../komponenter/Mappeskjemaer";
import { Tusj } from "../../komponenter/Tusj";

const LENKE = "underline decoration-primaer underline-offset-4";

export default async function Mappeside({ params }: PageProps<"/mappe/[id]">) {
  // FR-35: hentes før noen try-blokk, se data/konto.ts.
  const t = await tilgang();
  const { id } = await params;

  let mappe: Mappe, alle: TekstRad[];
  try {
    [mappe, alle] = await Promise.all([hentMappe(t, id), listTekster(t)]);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }

  const antallKort = mappe.tekster.reduce((sum, x) => sum + (x.tilstand === "laast" ? (x.antallFagord ?? 0) : 0), 0);
  const medQuiz = mappe.tekster.filter((x) => quizmangel(x) === null).length;
  const erMed = new Set(mappe.tekster.map((x) => x.id));
  const full = mappe.tekster.length >= MAPPEGRENSER.tekster;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-dempet">Mappe</p>
      <h1 className="mt-1 [overflow-wrap:anywhere]">
        <Tusj>{mappe.tittel}</Tusj>
      </h1>
      <p className="mt-2 text-dempet">
        {mappe.tekster.length === 0
          ? "Ingen tekster ennå."
          : mappe.tekster.length === 1
            ? "1 tekst."
            : `${mappe.tekster.length} tekster.`}
      </p>

      {/* FR-51 og FR-52: de samlede aktivitetene. Bare det tekstene alt har, brukes. */}
      <section aria-labelledby="oev-tittel" className="mt-8">
        <h2 id="oev-tittel" className="text-[1.75rem]">
          Øv samlet
        </h2>
        {mappe.tekster.length === 0 ? (
          <p className="mt-2">Legg tekster i mappen under, så kan du øve på øvekortene og quizene deres samlet.</p>
        ) : (
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            <li className="rounded-lg border border-kant bg-flate p-5">
              <h3 className="text-[1.5rem]">Øvekort</h3>
              {antallKort > 0 ? (
                <>
                  <p className="mt-1">
                    {antallKort === 1 ? "1 kort" : `${antallKort} kort`} fra tekstene i mappen. Merker du et kort her,
                    er det merket i teksten også.
                  </p>
                  <p className="mt-3">
                    <Link href={`/mappe/${mappe.id}/oevekort`} className={KNAPP_PRIMAER}>
                      Øv på øvekortene
                    </Link>
                  </p>
                </>
              ) : (
                <p className="mt-1">
                  Ingen av tekstene har øvekort ennå. Under ser du hva hver tekst mangler.
                </p>
              )}
            </li>
            <li className="rounded-lg border border-kant bg-flate p-5">
              <h3 className="text-[1.5rem]">Quiz</h3>
              {medQuiz > 0 ? (
                <>
                  <p className="mt-1">
                    Spørsmål fra {medQuiz === 1 ? "1 tekst" : `${medQuiz} tekster`} med quiz. Du velger hvor lang
                    quizen skal være.
                  </p>
                  <p className="mt-3">
                    <Link href={`/mappe/${mappe.id}/quiz`} className={KNAPP_PRIMAER}>
                      Ta den samlede quizen
                    </Link>
                  </p>
                </>
              ) : (
                <p className="mt-1">
                  Ingen av tekstene har quiz ennå. Lag quizen i en tekst, så kommer spørsmålene hit. Under ser du
                  hva hver tekst mangler.
                </p>
              )}
            </li>
          </ul>
        )}
      </section>

      <section aria-labelledby="tekster-tittel" className="mt-10">
        <h2 id="tekster-tittel" className="text-[1.75rem]">
          Tekstene i mappen
        </h2>
        {mappe.tekster.length > 0 && (
          <ul className="mt-3 divide-y divide-kant border-y border-kant">
            {mappe.tekster.map((x) => {
              const kort = kortmangel(x);
              const quiz = quizmangel(x);
              return (
                <li key={x.id} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2 py-4">
                  <div className="min-w-0 basis-72 grow">
                    <h3 className="text-[1.375rem] [overflow-wrap:anywhere]">
                      <Link href={x.tilstand === "laast" ? `/tekst/${x.id}/oppgaver` : `/tekst/${x.id}/aktivering`} className={LENKE}>
                        {x.tittel}
                      </Link>
                    </h3>
                    <ul className="mt-1 space-y-1">
                      <li>
                        Øvekort:{" "}
                        {kort ? (
                          <>
                            {kort.tekst}{" "}
                            <Link href={kort.lenke.href} className={`inline-flex min-h-11 items-center font-bold ${LENKE}`}>
                              {kort.lenke.tekst}
                              <span className="sr-only"> «{x.tittel}»</span>
                            </Link>
                          </>
                        ) : (
                          `${x.antallFagord} kort.`
                        )}
                      </li>
                      <li>
                        Quiz:{" "}
                        {quiz ? (
                          <>
                            {quiz.tekst}{" "}
                            <Link href={quiz.lenke.href} className={`inline-flex min-h-11 items-center font-bold ${LENKE}`}>
                              {quiz.lenke.tekst}
                              <span className="sr-only"> «{x.tittel}»</span>
                            </Link>
                          </>
                        ) : (
                          `${x.antallSporsmal} spørsmål.`
                        )}
                      </li>
                    </ul>
                  </div>
                  <FjernFraMappeKnapp handling={fjernFraMappe.bind(null, mappe.id, x.id)} tittel={x.tittel} />
                </li>
              );
            })}
          </ul>
        )}

        <h3 className="mt-6 text-[1.375rem]">Legg til en tekst</h3>
        {alle.length === 0 ? (
          <p className="mt-2">
            Du har ingen tekster ennå.{" "}
            <Link href="/ny" className={`inline-flex min-h-11 items-center font-bold ${LENKE}`}>
              Legg inn en ny tekst
            </Link>
          </p>
        ) : full ? (
          <p className="mt-2">
            Mappen har {MAPPEGRENSER.tekster} tekster, og det er flest en mappe kan ha, så den samlede quizen holder
            seg kort nok til én økt. Ta ut en tekst, eller lag en ny mappe i{" "}
            <Link href="/samling#mapper" className={`inline-flex min-h-11 items-center font-bold ${LENKE}`}>
              Samlingen
            </Link>
            .
          </p>
        ) : alle.every((x) => erMed.has(x.id)) ? (
          <p className="mt-2">Alle tekstene dine er med i mappen.</p>
        ) : (
          <LeggTilTekstSkjema
            handling={leggTilIMappe.bind(null, mappe.id)}
            tekster={alle.map((x) => ({ id: x.id, tittel: x.tittel, erMed: erMed.has(x.id) }))}
          />
        )}
      </section>

      <section aria-labelledby="om-tittel" className="mt-10 border-t border-kant pt-6">
        <h2 id="om-tittel" className="sr-only">
          Om mappen
        </h2>
        <NyttNavnSkjema handling={giMappeNyttNavn.bind(null, mappe.id)} tittel={mappe.tittel} />
        <div className="mt-2">
          <SlettMappeKnapp mappeId={mappe.id} tittel={mappe.tittel} />
        </div>
      </section>

      <p className="mt-10">
        <Link href="/samling#mapper" className={`${KNAPP_SEKUNDAER}`}>
          Tilbake til Samlingen
        </Link>
      </p>
    </main>
  );
}
