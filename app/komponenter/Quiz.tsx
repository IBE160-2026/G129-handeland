"use client";

/**
 * Quizen — FR-13, FR-15.
 *
 * Tre faser:
 *
 *   1. svarer   — eleven svarer på alle spørsmålene
 *   2. vurderer — flervalgssvarene låses, eksempelsvarene til kortsvarene
 *                 vises, og eleven vurderer sine egne kortsvar
 *   3. ferdig   — serveren har rettet og lagret; resultatet vises
 *
 * Flervalgssvarene låses i fase 2 fordi eleven der får se noe fra teksten.
 * Uten låsen kunne hun endret et flervalgssvar etter å ha lest
 * eksempelsvaret, og forsøkene ville ikke vist utviklingen (FR-15).
 *
 * Fasiten til flervalg finnes ikke i denne komponenten før fase 3: den kommer
 * fra serveren først når quizen er levert.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  hentEksempelsvar,
  leverQuiz,
  type Eksempelsvar,
  type Leveringssvar,
} from "../handlinger";
import { Feilmelding } from "./Feilmelding";

/** Det nettleseren får vite om et spørsmål før levering. Ingen fasit. */
export type SporsmalForElev = {
  id: string;
  nummer: number;
  sporsmal: string;
  erFlervalg: boolean;
  alternativer: string[];
};

