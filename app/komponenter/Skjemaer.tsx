"use client";

/**
 * Skjemaene i Kjerneløypen.
 *
 * Disse er klientkomponenter av én grunn: `useActionState` og
 * `useFormStatus` trenger å kjøre i nettleseren. Alt annet i løypen er
 * serverkomponenter.
 *
 * §5 krever at ventetid over to sekunder viser en status som sier hva som
 * gjøres. Modellkallet i `laasOgGenerer` tar typisk et titalls sekunder, så
 * `useFormStatus` brukes til nettopp det — og knappen låses samtidig, slik at
 * eleven ikke sender to ganger og betaler for to kall.
 */

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Feilmelding } from "./Feilmelding";
import type { Handlingssvar } from "../handlinger";

const TOMT: Handlingssvar = {};

function Send({ venter, klar }: { venter: string; klar: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        {pending ? venter : klar}
      </button>
      {pending && (
        // aria-live, slik at skjermleseren sier det uten at eleven leter.
        <p aria-live="polite" className="mt-3 text-slate-600 dark:text-slate-400">
          {venter} Dette kan ta et halvt minutt.
        </p>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */

export function AktiveringSkjema({
  handling,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send} className="space-y-4">
      {svar.feil && (
        <Feilmelding melding={svar.feil.melding} handling={svar.feil.handling} />
      )}

      <div>
        <label htmlFor="svar" className="block font-medium">
          Hva tror du teksten handler om?
        </label>
        <p id="svar-hjelp" className="mt-1 text-slate-600 dark:text-slate-400">
          Skriv et par setninger ut fra overskriftene over. Det du skriver blir
          ikke rettet og ikke vurdert — det er for å sette i gang det du
          allerede vet.
        </p>
        <textarea
          id="svar"
          name="svar"
          rows={6}
          required
          aria-describedby="svar-hjelp"
          className="mt-2 w-full rounded-md border border-slate-300 p-3 leading-relaxed focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <Send venter="Lagrer…" klar="Videre" />
    </form>
  );
}

/* ------------------------------------------------------------------ */

export function GjennomsynSkjema({
  handling,
  tekst,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  tekst: string;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send} className="space-y-4">
      {svar.feil && (
        <Feilmelding melding={svar.feil.melding} handling={svar.feil.handling} />
      )}

      <div>
        <label htmlFor="tekst" className="block font-medium">
          Se gjennom teksten
        </label>
        <p id="gj-hjelp" className="mt-1 text-slate-600 dark:text-slate-400">
          Rett det som er blitt feil. Dette er siste sjanse — etter dette låses
          teksten, fordi alt Lesevenn lager peker på avsnittene slik de står nå.
        </p>
        <textarea
          id="tekst"
          name="tekst"
          rows={20}
          required
          defaultValue={tekst}
          aria-describedby="gj-hjelp"
          className="mt-2 w-full rounded-md border border-slate-300 p-3 font-mono text-sm leading-relaxed focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <Send venter="Finner fagordene…" klar="Lås og finn fagordene" />
    </form>
  );
}

/* ------------------------------------------------------------------ */

/** FR-13: lager Quizen første gang. Modellkallet tar noen sekunder (§5). */
export function LagQuizSkjema({
  handling,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send}>
      {svar.feil && (
        <Feilmelding melding={svar.feil.melding} handling={svar.feil.handling} />
      )}
      <Send venter="Lager quizen…" klar="Lag quizen" />
    </form>
  );
}

/* ------------------------------------------------------------------ */

/**
 * §5: når uttrekket av fagord har feilet, skal eleven ha en vei videre — ikke
 * bare en forklaring. Handlingen `genererPaaNytt` fantes fra før, men ingen
 * knapp brukte den.
 */
export function FinnFagordPaaNyttSkjema({
  handling,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send} className="mt-3">
      {svar.feil && (
        <Feilmelding melding={svar.feil.melding} handling={svar.feil.handling} />
      )}
      <Send venter="Finner fagordene…" klar="Prøv å finne fagordene igjen" />
    </form>
  );
}
