/**
 * Minnevers — FR-30 og FR-31.
 *
 * Suno-prompten er satt på pause (bestemt av utvikleren 19.10, PRD FR-30):
 * fire linjer er ikke en sang, og tiden er bedre brukt på at versene blir
 * gode. Generatoren kan fortsatt lage formen, så den kan tas tilbake uten å
 * bygges på nytt — men siden tilbyr den ikke.
 *
 * Oppfordringen om å sjekke verset mot teksten står over verset, ikke under
 * det: den skal leses før verset pugges (FR-31). Hver linje lenker til
 * avsnittet den bygger på (§5).
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hentBegrepssett } from "../../../../data/begrepssett";
import { tilgang } from "../../../../data/konto";
import { hentMinnevers } from "../../../../data/minnevers";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { MIN_FAGUTTRYKK } from "../../../../generatorer/minnevers";
import { lagVers } from "../../../handlinger";
import { Kopier } from "../../../komponenter/Kopier";
import { HandlingSkjema } from "../../../komponenter/Skjemaer";

const LENKE =
  "underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100";

export default async function Minnevers({ params }: PageProps<"/tekst/[id]/minnevers">) {
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
  if (tekst.tilstand !== "laast") redirect(`/tekst/${id}/aktivering`);

  const [lagret, sett] = await Promise.all([hentMinnevers(t, id), hentBegrepssett(t, id)]);
  const valgt = lagret.vers;
  const forFaa = (sett?.begreper.length ?? 0) < MIN_FAGUTTRYKK;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm">
        <Link href={`/tekst/${id}/oppgaver`} className={LENKE}>
          ← Til oppgavene
        </Link>
      </p>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Huskeregel: {tekst.tittel}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Et kort rim om én ting fra teksten, med fagordene i — så det sitter.
      </p>

      {forFaa ? (
        <p className="mt-6 rounded-md border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          Teksten har for få fagord til en huskeregel — det trengs minst {MIN_FAGUTTRYKK}. Øvekortene og quizen
          virker like godt.
        </p>
      ) : valgt === null ? (
        <section className="mt-6">
          <p>Lesevenn lager et vers på fire til seks linjer med minst tre av fagordene.</p>
          <HandlingSkjema handling={lagVers.bind(null, id, "vers")} venter="Lager verset…" klar="Lag et minnevers" />
        </section>
      ) : (
        <section className="mt-6">
          {/* FR-31: oppfordringen står før verset, så den leses først. */}
          <p className="rounded-md border border-amber-400 bg-amber-50 p-3 text-sm dark:border-amber-700 dark:bg-amber-950/40">
            <strong>Sjekk verset mot teksten før du pugger det.</strong> Det er laget av en språkmodell, og et rim
            kan bøye sannheten for å rime.{" "}
            <Link href={`/tekst/${id}/lesing`} className={LENKE}>
              Åpne teksten
            </Link>
          </p>

          <blockquote className="mt-6 border-l-4 border-slate-300 pl-4 text-lg leading-relaxed dark:border-slate-700">
            {valgt.linjer.map((l, i) => (
              <p key={i}>
                {l}
                {/* §5: hver linje viser hvor i teksten den kommer fra, så eleven kan sjekke. */}
                {valgt.kildeavsnitt[i] !== undefined && (
                  <>
                    {" "}
                    <Link
                      href={`/tekst/${id}/lesing#avsnitt-${valgt.kildeavsnitt[i]}`}
                      className="align-middle text-sm text-slate-500 underline decoration-slate-300 underline-offset-4 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      avsnitt {valgt.kildeavsnitt[i]}
                    </Link>
                  </>
                )}
              </p>
            ))}
          </blockquote>
          <div className="mt-3">
            <Kopier tekst={valgt.linjer.join("\n")} hva="Verset" />
          </div>

          <p className="mt-6 text-sm">
            <span className="font-medium">Fagord i verset:</span> {valgt.faguttrykk.join(", ")}
          </p>

          <HandlingSkjema handling={lagVers.bind(null, id, "vers")} venter="Lager et nytt vers…" klar="Lag et nytt vers" />
          <p className="mt-8 text-xs text-slate-500">
            Laget av {valgt.modell}, prompt {valgt.promptversjon}. Fagordene og avsnittene er kontrollert mot
            teksten; påstandene er det ikke.
          </p>
        </section>
      )}
    </main>
  );
}
