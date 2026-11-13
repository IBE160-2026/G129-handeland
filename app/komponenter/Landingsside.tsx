/**
 * Landingssiden — FR-47 (EXPERIENCE.md, Flyt 1 og Rulleeffekter på
 * landingssiden).
 *
 * Det den som ikke er innlogget, ser på `/`: hva LeseBuddy er, for elev og
 * lærer, og veien videre til innlogging eller registrering.
 *
 * Den statiske versjonen er grunnlaget. Alt her er HTML fra serveren: alle
 * stegene synlige, alle fire fagordene i eksempelteksten markert, og
 * forklaringene i en `<dl>` under teksten. Rulleeffektene (LandingEffekter)
 * legges oppå bare når JavaScript kjører og bevegelse er tillatt, og de
 * endrer bare utseendet, aldri innholdet.
 *
 * Ingen KI-kall og ingen data: eksempelteksten er hardkodet.
 *
 * Tekstene i hero, stegene, lærerdelen og morsmålsdelen står ordrett fra
 * EXPERIENCE.md, Voice and Tone. Gloock brukes bare her (DESIGN.md,
 * Typography), og markeringstusjen bare én gang, på «leser» i heroen.
 */

import { Gloock } from "next/font/google";
import Link from "next/link";
import { KNAPP_PRIMAER, KNAPP_SEKUNDAER } from "./knapper";
import { LandingEffekter } from "./LandingEffekter";
import { BuddyMerke } from "./Merke";

