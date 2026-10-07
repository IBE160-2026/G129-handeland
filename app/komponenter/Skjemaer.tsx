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

export function LimInnSkjema({
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
        <label htmlFor="tittel" className="block font-medium">
          Tittel <span className="font-normal text-slate-500">(valgfritt)</span>
        </label>
        <input
          id="tittel"
          name="tittel"
          type="text"
          placeholder="For eksempel: Naturfag, kapittel 4"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <div>
        <label htmlFor="tekst" className="block font-medium">
          Teksten
        </label>
        <p id="tekst-hjelp" className="mt-1 text-slate-600 dark:text-slate-400">
          Lim inn fagteksten du skal lese. La det stå en blank linje mellom
          avsnittene — det er slik Lesevenn finner overskriftene.
        </p>
        <textarea
          id="tekst"
          name="tekst"
          rows={16}
          required
          aria-describedby="tekst-hjelp"
          className="mt-2 w-full rounded-md border border-slate-300 p-3 font-mono text-sm leading-relaxed focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900"
        />
      </div>

      <Send venter="Leser inn…" klar="Begynn" />
    </form>
  );
}

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
