/**
 * Gjennomsynet — FR-3 fase 3b, og låsepunktet i AD-9.
 *
 * Dette er det siste steget der teksten kan endres. Etter låsing peker alt
 * generert innhold på avsnittsnumrene slik de står nå (AD-2), så en endring
 * etterpå ville gjort kildeavsnittene gale uten at noe sa fra.
 *
 * Steget finnes selv når teksten kom inn ved liming og ikke kan ha
 * uthentingsfeil. Grunnen er at det er sikkerhetsnettet for PDF og bilde
 * (FR-4, FR-45), og at én løype gjennom samme steg er enklere å stole på enn
 * to løyper der den ene hopper over kontrollen.
 */

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { innloggingKlar, tilgang } from "../../../../data/konto";
import { IkkeFunnet, hentTekst } from "../../../../data/tilgang";
import { delIAvsnitt } from "../../../../tekst/avsnittsdeling";
import { laasOgGenerer } from "../../../handlinger";
import { GjennomsynSkjema } from "../../../komponenter/Skjemaer";
import { IkkeKlar } from "../../../komponenter/IkkeKlar";

export default async function Gjennomsyn({
  params,
}: PageProps<"/tekst/[id]/gjennomsyn">) {
  // FR-35: ingen datatilgang uten noe som kan gi en Tilgang. Se konto.ts.
  if (!innloggingKlar()) return <IkkeKlar />;

  const { id } = await params;

  let tekst;
  try {
    tekst = await hentTekst(tilgang(), id);
  } catch (e) {
    if (e instanceof IkkeFunnet) notFound();
    throw e;
  }

  // AD-9 går bare framover. Er teksten alt låst, hører eleven i lesevisningen
  // — og å vise et redigeringsfelt som ikke kan lagres ville vært en blindvei.
  if (tekst.tilstand === "laast") redirect(`/tekst/${id}/lesing`);
  if (tekst.tilstand === "innlest") redirect(`/tekst/${id}/aktivering`);

  const avsnitt = delIAvsnitt(tekst.redigertTekst);
  const antallOverskrifter = avsnitt.filter((a) => a.erOverskrift).length;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Steg 2 av 3 — se gjennom
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {tekst.tittel}
      </h1>

      {/*
        Tallene vises fordi de er den billigste måten eleven kan se at delingen
        ble som ventet. Står det «1 avsnitt» på en lang tekst, mangler de blanke
        linjene — og det er lettere å rette her enn å oppdage etterpå at alle
        fagordene peker på avsnitt 1.
      */}
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        Lesevenn leser dette som <strong>{avsnitt.length} avsnitt</strong>, der{" "}
        <strong>{antallOverskrifter}</strong> er overskrifter.
      </p>

      <section className="mt-8">
        <GjennomsynSkjema
          handling={laasOgGenerer.bind(null, id)}
          tekst={tekst.redigertTekst}
        />
      </section>

      <p className="mt-10 text-sm">
        <Link
          href={`/tekst/${id}/aktivering`}
          className="underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900 dark:hover:decoration-slate-100"
        >
          Tilbake
        </Link>
      </p>
    </main>
  );
}
