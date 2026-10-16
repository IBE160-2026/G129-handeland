/**
 * Sammenligningsregelen — FR-8.
 *
 * Står i egen fil fordi to målinger må bruke nøyaktig den samme: modellen mot
 * Gullsettet (maal-faguttrykk.test.ts), og annotatøren mot seg selv
 * (kappa.test.ts). Bruker de ulike regler, er tallene ikke sammenlignbare, og
 * hele poenget med å måle egen støy — å vite om modellens tall ligger over
 * eller under den — faller bort.
 */

/**
 * Normaliserer et uttrykk før sammenligning.
 *
 * Dette ER sammenligningsregelen, og den står på ett sted med vilje: den skal
 * kunne pekes på i rapporten, og den skal ikke kunne være litt forskjellig i
 * gjenkallingen og i presisjonen.
 *
 * Regelen, som fastsatt i annotering.md steg 4:
 *
 *   - ufølsom for store og små bokstaver — «Mitose» er «mitose»
 *   - FØLSOM for bøyning — «mitosen» er IKKE «mitose», fordi `erVerbatim`
 *     krever ordrett treff og en modell som svarer grunnformen får uttrykket
 *     forkastet. Å være mild her ville målt noe appen ikke gjør.
 *   - flerordsuttrykk må matche helt — «indre energi» er ikke «energi»
 *
 * Mellomrom normaliseres, fordi «indre  energi» og «indre energi» er samme
 * uttrykk og forskjellen er en skrivefeil, ikke en faglig uenighet.
 */
export function normaliser(uttrykk: string): string {
  return uttrykk.trim().toLowerCase().replace(/\s+/g, " ");
}
