"use client";

/**
 * Quizen — FR-13, FR-15 (endret 11.11).
 *
 * To faser:
 *
 *   1. svarer — eleven svarer på alle spørsmålene
 *   2. ferdig — serveren har rettet og lagret; resultatet vises med fasit for
 *               flervalg og eksempelsvar for kortsvar, og eleven krysser av
 *               for om kortsvarene var riktige
 *
 * Før 11.11 lå selvvurderingen i et eget mellomsteg før resultatet
 * (telefontest 9.11). Nå vurderes kortsvarene i resultatet. Et kortsvar teller
 * som ikke riktig til eleven har krysset av «Ja», og hver avkrysning sendes
 * til serveren, som retter hele forsøket på nytt og gir det nye antallet.
 * Flervalgssvarene er levert og kan ikke endres.
 *
 * Fasiten og eksempelsvarene finnes ikke i denne komponenten før fase 2: de
 * kommer fra serveren først når quizen er levert.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { leverQuiz, vurderKortsvar, type Leveringssvar } from "../handlinger";
import { Feilmelding } from "./Feilmelding";

/** Det nettleseren får vite om et spørsmål før levering. Ingen fasit. */
export type SporsmalForElev = {
  id: string;
  nummer: number;
  sporsmal: string;
  erFlervalg: boolean;
  alternativer: string[];
};

type Fase = "svarer" | "ferdig";
type Svar = { valgt?: string; skrevet?: string };

const KNAPP =
  "rounded-md bg-slate-900 px-5 py-2.5 font-medium text-white hover:bg-slate-700 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300";

