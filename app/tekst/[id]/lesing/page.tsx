/**
 * Lesevisningen — FR-9.
 *
 * Den viktigste flaten i appen, og §5 sier at lesbarhet har forrang over pynt:
 * linjelengde rundt 70 tegn, romslig linjeavstand, høy kontrast, og ingen
 * informasjon formidlet ved farge alene.
 *
 * Markeringene kommer fra det LAGREDE forekomstsettet (AD-13). Siden søker
 * ikke etter uttrykkene selv — se begrunnelsen i `MarkertAvsnitt`.
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hentBegrepssett } from "../../../../data/begrepssett";
import { innloggingKlar, tilgang } from "../../../../data/konto";
import { IkkeFunnet, hentAvsnitt, hentTekst } from "../../../../data/tilgang";
import { MarkertAvsnitt } from "../../../komponenter/MarkertAvsnitt";
import { IkkeKlar } from "../../../komponenter/IkkeKlar";

export default async function Lesing({
  params,
}: PageProps<"/tekst/[id]/lesing">) {
  // FR-35: ingen datatilgang uten noe som kan gi en Tilgang. Se konto.ts.
  if (!innloggingKlar()) return <IkkeKlar />;

  const { id } = await params;
  const t = tilgang();

  let tekst;
  try {
    tekst = await hentTekst(t, id);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }

  if (tekst.tilstand !== "laast") redirect(`/tekst/${id}/aktivering`);

  const [avsnitt, sett] = await Promise.all([
    hentAvsnitt(t, id),
    hentBegrepssett(t, id),
  ]);

  // Forekomstene grupperes per avsnitt én gang, framfor å filtreres på nytt
  // for hvert avsnitt som tegnes.
  const perAvsnitt = new Map<
    number,
    { start: number; slutt: number; begrepId: string; uttrykk: string }[]
  >();

  for (const b of sett?.begreper ?? []) {
    for (const f of b.forekomster) {
      const liste = perAvsnitt.get(f.avsnittNummer) ?? [];
      liste.push({
        start: f.start,
        slutt: f.slutt,
        begrepId: b.id,
        uttrykk: b.uttrykk,
      });
      perAvsnitt.set(f.avsnittNummer, liste);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Steg 3 av 3 — les teksten
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {tekst.tittel}
      </h1>

      <div className="mt-8 gap-10 lg:flex">
        {/* Linjelengden holdes på ca. 70 tegn med max-w-[34rem] (§5). */}
        <article className="max-w-[34rem] text-lg leading-[1.8]">
          {avsnitt.map((a) => (
            <MarkertAvsnitt
              key={a.nummer}
              innhold={a.innhold}
              erOverskrift={a.erOverskrift}
              markeringer={perAvsnitt.get(a.nummer) ?? []}
            />
          ))}
        </article>

        <aside className="mt-10 shrink-0 lg:mt-0 lg:w-72">
          <h2 className="font-semibold tracking-tight">Fagord i teksten</h2>

          {sett === null ? (
            /*
             * Teksten kan være låst uten Begrepssett: låsingen og
             * modellkallet kan feile hver for seg. §5 krever en vei videre,
             * ikke en tom liste uten forklaring.
             */
            <div className="mt-3 rounded-md border border-slate-300 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
              <p>Fagordene er ikke funnet ennå.</p>
              <p className="mt-2">
                Det kan være at det gikk galt under genereringen. Du kan lese
                teksten uten markeringer i mellomtiden — den er den samme.
              </p>
            </div>
          ) : sett.begreper.length === 0 ? (
            /*
             * FR-7: tomt Begrepssett sies rett ut. Funksjonen degraderer
             * ærlig framfor å produsere noe for å ha noe å vise.
             */
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Det ble ikke funnet fagbegreper i denne teksten. Du kan lese
              videre uten markeringer.
            </p>
          ) : (
            <dl className="mt-3 space-y-4">
              {sett.begreper.map((b) => (
                <div key={b.id}>
                  <dt className="font-medium">{b.uttrykk}</dt>
                  {/*
                    Id-en her er den MarkertAvsnitt peker på med
                    aria-describedby, slik at en skjermleser får forklaringen
                    når markeringen i teksten får fokus.
                  */}
                  <dd
                    id={`forklaring-${b.id}`}
                    className="text-sm text-slate-700 dark:text-slate-300"
                  >
                    {b.forklaring}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {sett && (
            /*
             * AD-4: promptversjon og modell stemples på alt generert. Her er
             * de synlige. Det er ikke pynt — det er sporbarheten FR-39 og
             * FR-40 krever, og det gjør at en rar markering kan knyttes til
             * hvilken promptversjon som lagde den.
             */
            <p className="mt-8 text-xs text-slate-500">
              Fagordene er funnet av {sett.modell}, prompt {sett.promptversjon}.
              Lesevenn kan ta feil — teksten er kilden.
            </p>
          )}
        </aside>
      </div>

      <p className="mt-12 text-sm">
        <Link
          href="/"
          className="underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100"
        >
          Tilbake til tekstene dine
        </Link>
      </p>
    </main>
  );
}
