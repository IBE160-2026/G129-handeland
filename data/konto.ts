/**
 * Hvem er innlogget? Det eneste stedet en `Tilgang` lages — FR-35, AD-8.
 *
 * `Tilgang` lages av en verifisert økt fra Better Auth, aldri fra en
 * forespørselsparameter eller et skjemafelt. Datatilgangslaget krever den som
 * første parameter (data/tilgang.ts), så det finnes ingen vei til en annen
 * kontos data som går utenom denne fila.
 *
 * Grensesnittet er det samme som da utviklingskontoen sto her: bare innmaten
 * er byttet, og ingen datatilgangsfunksjon er endret. Det var poenget med å
 * gjøre eierskapet til en parameter fra starten.
 */

import { headers } from "next/headers";
import { cache } from "react";
import { redirect, unstable_rethrow } from "next/navigation";
import { hentAuth } from "./auth";
import type { Tilgang } from "./tilgang";

/**
 * Økten bak forespørselen, eller `null`. Verifiseres mot databasen. Det eneste
 * stedet økten slås opp. Kalleren henter `headers()`, så valgfriTilgang kan
 * gjøre det utenfor sin try-blokk.
 */
async function hentOekt(h: Headers) {
  return hentAuth().api.getSession({ headers: h });
}

/**
 * Tilgangen til den innloggede eleven. Uten innlogging sendes eleven til
 * innloggingssiden.
 *
 * `redirect` virker ved å kaste. Kall derfor denne FØR en try-blokk, ikke
 * inni — ellers fanger catch omdirigeringen.
 */
export async function tilgang(): Promise<Tilgang> {
  const oekt = await hentOekt(await headers());
  if (!oekt) redirect("/logg-inn");
  return { kontoId: oekt.user.id };
}

/**
 * Tilgangen, eller `null` uten innlogging — for forsiden, som viser
 * landingssiden til den som ikke er innlogget (FR-47) i stedet for å sende
 * henne videre. Kaster aldri: feiler øktoppslaget (databasen svarer ikke),
 * logges feilen og siden behandles som utlogget, så landingssiden vises i
 * stedet for en 500.
 *
 * `headers()` hentes utenfor try-blokken, og `unstable_rethrow` slipper
 * gjennom Nexts egne kast, så Next fortsatt ser at siden er dynamisk.
 *
 * `cache`: forsiden spør både i generateMetadata og i siden, og det skal
 * bare bli ett øktoppslag per forespørsel.
 */
export const valgfriTilgang = cache(async (): Promise<Tilgang | null> => {
  const h = await headers();
  try {
    const oekt = await hentOekt(h);
    return oekt ? { kontoId: oekt.user.id } : null;
  } catch (e) {
    unstable_rethrow(e);
    console.error("Kunne ikke slå opp økten, viser landingssiden:", e);
    return null;
  }
});

/** For kontosiden: e-postadressen er det eneste kontoen har å vise. */
export async function innloggetEpost(): Promise<string | null> {
  const oekt = await hentOekt(await headers());
  return oekt?.user.email ?? null;
}
