"use client";

/**
 * Fagorddemoen på landingssiden — EXPERIENCE.md, Rulleeffekter på
 * landingssiden (bolk 6, utkast E).
 *
 * Den statiske versjonen er grunnlaget, og det er den serveren sender: alle
 * fire fagordene markert (`<span>`) og forklaringene i en `<dl>` under
 * teksten. Slik står demoen uten JavaScript, ved redusert bevegelse og fra
 * 760 px, der effekt A (LandingEffekter) legges oppå.
 *
 * Smalere enn 760 px, med JavaScript og når bevegelse er tillatt, er demoen
 * i stedet trykkbar, som fagordene i lesevisningen (Fagord.tsx): fagordene er
 * knapper (`aria-expanded`, `aria-controls`) som viser forklaringen i et
 * panel under teksten, med mini-Buddy (brillene 30 px høye) ved siden av.
 * Fokus blir stående på ordet. `<dl>` skjules da bare visuelt, så
 * skjermleseren har hele listen. Ingen `aria-live`, og panelet er aldri tomt:
 * før eleven har trykket, står det hva hun kan gjøre.
 */

import { useId, useState, useSyncExternalStore } from "react";
import { TRYKK } from "./brytepunkt";
import { BuddyMerke } from "./Merke";

export type DemoFagord = { ord: string; forklaring: string; avsnitt: number };

function abonner(endret: () => void) {
  const m = matchMedia(TRYKK);
  m.addEventListener("change", endret);
  return () => m.removeEventListener("change", endret);
}

/** Usann på serveren og under hydrering, så HTML-en alltid er den statiske versjonen. */
function useTrykkdemo() {
  return useSyncExternalStore(
    abonner,
    () => matchMedia(TRYKK).matches,
    () => false,
  );
}

export function FagordDemo({ fagord }: { fagord: DemoFagord[] }) {
  const trykk = useTrykkdemo();
  const [valgt, settValgt] = useState<number | null>(null);
  // Når trykkmodus slås av (bredere skjerm eller redusert bevegelse), glemmes
  // ordet, så demoen ikke åpner med et gammelt valg når den kommer tilbake.
  const [forrigeTrykk, settForrigeTrykk] = useState(trykk);
  if (trykk !== forrigeTrykk) {
    settForrigeTrykk(trykk);
    if (!trykk) settValgt(null);
  }
  const panelId = useId();
  const vist = trykk && valgt !== null ? fagord[valgt] : null;

  /**
   * Fagord nummer i, med teksten slik den står i setningen. Tegnsettingen
   * rett etter ordet (`etter`) står sammen med knappen, fordi en knapp brytes
   * som én blokk og ellers kunne latt punktumet stå alene først på neste linje.
   */
  function ord(i: number, tekst: string, etter = "") {
    if (!trykk) {
      return (
        <>
          <span className="ls-fagord" data-i={i}>
            {tekst}
          </span>
          {etter}
        </>
      );
    }
    return (
      <span className="ls-ordgruppe">
        <button
          type="button"
          className="ls-fagord"
          data-i={i}
          aria-expanded={valgt === i}
          aria-controls={panelId}
          onClick={() => settValgt(valgt === i ? null : i)}
        >
          {tekst}
        </button>
        {etter}
      </span>
    );
  }

  return (
    <div className="ls-demo-spor">
      <div className="ls-innhold ls-demo-klistre">
        <article className="ls-ark" aria-labelledby="ls-eksempel">
          <h3 id="ls-eksempel">Celledeling</h3>
          <p>
            Før cellen deler seg, kopieres {ord(0, "arvestoffet", ".")} Under {ord(1, "mitose")} fordeles{" "}
            {ord(2, "kromosomene")} likt mellom to nye celler.
          </p>
          <p>
            Noen ganger blir det en feil når arvestoffet kopieres. Da kan det oppstå en {ord(3, "mutasjon", ",")} en
            endring i oppskriften som cellen gir videre.
          </p>
        </article>
        <div className="ls-forklaringer">
          {trykk && (
            <div className="ls-trykk">
              <BuddyMerke variant="ansikt" mini storrelse={30} className="ls-trykk-buddy" />
              <div id={panelId} className="ls-trykkpanel">
                {vist ? (
                  <>
                    <p className="ls-trykk-ord">{vist.ord}</p>
                    <p>
                      {vist.forklaring} <span className="ls-kilde">Avsnitt {vist.avsnitt}</span>
                    </p>
                  </>
                ) : (
                  <p>Trykk på et fagord i teksten, så forklarer Buddy det.</p>
                )}
              </div>
            </div>
          )}
          <p className="ls-hint" aria-hidden="true">
            Rull videre, så markerer Buddy fagordene ett for ett.
          </p>
          <dl className={trykk ? "sr-only" : undefined}>
            {fagord.map((f, i) => (
              <div key={f.ord} className="ls-forklaring" data-i={i}>
                <dt>{f.ord}</dt>
                <dd>
                  {f.forklaring} <span className="ls-kilde">Avsnitt {f.avsnitt}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="ls-teller" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
