/**
 * Registrering — FR-35. Bare med invitasjonskode (se data/auth.ts).
 *
 * Siden sier kort hva som lagres og lenker til «Vilkår og personvern»
 * (/vilkaar, FR-53), fordi brukergruppen er ungdom og FR-35 lover minst
 * mulig data. Et løfte eleven ikke kan se, er ikke mye verdt. Skjemaet krever
 * at eleven bekrefter 15 år og at hun har lest vilkårene.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { innloggetEpost } from "../../data/konto";
import { RegistreringSkjema } from "../komponenter/KontoSkjemaer";

export default async function Registrer() {
  if (await innloggetEpost()) redirect("/");

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Opprett konto</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Du må være 15 år eller eldre. LeseBuddy lagrer bare e-postadressen din,
        passordet (kryptert) og det du selv legger inn, og tekstene sendes til
        Anthropic. Hva det betyr, og hvordan du sletter alt, står i{" "}
        <Link href="/vilkaar" className="font-medium underline underline-offset-4">
          Vilkår og personvern
        </Link>
        .
      </p>
      <section className="mt-8">
        <RegistreringSkjema />
      </section>
      <p className="mt-8 text-slate-600 dark:text-slate-400">
        Har du allerede en konto?{" "}
        <Link href="/logg-inn" className="font-medium underline underline-offset-4">
          Logg inn
        </Link>
      </p>
    </main>
  );
}
