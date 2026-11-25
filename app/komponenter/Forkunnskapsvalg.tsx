"use client";

/**
 * FR-6 (runde 3, bolk 2a, 23.11.2026): forkunnskapen for én overskrift.
 *
 * En glider med tre trinn, `<input type="range">`, «Ingenting ennå» (venstre)
 * – «Litt» – «Mye» (høyre), og under den, sentrert, av/på-knappen «Skjønner
 * ikke overskriften» (`aria-pressed`). Reglene står i forkunnskapsglider.ts;
 * her oversettes hendelsene:
 *
 * - `onChange`: eleven drar eller trykker på sporet (og skjermlesere på
 *   telefon, som sveiper opp og ned).
 * - Draget (runde 3, bolk 8, 25.11): fra `pointerdown` (bare primærpekeren,
 *   venstre knapp) til `pointerup`/`pointercancel` har glideren
 *   `step="any"`, så håndtaket glir fritt i stedet for å hoppe, og trinnet
 *   nærmest lyser opp (`underDrag`). Ved slipp eller avbrudd, også utenfor
 *   glideren (lytterne står på `window`), smetter håndtaket inn på trinnet
 *   nærmest der det sto (`smettInn`), og `step` er 1 igjen. Det er to veier:
 *   - Håndtaket har flyttet seg (`change` under trykket): trinnet nærmest
 *     gliderens verdi. Det gjelder et drag, og i Chromium også et trykk på
 *     sporet, der håndtaket flytter seg dit med en gang.
 *   - Håndtaket har ikke flyttet seg (et trykk på håndtaket, som ikke gir
 *     `change`, men skal velge «Litt» fra urørt, eller et trykk på sporet i
 *     iOS Safari, som ikke flytter håndtaket): trinnet nærmest pekeren
 *     (`trinnFraPeker`), men bare når pekeren slippes på glideren. Ellers,
 *     og ved `pointercancel`, endres ingenting.
 * - Piltaster mens pekeren holdes nede, gjør ingenting (draget gjelder).
 * - `onClick`: skjermlesere på telefon kan aktivere med bare `click`; da
 *   velges trinnet håndtaket står på.
 * - Glideren og knappen er `disabled` til komponenten er hydrert.
 * - `onKeyDown`: piltastene, Home/End, PageUp/PageDown, mellomrom og Enter
 *   styres her, så → fra urørt gir «Mye» og mellomrom gir «Litt».
 *
 * Glideren har ikke `name`: det som sendes, er det skjulte feltet
 * `merke-<nummer>`, og bare når det er noe å sende. Urørt sender ingenting,
 * heller ikke uten skript. Glideren er navngitt av overskriften
 * (`aria-labelledby` til `legend`) og beskrevet av spørsmålet
 * (`aria-describedby`); `aria-valuetext` er trinnets navn. Utseendet står i
 * globals.css (`.forkunnskap`).
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MERKENAVN, merkefelt } from "../../tekst/forkunnskap";
import {
  TRINN,
  URORT,
  type Trinn,
  trinnFraPeker,
  dempet,
  dragPosisjon,
  sendtKode,
  smettInn,
  underDrag,
  vedTast,
  velgGjeldende,
  velgTrinn,
  verditekst,
  vekslUklar,
} from "./forkunnskapsglider";

const ingenAbonnement = () => () => {};

/** Halve bredden på håndtaket (1,75 rem i globals.css), i rem. */
const HALV_TOMMEL_REM = 0.875;

