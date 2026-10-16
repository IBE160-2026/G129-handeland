/**
 * Startsiden — FR-1 (innlesing ved liming) og FR-36 (historikk).
 *
 * Bildeinnlesing (FR-44) og PDF (FR-2) kommer som egne veier inn i samme
 * løype. Liming er den første fordi den er den eneste som ikke kan feile på
 * uthenting, og fordi den gjør resten av løypen målbar før de andre finnes.
 */

import Link from "next/link";
import { tilgang } from "../data/konto";
import { listTekster } from "../data/tilgang";
import { limInnBilde, limInnPdf, limInnTekst } from "./handlinger";
import { Innlesing } from "./komponenter/Innlesing";
import { SlettTekstKnapp } from "./komponenter/SlettTekstKnapp";

/** Hvor eleven skal fortsette, ut fra hvor langt Teksten har kommet (AD-9). */
function nesteSteg(tilstand: "innlest" | "aktivert" | "laast", id: string) {
  if (tilstand === "innlest") return `/tekst/${id}/aktivering`;
  if (tilstand === "aktivert") return `/tekst/${id}/gjennomsyn`;
  return `/tekst/${id}/lesing`;
}

const UNDERLENKE =
  "underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 focus:outline-2 focus:outline-offset-2 dark:hover:decoration-slate-100";

const TILSTANDSORD: Record<string, string> = {
  innlest: "Ikke begynt",
  aktivert: "Venter på gjennomsyn",
  laast: "Klar til lesing",
};

export default async function Startside() {
  // FR-35: uten innlogging sendes eleven til innloggingssiden.
  const tekster = await listTekster(await tilgang());

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-col gap-12 lg:flex-row">
        {/*
          Sidekolonnen kommer først i koden, slik at den står til venstre på
          store skjermer, men `order` legger den under skjemaet på mobil —
          der er det å lime inn en ny tekst det første eleven skal se.
        */}
        <aside aria-labelledby="tekstene-dine" className="order-2 shrink-0 lg:order-1 lg:w-72">
          <h2 id="tekstene-dine" className="text-lg font-semibold tracking-tight">
            Tekstene dine
          </h2>
          {tekster.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Tekstene du limer inn, havner her. Herfra kan du gå rett til
              teksten eller oppgavene.
            </p>
          ) : (
            <ul className="mt-3 space-y-4">
              {tekster.map((t) => (
                <li key={t.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                  <p className="font-medium">{t.tittel}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {TILSTANDSORD[t.tilstand] ?? t.tilstand}
                  </p>
                  <ul className="mt-2 space-y-1 border-l-2 border-slate-200 pl-3 text-sm dark:border-slate-700">
                    <li>
                      <Link href={nesteSteg(t.tilstand, t.id)} className={UNDERLENKE}>
                        Teksten
                      </Link>
                    </li>
                    <li>
                      {t.tilstand === "laast" ? (
                        <Link href={`/tekst/${t.id}/oppgaver`} className={UNDERLENKE}>
                          Oppgaver
                        </Link>
                      ) : (
                        // Quizen bygger på den låste teksten (AD-15), så
                        // oppgavene finnes først etter gjennomsynet.
                        <span className="text-slate-500">Oppgaver — etter gjennomsynet</span>
                      )}
                    </li>
                  </ul>
                  <div className="mt-2">
                    <SlettTekstKnapp tekstId={t.id} tittel={t.tittel} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="order-1 min-w-0 flex-1 lg:order-2">
          <h1 className="text-3xl font-semibold tracking-tight">Ny tekst</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Lim inn en fagtekst. Du får se hva den handler om, lese den med
            fagordene forklart, og sjekke om du forsto den.
          </p>
          <div className="mt-8">
            <Innlesing limInn={limInnTekst} limInnPdf={limInnPdf} limInnBilde={limInnBilde} />
          </div>
        </section>
      </div>
    </main>
  );
}
