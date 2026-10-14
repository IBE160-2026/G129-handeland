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
import { redirect } from "next/navigation";
import { hentAuth } from "./auth";
import type { Tilgang } from "./tilgang";

/** Økten bak forespørselen, eller `null`. Verifiseres mot databasen. */
async function hentOekt() {
  return hentAuth().api.getSession({ headers: await headers() });
}

/**
 * Tilgangen til den innloggede eleven. Uten innlogging sendes eleven til
 * innloggingssiden.
 *
 * `redirect` virker ved å kaste. Kall derfor denne FØR en try-blokk, ikke
 * inni — ellers fanger catch omdirigeringen.
 */
export async function tilgang(): Promise<Tilgang> {
  const oekt = await hentOekt();
  if (!oekt) redirect("/logg-inn");
  return { kontoId: oekt.user.id };
}

/** For kontosiden: e-postadressen er det eneste kontoen har å vise. */
export async function innloggetEpost(): Promise<string | null> {
  const oekt = await hentOekt();
  return oekt?.user.email ?? null;
}
