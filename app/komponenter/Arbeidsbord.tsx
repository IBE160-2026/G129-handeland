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
 */

import Link from "next/link";
import { type CSSProperties, type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Kort } from "../../data/arbeidsbord";
import { KNAPP_SEKUNDAER } from "./knapper";
import { BuddyMerke } from "./Merke";
import { type Punkt, plasserRundt } from "./vifteplass";

export type Visningsbunke = {
  id: string;
  tittel: string;
  /** «11. nov.» */
  dato: string;
  /** Én per kort, i viftens rekkefølge: påbegynt eller ikke. */
  framdrift: boolean[];
  kort: Kort[];
};

export type Hovedbunke = Visningsbunke & {
  neste: { tekst: string; href: string };
  /** Buddys boble, som gjentar neste steg. Bare pynt. */
  boble: string;
};

type Oppsett =
  | { modus: "maal" }
  | { modus: "rutenett" }
  | { modus: "rundt"; hoeyde: number; senter: Punkt; kort: Punkt[] };

const IKON: Record<Kort["navn"], string> = { Teksten: "T", Quiz: "?", Øvekort: "◫", Fagsamtale: "“", Minnevers: "♪" };

/** Usann på serveren og under hydrering, sann når skriptet kjører. */
const ingenting = () => () => {};
function useHarSkript() {
  return useSyncExternalStore(
    ingenting,
    () => true,
    () => false,
  );
}

export function Arbeidsbord({ hoved, smaa, antall }: { hoved: Hovedbunke; smaa: Visningsbunke[]; antall: number }) {
  const harSkript = useHarSkript();
  const vifteId = useId();
  const [apen, settApen] = useState<string | null>(null);
  const [oppsett, settOppsett] = useState<Oppsett>({ modus: "rutenett" });
  const rot = useRef<HTMLDivElement>(null);
  const vifte = useRef<HTMLDivElement>(null);
  const knapper = useRef(new Map<string, HTMLButtonElement>());
  const bunker = useRef(new Map<string, HTMLLIElement>());
  const tilbake = useRef<string | null>(null);
  const proeve = useRef<HTMLSpanElement>(null);

  const alle = [hoved, ...smaa];
  const valgt = alle.find((b) => b.id === apen) ?? null;
  // Teksten kan være borte etter en revalidering (slettet i en annen fane).
  // Da lukkes viften; ellers ble resten av siden stående inert uten dialog.
  if (apen !== null && !valgt) settApen(null);

  /**
   * Viften prøver å legge kortene rundt bunken bare når bordet selv sprer
   * bunkene (container query i globals.css: .bord-flate er et rutenett). Da
   * slår bordoppsettet, Buddy og viftens «rundt» inn ved samme bredde.
   */
  function startOppsett(): Oppsett {
    const flate = rot.current?.querySelector(".bord-flate");
    return flate && getComputedStyle(flate).display === "grid" ? { modus: "maal" } : { modus: "rutenett" };
  }
  function apne(id: string) {
    tilbake.current = id;
    settOppsett(startOppsett());
    settApen(id);
  }
  function lukk() {
    settApen(null);
  }

  // Mål kortene og bunken, og legg dem rundt bunken hvis det er plass. Før
  // første tegning, så eleven aldri ser målingen.
  useLayoutEffect(() => {
    const v = vifte.current;
    if (!apen || !v || oppsett.modus !== "maal") return;
    const senter = v.querySelector<HTMLElement>(".vifte-senter")!;
    const kort = [...v.querySelectorAll<HTMLElement>(".vifte-kort > li")];
    const lukkKnapp = v.querySelector<HTMLElement>(".vifte-lukk")!;
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
    // Plass til «Legg sammen» øverst til høyre.
    const topp = lukkKnapp.offsetHeight + luft;
    settOppsett({
      modus: "rundt",
      hoeyde: plass.hoeyde + topp,
      senter: { x: plass.senter.x, y: plass.senter.y + topp },
      kort: plass.kort.map((p) => ({ x: p.x, y: p.y + topp })),
    });
  }, [apen, oppsett.modus]);

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
      v.querySelector<HTMLElement>(".vifte-kort a, .vifte-kort [tabindex]")?.focus({ preventScroll: true });
      senter.scrollIntoView({ block: "nearest" });
    }
  }, [apen, oppsett]);

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
            const navn = `Vis aktiviteter for ${b.tittel}`;
            return (
              <li
                key={b.id}
                ref={(e) => {
                  if (e) bunker.current.set(b.id, e);
                  else bunker.current.delete(b.id);
                }}
                className={`bunke ${erHoved ? "bunke-hoved" : ""}`}
              >
                <div className="bunke-forside">
                  {erHoved && <p className="bunke-merkelapp">Sist brukt</p>}
                  <h2 className="bunke-tittel">{b.tittel}</h2>
                  <p className="text-dempet">lagt inn {b.dato}</p>
                  {erHoved && (
                    <Link href={hoved.neste.href} className="bunke-neste">
                      {hoved.neste.tekst} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                  <span className="framdrift" aria-hidden="true">
                    {b.framdrift.map((ja, n) => (
                      <i key={n} className={ja ? "ja" : undefined} />
                    ))}
                  </span>
                  <p className="text-dempet">
                    {b.framdrift.filter(Boolean).length} av {b.framdrift.length} påbegynt
                  </p>
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
                    <a href={`/tekst/${b.id}/oppgaver`} className="bunke-knapp">
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
        {antall > alle.length && (
          <Link href="/samling" className="bord-samling inline-flex min-h-11 items-center text-dempet underline underline-offset-4">
            Se alle {antall} tekstene i samlingen
          </Link>
        )}
      </div>

      {valgt && (
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
            // Et trykk på bordet rundt kortene legger viften sammen.
            if (e.target === e.currentTarget) lukk();
          }}
        >
          {/* Først i dialogen, fordi den står øverst (WCAG 2.4.3). Fokus går likevel til det første kortet. */}
          <button type="button" className={`vifte-lukk gap-2 bg-flate ${KNAPP_SEKUNDAER}`} onClick={lukk}>
            Legg sammen <span aria-hidden="true">✕</span>
          </button>
          <div className="bunke vifte-senter" style={plassering(rundt?.senter)}>
            <div className="bunke-forside">
              <h2 id={`${vifteId}-tittel`} className="bunke-tittel">
                {valgt.tittel}
              </h2>
              <p className="text-dempet">lagt inn {valgt.dato}</p>
              <p className="text-dempet">
                {valgt.framdrift.filter(Boolean).length} av {valgt.framdrift.length} påbegynt
              </p>
            </div>
          </div>
          <ul className="vifte-kort">
            {valgt.kort.map((k, i) => (
              <li
                key={k.navn}
                style={{ "--i": i, "--r": `${(i % 2 ? 1 : -1) * (2 + i)}deg`, ...plassering(rundt?.kort[i]) } as CSSProperties}
              >
                <Aktivitetskort kort={k} />
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
        <span className="kort-navn">{kort.navn}</span>
        <span className="kort-status">{status}</span>
      </div>
    );
  }
  return (
    <Link href={kort.href} className="kort">
      <span className="kort-ikon" aria-hidden="true">
        {IKON[kort.navn]}
      </span>
      <span className="kort-navn">{kort.navn}</span>
      <span className="kort-status">{status}</span>
    </Link>
  );
}
