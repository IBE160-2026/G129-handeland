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
import { useActionState, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Feilmelding } from "./Feilmelding";
import type { Handlingssvar } from "../handlinger";
import { oppdaterUtenFeil } from "./oppdaterUtenFeil";
import { NETTFEIL, type Feiltekst } from "../kifeil";
import { GRENSER } from "../../opplasting/pdf-tekst";
import { MAKS_LURER_PAA, MERKESPOERSMAAL } from "../../tekst/forkunnskap";
import { Forkunnskapsvalg } from "./Forkunnskapsvalg";
import { KNAPP_PRIMAER } from "./knapper";
import { Tenker } from "./Tenker";

const TOMT: Handlingssvar = {};

/**
 * Knappen beholder den korte teksten («Finner fagordene…») og låses. Venter
 * skjemaet på språkmodellen (`status`), vises tenkeindikatoren under; ellers
 * får skjermleseren ventteksten i en statusregion som finnes fra før.
 *
 * `ferdigStatus` er statusen når svaret kom («Teksten er klar.»). Mens det
 * ventes, står den alltid, så avslutningen gis videre når siden byttes
 * (Tenker.tsx). Når ventingen er over, står den bare når handlingen ikke
 * svarte med en feil (`feilet`), så en feil aldri gir en avslutning.
 * Skjemaet kan ikke vite svaret selv, så Tenker sjekker i tillegg adressen
 * etter byttet og om eleven selv gikk fra siden (forlat-vernet).
 */
