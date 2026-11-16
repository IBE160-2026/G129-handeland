/**
 * Brytepunktet mellom telefon og brede skjermer, for JavaScript — DESIGN.md,
 * Layout & Spacing: smalere enn 760 px er telefonoppsettet. CSS-en i
 * globals.css bruker de samme grensene.
 */

/** Telefon: smalere enn 760 px. */
export const TELEFON = "(max-width: 759.98px)";

/** Brede skjermer: 760 px og bredere. */
export const BRED = "(min-width: 760px)";

/** Trykkdemoen på landingssiden: telefon, og bevegelse er tillatt. */
export const TRYKK = `${TELEFON} and (prefers-reduced-motion: no-preference)`;
