/**
 * Helsesjekk mot databasen.
 *
 * Finnes av to grunner. Den praktiske: etter en utrulling vil man vite at
 * appen faktisk når databasen, og at det ikke bare bygde. Den arkitektoniske:
 * dette er det første stedet appkoden importerer datalaget, og dermed
 * `pg` — altså stedet Turbopack-fella fra arkitekturspinen slår til hvis den
 * skal slå til.
 *
 * Returnerer ingenting om innholdet i databasen og ingenting om
 * tilkoblingsstrengen. Bare om den svarer.
 */

import { sql } from "drizzle-orm";
import { db } from "@/data/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();

  try {
    const svar = await db.execute(
      sql`select count(*)::int as tabeller from information_schema.tables where table_schema = 'public'`,
    );

    const tabeller = (svar.rows[0] as { tabeller: number }).tabeller;

    return Response.json({
      status: "ok",
      tabeller,
      svartidMs: Date.now() - start,
    });
  } catch {
    // Feilen logges på serveren, men detaljene sendes ikke ut — en
    // tilkoblingsfeil inneholder ofte vertsnavn og brukernavn.
    return Response.json(
      { status: "feil", melding: "Databasen svarer ikke." },
      { status: 503 },
    );
  }
}
