/**
 * Hva PDF-uttrekket gjorde, vist i gjennomsynet — FR-2, FR-3, PF-4.
 *
 * FR-2: fjernede linjer er synlige for eleven, ikke slettet i det skjulte.
 * FR-3: en tellet oppsummering av sider, fjernede linjer og orddelinger, og
 * varsel om tabeller og formler. PF-4: spaltetekst kan komme i feil
 * rekkefølge, og det oppdages ikke automatisk — derfor sies det her, der
 * eleven kan rette det.
 *
 * Ren visning uten tilstand, så pdf.test.ts kan tegne den.
 */

import type { Innlesingsrapport as Rapport } from "../../opplasting/pdf-les";

export function Innlesingsrapport({ rapport }: { rapport: Rapport }) {
  const fjernet = rapport.fjernedeLinjer;
  return (
    <section aria-label="Hva Lesevenn gjorde med PDF-en" className="mt-6 rounded-md border border-slate-300 p-4 text-sm dark:border-slate-700">
      <p className="font-medium">Fra PDF-en</p>
      <ul className="mt-2 list-disc pl-5">
        <li>
          {rapport.sider} {rapport.sider === 1 ? "side" : "sider"} lest
        </li>
        <li>
          {fjernet.length} {fjernet.length === 1 ? "linje" : "linjer"} fjernet som topp- eller bunntekst
          {fjernet.length > 0 && (
            <details className="mt-1">
              <summary className="cursor-pointer underline underline-offset-4">Se hvilke</summary>
              <ul className="mt-1 list-[circle] pl-5 text-slate-600 dark:text-slate-400">
                {[...new Set(fjernet)].map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="mt-1 text-slate-600 dark:text-slate-400">
                Var noe av dette en del av teksten, kan du skrive det inn igjen under.
              </p>
            </details>
          )}
        </li>
        <li>
          {rapport.sammenslaatteOrddelinger} orddelinger slått sammen (som «informa-» og «sjon» til «informasjon»)
        </li>
      </ul>
      <p className="mt-3" data-pf4>
        <strong>Les gjennom rekkefølgen.</strong> Har siden tekst i flere spalter, kan avsnittene ha kommet i feil
        rekkefølge, og to spalter kan ha blitt flettet sammen.
      </p>
      {rapport.muligTabellEllerFormel && (
        <p className="mt-2" data-tabell>
          <strong>Teksten ser ut til å ha tabeller eller formler.</strong> Slikt innhold overlever sjelden
          uttrekket fra en PDF — se ekstra nøye etter det.
        </p>
      )}
    </section>
  );
}
