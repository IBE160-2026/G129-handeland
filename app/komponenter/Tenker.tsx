"use client";

/**
 * Tenkeindikatoren — DESIGN.md (thinking-indicator) og EXPERIENCE.md
 * (Component Patterns, State Patterns).
 *
 * Én felles visning for all venting på språkmodellen (§5), i tre former
 * (bolk 5). Buddy er alltid `BuddyMerke`. I de små formene er det mini-Buddy
 * M1: samme tegning, beskåret til brillene. Størrelsene står i globals.css
 * (`--tenker-merke`), som er fasit:
 *
 *   flate  Merket på 64 px med statusen ved siden av, i flaten der innholdet
 *          kommer. Smalere enn 760 px er den i stedet en pille som ligger fast
 *          nederst på skjermen, med brillene 28 px høye. Det er det samme
 *          elementet, så det finnes fortsatt bare én statusregion. Begge
 *          merkene tegnes, og CSS-en viser det som passer bredden.
 *   knapp  Brillene 20 px høye inne i knappen som ble trykket, med statusen
 *          som knappetekst. For korte ventinger. Komponenten tegner selve
 *          knappen; `children` er knappeteksten når ingenting venter.
 *   linje  Brillene 22 px høye foran én linje med status, for oversettelser i
 *          bakgrunnen.
 *
 * Felles for alle formene:
 *
 *   - Statusregionen (`role="status"`) rendres ALLTID, også når ingenting
 *     venter, så den finnes tom i siden før teksten skrives inn. Ellers er det
 *     tilfeldig om skjermleseren sier noe.
 *   - Mens `aktiv`: øynene leser i en løkke. Etter 30 s kommer et tillegg.
 *   - Går den fra aktiv til ikke aktiv med `ferdigStatus`, spilles
 *     avslutningen (4,3 s) én gang i indikatorens plass, og statusen settes
 *     til `ferdigStatus`. Uten `ferdigStatus` (feil, eller siden byttes)
 *     forsvinner indikatoren bare. Pillen glir bort etter avslutningen.
 *
 * Med `prefers-reduced-motion` står øynene stille, avslutningen viser B-en
 * direkte, og pillen forsvinner uten bevegelse (globals.css). Statusteksten
 * bærer beskjeden.
 */

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { BuddyMerke } from "./Merke";

const LANG_VENTING_MS = 30_000;
/** Avslutningen er 4,3 s; B-en blir stående litt før indikatoren går. */
const AVSLUTNING_MS = 4300 + 1200;
/**
 * Pillen er borte når `tenker-pille-ut` er ferdig (animationend). Tidtakeren
 * er en reserve for når animasjonen ikke kjører: på PC og med redusert
 * bevegelse skjules flaten uten animasjon.
 */
const UTGANG_RESERVE_MS = 1000;
export const LANG_VENTING_TEKST = "Dette tar lenger tid enn vanlig. Buddy jobber fortsatt.";

/* ------------------------------------------------------------------ */
/*
 * Pillene på siden. Pillen ligger over innholdet, så siden får like mye luft
 * nederst som pillene er høye (globals.css, `html.har-tenkepille`). Én eier på
 * modulnivå holder regnskapet, så to piller ikke overskriver hverandres verdi:
 * de stables nedenfra (eldste nederst), og klassen og variabelen på <html>
 * fjernes først når den siste synlige pillen er borte. Bare piller som faktisk
 * ligger fast og har høyde, telles.
 */
const piller: HTMLElement[] = [];
const PILLE_MELLOMROM_PX = 8;
let pilleObservator: ResizeObserver | null = null;

function oppdaterPiller() {
  const rot = document.documentElement;
  let hoeyde = 0;
  for (const el of piller) {
    const fast = getComputedStyle(el).position === "fixed" && el.offsetHeight > 0;
    if (!fast) {
      el.style.removeProperty("--tenker-over");
      continue;
    }
    if (hoeyde > 0) hoeyde += PILLE_MELLOMROM_PX;
    el.style.setProperty("--tenker-over", `${hoeyde}px`);
    hoeyde += el.offsetHeight;
  }
  if (hoeyde > 0) {
    rot.classList.add("har-tenkepille");
    rot.style.setProperty("--tenker-pille", `${hoeyde}px`);
  } else {
    rot.classList.remove("har-tenkepille");
    rot.style.removeProperty("--tenker-pille");
  }
}

