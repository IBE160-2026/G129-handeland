/**
 * Innlogging — FR-35.
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { innloggetEpost } from "../../data/konto";
import { InnloggingSkjema } from "../komponenter/KontoSkjemaer";

export default async function LoggInn() {
  if (await innloggetEpost()) redirect("/");

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Lesevenn</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Logg inn for å fortsette.</p>
      <section className="mt-8">
        <InnloggingSkjema />
      </section>
      <p className="mt-8 text-slate-600 dark:text-slate-400">
        Har du fått en invitasjonskode?{" "}
        <Link href="/registrer" className="font-medium underline underline-offset-4">
          Opprett konto
        </Link>
      </p>
    </main>
  );
}
