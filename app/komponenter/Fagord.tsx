"use client";

/**
 * Én markering i Lesevisningen, med forklaringen rett ved ordet — FR-10.
 *
 * Forklaringen åpnes på TRE måter: trykk, pekerhvil og tastaturfokus. Den
 * lukkes med Escape, trykk utenfor og lukkeknappen. Trykk er ikke en
 * ettertanke: på telefon finnes ikke pekerhvil, og sidefeltet med alle
 * forklaringene havner under teksten.
 *
 * To tilstander holdes fra hverandre: «festet» (åpnet med trykk, blir stående
 * til den lukkes) og «kikk» (åpnet med hvil eller fokus, lukkes når pekeren
 * eller fokuset går). Uten skillet ville et trykk på telefon — som også gir
 * fokus — lukket seg idet fingeren slapp.
 *
 * Rulleposisjonen endres ikke (FR-10): boblen er absolutt plassert inne i
 * linjen, og fokus flyttes med `preventScroll`. På telefon ligger den fast
 * nederst på skjermen i stedet — der er det ikke plass ved siden av ordet,
 * og en boble som stakk ut av kanten ble funnet av tilgjengelighetssjekken.
 */

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

type Props = {
  tekst: string;
  uttrykk: string;
  forklaring: string;
  /** Id-en til forklaringen i sidefeltet, for skjermleser (aria-describedby). */
  beskrivelseId: string;
  morsmaal?: { tekst: string; kode: string; retning: "ltr" | "rtl" };
};

export function Fagord({ tekst, uttrykk, forklaring, beskrivelseId, morsmaal }: Props) {
  const [festet, settFestet] = useState(false);
  const [kikk, settKikk] = useState(false);
  const [forskyv, settForskyv] = useState(0);
  const rot = useRef<HTMLSpanElement>(null);
  const knapp = useRef<HTMLButtonElement>(null);
  const boble = useRef<HTMLSpanElement>(null);
  // Når boblen lukkes, flyttes fokus tilbake til ordet. Det fokuset skal ikke
  // åpne boblen igjen — uten dette lukket lukkeknappen ingenting.
  const tilbake = useRef(false);
  const id = useId();
  const aapen = festet || kikk;

  function lukk() {
    settFestet(false);
    settKikk(false);
  }

  // Trykk utenfor og Escape lukker. Lytterne finnes bare mens boblen er åpen.
  useEffect(() => {
    if (!aapen) return;
    function trykk(e: PointerEvent) {
      if (rot.current && !rot.current.contains(e.target as Node)) lukk();
    }
    function tast(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      lukk();
      tilbake.current = true;
      knapp.current?.focus({ preventScroll: true });
    }
    document.addEventListener("pointerdown", trykk);
    document.addEventListener("keydown", tast);
    return () => {
      document.removeEventListener("pointerdown", trykk);
      document.removeEventListener("keydown", tast);
    };
  }, [aapen]);

  // Boblen skal ikke stikke ut av skjermen. Gjelder fra sm og opp — på
  // telefon ligger den fast nederst på skjermen og trenger ingen forskyvning.
  useLayoutEffect(() => {
    if (!aapen || !boble.current || !window.matchMedia("(min-width: 40rem)").matches) {
      settForskyv(0);
      return;
    }
    const r = boble.current.getBoundingClientRect();
    const kant = 8;
    const over = r.right - (window.innerWidth - kant);
    if (over > 0) settForskyv(-Math.min(over, r.left - kant));
  }, [aapen]);

  return (
    <span
      ref={rot}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && settKikk(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && settKikk(false)}
    >
      <button
        ref={knapp}
        type="button"
        aria-describedby={beskrivelseId}
        aria-expanded={aapen}
        aria-controls={id}
        // Første trykk fester boblen (også når fokus alt har åpnet den), neste lukker.
        onClick={() => (festet ? lukk() : settFestet(true))}
        onFocus={() => {
          if (tilbake.current) tilbake.current = false;
          else settKikk(true);
        }}
        onBlur={(e) => {
          // Fokus som går til lukkeknappen i boblen, skal ikke lukke den.
          if (!rot.current?.contains(e.relatedTarget as Node)) settKikk(false);
        }}
        className="rounded-sm bg-amber-100 px-0.5 underline decoration-amber-600 decoration-2 underline-offset-2 hover:bg-amber-200 focus:outline-2 focus:outline-offset-2 focus:outline-amber-700 dark:bg-amber-900/50 dark:decoration-amber-400 dark:hover:bg-amber-900"
      >
        {tekst}
      </button>
      {aapen && (
        <span
          ref={boble}
          id={id}
          role="dialog"
          aria-label={`Forklaring: ${uttrykk}`}
          style={{ transform: `translateX(${forskyv}px)` }}
          className="fixed inset-x-2 bottom-2 z-20 block rounded-md sm:absolute sm:inset-x-auto sm:top-full sm:bottom-auto sm:left-0 sm:mt-2 sm:w-72 border border-slate-300 bg-white p-3 text-left text-base leading-normal font-normal shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <span className="flex items-start justify-between gap-2">
            <span className="font-semibold">{uttrykk}</span>
            <button
              type="button"
              onClick={() => {
                lukk();
                tilbake.current = true;
                knapp.current?.focus({ preventScroll: true });
              }}
              aria-label="Lukk forklaringen"
              className="-mt-1 -mr-1 rounded px-2 text-lg leading-none hover:bg-slate-100 focus:outline-2 focus:outline-slate-900 dark:hover:bg-slate-800"
            >
              ×
            </button>
          </span>
          <span className="mt-1 block text-sm text-slate-700 dark:text-slate-300">{forklaring}</span>
          {morsmaal && (
            <span
              lang={morsmaal.kode}
              dir={morsmaal.retning}
              className="mt-2 block border-t border-slate-200 pt-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              {morsmaal.tekst}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
