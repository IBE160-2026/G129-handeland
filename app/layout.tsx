import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
