/**
 * Arbeidsbordet — FR-48 (EXPERIENCE.md, Inngang og arbeidsbord).
 *
 * Det eleven ser etter innlogging: hilsenen, teksten hun sist holdt på med
 * som hovedbunke med neste steg, inntil fire bunker til, og veien til en ny
 * tekst og til Samlingen. Tekstlisten med søk og sletting ligger i
 * `/samling` (FR-49), og innlesingen i `/ny`.
 *
 * Bordet tegnes på serveren, så det finnes ingen egen lastetilstand.
 *
 * Uten innlogging viser `/` landingssiden (FR-47), ikke en omdirigering.
 * Derfor `valgfriTilgang()` her, som gir `null` i stedet for å kaste. Feiler
 * øktoppslaget, vises også landingssiden (data/konto.ts).
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  type Bunke,
  hentArbeidsbord,
  type Kontostatus,
  kortDato,
  kortstatus,
  nesteSteg,
  relativDag,
  type Steg,
  velgBordet,
} from "../data/arbeidsbord";
import { samtalegrenseNaadd } from "../data/forbruk";
import { valgfriTilgang } from "../data/konto";
import type { Tilgang } from "../data/tilgang";
import { Arbeidsbord, type Hovedbunke, type Visningsbunke } from "./komponenter/Arbeidsbord";
import { Hentefeil } from "./komponenter/Hentefeil";
import { Landingsside } from "./komponenter/Landingsside";
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

function visning(b: Bunke, konto: Kontostatus): Visningsbunke {
  const kort = kortstatus(b, konto);
  return { id: b.id, tittel: b.tittel, dato: kortDato(b.opprettet), framdrift: kort.map((k) => k.paabegynt), kort };
}

/** Landingstittelen bare for den som ser landingssiden; innlogget er fanen «Arbeidsbord». */
export async function generateMetadata(): Promise<Metadata> {
  if (await valgfriTilgang()) return { title: "Arbeidsbord – LeseBuddy" };
  return {
    title: "LeseBuddy – lesestøtte for videregående",
    description:
      "LeseBuddy hjelper elever på videregående å forstå det de leser. Eleven leser teksten selv, og Buddy forklarer fagordene, lager quiz og øvekort og følger opp i en fagsamtale. For elever og lærere.",
  };
}

export default async function Forside() {
  // FR-47: uten innlogging, eller når øktoppslaget feiler, vises landingssiden.
  const t = await valgfriTilgang();
  if (!t) return <Landingsside />;
  return <ArbeidsbordSide t={t} />;
}

async function ArbeidsbordSide({ t }: { t: Tilgang }) {
  let bunker: Bunke[] | null = null;
  // PRD §6.4: Fagsamtale-kortet og neste steg sier fra når dagens samtaler er brukt.
  let konto: Kontostatus = {};
  try {
    [bunker, konto] = await Promise.all([
      hentArbeidsbord(t),
      // Feiler oppslaget, vises bordet likevel, som om grensen ikke er nådd.
      samtalegrenseNaadd(t)
        .catch(() => false)
        .then((naadd) => ({ samtalegrenseNaadd: naadd })),
    ]);
  } catch (e) {
    console.error("Kunne ikke hente tekstene til arbeidsbordet:", e);
    bunker = null;
  }

  if (bunker === null) {
    return (
      <main className="mx-auto w-full max-w-[70rem] px-[16px] py-10 min-[760px]:px-5">
        <h1>Hei!</h1>
        <Hentefeil igjen="/" />
      </main>
    );
  }

  const { hoved, smaa, antall } = velgBordet(bunker);

  if (!hoved) {
    return (
      <main className="mx-auto w-full max-w-[70rem] px-[16px] py-10 min-[760px]:px-5">
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

  const steg = nesteSteg(hoved, konto);
  const hovedbunke: Hovedbunke = { ...visning(hoved, konto), neste: { tekst: steg.tekst, href: steg.href }, boble: boble(steg, hoved.tittel) };

  return (
    <main className="bordside mx-auto w-full max-w-[70rem] px-[16px] py-10 min-[760px]:px-5">
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="min-w-0">
          {/*
            Smalere enn 760 px hilser Buddy (mini, brillene 36 px høye) ved siden av
            «Hei!» og gjentar neste steg i en boble (bolk 6, utkast C). Pynt, som
            Buddy på bordet: neste steg står allerede på hovedbunken.
          */}
          <div className="hilsen">
            <h1>Hei!</h1>
            <div className="hilsen-buddy" aria-hidden="true">
              <BuddyMerke variant="ansikt" mini storrelse={36} />
              <span className="hilsen-boble">{hovedbunke.boble}</span>
            </div>
          </div>
          <p className="mt-1 text-dempet">
            Du holdt på med <strong className="text-tekst">{hoved.tittel}</strong> {relativDag(hoved.sistAktiv, new Date())}.
          </p>
        </div>
        <Link href="/ny" className={`ml-auto ${KNAPP_PRIMAER}`}>
          + Ny tekst
        </Link>
      </div>
      <Arbeidsbord hoved={hovedbunke} smaa={smaa.map((b) => visning(b, konto))} antall={antall} />
    </main>
  );
}