// Gloock er heroskriften (det største elementet), så den forhåndslastes, og
// bare her: inne i appen brukes den ikke (DESIGN.md, Typography).
const gloock = Gloock({
  variable: "--font-gloock",
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

const KODE = "Har du fått en kode fra læreren? Da kan du registrere deg.";

const STEG = [
  {
    tittel: "Før du leser",
    tekst: "Du ser bare overskriftene og skriver kort hva du tror teksten handler om. Det setter i gang det du allerede vet.",
  },
  {
    tittel: "Mens du leser",
    tekst: "Fagordene er markert. Trykk på et ord, så forklarer Buddy det og viser hvor i teksten det står.",
  },
  {
    tittel: "Etter at du har lest",
    tekst: "Ta quizen, øv med kortene og forklar med egne ord i en fagsamtale der Buddy følger opp det du svarer.",
  },
];

/** Forklaringene i demoen, i samme rekkefølge som fagordene i teksten. */
const FAGORD = [
  { ord: "arvestoff", forklaring: "Oppskriften cellen følger, lagret i DNA-et.", avsnitt: 1 },
  { ord: "mitose", forklaring: "Celledeling der én celle blir til to like celler med samme arvestoff.", avsnitt: 1 },
  { ord: "kromosom", forklaring: "En pakke med arvestoff. Mennesket har 46 i hver kroppscelle.", avsnitt: 1 },
  { ord: "mutasjon", forklaring: "En endring i arvestoffet som kan gå videre til nye celler.", avsnitt: 2 },
];

const LAERER = [
  {
    tittel: "Svaret kommer ikke først",
    tekst: "Ingen sammendrag å kopiere. Eleven tenker over hva hun vet fra før, leser selv og forklarer med egne ord.",
  },
  {
    tittel: "Alt peker tilbake til teksten",
    tekst: "Forklaringer, quiz og samtale viser avsnittet de bygger på.",
  },
  {
    tittel: "Virker på mobilen",
    tekst: "Eleven kan lese, ta quizen og øve på telefonen. Tastatur og skjermleser virker også.",
  },
  {
    tittel: "Morsmål ved siden av norsk",
    tekst: "Forklaringene kan vises på elevens morsmål, uten å erstatte den norske teksten.",
  },
];

function Fagord({ i, children }: { i: number; children: string }) {
  return (
    <span className="ls-fagord" data-i={i}>
      {children}
    </span>
  );
}

function Handlinger({ midtstilt = false }: { midtstilt?: boolean }) {
  return (
    <>
      <div className={`ls-handlinger${midtstilt ? " ls-midt" : ""}`}>
        <Link href="/logg-inn" className={KNAPP_PRIMAER}>
          Logg inn
        </Link>
        <Link href="/registrer" className={KNAPP_SEKUNDAER}>
          Registrer deg
        </Link>
      </div>
      <p className="ls-kode">{KODE}</p>
    </>
  );
}

export function Landingsside() {
  return (
    <>
      <main id="landingsside" className={`landingsside ${gloock.variable}`}>
        <section className="ls-hero" aria-labelledby="ls-tittel">
          <div className="ls-innhold ls-hero-rutenett">
            <h1 id="ls-tittel" className="ls-display">
              Forstå mer av det du <em className="ls-tusj">leser</em>.
            </h1>
            <div className="ls-hero-tekst">
              <p className="ls-lead">
                LeseBuddy er lesestøtte for videregående. Du leser teksten selv, og Buddy hjelper deg med fagordene,
                spørsmålene og samtalen om det du har lest.
              </p>
              <Handlinger />
            </div>
            <div className="ls-hero-buddy">
              <BuddyMerke variant="ansikt" storrelse="var(--ls-buddy)" />
            </div>
          </div>
        </section>

        <section className="ls-seksjon" aria-labelledby="ls-slik" data-boble="Tre steg. Jeg tar dem med deg.">
          <div className="ls-innhold">
            <h2 id="ls-slik" className="ls-display-md">
              Slik hjelper Buddy deg
            </h2>
            <p className="ls-ingress">
              Buddy følger den samme rekkefølgen som en god leselærer. Svaret kommer ikke først. Forståelsen gjør det.
            </p>
            <div className="ls-steg">
              <div className="ls-linje" aria-hidden="true">
                <i />
              </div>
              <ol className="ls-stegliste">
                {STEG.map((s, n) => (
                  <li key={s.tittel} className="ls-ett">
                    <span className="ls-prikk" aria-hidden="true">
                      {n + 1}
                    </span>
                    <h3>{s.tittel}</h3>
                    <p>{s.tekst}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="ls-seksjon ls-demo" aria-labelledby="ls-demo" data-boble="Se, jeg markerer fagordene!">
          <div className="ls-innhold">
            <h2 id="ls-demo" className="ls-display-md">
              Se hvordan Buddy markerer fagord
            </h2>
            <p className="ls-ingress">
              Slik ser en tekst ut når du leser i LeseBuddy. Fagordene er markert, og forklaringen sier hvilket avsnitt
              ordet står i.
            </p>
          </div>
          <div className="ls-demo-spor">
            <div className="ls-innhold ls-demo-klistre">
              <article className="ls-ark" aria-labelledby="ls-eksempel">
                <h3 id="ls-eksempel">Celledeling</h3>
                <p>
                  Før cellen deler seg, kopieres <Fagord i={0}>arvestoffet</Fagord>. Under <Fagord i={1}>mitose</Fagord>{" "}
                  fordeles <Fagord i={2}>kromosomene</Fagord> likt mellom to nye celler.
                </p>
                <p>
                  Noen ganger blir det en feil når arvestoffet kopieres. Da kan det oppstå en{" "}
                  <Fagord i={3}>mutasjon</Fagord>, en endring i oppskriften som cellen gir videre.
                </p>
              </article>
              <div className="ls-forklaringer">
                <p className="ls-hint" aria-hidden="true">
                  Rull videre, så markerer Buddy fagordene ett for ett.
                </p>
                <dl>
                  {FAGORD.map((f, i) => (
                    <div key={f.ord} className="ls-forklaring" data-i={i}>
                      <dt>{f.ord}</dt>
                      <dd>
                        {f.forklaring} <span className="ls-kilde">Avsnitt {f.avsnitt}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="ls-teller" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section className="ls-seksjon" aria-labelledby="ls-morsmaal" data-boble="Jeg kan forklare på morsmålet ditt også.">
          <div className="ls-innhold">
            <h2 id="ls-morsmaal" className="ls-display-md">
              Forklart på ditt språk
            </h2>
            <p className="ls-ingress">
              Har du et annet morsmål? Buddy kan forklare på ukrainsk og 16 andre språk. Ukrainsk er kvalitetssikret, og
              de andre er merket som ikke kontrollert.
            </p>
          </div>
        </section>

        <section id="laerere" className="ls-seksjon ls-laerere" aria-labelledby="ls-laerere" data-boble="Svaret kommer ikke først.">
          <div className="ls-innhold">
            <h2 id="ls-laerere" className="ls-display-md">
              For lærere
            </h2>
            <p className="ls-ingress">
              LeseBuddy er laget for å støtte lesingen, ikke erstatte den. Eleven gjør jobben, og Buddy gjør den lettere
              å få til.
            </p>
            <ul className="ls-punkter">
              {LAERER.map((p) => (
                <li key={p.tittel}>
                  <h3>{p.tittel}</h3>
                  <p>{p.tekst}</p>
                </li>
              ))}
            </ul>
            <p className="ls-merknad">LeseBuddy er foreløpig et studentprosjekt, og tilgang gis på invitasjon.</p>
          </div>
        </section>

        <section className="ls-seksjon ls-cta" aria-labelledby="ls-klar" data-boble="Klar? Logg inn, så leser vi.">
          <div className="ls-innhold">
            <h2 id="ls-klar" className="ls-display-md">
              Klar til å lese?
            </h2>
            <Handlinger midtstilt />
          </div>
        </section>

        <LandingEffekter />
      </main>
      <footer className="ls-bunn">
        <div className="ls-innhold">LeseBuddy · et studentprosjekt i IBE160</div>
      </footer>
    </>
  );
}
