/**
 * Kontosiden — morsmål, utlogging og sletting (FR-24, FR-35, FR-37).
 *
 * FR-37 krever at slettingen navngir hva som forsvinner. Derfor står antallet
 * tekster og e-postadressen her, rett over skjemaet, og ikke bare «kontoen».
 *
 * «Utseende» (bolk 4, EXPERIENCE.md, Gjelder overalt): lys eller mørk modus,
 * eller «Følg enheten». Et vanlig skjema med radioknapper og en server action,
 * så det virker uten JavaScript. Valget gjelder denne enheten.
 *
 * «Venstrehendt» (design runde 2, bolk 9): speiler øvekortene, så «Må øve mer»
 * og «Kan» står til venstre. Lagres som temaet, i en informasjonskapsel på
 * enheten, med en avkrysningsboks i et vanlig skjema.
 */

import Link from "next/link";
import { cookies } from "next/headers";
import { kontoEpost, tilgang } from "../../data/konto";
import { hentMorsmaal } from "../../data/morsmaal";
import { listTekster } from "../../data/tilgang";
import { HAND_KAPSEL, tolkHand } from "../../data/hand";
import { TEMA_KAPSEL, tolkTema, type Tema } from "../../data/tema";
import { velgHandHandling, velgMorsmaalHandling, velgTemaHandling } from "../handlinger";
import { MorsmaalVelger } from "../komponenter/Morsmaal";
import { LagretMelding, LoggUtKnapp, SlettKontoSkjema } from "../komponenter/KontoSkjemaer";

const TEMAVALG: { verdi: Tema | ""; navn: string }[] = [
  { verdi: "", navn: "Følg enheten" },
  { verdi: "lys", navn: "Lys" },
  { verdi: "moerk", navn: "Mørk" },
];

export default async function Konto({ searchParams }: PageProps<"/konto">) {
  const t = await tilgang();
  const [epost, tekster, spraak, kapsler, sp] = await Promise.all([
    kontoEpost(),
    listTekster(t),
    hentMorsmaal(t),
    cookies(),
    searchParams,
  ]);
  const tema = tolkTema(kapsler.get(TEMA_KAPSEL)?.value);
  const venstrehendt = tolkHand(kapsler.get(HAND_KAPSEL)?.value) === "venstre";
  const lagret = sp.lagret === "utseende";
  const lagretHand = sp.lagret === "hand";
  // Ny nøkkel for hver lagring (velgTemaHandling, velgHandHandling), så meldingen kunngjøres hver gang.
  const lagringsnr = typeof sp.n === "string" ? sp.n : "";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10">
      <p>
        <Link href="/" className="underline underline-offset-4">← Til arbeidsbordet</Link>
      </p>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Konto</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Logget inn som {epost}.</p>

      {/* FR-24: valget lagres på kontoen og gjelder til eleven endrer det. */}
      <section className="mt-8">
        <MorsmaalVelger handling={velgMorsmaalHandling} valgt={spraak?.kode ?? null} />
      </section>

      <section className="mt-8">
        {/* Nøkkelen tegner radioknappene på nytt etter lagring, så valget som vises er det som er lagret. */}
        <form key={tema ?? "enhet"} action={velgTemaHandling}>
          <fieldset aria-describedby="tema-hjelp">
            <legend className="font-medium">Utseende</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TEMAVALG.map((v) => (
                <label
                  key={v.navn}
                  className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-slate-500 px-3 has-[:checked]:border-primaer has-[:checked]:ring-1 has-[:checked]:ring-primaer has-[:checked]:font-bold dark:border-slate-400"
                >
                  <input type="radio" name="tema" value={v.verdi} defaultChecked={(tema ?? "") === v.verdi} />
                  {v.navn}
                </label>
              ))}
            </div>
          </fieldset>
          <button
            type="submit"
            className="mt-3 min-h-11 rounded-md border border-slate-500 px-4 py-2 font-bold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            Lagre<span className="sr-only"> utseendet</span>
          </button>
          <p id="tema-hjelp" className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Valget gjelder denne enheten. «Følg enheten» bruker lys eller mørk modus etter innstillingen på
            telefonen eller PC-en.
          </p>
        </form>
        <LagretMelding
          key={lagringsnr}
          tekst={lagret ? `Lagret: ${TEMAVALG.find((v) => v.verdi === (tema ?? ""))?.navn}.` : null}
        />
      </section>

      <section className="mt-8">
        {/* Nøkkelen tegner avkrysningsboksen på nytt etter lagring, så det som vises er det som er lagret. */}
        <form key={venstrehendt ? "venstre" : "hoeyre"} action={velgHandHandling}>
          <fieldset>
            <legend className="font-medium">Øvekortene</legend>
            <label className="mt-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-slate-500 px-3 has-[:checked]:border-primaer has-[:checked]:ring-1 has-[:checked]:ring-primaer has-[:checked]:font-bold dark:border-slate-400">
              <input type="checkbox" name="hand" value="venstre" defaultChecked={venstrehendt} aria-describedby="hand-hjelp" />
              Venstrehendt
            </label>
            <p id="hand-hjelp" className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              «Må øve mer» og «Kan» står til venstre over kortet, så de er lette å nå med venstre tommel. Valget
              gjelder denne enheten.
            </p>
          </fieldset>
          <button
            type="submit"
            className="mt-3 min-h-11 rounded-md border border-slate-500 px-4 py-2 font-bold hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            Lagre<span className="sr-only"> valget for øvekortene</span>
          </button>
        </form>
        <LagretMelding
          key={`hand-${lagringsnr}`}
          tekst={lagretHand ? (venstrehendt ? "Lagret: Venstrehendt." : "Lagret: Ikke venstrehendt.") : null}
        />
      </section>

      <section className="mt-8">
        <LoggUtKnapp />
      </section>

      <p className="mt-8">
        <Link href="/vilkaar" className="underline underline-offset-4">
          Vilkår og personvern
        </Link>
        <span className="text-slate-600 dark:text-slate-400">: hva som lagres, hvor tekstene dine går, og hvem du kontakter.</span>
      </p>

      <section className="mt-12 rounded-md border-2 border-fare p-5">
        <h2 className="text-xl font-semibold tracking-tight">Slett kontoen</h2>
        <p className="mt-2">Dette forsvinner for godt, og kan ikke hentes tilbake:</p>
        <ul className="mt-2 list-disc pl-6">
          <li>kontoen for {epost}</li>
          <li>
            {tekster.length === 1 ? "1 tekst" : `${tekster.length} tekster`}, med alt som hører til:
            fagordene, svarene dine og quizene
          </li>
        </ul>
        <div className="mt-6">
          <SlettKontoSkjema />
        </div>
      </section>
    </main>
  );
}