function meldPille(el: HTMLElement): () => void {
  piller.push(el);
  if (!pilleObservator) {
    pilleObservator = new ResizeObserver(oppdaterPiller);
    window.addEventListener("resize", oppdaterPiller);
  }
  pilleObservator.observe(el);
  oppdaterPiller();
  return () => {
    piller.splice(piller.indexOf(el), 1);
    pilleObservator?.unobserve(el);
    el.style.removeProperty("--tenker-over");
    if (piller.length === 0) {
      pilleObservator?.disconnect();
      pilleObservator = null;
      window.removeEventListener("resize", oppdaterPiller);
    }
    oppdaterPiller();
  };
}

/* ------------------------------------------------------------------ */

export type TenkerForm = "flate" | "knapp" | "linje";

type Felles = {
  aktiv: boolean;
  /** Hva Buddy gjør, for eksempel «Buddy finner fagordene …». */
  status: string;
  /** Settes bare når svaret kom og komponenten lever videre, for eksempel «Quizen er rettet.». */
  ferdigStatus?: string;
  /** Avstand rundt indikatoren (flate, linje) eller knappens klasser (knapp). */
  className?: string;
};

type Flate = Felles & {
  form?: "flate";
  /** En kort linje under statusen, for eksempel hvor lenge det pleier å ta. */
  hjelp?: string;
  /**
   * Vis bare avslutningen, ikke selve ventingen. Brukes der svaret vises et
   * annet sted enn knappen (quizen ruller til resultatet øverst), mens en
   * annen Tenker i knappen viser ventingen.
   */
  bareAvslutning?: boolean;
};

type Linje = Felles & { form: "linje"; hjelp?: string };

type Knapp = Felles & {
  form: "knapp";
  /** Knappeteksten når ingenting venter. */
  children?: ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
};

type Fase = "hvile" | "slutt" | "gaar";