function Send({
  venter,
  klar,
  status,
  ferdigStatus,
  feilet = false,
}: {
  venter: string;
  klar: string;
  status?: string;
  ferdigStatus?: string;
  feilet?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <button type="submit" disabled={pending} className={KNAPP_PRIMAER}>
        {pending ? venter : klar}
      </button>
      {status ? (
        <Tenker
          aktiv={pending}
          status={status}
          ferdigStatus={pending || !feilet ? ferdigStatus : undefined}
          hjelp="Dette kan ta et halvt minutt."
          className="mt-3"
        />
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

/** En overskrift i aktiveringen, slik siden har regnet den ut (AD-12). */
export type Aktiveringstittel = {
  nummer: number;
  innhold: string;
  /** FR-5: laget av LeseBuddy, ikke hentet fra teksten. */
  laget: boolean;
  /** Morsmålslinjen under overskriften (FR-26), tegnet av siden. */
  morsmaal?: ReactNode;
};

/** Id-en til spørsmålet over overskriftene, som hver glider beskrives av. */
const SPOERSMAAL_ID = "merke-spoersmaal";

/**
 * FR-6 (endret 17.11.2026, merkene 18.11, glideren 23.11): over overskriftene
 * står ett spørsmål, «Hva vet du om dette fra før?», og eleven svarer for
 * hver overskrift med en glider i tre trinn, «Ingenting ennå» – «Litt» –
 * «Mye», eller med av/på-knappen «Skjønner ikke overskriften» under den
 * (Forkunnskapsvalg.tsx). Hver overskrift er en `fieldset`; glideren er
 * navngitt av overskriften (`legend`) og beskrevet av spørsmålet. Urørt
 * sender ingenting, og kodene er de samme som før, så `lesMerking` og
 * handlingen er uendret. Glideren krever skript: uten skript sendes ingen
 * merker, og eleven får oppfordringen én gang og slipper videre. Hun kan
 * skrive ett spørsmål.
 */
export function AktiveringSkjema({
  handling,
  titler,
  venter = "Lagrer…",
  status,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  titler: Aktiveringstittel[];
  /** Innlimt tekst låses og får fagordene i samme trykk (FR-3), og det tar tid (§5). */
  venter?: string;
  /** Statusteksten i tenkeindikatoren, når trykket venter på språkmodellen. */
  status?: string;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send} className="space-y-6">
      {svar.feil && (
        <>
          <Feilmelding {...svar.feil} />
          {/* FR-6: etter én oppfordring kan eleven gå videre med tomt skjema. */}
          <input type="hidden" name="tomtEtterOppfordring" value="1" />
        </>
      )}

      {titler.length > 0 && (
        <div className="space-y-4">
          {/* Spørsmålet står én gang, over alle gruppene (18.11). */}
          <p id={SPOERSMAAL_ID} className="text-lg font-semibold">
            {MERKESPOERSMAAL}
          </p>
          {titler.map((o) => (
            <fieldset
              key={o.nummer}
              className="rounded-md border border-slate-300 p-4 dark:border-slate-700"
            >
              <legend id={`merke-${o.nummer}-navn`} className="px-1 text-lg font-medium">
                {o.innhold}
                {o.laget && (
                  <span className="ml-2 align-middle text-xs font-normal text-slate-500 dark:text-slate-400">
                    (laget av LeseBuddy)
                  </span>
                )}
              </legend>
              {o.morsmaal}
              <Forkunnskapsvalg nummer={o.nummer} navnId={`merke-${o.nummer}-navn`} beskrivelseId={SPOERSMAAL_ID} />
            </fieldset>
          ))}
        </div>
      )}

      <div>
        <label htmlFor="lurer-paa" className="block font-medium">
          Noe du lurer på før du leser?
        </label>
        <p id="lurer-paa-hjelp" className="mt-1 text-slate-600 dark:text-slate-400">
          Valgfritt. Spørsmålet ditt står igjen når du har lest.
        </p>
        <textarea
          id="lurer-paa"
          name="lurerPaa"
          rows={3}
          maxLength={MAKS_LURER_PAA}
          aria-describedby="lurer-paa-hjelp"
          className="mt-2 w-full rounded-md border border-slate-500 p-3 leading-relaxed dark:border-slate-400 dark:bg-slate-900"
        />
      </div>

      <Send venter={venter} klar="Videre" status={status} ferdigStatus="Teksten er klar." feilet={!!svar.feil} />
    </form>
  );
}

/**
 * Innlimt tekst der låsingen i aktiveringen feilet (FR-3): svaret er lagret,
 * så skjemaet spør ikke om det igjen, men låser teksten på nytt.
 */
export function LaasPaaNyttSkjema({
  handling,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
}) {
  const [svar, send] = useActionState(handling, TOMT);
  return (
    <form action={send} className="space-y-4">
      {svar.feil && <Feilmelding {...svar.feil} />}
      <p>Svaret ditt er lagret, men teksten ble ikke klar til lesing. Prøv igjen.</p>
      <Send
        venter="Finner fagordene…"
        klar="Prøv igjen"
        status="Buddy finner fagordene …"
        ferdigStatus="Teksten er klar."
        feilet={!!svar.feil}
      />
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
        <Feilmelding {...svar.feil} />
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

      <Send
        venter="Finner fagordene…"
        klar="Lås og finn fagordene"
        status="Buddy finner fagordene …"
        ferdigStatus="Teksten er klar."
        feilet={!!svar.feil}
      />
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
  /** Ny nøkkel per feil, så meldingen leses opp og får fokus hver gang. */
  const [antallFeil, settAntallFeil] = useState(0);
  /** Quizen er laget, og siden oppdateres: avslutningen gis videre (Tenker.tsx). */
  const [klar, settKlar] = useState(false);
  const startet = useRef(false);

  const kjoer = () =>
    startOvergang(async () => {
      settFeil(undefined);
      settKlar(false);
      let svar: Handlingssvar;
      try {
        svar = await handling();
      } catch {
        svar = { feil: NETTFEIL };
      }
      if (svar.feil) {
        settFeil(svar.feil);
        settAntallFeil((n) => n + 1);
      } else {
        settKlar(true);
        router.refresh();
      }
    });

  useEffect(() => {
    // Én gang per visning. Uten vakten ville React i utviklingsmodus kjørt
    // effekten to ganger og betalt for to modellkall.
    if (startet.current) return;
    startet.current = true;
    kjoer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FR-13: meldingen sier at quizen ikke kunne lages, og fokus går til «Prøv igjen».
  if (feil && !venter) {
    return <Feilmelding key={antallFeil} {...feil} proevIgjen={kjoer} />;
  }

  // Vises også i øyeblikket før overgangen starter og mens siden oppdateres,
  // så eleven aldri ser en tom side.
  // `ferdigStatus` står først når quizen er laget, så en feil eller en elev
  // som går fra siden mens Buddy tenker, ikke gir noen avslutning.
  return (
    <Tenker
      aktiv
      status="Buddy lager quizen din …"
      ferdigStatus={klar ? "Quizen er klar." : undefined}
      kjentSvar
      hjelp="Det tar som regel 10–20 sekunder."
    />
  );
}

/* ------------------------------------------------------------------ */

/**
 * §5 og FR-7: når uttrekket av fagord har feilet, skal eleven ha en vei
 * videre — ikke bare en forklaring. Lesevisningen viser hele feiltilstanden
 * her: meldingen (`role="alert"`, ut fra koden i adressen når eleven kom fra
 * låsingen) med «Prøv igjen» inni. Feiler det igjen, byttes teksten, og
 * meldingen leses opp og får fokus på nytt. Ingen tekst står to ganger.
 *
 * Knappen er låst med `aria-disabled` mens Buddy tenker, ikke `disabled`, så
 * fokus blir stående på den (som `Tenker form="knapp"`).
 */
export function FinnFagordPaaNytt({
  handling,
  standard,
  fokus,
}: {
  handling: () => Promise<Handlingssvar>;
  /** Meldingen før eleven har prøvd igjen på denne siden. */
  standard: Feiltekst;
  /** Om «Prøv igjen» får fokus med en gang: når eleven nettopp ble sendt hit av en feil. */
  fokus: boolean;
}) {
  const router = useRouter();
  const [venter, startOvergang] = useTransition();
  const [feil, settFeil] = useState<Feiltekst>(standard);
  const [antallFeil, settAntallFeil] = useState(0);
  /** Fagordene er funnet, og siden oppdateres: avslutningen gis videre (Tenker.tsx). */
  const [klar, settKlar] = useState(false);

  const kjoer = () => {
    if (venter) return;
    startOvergang(async () => {
      settKlar(false);
      let svar: Handlingssvar;
      try {
        svar = await handling();
      } catch {
        svar = { feil: NETTFEIL };
      }
      if (svar.feil) {
        settFeil(svar.feil);
        settAntallFeil((n) => n + 1);
        return;
      }
      settKlar(true);
      // Samme sti uten `fagordfeil`, så ingen gammel feil står igjen i
      // adressen. I en overgang, så indikatoren venter til siden er byttet og
      // avslutningen gis videre, i stedet for å kuttes.
      startOvergang(() => oppdaterUtenFeil(router));
    });
  };

  return (
    <div className="mt-3">
      <Feilmelding key={antallFeil} {...feil} fokus={fokus || antallFeil > 0}>
        <button type="button" onClick={kjoer} aria-disabled={venter || undefined} className={KNAPP_PRIMAER}>
          {venter ? "Finner fagordene…" : "Prøv igjen"}
        </button>
      </Feilmelding>
      <Tenker
        aktiv={venter}
        status="Buddy finner fagordene …"
        ferdigStatus={klar ? "Fagordene er klare." : undefined}
        kjentSvar
        hjelp="Dette kan ta et halvt minutt."
        className="mt-3"
      />
    </div>
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
        <Feilmelding {...svar.feil} />
      )}
      <Send
        venter="Lager oppsummeringen…"
        klar="Vis en kort oppsummering"
        status="Buddy lager oppsummeringen …"
        ferdigStatus="Oppsummeringen er klar."
        feilet={!!svar.feil}
      />
    </form>
  );
}

/** En knapp som kjører én handling, med ventetekst (§5). Brukt av minneversene. */
export function HandlingSkjema({
  handling,
  venter,
  klar,
  status,
  ferdigStatus,
}: {
  handling: (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
  venter: string;
  klar: string;
  /** Statusteksten i tenkeindikatoren, for eksempel «Buddy lager verset …». */
  status?: string;
  /** Statusen når svaret kom, for eksempel «Verset er klart.». */
  ferdigStatus?: string;
}) {
  const [svar, send] = useActionState(handling, TOMT);

  return (
    <form action={send} className="mt-4">
      {svar.feil && (
        <Feilmelding {...svar.feil} />
      )}
      <Send venter={venter} klar={klar} status={status} ferdigStatus={ferdigStatus} feilet={!!svar.feil} />
    </form>
  );
}