type Fase = "svarer" | "vurderer" | "ferdig";
type Svar = { valgt?: string; skrevet?: string; selvvurdertRiktig?: boolean };

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
  const [eksempler, setEksempler] = useState<Eksempelsvar[]>([]);
  const [resultat, setResultat] = useState<Leveringssvar["resultat"]>();
  const [feil, setFeil] = useState<{ melding: string; handling: string } | null>(null);
  const [venter, setVenter] = useState(false);

  const harKortsvar = sporsmal.some((s) => !s.erFlervalg);
  const sett = (id: string, endring: Svar) =>
    setSvar((f) => ({ ...f, [id]: { ...f[id], ...endring } }));
  const ubesvarte = sporsmal.filter((s) =>
    s.erFlervalg ? !svar[s.id]?.valgt : !svar[s.id]?.skrevet?.trim(),
  );

  async function visEksempelsvar() {
    setVenter(true);
    setFeil(null);
    try {
      setEksempler(await hentEksempelsvar(tekstId));
      setFase("vurderer");
    } catch {
      setFeil({ melding: "Fikk ikke hentet eksempelsvarene.", handling: "Prøv igjen." });
    }
    setVenter(false);
  }

  async function lever() {
    // Et tomt kortsvar kan ikke vurderes som riktig; det teller som feil.
    const mangler = sporsmal.filter(
      (s) => !s.erFlervalg && svar[s.id]?.skrevet?.trim() && svar[s.id]?.selvvurdertRiktig === undefined,
    );
    if (mangler.length > 0) {
      setFeil({
        melding: `Du har ikke vurdert svaret ditt på spørsmål ${mangler.map((s) => s.nummer).join(" og ")}.`,
        handling: "Sammenlign med eksempelsvaret, og kryss av om svaret ditt var riktig.",
      });
      return;
    }
    setVenter(true);
    setFeil(null);
    const ut = await leverQuiz(
      tekstId,
      sporsmal.map((s) => ({ sporsmalId: s.id, ...svar[s.id] })),
    );
    setVenter(false);
    if (ut.feil) return setFeil(ut.feil);
    setResultat(ut.resultat);
    setFase("ferdig");
    router.refresh(); // tidligere forsøk på siden oppdateres
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function taPaaNytt() {
    setSvar({});
    setEksempler([]);
    setResultat(undefined);
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
            Under ser du hvor i teksten svaret står for spørsmålene du ikke fikk til.
          </p>
        </div>
      )}

      {feil && <Feilmelding {...feil} />}

      <ol className="space-y-8">
        {sporsmal.map((s) => {
          const r = resultatFor(s.id);
          const eksempel = eksempler.find((e) => e.sporsmalId === s.id);
          const laast = fase !== "svarer";
          return (
            <li key={s.id} className="rounded-md border border-slate-200 p-5 dark:border-slate-800">
              <fieldset disabled={laast && s.erFlervalg}>
                <legend className="font-medium">
                  <span className="text-slate-500">{s.nummer}.</span> {s.sporsmal}
                  {r && (
                    <span className={`ml-2 text-sm font-semibold ${r.riktig ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                      {r.riktig ? "Riktig" : "Ikke riktig"}
                    </span>
                  )}
                </legend>

                {s.erFlervalg ? (
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
                    readOnly={laast}
                    value={svar[s.id]?.skrevet ?? ""}
                    onChange={(e) => sett(s.id, { skrevet: e.target.value })}
                    placeholder="Svar med én eller to setninger."
                    className="mt-3 w-full rounded-md border border-slate-300 p-3 leading-relaxed read-only:bg-slate-50 focus:outline-2 focus:outline-offset-1 focus:outline-slate-900 dark:border-slate-700 dark:bg-slate-900"
                  />
                )}
              </fieldset>

              {/* Fase 2: selvvurdering av kortsvar. */}
              {!s.erFlervalg && eksempel && (
                <div className="mt-4 space-y-3 rounded-md bg-slate-50 p-4 dark:bg-slate-900">
                  <p>
                    <span className="font-medium">Eksempelsvar:</span> {eksempel.eksempelsvar}
                  </p>
                  <Kildeavsnitt tekstId={tekstId} {...eksempel.kildeavsnitt} />
                  {fase === "vurderer" &&
                    (svar[s.id]?.skrevet?.trim() ? (
                      <fieldset>
                        <legend className="font-medium">Var svaret ditt riktig?</legend>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Det trenger ikke være likt eksempelsvaret — det viktige er om du fikk med det samme poenget.
                        </p>
                        <div className="mt-2 flex gap-6">
                          {[
                            [true, "Ja, i hovedsak"],
                            [false, "Nei, ikke helt"],
                          ].map(([verdi, tekst]) => (
                            <label key={String(verdi)} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`vurdering-${s.id}`}
                                checked={svar[s.id]?.selvvurdertRiktig === verdi}
                                onChange={() => sett(s.id, { selvvurdertRiktig: verdi as boolean })}
                              />
                              {tekst as string}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Du svarte ikke på dette spørsmålet, så det teller som ikke riktig.
                      </p>
                    ))}
                </div>
              )}

              {/* Fase 3: FR-15 — feil svar viser hvor i teksten svaret står. */}
              {r && !r.riktig && s.erFlervalg && (
                <div className="mt-4 space-y-3 rounded-md bg-slate-50 p-4 dark:bg-slate-900">
                  <p>
                    <span className="font-medium">Riktig svar:</span> {r.riktigSvar}
                  </p>
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
            <button
              type="button"
              disabled={venter}
              onClick={harKortsvar ? visEksempelsvar : lever}
              className={KNAPP}
            >
              {venter ? "Et øyeblikk…" : harKortsvar ? "Se eksempelsvar og vurder deg selv" : "Lever"}
            </button>
            {ubesvarte.length > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {ubesvarte.length === 1 ? "Ett spørsmål" : `${ubesvarte.length} spørsmål`} uten svar teller som ikke riktig.
              </p>
            )}
          </>
        )}
        {fase === "vurderer" && (
          <button type="button" disabled={venter} onClick={lever} className={KNAPP}>
            {venter ? "Retter…" : "Lever"}
          </button>
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
    <div>
      <p className="text-sm font-medium">Her står det i teksten:</p>
      <blockquote className="mt-1 border-l-4 border-slate-300 pl-4 text-slate-700 dark:border-slate-600 dark:text-slate-300">
        {innhold}
      </blockquote>
      <Link
        href={`/tekst/${tekstId}/lesing#avsnitt-${nummer}`}
        className="mt-2 inline-block text-sm underline underline-offset-4"
      >
        Les avsnittet i teksten
      </Link>
    </div>
  );
}
