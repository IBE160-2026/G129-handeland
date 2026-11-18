/**
 * Aktiveringssiden — FR-5 og FR-6.
 *
 * Eleven ser BARE overskriftene, ikke brødteksten. Det er hele poenget med
 * steget: å hente fram det eleven allerede vet før teksten leses, framfor å
 * lese den kaldt. Viser vi brødteksten her, er det ikke lenger en aktivering —
 * det er bare lesing med et spørsmål foran.
 *
 * FR-6 (endret 17.11.2026, merkene 18.11): over overskriftene står ett
 * spørsmål, «Hva vet du om dette fra før?», og eleven svarer for hver
 * overskrift «Mye», «Litt», «Ingenting ennå» eller «Skjønner ikke
 * overskriften». Hun kan skrive ett spørsmål hun lurer på. Det frie
 * feltet «Hva tror du teksten handler om?» er borte; utviklerens egen test
 * viste at det ikke satte i gang noe. Det hun merket og spurte om, vises igjen
 * i lesevisningen under «Før du leste».
 *
 * Overskriftene regnes ut fra `delIAvsnitt` (AD-12) og lagres IKKE. Avsnitts-
 * listen fryses først ved låsing (AD-9): for PDF og bilde i gjennomsynet etter
 * dette steget, der eleven kan rette brødteksten; for innlimt tekst i dette
 * steget, som låser teksten når svaret sendes (FR-3, endret 11.11).
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { tilgang } from "../../../../data/konto";
import { hentMorsmaal, hentOversettelse, kildeHash } from "../../../../data/morsmaal";
import { overskriftElementer, somOppslag } from "../../../../morsmaal/elementer";
import { KVALITETSSIKRET } from "../../../../morsmaal/spraak";
import { HentOversettelse } from "../../../komponenter/Morsmaal";
import { Morsmaalstekst, Spraakmerknad } from "../../../komponenter/Tospraak";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { delIAvsnitt, overskrifter } from "../../../../tekst/avsnittsdeling";
import { MERKENAVN, MERKESPOERSMAAL } from "../../../../tekst/forkunnskap";
import { lagOversettelse, lagreAktivering } from "../../../handlinger";
import { AktiveringSkjema, LaasPaaNyttSkjema } from "../../../komponenter/Skjemaer";
import { Tusj } from "../../../komponenter/Tusj";
import { stegtekst } from "../../../../tekst/steg";

export default async function Aktivering({
  params,
}: PageProps<"/tekst/[id]/aktivering">) {
  // FR-35: uten innlogging sendes eleven til innloggingssiden. Hentes før
  // noen try-blokk, fordi omdirigeringen er et unntak en catch ville fanget.
  const t = await tilgang();

  const { id } = await params;

  let tekst;
  try {
    tekst = await hentTekst(t, id);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }

  // FR-3: fase 3a kan ikke hoppes over. Aktiveringen bygger på overskrifter
  // eleven har godkjent.
  if (tekst.tilstand === "innlest" && tekst.overskrifterGodkjent === null) {
    redirect(`/tekst/${id}/overskrifter`);
  }
  // AD-9 går bare framover. En aktivert PDF- eller bildetekst fullføres i
  // gjennomsynet. En låst tekst kan
  // fortsatt åpne siden og se overskriftene — også på morsmålet (FR-26) —
  // men får ikke skjemaet: svaret er lagret, og et nytt trykk ville feilet.
  // Innlimt tekst kommer nå rett hit fra lesingen med tilbakeknappen (FR-3).
  // Innlimt tekst går ikke til gjennomsynet (FR-3): feilet låsingen, blir
  // den her og låses på nytt.
  const laasPaaNytt = tekst.tilstand === "aktivert" && tekst.vei === "liming";
  if (tekst.tilstand === "aktivert" && !laasPaaNytt) redirect(`/tekst/${id}/gjennomsyn`);
  const laast = tekst.tilstand === "laast";
  /** Skjemaet vises bare før forkunnskapen er lagret. */
  const visSkjema = !laast && !laasPaaNytt;

  const avsnitt = delIAvsnitt(tekst.redigertTekst);
  const titler = overskrifter(avsnitt);

  // FR-26: overskriftene på begge språk. Mangler oversettelsen, vises de på
  // norsk med en gang, og oversettelsen hentes etterpå (FR-29).
  const spraak = await hentMorsmaal(t);
  const elementer = overskriftElementer(avsnitt);
  const oversatt =
    spraak && elementer.length > 0
      ? await hentOversettelse(t, id, spraak.kode, "overskrifter", kildeHash(elementer))
      : null;
  const mm = somOppslag(oversatt);

  const laget = (innhold: string) => tekst.genererteOverskrifter?.includes(innhold) ?? false;
  const morsmaal = (nummer: number) =>
    spraak ? <Morsmaalstekst spraak={spraak} tekst={mm.get(`o${nummer}`)} className="text-base" /> : undefined;

  // Elevens merke per overskrift, når forkunnskapen er lagret. Slått opp på
  // overskriftens tekst, fordi det er slik merkene er lagret.
  const merket = new Map((tekst.forkunnskapMerking ?? []).map((m) => [m.overskrift, m.merke]));

  const lenke =
    "underline decoration-slate-500 dark:decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100";

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {stegtekst(tekst.vei, "aktivering")} — før du leser
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        <Tusj>{tekst.tittel}</Tusj>
      </h1>

      {visSkjema && (
        <p id="aktivering-hjelp" className="mt-4 text-slate-700 dark:text-slate-300">
          {titler.length > 0
            ? "Se på overskriftene før du leser, og svar for hver av dem. Ingenting her blir vurdert."
            : "Er det noe du lurer på om emnet før du leser? Ingenting her blir vurdert."}
        </p>
      )}

      {titler.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-medium">Overskriftene i teksten</h2>
          {spraak && !oversatt && (
            <HentOversettelse handling={lagOversettelse.bind(null, id, "overskrifter")} hva="overskriftene" />
          )}
          {/* Med skjemaet står overskriftene i skjemaet, hver med sine valg (FR-6). */}
          {!visSkjema && merket.size > 0 && (
            <p className="mt-3 text-slate-600 dark:text-slate-400">{MERKESPOERSMAAL}</p>
          )}
          {!visSkjema && (
            <ul className="mt-3 space-y-2 border-l-2 border-slate-300 pl-4 dark:border-slate-700">
              {titler.map((o) => {
                const merke = merket.get(o.innhold);
                return (
                  <li key={o.nummer} className="text-lg">
                    {o.innhold}
                    {/* FR-5: synlig merket når Lesevenn laget den, ikke teksten. */}
                    {laget(o.innhold) && (
                      <span className="ml-2 align-middle text-xs text-slate-500 dark:text-slate-400">(laget av LeseBuddy)</span>
                    )}
                    {merke && MERKENAVN[merke] && (
                      <span className="ml-2 align-middle text-sm text-slate-600 dark:text-slate-400">
                        — du merket: {MERKENAVN[merke]}
                      </span>
                    )}
                    {morsmaal(o.nummer)}
                  </li>
                );
              })}
            </ul>
          )}
          {spraak && (
            <div className="mt-3">
              <Spraakmerknad spraak={spraak} kvalitetssikret={KVALITETSSIKRET.has(spraak.kode)} />
            </div>
          )}
        </section>
      ) : (
        /*
         * FR-5: teksten kan mangle overskrifter. Da degraderer steget ærlig
         * framfor å finne på overskrifter eleven tror står i teksten. Bare
         * spørsmålsfeltet vises (FR-6).
         */
        <section className="mt-8 rounded-md border border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <p>
            {visSkjema
              ? "LeseBuddy fant ingen overskrifter i denne teksten, så det er ingenting å merke her."
              : "LeseBuddy fant ingen overskrifter i denne teksten."}
          </p>
        </section>
      )}

      <section className={visSkjema && titler.length > 0 ? "mt-3" : "mt-8"}>
        {laast ? (
          <p>
            Du har alt gjort dette steget.{" "}
            <Link href={`/tekst/${id}/lesing`} className={lenke}>
              Gå til teksten
            </Link>
          </p>
        ) : laasPaaNytt ? (
          <LaasPaaNyttSkjema handling={lagreAktivering.bind(null, id)} />
        ) : (
          <AktiveringSkjema
            handling={lagreAktivering.bind(null, id)}
            titler={titler.map((o) => ({
              nummer: o.nummer,
              innhold: o.innhold,
              laget: laget(o.innhold),
              morsmaal: morsmaal(o.nummer),
            }))}
            venter={tekst.vei === "liming" ? "Finner fagordene…" : "Lagrer…"}
            status={tekst.vei === "liming" ? "Buddy finner fagordene …" : undefined}
          />
        )}
      </section>

      <p className="mt-10 text-sm">
        <Link href="/" className={lenke}>
          Tilbake
        </Link>
      </p>
    </main>
  );
}