export function Quiz({
  tekstId,
  sporsmal,
}: {
  tekstId: string;
  sporsmal: SporsmalForElev[];
}) {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>("svarer");
  const [svar, setSvar] = useState<Record<string, Svar>>({});
  const [resultat, setResultat] = useState<Leveringssvar["resultat"]>();
  /** Elevens avkrysning per kortsvar, slik serveren sist bekreftet den. */
  const [vurdering, setVurdering] = useState<Record<string, boolean>>({});
  /**
   * Kortsvaret som lagres nå. Mens én avkrysning lagres, er ALLE låst: to
   * samtidige kall kunne overskrevet hverandre på serveren, og et eldre svar
   * kunne satt antallet.
   */
  const [lagrer, setLagrer] = useState<string | null>(null);
  const [feil, setFeil] = useState<{ melding: string; handling: string } | null>(null);
  const [venter, setVenter] = useState(false);

  const sett = (id: string, endring: Svar) =>
    setSvar((f) => ({ ...f, [id]: { ...f[id], ...endring } }));
  const ubesvarte = sporsmal.filter((s) =>
    s.erFlervalg ? !svar[s.id]?.valgt : !svar[s.id]?.skrevet?.trim(),
  );
  const uvurderte = sporsmal.filter(
    (s) => !s.erFlervalg && svar[s.id]?.skrevet?.trim() && vurdering[s.id] === undefined,
  );

  async function lever() {
    setVenter(true);
    setFeil(null);
    let ut: Leveringssvar;
    try {
      ut = await leverQuiz(
        tekstId,
        sporsmal.map((s) => ({ sporsmalId: s.id, ...svar[s.id] })),
      );
    } catch {
      ut = { feil: { melding: "Svarene kom ikke fram.", handling: "Sjekk nettet og prøv igjen." } };
    }
    setVenter(false);
    if (ut.feil) return setFeil(ut.feil);
    setResultat(ut.resultat);
    setVurdering({});
    setFase("ferdig");
    router.refresh(); // tidligere forsøk på siden oppdateres
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function vurder(sporsmalId: string, riktig: boolean) {
    if (!resultat || lagrer !== null) return;
    const forrige = vurdering[sporsmalId];
    // Avkrysningen vises med én gang; feiler lagringen, settes den tilbake.
    setVurdering((v) => ({ ...v, [sporsmalId]: riktig }));
    setLagrer(sporsmalId);
    setFeil(null);
    let ut: Awaited<ReturnType<typeof vurderKortsvar>>;
    try {
      ut = await vurderKortsvar(tekstId, resultat.forsoekId, sporsmalId, riktig);
    } catch {
      ut = { feil: { melding: "Avkrysningen ble ikke lagret.", handling: "Sjekk nettet og prøv igjen." } };
    }
    setLagrer(null);
    if (ut.feil || ut.antallRiktige === undefined) {
      setVurdering((v) => {
        const neste = { ...v };
        if (forrige === undefined) delete neste[sporsmalId];
        else neste[sporsmalId] = forrige;
        return neste;
      });
      setFeil(ut.feil ?? { melding: "Avkrysningen ble ikke lagret.", handling: "Prøv igjen." });
      return;
    }
    const antallRiktige = ut.antallRiktige;
    setResultat((r) => (r ? { ...r, antallRiktige } : r));
    router.refresh(); // «Tidligere forsøk» viser det nye antallet
  }

  function taPaaNytt() {
    setSvar({});
    setResultat(undefined);
    setVurdering({});
    setFeil(null);
    setFase("svarer");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const resultatFor = (id: string) => resultat?.per.find((p) => p.sporsmalId === id);

  return (
    <div>
      {fase === "ferdig" && resultat && (
        <div role="status" className="mb-8 rounded-md border border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900">
          {/* FR-15: antall riktige av totalt — ingen karakter, ingen prosent. */}
          <p className="text-xl font-semibold">
            Du fikk {resultat.antallRiktige} av {resultat.antallTotalt} riktige.
          </p>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            {uvurderte.length > 0
              ? "Svarene du skrev selv, teller når du har krysset av for at de var riktige. Sammenlign med eksempelsvaret under hvert av dem."
              : "Under hvert spørsmål du ikke fikk til, kan du se hvor i teksten svaret står."}
          </p>
        </div>
      )}

      {feil && <Feilmelding {...feil} />}

      <ol className="space-y-8">
        {sporsmal.map((s) => {
          const r = resultatFor(s.id);
          const laast = fase !== "svarer";
          const skrevet = svar[s.id]?.skrevet?.trim();
          // Kortsvar er riktige først når eleven har krysset av (FR-15).
          const riktig = r ? (s.erFlervalg ? r.riktig : !!skrevet && vurdering[s.id] === true) : false;
          const visMerke = r && (s.erFlervalg || !skrevet || vurdering[s.id] !== undefined);
          return (
            <li key={s.id} className="rounded-md border border-slate-200 p-5 dark:border-slate-800">
              <fieldset>
                <legend className="font-medium">
                  <span className="text-slate-500">{s.nummer}.</span> {s.sporsmal}
                  {visMerke && (
                    <span className={`ml-2 text-sm font-semibold ${riktig ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                      {riktig ? "Riktig" : "Ikke riktig"}
                    </span>
                  )}
                </legend>

                {laast ? (
                  /*
                   * Låst visning: elevens svar med full kontrast. Ikke
                   * `disabled`-felt — de gråtones av nettleseren, og i mørk
                   * modus ble det skrevne svaret nesten usynlig.
                   */
                  s.erFlervalg ? (
                    <ul className="mt-3 space-y-2">
                      {s.alternativer.map((a) => {
                        const valgt = svar[s.id]?.valgt === a;
                        const fasit = r?.riktigSvar === a;
                        return (
                          <li
                            key={a}
                            className={`flex items-start justify-between gap-3 rounded-md border px-3 py-2 ${
                              fasit
                                ? "border-green-600 bg-green-50 dark:border-green-500 dark:bg-green-950/40"
                                : valgt && r
                                  ? "border-red-600 bg-red-50 dark:border-red-500 dark:bg-red-950/40"
                                  : valgt
                                    ? "border-slate-900 bg-slate-100 dark:border-slate-100 dark:bg-slate-800"
                                    : "border-transparent text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            <span className={valgt || fasit ? "font-medium" : ""}>{a}</span>
                            <span className="shrink-0 text-sm font-semibold">
                              {fasit && valgt ? "Ditt svar — riktig" : fasit ? "Riktig svar" : valgt ? "Ditt svar" : ""}
                            </span>
                          </li>
                        );
                      })}
                      {!svar[s.id]?.valgt && (
                        <li className="text-sm text-slate-600 dark:text-slate-400">Du svarte ikke på dette spørsmålet.</li>
                      )}
                    </ul>
                  ) : (
                    <div className="mt-3 rounded-md border border-slate-900 bg-slate-100 p-3 dark:border-slate-100 dark:bg-slate-800">
                      <p className="text-sm font-semibold">Ditt svar</p>
                      <p className="mt-1 whitespace-pre-wrap leading-relaxed">
                        {skrevet || <span className="text-slate-500">(ikke besvart)</span>}
                      </p>
                    </div>
                  )
                ) : s.erFlervalg ? (
                  <div className="mt-3 space-y-2">
                    {s.alternativer.map((a) => (
                      <label key={a} className="flex items-start gap-3">
                        <input
                          type="radio"
                          name={s.id}
                          value={a}
                          checked={svar[s.id]?.valgt === a}
                          onChange={() => sett(s.id, { valgt: a })}
                          className="mt-1.5"
                        />
                        <span>{a}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    aria-label={`Svar på spørsmål ${s.nummer}`}
                    rows={3}
                    value={svar[s.id]?.skrevet ?? ""}
                    onChange={(e) => sett(s.id, { skrevet: e.target.value })}
                    placeholder="Svar med én eller to setninger."
                    className="mt-3 w-full rounded-md border border-slate-300 p-3 leading-relaxed focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900"
                  />
                )}
              </fieldset>

              {/* Kortsvar i resultatet: eksempelsvaret og elevens egen vurdering. */}
              {r && !s.erFlervalg && (
                <div className="mt-4 space-y-3 rounded-md bg-slate-50 p-4 dark:bg-slate-900">
                  <p>
                    <span className="font-medium">Eksempelsvar:</span> {r.riktigSvar}
                  </p>
                  {skrevet ? (
                    <fieldset disabled={lagrer !== null}>
                      <legend className="font-medium">Var svaret ditt riktig?</legend>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Det trenger ikke være likt eksempelsvaret — det viktige er om du fikk med det samme poenget.
                      </p>
                      <div className="mt-2 flex gap-6">
                        {(
                          [
                            [true, "Ja, i hovedsak"],
                            [false, "Nei, ikke helt"],
                          ] as const
                        ).map(([verdi, tekst]) => (
                          <label key={String(verdi)} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`vurdering-${s.id}`}
                              checked={vurdering[s.id] === verdi}
                              onChange={() => vurder(s.id, verdi)}
                            />
                            {tekst}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Du svarte ikke på dette spørsmålet, så det teller som ikke riktig.
                    </p>
                  )}
                  <Kildeavsnitt tekstId={tekstId} {...r.kildeavsnitt} />
                </div>
              )}

              {/* FR-15: feil flervalgssvar viser hvor i teksten svaret står — bak en knapp. */}
              {r && !r.riktig && s.erFlervalg && (
                <div className="mt-4">
                  <Kildeavsnitt tekstId={tekstId} {...r.kildeavsnitt} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {fase === "svarer" && (
          <>
            <button type="button" disabled={venter} onClick={lever} className={KNAPP}>
              {venter ? "Retter…" : "Lever"}
            </button>
            {ubesvarte.length > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {ubesvarte.length === 1 ? "Ett spørsmål" : `${ubesvarte.length} spørsmål`} uten svar teller som ikke riktig.
              </p>
            )}
          </>
        )}
        {fase === "ferdig" && (
          <button type="button" onClick={taPaaNytt} className={KNAPP}>
            Ta quizen på nytt
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Kildeavsnittet, lukket til eleven trykker (telefontest 9.11: åpne avsnitt
 * under hvert feil svar gjorde resultatet uoversiktlig).
 */
function Kildeavsnitt({
  tekstId,
  nummer,
  innhold,
}: {
  tekstId: string;
  nummer: number;
  innhold: string;
}) {
  return (
    <details>
      <summary className="cursor-pointer text-sm font-medium underline underline-offset-4 focus:outline-2 focus:outline-offset-2 focus:outline-slate-900">
        Se hvor det står i teksten
      </summary>
      <div className="mt-2 rounded-md bg-slate-50 p-4 dark:bg-slate-900">
        <blockquote className="border-l-4 border-slate-300 pl-4 text-slate-700 dark:border-slate-600 dark:text-slate-300">
          {innhold}
        </blockquote>
        <Link
          href={`/tekst/${tekstId}/lesing#avsnitt-${nummer}`}
          className="mt-2 inline-block text-sm underline underline-offset-4"
        >
          Les avsnittet i teksten
        </Link>
      </div>
    </details>
  );
}
