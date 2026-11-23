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
 * - `onPointerUp` (bare primærpekeren, venstre knapp): trinnet nærmest
 *   pekeren (`trinnFraPeker`). Et klikk på håndtaket gir ingen `change`, men
 *   skal velge «Litt» fra urørt, og i iOS Safari flytter et trykk på sporet
 *   ikke håndtaket.
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

import { useState, useSyncExternalStore } from "react";
import { MERKENAVN, merkefelt } from "../../tekst/forkunnskap";
import {
  TRINN,
  URORT,
  trinnFraPeker,
  dempet,
  sendtKode,
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
        step={1}
        value={t.trinn}
        className="forkunnskap-glider"
        aria-labelledby={navnId}
        aria-describedby={beskrivelseId}
        aria-valuetext={tekst}
        disabled={!klar}
        onChange={(e) => {
          // Verdien leses nå: `currentTarget` er null når React kjører oppdateringen senere.
          const verdi = e.currentTarget.value;
          settT((f) => velgTrinn(f, verdi));
        }}
        onPointerUp={(e) => {
          // Bare primærpekeren og venstre knapp. Trinnet regnes fra pekerens
          // plass, fordi et trykk på sporet i iOS Safari ikke flytter håndtaket.
          if (!e.isPrimary || e.button !== 0) return;
          const boks = e.currentTarget.getBoundingClientRect();
          const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
          const trinn = trinnFraPeker(e.clientX, boks, HALV_TOMMEL_REM * rem);
          settT((f) => velgTrinn(f, trinn));
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
