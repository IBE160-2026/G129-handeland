/**
 * Knappene — DESIGN.md, button-primary og button-secondary, pluss fare- og
 * lenkevarianten.
 *
 * Fokus har ingen lokale klasser: fokusringen i globals.css gjelder, og
 * `fylt` gir den ytre ringen i bakgrunnsfargen på fylte knapper.
 * Hover gjør knappen 6 % mørkere. Alle har minst 44 × 44 px trykkflate
 * (DESIGN.md, Layout & Spacing: target-min).
 */

export const KNAPP_PRIMAER =
  "fylt inline-flex min-h-11 items-center justify-center rounded-md bg-primaer px-5 py-3 font-bold text-paa-primaer hover:brightness-94 disabled:opacity-60";

export const KNAPP_SEKUNDAER =
  "inline-flex min-h-11 items-center justify-center rounded-md border-2 border-primaer px-5 py-2.5 font-bold text-primaer hover:bg-markering disabled:opacity-60";

/**
 * Det som ikke kan angres, som «Slett for godt». Fylt med feilfargen og
 * tekst i bakgrunnsfargen (6,1:1 i lys og 8,1:1 i mørk modus).
 */
export const KNAPP_FARE =
  "fylt inline-flex min-h-11 items-center justify-center rounded-md bg-fare px-5 py-3 font-bold text-bakgrunn hover:brightness-94 disabled:opacity-60";

/**
 * En knapp som ser ut som en lenke («Avbryt», «Prøv igjen» i en merknad).
 * Understreken er det synlige, men trykkflaten er like stor som de andre.
 */
export const KNAPP_LENKE =
  "inline-flex min-h-11 min-w-11 items-center justify-center px-1 font-bold underline underline-offset-4 hover:decoration-2 disabled:opacity-60";
