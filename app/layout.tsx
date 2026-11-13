import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Gloock, Instrument_Serif, Quicksand } from "next/font/google";
import "./globals.css";
import { Topplinje } from "./komponenter/Topplinje";

// DESIGN.md, typography: Atkinson til all brødtekst, Instrument Serif til
// overskrifter og «lese» i ordmerket, Quicksand bare til «uddy» i ordmerket.
// Gloock lastes nå, men brukes først på landingssiden (ikke inne i appen).
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

const gloock = Gloock({
  variable: "--font-gloock",
  weight: "400",
  subsets: ["latin", "latin-ext"],
  preload: false,
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `lang="nb"` er ikke kosmetikk: skjermlesere velger uttale ut fra den,
    // og engelsk uttale av norsk fagtekst er ubrukelig for den eleven appen
    // er bygget for.
    <html
      lang="nb"
      className={`${atkinson.variable} ${instrument.variable} ${gloock.variable} ${quicksand.variable} h-full antialiased`}
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
      </body>
    </html>
  );
}
