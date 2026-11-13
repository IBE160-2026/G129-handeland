/**
 * Knappene — DESIGN.md, button-primary og button-secondary.
 *
 * Fokus har ingen lokale klasser: fokusringen i globals.css gjelder, og
 * `fylt` gir den ytre ringen i bakgrunnsfargen på fylte knapper.
 * Hover gjør knappen 6 % mørkere.
 */

export const KNAPP_PRIMAER =
  "fylt inline-flex min-h-11 items-center justify-center rounded-md bg-primaer px-5 py-3 font-bold text-paa-primaer hover:brightness-94 disabled:opacity-60";

export const KNAPP_SEKUNDAER =
  "inline-flex min-h-11 items-center justify-center rounded-md border-2 border-primaer px-5 py-2.5 font-bold text-primaer hover:bg-markering disabled:opacity-60";
