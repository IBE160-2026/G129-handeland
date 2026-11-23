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
 * - `onPointerUp`: klikk eller trykk på håndtaket der det står. Det gir ingen
 *   `change`, men skal velge «Litt» fra urørt.
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

import { useState } from "react";
import { MERKENAVN, merkefelt } from "../../tekst/forkunnskap";
import {
  TRINN,
  URORT,
  dempet,
  sendtKode,
  vedTast,
  velgTrinn,
  verditekst,
  vekslUklar,
} from "./forkunnskapsglider";

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
        onChange={(e) => {
          // Verdien leses nå: `currentTarget` er null når React kjører oppdateringen senere.
          const verdi = e.currentTarget.value;
          settT((f) => velgTrinn(f, verdi));
        }}
        onPointerUp={(e) => {
          const verdi = e.currentTarget.value;
          settT((f) => velgTrinn(f, verdi));
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
        <button type="button" aria-pressed={t.uklar} onClick={() => settT(vekslUklar)}>
          {MERKENAVN.uklar}
        </button>
      </div>
      {kode && <input type="hidden" name={merkefelt(nummer)} value={kode} />}
    </div>
  );
}
