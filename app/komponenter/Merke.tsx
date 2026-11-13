/**
 * Buddy-merket — DESIGN.md, logo-mark.
 *
 * Kraftige firkantede briller i en 120 × 120-flate: ramme 8,5, neserom 10,
 * neseinnhakk 14. Banene er portert uendret fra mockups/merke.js, og
 * bevegelsen ligger i globals.css (klassene «tenker», «slutt» og «ferdig»).
 *
 * Tre varianter:
 *   ansikt   brillene med øyne, figuren
 *   b        B-en (brillene vippet −90°), app-ikon og del av ordmerket
 *   briller  brillene uten øyne, brilleknappen
 *
 * Merket er alltid pynt for skjermlesere (`aria-hidden`). Det som merket
 * sier, står i teksten ved siden av.
 */

export type MerkeVariant = "ansikt" | "b" | "briller";
export type MerkeTilstand = "tenker" | "slutt" | "ferdig";

const GLASS_V = "M25 40 H49 Q55 40 55 46 V58 Q55 72 41 72 H25 Q16 72 16 63 V49 Q16 40 25 40 Z";
const GLASS_H = "M71 40 H95 Q104 40 104 49 V63 Q104 72 95 72 H79 Q65 72 65 58 V46 Q65 40 71 40 Z";

export function BuddyMerke({
  variant = "ansikt",
  tilstand,
  storrelse = 64,
  className = "",
}: {
  variant?: MerkeVariant;
  /** Uten tilstand står brillene stille. B-en er alltid «ferdig». */
  tilstand?: MerkeTilstand;
  /** Høyden, i px (tall) eller en CSS-lengde («0.9em»). */
  storrelse?: number | string;
  className?: string;
}) {
  const erB = variant === "b";
  const klasse = erB ? "ferdig" : (tilstand ?? "");
  const oyne = variant === "ansikt";
  return (
    <svg
      // B-en er beskåret til selve bokstaven, med plass til streken: ryggen
      // går til x 38,75 og glassene til x 80,25 (ramme 8,5, rygg 10,5).
      viewBox={erB ? "38 10 43 100" : "-4 -4 128 128"}
      className={`merke ${klasse} shrink-0 overflow-visible ${className}`}
      style={{ height: storrelse, width: erB ? "auto" : storrelse }}
      aria-hidden="true"
      focusable="false"
    >
      <g className="flytt">
        <g className="snu">
          <path className="glass" d={GLASS_V} />
          <path className="glass" d={GLASS_H} />
          {oyne && (
            <g className="oyne">
              <circle className="oye" cx="33.5" cy="56" r="5.5" />
              <circle className="oye" cx="86.5" cy="56" r="5.5" />
            </g>
          )}
          <path className="ramme" d={GLASS_V} />
          <path className="ramme" d={GLASS_H} />
          <path className="ramme" d="M55 44 Q60 37 65 44" />
          <g className="stenger">
            <path className="ramme" d="M16 44 L5 37" style={{ transformOrigin: "16px 44px" }} />
            <path className="ramme" d="M104 44 L115 37" style={{ transformOrigin: "104px 44px" }} />
          </g>
        </g>
        <path className="ramme stang" d="M60 -4 V84" />
      </g>
    </svg>
  );
}
