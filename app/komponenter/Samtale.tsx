"use client";

/**
 * Det eleven gjør i Fagsamtalen — FR-18, FR-22.
 *
 * Klientkomponenter fordi de viser ventetid (§5): en vurdering tar noen
 * sekunder, og eleven skal se at noe skjer og ikke sende svaret to ganger.
 * Selve visningen av samtalen er en serverkomponent (samtalesiden).
 */

import { useRouter } from "next/navigation";
import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import type { Handlingssvar } from "../handlinger";
import { avsluttSamtale, lagNesteSporsmal, revurderRunde, vurderLagretSvar } from "../handlinger";
import { KI_FEIL, NETTFEIL, type Feiltekst } from "../kifeil";
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

/**
 * FR-19 og FR-20: en KI-feil midt i samtalen. Meldingen sier hva som ikke ble
 * laget og at svaret er lagret, og har «Prøv igjen» (Feilmelding).
 * Knappen er en tenkeknapp: Buddy sitter i den mens det prøves, fokus blir
 * stående, og feiler det igjen, går knappen tilbake og meldingen vises på nytt
 * med fokus på knappen.
 *
 * Vises av samtalesiden ut fra det som er lagret, ikke ut fra svaret på
 * handlingen: etter en feil står runden med svar og uten vurdering (FR-19),
 * eller vurdert og uten neste spørsmål (FR-20), også om eleven laster siden på
 * nytt. Fokus flyttes bare når feilen nettopp skjedde (`fokus`), eller etter
 * et mislykket «Prøv igjen», ikke når siden lastes inn med en feil fra før.
 */
function ProevIgjen({
  standard,
  fokus,
  status,
  handling,
}: {
  standard: Feiltekst;
  fokus: boolean;
  status: string;
  handling: () => Promise<Handlingssvar>;
}) {
  const router = useRouter();
  const [venter, setVenter] = useState(false);
  // Siden oppdateres etter et vellykket forsøk. Knappen står låst til det er
  // gjort, så et nytt trykk i mellomtiden ikke sender en gang til.
  const [oppdaterer, startOppdatering] = useTransition();
  const [feil, setFeil] = useState<Feiltekst>(standard);
  const [antallFeil, setAntallFeil] = useState(0);
  return (
    <div className="ml-6">
      <Feilmelding key={antallFeil} melding={feil.melding} handling={feil.handling} fokus={fokus || antallFeil > 0}>
        <Tenker
          form="knapp"
          aktiv={venter || oppdaterer}
          status={status}
          onClick={async () => {
            setVenter(true);
            let r: Handlingssvar;
            try {
              r = await handling();
            } catch {
              r = { feil: NETTFEIL };
            }
            if (r.feil) {
              setVenter(false);
              setFeil(r.feil);
              setAntallFeil((n) => n + 1);
              return;
            }
            startOppdatering(() => {
              setVenter(false);
              router.refresh();
            });
          }}
          className={KNAPP}
        >
          Prøv igjen
        </Tenker>
      </Feilmelding>
    </div>
  );
}

/**
 * FR-19: «Vurderingen feilet. Svaret ditt er lagret.» «Prøv igjen» vurderer
 * det lagrede svaret. `standard` kan ha rådet til en feil som ikke kan prøves
 * på nytt (koden fra adressen, se samtalesiden).
 */
export function VurderingFeilet({
  samtaleId,
  nummer,
  standard = KI_FEIL.vurdering,
  fokus,
}: {
  samtaleId: string;
  nummer: number;
  standard?: Feiltekst;
  fokus: boolean;
}) {
  return (
    <ProevIgjen
      standard={standard}
      fokus={fokus}
      status="Buddy leser svaret ditt …"
      handling={() => vurderLagretSvar(samtaleId, nummer)}
    />
  );
}

/** FR-20: vurderingen er lagret og vises. «Prøv igjen» lager neste spørsmål. */
export function NesteSporsmalFeilet({ samtaleId, nummer, fokus }: { samtaleId: string; nummer: number; fokus: boolean }) {
  return (
    <ProevIgjen
      standard={KI_FEIL.oppfolging}
      fokus={fokus}
      status="Buddy lager neste spørsmål …"
      handling={() => lagNesteSporsmal(samtaleId, nummer)}
    />
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
