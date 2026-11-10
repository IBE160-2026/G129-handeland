"use client";

/**
 * Morsmålsstøtten i nettleseren — FR-24 og FR-29.
 *
 * `MorsmaalVelger` er valget. `HentOversettelse` lager en oversettelse som
 * mangler, ETTER at siden er tegnet: den norske teksten står der fra første
 * øyeblikk, og en feil gir en merknad med prøv igjen — aldri en sperre.
 */

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { KVALITETSSIKRET, SPRAAK } from "../../morsmaal/spraak";
import type { Handlingssvar } from "../handlinger";

const TOMT: Handlingssvar = {};

function Lagre() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-slate-400 px-4 py-2 font-medium hover:bg-slate-100 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-60 dark:border-slate-600 dark:hover:bg-slate-800"
    >
      {pending ? "Lagrer …" : "Lagre"}
    </button>
  );
}

/**
 * FR-24: lukket liste med to nivåer. Er ingen språk kvalitetssikret, finnes
 * ikke det nivået i listen i det hele tatt — ingen tom gruppe.
 */
export function MorsmaalVelger({
  handling,
  valgt,
  kompakt = false,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  valgt: string | null;
  /** På lesesiden (telefontest 9.11): på én linje, med kort forbehold. */
  kompakt?: boolean;
}) {
  const [svar, send] = useActionState(handling, TOMT);
  const sikre = SPRAAK.filter((s) => KVALITETSSIKRET.has(s.kode));
  const andre = SPRAAK.filter((s) => !KVALITETSSIKRET.has(s.kode));
  const valg = (s: (typeof SPRAAK)[number]) => (
    <option key={s.kode} value={s.kode}>
      {s.navn} — {s.egetNavn}
    </option>
  );

  return (
    <form action={send} className={kompakt ? "space-y-1" : "space-y-3"}>
      <label htmlFor="spraak" className={kompakt ? "text-sm font-medium" : "block font-medium"}>
        Morsmål
      </label>
      <div className={kompakt ? "flex flex-wrap items-center gap-2 text-sm" : "flex flex-wrap items-center gap-3"}>
        {/* React nullstiller skjemaet etter handlingen, og et ukontrollert felt
            leser defaultValue bare én gang — uten nøkkelen viste listen det
            gamle valget til siden ble lastet på nytt (telefontest 9.11). */}
        <select
          key={valgt ?? ""}
          id="spraak"
          name="spraak"
          defaultValue={valgt ?? ""}
          className="rounded-md border border-slate-400 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
        >
          <option value="">Ingen — bare norsk</option>
          {sikre.length > 0 && <optgroup label="Kvalitetssikret">{sikre.map(valg)}</optgroup>}
          <optgroup label="Modellstøttet — kvaliteten er ikke kontrollert">{andre.map(valg)}</optgroup>
        </select>
        <Lagre />
      </div>
      {kompakt ? (
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Oversettelsene er laget av en språkmodell. Norsk står alltid ved siden av.
        </p>
      ) : (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Med morsmål valgt får du overskriftene før du leser, forklaringene av fagordene og
          oppsummeringen på begge språk. Norsk står alltid ved siden av. Oversettelsene er laget av en
          språkmodell.{" "}
          {sikre.length > 0
            ? `${sikre.map((s) => s.navn).join(", ")} er kontrollert av en morsmålsbruker; de andre språkene har ingen kontrollert.`
            : "Ingen har kontrollert dem."}
        </p>
      )}
      {svar.feil && (
        <p role="alert" className="text-sm text-red-800 dark:text-red-300">
          {svar.feil.melding} {svar.feil.handling}
        </p>
      )}
      <p aria-live="polite" className="text-sm font-medium">
        {svar !== TOMT && !svar.feil
          ? `Lagret: ${SPRAAK.find((s) => s.kode === valgt)?.navn ?? "bare norsk"}.`
          : ""}
      </p>
    </form>
  );
}

/**
 * Lager én manglende oversettelse når komponenten vises, og oppdaterer siden.
 *
 * FR-29: feiler det, vises en rolig merknad med prøv igjen. Det norske står
 * som før, og eleven kan lese videre uten å gjøre noe.
 */
export function HentOversettelse({
  handling,
  hva,
  venterTekst,
  feilTekst,
}: {
  handling: () => Promise<Handlingssvar>;
  /** Hva som oversettes, til statusteksten: «overskriftene», «forklaringene» … */
  hva: string;
  /** Overstyrer statusteksten, når det som lages ikke er en oversettelse (FR-5). */
  venterTekst?: string;
  feilTekst?: string;
}) {
  const router = useRouter();
  const [venter, startOvergang] = useTransition();
  const [feil, settFeil] = useState<Handlingssvar["feil"]>(undefined);
  const startet = useRef(false);

  const kjoer = () =>
    startOvergang(async () => {
      settFeil(undefined);
      const svar = await handling();
      if (svar.feil) settFeil(svar.feil);
      else router.refresh();
    });

  useEffect(() => {
    // Én gang per visning. Uten vakten ville React i utviklingsmodus kjørt
    // effekten to ganger og betalt for to kall.
    if (startet.current) return;
    startet.current = true;
    kjoer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (feil) {
    return (
      <div className="my-3 rounded-md border border-slate-300 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
        <p>{feilTekst ?? `Oversettelsen av ${hva} kom ikke fram. Den norske teksten står som før.`}</p>
        <button
          type="button"
          onClick={kjoer}
          className="mt-2 underline underline-offset-4 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900"
        >
          Prøv igjen
        </button>
      </div>
    );
  }

  return (
    <p aria-live="polite" className="my-3 text-sm text-slate-600 dark:text-slate-400">
      {venter ? (venterTekst ?? `Oversetter ${hva} …`) : ""}
    </p>
  );
}
