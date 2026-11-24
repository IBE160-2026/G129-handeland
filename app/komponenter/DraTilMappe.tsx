"use client";

/**
 * Dra og slipp en Tekst på en Mappe i Samlinger — runde 3, bolk 4 (avgjort
 * av Arve 23.11).
 *
 * Bare på stor skjerm (fra 760 px) og bare når eleven har minst én Mappe:
 * ellers får ingen tekstrad `draggable`, og ingen Mappe er et slippmål. Det
 * er et tillegg, ikke eneste vei: hver tekstrad har «Legg i mappe»
 * (LeggIMappeSkjema), som gjør det samme for tastatur, skjermleser og
 * telefon. Begge kaller `leggTekstIMappe`, med de samme reglene som
 * mappesiden.
 *
 * HTML5-dra, uten bibliotek. Tekstraden (`DragbarTekst`) sier hva som dras,
 * Mappekortet (`Slippmaal`) tar imot, og `Slippmelding` står i Mappene og
 * kunngjør resultatet i en `role="status"`-region, eller viser Feilmelding.
 * Antallet på Mappen oppdateres fordi handlingen revaliderer `/samling`.
 *
 * Runde 3, bolk 6 (prodtesten 24.11): et musedrag som starter på knappene
 * («Legg i mappe», valget, «Legg i mappen», «Slett») flytter ikke raden, og
 * tittellenken (`Tekstlenke`) er ikke dragbar selv mens draget er på, så
 * nettleseren aldri legger adressen i draget (den ble satt inn i søkefeltet).
 * En dragbar rad har grep-ikonet (⠿) og en markeringsflate ved hover, og
 * «Dra en tekst til en mappe.» står over tekstene (`Drahint`), bare når
 * draget er på. Meldingen etter et slipp står i en fremhevet boks
 * (`Meldingsboks`).
 */

