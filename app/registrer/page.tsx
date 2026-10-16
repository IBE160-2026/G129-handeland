/**
 * Registrering — FR-35. Bare med invitasjonskode (se data/auth.ts).
 *
 * Siden sier hva som lagres, fordi brukergruppen er ungdom og FR-35 lover
 * minst mulig data. Et løfte eleven ikke kan se, er ikke mye verdt.
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
        Lesevenn lagrer bare e-postadressen din, passordet (kryptert, så ingen
        kan lese det), og tekstene og svarene du selv legger inn. Ikke navn,
        skole, klasse eller alder. Du kan slette alt når du vil. Tekstene du
        legger inn, sendes til språkmodellen til Anthropic for behandling, men
        brukes ikke til å trene modeller.
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
