/**
 * Markeringstusjen — DESIGN.md, components.highlighter (design runde 2, bolk 10,
 * variant A i mockups/runde-11-buddy-og-pennestrok.html).
 *
 * En rosa tusj bak den nederste delen av ordet, med ujevne ender og litt bølge.
 * Brukes på «leser» på landingssiden og på tekstnavnet i sidetitlene («Quiz:
 * Bedrift» får strøk bare under «Bedrift»). Aldri på lenker eller knapper: der
 * kan den forveksles med en lenkeunderstrek.
 *
 * Hvert ord får sin egen strek, så et langt navn som brytes over flere linjer
 * har strøk på hver linje, og streken aldri strekker seg over et linjeskift.
 * Ordene er vanlige <span>-er med mellomrommene mellom seg, så skjermlesere
 * leser bare teksten. Streken er en SVG med `preserveAspectRatio="none"` som er
 * skjult for skjermlesere. Fargen, inntegningen og kontrastmodus står i
 * globals.css (`.tusj`).
 */

import { type CSSProperties, Fragment } from "react";

const STROK =
  "M4 12 C40 6 90 9 140 6 C165 5 185 6 197 9 L195 14 C196 19 190 24 186 25 C140 27 90 24 46 27 C26 28 10 27 3 24 C6 20 1 16 4 12 Z";

export function Tusj({ children }: { children: string }) {
  const ord = children.split(/\s+/).filter(Boolean);
  return ord.map((o, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      {/* Ordene tegnes inn etter hverandre, som én bevegelse med tusjen. */}
      <span className="tusj" style={i > 0 ? ({ "--tusj-nr": i } as CSSProperties) : undefined}>
        {o}
        <svg viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d={STROK} />
        </svg>
      </span>
    </Fragment>
  ));
}
