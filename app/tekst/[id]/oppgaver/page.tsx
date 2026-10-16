/**
 * Oppgavene til en Tekst: Quiz og Fagsamtale side om side.
 *
 * FR-18: Fagsamtale er et alternativ til Quiz, ikke bare noe som kommer
 * etter. Derfor står de som to likeverdige valg, og ingen av dem er låst bak
 * den andre.
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { listFagsamtaler } from "../../../../data/fagsamtale";
import { tilgang } from "../../../../data/konto";
import { hentQuiz, listForsoek } from "../../../../data/quiz";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { startFagsamtale } from "../../../handlinger";
import { StartSamtaleSkjema } from "../../../komponenter/Samtale";

const DATO = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Oslo",
});

const LENKE =
  "font-medium underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100";

export default async function Oppgaver({ params }: PageProps<"/tekst/[id]/oppgaver">) {
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

  const [quiz, forsoek, samtaler] = await Promise.all([
    hentQuiz(t, id),
    listForsoek(t, id),
    listFagsamtaler(t, id),
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">Steg 4 av 4 — sjekk forståelsen</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Oppgaver: {tekst.tittel}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Velg det som passer deg. Du kan gjøre begge, i den rekkefølgen du vil.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-md border border-slate-300 p-5 dark:border-slate-700">
          <h2 className="text-lg font-semibold tracking-tight">Quiz</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Åtte spørsmål om teksten. For hvert du ikke får til, ser du hvor
            svaret står.
          </p>
          <p className="mt-4">
            <Link href={`/tekst/${id}/quiz`} className={LENKE}>
              {quiz === null ? "Ta quizen" : forsoek.length > 0 ? "Ta quizen igjen" : "Fortsett til quizen"}
            </Link>
          </p>
          {forsoek[0] && (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Siste forsøk: {forsoek[0].antallRiktige} av {forsoek[0].antallTotalt} riktige
            </p>
          )}
        </section>

        <section className="rounded-md border border-slate-300 p-5 dark:border-slate-700">
          <h2 className="text-lg font-semibold tracking-tight">Fagsamtale</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Forklar teksten med egne ord. Lesevenn leser svaret ditt og stiller
            neste spørsmål ut fra det du skrev.
          </p>
          <div className="mt-4">
            <StartSamtaleSkjema handling={startFagsamtale.bind(null, id)} />
          </div>
          {samtaler.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold">Tidligere samtaler</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {samtaler.map((s) => (
                  <li key={s.id}>
                    <Link href={`/tekst/${id}/samtale/${s.id}`} className="underline underline-offset-4">
                      {DATO.format(s.opprettet)}
                    </Link>{" "}
                    <span className="text-slate-600 dark:text-slate-400">
                      — {s.antallRunder} svar{s.avsluttet ? ", avsluttet" : ", pågår"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      <p className="mt-12 text-sm">
        <Link href={`/tekst/${id}/lesing`} className="underline decoration-slate-400 underline-offset-4">
          Tilbake til teksten
        </Link>
      </p>
    </main>
  );
}
