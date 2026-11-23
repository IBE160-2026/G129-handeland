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
 */

import {
  createContext,
  type Dispatch,
  type DragEvent,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
  useSyncExternalStore,
  useTransition,
} from "react";
import type { Feiltekst } from "../kifeil";
import { leggTekstIMappe } from "../handlinger";
import { Feilmelding } from "./Feilmelding";
import { lagtIMeldingen } from "./Mappeskjemaer";

const STOR = "(min-width: 760px)";
/**
 * Egen type i stedet for text/plain: slippes raden i et tekstfelt (søket,
 * navnet på en ny mappe), skal ikke tittelen skrives inn der.
 */
const TYPE = "application/x-lesebuddy-tekst";

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
  melding: string;
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
  const [melding, settMelding] = useState("");
  const [feil, settFeil] = useState<Dra["feil"]>(null);
  const [, startTransition] = useTransition();

  function slipp(mappeId: string, mappetittel: string) {
    const tekst = dras;
    settDras(null);
    settOver(null);
    if (!tekst) return;
    settFeil(null);
    settMelding(`Legger «${tekst.tittel}» i «${mappetittel}» …`);
    const data = new FormData();
    data.set("mappeId", mappeId);
    data.set("tekstId", tekst.id);
    startTransition(async () => {
      const svar = await leggTekstIMappe({}, data).catch(() => ({ feil: NETTFEIL, lagtI: undefined }));
      if (svar.lagtI) {
        settMelding(lagtIMeldingen(tekst.tittel, svar.lagtI));
      } else {
        settMelding("");
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
  if (!d) throw new Error("DragbarTekst, Slippmaal og Slippmelding må stå inne i DraTilMappe.");
  return d;
}

/** En tekstrad (`<li>`) som kan dras til en Mappe når draget er på. */
export function DragbarTekst({ tekstId, tittel, className, children }: { tekstId: string; tittel: string; className: string; children: ReactNode }) {
  const d = useDra();
  return (
    <li
      draggable={d.aktiv || undefined}
      onDragStart={(e) => {
        if (!d.aktiv) return;
        // Et lite musedrag på «Legg i mappe», valget eller «Slett» skal ikke flytte raden.
        if ((e.target as Element).closest(".tekstrad-knapper")) {
          e.preventDefault();
          return;
        }
        // Raden kan dras fra lenken også; da er det likevel Teksten som flyttes.
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
    </li>
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
 * resultatet av et slipp, som status-melding eller Feilmelding (§5).
 */
export function Slippmelding() {
  const d = useDra();
  return (
    <>
      {d.aktiv && <p className="mt-1 text-dempet">Dra en tekst hit, eller bruk «Legg i mappe» under teksten.</p>}
      <p role="status" className="slippmelding [overflow-wrap:anywhere]">
        {d.melding}
      </p>
      {d.feil && <Feilmelding key={d.feil.n} melding={d.feil.melding} handling={d.feil.handling} fokus={false} />}
    </>
  );
}
