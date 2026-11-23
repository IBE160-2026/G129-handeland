"use client";

/**
 * Skjemaene for Mapper — FR-50.
 *
 * Klientkomponenter bare fordi `useActionState` trenger nettleseren. Alle
 * avvisninger fra serveren (grensene, en tekst som ikke finnes) vises med
 * Feilmelding, som sier hva som skjedde og hva eleven kan gjøre (§5).
 */

import { useRouter } from "next/navigation";
import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { MAPPEGRENSER } from "../../data/mappegrenser";
import type { Handlingssvar, Mappesvar } from "../handlinger";
import { slettMappeHandling } from "../handlinger";
import { Feilmelding } from "./Feilmelding";
import { KNAPP_FARE, KNAPP_LENKE, KNAPP_PRIMAER, KNAPP_SEKUNDAER } from "./knapper";

const TOMT: Handlingssvar = {};
const FELT = "min-h-11 w-full rounded-md border border-slate-500 bg-flate px-3 dark:border-slate-400";

type Handling = (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;

function Send({
  klar,
  venter,
  klasse = KNAPP_PRIMAER,
  skjult,
}: {
  klar: string;
  venter: string;
  klasse?: string;
  /** Resten av navnet for skjermlesere, for eksempel tittelen. */
  skjult?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" disabled={pending} className={klasse}>
        {pending ? venter : klar}
        {skjult && <span className="sr-only"> {skjult}</span>}
      </button>
      <span role="status" className="sr-only">
        {pending ? venter : ""}
      </span>
    </>
  );
}

/** Ny Mappe: et navn på 1–80 tegn. Serveren sender eleven til den nye Mappen. */
export function NyMappeSkjema({ handling }: { handling: Handling }) {
  const [svar, send] = useActionState(handling, TOMT);
  const id = useId();
  return (
    <form action={send} className="mt-4">
      {svar.feil && <Feilmelding {...svar.feil} fokus={false} />}
      <label htmlFor={id} className="font-bold">
        Navn på en ny mappe
      </label>
      <p id={`${id}-hjelp`} className="text-dempet">
        For eksempel faget eller prøven. Høyst {MAPPEGRENSER.tittel} tegn.
      </p>
      <div className="mt-1 flex flex-wrap items-end gap-3">
        <input
          id={id}
          name="tittel"
          required
          maxLength={MAPPEGRENSER.tittel}
          aria-describedby={`${id}-hjelp`}
          className={`min-w-0 grow basis-60 ${FELT.replace("w-full ", "")}`}
        />
        <Send klar="Lag mappe" venter="Lager mappen …" klasse={KNAPP_SEKUNDAER} />
      </div>
    </form>
  );
}

/** Gi Mappen nytt navn. Ligger bak en utfellbar del, så siden ikke starter med et skjema. */
export function NyttNavnSkjema({ handling, tittel }: { handling: Handling; tittel: string }) {
  const [svar, send] = useActionState(handling, TOMT);
  const id = useId();
  return (
    <details className="mt-2">
      <summary className="inline-flex min-h-11 cursor-pointer items-center font-bold underline underline-offset-4">
        Gi mappen nytt navn
      </summary>
      <form action={send} className="mt-2">
        {svar.feil && <Feilmelding {...svar.feil} fokus={false} />}
        <label htmlFor={id} className="font-bold">
          Nytt navn
        </label>
        <div className="mt-1 flex flex-wrap items-end gap-3">
          <input
            id={id}
            name="tittel"
            required
            defaultValue={tittel}
            maxLength={MAPPEGRENSER.tittel}
            className={`min-w-0 grow basis-60 ${FELT.replace("w-full ", "")}`}
          />
          <Send klar="Lagre navnet" venter="Lagrer …" klasse={KNAPP_SEKUNDAER} />
        </div>
      </form>
    </details>
  );
}

/**
 * Legg en Tekst i Mappen. Tekstene som alt er med, står i listen, men kan
 * ikke velges, så eleven ser hva Mappen har.
 */
export function LeggTilTekstSkjema({
  handling,
  tekster,
}: {
  handling: Handling;
  tekster: { id: string; tittel: string; erMed: boolean }[];
}) {
  const [svar, send] = useActionState(handling, TOMT);
  const id = useId();
  const ledige = tekster.filter((t) => !t.erMed);
  return (
    <form action={send} className="mt-3">
      {svar.feil && <Feilmelding {...svar.feil} fokus={false} />}
      <label htmlFor={id} className="font-bold">
        Velg en tekst
      </label>
      <div className="mt-1 flex flex-wrap items-end gap-3">
        <select
          // Nullstilles når settet av tekster i mappen endres, så valget aldri står på en som alt er med.
          key={tekster.filter((t) => t.erMed).map((t) => t.id).join(",")}
          id={id} name="tekstId" required defaultValue={ledige[0]?.id ?? ""} className={`min-w-0 grow basis-60 ${FELT.replace("w-full ", "")}`}>
          {tekster.map((t) => (
            <option key={t.id} value={t.id} disabled={t.erMed}>
              {t.erMed ? `${t.tittel} (alt med)` : t.tittel}
            </option>
          ))}
        </select>
        <Send klar="Legg til" venter="Legger til …" klasse={KNAPP_SEKUNDAER} />
      </div>
    </form>
  );
}

/** Meldingen etter at en Tekst er lagt i en Mappe, fra «Legg i mappe» og fra draget i Samlinger. */
export function lagtIMeldingen(tittel: string, lagtI: NonNullable<Mappesvar["lagtI"]>) {
  return lagtI.altMed
    ? `«${tittel}» ligger alt i «${lagtI.mappetittel}». Ingenting er endret.`
    : `«${tittel}» ligger nå i «${lagtI.mappetittel}».`;
}

/**
 * «Legg i mappe» på en tekstrad i Samlinger (runde 3, bolk 4). Samme handling
 * som draget på stor skjerm, for tastatur, skjermleser og telefon, og virker
 * uten JavaScript. Ligger bak en utfellbar del, som «Gi mappen nytt navn».
 * Mappene Teksten alt ligger i, står i listen, men kan ikke velges.
 *
 * Meldingene står utenfor `<details>`: uten JavaScript lastes siden på nytt
 * med delen lukket, og meldingen skal likevel synes. Statusregionen står
 * alltid i siden, så den nye teksten leses opp.
 */
export function LeggIMappeSkjema({
  handling,
  tekstId,
  tittel,
  mapper,
}: {
  handling: (s: Mappesvar, d: FormData) => Promise<Mappesvar>;
  tekstId: string;
  tittel: string;
  mapper: { id: string; tittel: string; erMed: boolean }[];
}) {
  const [svar, send] = useActionState(handling, TOMT as Mappesvar);
  const id = useId();
  const ledige = mapper.filter((m) => !m.erMed);
  return (
    <div className="min-w-0 max-w-full">
      <details>
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-bold underline underline-offset-4">
          Legg i mappe<span className="sr-only"> «{tittel}»</span>
        </summary>
        <form action={send} className="mt-2">
          <input type="hidden" name="tekstId" value={tekstId} />
          <label htmlFor={id} className="font-bold">
            Velg en mappe
          </label>
          <div className="mt-1 flex flex-wrap items-end gap-3">
            <select
              // Nullstilles når Teksten havner i en ny Mappe, så valget aldri står på en den alt ligger i.
              key={mapper.filter((m) => m.erMed).map((m) => m.id).join(",")}
              id={id}
              name="mappeId"
              required
              defaultValue={ledige[0]?.id ?? ""}
              aria-describedby={ledige.length === 0 ? `${id}-alle` : undefined}
              className={`min-w-0 max-w-full grow basis-48 ${FELT.replace("w-full ", "")}`}
            >
              {mapper.map((m) => (
                <option key={m.id} value={m.id} disabled={m.erMed}>
                  {m.erMed ? `${m.tittel} (alt med)` : m.tittel}
                </option>
              ))}
            </select>
            {ledige.length > 0 && <Send klar="Legg i mappen" venter="Legger i mappen …" klasse={KNAPP_SEKUNDAER} />}
          </div>
          {ledige.length === 0 && (
            <p id={`${id}-alle`} className="mt-1 text-dempet">
              Teksten ligger alt i alle mappene dine.
            </p>
          )}
        </form>
      </details>
      {svar.feil && <Feilmelding {...svar.feil} fokus={false} />}
      <p role="status" className="[overflow-wrap:anywhere]">
        {svar.lagtI ? lagtIMeldingen(tittel, svar.lagtI) : ""}
      </p>
    </div>
  );
}

/** Ta en Tekst ut av Mappen. Teksten slettes ikke, så det trengs ingen bekreftelse. */
export function FjernFraMappeKnapp({
  handling,
  tittel,
}: {
  handling: (s: Handlingssvar) => Promise<Handlingssvar>;
  tittel: string;
}) {
  const [svar, send] = useActionState(handling, TOMT);
  return (
    <form action={send}>
      {svar.feil && <Feilmelding {...svar.feil} fokus={false} />}
      <Send klar="Ta ut av mappen" venter="Tar ut …" klasse={`${KNAPP_LENKE} text-dempet`} skjult={`«${tittel}»`} />
    </form>
  );
}

/**
 * Slett Mappen, i to trinn som SlettTekstKnapp. Bekreftelsen sier hva som
 * forsvinner, og at Tekstene står igjen.
 */
export function SlettMappeKnapp({ mappeId, tittel }: { mappeId: string; tittel: string }) {
  const router = useRouter();
  const [bekrefter, setBekrefter] = useState(false);
  const [venter, setVenter] = useState(false);
  const [feilet, setFeilet] = useState(false);

  if (!bekrefter) {
    return (
      <button
        type="button"
        onClick={() => setBekrefter(true)}
        className="inline-flex min-h-11 min-w-11 items-center px-1 text-dempet underline underline-offset-4 hover:text-fare"
      >
        Slett mappen
      </button>
    );
  }

  return (
    <div role="alertdialog" aria-label={`Slette mappen «${tittel}»?`} className="mt-2 rounded-md border-s-4 border-fare bg-fareflate p-3">
      <p className="font-bold">Slette mappen «{tittel}»?</p>
      <p className="mt-1">
        Mappen og forsøkene på den samlede quizen forsvinner. Tekstene står
        igjen i Samlinger, med øvekortene og quizene sine.
      </p>
      {feilet && (
        <p role="alert" className="mt-2 font-bold text-fare">
          Mappen ble ikke slettet. Prøv igjen, eller last siden på nytt hvis den alt er borte.
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={venter}
          onClick={async () => {
            setVenter(true);
            setFeilet(false);
            const { slettet } = await slettMappeHandling(mappeId).catch(() => ({ slettet: false }));
            if (slettet) {
              router.push("/samling#mapper");
              router.refresh();
            } else {
              setVenter(false);
              setFeilet(true);
            }
          }}
          className={KNAPP_FARE}
        >
          {venter ? "Sletter…" : "Slett mappen"}
        </button>
        <button type="button" disabled={venter} onClick={() => setBekrefter(false)} className={KNAPP_LENKE}>
          Avbryt
        </button>
      </div>
    </div>
  );
}