import Link from "next/link";
import {
  type ComponentProps,
  createContext,
  type Dispatch,
  type DragEvent,
  type ReactNode,
  type SetStateAction,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import type { Feiltekst } from "../kifeil";
import { leggTekstIMappe } from "../handlinger";
import { Feilmelding } from "./Feilmelding";
import { lagtIMeldingen, type Melding, Meldingsboks } from "./Mappeskjemaer";

const STOR = "(min-width: 760px)";
/**
 * Egen type i stedet for text/plain: slippes raden i et tekstfelt (søket,
 * navnet på en ny mappe), skal ikke tittelen skrives inn der.
 */
const TYPE = "application/x-lesebuddy-tekst";

/** Knappene på raden. Et drag som starter der, flytter ikke raden (prodtesten 24.11, punkt 6). */
const KNAPPENE = ".tekstrad-knapper";

/** Usann på serveren og under hydrering, sann når skriptet kjører. */
const ingenting = () => () => {};
function useHarSkript() {
  return useSyncExternalStore(
    ingenting,
    () => true,
    () => false,
  );
}

function abonner(endret: () => void) {
  const m = matchMedia(STOR);
  m.addEventListener("change", endret);
  return () => m.removeEventListener("change", endret);
}
/** Usann på serveren og under hydrering, så HTML-en fra serveren aldri har `draggable`. */
function useStorSkjerm() {
  return useSyncExternalStore(
    abonner,
    () => matchMedia(STOR).matches,
    () => false,
  );
}

type Tekst = { id: string; tittel: string };
type Dra = {
  aktiv: boolean;
  dras: Tekst | null;
  over: string | null;
  start: (t: Tekst) => void;
  slutt: () => void;
  settOver: Dispatch<SetStateAction<string | null>>;
  slipp: (mappeId: string, mappetittel: string) => void;
  melding: Melding | null;
  feil: (Feiltekst & { n: number }) | null;
};

const Kontekst = createContext<Dra | null>(null);

const NETTFEIL: Feiltekst = {
  melding: "Teksten ble ikke lagt i mappen.",
  handling: "Prøv igjen, eller bruk «Legg i mappe» under teksten.",
};

export function DraTilMappe({ harMapper, children }: { harMapper: boolean; children: ReactNode }) {
  const harSkript = useHarSkript();
  const aktiv = useStorSkjerm() && harMapper;
  const [dras, settDras] = useState<Tekst | null>(null);
  const [over, settOver] = useState<string | null>(null);
  const [melding, settMelding] = useState<Melding | null>(null);
  const [feil, settFeil] = useState<Dra["feil"]>(null);
  const [, startTransition] = useTransition();

  function slipp(mappeId: string, mappetittel: string) {
    const tekst = dras;
    settDras(null);
    settOver(null);
    if (!tekst) return;
    settFeil(null);
    settMelding({ tekst: `Legger «${tekst.tittel}» i «${mappetittel}» …`, slag: "venter" });
    const data = new FormData();
    data.set("mappeId", mappeId);
    data.set("tekstId", tekst.id);
    startTransition(async () => {
      const svar = await leggTekstIMappe({}, data).catch(() => ({ feil: NETTFEIL, lagtI: undefined }));
      if (svar.lagtI) {
        settMelding({ tekst: lagtIMeldingen(tekst.tittel, svar.lagtI), slag: svar.lagtI.altMed ? "uendret" : "lagt" });
      } else {
        settMelding(null);
        // Ny `n` hver gang, så samme feil to ganger leses opp på nytt.
        settFeil((f) => ({ ...(svar.feil ?? NETTFEIL), n: (f?.n ?? 0) + 1 }));
      }
    });
  }

  return (
    <Kontekst
      value={{
        aktiv,
        dras,
        over,
        start: settDras,
        slutt: () => {
          settDras(null);
          settOver(null);
        },
        settOver,
        slipp,
        melding,
        feil,
      }}
    >
      {/* `data-dra` settes etter hydrering («på» eller «av»), så sjekkene vet når draget er avgjort. */}
      <div data-dra={harSkript ? (aktiv ? "på" : "av") : undefined}>{children}</div>
    </Kontekst>
  );
}

function useDra() {
  const d = useContext(Kontekst);
  if (!d) throw new Error("DragbarTekst, Tekstlenke, Drahint, Slippmaal og Slippmelding må stå inne i DraTilMappe.");
  return d;
}

/** En tekstrad (`<li>`) som kan dras til en Mappe når draget er på. */
export function DragbarTekst({ tekstId, tittel, className, children }: { tekstId: string; tittel: string; className: string; children: ReactNode }) {
  const d = useDra();
  /**
   * Om pekeren ble trykket ned på knappene. Starter draget på en knapp, et
   * valg eller en `<summary>`, er `e.target` i dragstart den dragbare raden
   * selv, så det må huskes fra `pointerdown`.
   */
  const fraKnappene = useRef(false);
  return (
    <li
      draggable={d.aktiv || undefined}
      onPointerDown={(e) => {
        fraKnappene.current = !!(e.target as Element).closest(KNAPPENE);
      }}
      onDragStart={(e) => {
        if (!d.aktiv) return;
        // Et lite musedrag på «Legg i mappe», valget, «Legg i mappen» eller «Slett» skal ikke flytte raden.
        if (fraKnappene.current || (e.target as Element).closest(KNAPPENE)) {
          e.preventDefault();
          return;
        }
        // Bare Tekstens id i draget, ingen adresse eller tittel et tekstfelt kan ta imot (punkt 7).
        e.dataTransfer.clearData();
        e.dataTransfer.setData(TYPE, tekstId);
        e.dataTransfer.effectAllowed = "copy";
        // Etter hendelsen: Chrome avbryter draget om DOM-en endres mens dragstart
        // pågår, og dragbildet skal tas av raden slik den er.
        const tekst = { id: tekstId, tittel };
        setTimeout(() => d.start(tekst), 0);
      }}
      // Også etter hendelsen, så den kommer etter `start` selv om draget var svært kort.
      onDragEnd={() => setTimeout(d.slutt, 0)}
      className={`${className}${d.dras?.id === tekstId ? " tekstrad-dras" : ""}`}
    >
      {children}
      {/* Sist i raden, så tekst og knapper står først som før; plassert til venstre i globals.css. */}
      {d.aktiv && (
        <span aria-hidden="true" className="tekstrad-grep">
          ⠿
        </span>
      )}
    </li>
  );
}

/**
 * Tittellenken på en tekstrad. Mens draget er på, er den ikke dragbar selv:
 * da er det raden som dras, også fra lenken, og nettleseren legger ikke
 * adressen i draget.
 */
export function Tekstlenke(props: Omit<ComponentProps<typeof Link>, "draggable">) {
  const d = useDra();
  return <Link {...props} draggable={d.aktiv ? false : undefined} />;
}

/**
 * Over tekstene: at radene kan dras. Bare når draget er på (fra 760 px, med
 * minst én Mappe). Skjult for skjermlesere, fordi draget bare gjelder mus;
 * for dem er «Legg i mappe» veien.
 */
export function Drahint() {
  const d = useDra();
  if (!d.aktiv) return null;
  return (
    <p aria-hidden="true" className="drahint mt-8 text-dempet">
      <span className="drahint-grep">
        ⠿
      </span>{" "}
      Dra en tekst til en mappe.
    </p>
  );
}

/** Et Mappekort (`<li>`): hele kortet tar imot en Tekst som dras. */
export function Slippmaal({ mappeId, tittel, className, children }: { mappeId: string; tittel: string; className: string; children: ReactNode }) {
  const d = useDra();
  const tar = d.aktiv && d.dras !== null;
  const erOver = tar && d.over === mappeId;
  const ta = (e: DragEvent<HTMLLIElement>) => {
    if (!tar) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    d.settOver(mappeId);
  };
  return (
    <li
      onDragEnter={ta}
      onDragOver={ta}
      onDragLeave={(e) => {
        // Funksjonell oppdatering: `d.over` her kan være gammel, og et annet kort kan alt ha tatt over.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) d.settOver((naa) => (naa === mappeId ? null : naa));
      }}
      onDrop={(e) => {
        if (!tar) return;
        e.preventDefault();
        d.slipp(mappeId, tittel);
      }}
      className={`${className}${tar ? " slippmaal-klar" : ""}${erOver ? " slippmaal-over" : ""}`}
    >
      {children}
      {erOver && (
        // Det synlige tegnet i tillegg til kanten; skjermlesere får meldingen etter slippet.
        <span aria-hidden="true" className="slippmaal-hint">
          Slipp for å legge i mappen
        </span>
      )}
    </li>
  );
}

/**
 * Over Mappekortene: hvordan draget brukes (bare når det er på), og
 * resultatet av et slipp, som status-melding i en fremhevet boks eller
 * Feilmelding (§5).
 */
export function Slippmelding() {
  const d = useDra();
  return (
    <>
      {d.aktiv && <p className="mt-1 text-dempet">Dra en tekst hit, eller bruk «Legg i mappe» under teksten.</p>}
      <Meldingsboks melding={d.melding} className="slippmelding" />
      {d.feil && <Feilmelding key={d.feil.n} melding={d.feil.melding} handling={d.feil.handling} fokus={false} />}
    </>
  );
}