export function Tenker(props: Flate | Linje | Knapp) {
  const { aktiv, status, ferdigStatus, className = "" } = props;
  const form: TenkerForm = props.form ?? "flate";
  const hjelp = props.form === "knapp" ? undefined : props.hjelp;
  const bareAvslutning = props.form === undefined || props.form === "flate" ? (props.bareAvslutning ?? false) : false;

  // Avledet tilstand fra forrige `aktiv`, regnet ut under rendring (ikke i en
  // effekt), så avslutningen starter i samme tegning som svaret vises.
  const [forrigeAktiv, settForrigeAktiv] = useState(aktiv);
  const [sluttTekst, settSluttTekst] = useState<string | null>(null);
  const [fase, settFase] = useState<Fase>("hvile");
  const [lenge, settLenge] = useState(false);
  const [montert, settMontert] = useState(false);
  const flateRef = useRef<HTMLDivElement>(null);

  if (aktiv !== forrigeAktiv) {
    settForrigeAktiv(aktiv);
    const slutt = !aktiv && ferdigStatus ? ferdigStatus : null;
    settSluttTekst(slutt);
    settFase(slutt ? "slutt" : "hvile");
    settLenge(false);
  }

  // Regionen skal finnes tom før teksten kommer, også når komponenten
  // monteres midt i en venting (quizen som lages av seg selv).
  useEffect(() => {
    const id = requestAnimationFrame(() => settMontert(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!aktiv) return;
    const t = setTimeout(() => settLenge(true), LANG_VENTING_MS);
    return () => clearTimeout(t);
  }, [aktiv]);

  // Etter avslutningen glir pillen bort (bare flaten har en utgang).
  useEffect(() => {
    if (fase === "hvile") return;
    const t = setTimeout(
      () => settFase(fase === "slutt" && form === "flate" ? "gaar" : "hvile"),
      fase === "slutt" ? AVSLUTNING_MS : UTGANG_RESERVE_MS,
    );
    return () => clearTimeout(t);
  }, [fase, form]);

  const avslutter = !aktiv && fase !== "hvile" && sluttTekst !== null;
  // `bareAvslutning`: vis ingenting mens det ventes, bare avslutningen etterpå.
  const synlig = (aktiv && !bareAvslutning) || avslutter;
  const tilstand = aktiv ? "tenker" : "slutt";

  useEffect(() => {
    const el = flateRef.current;
    if (form !== "flate" || !synlig || !el) return;
    return meldPille(el);
  }, [form, synlig]);

  if (props.form === "knapp") {
    // Knappen er låst med aria-disabled, ikke disabled: da blir fokus stående
    // på knappen, også når kallet feiler og knappen går tilbake. Klikk og
    // innsending blokkeres mens Buddy tenker. Knappeteksten er statusen;
    // regionen ved siden av er bare for skjermlesere, og er tom før ventingen.
    const { onClick } = props;
    const trykk = (e: MouseEvent<HTMLButtonElement>) => {
      if (synlig) {
        e.preventDefault();
        return;
      }
      onClick?.();
    };
    return (
      <>
        <button
          type={props.type ?? "button"}
          aria-disabled={synlig || undefined}
          onClick={trykk}
          className={`tenker-knapp ${synlig ? "gap-2 text-start" : ""} ${className}`}
        >
          {synlig ? (
            <>
              <BuddyMerke variant="ansikt" mini tilstand={tilstand} storrelse="var(--tenker-merke)" />
              <span>{avslutter ? sluttTekst : status}</span>
            </>
          ) : (
            props.children
          )}
        </button>
        {aktiv && lenge && (
          <p aria-hidden="true" className="basis-full text-dempet">
            {LANG_VENTING_TEKST}
          </p>
        )}
        <div role="status" aria-live="polite" className="sr-only">
          {montert && synlig && (avslutter ? sluttTekst : lenge ? `${status} ${LANG_VENTING_TEKST}` : status)}
        </div>
      </>
    );
  }

  const innhold = !synlig ? null : avslutter ? (
    <p className="font-bold">{sluttTekst}</p>
  ) : form === "linje" ? (
    <p className="font-bold">
      {status}
      {hjelp && <span className="font-normal text-dempet"> {hjelp}</span>}
      {lenge && <span className="font-normal text-dempet"> {LANG_VENTING_TEKST}</span>}
    </p>
  ) : (
    <>
      <p className="font-bold">{status}</p>
      {hjelp && <p className="tenker-hjelp text-dempet">{hjelp}</p>}
      {lenge && <p className="tenker-lang text-dempet">{LANG_VENTING_TEKST}</p>}
    </>
  );

  const ramme =
    form === "linje"
      ? `tenker-linje flex items-center gap-2 ${className}`
      : `tenker-flate flex items-center gap-4 ${fase === "gaar" ? "gaar" : ""} ${className}`;

  return (
    <div
      ref={flateRef}
      className={synlig ? ramme : "contents"}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && e.animationName === "tenker-pille-ut") settFase("hvile");
      }}
    >
      {/* Flaten har begge merkene: 64 px fra 760 px, mini i pillen (globals.css). */}
      {synlig && form === "flate" && (
        <BuddyMerke variant="ansikt" tilstand={tilstand} storrelse="var(--tenker-merke)" />
      )}
      {synlig && <BuddyMerke variant="ansikt" mini tilstand={tilstand} storrelse="var(--tenker-merke)" />}
      {/*
        Før montering (serverrendringen og første tegning) står teksten som en
        synlig kopi utenfor regionen, skjult for skjermlesere. Regionen er tom
        til etter montering, så den finnes før teksten skrives inn.
      */}
      {synlig && !montert && (
        <div aria-hidden="true" className="min-w-0">
          {innhold}
        </div>
      )}
      <div role="status" aria-live="polite" className={synlig && montert ? "min-w-0" : "sr-only"}>
        {montert && innhold}
      </div>
    </div>
  );
}
