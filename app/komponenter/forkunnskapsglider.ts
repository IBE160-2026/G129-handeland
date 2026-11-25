/**
 * Forkunnskapen som glider — FR-6 (runde 3, bolk 2a, 23.11.2026).
 *
 * Per overskrift en glider med tre trinn, «Ingenting ennå» – «Litt» – «Mye»,
 * og under den av/på-knappen «Skjønner ikke overskriften». Funksjonene her er
 * rene, så matrisen i spec-runde-3-2a kan testes uten DOM; Forkunnskapsvalg.tsx
 * oversetter hendelsene og gjør det som kommer tilbake.
 *
 * - Urørt er ikke merket: håndtaket står dempet i midten, glideren sier
 *   «Ikke merket ennå», og ingenting sendes (Arve, 23.11).
 * - Overskriften teller først når eleven drar, klikker/trykker på glideren
 *   eller bruker tastaturet på den. Klikk på håndtaket i midten, eller
 *   mellomrom/Enter, velger «Litt» der håndtaket allerede står.
 * - «Skjønner ikke» overstyrer: på sendes `uklar`, glideren sier «Satt til
 *   side». Rører eleven glideren, gjelder glideren, og knappen går av.
 *
 * Kodene er de samme som før (`MERKER`), så lagrede merker, «Før du leste»
 * og den låste visningen er uendret.
 */

import { MERKENAVN, type Merke } from "../../tekst/forkunnskap";

/** Trinnene fra venstre til høyre. Indeksen er gliderens verdi. */
export const TRINN = ["nytt", "litt", "kjent"] as const satisfies readonly Merke[];
export type Trinn = 0 | 1 | 2;

/** Trinnet håndtaket står på før eleven har rørt glideren. */
export const MIDTEN: Trinn = 1;

export type Glidertilstand = {
  /** Eleven har rørt glideren (dratt, klikket, trykket eller brukt tastaturet). */
  rort: boolean;
  /** Trinnet håndtaket står på. */
  trinn: Trinn;
  /** «Skjønner ikke overskriften» er på. */
  uklar: boolean;
};

export const URORT: Glidertilstand = { rort: false, trinn: MIDTEN, uklar: false };

export const IKKE_MERKET = "Ikke merket ennå";
export const SATT_TIL_SIDE = "Satt til side";

/** Et tall fra glideren (eller hva som helst) som et gyldig trinn. */
export function somTrinn(verdi: unknown): Trinn {
  const n = Math.round(Number(verdi));
  if (!Number.isFinite(n)) return MIDTEN;
  return Math.min(2, Math.max(0, n)) as Trinn;
}

/** Koden skjemaet sender for overskriften, eller tom streng: da sendes ingenting. */
export function sendtKode(t: Glidertilstand): Merke | "" {
  if (t.uklar) return "uklar";
  if (!t.rort) return "";
  return TRINN[t.trinn];
}

/** `aria-valuetext` og den synlige teksten ved glideren. */
export function verditekst(t: Glidertilstand): string {
  if (t.uklar) return SATT_TIL_SIDE;
  if (!t.rort) return IKKE_MERKET;
  return MERKENAVN[TRINN[t.trinn]];
}

/** Glideren er dempet når den ikke gjelder: urørt, eller satt til side. */
export const dempet = (t: Glidertilstand) => t.uklar || !t.rort;

/** Eleven setter glideren på et trinn (dra, klikk, trykk). Knappen går av. */
export function velgTrinn(_t: Glidertilstand, trinn: unknown): Glidertilstand {
  return { rort: true, trinn: somTrinn(trinn), uklar: false };
}

/**
 * Trinnet nærmest pekeren på glideren. Håndtakets midtpunkt går fra
 * `venstre + halvTommel` (trinn 0) til `venstre + bredde - halvTommel`
 * (trinn 2), så det regnes mot den strekningen, ikke hele bredden. Utenfor
 * endene blir det endetrinnet. Brukes ved `pointerup`, fordi et trykk på
 * sporet i iOS Safari ikke flytter håndtaket, og verdien da ville stått på
 * midten.
 */
export function trinnFraPeker(
  clientX: number,
  boks: { left: number; width: number },
  halvTommel = 0,
): Trinn {
  const strekning = boks.width - 2 * halvTommel;
  if (!(strekning > 0)) return MIDTEN;
  return somTrinn(((clientX - boks.left - halvTommel) / strekning) * 2);
}

