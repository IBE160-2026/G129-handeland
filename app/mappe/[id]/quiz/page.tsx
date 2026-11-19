/**
 * Samlet quiz — FR-52. Spørsmålene Tekstene i Mappen alt har.
 *
 * Eleven velger lengden ved start (beslutning 19.11): Kort, Middels eller
 * Alle, som er 2, 4 eller 8 spørsmål per Tekst. Utvalget er fast for hver
 * lengde (`velgSporsmal`). Lengden står i adressen (`?lengde=`), så valget er
 * vanlige lenker som virker uten JavaScript.
 *
 * Som tekstquizen hentes fasiten her på serveren, men sendes ikke videre:
 * `Quiz` får bare spørsmål og alternativer, og rettingen skjer i
 * `leverMappequiz`. Ingen generator kalles; Tekster uten quiz står under.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { tilgang } from "../../../../data/konto";
import {
  hentMappe,
  hentMappequiz,
  LENGDENAVN,
  listMappeforsoek,
  QUIZLENGDER,
  SPORSMAL_PER_TEKST,
  tolkLengde,
  type Mappe,
  type Mappeforsoek,
  type Mappesporsmal,
} from "../../../../data/mapper";
import { IkkeFunnet } from "../../../../data/tilgang";
import { leverMappequiz, vurderMappeKortsvar } from "../../../handlinger";
import { KNAPP_PRIMAER, KNAPP_SEKUNDAER } from "../../../komponenter/knapper";
import { Mangler, quizmangel } from "../../../komponenter/Mappemangler";
import { Quiz, type SporsmalForElev } from "../../../komponenter/Quiz";
import { Tusj } from "../../../komponenter/Tusj";

const DATO = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Oslo",
});

const LENKE = "inline-flex min-h-11 items-center font-bold underline decoration-primaer underline-offset-4";

export default async function Mappequiz({ params, searchParams }: PageProps<"/mappe/[id]/quiz">) {
  // FR-35: hentes før noen try-blokk, se data/konto.ts.
  const t = await tilgang();
  const { id } = await params;
  const lengde = tolkLengde((await searchParams).lengde);

  let mappe: Mappe, forsoek: Mappeforsoek[], sporsmal: Mappesporsmal[];
  try {
    [mappe, forsoek, sporsmal] = await Promise.all([
      hentMappe(t, id),
      listMappeforsoek(t, id),
      lengde ? hentMappequiz(t, id, lengde) : Promise.resolve([]),
    ]);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }

  const medQuiz = mappe.tekster.filter((x) => quizmangel(x) === null);
  const antallFor = (l: (typeof QUIZLENGDER)[number]) =>
    medQuiz.reduce((sum, x) => sum + Math.min(x.antallSporsmal ?? 0, SPORSMAL_PER_TEKST[l]), 0);

  // Nummereres fortløpende i den samlede quizen; Teksten står over hvert spørsmål.
  const forElev: SporsmalForElev[] = sporsmal.map((s, i) => ({
    id: s.id,
    nummer: i + 1,
    sporsmal: s.sporsmal,
    erFlervalg: s.erFlervalg,
    alternativer: s.alternativer,
    tekst: s.tekst,
  }));

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-dempet">Samlet quiz fra mappen</p>
      <h1 className="mt-1 [overflow-wrap:anywhere]">
        Quiz: <Tusj>{mappe.tittel}</Tusj>
      </h1>

      {medQuiz.length === 0 ? (
        <section className="mt-8">
          <p className="rounded-md border border-kant p-5">
            {mappe.tekster.length === 0
              ? "Mappen har ingen tekster ennå, så det finnes ingen spørsmål å sette sammen."
              : "Ingen av tekstene i mappen har quiz ennå. Den samlede quizen bruker spørsmålene tekstene alt har, så lag quizen i en tekst først."}
          </p>
        </section>
      ) : lengde && forElev.length > 0 ? (
        <section className="mt-8">
          <p className="mb-6">
            {LENGDENAVN[lengde]}: {forElev.length} spørsmål fra{" "}
            {medQuiz.length === 1 ? "1 tekst" : `${medQuiz.length} tekster`}.{" "}
            <Link href={`/mappe/${mappe.id}/quiz`} className={LENKE}>
              Velg en annen lengde
            </Link>
          </p>
          <Quiz
            key={lengde}
            sporsmal={forElev}
            lever={leverMappequiz.bind(null, mappe.id, lengde)}
            vurder={vurderMappeKortsvar.bind(null, mappe.id)}
          />
          <p className="mt-8 text-dempet">
            Spørsmålene er de samme som i quizen til hver tekst. LeseBuddy kan ta feil — teksten er kilden.
          </p>
        </section>
      ) : (
        <section className="mt-8" aria-labelledby="lengde-tittel">
          <h2 id="lengde-tittel" className="text-[1.5rem]">
            Hvor lang skal quizen være?
          </h2>
          <p className="mt-1">
            Spørsmålene kommer fra quizene til {medQuiz.length === 1 ? "1 tekst" : `${medQuiz.length} tekster`} i
            mappen. Samme lengde gir de samme spørsmålene hver gang.
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {QUIZLENGDER.map((l) => (
              <li key={l}>
                <Link href={`/mappe/${mappe.id}/quiz?lengde=${l}`} className={`${l === "middels" ? KNAPP_PRIMAER : KNAPP_SEKUNDAER} w-full`}>
                  {LENGDENAVN[l]} — {antallFor(l)} spørsmål
                </Link>
                <p className="mt-1 text-dempet">
                  {l === "alle" ? "Alle spørsmålene fra hver tekst." : `${SPORSMAL_PER_TEKST[l]} spørsmål fra hver tekst.`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Mangler tekster={mappe.tekster} mangel={quizmangel} overskrift="Tekster uten quiz" />

      {forsoek.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[1.5rem]">Tidligere forsøk</h2>
          <ul className="mt-3 divide-y divide-kant">
            {forsoek.map((f) => (
              <li key={f.id} className="flex flex-wrap justify-between gap-x-4 py-2">
                <span className="text-dempet">
                  {DATO.format(f.gjennomfoert)} · {LENGDENAVN[f.lengde]}
                </span>
                <span>
                  {f.antallRiktige} av {f.antallTotalt} riktige
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12">
        <Link href={`/mappe/${mappe.id}`} className={KNAPP_SEKUNDAER}>
          Tilbake til mappen
        </Link>
      </p>
    </main>
  );
}
