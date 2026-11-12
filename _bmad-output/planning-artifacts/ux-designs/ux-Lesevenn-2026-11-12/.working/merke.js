// LeseBuddy-merket: kraftige firkantede briller, ramme 8,5, neserom 10, neseinnhakk 14.
// Felles for mockene. Klassene «spill» (animasjon) og «ferdig» (B) styres av merke.css.
window.MERKE = {
  figur(oyne = true) {
    return `<g class="flytt">
      <g class="snu">
        <path class="glass" d="M25 40 H49 Q55 40 55 46 V58 Q55 72 41 72 H25 Q16 72 16 63 V49 Q16 40 25 40 Z"/>
        <path class="glass" d="M71 40 H95 Q104 40 104 49 V63 Q104 72 95 72 H79 Q65 72 65 58 V46 Q65 40 71 40 Z"/>
        ${oyne ? `<g class="oyne"><circle class="oye" cx="33.5" cy="56" r="5.5"/><circle class="oye" cx="86.5" cy="56" r="5.5"/></g>` : ""}
        <path class="ramme" d="M25 40 H49 Q55 40 55 46 V58 Q55 72 41 72 H25 Q16 72 16 63 V49 Q16 40 25 40 Z"/>
        <path class="ramme" d="M71 40 H95 Q104 40 104 49 V63 Q104 72 95 72 H79 Q65 72 65 58 V46 Q65 40 71 40 Z"/>
        <path class="ramme" d="M55 44 Q60 37 65 44"/>
        <g class="stenger"><path class="ramme" d="M16 44 L5 37" style="transform-origin:16px 44px"/><path class="ramme" d="M104 44 L115 37" style="transform-origin:104px 44px"/></g>
      </g>
      <path class="ramme stang" d="M60 -4 V84"/>
    </g>`;
  },
  svg(klasse = "ferdig", stil = "", oyne = true) {
    return `<svg viewBox="-4 -4 128 128" class="merke ${klasse}" style="${stil}" aria-hidden="true">${this.figur(oyne)}</svg>`;
  },
};
