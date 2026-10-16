"use client";

/**
 * Leseinnstillingene — FR-12.
 *
 * Endringen vises med en gang (stilen settes direkte på teksten), og lagres
 * på kontoen i bakgrunnen. Valgene er radioknapper i hver sin `fieldset`, så
 * de virker med tastatur og leses riktig av skjermleser uten egen kode.
 */

import { useActionState, useRef } from "react";
import {
  LINJEAVSTANDER,
  TEKSTSTORRELSER,
  lesestil,
  type Leseinnstillinger as Innstillinger,
  type Linjeavstand,
  type Tekststorrelse,
} from "../../tekst/leseinnstillinger";
import type { Handlingssvar } from "../handlinger";

const TOMT: Handlingssvar = {};

export function Leseinnstillinger({
  handling,
  valgt,
  malId,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  valgt: Innstillinger;
  /** Id-en til teksten som stilen gjelder. */
  malId: string;
}) {
  const [svar, send] = useActionState(handling, TOMT);
  const skjema = useRef<HTMLFormElement>(null);

  function endret() {
    const d = new FormData(skjema.current!);
    const stil = lesestil({
      tekststorrelse: d.get("tekststorrelse") as Tekststorrelse,
      linjeavstand: d.get("linjeavstand") as Linjeavstand,
    });
    const mal = document.getElementById(malId);
    if (mal) Object.assign(mal.style, { ...stil, lineHeight: String(stil.lineHeight) });
    skjema.current?.requestSubmit();
  }

  const valg = "flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1 text-sm has-[:checked]:border-slate-900 has-[:checked]:font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-slate-900 dark:border-slate-700 dark:has-[:checked]:border-slate-100";

  return (
    <details className="mt-4 rounded-md border border-slate-300 p-3 dark:border-slate-700">
      <summary className="cursor-pointer font-medium">Leseinnstillinger</summary>
      <form ref={skjema} action={send} onChange={endret} className="mt-3 space-y-3">
        <fieldset>
          <legend className="text-sm font-medium">Tekststørrelse</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {(Object.keys(TEKSTSTORRELSER) as Tekststorrelse[]).map((k) => (
              <label key={k} className={valg}>
                <input type="radio" name="tekststorrelse" value={k} defaultChecked={valgt.tekststorrelse === k} />
                {TEKSTSTORRELSER[k].navn}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-medium">Linjeavstand</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {(Object.keys(LINJEAVSTANDER) as Linjeavstand[]).map((k) => (
              <label key={k} className={valg}>
                <input type="radio" name="linjeavstand" value={k} defaultChecked={valgt.linjeavstand === k} />
                {LINJEAVSTANDER[k].navn}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-xs text-slate-600 dark:text-slate-400">Valget huskes på kontoen din.</p>
        {svar.feil && (
          <p role="alert" className="text-sm text-red-800 dark:text-red-300">
            Innstillingen ble ikke lagret. {svar.feil.handling}
          </p>
        )}
      </form>
    </details>
  );
}
