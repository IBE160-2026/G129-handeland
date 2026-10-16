"use client";

/**
 * Det eleven gjør i Fagsamtalen — FR-18, FR-22.
 *
 * Klientkomponenter fordi de viser ventetid (§5): en vurdering tar noen
 * sekunder, og eleven skal se at noe skjer og ikke sende svaret to ganger.
 * Selve visningen av samtalen er en serverkomponent (samtalesiden).
 */

import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Handlingssvar } from "../handlinger";
import { avsluttSamtale, revurderRunde } from "../handlinger";
import { Feilmelding } from "./Feilmelding";

const TOMT: Handlingssvar = {};
const KNAPP =
  "rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300";
const LENKEKNAPP =
  "text-sm underline underline-offset-4 hover:text-slate-900 focus:outline-2 focus:outline-offset-2 disabled:opacity-60 dark:hover:text-slate-100";

function Send({ venter, klar }: { venter: string; klar: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" disabled={pending} className={KNAPP}>
        {pending ? venter : klar}
      </button>
      {pending && (
        <p aria-live="polite" className="mt-3 text-slate-600 dark:text-slate-400">
          {venter} Det kan ta noen sekunder.
        </p>
      )}
    </>
  );
}

/** FR-18: starter en ny samtale. */
export function StartSamtaleSkjema({
  handling,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
}) {
  const [svar, send] = useActionState(handling, TOMT);
  return (
    <form action={send}>
      {svar.feil && <Feilmelding {...svar.feil} />}
      <Send venter="Lager første spørsmål…" klar="Start en fagsamtale" />
    </form>
  );
}

/** Svar på runden som venter. */
export function SvarSkjema({
  handling,
  nummer,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  nummer: number;
}) {
  const [svar, send] = useActionState(handling, TOMT);
  return (
    <form action={send} className="mt-4 space-y-3">
      {svar.feil && <Feilmelding {...svar.feil} />}
      <label htmlFor={`svar-${nummer}`} className="block font-medium">
        Svaret ditt
      </label>
      <textarea
        id={`svar-${nummer}`}
        name="svar"
        rows={5}
        required
        maxLength={3000}
        placeholder="Forklar med egne ord. Vet du ikke, kan du skrive det."
        className="w-full rounded-md border border-slate-300 p-3 leading-relaxed focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900"
      />
      <Send venter="Leser svaret ditt…" klar="Svar" />
    </form>
  );
}

/**
 * FR-22: «jeg tror du misforsto svaret mitt». Også en ærlig innrømmelse i
 * grensesnittet av at vurderingen kan være gal.
 */
export function RevurderKnapp({ samtaleId, nummer }: { samtaleId: string; nummer: number }) {
  const router = useRouter();
  const [venter, setVenter] = useState(false);
  const [feil, setFeil] = useState<Handlingssvar["feil"]>();
  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={venter}
        onClick={async () => {
          setVenter(true);
          setFeil(undefined);
          const r = await revurderRunde(samtaleId, nummer);
          setVenter(false);
          if (r.feil) setFeil(r.feil);
          else router.refresh();
        }}
        className={LENKEKNAPP}
      >
        {venter ? "Leser svaret ditt på nytt…" : "Jeg tror du misforsto svaret mitt"}
      </button>
      {feil && <Feilmelding {...feil} />}
    </div>
  );
}

/** FR-22: eleven kan avslutte når hun vil. */
export function AvsluttKnapp({ samtaleId }: { samtaleId: string }) {
  const router = useRouter();
  const [venter, setVenter] = useState(false);
  const [feil, setFeil] = useState<Handlingssvar["feil"]>();
  return (
    <div>
      <button
        type="button"
        disabled={venter}
        onClick={async () => {
          setVenter(true);
          const r = await avsluttSamtale(samtaleId);
          setVenter(false);
          if (r.feil) setFeil(r.feil);
          else router.refresh();
        }}
        className={LENKEKNAPP}
      >
        {venter ? "Avslutter…" : "Avslutt samtalen og se oppsummeringen"}
      </button>
      {feil && <Feilmelding {...feil} />}
    </div>
  );
}
