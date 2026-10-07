/**
 * Startsiden — FR-1 (innlesing ved liming) og FR-36 (historikk).
 *
 * Bildeinnlesing (FR-44) og PDF (FR-2) kommer som egne veier inn i samme
 * løype. Liming er den første fordi den er den eneste som ikke kan feile på
 * uthenting, og fordi den gjør resten av løypen målbar før de andre finnes.
 */

import Link from "next/link";
import { innloggingKlar, tilgang } from "../data/konto";
import { listTekster } from "../data/tilgang";
import { limInnTekst } from "./handlinger";
import { LimInnSkjema } from "./komponenter/Skjemaer";
import { IkkeKlar } from "./komponenter/IkkeKlar";

/** Hvor eleven skal fortsette, ut fra hvor langt Teksten har kommet (AD-9). */
function nesteSteg(tilstand: "innlest" | "aktivert" | "laast", id: string) {
  if (tilstand === "innlest") return `/tekst/${id}/aktivering`;
  if (tilstand === "aktivert") return `/tekst/${id}/gjennomsyn`;
  return `/tekst/${id}/lesing`;
}

const TILSTANDSORD: Record<string, string> = {
  innlest: "Ikke begynt",
  aktivert: "Venter på gjennomsyn",
  laast: "Klar til lesing",
};

export default async function Startside() {
  // FR-35: ingen datatilgang uten noe som kan gi en Tilgang. Se konto.ts.
  if (!innloggingKlar()) return <IkkeKlar />;

  const tekster = await listTekster(tilgang());

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Lesevenn</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Lim inn en fagtekst. Du får se hva den handler om, lese den med
        fagordene forklart, og sjekke om du forsto den.
      </p>

      <section className="mt-8">
        <LimInnSkjema handling={limInnTekst} />
      </section>

      {tekster.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">
            Tekstene dine
          </h2>
          <ul className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
            {tekster.map((t) => (
              <li key={t.id} className="py-3">
                <Link
                  href={nesteSteg(t.tilstand, t.id)}
                  className="font-medium underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 focus:outline-2 focus:outline-offset-2 dark:hover:decoration-slate-100"
                >
                  {t.tittel}
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {TILSTANDSORD[t.tilstand] ?? t.tilstand}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
