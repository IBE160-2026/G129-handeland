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

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Feilmelding } from "./Feilmelding";
import type { Handlingssvar } from "../handlinger";
import { GRENSER } from "../../opplasting/pdf-tekst";
import { KNAPP_PRIMAER } from "./knapper";
import { Tenker } from "./Tenker";

const TOMT: Handlingssvar = {};

/**
 * Knappen beholder den korte teksten («Finner fagordene…») og låses. Venter
 * skjemaet på språkmodellen (`status`), vises tenkeindikatoren under; ellers
 * får skjermleseren ventteksten i en statusregion som finnes fra før.
 */
function Send({ venter, klar, status }: { venter: string; klar: string; status?: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" disabled={pending} className={KNAPP_PRIMAER}>
        {pending ? venter : klar}
      </button>
      {status ? (
        <Tenker aktiv={pending} status={status} hjelp="Dette kan ta et halvt minutt." className="mt-3" />
      ) : (
        <p role="status" className="sr-only">
          {pending ? venter : ""}
        </p>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */

export function AktiveringSkjema({
  handling,
  venter = "Lagrer…",
  status,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  /** Innlimt tekst låses og får fagordene i samme trykk (FR-3), og det tar tid (§5). */
  venter?: string;
  /** Statusteksten i tenkeindikatoren, når trykket venter på språkmodellen. */
  status?: string;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send} className="space-y-4">
      {svar.feil && (
        <>
          <Feilmelding melding={svar.feil.melding} handling={svar.feil.handling} />
          {/* FR-6: etter én oppfordring kan eleven gå videre med tomt svar. */}
          <input type="hidden" name="tomtEtterOppfordring" value="1" />
        </>
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
          aria-describedby="svar-hjelp"
          className="mt-2 w-full rounded-md border border-slate-500 p-3 leading-relaxed dark:border-slate-400 dark:bg-slate-900"
        />
      </div>

      <Send venter={venter} klar="Videre" status={status} />
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
  // Kontrollert felt: React nullstiller skjemaet etter handlingen, og et
  // ukontrollert felt ville mistet det eleven skrev inn når låsingen ble
  // avvist (for kort tekst, BF-4). Samme felle som kodefunn 24.
  const [innhold, settInnhold] = useState(tekst);
  const lengde = innhold.trim().length;

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
          teksten, fordi alt LeseBuddy lager peker på avsnittene slik de står nå.
        </p>
        <textarea
          id="tekst"
          name="tekst"
          rows={20}
          required
          value={innhold}
          onChange={(e) => settInnhold(e.target.value)}
          aria-describedby="gj-hjelp gj-lengde"
          className="mt-2 w-full rounded-md border border-slate-500 p-3 font-mono text-sm leading-relaxed dark:border-slate-400 dark:bg-slate-900"
        />
        {/* FR-1: bare synlig når teksten er under grensen, så eleven ser hva som mangler før hen trykker. */}
        <p id="gj-lengde" className="mt-1 text-right text-sm font-medium text-amber-700 dark:text-amber-400">
          {lengde < GRENSER.minTegnTotalt
            ? `${lengde} tegn — LeseBuddy trenger minst ${GRENSER.minTegnTotalt}, så det mangler ${GRENSER.minTegnTotalt - lengde}.`
            : ""}
        </p>
      </div>

      <Send venter="Finner fagordene…" klar="Lås og finn fagordene" status="Buddy finner fagordene …" />
    </form>
  );
}

/* ------------------------------------------------------------------ */

/**
 * FR-13 (endret 11.11): Quizen lages av seg selv første gang siden åpnes —
 * eleven skal ikke måtte trykke for at den skal finnes (telefontest 9.11).
 * Samme mønster som `HentOversettelse`: handlingen kjøres én gang etter at
 * siden er tegnet, ventetiden vises (§5), og en feil gir «Prøv igjen».
 */
export function LagQuizAutomatisk({
  handling,
}: {
  handling: () => Promise<Handlingssvar>;
}) {
  const router = useRouter();
  const [venter, startOvergang] = useTransition();
  const [feil, settFeil] = useState<Handlingssvar["feil"]>(undefined);
  const startet = useRef(false);

  const kjoer = () =>
    startOvergang(async () => {
      settFeil(undefined);
      let svar: Handlingssvar;
      try {
        svar = await handling();
      } catch {
        svar = { feil: { melding: "Quizen kunne ikke lages akkurat nå.", handling: "Prøv igjen." } };
      }
      if (svar.feil) settFeil(svar.feil);
      else router.refresh();
    });

  useEffect(() => {
    // Én gang per visning. Uten vakten ville React i utviklingsmodus kjørt
    // effekten to ganger og betalt for to modellkall.
    if (startet.current) return;
    startet.current = true;
    kjoer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (feil && !venter) {
    return (
      <div>
        <Feilmelding melding={feil.melding} handling={feil.handling} />
        <button type="button" onClick={kjoer} className={KNAPP_PRIMAER}>
          Prøv igjen
        </button>
      </div>
    );
  }

  // Vises også i øyeblikket før overgangen starter og mens siden oppdateres,
  // så eleven aldri ser en tom side.
  return <Tenker aktiv status="Buddy lager quizen din …" hjelp="Det tar som regel 10–20 sekunder." />;
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
      <Send venter="Finner fagordene…" klar="Prøv å finne fagordene igjen" status="Buddy finner fagordene …" />
    </form>
  );
}

/** FR-26: oppsummeringen lages når eleven ber om den, ikke på forhånd. */
export function LagOppsummeringSkjema({
  handling,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send} className="mt-4">
      {svar.feil && (
        <Feilmelding melding={svar.feil.melding} handling={svar.feil.handling} />
      )}
      <Send venter="Lager oppsummeringen…" klar="Vis en kort oppsummering" status="Buddy lager oppsummeringen …" />
    </form>
  );
}

/** En knapp som kjører én handling, med ventetekst (§5). Brukt av minneversene. */
export function HandlingSkjema({
  handling,
  venter,
  klar,
  status,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  venter: string;
  klar: string;
  /** Statusteksten i tenkeindikatoren, for eksempel «Buddy lager verset …». */
  status?: string;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send} className="mt-4">
      {svar.feil && (
        <Feilmelding melding={svar.feil.melding} handling={svar.feil.handling} />
      )}
      <Send venter={venter} klar={klar} status={status} />
    </form>
  );
}
