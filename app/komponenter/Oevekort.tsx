"use client";

/**
 * Gjennomgang av Øvekort — FR-16, FR-17.
 *
 * Forsiden viser Faguttrykket, baksiden forklaringen. Kildeavsnittet ligger
 * i en utfellbar del under kortet (FR-16, endret 11.11).
 * Eleven kan snu, gå fram og tilbake, og merke «Har kontroll» eller «Må øve
 * mer» (lagret som `kan` og `maa_oeve`).
 * Merkingen lagres med en gang, så en ny økt starter der forrige sluttet:
 * på første kort i runden som ikke er merket.
 *
 * Kort, merking og den utfellbare kilden er knapper eller summary-elementer,
 * så runden kan tas med tastatur alene (§5). I tillegg (runde 3, bolk 2b):
 * ← og → bytter kort og mellomrom snur, uten å tabbe rundt. Lytteren finnes
 * bare mens kortene vises; reglene (skjemafelt, modifikatorer, mellomrom på
 * en knapp) står i oevekorttaster.ts.
 *
 * Knappene for én hånd (design runde 2, bolk 9): «Må øve mer» og «Har
 * kontroll» står over hverandre, over kortet til høyre (til venstre med
 * «Venstrehendt»), og pilknappene (← «Forrige kort», → «Neste kort», på siste
 * kort «Ferdig») ved siden av hverandre under. Se .oevekort-flate i
 * globals.css.
 */

import { useEffect, useMemo, useState } from "react";
import type { Merking, Oevekort as Kort } from "../../data/oevekort";
import { merkKort } from "../handlinger";
import { Feilmelding } from "./Feilmelding";
import { Kildeavsnitt } from "./Kildeavsnitt";
import { KNAPP_PRIMAER, KNAPP_SEKUNDAER } from "./knapper";
import { tastehandling } from "./oevekorttaster";

type Modus = "alle" | "maa_oeve";

// Knappene i øvingen har fiolett kant (button-secondary). Den valgte
// merkingen (aria-pressed) er fylt (button-primary), så valget synes med
// både form og farge.
const KNAPP = KNAPP_SEKUNDAER;
const knapp = (valgt: boolean) => (valgt ? KNAPP_PRIMAER : KNAPP_SEKUNDAER);

function startIndeks(runde: Kort[], merking: Record<string, Merking | null>): number {
  const i = runde.findIndex((k) => !merking[k.id]);
  return i === -1 ? 0 : i;
}

/**
 * Et kort, og i en Mappe (FR-51) også Teksten det er fra. Merkingen lagres
 * på kortets egen Tekst (`merkKort`), så den er den samme i Mappen og i
 * Teksten.
 */
type Kortet = Kort & { tekst?: { id: string; tittel: string } };

/**
 * Øvekortene for én Tekst (`tekstId`), eller for en Mappe, der hvert kort
 * bærer sin egen Tekst og tittelen vises på kortet.
 */
