/**
 * Prisene per modell — PRD §6.4, dagstaket på 30 kroner.
 *
 * Det eneste stedet prisene står. Kostnaden regnes i mikrodollar (en
 * milliondel av en dollar) og lagres som et heltall per API-kall
 * (`forbruk.mikrodollar`), så summen for døgnet ikke får avrundingsfeil.
 * Kronene regnes først når summen sammenlignes med taket.
 *
 * Kilde: prisene og kursen er fastsatt i `spec-bruksgrenser.md`, godkjent av
 * Arve 16.11.2026 (Haiku 5.5 $0,10 / $0,50 og Sonnet 5.5 $2 / $10 per million
 * tokens inn / ut, 10,5 kr per dollar). Kontroller dem mot Anthropics
 * prisliste ved et modell- eller prisbytte.
 *
 * Hurtigbufferen: skriving til bufferen koster 1,25 eller 2 ganger vanlig
 * inn, avhengig av hvor lenge den skal leve. Den prises her til 2 ganger, det
 * høyeste. Lesing fra bufferen er billigere enn vanlig inn, men prises som
 * vanlig inn. Begge deler gjør at summen heller blir for høy enn for lav.
 */

/** Dollar per million tokens. Er det samme som mikrodollar per token. */
type Pris = { inn: number; ut: number };

export const PRISER: Readonly<Record<string, Pris>> = {
  "claude-haiku-5-5": { inn: 0.1, ut: 0.5 },
  "claude-sonnet-5-5": { inn: 2, ut: 10 },
};

/** Kroner per dollar (PRD §6.4, «Kurs 10,5 kroner per dollar»). */
export const KRONER_PER_DOLLAR = 10.5;

/** Skriving til hurtigbufferen, som et multiplum av inn-prisen (det høyeste API-et tar). */
const BUFFERSKRIVING_FAKTOR = 2;

/**
 * En modell uten pris regnes til Sonnet-pris, den dyreste vi kjenner. Det er
 * bare forsiktig for modeller som ikke er dyrere enn Sonnet: en dyrere modell
 * (for eksempel Opus) ville blitt regnet for lavt, og taket ville slått inn
 * for sent. Derfor er det en feil i testene, slik at en ny modell i
 * `prompts/gjeldende.json` ikke kommer i drift uten pris, og en feil i loggen
 * i drift.
 */
const RESERVEPRIS: Pris = PRISER["claude-sonnet-5-5"];

export class UkjentModell extends Error {
  constructor(modell: string) {
    super(`Modellen «${modell}» har ingen pris i data/priser.ts. Legg den inn før den tas i bruk (PRD §6.4).`);
    this.name = "UkjentModell";
  }
}

function prisFor(modell: string): Pris {
  const pris = PRISER[modell];
  if (pris) return pris;
  if (process.env.VITEST) throw new UkjentModell(modell);
  console.error(`[priser] ${new UkjentModell(modell).message} Regnes til Sonnet-pris.`);
  return RESERVEPRIS;
}

/**
 * Kostnaden for ett kall, i hele mikrodollar, rundet opp. `bufferSkriving`
 * er den delen av `inn` som ble skrevet til hurtigbufferen.
 */
export function kostnadMikrodollar(modell: string, inn: number, ut: number, bufferSkriving = 0): number {
  const p = prisFor(modell);
  const vanligInn = inn - bufferSkriving;
  return Math.ceil(vanligInn * p.inn + bufferSkriving * p.inn * BUFFERSKRIVING_FAKTOR + ut * p.ut);
}

/** Mikrodollar til kroner. */
export function tilKroner(mikrodollar: number): number {
  return (mikrodollar / 1_000_000) * KRONER_PER_DOLLAR;
}
