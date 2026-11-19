/**
 * «Vilkår og personvern» — FR-53. Offentlig: ingen `tilgang()`, så siden
 * vises uten innlogging. Lenket fra registreringen, landingssiden og
 * kontosiden.
 *
 * **Innholdet er fast.** Teksten er den Arve godkjente 19.11.2026
 * (`_bmad-output/implementation-artifacts/vilkaar-tekst-utkast.md`, under
 * streken), gjengitt uten endringer i ordlyden. Endres teksten, endres
 * `VILKAARSVERSJON` i data/vilkaar.ts og datoen øverst, og nye kontoer
 * godtar den nye versjonen.
 *
 * Kontaktadressen og navnet på den behandlingsansvarlige står i
 * data/vilkaar.ts, så de kan byttes ett sted.
 */

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { BEHANDLINGSANSVARLIG, KONTAKT_EPOST } from "../../data/vilkaar";

export const metadata: Metadata = {
  title: "Vilkår og personvern – LeseBuddy",
  description:
    "Hva du sier ja til når du lager en konto i LeseBuddy, hva som lagres, hvor tekstene dine går, og hvordan du sletter alt.",
};

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-10 text-2xl font-semibold tracking-tight">
      {children}
    </h2>
  );
}

const LISTE = "mt-3 list-disc space-y-2 ps-6";
const AVSNITT = "mt-3";

function Epost() {
  return (
    <a href={`mailto:${KONTAKT_EPOST}`} className="font-bold underline underline-offset-4">
      {KONTAKT_EPOST}
    </a>
  );
}

const LAGRES: [string, string][] = [
  ["E-postadressen din", "For at du skal kunne logge inn"],
  ["Passordet ditt, kryptert", "For at bare du skal komme inn. Ingen kan lese det, heller ikke Arve"],
  ["Tekstene du legger inn", "For at du skal kunne lese og øve på dem igjen"],
  [
    "Det du gjør med tekstene: svarene i quizen og fagsamtalen, merkene på øvekortene og overskriftene, det du lurer på, mappene dine",
    "For at du skal kunne fortsette der du slapp",
  ],
  [
    "Det LeseBuddy har laget for deg: fagord, quiz, øvekort, oppsummeringer, oversettelser, minnevers",
    "For at det skal være det samme neste gang, og ikke lages på nytt",
  ],
  [
    "Innstillingene dine: morsmål (hvis du har valgt et), tekststørrelse og linjeavstand",
    "For at appen skal se ut slik du vil",
  ],
  [
    "At du har godtatt disse vilkårene, når, og hvilken versjon",
    "For å kunne vise at du har fått denne informasjonen",
  ],
];

