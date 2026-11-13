/**
 * Arbeidsbordet — FR-48 (EXPERIENCE.md, Inngang og arbeidsbord).
 *
 * Det eleven ser etter innlogging: hilsenen, teksten hun sist holdt på med
 * som hovedbunke med neste steg, inntil fire bunker til, og veien til en ny
 * tekst og til Samlingen. Tekstlisten med søk og sletting ligger i
 * `/samling` (FR-49), og innlesingen i `/ny`.
 *
 * Bordet tegnes på serveren, så det finnes ingen egen lastetilstand. Uten
 * innlogging sender `tilgang()` eleven til innloggingssiden (landingssiden
 * kommer i bolk 3).
 */

import Link from "next/link";
import {
  type Bunke,
  hentArbeidsbord,
  kortDato,
  kortstatus,
  nesteSteg,
  relativDag,
  type Steg,
  velgBordet,
} from "../data/arbeidsbord";
import { tilgang } from "../data/konto";
import { Arbeidsbord, type Hovedbunke, type Visningsbunke } from "./komponenter/Arbeidsbord";
import { Hentefeil } from "./komponenter/Hentefeil";
import { KNAPP_PRIMAER } from "./komponenter/knapper";
import { BuddyMerke } from "./komponenter/Merke";

/** Buddys boble gjentar neste steg (pynt, `aria-hidden`). */
function boble(steg: Steg, tittel: string): string {
  switch (steg.slag) {
    case "aktivering":
      return `Klar til å begynne på ${tittel}?`;
    case "gjennomsyn":
      return `Skal vi se over ${tittel}?`;
    case "samtale":
      return `Skal vi fortsette samtalen om ${tittel}?`;
    case "quiz":
      return `Klar for quizen om ${tittel}?`;
    case "fagsamtale":
      return `Klar for en fagsamtale om ${tittel}?`;
    case "oevekort":
      return `Skal vi øve på fagordene i ${tittel}?`;
    case "lesing":
      return `Vil du lese ${tittel} igjen?`;
  }
}

function visning(b: Bunke): Visningsbunke {
  const kort = kortstatus(b);
  return { id: b.id, tittel: b.tittel, dato: kortDato(b.opprettet), framdrift: kort.map((k) => k.paabegynt), kort };
}

export default async function ArbeidsbordSide() {
  // FR-35: hentes før try-blokken, se data/konto.ts.
  const t = await tilgang();
  let bunker: Bunke[] | null = null;
  try {
    bunker = await hentArbeidsbord(t);
  } catch (e) {
    console.error("Kunne ikke hente tekstene til arbeidsbordet:", e);
    bunker = null;
  }

  if (bunker === null) {
    return (
      <main className="mx-auto w-full max-w-[70rem] px-4 py-10 min-[760px]:px-5">
        <h1>Hei!</h1>
        <Hentefeil igjen="/" />
      </main>
    );
  }

  const { hoved, smaa, antall } = velgBordet(bunker);

  if (!hoved) {
    return (
      <main className="mx-auto w-full max-w-[70rem] px-4 py-10 min-[760px]:px-5">
        <h1>Hei!</h1>
        <div className="bord mt-6">
          <div className="flex flex-col items-center gap-5 px-4 py-14 text-center">
            <BuddyMerke variant="ansikt" storrelse={96} />
            <p className="max-w-[28rem] text-lg">Her blir tekstene dine liggende. Legg den første på bordet.</p>
            <Link href="/ny" className={KNAPP_PRIMAER}>
              + Ny tekst
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const steg = nesteSteg(hoved);
  const hovedbunke: Hovedbunke = { ...visning(hoved), neste: { tekst: steg.tekst, href: steg.href }, boble: boble(steg, hoved.tittel) };

  return (
    <main className="mx-auto w-full max-w-[70rem] px-4 py-10 min-[760px]:px-5">
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="min-w-0">
          <h1>Hei!</h1>
          <p className="mt-1 text-dempet">
            Du holdt på med <strong className="text-tekst">{hoved.tittel}</strong> {relativDag(hoved.sistAktiv, new Date())}.
          </p>
        </div>
        <Link href="/ny" className={`ml-auto ${KNAPP_PRIMAER}`}>
          + Ny tekst
        </Link>
      </div>
      <Arbeidsbord hoved={hovedbunke} smaa={smaa.map(visning)} antall={antall} />
    </main>
  );
}
