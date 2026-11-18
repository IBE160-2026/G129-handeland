import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Instrument_Serif, Quicksand } from "next/font/google";
import { cookies } from "next/headers";
import { HAND_KAPSEL, tolkHand } from "../data/hand";
import { TEMA_KAPSEL, tolkTema } from "../data/tema";
import "./globals.css";
import { TenkerVert } from "./komponenter/Tenker";
import { Topplinje } from "./komponenter/Topplinje";

// DESIGN.md, typography: Atkinson til all brødtekst, Instrument Serif til
// overskrifter og «lese» i ordmerket, Quicksand bare til «uddy» i ordmerket.
// Gloock brukes bare på landingssiden, og lastes der (Landingsside.tsx), med
// forhåndslasting fordi heroen er det største elementet på siden.
const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  weight: "700",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeseBuddy",
  description:
    "LeseBuddy er lesestøtte for videregående. Du leser teksten selv, og Buddy hjelper deg med fagordene, spørsmålene og samtalen om det du har lest.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Lys eller mørk modus fra kontoinnstillingene (EXPERIENCE.md, Gjelder
  // overalt). Leses her på serveren, så første tegning har riktig modus og
  // ingenting blinker. Uten gyldig valg står ingen data-tema, og siden følger
  // systemet som før. color-scheme følger data-tema i globals.css.
  const kapsler = await cookies();
  const tema = tolkTema(kapsler.get(TEMA_KAPSEL)?.value);
  // «Venstrehendt» (design bolk 9) på samme måte: `data-hand="venstre"`
  // speiler øvekortene fra første tegning. Uten valg står ingen data-hand.
  const hand = tolkHand(kapsler.get(HAND_KAPSEL)?.value);
  return (
    // `lang="nb"` er ikke kosmetikk: skjermlesere velger uttale ut fra den,
    // og engelsk uttale av norsk fagtekst er ubrukelig for den eleven appen
    // er bygget for.
    <html
      lang="nb"
      data-tema={tema ?? undefined}
      data-hand={hand ?? undefined}
      className={`${atkinson.variable} ${instrument.variable} ${quicksand.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bakgrunn font-sans text-tekst">
        {/*
          Hopp-lenken er det første tastaturet treffer, og synlig bare når den
          har fokus. Uten den må en tastaturbruker tabbe gjennom menyen på
          hver eneste side (§5).
        */}
        <a
          href="#innhold"
          className="fylt sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primaer focus:px-4 focus:py-2 focus:font-bold focus:text-paa-primaer"
        >
          Hopp til innholdet
        </a>
        <Topplinje />
        <div id="innhold" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </div>
        {/*
          Verten for tenkeindikatorens avslutning når svaret sender eleven til
          en ny side eller bytter innholdet (Tenker.tsx). Den står utenfor
          sidene, så den lever videre gjennom navigeringen.
        */}
        <TenkerVert />
      </body>
    </html>
  );
}