export function Forkunnskapsvalg({
  nummer,
  navnId,
  beskrivelseId,
}: {
  /** Overskriftens nummer; feltet heter `merke-<nummer>`. */
  nummer: number;
  /** Id-en til `legend`, som navngir glideren. */
  navnId: string;
  /** Id-en til spørsmålet over overskriftene. */
  beskrivelseId: string;
}) {
  const [t, settT] = useState(URORT);
  // Uten skript, og før hydreringen, lagres ingenting: da er glideren og
  // knappen låst, så de ikke ser brukbare ut. Serveren og hydreringen gir
  // `false`, nettleseren etterpå `true` (samme mønster som Arbeidsbord.tsx,
  // uten setState i en effekt).
  const klar = useSyncExternalStore(ingenAbonnement, () => true, () => false);
  // Draget (runde 3, bolk 8): null i ro. Under draget er `pos` håndtakets
  // frie posisjon, eller null til det har flyttet seg. Refen er det
  // hendelsene leser (lytterne på `window` ser ikke ny tilstand), tilstanden
  // det som tegnes.
  const [drag, settDrag] = useState<{ pos: number | null } | null>(null);
  const dragRef = useRef<{ pos: number | null } | null>(null);
  const avsluttDrag = useRef<(() => void) | null>(null);
  useEffect(() => () => avsluttDrag.current?.(), []);
  const kode = sendtKode(t);
  const tekst = verditekst(t);
  const valgt = !dempet(t) ? t.trinn : null;

  return (
    <div className="forkunnskap" data-dempet={dempet(t) ? "" : undefined}>
      <p className="forkunnskap-status" aria-hidden="true">
        {tekst}
      </p>
      <input
        type="range"
        min={0}
        max={2}
        step={drag ? "any" : 1}
        value={drag?.pos ?? t.trinn}
        className="forkunnskap-glider"
        aria-labelledby={navnId}
        aria-describedby={beskrivelseId}
        aria-valuetext={tekst}
        disabled={!klar}
        onChange={(e) => {
          // Verdien leses nå: `currentTarget` er null når React kjører oppdateringen senere.
          const verdi = e.currentTarget.value;
          if (dragRef.current) {
            // Under draget: håndtaket står der pekeren er, tilstanden på trinnet nærmest.
            const pos = dragPosisjon(verdi);
            dragRef.current = { pos };
            settDrag({ pos });
            settT((f) => underDrag(f, verdi).tilstand);
          } else {
            settT((f) => velgTrinn(f, verdi));
          }
        }}
        onPointerDown={(e) => {
          // Bare primærpekeren og venstre knapp.
          if (!e.isPrimary || e.button !== 0) return;
          avsluttDrag.current?.();
          const glider = e.currentTarget;
          const pekerId = e.pointerId;
          const rydd = () => {
            window.removeEventListener("pointerup", slutt);
            window.removeEventListener("pointercancel", slutt);
            avsluttDrag.current = null;
          };
          function slutt(ev: PointerEvent) {
            if (ev.pointerId !== pekerId) return;
            rydd();
            const pos = dragRef.current?.pos ?? null;
            dragRef.current = null;
            settDrag(null);
            // Et trykk uten drag regnes fra pekerens plass, men bare når den
            // slippes på glideren (som før, da dette var `pointerup` på
            // glideren). En berøring er fanget av glideren, så den slippes
            // alltid der.
            let peker: Trinn | null = null;
            if (ev.type === "pointerup" && pos === null && ev.target === glider) {
              const boks = glider.getBoundingClientRect();
              const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
              peker = trinnFraPeker(ev.clientX, boks, HALV_TOMMEL_REM * rem);
            }
            settT((f) => smettInn(f, { pos, peker }));
          }
          window.addEventListener("pointerup", slutt);
          window.addEventListener("pointercancel", slutt);
          avsluttDrag.current = rydd;
          dragRef.current = { pos: null };
          settDrag({ pos: null });
        }}
        onClick={() => {
          // Skjermlesere på telefon kan aktivere med bare `click` (dobbelttrykk):
          // da velges trinnet håndtaket står på, «Litt» fra urørt. Etter et
          // museklikk er det samme trinn som `pointerup` nettopp valgte.
          settT(velgGjeldende);
        }}
        onKeyDown={(e) => {
          const ny = vedTast(t, { key: e.key, ctrl: e.ctrlKey, alt: e.altKey, meta: e.metaKey });
          if (!ny) return;
          // Mens pekeren holdes nede, gjelder draget: en piltast ville bare
          // blitt overskrevet når håndtaket smetter inn ved slipp.
          if (dragRef.current) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          settT(ny);
        }}
      />
      <div className="forkunnskap-trinn" aria-hidden="true">
        {TRINN.map((m, i) => (
          <span key={m} data-valgt={valgt === i ? "" : undefined}>
            {MERKENAVN[m]}
          </span>
        ))}
      </div>
      <div className="forkunnskap-uklar">
        <button
          type="button"
          aria-pressed={t.uklar}
          aria-describedby={navnId}
          disabled={!klar}
          onClick={() => settT(vekslUklar)}
        >
          {MERKENAVN.uklar}
        </button>
      </div>
      {kode && <input type="hidden" name={merkefelt(nummer)} value={kode} />}
    </div>
  );
}
