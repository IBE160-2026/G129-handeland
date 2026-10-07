"use server";

/**
 * Server actions for Kjerneløypen.
 *
 * Alt som skriver går gjennom denne fila, og hver funksjon starter med
 * `tilgang()`. Det er AD-8: autorisasjonen ligger i datatilgangslaget, og
 * `Tilgang` er en påkrevd parameter som ikke kan utledes fra skjemadata.
 *
 * Merk at en server action IKKE er en egen rute — den er en POST til ruten
 * komponenten brukes i. Derfor kan ingen av disse hvile på at `proxy.ts` har
 * sjekket noe. Det er nøyaktig begrunnelsen i AD-8.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hentBegrepssett, lagreBegrepssett } from "../data/begrepssett";
import { tilgang } from "../data/konto";
import {
  lagreForkunnskapssvar,
  opprettTekst,
  slettTekst,
} from "../data/tilgang";
import { hentFaguttrykk } from "../generatorer/faguttrykk";
import { GeneratorFeil } from "../generatorer/kontrakt";
import { delIAvsnitt } from "../tekst/avsnittsdeling";
import { hentLaast, laasTekst } from "../tekst/las";

/** Formen alle handlingene svarer med ved feil. §5: aldri en blindvei. */
export type Handlingssvar = {
  feil?: { melding: string; handling: string };
};

const INGEN_FEIL: Handlingssvar = {};

/**
 * Oversetter en GeneratorFeil til elevrettet form.
 *
 * Grunnen til at dette er en egen funksjon er at §5-kravet ellers måtte
 * gjentas i hver handling som kaller en generator — og da ville den første
 * som ble glemt gitt eleven en teknisk feilmelding.
 */
function somFeil(e: unknown): Handlingssvar {
  if (e instanceof GeneratorFeil) {
    return { feil: { melding: e.elevmelding, handling: e.anbefaltHandling } };
  }
  return {
    feil: {
      melding: "Noe gikk galt hos oss.",
      handling: "Prøv igjen. Står det ved, er det en feil vi må rette.",
    },
  };
}

/* ------------------------------------------------------------------ *
 * FR-1 — innlesing ved liming
 * ------------------------------------------------------------------ */

export async function limInnTekst(_forrige: Handlingssvar, data: FormData) {
  const tittel = String(data.get("tittel") ?? "").trim();
  const raatekst = String(data.get("tekst") ?? "");

  if (raatekst.trim().length === 0) {
    return {
      feil: {
        melding: "Det var ingen tekst i feltet.",
        handling: "Lim inn teksten du vil jobbe med, og prøv igjen.",
      },
    };
  }

  // Avsnittsdelingen kjøres her bare for å kunne si noe om teksten med én
  // gang. Den LAGRES ikke — AD-9 sier at avsnittslisten fryses ved låsing,
  // ikke ved opprettelse, fordi eleven fortsatt kan endre brødteksten.
  const avsnitt = delIAvsnitt(raatekst);
  if (avsnitt.length === 0) {
    return {
      feil: {
        melding: "Teksten gav ingen avsnitt å jobbe med.",
        handling: "Sjekk at du limte inn hele teksten, og prøv igjen.",
      },
    };
  }

  const ny = await opprettTekst(tilgang(), {
    tittel: tittel.length > 0 ? tittel : (avsnitt[0]?.innhold.slice(0, 80) ?? "Uten tittel"),
    raatekst,
    // Ved liming er råtekst og redigert tekst like til eleven endrer noe.
    redigertTekst: raatekst,
    vei: "liming",
  });

  redirect(`/tekst/${ny.id}/aktivering`);
}

/* ------------------------------------------------------------------ *
 * FR-6 — aktivering
 * ------------------------------------------------------------------ */

export async function lagreAktivering(
  tekstId: string,
  _forrige: Handlingssvar,
  data: FormData,
) {
  const svar = String(data.get("svar") ?? "").trim();

  // FR-6: svaret vurderes ikke og rettes ikke. Men et tomt svar er heller
  // ikke en aktivering, så det blokkeres — med en begrunnelse, ikke bare et
  // avslag.
  if (svar.length === 0) {
    return {
      feil: {
        melding: "Du har ikke skrevet noe ennå.",
        handling:
          "Skriv et par setninger om hva du tror teksten handler om. Det blir ikke vurdert — det er for din egen del.",
      },
    };
  }

  await lagreForkunnskapssvar(tilgang(), tekstId, svar);
  redirect(`/tekst/${tekstId}/gjennomsyn`);
}

/* ------------------------------------------------------------------ *
 * FR-3 fase 3b og AD-9 — gjennomsyn og låsing
 * ------------------------------------------------------------------ */

export async function laasOgGenerer(
  tekstId: string,
  _forrige: Handlingssvar,
  data: FormData,
) {
  const redigert = String(data.get("tekst") ?? "");

  if (redigert.trim().length === 0) {
    return {
      feil: {
        melding: "Teksten er tom.",
        handling: "Lim inn teksten på nytt, eller gå tilbake og start om.",
      },
    };
  }

  const t = tilgang();

  let laast;
  try {
    laast = await laasTekst(t, tekstId, redigert);
  } catch {
    return {
      feil: {
        melding: "Teksten kunne ikke låses.",
        handling:
          "Den er kanskje alt låst. Gå til lesevisningen for å se om den er klar.",
      },
    };
  }

  // Generering skjer rett etter låsing, ikke ved visning. FR-7 sier at
  // kappingen skjer én gang ved uttrekk, slik at Lesevisningen og Øvekortene
  // viser nøyaktig samme sett.
  try {
    const resultat = await hentFaguttrykk(laast.avsnitt);
    await lagreBegrepssett(laast, resultat);
  } catch (e) {
    // Teksten ER låst nå, selv om genereringen feilet. Det er riktig: AD-9
    // går bare framover. Eleven sendes videre til lesevisningen, som tåler
    // et manglende Begrepssett og tilbyr å prøve igjen.
    const svar = somFeil(e);
    revalidatePath(`/tekst/${tekstId}/lesing`);
    return svar;
  }

  redirect(`/tekst/${tekstId}/lesing`);
}

/**
 * Genererer Begrepssettet på nytt for en alt låst Tekst.
 *
 * Finnes fordi låsingen og genereringen kan feile hver for seg: en Tekst kan
 * være låst uten Begrepssett om modellkallet feilet. Uten denne ville eleven
 * sittet med en låst tekst og ingen vei videre, som er en blindvei (§5).
 */
export async function genererPaaNytt(
  tekstId: string,
  _forrige: Handlingssvar,
): Promise<Handlingssvar> {
  const t = tilgang();

  try {
    const alt = await hentBegrepssett(t, tekstId);
    if (alt) {
      // AD-15: høyst ett Begrepssett per Tekst, håndhevet av en unik indeks.
      // Et nytt forsøk ville feilet på indeksen, så det sies i stedet.
      return {
        feil: {
          melding: "Fagordene er alt funnet for denne teksten.",
          handling: "Oppdater siden for å se dem.",
        },
      };
    }

    const laast = await hentLaast(t, tekstId);
    const resultat = await hentFaguttrykk(laast.avsnitt);
    await lagreBegrepssett(laast, resultat);
  } catch (e) {
    return somFeil(e);
  }

  revalidatePath(`/tekst/${tekstId}/lesing`);
  return INGEN_FEIL;
}

/* ------------------------------------------------------------------ *
 * FR-37 — sletting
 * ------------------------------------------------------------------ */

export async function slett(tekstId: string) {
  await slettTekst(tilgang(), tekstId);
  revalidatePath("/");
  redirect("/");
}
