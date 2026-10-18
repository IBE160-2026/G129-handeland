/**
 * Minnevers og Suno-prompt — FR-30 og FR-31.
 *
 * Eleven ser hvilket av de to hun får (fanene øverst), og kan be om det
 * andre. Oppfordringen om å sjekke verset mot teksten står over verset, ikke
 * under det: den skal leses før verset pugges (FR-31).
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hentBegrepssett } from "../../../../data/begrepssett";
import { tilgang } from "../../../../data/konto";
import { hentMinnevers } from "../../../../data/minnevers";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { MIN_FAGUTTRYKK, type Versform } from "../../../../generatorer/minnevers";
import { lagVers } from "../../../handlinger";
import { Kopier } from "../../../komponenter/Kopier";
import { HandlingSkjema } from "../../../komponenter/Skjemaer";

const LENKE =
  "underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100";

const NAVN: Record<Versform, string> = { vers: "Minnevers", suno: "Suno-prompt" };

export default async function Minnevers({ params, searchParams }: PageProps<"/tekst/[id]/minnevers">) {
  // FR-35: hentes før noen try-blokk, se data/konto.ts.
  const t = await tilgang();
  const { id } = await params;
  const form: Versform = (await searchParams).form === "suno" ? "suno" : "vers";

  let tekst;
  try {
    tekst = await hentTekst(t, id);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }
  if (tekst.tilstand !== "laast") redirect(`/tekst/${id}/aktivering`);

  const [lagret, sett] = await Promise.all([hentMinnevers(t, id), hentBegrepssett(t, id)]);
  const valgt = lagret[form];
  const forFaa = (sett?.begreper.length ?? 0) < MIN_FAGUTTRYKK;
  const annen: Versform = form === "vers" ? "suno" : "vers";

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm">
        <Link href={`/tekst/${id}/oppgaver`} className={LENKE}>
          ← Til oppgavene
        </Link>
      </p>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Huskeregel: {tekst.tittel}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Et kort rim med fagordene fra teksten — som vers, eller som sangtekst du kan lage musikk av i Suno.
      </p>

      <nav aria-label="Velg form" className="mt-6 flex gap-2 border-b border-slate-300 dark:border-slate-700">
        {(["vers", "suno"] as const).map((f) => (
          <Link
            key={f}
            href={f === "vers" ? `/tekst/${id}/minnevers` : `/tekst/${id}/minnevers?form=suno`}
            aria-current={f === form ? "page" : undefined}
            className="-mb-px rounded-t-md border border-transparent px-4 py-2 font-medium aria-[current=page]:border-slate-300 aria-[current=page]:border-b-white aria-[current=page]:bg-white dark:aria-[current=page]:border-slate-700 dark:aria-[current=page]:border-b-slate-950 dark:aria-[current=page]:bg-slate-950"
          >
            {NAVN[f]}
          </Link>
        ))}
      </nav>

      {forFaa ? (
        <p className="mt-6 rounded-md border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          Teksten har for få fagord til en huskeregel — det trengs minst {MIN_FAGUTTRYKK}. Øvekortene og quizen
          virker like godt.
        </p>
      ) : valgt === null ? (
        <section className="mt-6">
          <p>
            {form === "vers"
              ? "Lesevenn lager et vers på fire til åtte linjer med minst tre av fagordene."
              : "Lesevenn lager en sangtekst og en stilbeskrivelse du kan lime rett inn i Suno. Lesevenn lager ikke musikken selv."}
          </p>
          <HandlingSkjema
            handling={lagVers.bind(null, id, form)}
            venter={form === "vers" ? "Lager verset…" : "Lager Suno-prompten…"}
            klar={form === "vers" ? "Lag et minnevers" : "Lag en Suno-prompt"}
          />
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

          {form === "suno" && (
            <>
              <h2 className="mt-6 font-semibold">Stil</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Lim inn i feltet «Style of Music» i Suno.</p>
              <p className="mt-2 rounded-md bg-slate-100 p-3 font-mono text-sm dark:bg-slate-900">{valgt.stil}</p>
              <div className="mt-2">
                <Kopier tekst={valgt.stil} hva="Stilen" />
              </div>
              <h2 className="mt-6 font-semibold">Sangtekst</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Lim inn i feltet «Lyrics».</p>
            </>
          )}

          <blockquote className="mt-3 border-l-4 border-slate-300 pl-4 text-lg leading-relaxed dark:border-slate-700">
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
            <Kopier tekst={valgt.linjer.join("\n")} hva={form === "suno" ? "Sangteksten" : "Verset"} />
          </div>

          <p className="mt-6 text-sm">
            <span className="font-medium">Fagord i verset:</span> {valgt.faguttrykk.join(", ")}
          </p>

          <div className="mt-6 flex flex-wrap items-start gap-x-6">
            <HandlingSkjema
              handling={lagVers.bind(null, id, form)}
              venter={form === "vers" ? "Lager et nytt vers…" : "Lager en ny Suno-prompt…"}
              klar={form === "vers" ? "Lag et nytt vers" : "Lag en ny Suno-prompt"}
            />
          </div>
          <p className="mt-4 text-sm">
            <Link
              href={annen === "vers" ? `/tekst/${id}/minnevers` : `/tekst/${id}/minnevers?form=suno`}
              className={LENKE}
            >
              Vil du heller ha {annen === "vers" ? "et vanlig minnevers" : "en Suno-prompt"}?
            </Link>
          </p>
          <p className="mt-8 text-xs text-slate-500">
            Laget av {valgt.modell}, prompt {valgt.promptversjon}. Fagordene er kontrollert mot fagordene i teksten;
            påstandene er ikke det.
          </p>
        </section>
      )}
    </main>
  );
}