export function Oevekort({ tekstId, kort }: { tekstId?: string; kort: Kortet[] }) {
  const tekstFor = (k: Kortet) => k.tekst?.id ?? tekstId!;
  const [merking, setMerking] = useState<Record<string, Merking | null>>(() =>
    Object.fromEntries(kort.map((k) => [k.id, k.merking])),
  );
  const [modus, setModus] = useState<Modus>("alle");
  // Runden er fast mens den pågår: et kort som merkes «Har kontroll» underveis i en
  // «må øve»-runde, skal ikke forsvinne under eleven.
  const [runde, setRunde] = useState<Kortet[]>(kort);
  const [indeks, setIndeks] = useState(() => startIndeks(kort, Object.fromEntries(kort.map((k) => [k.id, k.merking]))));
  const [snudd, setSnudd] = useState(false);
  const [ferdig, setFerdig] = useState(false);
  const [feil, setFeil] = useState<{ melding: string; handling: string } | null>(null);

  const telling = useMemo(() => {
    const v = Object.values(merking);
    return {
      kan: v.filter((m) => m === "kan").length,
      maaOeve: v.filter((m) => m === "maa_oeve").length,
      ikke: v.filter((m) => !m).length,
    };
  }, [merking]);

  const gjeldende = runde[indeks];

  function gaaTil(i: number) {
    setSnudd(false);
    if (i >= runde.length) setFerdig(true);
    else setIndeks(Math.max(0, i));
  }

  // Tastaturet (runde 3, bolk 2b): bare mens et kort vises. Lytteren legges
  // på nytt ved hver tegning, så den alltid ser gjeldende kort.
  const viserKort = !ferdig && !!gjeldende;
  useEffect(() => {
    if (!viserKort) return;
    function trykk(e: KeyboardEvent) {
      if (e.defaultPrevented) return;
      const el = document.activeElement as HTMLElement | null;
      const h = tastehandling({
        key: e.key,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
        maal: el ? { tag: el.tagName, rolle: el.getAttribute("role"), redigerbar: el.isContentEditable } : null,
      });
      if (!h) return;
      e.preventDefault();
      if (h === "snu") setSnudd((s) => !s);
      // Som knappene: ingenting før første kort, og → på siste avslutter runden.
      else if (h === "forrige") {
        if (indeks > 0) gaaTil(indeks - 1);
      } else gaaTil(indeks + 1);
    }
    document.addEventListener("keydown", trykk);
    return () => document.removeEventListener("keydown", trykk);
  });

  async function merk(m: Merking) {
    if (!gjeldende) return;
    const forrige = merking[gjeldende.id];
    const ny = forrige === m ? null : m; // trykk igjen for å angre
    setMerking((x) => ({ ...x, [gjeldende.id]: ny }));
    setFeil(null);
    const r = await merkKort(tekstFor(gjeldende), gjeldende.id, ny);
    if (r.feil) {
      setMerking((x) => ({ ...x, [gjeldende.id]: forrige }));
      setFeil(r.feil);
      return;
    }
    if (ny !== null) gaaTil(indeks + 1);
  }

  function nyRunde(m: Modus) {
    const utvalg = m === "alle" ? kort : kort.filter((k) => merking[k.id] === "maa_oeve");
    setModus(m);
    setRunde(utvalg);
    setIndeks(0);
    setSnudd(false);
    setFerdig(false);
  }

  if (ferdig || !gjeldende) {
    return (
      <section role="status" className="rounded-md border border-slate-300 p-6 dark:border-slate-700">
        <h2 className="text-xl font-semibold tracking-tight">Runden er ferdig</h2>
        <p className="mt-2">
          Du har kontroll på {telling.kan} av {kort.length} fagord.
          {telling.maaOeve > 0 && ` ${telling.maaOeve} vil du øve mer på.`}
          {telling.ikke > 0 && ` ${telling.ikke} er ikke merket.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {telling.maaOeve > 0 && (
            <button type="button" onClick={() => nyRunde("maa_oeve")} className={KNAPP_PRIMAER}>
              Øv på de {telling.maaOeve} du vil øve mer på
            </button>
          )}
          <button type="button" onClick={() => nyRunde("alle")} className={KNAPP}>
            Gå gjennom alle igjen
          </button>
        </div>
      </section>
    );
  }

  const m = merking[gjeldende.id];
  const sisteKort = indeks === runde.length - 1;

  return (
    <section aria-label="Øvekort">
      <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-slate-600 dark:text-slate-400">
        <p>
          Kort {indeks + 1} av {runde.length}
          {modus === "maa_oeve" && " — bare de du vil øve mer på"}
        </p>
        <p>
          Har kontroll: {telling.kan} · Må øve: {telling.maaOeve} · Ikke merket: {telling.ikke}
        </p>
      </div>

      {/*
        Kortet. aria-live, så skjermleseren leser baksiden når den snus.

        Knappen har med vilje INGEN aria-label. En slik etikett erstatter
        innholdet for skjermleseren, og da hørte eleven «Snu kortet og se
        forklaringen» — aldri selve fagordet. Funnet av axe-core 16.10.
      */}
      <div className="oevekort-flate">
        <button
          type="button"
          onClick={() => setSnudd((s) => !s)}
          aria-pressed={snudd}
          className="mt-3 block min-h-56 w-full rounded-lg border-2 border-slate-300 bg-white p-6 text-left shadow-sm hover:border-slate-500 dark:border-slate-600 dark:bg-slate-900"
        >
          <div aria-live="polite">
            {!snudd ? (
              <div className="flex min-h-44 flex-col items-center justify-center text-center">
                {gjeldende.tekst && <p className="mb-3 text-base text-dempet">Fra «{gjeldende.tekst.tittel}»</p>}
                <p className="text-3xl font-semibold tracking-tight">{gjeldende.uttrykk}</p>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Hva betyr det? Trykk for å snu.</p>
              </div>
            ) : (
              <div>
                {gjeldende.tekst && <p className="mb-2 text-base text-dempet">Fra «{gjeldende.tekst.tittel}»</p>}
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {gjeldende.uttrykk}
                </p>
                <p className="mt-2 text-lg">{gjeldende.forklaring}</p>
              </div>
            )}
          </div>
        </button>
        {/*
          Design runde 2, bolk 9: merkeknappene står over hverandre, over kortet
          til høyre, der tommelen når dem. `data-hand="venstre"` på <html>
          («Venstrehendt» i Konto) flytter dem til venstre. I DOM-en står de
          ETTER kortet, så Tab og skjermleseren tar kortet først, så merkingen,
          så kilden (når kortet er snudd), så pilknappene. Plasseringen
          over kortet er bare CSS (`order` i .oevekort-flate, globals.css).
          Feilmeldingen fra merkingen står rett etter knappene, og over kortet
          sammen med dem, så den havner ved knappen eleven trykket på.
        */}
        <div role="group" aria-label="Merk kortet" className="oevekort-merk">
          <button type="button" onClick={() => merk("maa_oeve")} aria-pressed={m === "maa_oeve"} className={knapp(m === "maa_oeve")}>
            Må øve mer
          </button>
          <button type="button" onClick={() => merk("kan")} aria-pressed={m === "kan"} className={knapp(m === "kan")}>
            Har kontroll
          </button>
        </div>
        {feil && (
          <div className="oevekort-feil">
            <Feilmelding {...feil} />
          </div>
        )}

        {/*
          FR-16 (endret 11.11): kildeavsnittet ligger i en utfellbar del under
          kortet, ikke på baksiden (telefontest 9.11: kortet ble tungt å lese).
          Kortet er selv en knapp og kan ikke inneholde en annen interaktiv del.
          Den forsvinner når kortet snus tilbake eller eleven går til et annet
          kort, så den er alltid lukket på et nytt kort.
        */}
        {snudd && (
          <div className="mt-3">
            <Kildeavsnitt tekstId={tekstFor(gjeldende)} {...gjeldende.kildeavsnitt} />
          </div>
        )}

        {/*
          Pilene er synlige, navnet er «Forrige kort» / «Neste kort», så
          skjermleseren sier «Neste kort, knapp». Siste kort viser «Ferdig»:
          en pil sier ikke at runden slutter.
        */}
        <div className="oevekort-nav">
          <button type="button" onClick={() => gaaTil(indeks - 1)} disabled={indeks === 0} aria-label="Forrige kort" className={KNAPP}>
            <span aria-hidden="true" className="text-2xl leading-none">←</span>
          </button>
          {/* Samme knapp på alle kort, så fokuset blir stående når den blir «Ferdig». */}
          <button
            type="button"
            onClick={() => gaaTil(indeks + 1)}
            aria-label={sisteKort ? undefined : "Neste kort"}
            className={KNAPP}
          >
            {sisteKort ? "Ferdig" : <span aria-hidden="true" className="text-2xl leading-none">→</span>}
          </button>
        </div>
      </div>
    </section>
  );
}
