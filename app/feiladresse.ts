/**
 * Feilene sidene bærer i adressen. Ett sted for navnene, så omdirigeringene i
 * `handlinger.ts`, tenkeindikatorens overlevering (`komponenter/Tenker.tsx`)
 * og «Prøv igjen»-stedene ikke glir fra hverandre.
 *
 *   feil        Samtalesiden: vurderingen eller neste spørsmål feilet (FR-19, FR-20).
 *   kode        Samtalesiden: feilkoden som følger med `feil`, for rådet.
 *   fagordfeil  Lesevisningen: fagordene kunne ikke lages ved låsingen (FR-7).
 *
 * Ren modul, uten rammeverkskode, så den kan brukes både på serveren og i
 * nettleseren.
 */

export const FEIL = "feil";
export const FEILKODE = "kode";
export const FAGORDFEIL = "fagordfeil";

/** Parametrene som sier at siden viser en feil. `kode` følger bare med `feil`. */
const FEIL_I_ADRESSEN = [FEIL, FAGORDFEIL] as const;
/** Alt som hører til en feil, og som fjernes når «Prøv igjen» har lyktes. */
const ALLE_FEILPARAMETRE = [FEIL, FEILKODE, FAGORDFEIL] as const;

/** Har adressen (`location.search`) en feil? */
export function feilIAdressen(sok: string): boolean {
  const p = new URLSearchParams(sok);
  return FEIL_I_ADRESSEN.some((n) => p.has(n));
}

/**
 * Samme sti uten feilparametrene, med de andre parametrene som før. Brukes
 * etter et vellykket «Prøv igjen», så ingen gammel feil står igjen i
 * adressen for senere svar.
 */
export function adresseUtenFeil(sti: string, sok: string): string {
  const p = new URLSearchParams(sok);
  for (const n of ALLE_FEILPARAMETRE) p.delete(n);
  const rest = p.toString();
  return rest ? `${sti}?${rest}` : sti;
}