export default function Vilkaar() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Vilkår og personvern</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Sist endret 20. november 2026.</p>

      <p className={AVSNITT}>
        LeseBuddy hjelper deg å forstå fagtekster: før du leser, mens du leser og etter at du har lest. Her står
        det hva du sier ja til når du lager en konto, og hva som skjer med det du legger inn.
      </p>

      <H2 id="kort">Kort fortalt</H2>
      <ul className={LISTE}>
        <li>
          Du må være <strong>15 år eller eldre</strong>.
        </li>
        <li>
          LeseBuddy lagrer{" "}
          <strong>
            e-postadressen din, passordet ditt (kryptert) og det du selv legger inn: tekstene dine og det du gjør
            med dem
          </strong>
          . Ikke navn, skole, klasse eller alder.
        </li>
        <li>
          Tekstene du legger inn, <strong>sendes til Anthropic</strong>, som lager oppgavene med en språkmodell. De
          brukes <strong>ikke</strong> til å trene modeller.
        </li>
        <li>
          Du kan <strong>slette alt</strong> selv, når du vil.
        </li>
        <li>
          LeseBuddy er et <strong>studentprosjekt i testfase</strong>, og den kan ta feil. Teksten din er alltid
          kilden.
        </li>
        <li>
          <strong>Legg ikke inn noe personlig</strong>, som navnet ditt, dagboktekster eller noe om helsen din.
          LeseBuddy er laget for fagtekster.
        </li>
        <li>
          Du kan lagre et <strong>morsmål</strong>, så LeseBuddy kan forklare på morsmålet ditt. Dette er valgfritt,
          og trengs ikke for å bruke LeseBuddy.
        </li>
      </ul>

      <H2 id="hvem">Hvem står bak</H2>
      <p className={AVSNITT}>
        LeseBuddy er laget av {BEHANDLINGSANSVARLIG} som et studentprosjekt i emnet IBE160 ved Høgskolen i Molde.
        Arve er <strong>behandlingsansvarlig</strong>. Det betyr at det er han som bestemmer hva som skjer med
        opplysningene dine, og som svarer for det.
      </p>
      <p className={AVSNITT}>
        Spørsmål, eller noe du vil ha slettet eller se? Skriv til <Epost />.
      </p>

      <H2 id="alder">Hvem kan bruke LeseBuddy</H2>
      <p className={AVSNITT}>
        LeseBuddy er for elever på videregående, og du må være <strong>15 år eller eldre</strong> for å lage en
        konto. Du bekrefter det selv når du registrerer deg. Vi spør ikke om fødselsdatoen din, og vi lagrer ikke
        alderen din, bare at du har bekreftet at du er 15 eller eldre.
      </p>
      <p className={AVSNITT}>
        Hvorfor 15 år? Tekstene dine sendes til et selskap utenfor Norge, og da mener vi at det er riktig med en
        høyere grense enn det loven krever for nettjenester (13 år).
      </p>
      <p className={AVSNITT}>
        Du trenger en invitasjonskode for å registrere deg. Den får du av den som har invitert deg til å prøve
        LeseBuddy.
      </p>

      <H2 id="lagres">Hva som lagres</H2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-kant">
              <th scope="col" className="py-2 pe-4 font-bold">
                Hva
              </th>
              <th scope="col" className="py-2 font-bold">
                Hvorfor
              </th>
            </tr>
          </thead>
          <tbody>
            {LAGRES.map(([hva, hvorfor]) => (
              <tr key={hva} className="border-b border-kant align-top">
                <td className="py-2 pe-4">{hva}</td>
                <td className="py-2">{hvorfor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6">
        <strong>Det som ikke lagres:</strong>
      </p>
      <ul className={LISTE}>
        <li>
          <strong>Bildene du tar av boksider.</strong> De brukes bare til å lese ut teksten, og så er de borte. Det
          som lagres, er teksten du godkjenner. Informasjon om bildet (som sted og tidspunkt) fjernes før bildet
          sendes videre.
        </li>
        <li>
          <strong>PDF-filer.</strong> Teksten leses ut i nettleseren din, og bare teksten sendes til LeseBuddy.
        </li>
        <li>Navn, skole, klasse, alder eller fødselsdato.</li>
      </ul>
      <p className={AVSNITT}>
        <strong>Sporing:</strong> LeseBuddy bruker ingen analyseverktøy, annonser eller sporing.
        Informasjonskapsler (cookies) brukes bare til det appen trenger: at du er logget inn, og hvilket tema og
        hvilken hånd du har valgt.
      </p>
      <p className={AVSNITT}>
        <strong>Innloggingsforsøk:</strong> for å stoppe noen som prøver å gjette passord, teller LeseBuddy
        innloggingsforsøk per IP-adresse (adressen nettet ditt har). IP-adressen lagres ikke i klartekst, bare som
        en kode laget med en hemmelig nøkkel, så adressen ikke kan leses ut av databasen.
      </p>

      <H2 id="hvor">Hvor tekstene dine går</H2>
      <p className={AVSNITT}>
        Når du legger inn en tekst, sendes den til <strong>Anthropic</strong>, et amerikansk selskap som lager
        språkmodellen Claude. Det er den som finner fagordene, lager quizen og fører fagsamtalen.
      </p>
      <ul className={LISTE}>
        <li>
          Anthropic <strong>bruker ikke tekstene dine til å trene modeller</strong>. Det står i avtalen LeseBuddy
          har med dem.
        </li>
        <li>
          Teksten kan bli behandlet i <strong>USA, Europa, Asia eller Australia</strong>. Det betyr at den forlater
          Norge og EU/EØS. Overføringen skjer etter EUs standardavtaler for slike overføringer.
        </li>
        <li>
          Anthropic er LeseBuddys <strong>databehandler</strong>. De behandler tekstene bare for å svare LeseBuddy,
          ikke til egne formål.
        </li>
      </ul>
      <p className={AVSNITT}>Selve appen og databasen ligger hos Vercel og Neon, i Frankfurt (i EU).</p>
      <p className={AVSNITT}>Husk derfor: legg ikke inn noe personlig.</p>

      <H2 id="grunnlag">Hvorfor LeseBuddy har lov til å behandle opplysningene</H2>
      <p className={AVSNITT}>
        Når du lager en konto, inngår du en <strong>avtale</strong> med LeseBuddy om å bruke tjenesten.
        Opplysningene over er det som trengs for at tjenesten skal virke. Det er grunnlaget (personvernforordningen
        artikkel 6 nr. 1 bokstav b).
      </p>
      <p className={AVSNITT}>
        LeseBuddy bruker ikke opplysningene dine til noe annet. Skulle det en gang bli aktuelt, for eksempel å
        bruke tekster til å forbedre appen, vil du bli spurt for seg, og du kan si nei og fortsatt bruke LeseBuddy.
      </p>

      <H2 id="lenge">Hvor lenge</H2>
      <p className={AVSNITT}>
        Opplysningene dine lagres <strong>til du sletter dem</strong>. LeseBuddy sletter ikke noe automatisk ennå.
        Planen er at tekster skal slettes etter ett skoleår, med beskjed i god tid før, slik at du rekker å ta vare
        på det du vil.
      </p>
      <ul className={LISTE}>
        <li>
          <strong>Slett en tekst:</strong> i Samlingen. Alt LeseBuddy har laget av den, slettes samtidig.
        </li>
        <li>
          <strong>Slett kontoen:</strong> på Konto-siden. Da slettes alt: tekstene, svarene, mappene og
          innstillingene.
        </li>
      </ul>
      <p className={AVSNITT}>
        Etter at kontoen er slettet, står det igjen en <strong>telling av hvor mye appen ble brukt</strong> (antall
        kall til språkmodellen og hva de kostet), knyttet til et tilfeldig nummer og ikke til deg. Den finnes for å
        holde kostnadene nede, og den kan ikke føres tilbake til e-postadressen din når kontoen er borte.
      </p>

      <H2 id="rettigheter">Rettighetene dine</H2>
      <p className={AVSNITT}>Du har rett til å:</p>
      <ul className={LISTE}>
        <li>
          <strong>få vite</strong> hvilke opplysninger som er lagret om deg, og få en kopi
        </li>
        <li>
          <strong>få rettet</strong> opplysninger som er feil (skriv til oss; e-postadressen kan ikke endres i appen ennå)
        </li>
        <li>
          <strong>få slettet</strong> opplysningene dine (det kan du gjøre selv)
        </li>
        <li>
          <strong>få dataene dine utlevert</strong> i en fil du kan ta med deg
        </li>
        <li>
          <strong>be om at vi slutter å bruke opplysningene en periode</strong>, mens noe blir avklart
        </li>
        <li>
          <strong>klage til Datatilsynet</strong> hvis du mener LeseBuddy behandler opplysningene dine feil:{" "}
          <a href="https://www.datatilsynet.no" className="underline underline-offset-4">
            datatilsynet.no
          </a>
        </li>
      </ul>
      <p className={AVSNITT}>
        Skriv til <Epost /> om du vil bruke en av rettighetene. Du får svar innen én måned.
      </p>

      <H2 id="bruk">Vilkår for bruk</H2>
      <ul className={LISTE}>
        <li>
          <strong>LeseBuddy kan ta feil.</strong> Fagord, forklaringer, spørsmål og vurderinger lages av en
          språkmodell. Hvert svar viser hvor i teksten det kommer fra, så du kan sjekke selv. Teksten er alltid
          kilden.
        </li>
        <li>
          <strong>Fagsamtalen er øving, ikke en prøve.</strong> Den gir ingen karakter.
        </li>
        <li>
          <strong>Legg bare inn tekster du har lov til å bruke,</strong> for eksempel fra læreboka di eller noe
          læreren har delt med deg. Tekstene er private for deg og deles ikke med andre.
        </li>
        <li>
          <strong>Ikke del kontoen</strong> eller passordet ditt med andre.
        </li>
        <li>
          <strong>Det finnes grenser</strong> for hvor mye du kan bruke appen hver dag, for at kostnadene skal holde
          seg nede.
        </li>
        <li>
          LeseBuddy er et <strong>studentprosjekt i testfase.</strong> Den kan være nede, endre seg eller bli lagt
          ned. Blir LeseBuddy lagt ned, slettes alle data, og du får beskjed på e-post først.
        </li>
      </ul>

      <H2 id="endringer">Endringer</H2>
      <p className={AVSNITT}>
        Endres disse vilkårene, står den nye datoen øverst. Nye kontoer godtar den nyeste versjonen.
      </p>

      <p className="mt-12 text-slate-600 dark:text-slate-400">
        <Link href="/" className="underline underline-offset-4">
          ← Til LeseBuddy
        </Link>
      </p>
    </main>
  );
}
