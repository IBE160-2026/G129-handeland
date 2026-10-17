/**
 * Lesevisningen — FR-9, og morsmålsstøtten i FR-25 til FR-27.
 *
 * Den viktigste flaten i appen, og §5 sier at lesbarhet har forrang over pynt:
 * linjelengde rundt 70 tegn, romslig linjeavstand, høy kontrast, og ingen
 * informasjon formidlet ved farge alene.
 *
 * Markeringene kommer fra det LAGREDE forekomstsettet (AD-13). Siden søker
 * ikke etter uttrykkene selv — se begrunnelsen i `MarkertAvsnitt`.
 *
 * Med Morsmål valgt legges oversettelsene til UNDER det norske, aldri i
 * stedet (FR-25). Mangler en oversettelse, tegnes siden uten, og
 * `HentOversettelse` lager den etterpå — teksten venter aldri på den (FR-29).
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hentBegrepssett } from "../../../../data/begrepssett";
import { tilgang } from "../../../../data/konto";
import { harSjekketForstaaelsen } from "../../../../data/sjekket";
import { hentLeseinnstillinger } from "../../../../data/leseinnstillinger";
import { lesestil } from "../../../../tekst/leseinnstillinger";
import { Leseinnstillinger } from "../../../komponenter/Leseinnstillinger";
import {
  hentMorsmaal,
  hentOppsummering,
  hentOversettelse,
  hentUtpeking,
  kildeHash,
} from "../../../../data/morsmaal";
import { IkkeFunnet, hentAvsnitt, hentTekst } from "../../../../data/tilgang";
import {
  begrepElementer,
  oppsummeringElementer,
  somOppslag,
  utpekingElementer,
} from "../../../../morsmaal/elementer";
import { KVALITETSSIKRET } from "../../../../morsmaal/spraak";
import { MarkertAvsnitt } from "../../../komponenter/MarkertAvsnitt";
import { HentOversettelse } from "../../../komponenter/Morsmaal";
import { Morsmaalstekst, Spraakmerknad } from "../../../komponenter/Tospraak";
import { UthevAvsnitt } from "../../../komponenter/UthevAvsnitt";
import { FinnFagordPaaNyttSkjema, LagOppsummeringSkjema } from "../../../komponenter/Skjemaer";
import { genererPaaNytt, lagOppsummering, lagOversettelse, lagreLesing } from "../../../handlinger";

const KATEGORINAVN = { spraklig_bilde: "Språklige bilder", akademisk: "Ord fra fagspråket" } as const;

export default async function Lesing({
  params,
}: PageProps<"/tekst/[id]/lesing">) {
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

  if (tekst.tilstand !== "laast") redirect(`/tekst/${id}/aktivering`);

  const [avsnitt, sett, spraak, oppsummering, innstillinger, sjekket] = await Promise.all([
    hentAvsnitt(t, id),
    hentBegrepssett(t, id),
    hentMorsmaal(t),
    hentOppsummering(t, id),
    hentLeseinnstillinger(t),
    harSjekketForstaaelsen(t, id),
  ]);

  // FR-27: utpekingen hører til Morsmål, og den trenger fagordene for å
  // holde dem utenfor. Uten begge finnes den ikke.
  const utpeking = spraak && sett ? await hentUtpeking(t, id) : null;

  const oversatt = async (type: "begreper" | "oppsummering" | "utpekinger", el: { id: string; tekst: string }[]) =>
    spraak && el.length > 0 ? hentOversettelse(t, id, spraak.kode, type, kildeHash(el)) : null;

  const [begrepOversatt, oppsummeringOversatt, utpekingOversatt] = await Promise.all([
    oversatt("begreper", begrepElementer(sett?.begreper ?? [])),
    oversatt("oppsummering", oppsummeringElementer(oppsummering ?? [])),
    oversatt("utpekinger", utpekingElementer(utpeking ?? [])),
  ]);
  const begrepMm = somOppslag(begrepOversatt);
  const oppsummeringMm = somOppslag(oppsummeringOversatt);
  const utpekingMm = somOppslag(utpekingOversatt);
  const kvalitetssikret = spraak ? KVALITETSSIKRET.has(spraak.kode) : false;

  // Forekomstene grupperes per avsnitt én gang, framfor å filtreres på nytt
  // for hvert avsnitt som tegnes.
  const perAvsnitt = new Map<
    number,
    {
      start: number;
      slutt: number;
      begrepId: string;
      uttrykk: string;
      forklaring: string;
      morsmaal?: { tekst: string; kode: string; retning: "ltr" | "rtl" };
    }[]
  >();

  for (const b of sett?.begreper ?? []) {
    for (const f of b.forekomster) {
      const liste = perAvsnitt.get(f.avsnittNummer) ?? [];
      liste.push({
        start: f.start,
        slutt: f.slutt,
        begrepId: b.id,
        uttrykk: b.uttrykk,
        forklaring: b.forklaring,
        morsmaal:
          spraak && begrepMm.has(`f:${b.id}`)
            ? {
                tekst: `${begrepMm.get(`u:${b.id}`) ?? ""} (${b.uttrykk}): ${begrepMm.get(`f:${b.id}`)}`,
                kode: spraak.kode,
                retning: spraak.retning,
              }
            : undefined,
      });
      perAvsnitt.set(f.avsnittNummer, liste);
    }
  }

  const lenke =
    "underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100";

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Steg 3 av 4 — les teksten
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {tekst.tittel}
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {spraak ? `Morsmål: ${spraak.navn}. ` : ""}
        <Link href="/konto" className={lenke}>
          {spraak ? "Endre morsmål" : "Velg morsmål"}
        </Link>
      </p>

      <Leseinnstillinger handling={lagreLesing} valgt={innstillinger} malId="lesetekst" />

      <div className="mt-8 gap-10 lg:flex">
        {/* FR-12: størrelse og linjeavstand fra kontoen; linjelengden i ch holder ca. 70 tegn. */}
        <article id="lesetekst" style={lesestil(innstillinger)} className="min-w-0 flex-1">
          <UthevAvsnitt />
          {avsnitt.map((a) => (
            <MarkertAvsnitt
              key={a.nummer}
              innhold={a.innhold}
              erOverskrift={a.erOverskrift}
              markeringer={perAvsnitt.get(a.nummer) ?? []}
              nummer={a.nummer}
            />
          ))}
        </article>

        <aside className="mt-10 shrink-0 lg:mt-0 lg:w-72">
          <h2 className="font-semibold tracking-tight">Fagord i teksten</h2>

          {sett === null ? (
            /*
             * Teksten kan være låst uten Begrepssett: låsingen og
             * modellkallet kan feile hver for seg. §5 krever en vei videre,
             * ikke en tom liste uten forklaring.
             */
            <div className="mt-3 rounded-md border border-slate-300 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
              <p>Fagordene er ikke funnet ennå.</p>
              <p className="mt-2">
                Det kan være at det gikk galt under genereringen. Du kan lese
                teksten uten markeringer i mellomtiden — den er den samme.
              </p>
              <FinnFagordPaaNyttSkjema handling={genererPaaNytt.bind(null, id)} />
            </div>
          ) : sett.begreper.length === 0 ? (
            /*
             * FR-7: tomt Begrepssett sies rett ut. Funksjonen degraderer
             * ærlig framfor å produsere noe for å ha noe å vise.
             */
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Det ble ikke funnet fagbegreper i denne teksten. Du kan lese
              videre uten markeringer.
            </p>
          ) : (
            <>
              {spraak && !begrepOversatt && (
                <HentOversettelse handling={lagOversettelse.bind(null, id, "begreper")} hva="forklaringene" />
              )}
              <dl className="mt-3 space-y-4">
                {sett.begreper.map((b) => (
                  <div key={b.id}>
                    <dt className="font-medium">{b.uttrykk}</dt>
                    {/*
                      Id-en her er den MarkertAvsnitt peker på med
                      aria-describedby, slik at en skjermleser får forklaringen
                      når markeringen i teksten får fokus.
                    */}
                    <dd
                      id={`forklaring-${b.id}`}
                      className="text-sm text-slate-700 dark:text-slate-300"
                    >
                      {b.forklaring}
                    </dd>
                    {spraak && begrepMm.has(`u:${b.id}`) && (
                      /* FR-25: det norske uttrykket i parentes rett etter, satt av appen. */
                      <dd className="mt-1 border-l-2 border-slate-300 pl-2 text-sm dark:border-slate-700">
                        <Morsmaalstekst spraak={spraak} tekst={begrepMm.get(`u:${b.id}`)} som="span" className="font-medium" />{" "}
                        <span>({b.uttrykk})</span>
                        <Morsmaalstekst spraak={spraak} tekst={begrepMm.get(`f:${b.id}`)} />
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </>
          )}

          {spraak && sett && (
            <section className="mt-10">
              <h2 className="font-semibold tracking-tight">Uttrykk som kan være vanskelige</h2>
              {(!utpeking || (utpeking.length > 0 && !utpekingOversatt)) && (
                <HentOversettelse handling={lagOversettelse.bind(null, id, "utpekinger")} hva="uttrykkene" />
              )}
              {utpeking && utpeking.length === 0 && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  Lesevenn fant ingen språklige bilder eller fagspråkord å forklare i denne teksten.
                </p>
              )}
              {(["spraklig_bilde", "akademisk"] as const).map((k) => {
                const liste = (utpeking ?? []).map((u, i) => ({ ...u, i })).filter((u) => u.kategori === k);
                if (liste.length === 0) return null;
                return (
                  <div key={k} className="mt-4">
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">{KATEGORINAVN[k]}</h3>
                    <dl className="mt-2 space-y-3">
                      {liste.map((u) => (
                        <div key={u.i}>
                          <dt className="font-medium">
                            <a href={`#avsnitt-${u.kildeavsnitt}`} className={lenke}>
                              {u.uttrykk}
                            </a>
                          </dt>
                          <dd className="text-sm text-slate-700 dark:text-slate-300">{u.forklaring}</dd>
                          <dd className="mt-1 border-l-2 border-slate-300 pl-2 text-sm dark:border-slate-700">
                            <Morsmaalstekst spraak={spraak} tekst={utpekingMm.get(`f${u.i}`)} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                );
              })}
            </section>
          )}

          {spraak && (
            <div className="mt-8">
              <Spraakmerknad spraak={spraak} kvalitetssikret={kvalitetssikret} />
            </div>
          )}

          {sett && (
            /*
             * AD-4: promptversjon og modell stemples på alt generert. Her er
             * de synlige. Det er ikke pynt — det er sporbarheten FR-39 og
             * FR-40 krever, og det gjør at en rar markering kan knyttes til
             * hvilken promptversjon som lagde den.
             */
            <p className="mt-4 text-xs text-slate-500">
              Fagordene er funnet av {sett.modell}, prompt {sett.promptversjon}.
              Lesevenn kan ta feil — teksten er kilden.
            </p>
          )}
        </aside>
      </div>

      {/*
        FR-26: oppsummeringen står nederst, etter teksten, og lages når eleven
        ber om den — men først når hun har sjekket forståelsen (PRD §6). Det er
        med vilje strengt: en oppsummering før lesingen er sjekket, gjør
        Lesevenn til et sammendragsverktøy, og det er det appen ikke er.
      */}
      <section id="oppsummering" className="mt-12 max-w-[34rem] scroll-mt-6">
        <h2 className="font-semibold tracking-tight">Oppsummering</h2>
        {oppsummering === null && !sjekket ? (
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Oppsummeringen låses opp når du har sjekket deg selv — ta quizen eller svar i en fagsamtale først.
            Det er med vilje: du lærer mer av å finne det viktigste selv før du ser det samlet.{" "}
            <Link href={`/tekst/${id}/oppgaver`} className={lenke}>
              Til oppgavene
            </Link>
          </p>
        ) : oppsummering === null ? (
          <>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              Vil du se det viktigste i teksten samlet i noen få setninger?
            </p>
            <LagOppsummeringSkjema handling={lagOppsummering.bind(null, id)} />
          </>
        ) : (
          <>
            {spraak && !oppsummeringOversatt && (
              <HentOversettelse handling={lagOversettelse.bind(null, id, "oppsummering")} hva="oppsummeringen" />
            )}
            <ol className="mt-3 space-y-3">
              {oppsummering.map((s, i) => (
                <li key={i}>
                  <p>
                    {s.tekst}{" "}
                    <a href={`#avsnitt-${s.kildeavsnitt}`} className={`text-sm ${lenke}`}>
                      (avsnitt {s.kildeavsnitt})
                    </a>
                  </p>
                  {spraak && <Morsmaalstekst spraak={spraak} tekst={oppsummeringMm.get(`s${i}`)} className="mt-1" />}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-slate-500">
              Laget av en språkmodell ut fra teksten. Teksten er kilden — sjekk avsnittet om noe virker rart.
            </p>
          </>
        )}
      </section>

      <section className="mt-12 max-w-[34rem] rounded-md border border-slate-300 p-5 dark:border-slate-700">
        <h2 className="font-semibold tracking-tight">Ferdig med å lese?</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Sjekk om du fikk med deg det viktigste — med en quiz, eller i en
          fagsamtale der du forklarer med egne ord.
        </p>
        <Link
          href={`/tekst/${id}/oppgaver`}
          className="mt-4 inline-block rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Til oppgavene
        </Link>
      </section>

      <p className="mt-12 text-sm">
        <Link href="/" className={lenke}>
          Tilbake til tekstene dine
        </Link>
      </p>
    </main>
  );
}
