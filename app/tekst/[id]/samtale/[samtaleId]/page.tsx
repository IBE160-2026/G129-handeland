/**
 * Fagsamtalen — FR-18 til FR-23.
 *
 * Viser hver runde: spørsmålet, elevens svar, og vurderingen med én setnings
 * begrunnelse (FR-19). Tilstanden vises med navn og ikke bare farge (§5), og
 * aldri som poeng eller karakter (FR-23). Når samtalen er slutt, vises
 * oppsummeringen FR-22 krever — også det som ble godtatt som dekkende, fordi
 * det er elevens siste sjanse til å se at noe glapp.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { hentFagsamtale, oppsummer, type Runde } from "../../../../../data/fagsamtale";
import { tilgang } from "../../../../../data/konto";
import { IkkeFunnet, hentAvsnitt, hentTekst } from "../../../../../data/tilgang";
import { MAKS_RUNDER, type Tilstand } from "../../../../../generatorer/fagsamtale";
import type { Avsnitt } from "../../../../../tekst/avsnittsdeling";
import { svarISamtale } from "../../../../handlinger";
import { AvsluttKnapp, RevurderKnapp, SvarSkjema } from "../../../../komponenter/Samtale";

const TILSTAND: Record<Tilstand, { navn: string; stil: string }> = {
  dekkende: { navn: "Dekkende", stil: "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-950/40" },
  delvis: { navn: "Delvis", stil: "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-950/40" },
  misoppfatning: { navn: "Misoppfatning", stil: "border-rose-500 bg-rose-50 dark:border-rose-500 dark:bg-rose-950/40" },
  uklart: { navn: "Uklart", stil: "border-slate-400 bg-slate-50 dark:border-slate-500 dark:bg-slate-900" },
  utenfor: { navn: "Utenfor tema", stil: "border-slate-400 bg-slate-50 dark:border-slate-500 dark:bg-slate-900" },
};

export default async function Samtaleside({ params }: PageProps<"/tekst/[id]/samtale/[samtaleId]">) {
  // FR-35: hentes før noen try-blokk, se data/konto.ts.
  const t = await tilgang();
  const { id, samtaleId } = await params;

  let tekst, samtale, avsnitt;
  try {
    [tekst, samtale, avsnitt] = await Promise.all([
      hentTekst(t, id),
      hentFagsamtale(t, samtaleId),
      hentAvsnitt(t, id),
    ]);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }
  if (samtale.tekstId !== id) notFound();

  const aktiv = samtale.avsluttet ? undefined : samtale.runder.find((r) => r.elevsvar === null);
  const lenke = (n: number) => `/tekst/${id}/lesing#avsnitt-${n}`;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">Fagsamtale</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{tekst.tittel}</h1>

      {/* FR-23: sagt rett ut, ikke gjemt i en fotnote. */}
      <p className="mt-4 rounded-md border border-slate-300 p-4 text-sm dark:border-slate-700">
        Vurderingene er gjort av en språkmodell. De kan ta feil, og de er ikke en
        vurdering av deg — bare av svaret, sett opp mot teksten. Tror du
        vurderingen misforsto deg, kan du be om at svaret leses på nytt.
      </p>

      <ol className="mt-8 space-y-8">
        {samtale.runder.map((r) => (
          <li key={r.nummer}>
            <RundeVisning r={r} lenke={lenke(r.kildeavsnitt.nummer)} />
            {r.elevsvar !== null && !r.revurdert && (
              <RevurderKnapp samtaleId={samtale.id} nummer={r.nummer} />
            )}
            {aktiv?.nummer === r.nummer && (
              <SvarSkjema handling={svarISamtale.bind(null, samtale.id, r.nummer)} nummer={r.nummer} />
            )}
          </li>
        ))}
      </ol>

      {!samtale.avsluttet && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Høyst {MAKS_RUNDER} spørsmål. Du kan avslutte når du vil.
          </p>
          <AvsluttKnapp samtaleId={samtale.id} />
        </div>
      )}

      {samtale.avsluttet && <OppsummeringVisning runder={samtale.runder} avsnitt={avsnitt} lenke={lenke} />}

      <p className="mt-8 text-xs text-slate-500">
        Laget av {samtale.modell} ({samtale.promptversjon}). Lesevenn kan ta feil — teksten er kilden.
      </p>
      <p className="mt-6 text-sm">
        <Link href={`/tekst/${id}/oppgaver`} className="underline decoration-slate-400 underline-offset-4">
          Tilbake til oppgavene
        </Link>
      </p>
    </main>
  );
}

function RundeVisning({ r, lenke }: { r: Runde; lenke: string }) {
  return (
    <div className="space-y-3">
      <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Spørsmål {r.nummer}
        </p>
        <p className="mt-1 font-medium">{r.sporsmal}</p>
        <Link href={lenke} className="mt-1 inline-block text-sm underline underline-offset-4">
          Les avsnittet spørsmålet handler om
        </Link>
      </div>

      {r.elevsvar !== null && (
        <div className="ml-6 rounded-md border border-slate-300 p-4 dark:border-slate-700">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Ditt svar</p>
          <p className="mt-1 whitespace-pre-wrap">{r.elevsvar}</p>
        </div>
      )}

      {r.svarvurdering && (
        <div className={`ml-6 rounded-md border-l-4 p-4 ${TILSTAND[r.svarvurdering].stil}`}>
          <p className="font-semibold">
            {TILSTAND[r.svarvurdering].navn}
            {r.revurdert && <span className="ml-2 text-sm font-normal">(vurdert på nytt)</span>}
          </p>
          <p className="mt-1">{r.vurderingsbegrunnelse}</p>
        </div>
      )}
    </div>
  );
}

function OppsummeringVisning({
  runder,
  avsnitt,
  lenke,
}: {
  runder: Runde[];
  avsnitt: Avsnitt[];
  lenke: (n: number) => string;
}) {
  const o = oppsummer(runder, avsnitt);
  return (
    <section className="mt-10 rounded-md border border-slate-300 p-5 dark:border-slate-700">
      <h2 className="text-lg font-semibold tracking-tight">Oppsummering</h2>

      <h3 className="mt-4 font-semibold">Delene av teksten dere snakket om</h3>
      {o.berorteDeler.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">Ingen ennå.</p>
      ) : (
        <ul className="mt-1 list-disc pl-6">
          {o.berorteDeler.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}

      <h3 className="mt-4 font-semibold">Det som ikke stemte med teksten</h3>
      {o.misoppfatninger.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">Ingen svar ble vurdert som misoppfatning.</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {o.misoppfatninger.map((r) => (
            <li key={r.nummer}>
              Spørsmål {r.nummer}: {r.vurderingsbegrunnelse}{" "}
              <Link href={lenke(r.kildeavsnitt.nummer)} className="underline underline-offset-4">
                Les avsnittet
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* FR-22: det som ble godtatt, listes også. Modellen kan ha tatt feil. */}
      <h3 className="mt-4 font-semibold">Det som ble godtatt som dekkende</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Se over disse også. Stemmer noe ikke med det du leste, kan vurderingen ha tatt feil.
      </p>
      {o.dekkende.length === 0 ? (
        <p className="mt-1 text-slate-600 dark:text-slate-400">Ingen svar ble vurdert som dekkende.</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {o.dekkende.map((r) => (
            <li key={r.nummer}>
              Spørsmål {r.nummer}: «{r.elevsvar}»{" "}
              <Link href={lenke(r.kildeavsnitt.nummer)} className="underline underline-offset-4">
                Les avsnittet
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
