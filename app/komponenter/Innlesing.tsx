"use client";

/**
 * Innlesing på forsiden — FR-1 (liming) og FR-2 (PDF).
 *
 * To faner som ender i samme løype. PDF-en leses HER, i nettleseren (AD-16):
 * filen forlater aldri elevens maskin, bare teksten og rapporten om hva
 * uttrekket gjorde sendes til serveren.
 *
 * FR-1: tekst over 8 000 tegn avvises ikke stille. Eleven får se lengden og
 * grensen, og velger å bruke begynnelsen — med kuttpunktet synlig — eller å
 * dele teksten selv. Samme valg for liming og PDF.
 */

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { PdfFeil as PdfFeilKlasse, type PdfFeildetaljer, type PdfFeilkode, type Valg } from "../../opplasting/pdf-feil";
import { trekkUtPdf, type Uttrekk } from "../../opplasting/pdf-les";
import { GRENSER, kuttVedTak } from "../../opplasting/pdf-tekst";
import { hentPdfjs } from "../../opplasting/pdfjs-nettleser";
import type { Handlingssvar } from "../handlinger";
import { Feilmelding } from "./Feilmelding";
import { BildeFeil as BildeFeilKlasse, type BildeFeildetaljer, type BildeFeilkode, type BildeValg } from "../../opplasting/bilde-feil";
import { BILDEGRENSER, krympBilde, lesBilde, sjekkValg } from "../../opplasting/bilde";
import { BildeFeil } from "./BildeFeil";
import { PdfFeil } from "./PdfFeil";

type Handling = (s: Handlingssvar, d: FormData) => Promise<Handlingssvar>;
const TOMT: Handlingssvar = {};
const FELT =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900";
const tall = (n: number) => n.toLocaleString("nb-NO");

function Send({ venter, klar, deaktivert }: { venter: string; klar: string; deaktivert?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || deaktivert}
      className="rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
    >
      {pending ? venter : klar}
    </button>
  );
}

/** §6.2: hvor teksten går, rett over knappen. Behandlingssted per addendum §6. */
function Personvern() {
  return (
    <p className="text-sm text-slate-600 dark:text-slate-400">
      Teksten sendes til Anthropic, som finner fagordene og lager oppgavene med
      en språkmodell. Den kan bli behandlet i USA, Europa, Asia eller Australia,
      og brukes ikke til å trene modeller.
    </p>
  );
}

function Tittel() {
  return (
    <div>
      <label htmlFor="tittel" className="block font-medium">
        Tittel <span className="font-normal text-slate-500">(valgfritt)</span>
      </label>
      <input id="tittel" name="tittel" type="text" placeholder="For eksempel: Naturfag, kapittel 4" className={FELT} />
    </div>
  );
}

/**
 * FR-1: tekst over taket. Valget mellom å bruke begynnelsen og å dele selv,
 * og etter kutt: kuttpunktet, og resten å kopiere med seg.
 */
function Tak({ lengde, kuttet, onKutt }: { lengde: number; kuttet: { slutt: string; rest: string } | null; onKutt: () => void }) {
  const [kopiert, setKopiert] = useState(false);
  if (kuttet) {
    return (
      <div role="status" className="rounded-md border border-sky-400 bg-sky-50 p-4 dark:border-sky-600 dark:bg-sky-950/40">
        <p className="font-medium">Teksten er kuttet ved {tall(GRENSER.maksTegn)} tegn.</p>
        <p className="mt-1 text-sm">Den slutter nå her:</p>
        <p className="mt-1 border-l-4 border-sky-500 pl-3 text-sm italic">… {kuttet.slutt}</p>
        <p className="mt-2 text-sm">
          Resten — {tall(kuttet.rest.length)} tegn — er tatt ut. Vil du lese den også, kan du legge den inn
          som en egen tekst etterpå.
        </p>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(kuttet.rest);
            setKopiert(true);
          }}
          className="mt-3 rounded-md border border-sky-500 px-3 py-1.5 text-sm font-medium hover:bg-sky-100 dark:hover:bg-sky-900"
        >
          {kopiert ? "Resten er kopiert" : "Kopier resten"}
        </button>
      </div>
    );
  }
  return (
    <div role="alert" className="rounded-md border border-amber-400 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950/40">
      <p className="font-medium">
        Teksten er på {tall(lengde)} tegn. Lesevenn tar høyst {tall(GRENSER.maksTegn)}.
      </p>
      <p className="mt-1 text-sm">
        Du kan bruke de første {tall(GRENSER.maksTegn)} tegnene — du ser hvor teksten blir kuttet — eller dele
        teksten i flere og legge dem inn hver for seg.
      </p>
      <button
        type="button"
        onClick={onKutt}
        className="mt-3 rounded-md border border-amber-500 bg-white px-3 py-1.5 text-sm font-medium hover:bg-amber-100 dark:bg-amber-950 dark:hover:bg-amber-900"
      >
        Bruk de første {tall(GRENSER.maksTegn)} tegnene
      </button>
    </div>
  );
}

