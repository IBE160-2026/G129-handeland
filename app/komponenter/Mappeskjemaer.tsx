"use client";

/**
 * Skjemaene for Mapper — FR-50.
 *
 * Klientkomponenter bare fordi `useActionState` trenger nettleseren. Alle
 * avvisninger fra serveren (grensene, en tekst som ikke finnes) vises med
 * Feilmelding, som sier hva som skjedde og hva eleven kan gjøre (§5).
 */

import { useRouter } from "next/navigation";
import { type ReactNode, useActionState, useId, useState } from "react";
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

/** Lengden slik serveren teller den (`tolkTittel`): uten mellomrom i endene, og flere mellomrom som ett. */
function navnelengde(raa: string): number {
  return raa.trim().replace(/\s+/g, " ").length;
}

/**
 * Navnefeltet for en Mappe (runde 3, bolk 6, prodtesten 24.11). Feltet tar
 * imot et for langt navn (ingen `maxLength`, som kuttet stille), og under
 * det står at navnet er for langt og hvor mange tegn det har. Bare «Navnet
 * er for langt.» står i statusregionen, så skjermleseren leser det én gang
 * når grensen passeres, ikke for hvert tegn; antallet står ved siden av, og
 * feltet er `aria-invalid` og beskrevet av hele meldingen. Sendes skjemaet
 * likevel, avviser serveren navnet (`MAPPE_AVVIST.langTittel`).
 *
 * Feltet er kontrollert: React setter da standardverdien lik verdien, så når
 * React nullstiller skjemaet etter en avvisning, står teksten eleven skal
 * korte ned, meldingen og fokuset der de var.
 */
function Navnefelt({ id, start = "", plassholder, children }: { id: string; start?: string; plassholder?: string; children: ReactNode }) {
  const [verdi, settVerdi] = useState(start);
  const lengde = navnelengde(verdi);
  const forLangt = lengde > MAPPEGRENSER.tittel;
  return (
    <>
      <div className="mt-1 flex flex-wrap items-end gap-3">
        <input
          id={id}
          name="tittel"
          required
          value={verdi}
          placeholder={plassholder}
          aria-invalid={forLangt || undefined}
          aria-describedby={forLangt ? `${id}-lengde` : undefined}
          onChange={(e) => settVerdi(e.currentTarget.value)}
          className={`min-w-0 grow basis-60 placeholder:text-dempet aria-invalid:border-2 aria-invalid:border-fare ${FELT.replace("w-full ", "")}`}
        />
        {children}
      </div>
      <p id={`${id}-lengde`} className={`navnelengde${forLangt ? " mt-1" : ""} font-bold text-fare [overflow-wrap:anywhere]`}>
        <span role="status">{forLangt ? "Navnet er for langt." : ""}</span>
        {forLangt && ` Det har ${lengde} tegn, og en mappe kan hete høyst ${MAPPEGRENSER.tittel}.`}
      </p>
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
      <Navnefelt id={id} plassholder="Eks. Samfunnsfag: demokrati">
        <Send klar="Lag mappe" venter="Lager mappen …" klasse={KNAPP_SEKUNDAER} />
      </Navnefelt>
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
        <Navnefelt id={id} start={tittel}>
          <Send klar="Lagre navnet" venter="Lagrer …" klasse={KNAPP_SEKUNDAER} />
        </Navnefelt>
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

/** En melding om å legge en Tekst i en Mappe: mens det skjer, lagt i, eller alt med (ingenting endret). */
export type Melding = { tekst: string; slag: "venter" | "lagt" | "uendret" };

const MELDINGSIKON: Record<Melding["slag"], string> = { venter: "…", lagt: "✓", uendret: "i" };

/**
 * Statusregionen for meldingen etter «Legg i mappe» og etter et slipp
 * (runde 3, bolk 6, prodtesten 24.11). Regionen står alltid i siden, tom, så
 * meldingen leses opp når den kommer. Med en melding er den en fremhevet
 * boks (globals.css, .meldingsboks): ikon, fet skrift, kant og flate. Ikonet
 * er pynt; teksten sier hva som skjedde.
 */
export function Meldingsboks({ melding, className = "" }: { melding: Melding | null; className?: string }) {
  return (
    <p role="status" data-slag={melding?.slag} className={`meldingsboks ${className} [overflow-wrap:anywhere]`}>
      {melding && (
        <>
          <span aria-hidden="true" className="meldingsboks-ikon">
            {MELDINGSIKON[melding.slag]}
          </span>
          <span>{melding.tekst}</span>
        </>
      )}
    </p>
  );
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
      <Meldingsboks
        melding={svar.lagtI ? { tekst: lagtIMeldingen(tittel, svar.lagtI), slag: svar.lagtI.altMed ? "uendret" : "lagt" } : null}
      />
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
