"use client";

/**
 * Fase 3a — overskriftskontrollen (FR-3).
 *
 * Komponenten får BARE overskriftene. Brødteksten sendes aldri til
 * nettleseren i denne fasen, verken synlig eller i kildekoden — samme krav
 * som aktiveringen (FR-5).
 *
 * Å flytte en overskrift bytter tekst med plassen over eller under; se
 * tekst/overskrifter.ts for hvorfor det er det «flytte» kan bety her.
 */

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { overskriftsfeil, type Overskriftsplass } from "../../tekst/overskrifter";
import { Feilmelding } from "./Feilmelding";
import type { Handlingssvar } from "../handlinger";

const TOMT: Handlingssvar = {};
const LITEN =
  "rounded border border-slate-300 px-2 py-1 text-sm hover:bg-slate-100 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800";
const FELT =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-lg focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900";

function Godkjenn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
    >
      {pending ? "Lagrer…" : "Overskriftene stemmer — videre"}
    </button>
  );
}

export function Overskriftskontroll({
  handling,
  plasser,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  plasser: Overskriftsplass[];
}) {
  const [svar, send] = useActionState(handling, TOMT);
  const [tekster, settTekster] = useState(plasser.map((p) => p.tekst));
  const [slettet, settSlettet] = useState(plasser.map(() => false));
  const [topp, settTopp] = useState<string | null>(null);

  const bytt = (i: number, j: number) => {
    const byttI = <T,>(liste: T[]) => {
      const n = [...liste];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    };
    settTekster(byttI);
    settSlettet(byttI);
  };
  const settSlettetPaa = (i: number, verdi: boolean) => settSlettet((s) => s.map((v, k) => (k === i ? verdi : v)));

  return (
    <form action={send} className="space-y-6">
      {svar.feil && <Feilmelding melding={svar.feil.melding} handling={svar.feil.handling} />}

      {topp === null ? (
        <button type="button" onClick={() => settTopp("")} className={LITEN}>
          + Legg til en overskrift øverst
        </button>
      ) : (
        <div>
          <label htmlFor="topp" className="block font-medium">
            Ny overskrift øverst
          </label>
          <div className="mt-1 flex gap-2">
            <input id="topp" name="topp" value={topp} onChange={(e) => settTopp(e.target.value)} className={FELT} autoFocus />
            <button type="button" onClick={() => settTopp(null)} className={LITEN}>
              Fjern
            </button>
          </div>
          {topp.trim() !== "" && overskriftsfeil(topp) && (
            <p className="mt-1 text-sm text-red-800 dark:text-red-300">{overskriftsfeil(topp)}</p>
          )}
        </div>
      )}

      {plasser.length === 0 ? (
        <p className="rounded-md border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          Lesevenn fant ingen overskrifter i teksten. Du kan legge til en øverst, for eksempel tittelen, eller gå
          videre uten.
        </p>
      ) : (
        <ol className="space-y-4">
          {plasser.map((p, i) => {
            const feil = slettet[i] || tekster[i].trim() === "" ? null : overskriftsfeil(tekster[i]);
            return (
              <li key={p.nummer} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <label htmlFor={`o-${p.nummer}`} className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Overskrift {i + 1} av {plasser.length}
                </label>
                {slettet[i] ? (
                  <div className="mt-1 flex items-center gap-3">
                    <p className="text-slate-500 line-through">{tekster[i]}</p>
                    <input type="hidden" name={`o-${p.nummer}`} value="" />
                    <button type="button" onClick={() => settSlettetPaa(i, false)} className={LITEN}>
                      Angre
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      id={`o-${p.nummer}`}
                      name={`o-${p.nummer}`}
                      value={tekster[i]}
                      onChange={(e) => settTekster((t) => t.map((v, k) => (k === i ? e.target.value : v)))}
                      aria-invalid={feil ? true : undefined}
                      className={`mt-1 ${FELT}`}
                    />
                    {feil && <p className="mt-1 text-sm text-red-800 dark:text-red-300">{feil}</p>}
                  </>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => bytt(i, i - 1)}
                    disabled={i === 0}
                    aria-label={`Flytt overskrift ${i + 1} opp`}
                    className={LITEN}
                  >
                    ↑ Opp
                  </button>
                  <button
                    type="button"
                    onClick={() => bytt(i, i + 1)}
                    disabled={i === plasser.length - 1}
                    aria-label={`Flytt overskrift ${i + 1} ned`}
                    className={LITEN}
                  >
                    ↓ Ned
                  </button>
                  {!slettet[i] && (
                    <button type="button" onClick={() => settSlettetPaa(i, true)} className={LITEN}>
                      Slett
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <Godkjenn />
    </form>
  );
}
