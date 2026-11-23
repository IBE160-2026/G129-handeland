"use client";

/**
 * Bunkene på arbeidsbordet og viften — FR-48 (EXPERIENCE.md: Bunke,
 * Hovedbunke, Viften, Aktivitetskort; DESIGN.md: board, stack-main,
 * stack-small, activity-card).
 *
 * Alt innholdet er regnet ut på serveren (data/arbeidsbord.ts). Her ligger
 * bare oppførselen:
 *
 *   - Hver bunke er én `<li>` med tittelen som overskrift og én knapp,
 *     «Vis aktiviteter for {tittel}», som dekker hele bunken. Uten
 *     JavaScript er den en lenke til `/tekst/[id]/oppgaver` (kuttrekkefølgen
 *     steg 2), og den blir en knapp først når skriptet kjører.
 *   - Hovedbunken har «Sist brukt» og en egen lenke for neste steg, lagt over
 *     knappen, ikke inni den.
 *   - Viften er en dialog (`role="dialog"`, `aria-modal`) som bare finnes i
 *     DOM-en når den er åpen. Resten av siden får `inert`, fokus flyttes til
 *     det første kortet og holdes i dialogen, og Esc eller «Legg sammen»
 *     lukker og gir fokus tilbake til bunkens knapp.
 *   - Kortene legges rundt bunken på brede skjermer når de målte
 *     størrelsene gir plass (vifteplass.ts), ellers i et rutenett under.
 *     `{motion.fan}` bare når bevegelse er tillatt (globals.css).
 *   - Smalere enn 760 px (bolk 6, utkast D) er viften et ark som glir opp
 *     fra bunnen, med de fem aktivitetene som rader. Det er den samme
 *     dialogen, med de samme reglene. Arket er høyst 90 % av skjermen og
 *     ruller selv; siden under ruller ikke. Det lukkes med «Legg sammen»,
 *     Esc eller trykk på bakgrunnen, aldri med sveip eller dragging.
 *   - Smalere enn 760 px er de små bunkene striper i full bredde (utkast C):
 *     tittelen, framdriften og «N av 5». Stilen står i globals.css.
 *
 * Mapper (runde 3, bolk 5, avgjort 23.11): en Mappe med Tekster er én bunke
 * med mappefane, merkelappen «Mappe» og «N tekster» (i stedet for «lagt
 * inn …»). Knappen heter «Vis tekstene i mappen {tittel}», og uten
 * JavaScript er den en lenke til `/mappe/{id}`. Viften for en Mappe har to
 * nivåer i samme dialog: først Tekstene (tittel og «N av 5 påbegynt») og de
 * to samlede kortene, «Øvekort for hele mappen» og «Quiz for hele mappen».
 * Velges en Tekst, viser dialogen dens fem aktivitetskort med «Tilbake til
 * mappen», og fokus går til det første aktivitetskortet; tilbake går fokus
 * til tekstkortet eleven kom fra. Ellers gjelder de samme reglene.
 */

import Link from "next/link";
import { type CSSProperties, type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Kort } from "../../data/arbeidsbord";
import { TELEFON } from "./brytepunkt";
import { KNAPP_SEKUNDAER } from "./knapper";
import { BuddyMerke } from "./Merke";
import { type Punkt, plasserRundt } from "./vifteplass";

/** En Tekst på bordet, eller i en Mappe. */
export type Visningsbunke = {
  slag?: "tekst";
  id: string;
  tittel: string;
  /** «11. nov.» */
  dato: string;
  /** Én per kort, i viftens rekkefølge: påbegynt eller ikke. */
  framdrift: boolean[];
  kort: Kort[];
};

/** En Mappe med minst én Tekst, som én bunke. Tekstene står med den som sist var aktiv, først. */
export type Mappevisning = {
  slag: "mappe";
  id: string;
  tittel: string;
  tekster: Visningsbunke[];
};

export type Bordvisning = Visningsbunke | Mappevisning;

export type Hovedbunke = Bordvisning & {
  /** Neste steg. Er hovedbunken en Mappe, gjelder det Teksten som sist ble brukt, og tittelen står i lenken. */
  neste: { tekst: string; href: string };
  /** Buddys boble, som gjentar neste steg. Bare pynt. */
  boble: string;
};

type Oppsett =
  | { modus: "maal" }
  | { modus: "rutenett" }
  | { modus: "ark" }
  | { modus: "rundt"; hoeyde: number; senter: Punkt; kort: Punkt[] };

