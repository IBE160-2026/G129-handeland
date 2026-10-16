"use client";

/**
 * Gjennomgang av Øvekort — FR-16, FR-17.
 *
 * Forsiden viser Faguttrykket, baksiden forklaringen og Kildeavsnittet.
 * Eleven kan snu, gå fram og tilbake, og merke «kan» eller «må øve mer».
 * Merkingen lagres med en gang, så en ny økt starter der forrige sluttet:
 * på første kort i runden som ikke er merket.
 *
 * Alt er knapper, så runden kan tas med tastatur alene (§5).
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Merking, Oevekort as Kort } from "../../data/oevekort";
import { merkKort } from "../handlinger";
import { Feilmelding } from "./Feilmelding";

type Modus = "alle" | "maa_oeve";

const KNAPP =
  "rounded-md border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800";
const VALGT = "border-slate-900 bg-slate-900 text-white hover:bg-slate-700 dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900";

function startIndeks(runde: Kort[], merking: Record<string, Merking | null>): number {
  const i = runde.findIndex((k) => !merking[k.id]);
  return i === -1 ? 0 : i;
}

export function Oevekort({ tekstId, kort }: { tekstId: string; kort: Kort[] }) {
  const [merking, setMerking] = useState<Record<string, Merking | null>>(() =>
    Object.fromEntries(kort.map((k) => [k.id, k.merking])),
  );
  const [modus, setModus] = useState<Modus>("alle");
  // Runden er fast mens den pågår: et kort som merkes «kan» underveis i en
  // «må øve»-runde, skal ikke forsvinne under eleven.
  const [runde, setRunde] = useState<Kort[]>(kort);
  const [indeks, setIndeks] = useState(() => startIndeks(kort, Object.fromEntries(kort.map((k) => [k.id, k.merking]))));
  const [snudd, setSnudd] = useState(false);
  const [ferdig, setFerdig] = useState(false);
  const [feil, setFeil] = useState<{ melding: string; handling: string } | null>(null);

  const telling = useMemo(() => {
    const v = Object.values(merking);
    return {
      kan: v.filter((m) => m === "kan").length,
      maaOeve: v.filter((m) => m === "maa_oeve").length,
      ikke: v.filter((m) => !m).length,
    };
  }, [merking]);

  const gjeldende = runde[indeks];

  function gaaTil(i: number) {
    setSnudd(false);
    if (i >= runde.length) setFerdig(true);
    else setIndeks(Math.max(0, i));
  }

  async function merk(m: Merking) {
    if (!gjeldende) return;
    const forrige = merking[gjeldende.id];
    const ny = forrige === m ? null : m; // trykk igjen for å angre
    setMerking((x) => ({ ...x, [gjeldende.id]: ny }));
    setFeil(null);
    const r = await merkKort(tekstId, gjeldende.id, ny);
    if (r.feil) {
      setMerking((x) => ({ ...x, [gjeldende.id]: forrige }));
      setFeil(r.feil);
      return;
    }
    if (ny !== null) gaaTil(indeks + 1);
  }

  function nyRunde(m: Modus) {
    const utvalg = m === "alle" ? kort : kort.filter((k) => merking[k.id] === "maa_oeve");
    setModus(m);
    setRunde(utvalg);
    setIndeks(0);
    setSnudd(false);
    setFerdig(false);
  }

  if (ferdig || !gjeldende) {
    return (
      <section role="status" className="rounded-md border border-slate-300 p-6 dark:border-slate-700">
        <h2 className="text-xl font-semibold tracking-tight">Runden er ferdig</h2>
        <p className="mt-2">
          Du kan {telling.kan} av {kort.length} fagord.
          {telling.maaOeve > 0 && ` ${telling.maaOeve} vil du øve mer på.`}
          {telling.ikke > 0 && ` ${telling.ikke} er ikke merket.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {telling.maaOeve > 0 && (
            <button type="button" onClick={() => nyRunde("maa_oeve")} className={`${KNAPP} ${VALGT}`}>
              Øv på de {telling.maaOeve} du ikke kan ennå
            </button>
          )}
          <button type="button" onClick={() => nyRunde("alle")} className={KNAPP}>
            Gå gjennom alle igjen
          </button>
        </div>
      </section>
    );
  }

  const m = merking[gjeldende.id];

  return (
    <section aria-label="Øvekort">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-slate-600 dark:text-slate-400">
        <p>
          Kort {indeks + 1} av {runde.length}
          {modus === "maa_oeve" && " — bare de du vil øve mer på"}
        </p>
        <p>
          Kan: {telling.kan} · Må øve: {telling.maaOeve} · Ikke merket: {telling.ikke}
        </p>
      </div>

      {/*
        Kortet. aria-live, så skjermleseren leser baksiden når den snus.

        Knappen har med vilje INGEN aria-label. En slik etikett erstatter
        innholdet for skjermleseren, og da hørte eleven «Snu kortet og se
        forklaringen» — aldri selve fagordet. Funnet av axe-core 16.10.
      */}
      <button
        type="button"
        onClick={() => setSnudd((s) => !s)}
        aria-pressed={snudd}
        className="mt-3 block min-h-56 w-full rounded-lg border-2 border-slate-300 bg-white p-6 text-left shadow-sm hover:border-slate-500 focus:outline-2 focus:outline-offset-4 focus:outline-slate-900 dark:border-slate-600 dark:bg-slate-900"
      >
        <div aria-live="polite">
          {!snudd ? (
            <div className="flex min-h-44 flex-col items-center justify-center text-center">
              <p className="text-3xl font-semibold tracking-tight">{gjeldende.uttrykk}</p>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Hva betyr det? Trykk for å snu.</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {gjeldende.uttrykk}
              </p>
              <p className="mt-2 text-lg">{gjeldende.forklaring}</p>
              <p className="mt-4 text-sm font-medium">Fra teksten:</p>
              <blockquote className="mt-1 border-l-4 border-slate-300 pl-4 text-slate-700 dark:border-slate-600 dark:text-slate-300">
                {gjeldende.kildeavsnitt.innhold}
              </blockquote>
            </div>
          )}
        </div>
      </button>
      {snudd && (
        <Link
          href={`/tekst/${tekstId}/lesing#avsnitt-${gjeldende.kildeavsnitt.nummer}`}
          className="mt-2 inline-block text-sm underline underline-offset-4"
        >
          Se avsnittet i teksten
        </Link>
      )}

      {feil && <Feilmelding {...feil} />}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => gaaTil(indeks - 1)} disabled={indeks === 0} className={KNAPP}>
          ← Forrige
        </button>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => merk("maa_oeve")} aria-pressed={m === "maa_oeve"} className={`${KNAPP} ${m === "maa_oeve" ? VALGT : ""}`}>
            Må øve mer
          </button>
          <button type="button" onClick={() => merk("kan")} aria-pressed={m === "kan"} className={`${KNAPP} ${m === "kan" ? VALGT : ""}`}>
            Kan
          </button>
        </div>
        <button type="button" onClick={() => gaaTil(indeks + 1)} className={KNAPP}>
          {indeks === runde.length - 1 ? "Ferdig" : "Neste →"}
        </button>
      </div>
    </section>
  );
}
