/**
 * Samlet øving — FR-51. Alle Øvekortene fra de låste Tekstene i Mappen.
 *
 * Kortene er Begrepssettene til Tekstene, ikke kopier: merkingen lagres på
 * begrepet (`merkKort` med kortets egen Tekst), så den er den samme her og i
 * Teksten. Tekster uten kort står under, med hva som mangler.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { tilgang } from "../../../../data/konto";
import { hentMappe, hentMappekort, type Mappe, type Mappekort } from "../../../../data/mapper";
import { IkkeFunnet } from "../../../../data/tilgang";
import { kortmangel, Mangler } from "../../../komponenter/Mappemangler";
import { Oevekort } from "../../../komponenter/Oevekort";
import { Tusj } from "../../../komponenter/Tusj";

const TILBAKE = "inline-flex min-h-11 items-center font-bold underline decoration-primaer underline-offset-4 hover:decoration-2";

export default async function Mappeoevekort({ params }: PageProps<"/mappe/[id]/oevekort">) {
  // FR-35: hentes før noen try-blokk, se data/konto.ts.
  const t = await tilgang();
  const { id } = await params;

  let mappe: Mappe, kort: Mappekort[];
  try {
    [mappe, kort] = await Promise.all([hentMappe(t, id), hentMappekort(t, id)]);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      {/* Runde 3, bolk 2b: tilbakelenken øverst, som del av headeren (telefontest 23.11). */}
      <header>
        <p>
          <Link href={`/mappe/${mappe.id}`} className={TILBAKE}>
            <span aria-hidden="true">←&nbsp;</span>Tilbake til mappen
          </Link>
        </p>
        <p className="mt-4 text-dempet">Øvekort fra mappen</p>
        <h1 className="mt-1 [overflow-wrap:anywhere]">
          <Tusj>{mappe.tittel}</Tusj>
        </h1>
      </header>

      <div className="mt-8">
        {kort.length > 0 ? (
          <Oevekort kort={kort} />
        ) : (
          <p className="rounded-md border border-kant p-5">
            {mappe.tekster.length === 0
              ? "Mappen har ingen tekster ennå, så det finnes ingen øvekort å øve på."
              : "Ingen av tekstene i mappen har øvekort ennå. Under ser du hva hver tekst mangler."}
          </p>
        )}
      </div>

      <Mangler tekster={mappe.tekster} mangel={kortmangel} overskrift="Tekster uten øvekort" />
    </main>
  );
}