/** Ett kort i viften: en aktivitet, en Tekst i Mappen, eller samlet øving for hele Mappen. */
type Vifteelement =
  | { slag: "aktivitet"; noekkel: string; kort: Kort }
  | { slag: "tekst"; noekkel: string; tekst: Visningsbunke }
  | { slag: "samlet"; noekkel: string; navn: string; status: string; href: string; ikon: string };

const IKON: Record<Kort["navn"], string> = { Teksten: "T", Quiz: "?", Øvekort: "◫", Fagsamtale: "“", Minnevers: "♪" };

/** Det første kortet i viften som kan få fokus (et låst kort er ikke en lenke). */
const FOERSTE_KORT = ".vifte-kort a, .vifte-kort button";

function antallTekster(n: number): string {
  return n === 1 ? "1 tekst" : `${n} tekster`;
}

function paabegynt(t: Visningsbunke): string {
  return `${t.framdrift.filter(Boolean).length} av ${t.framdrift.length} påbegynt`;
}

/** Usann på serveren og under hydrering, sann når skriptet kjører. */
const ingenting = () => () => {};
function useHarSkript() {
  return useSyncExternalStore(
    ingenting,
    () => true,
    () => false,
  );
}

export function Arbeidsbord({
  hoved,
  smaa,
  antall,
  synlige,
}: {
  hoved: Hovedbunke;
  smaa: Bordvisning[];
  /** Alle elevens Tekster. */
  antall: number;
  /** Hvor mange ulike Tekster som kan nås fra bordet (også de i mappebunkene). */
  synlige: number;
}) {
  const harSkript = useHarSkript();
  const vifteId = useId();
  const [apen, settApen] = useState<string | null>(null);
  /** I en Mappe: Teksten eleven har valgt, eller `null` når Mappens kort vises. */
  const [valgtTekst, settValgtTekst] = useState<string | null>(null);
  const [oppsett, settOppsett] = useState<Oppsett>({ modus: "rutenett" });
  const rot = useRef<HTMLDivElement>(null);
  const vifte = useRef<HTMLDivElement>(null);
  const knapper = useRef(new Map<string, HTMLButtonElement>());
  const bunker = useRef(new Map<string, HTMLLIElement>());
  const tilbake = useRef<string | null>(null);
  /**
   * Satt når eleven bytter nivå i en Mappe: hvor fokus skal når kortene
   * ligger der de skal. `null` er det første kortet, ellers tekstkortet med
   * den id-en (tilbake til mappen).
   */
  const nyttFokus = useRef<{ tekst: string | null } | null>(null);
  const proeve = useRef<HTMLSpanElement>(null);

  const alle: Bordvisning[] = [hoved, ...smaa];
  const valgt = alle.find((b) => b.id === apen) ?? null;
  // Teksten kan være borte etter en revalidering (slettet i en annen fane).
  // Da lukkes viften; ellers ble resten av siden stående inert uten dialog.
  if (apen !== null && !valgt) settApen(null);
  const mappe = valgt?.slag === "mappe" ? valgt : null;
  const tekstIMappe = (mappe && valgtTekst !== null && mappe.tekster.find((t) => t.id === valgtTekst)) || null;
  // Den valgte Teksten er tatt ut av Mappen: tilbake til Mappens kort.
  if (valgtTekst !== null && !tekstIMappe) settValgtTekst(null);
  /** Det som står i midten av viften: Mappen, eller en Tekst (alene eller valgt i Mappen). */
  const midt: Bordvisning | null = tekstIMappe ?? valgt;
  /** Endres når kortene i viften byttes ut, så de måles på nytt. */
  const nivaa = tekstIMappe ? `${apen}/${tekstIMappe.id}` : apen;

  const elementer: Vifteelement[] = !midt
    ? []
    : midt.slag === "mappe"
      ? [
          ...midt.tekster.map((t): Vifteelement => ({ slag: "tekst", noekkel: `tekst:${t.id}`, tekst: t })),
          { slag: "samlet", noekkel: "oevekort", navn: "Øvekort for hele mappen", status: "Fagordene fra alle tekstene", href: `/mappe/${midt.id}/oevekort`, ikon: IKON.Øvekort },
          { slag: "samlet", noekkel: "quiz", navn: "Quiz for hele mappen", status: "Spørsmål fra alle tekstene", href: `/mappe/${midt.id}/quiz`, ikon: IKON.Quiz },
        ]
      : midt.kort.map((k): Vifteelement => ({ slag: "aktivitet", noekkel: `${midt.id}:${k.navn}`, kort: k }));

  /**
   * På telefon er viften et ark nedenfra. Ellers prøver den å legge kortene
   * rundt bunken bare når bordet selv sprer bunkene (container query i
   * globals.css: .bord-flate er et rutenett). Da slår bordoppsettet, Buddy og
   * viftens «rundt» inn ved samme bredde.
   */
  function startOppsett(): Oppsett {
    if (matchMedia(TELEFON).matches) return { modus: "ark" };
    const flate = rot.current?.querySelector(".bord-flate");
    return flate && getComputedStyle(flate).display === "grid" ? { modus: "maal" } : { modus: "rutenett" };
  }
  function apne(id: string) {
    tilbake.current = id;
    nyttFokus.current = null;
    settValgtTekst(null);
    settOppsett(startOppsett());
    settApen(id);
  }
  function lukk() {
    settApen(null);
  }
  /** I en Mappe: vis Tekstens fem aktivitetskort i samme dialog. */
  function velgTekst(id: string) {
    nyttFokus.current = { tekst: null };
    settValgtTekst(id);
    settOppsett(startOppsett());
  }
  function tilbakeTilMappen() {
    nyttFokus.current = { tekst: valgtTekst };
    settValgtTekst(null);
    settOppsett(startOppsett());
  }

  // Mål kortene og bunken, og legg dem rundt bunken hvis det er plass. Før
  // første tegning, så eleven aldri ser målingen.
  useLayoutEffect(() => {
    const v = vifte.current;
    if (!apen || !nivaa || !v || oppsett.modus !== "maal") return;
    const senter = v.querySelector<HTMLElement>(".vifte-senter")!;
    const kort = [...v.querySelectorAll<HTMLElement>(".vifte-kort > li")];
    const toppknapper = [...v.querySelectorAll<HTMLElement>(".vifte-topp > button")];
    const luft = parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.25;
    const plass = plasserRundt(
      v.clientWidth,
      { b: senter.offsetWidth, h: senter.offsetHeight },
      kort.map((k) => ({ b: k.offsetWidth, h: k.offsetHeight })),
      luft,
    );
    if (!plass) {
      settOppsett({ modus: "rutenett" });
      return;
    }
    // Plass til «Legg sammen» øverst til høyre (og «Tilbake til mappen» til venstre).
    const topp = Math.max(...toppknapper.map((k) => k.offsetHeight)) + luft;
    settOppsett({
      modus: "rundt",
      hoeyde: plass.hoeyde + topp,
      senter: { x: plass.senter.x, y: plass.senter.y + topp },
      kort: plass.kort.map((p) => ({ x: p.x, y: p.y + topp })),
    });
  }, [apen, nivaa, oppsett.modus]);

  // Når kortene ligger der de skal: regn ut hvor de flyr fra (bunkens plass),
  // start bevegelsen og flytt fokus til det første kortet.
  useLayoutEffect(() => {
    const v = vifte.current;
    if (!apen || !v || oppsett.modus === "maal") return;
    const fra = bunker.current.get(apen)?.getBoundingClientRect();
    const flate = v.getBoundingClientRect();
    const senter = v.querySelector<HTMLElement>(".vifte-senter")!;
    const midt = (e: HTMLElement) => ({
      x: oppsett.modus === "rundt" ? e.offsetLeft : e.offsetLeft + e.offsetWidth / 2,
      y: oppsett.modus === "rundt" ? e.offsetTop : e.offsetTop + e.offsetHeight / 2,
    });
    const s = midt(senter);
    if (fra) {
      senter.style.setProperty("--fra-x", `${fra.left + fra.width / 2 - flate.left - s.x}px`);
      senter.style.setProperty("--fra-y", `${fra.top + fra.height / 2 - flate.top - s.y}px`);
    }
    for (const li of v.querySelectorAll<HTMLElement>(".vifte-kort > li")) {
      const k = midt(li);
      li.style.setProperty("--fra-x", `${s.x - k.x}px`);
      li.style.setProperty("--fra-y", `${s.y - k.y}px`);
    }
    if (!v.classList.contains("klar")) {
      v.classList.add("klar");
      v.querySelector<HTMLElement>(FOERSTE_KORT)?.focus({ preventScroll: true });
      // Arket ligger fast nederst og ruller selv; siden skal ikke flytte seg.
      if (oppsett.modus !== "ark") senter.scrollIntoView({ block: "nearest" });
    } else if (nyttFokus.current) {
      // Nytt nivå i en Mappe: det første aktivitetskortet, eller tekstkortet eleven kom fra.
      const { tekst } = nyttFokus.current;
      nyttFokus.current = null;
      const maal = tekst !== null ? v.querySelector<HTMLElement>(`[data-tekst="${CSS.escape(tekst)}"]`) : null;
      (maal ?? v.querySelector<HTMLElement>(FOERSTE_KORT))?.focus({ preventScroll: true });
      if (oppsett.modus !== "ark") senter.scrollIntoView({ block: "nearest" });
    }
  }, [apen, oppsett]);

  // Mens arket er åpent, ruller arket og ikke siden under (globals.css, html.har-ark).
  const ark = apen !== null && oppsett.modus === "ark";
  useEffect(() => {
    if (!ark) return;
    document.documentElement.classList.add("har-ark");
    return () => document.documentElement.classList.remove("har-ark");
  }, [ark]);

  // Resten av siden får `inert` mens viften er åpen (bordet selv får det som prop).
  useEffect(() => {
    if (!apen || !rot.current) return;
    const satt: HTMLElement[] = [];
    for (let e: HTMLElement | null = rot.current; e && e !== document.body; e = e.parentElement) {
      for (const sosken of e.parentElement?.children ?? []) {
        if (sosken !== e && sosken instanceof HTMLElement && !sosken.inert) {
          sosken.inert = true;
          satt.push(sosken);
        }
      }
    }
    const esc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") settApen(null);
    };
    document.addEventListener("keydown", esc);
    return () => {
      for (const e of satt) e.inert = false;
      document.removeEventListener("keydown", esc);
    };
  }, [apen]);

  // Mål på nytt når bordet blir bredere eller smalere, når tekststørrelsen
  // endres (prøven er 1 rem bred), og når en skrift er lastet og har endret
  // høyden på kortene. Bare når noe faktisk er endret, så målingen ikke går i ring.
  useEffect(() => {
    const bord = rot.current;
    const rem = proeve.current;
    if (!apen || !bord || !rem) return;
    const nyttOppsett = () => settOppsett(startOppsett());
    let sist: string | null = null;
    const ro = new ResizeObserver(() => {
      const noekkel = `${bord.clientWidth}|${rem.offsetWidth}`;
      if (sist !== null && noekkel !== sist) nyttOppsett();
      sist = noekkel;
    });
    ro.observe(bord);
    ro.observe(rem);
    let aktiv = true;
    if (document.fonts.status !== "loaded") void document.fonts.ready.then(() => aktiv && nyttOppsett());
    document.fonts.addEventListener("loadingdone", nyttOppsett);
    return () => {
      aktiv = false;
      ro.disconnect();
      document.fonts.removeEventListener("loadingdone", nyttOppsett);
    };
  }, [apen]);

  // Fokus tilbake til bunkens knapp når viften lukkes.
  useEffect(() => {
    if (apen !== null || tilbake.current === null) return;
    knapper.current.get(tilbake.current)?.focus();
    tilbake.current = null;
  }, [apen]);

  /** Tab og Shift+Tab går rundt i dialogen. */
  function holdFokus(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !vifte.current) return;
    const fokuserbare = [...vifte.current.querySelectorAll<HTMLElement>("a[href], button")];
    const foerste = fokuserbare[0];
    const siste = fokuserbare[fokuserbare.length - 1];
    if (e.shiftKey && (document.activeElement === foerste || !vifte.current.contains(document.activeElement))) {
      e.preventDefault();
      siste.focus();
    } else if (!e.shiftKey && document.activeElement === siste) {
      e.preventDefault();
      foerste.focus();
    }
  }

  const rundt = oppsett.modus === "rundt" ? oppsett : null;
  const plassering = (p: Punkt | undefined): CSSProperties => (p ? { left: p.x, top: p.y } : {});

  return (
    <div ref={rot} className="bord">
      {/* Prøve for tekststørrelsen: 1 rem bred og usynlig. */}
      <span ref={proeve} aria-hidden="true" className="bord-proeve" />
      <div className={`bord-flate ${apen ? "dempet" : ""}`} inert={apen !== null}>
        <ul className="bunker">
          {alle.map((b, i) => {
            const erHoved = i === 0;
            const erMappe = b.slag === "mappe";
            const navn = erMappe ? `Vis tekstene i mappen ${b.tittel}` : `Vis aktiviteter for ${b.tittel}`;
            return (
              <li
                key={b.id}
                ref={(e) => {
                  if (e) bunker.current.set(b.id, e);
                  else bunker.current.delete(b.id);
                }}
                className={`bunke ${erHoved ? "bunke-hoved" : ""} ${erMappe ? "bunke-mappe" : ""}`}
              >
                <div className="bunke-forside">
                  {erHoved && <p className="bunke-merkelapp">Sist brukt</p>}
                  {erMappe && <p className="bunke-mappemerke">Mappe</p>}
                  <h2 className="bunke-tittel">{b.tittel}</h2>
                  {erMappe ? (
                    <p className="bunke-tekster text-dempet">{antallTekster(b.tekster.length)}</p>
                  ) : (
                    <p className="bunke-dato text-dempet">lagt inn {b.dato}</p>
                  )}
                  {erHoved && (
                    <Link href={hoved.neste.href} className="bunke-neste">
                      {hoved.neste.tekst} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                  {!erMappe && (
                    <>
                      <span className="framdrift" aria-hidden="true">
                        {b.framdrift.map((ja, n) => (
                          <i key={n} className={ja ? "ja" : undefined} />
                        ))}
                      </span>
                      {/* På stripene (telefon) står bare «N av 5»; «påbegynt» er da skjult tekst. */}
                      <p className="bunke-antall text-dempet">
                        {b.framdrift.filter(Boolean).length} av {b.framdrift.length}
                        <span className={`bunke-paabegynt${erHoved ? "" : " max-[759.98px]:sr-only"}`}> påbegynt</span>
                      </p>
                    </>
                  )}
                  {harSkript ? (
                    <button
                      type="button"
                      ref={(e) => {
                        if (e) knapper.current.set(b.id, e);
                        else knapper.current.delete(b.id);
                      }}
                      className="bunke-knapp"
                      aria-expanded={apen === b.id}
                      aria-controls={apen === b.id ? vifteId : undefined}
                      onClick={() => (apen === b.id ? lukk() : apne(b.id))}
                    >
                      <span className="sr-only">{navn}</span>
                    </button>
                  ) : (
                    <a href={erMappe ? `/mappe/${b.id}` : `/tekst/${b.id}/oppgaver`} className="bunke-knapp">
                      <span className="sr-only">{navn}</span>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="bord-buddy" aria-hidden="true">
          <BuddyMerke variant="ansikt" storrelse={64} />
          <span className="bord-boble">{hoved.boble}</span>
        </div>

        <Link href="/ny" className="bord-ny">
          + Legg en ny tekst på bordet
        </Link>
        {/* FR-50: «Mappene dine» står ved siden av Samlingslenken. */}
        <p className="bord-samling flex flex-wrap justify-center gap-x-6">
          {antall > synlige && (
            <Link href="/samling" className="inline-flex min-h-11 items-center text-dempet underline underline-offset-4">
              Se alle {antall} tekstene i Samlinger
            </Link>
          )}
          <Link href="/samling#mapper" className="inline-flex min-h-11 items-center text-dempet underline underline-offset-4">
            Mappene dine
          </Link>
        </p>
      </div>

      {/* Bakgrunnen bak arket: et trykk på den legger arket sammen. Pynt for skjermlesere. */}
      {midt && ark && <div className="vifte-bakgrunn" aria-hidden="true" onClick={lukk} />}
      {midt && (
        <div
          ref={vifte}
          id={vifteId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${vifteId}-tittel`}
          className="vifte"
          data-oppsett={oppsett.modus}
          style={rundt ? { height: rundt.hoeyde } : undefined}
          onKeyDown={holdFokus}
          onClick={(e) => {
            // Et trykk på bordet rundt kortene legger viften sammen. Arket er selve
            // dialogen, så der er det bakgrunnen (.vifte-bakgrunn) som lukker.
            if (e.target === e.currentTarget && oppsett.modus !== "ark") lukk();
          }}
        >
          {/*
            Først i dialogen, fordi de står øverst (WCAG 2.4.3): «Tilbake til mappen»
            til venstre når en Tekst i en Mappe er valgt, og «Legg sammen» til høyre.
            Fokus går likevel til det første kortet.
          */}
          <div className={`vifte-topp ${tekstIMappe ? "med-tilbake" : ""}`}>
            {tekstIMappe && mappe && (
              <button type="button" className={`vifte-tilbake gap-2 bg-flate ${KNAPP_SEKUNDAER}`} onClick={tilbakeTilMappen}>
                {/* Mappens navn for skjermlesere: en Tekst kan ligge i flere Mapper. */}
                <span aria-hidden="true">←</span> Tilbake til mappen<span className="sr-only"> «{mappe.tittel}»</span>
              </button>
            )}
            <button type="button" className={`vifte-lukk gap-2 bg-flate ${KNAPP_SEKUNDAER}`} onClick={lukk}>
              Legg sammen <span aria-hidden="true">✕</span>
            </button>
          </div>
          <div className={`bunke vifte-senter ${midt.slag === "mappe" ? "bunke-mappe" : ""}`} style={plassering(rundt?.senter)}>
            <div className="bunke-forside">
              {midt.slag === "mappe" && <p className="bunke-mappemerke">Mappe</p>}
              <h2 id={`${vifteId}-tittel`} className="bunke-tittel">
                {midt.tittel}
              </h2>
              {midt.slag === "mappe" ? (
                <p className="text-dempet">{antallTekster(midt.tekster.length)}</p>
              ) : (
                <>
                  <p className="text-dempet">lagt inn {midt.dato}</p>
                  <p className="text-dempet">{paabegynt(midt)}</p>
                </>
              )}
            </div>
          </div>
          <ul className="vifte-kort">
            {elementer.map((el, i) => (
              <li
                key={el.noekkel}
                style={{ "--i": i, "--r": `${(i % 2 ? 1 : -1) * (2 + (i % 5))}deg`, ...plassering(rundt?.kort[i]) } as CSSProperties}
              >
                {el.slag === "aktivitet" ? (
                  <Aktivitetskort kort={el.kort} />
                ) : el.slag === "tekst" ? (
                  <button type="button" className="kort kort-tekst" data-tekst={el.tekst.id} onClick={() => velgTekst(el.tekst.id)}>
                    <span className="kort-ikon" aria-hidden="true">
                      {IKON.Teksten}
                    </span>
                    <span className="kort-navn">{el.tekst.tittel}</span>
                    <span className="kort-status">{paabegynt(el.tekst)}</span>
                    <span className="kort-pil" aria-hidden="true">
                      ›
                    </span>
                  </button>
                ) : (
                  <Link href={el.href} className="kort kort-samlet">
                    <span className="kort-ikon" aria-hidden="true">
                      {el.ikon}
                    </span>
                    <span className="kort-navn">{el.navn}</span>
                    <span className="kort-status">{el.status}</span>
                    <span className="kort-pil" aria-hidden="true">
                      ›
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Aktivitetskort({ kort }: { kort: Kort }) {
  const status = kort.pille ? (
    <>
      {kort.status.split(kort.pille)[0]}
      <span className="pille">{kort.pille}</span>
      {kort.status.split(kort.pille).slice(1).join(kort.pille)}
    </>
  ) : (
    kort.status
  );

  if (kort.href === null) {
    // Låst: ikke en lenke, men står på sin faste plass og leses i rekkefølgen.
    return (
      <div className="kort kort-laast">
        <span className="kort-ikon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <span className="kort-navn">
          {kort.navn}
          {/* Mellomrommet holder «Minnevers» og «Uferdig» som to ord for skjermlesere. */}
          {kort.merke && <> <span className="kort-merke">{kort.merke}</span></>}
        </span>
        <span className="kort-status">{status}</span>
      </div>
    );
  }
  return (
    <Link href={kort.href} className="kort">
      <span className="kort-ikon" aria-hidden="true">
        {IKON[kort.navn]}
      </span>
      <span className="kort-navn">
          {kort.navn}
          {/* Mellomrommet holder «Minnevers» og «Uferdig» som to ord for skjermlesere. */}
          {kort.merke && <> <span className="kort-merke">{kort.merke}</span></>}
        </span>
      <span className="kort-status">{status}</span>
      {/* Pilen vises bare i radene på arket (telefon). */}
      <span className="kort-pil" aria-hidden="true">
        ›
      </span>
    </Link>
  );
}
