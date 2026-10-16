/**
 * Innholdsord — FR-20.
 *
 * To av de maskinsjekkbare kravene til oppfølgingsspørsmål regnes på
 * innholdsord, ikke på alle ord:
 *
 *   - **Sporbarhet:** oppfølgingen inneholder minst ett innholdsord eleven
 *     selv innførte — et ord i elevens svar som ikke står i spørsmålet hun
 *     svarte på.
 *   - **Ingen gjentakelse:** Jaccard-overlapp under 0,6 mot tidligere
 *     spørsmål i samme samtale.
 *
 * FR-20 krever en FAST stoppordliste i repoet og enkel normalisering, fordi
 * tallet ellers ikke er reproduserbart: to helt ulike norske spørsmål på åtte
 * ord kan komme over 0,8 på funksjonsord alene. Lista under er den lista.
 * Endres den, endres målingen — og det skal da stå i målerapporten.
 */

/**
 * Funksjonsord på bokmål: pronomen, artikler, preposisjoner, konjunksjoner,
 * hjelpeverb, spørreord og vanlige adverb. Ikke fagord, og ikke verb som bærer
 * innhold.
 */
export const STOPPORD: ReadonlySet<string> = new Set([
  // pronomen og determinativer
  "jeg", "meg", "min", "mitt", "mine", "du", "deg", "din", "ditt", "dine",
  "han", "ham", "hun", "henne", "den", "det", "de", "dem", "vi", "oss", "dere",
  "sin", "sitt", "sine", "hans", "hennes", "dens", "dets", "deres", "vår", "vårt", "våre",
  "seg", "selv", "man", "en", "ei", "et", "denne", "dette", "disse",
  "noen", "noe", "ingen", "ingenting", "alle", "alt", "hver", "hvert", "hverandre",
  "annen", "annet", "andre", "samme", "slik", "slikt", "slike", "sånn", "sånt", "sånne",
  // preposisjoner
  "i", "på", "av", "til", "fra", "med", "om", "for", "ved", "under", "over",
  "mellom", "etter", "før", "gjennom", "mot", "uten", "hos", "langs", "rundt",
  "innen", "utenfor", "innenfor", "bak", "foran", "blant", "siden", "per",
  // konjunksjoner og subjunksjoner
  "og", "eller", "men", "så", "at", "som", "når", "hvis", "fordi", "enn",
  "mens", "da", "om", "både", "verken", "enten", "selv", "dersom", "skjønt",
  // hjelpeverb og vanlige verbformer uten innhold
  "er", "var", "være", "vært", "blir", "ble", "bli", "blitt",
  "har", "hadde", "ha", "hatt", "kan", "kunne", "skal", "skulle", "vil", "ville",
  "må", "måtte", "bør", "burde", "får", "fikk", "få", "fått", "gjør", "gjorde", "gjøre", "gjort",
  // spørreord
  "hva", "hvem", "hvor", "hvorfor", "hvordan", "hvilken", "hvilket", "hvilke",
  // adverb og småord
  "ikke", "også", "bare", "nå", "da", "her", "der", "så", "jo", "vel", "nok",
  "mer", "mest", "mindre", "minst", "veldig", "svært", "ganske", "litt", "mye",
  "lenger", "lengre", "allerede", "ennå", "igjen", "alltid", "aldri", "ofte",
  "kanskje", "sikkert", "ja", "nei", "altså", "derfor", "dermed",
  "likevel", "egentlig", "faktisk", "først", "sist", "videre", "ut", "inn", "opp", "ned",
  "fram", "frem", "bort", "hit", "dit", "hjem", "heller",
  // vanlige ord i spørsmål og svar som ikke er innhold
  "tekst", "teksten", "avsnitt", "avsnittet", "spørsmål", "spørsmålet", "svar", "svaret",
  "tror", "mener", "synes", "vet", "vite", "står", "sier", "skriver",
]);

/** Små bokstaver, uten tegnsetting, delt i ord. Bindestrek i ord beholdes. */
export function ord(tekst: string): string[] {
  return tekst
    .toLowerCase()
    .split(/[^\p{L}\p{N}-]+/u)
    .map((o) => o.replace(/^-+|-+$/g, ""))
    .filter((o) => o.length > 0);
}

/** Innholdsordene i en tekst: alle ord, minus stoppordene og rene tall. */
export function innholdsord(tekst: string): Set<string> {
  return new Set(ord(tekst).filter((o) => !STOPPORD.has(o) && !/^\p{N}+$/u.test(o)));
}

/** Jaccard-overlapp mellom to ordmengder. To tomme mengder regnes som ulike (0). */
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let felles = 0;
  for (const o of a) if (b.has(o)) felles++;
  return felles / (a.size + b.size - felles);
}

/**
 * Innholdsordene eleven selv innførte: i svaret, men ikke i spørsmålet hun
 * svarte på (FR-20, sporbarhet).
 */
export function innfortAvEleven(elevsvar: string, sporsmal: string): Set<string> {
  const iSporsmal = innholdsord(sporsmal);
  return new Set([...innholdsord(elevsvar)].filter((o) => !iSporsmal.has(o)));
}