/*
 * Draget (runde 3, bolk 8, avgjort av Arve 25.11): mens primærpekeren drar,
 * glir håndtaket fritt (glideren har da `step="any"`), og trinnet nærmest
 * lyser opp. Tilstanden står hele tiden på det nærmeste trinnet, så
 * `aria-valuetext` og det skjemaet sender alltid er et helt trinn; bare
 * posisjonen under draget er et desimaltall. Ved slipp eller avbrudd smetter
 * håndtaket inn på trinnet nærmest der det sto. Tastaturet og skjermleseren
 * går fortsatt ett trinn om gangen (`vedTast`, `step={1}` i ro).
 */

/** Håndtakets posisjon under draget: gliderens verdi, fritt mellom 0 og 2 (ikke avrundet). */
export function dragPosisjon(verdi: unknown): number {
  const n = typeof verdi === "string" && verdi.trim() === "" ? NaN : Number(verdi);
  if (!Number.isFinite(n)) return MIDTEN;
  return Math.min(2, Math.max(0, n));
}

/** Trinnet nærmest en posisjon: det som lyser opp under draget, og det håndtaket smetter til. */
export const naermesteTrinn = (pos: number): Trinn => somTrinn(dragPosisjon(pos));

/** Under draget: håndtaket står på `pos`, og tilstanden på trinnet nærmest (knappen går av). */
export function underDrag(t: Glidertilstand, verdi: unknown): { pos: number; tilstand: Glidertilstand } {
  const pos = dragPosisjon(verdi);
  return { pos, tilstand: velgTrinn(t, naermesteTrinn(pos)) };
}

/**
 * Slipp (`pointerup`) eller avbrudd (`pointercancel`): håndtaket smetter inn.
 *
 * - Har håndtaket flyttet seg (`pos`), smetter det inn på trinnet nærmest der
 *   det sto, også når eleven slipper utenfor glideren eller draget avbrytes.
 * - Ellers var det et trykk: trinnet nærmest pekeren (`peker`, fra
 *   `trinnFraPeker`), fordi et trykk på sporet i iOS Safari ikke flytter
 *   håndtaket. `peker` er null når pekeren ble sluppet utenfor glideren eller
 *   draget ble avbrutt, og da endres ingenting: urørt forblir urørt.
 */
export function smettInn(
  t: Glidertilstand,
  { pos, peker }: { pos: number | null; peker: Trinn | null },
): Glidertilstand {
  if (pos !== null) return velgTrinn(t, naermesteTrinn(pos));
  if (peker !== null) return velgTrinn(t, peker);
  return t;
}

/**
 * Eleven velger trinnet håndtaket står på (klikk på håndtaket, mellomrom
 * eller Enter). Fra urørt er det «Litt».
 */
export const velgGjeldende = (t: Glidertilstand): Glidertilstand => velgTrinn(t, t.trinn);

/** Av/på-knappen «Skjønner ikke overskriften». Av igjen: glideren gjelder som den sto. */
export const vekslUklar = (t: Glidertilstand): Glidertilstand => ({ ...t, uklar: !t.uklar });

/**
 * En tast på glideren. Null når tasten ikke er gliderens (Tab o.l.), og da
 * gjør nettleseren det den ellers gjør. Ellers ny tilstand, og standarden
 * hindres, så glideren ikke flytter seg to ganger. Piltastene regnes fra
 * trinnet håndtaket står på: → fra urørt er «Mye», ← er «Ingenting ennå».
 * Mot kanten blir trinnet stående, men glideren er rørt (og knappen av).
 */
export function vedTast(
  t: Glidertilstand,
  tast: { key: string; ctrl?: boolean; alt?: boolean; meta?: boolean },
): Glidertilstand | null {
  if (tast.ctrl || tast.alt || tast.meta) return null;
  switch (tast.key) {
    case "ArrowRight":
    case "ArrowUp":
    case "PageUp":
      return velgTrinn(t, t.trinn + 1);
    case "ArrowLeft":
    case "ArrowDown":
    case "PageDown":
      return velgTrinn(t, t.trinn - 1);
    case "Home":
      return velgTrinn(t, 0);
    case "End":
      return velgTrinn(t, 2);
    case " ":
    case "Enter":
      return velgGjeldende(t);
    default:
      return null;
  }
}