function kutt(tekst: string) {
  const k = kuttVedTak(tekst);
  return { tekst: k.tekst, slutt: k.tekst.slice(-120), rest: tekst.slice(k.tekst.length).trimStart() };
}

/* ------------------------------------------------------------------ */

type Fane = "lim" | "pdf" | "bilde";

export function Innlesing({ limInn, limInnPdf, limInnBilde }: { limInn: Handling; limInnPdf: Handling; limInnBilde: Handling }) {
  const [fane, setFane] = useState<Fane>("lim");
  return (
    <div>
      <div role="tablist" aria-label="Hvordan vil du legge inn teksten?" className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {(
          [
            ["lim", "Lim inn tekst"],
            ["pdf", "Last opp PDF"],
            ["bilde", "Ta bilder"],
          ] as const
        ).map(([id, navn]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={fane === id}
            onClick={() => setFane(id)}
            className={`-mb-px border-b-2 px-4 py-2 font-medium focus:outline-2 focus:outline-offset-2 ${
              fane === id ? "border-slate-900 dark:border-slate-100" : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            {navn}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {fane === "lim" ? (
          <LimInn handling={limInn} />
        ) : fane === "pdf" ? (
          <Pdf handling={limInnPdf} tilLiming={() => setFane("lim")} tilBilder={() => setFane("bilde")} />
        ) : (
          <Bilder handling={limInnBilde} tilLiming={() => setFane("lim")} />
        )}
      </div>
    </div>
  );
}

function LimInn({ handling }: { handling: Handling }) {
  const [svar, send] = useActionState(handling, TOMT);
  const [tekst, setTekst] = useState("");
  const [kuttet, setKuttet] = useState<{ slutt: string; rest: string } | null>(null);
  const forLang = tekst.length > GRENSER.maksTegn;

  return (
    <form action={send} className="space-y-4">
      {svar.feil && <Feilmelding {...svar.feil} />}
      <Tittel />
      <div>
        <label htmlFor="tekst" className="block font-medium">
          Teksten
        </label>
        <p id="tekst-hjelp" className="mt-1 text-slate-600 dark:text-slate-400">
          Lim inn fagteksten du skal lese. La det stå en blank linje mellom avsnittene — det er slik Lesevenn
          finner overskriftene.
        </p>
        <textarea
          id="tekst"
          name="tekst"
          rows={16}
          required
          value={tekst}
          onChange={(e) => {
            setTekst(e.target.value);
            setKuttet(null);
          }}
          aria-describedby="tekst-hjelp tekst-lengde"
          className="mt-2 w-full rounded-md border border-slate-300 p-3 font-mono text-sm leading-relaxed focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900"
        />
        <p id="tekst-lengde" className={`mt-1 text-right text-sm ${forLang ? "font-medium text-amber-700 dark:text-amber-400" : "text-slate-500"}`}>
          {tall(tekst.length)} av {tall(GRENSER.maksTegn)} tegn
        </p>
      </div>
      {(forLang || kuttet) && (
        <Tak
          lengde={tekst.length}
          kuttet={kuttet}
          onKutt={() => {
            const k = kutt(tekst);
            setTekst(k.tekst);
            setKuttet({ slutt: k.slutt, rest: k.rest });
          }}
        />
      )}
      <Personvern />
      <Send venter="Leser inn…" klar="Begynn" deaktivert={forLang} />
    </form>
  );
}

function Pdf({ handling, tilLiming, tilBilder }: { handling: Handling; tilLiming: () => void; tilBilder: () => void }) {
  const [svar, send] = useActionState(handling, TOMT);
  const filfelt = useRef<HTMLInputElement>(null);
  const [fil, setFil] = useState<File | null>(null);
  const [status, setStatus] = useState<"tom" | "leser" | "ferdig" | "feil">("tom");
  const [uttrekk, setUttrekk] = useState<Uttrekk | null>(null);
  const [tekst, setTekst] = useState("");
  const [kuttet, setKuttet] = useState<{ slutt: string; rest: string } | null>(null);
  const [feil, setFeil] = useState<{ kode: PdfFeilkode; detaljer: PdfFeildetaljer } | null>(null);

  async function les(f: File) {
    setStatus("leser");
    setFeil(null);
    setKuttet(null);
    try {
      const u = await trekkUtPdf({ size: f.size, bytes: async () => new Uint8Array(await f.arrayBuffer()) }, await hentPdfjs());
      setUttrekk(u);
      setTekst(u.raatekst);
      setStatus("ferdig");
    } catch (e) {
      setFeil(e instanceof PdfFeilKlasse ? { kode: e.kode, detaljer: e.detaljer } : { kode: "PF-7", detaljer: {} });
      setStatus("feil");
    }
  }

  function valg(v: Valg) {
    if (v === "lim_inn") tilLiming();
    else if (v === "bilde") tilBilder();
    else if (v === "prov_igjen" && fil) les(fil);
    else if (v === "velg_annen") filfelt.current?.click();
  }

  const forLang = tekst.length > GRENSER.maksTegn;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="pdf" className="block font-medium">
          PDF-fil
        </label>
        <p id="pdf-hjelp" className="mt-1 text-slate-600 dark:text-slate-400">
          Høyst {GRENSER.maksSider} sider og 10 MB. Filen leses på din maskin og sendes ikke noe sted — det er
          bare teksten som går videre.
        </p>
        <input
          ref={filfelt}
          id="pdf"
          type="file"
          accept="application/pdf,.pdf"
          aria-describedby="pdf-hjelp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setFil(f);
            les(f);
          }}
          className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-slate-700 dark:file:bg-slate-100 dark:file:text-slate-900"
        />
      </div>

      {status === "leser" && (
        <p aria-live="polite" className="text-slate-600 dark:text-slate-400">
          Leser PDF-en…
        </p>
      )}

      {status === "feil" && feil && <PdfFeil kode={feil.kode} detaljer={feil.detaljer} bildeTilgjengelig onValg={valg} />}

      {status === "ferdig" && uttrekk && (
        <form action={send} className="space-y-4">
          {svar.feil && <Feilmelding {...svar.feil} />}
          <div role="status" className="rounded-md border border-slate-300 p-4 text-sm dark:border-slate-700">
            <p className="font-medium">Teksten er hentet ut av {fil?.name}.</p>
            <ul className="mt-2 list-disc pl-5">
              <li>{uttrekk.rapport.sider} {uttrekk.rapport.sider === 1 ? "side" : "sider"} lest</li>
              <li>{uttrekk.rapport.fjernedeLinjer.length} linjer fjernet som topp- eller bunntekst</li>
              <li>{uttrekk.rapport.sammenslaatteOrddelinger} orddelinger slått sammen</li>
            </ul>
            <p className="mt-2">Du ser og kan rette hele teksten etter at du har tenkt gjennom overskriftene.</p>
          </div>
          {(forLang || kuttet) && (
            <Tak
              lengde={tekst.length}
              kuttet={kuttet}
              onKutt={() => {
                const k = kutt(tekst);
                setTekst(k.tekst);
                setKuttet({ slutt: k.slutt, rest: k.rest });
              }}
            />
          )}
          <Tittel />
          <input type="hidden" name="raatekst" value={tekst} />
          <input type="hidden" name="rapport" value={JSON.stringify(uttrekk.rapport)} />
          <Personvern />
          <Send venter="Lagrer…" klar="Begynn" deaktivert={forLang} />
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * FR-44 — bilder av boksider
 * ------------------------------------------------------------------ */

type Valgt = { fil: File; url: string };

function Bilder({ handling, tilLiming }: { handling: Handling; tilLiming: () => void }) {
  const [svar, send] = useActionState(handling, TOMT);
  const filfelt = useRef<HTMLInputElement>(null);
  const [bilder, setBilder] = useState<Valgt[]>([]);
  const [status, setStatus] = useState<"velger" | "leser" | "ferdig" | "feil">("velger");
  const [framdrift, setFramdrift] = useState(0);
  const [tekst, setTekst] = useState("");
  const [kuttet, setKuttet] = useState<{ slutt: string; rest: string } | null>(null);
  const [feil, setFeil] = useState<{ kode: BildeFeilkode; detaljer: BildeFeildetaljer } | null>(null);

  // Forhåndsvisningene er lånt minne; gi det tilbake når komponenten går.
  const bilderRef = useRef(bilder);
  useEffect(() => {
    bilderRef.current = bilder;
  }, [bilder]);
  useEffect(() => () => bilderRef.current.forEach((b) => URL.revokeObjectURL(b.url)), []);

  function leggTil(filer: File[]) {
    const f = sjekkValg([...bilder.map((b) => b.fil), ...filer]);
    if (f) {
      setFeil({ kode: f.kode, detaljer: f.detaljer });
      setStatus("feil");
      return;
    }
    setFeil(null);
    setStatus("velger");
    setBilder((x) => [...x, ...filer.map((fil) => ({ fil, url: URL.createObjectURL(fil) }))]);
  }

  function flytt(i: number, retning: -1 | 1) {
    setBilder((x) => {
      const ny = [...x];
      const j = i + retning;
      if (j < 0 || j >= ny.length) return x;
      [ny[i], ny[j]] = [ny[j], ny[i]];
      return ny;
    });
  }

  function fjern(i: number) {
    setBilder((x) => {
      URL.revokeObjectURL(x[i].url);
      return x.filter((_, k) => k !== i);
    });
  }

  async function les() {
    setStatus("leser");
    setFeil(null);
    setKuttet(null);
    const deler: string[] = [];
    try {
      for (let i = 0; i < bilder.length; i++) {
        setFramdrift(i + 1);
        const { data } = await krympBilde(bilder[i].fil, i + 1);
        deler.push(await lesBilde(data, i + 1));
      }
      setTekst(deler.join("\n\n"));
      setStatus("ferdig");
    } catch (e) {
      setFeil(e instanceof BildeFeilKlasse ? { kode: e.kode, detaljer: e.detaljer } : { kode: "BF-5", detaljer: {} });
      setStatus("feil");
    }
  }

  function valg(v: BildeValg) {
    if (v === "lim_inn") tilLiming();
    else if (v === "prov_igjen") les();
    else if (v === "ta_nytt") {
      if (feil?.detaljer.bilde) fjern(feil.detaljer.bilde - 1);
      setFeil(null);
      setStatus("velger");
      filfelt.current?.click();
    } else {
      setFeil(null);
      setStatus("velger");
    }
  }

  const forLang = tekst.length > GRENSER.maksTegn;

  if (status === "ferdig") {
    return (
      <form action={send} className="space-y-4">
        {svar.feil && <Feilmelding {...svar.feil} />}
        {/* FR-45: umålt, og det sies. */}
        <div role="status" className="rounded-md border border-amber-400 bg-amber-50 p-4 text-sm dark:border-amber-600 dark:bg-amber-950/40">
          <p className="font-medium">Teksten er lest ut av {bilder.length === 1 ? "bildet" : `${bilder.length} bilder`}.</p>
          <p className="mt-1">
            Det blir ofte feil når tekst leses fra bilder. Les gjennom teksten ekstra nøye når du får se den, og
            rett det som ikke stemmer.
          </p>
          {tekst.length < GRENSER.minTegnTotalt && (
            // BF-4: lite tekst er ingen stopp — eleven kan skrive inn resten selv.
            <p className="mt-2">
              Det ble bare funnet {tall(tekst.length)} tegn. Du kan skrive inn resten selv når du ser gjennom teksten.
            </p>
          )}
        </div>
        {(forLang || kuttet) && (
          <Tak
            lengde={tekst.length}
            kuttet={kuttet}
            onKutt={() => {
              const k = kutt(tekst);
              setTekst(k.tekst);
              setKuttet({ slutt: k.slutt, rest: k.rest });
            }}
          />
        )}
        <Tittel />
        <input type="hidden" name="raatekst" value={tekst} />
        <Personvern />
        <Send venter="Lagrer…" klar="Begynn" deaktivert={forLang} />
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {/* FR-44: påminnelsen kommer før første opplasting. */}
      <div className="rounded-md border border-slate-300 p-4 text-sm dark:border-slate-700">
        <p className="font-medium">Før du tar bildene</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Ta bare bilde av sidene du skal lese — høyst {BILDEGRENSER.maksBilder}.</li>
          <li>Én side per bilde, rett ovenfra, i godt lys.</li>
          <li>Bildene krympes og sendes for å lese teksten, men lagres ikke. Det er bare teksten som tas vare på.</li>
        </ul>
      </div>

      <div>
        <label htmlFor="bilder" className="block font-medium">
          Bilder av sidene
        </label>
        <input
          ref={filfelt}
          id="bilder"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
          onChange={(e) => {
            const filer = [...(e.target.files ?? [])];
            e.target.value = "";
            if (filer.length) leggTil(filer);
          }}
          className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-slate-700 dark:file:bg-slate-100 dark:file:text-slate-900"
        />
      </div>

      {bilder.length > 0 && (
        <ol className="space-y-2">
          {bilder.map((b, i) => (
            <li key={b.url} className="flex items-center gap-3 rounded-md border border-slate-200 p-2 dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element -- lokal forhåndsvisning, ikke en ressurs fra serveren */}
              <img src={b.url} alt={`Side ${i + 1}`} className="h-16 w-12 rounded object-cover" />
              <span className="flex-1 text-sm">
                Side {i + 1}: {b.fil.name}
              </span>
              <button type="button" onClick={() => flytt(i, -1)} disabled={i === 0} aria-label={`Flytt side ${i + 1} opp`} className="rounded border px-2 py-1 text-sm disabled:opacity-40">
                ↑
              </button>
              <button type="button" onClick={() => flytt(i, 1)} disabled={i === bilder.length - 1} aria-label={`Flytt side ${i + 1} ned`} className="rounded border px-2 py-1 text-sm disabled:opacity-40">
                ↓
              </button>
              <button type="button" onClick={() => fjern(i)} aria-label={`Fjern side ${i + 1}`} className="rounded border px-2 py-1 text-sm">
                Fjern
              </button>
            </li>
          ))}
        </ol>
      )}

      {status === "feil" && feil && <BildeFeil kode={feil.kode} detaljer={feil.detaljer} onValg={valg} />}

      {status === "leser" ? (
        <p aria-live="polite" className="text-slate-600 dark:text-slate-400">
          Leser teksten fra bilde {framdrift} av {bilder.length}… Det tar noen sekunder per bilde.
        </p>
      ) : (
        bilder.length > 0 && (
          <button
            type="button"
            onClick={les}
            className="rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            Les teksten fra {bilder.length === 1 ? "bildet" : `de ${bilder.length} bildene`}
          </button>
        )
      )}
    </div>
  );
}
