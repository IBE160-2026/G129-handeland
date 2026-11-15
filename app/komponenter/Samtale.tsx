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
import { KNAPP_PRIMAER } from "./knapper";
import { Tenker } from "./Tenker";

const TOMT: Handlingssvar = {};
const KNAPP = KNAPP_PRIMAER;
const LENKEKNAPP =
  "inline-flex min-h-11 items-center text-sm underline underline-offset-4 hover:text-slate-900 disabled:opacity-60 dark:hover:text-slate-100";

/**
 * Første spørsmål tar tid og vises i flaten (på telefon som pillen nederst).
 * Svar på en runde er en kort venting, så Buddy sitter i knappen (bolk 5).
 */
function Send(
  props: { klar: string; status: string } & (
    | {
        form: "flate";
        /** Den korte knappeteksten mens det ventes (i knappen står statusen i stedet). */
        venter: string;
      }
    | { form: "knapp" }
  ),
) {
  const { klar, status } = props;
  const { pending } = useFormStatus();
  if (props.form === "knapp") {
    return (
      <Tenker form="knapp" type="submit" aktiv={pending} status={status} className={KNAPP}>
        {klar}
      </Tenker>
    );
  }
  return (
    <>
      <button type="submit" disabled={pending} className={KNAPP}>
        {pending ? props.venter : klar}
      </button>
      <Tenker aktiv={pending} status={status} hjelp="Det kan ta noen sekunder." className="mt-3" />
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
      <Send form="flate" venter="Lager første spørsmål…" klar="Start en fagsamtale" status="Buddy lager det første spørsmålet …" />
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
        className="w-full rounded-md border border-slate-500 p-3 leading-relaxed dark:border-slate-400 dark:bg-slate-900"
      />
      <Send form="knapp" klar="Svar" status="Buddy leser svaret ditt …" />
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
      <Tenker
        form="knapp"
        aktiv={venter}
        status="Buddy leser svaret ditt på nytt …"
        onClick={async () => {
          setVenter(true);
          setFeil(undefined);
          // Kaster kallet (nettet borte), skal knappen likevel låses opp igjen.
          try {
            const r = await revurderRunde(samtaleId, nummer);
            if (r.feil) setFeil(r.feil);
            else router.refresh();
          } catch {
            setFeil({ melding: "Svaret kom ikke fram.", handling: "Sjekk nettet og prøv igjen." });
          } finally {
            setVenter(false);
          }
        }}
        className={LENKEKNAPP}
      >
        Jeg tror du misforsto svaret mitt
      </Tenker>
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
