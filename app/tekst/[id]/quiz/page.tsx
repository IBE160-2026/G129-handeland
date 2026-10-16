/**
 * Quizen — FR-13, FR-14, FR-15. Steg 4 i Kjerneløypen.
 *
 * Fasiten hentes her på serveren, men sendes ikke videre: `Quiz` får bare
 * spørsmål og alternativer. Rettingen skjer i `leverQuiz`.
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { tilgang } from "../../../../data/konto";
import { hentQuiz, listForsoek } from "../../../../data/quiz";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { lagQuiz } from "../../../handlinger";
import { Quiz, type SporsmalForElev } from "../../../komponenter/Quiz";
import { LagQuizSkjema } from "../../../komponenter/Skjemaer";

const DATO = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Oslo",
});

export default async function Quizside({ params }: PageProps<"/tekst/[id]/quiz">) {
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

  const [quiz, forsoek] = await Promise.all([hentQuiz(t, id), listForsoek(t, id)]);

  const forElev: SporsmalForElev[] =
    quiz?.sporsmal.map((s) => ({
      id: s.id,
      nummer: s.nummer,
      sporsmal: s.sporsmal,
      erFlervalg: s.erFlervalg,
      alternativer: s.alternativer,
    })) ?? [];

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">Steg 4 av 4 — sjekk forståelsen</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Quiz: {tekst.tittel}</h1>

      {quiz === null ? (
        <section className="mt-8">
          <p>
            Quizen har åtte spørsmål om teksten. Alle kan besvares fra teksten
            alene, og for hvert spørsmål du ikke får til, ser du hvor svaret står.
          </p>
          <div className="mt-6">
            <LagQuizSkjema handling={lagQuiz.bind(null, id)} />
          </div>
        </section>
      ) : (
        <section className="mt-8">
          <Quiz tekstId={id} sporsmal={forElev} />
          <p className="mt-8 text-xs text-slate-500">
            Spørsmålene er laget av {quiz.modell}, prompt {quiz.promptversjon}.
            Lesevenn kan ta feil — teksten er kilden.
          </p>
        </section>
      )}

      {forsoek.length > 0 && (
        <section className="mt-12">
          <h2 className="font-semibold tracking-tight">Tidligere forsøk</h2>
          <ul className="mt-3 divide-y divide-slate-200 dark:divide-slate-800">
            {forsoek.map((f) => (
              <li key={f.id} className="flex justify-between py-2">
                <span className="text-slate-600 dark:text-slate-400">{DATO.format(f.gjennomfoert)}</span>
                <span>
                  {f.antallRiktige} av {f.antallTotalt} riktige
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-sm">
        <Link
          href={`/tekst/${id}/oppgaver`}
          className="underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100"
        >
          Tilbake til oppgavene
        </Link>
      </p>
    </main>
  );
}
