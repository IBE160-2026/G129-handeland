/**
 * Tastene på øvekortene — FR-16, FR-17 (runde 3, bolk 2b).
 *
 * ← og → bytter kort, mellomrom snur. Funksjonen er ren, så matrisen i
 * spec-runde-3-2b kan testes uten DOM; lytteren i Oevekort.tsx oversetter
 * hendelsen og fokuselementet til `Taster` og gjør det som kommer tilbake.
 *
 * - Ingenting fanges i skjemafelt (`input`, `textarea`, `select`,
 *   `contenteditable` og felt-roller), eller med Ctrl, Alt, Meta eller Shift,
 *   så nettleserens egne snarveier virker (Shift+mellomrom ruller opp).
 * - En tast som holdes inne (`repeat`), teller bare første gang: ellers raser
 *   → til «Runden er ferdig» og mellomrom blinker.
 * - Mellomrom snur bare når fokus IKKE står på en knapp, lenke eller
 *   `summary`. Der gjør mellomrom det det alltid gjør: på kortknappen snur det
 *   kortet én gang (ikke to), på «Har kontroll» merker det.
 */

export type Tastehandling = "forrige" | "neste" | "snu";

/** Det fokuserte elementet, beskrevet uten DOM. */
export type Fokusmaal = {
  /** Taggnavnet, f.eks. "BUTTON" eller "body". Store og små bokstaver er likegyldige. */
  tag: string;
  /** `role`-attributtet, om det finnes. */
  rolle?: string | null;
  /** `isContentEditable`. */
  redigerbar?: boolean;
};

export type Taster = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
  shift?: boolean;
  /** `KeyboardEvent.repeat`: tasten holdes inne. */
  repeat?: boolean;
  /** Fokuselementet; `null` når ingenting har fokus. */
  maal: Fokusmaal | null;
};

const SKJEMAFELT = new Set(["input", "textarea", "select"]);
const FELTROLLER = new Set(["textbox", "searchbox", "combobox", "spinbutton", "slider"]);

// Elementer der mellomrom allerede gjør noe (trykker, følger, feller ut).
const MELLOMROM_EGEN_TAG = new Set(["button", "a", "summary"]);
const MELLOMROM_EGEN_ROLLE = new Set(["button", "link", "checkbox", "radio", "switch", "menuitem", "tab", "option"]);

function erSkjemafelt(m: Fokusmaal): boolean {
  return SKJEMAFELT.has(m.tag.toLowerCase()) || !!m.redigerbar || FELTROLLER.has((m.rolle ?? "").toLowerCase());
}

function mellomromHarEgenVirkning(m: Fokusmaal): boolean {
  return MELLOMROM_EGEN_TAG.has(m.tag.toLowerCase()) || MELLOMROM_EGEN_ROLLE.has((m.rolle ?? "").toLowerCase());
}

export function tastehandling({ key, ctrl, alt, meta, shift, repeat, maal }: Taster): Tastehandling | null {
  if (ctrl || alt || meta || shift || repeat) return null;
  if (maal && erSkjemafelt(maal)) return null;
  if (key === "ArrowLeft") return "forrige";
  if (key === "ArrowRight") return "neste";
  if (key === " " || key === "Spacebar") {
    if (maal && mellomromHarEgenVirkning(maal)) return null;
    return "snu";
  }
  return null;
}
