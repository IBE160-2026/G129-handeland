import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Topplinje } from "./komponenter/Topplinje";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lesevenn",
  description:
    "Leseforståelsesapp for videregående: aktivering av forkunnskaper, lesing med fagord forklart, og forståelsessjekk.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `lang="nb"` er ikke kosmetikk: skjermlesere velger uttale ut fra den,
    // og engelsk uttale av norsk fagtekst er ubrukelig for den eleven appen
    // er bygget for.
    <html
      lang="nb"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/*
          Hopp-lenken er det første tastaturet treffer, og synlig bare når den
          har fokus. Uten den må en tastaturbruker tabbe gjennom menyen på
          hver eneste side (§5).
        */}
        <a
          href="#innhold"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
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
