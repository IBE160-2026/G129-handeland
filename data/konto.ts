/**
 * MIDLERTIDIG konto for utvikling — står til Better Auth er på plass.
 *
 * ## Hvorfor denne finnes
 *
 * AD-8 krever at hver datatilgangsfunksjon tar et `Tilgang`-objekt og sjekker
 * eierskap i where-klausulen. Det kravet står, og koden følger det. Det som
 * mangler er innlogging, altså det som skal *produsere* `Tilgang` fra en ekte
 * økt.
 *
 * Alternativet til denne fila var å bygge innlogging før kjerneløypen. Det
 * ville låst hele appen bak en funksjon som ikke er det prosjektet handler om,
 * og emneansvarlig var tydelig på rekkefølgen: kjerneflyten først, stabil,
 * før mer legges til.
 *
 * ## Hvorfor dette ikke er en bakdør
 *
 * Funksjonen kaster i drift. Den kan altså ikke bli stående ved et uhell og
 * gi alle tilgang til samme konto på et offentlig nettsted — den gjør appen
 * ubrukelig i drift til innloggingen er på plass, som er riktig retning å
 * feile i.
 *
 * Merk at `Tilgang`-grensesnittet er uendret. Når Better Auth kommer, byttes
 * bare innmaten i denne funksjonen, og ingen kallsteder røres. Det er hele
 * poenget med AD-8: eierskapet er en parameter, ikke en antakelse.
 *
 * TODO: erstatt med Better Auth-økt. FR-35.
 */

import type { Tilgang } from "./tilgang";

/**
 * Fast konto-id for utvikling. Vilkårlig valgt UUID — den trenger ikke å
 * finnes i noen brukertabell, siden `tekst.kontoId` ennå ikke har
 * fremmednøkkel (se kommentaren i `data/skjema.ts`).
 */
const UTVIKLINGSKONTO = "00000000-0000-4000-8000-000000000001";

/**
 * Er det noe som kan gi en `Tilgang` i dette miljøet?
 *
 * Sjekkes øverst i hver side som leser data, FØR noe kalles.
 *
 * Jeg forsøkte først å legge sjekken bare i rotlayouten, for å ha den ett
 * sted. Det virker ikke: Next evaluerer sidesegmentet selv om layouten ikke
 * rendrer children, så sidene kjørte likevel og bygget ble rødt. Sperren må
 * derfor stå i hver side — og `tilgang()` kaster i tillegg, som forsvar i
 * dybden for den ruten som en dag glemmer den.
 *
 * At den returnerer en boolsk verdi og ikke kaster, er fordi `next build`
 * forhåndsgenererer sider med NODE_ENV=production. En kastet feil der gjør
 * bygget rødt og gir en naken 500-side i drift; en boolsk sjekk lar oss vise
 * hva som mangler.
 */
export function innloggingKlar(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function tilgang(): Tilgang {
  // Beholdt som forsvar i dybden. Layouten skal ha stoppet oss før vi kommer
  // hit i drift, men hvis noen legger til en rute utenfor layouten, er dette
  // det som gjør at feilen blir en krasj og ikke en delt konto.
  if (!innloggingKlar()) {
    throw new Error(
      "Innlogging er ikke satt opp (FR-35). Utviklingskontoen kan ikke brukes " +
        "i drift, fordi den ville gitt alle besøkende tilgang til samme data.",
    );
  }
  return { kontoId: UTVIKLINGSKONTO };
}
