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
import { z } from "zod";
import {
  hentQuiz,
  lagreForsoek,
  lagreQuiz,
  rettQuiz,
  type Elevsvar,
} from "../data/quiz";
import {
  avsluttFagsamtale,
  hentFagsamtale,
  lagreNyVurdering,
  lagreSvar as lagreSamtalesvar,
  opprettFagsamtale,
  type Runde,
} from "../data/fagsamtale";
import {
  MAKS_RUNDER,
  startSamtale,
  vurderSvar,
  type TidligereRunde,
} from "../generatorer/fagsamtale";
import { merkOevekort, type Merking } from "../data/oevekort";
import { hentFaguttrykk } from "../generatorer/faguttrykk";
import { genererQuiz } from "../generatorer/quiz";
import { GeneratorFeil, hentPrompt } from "../generatorer/kontrakt";
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

  const ny = await opprettTekst(await tilgang(), {
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

  await lagreForkunnskapssvar(await tilgang(), tekstId, svar);
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

  const t = await tilgang();

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
  const t = await tilgang();

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
 * FR-13 til FR-15 — quiz
 * ------------------------------------------------------------------ */

/**
 * Lager Quizen for en låst Tekst, første gang eleven åpner den.
 *
 * Ved åpning og ikke ved låsing: modellkallet tar flere sekunder, og eleven
 * som bare vil lese skal ikke vente på en quiz hun kanskje ikke tar. Quizen
 * lagres og gjenbrukes etterpå (FR-13), så kallet skjer én gang per Tekst.
 */
export async function lagQuiz(
  tekstId: string,
  _forrige: Handlingssvar,
): Promise<Handlingssvar> {
  const t = await tilgang();
  try {
    if (!(await hentQuiz(t, tekstId))) {
      const laast = await hentLaast(t, tekstId);
      const resultat = await genererQuiz(laast.avsnitt);
      await lagreQuiz(laast, resultat);
    }
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/quiz`);
  return INGEN_FEIL;
}

export type Eksempelsvar = {
  sporsmalId: string;
  eksempelsvar: string;
  kildeavsnitt: { nummer: number; innhold: string };
};

/**
 * Eksempelsvarene til kortsvarsspørsmålene, for selvvurderingen.
 *
 * Gir BARE kortsvarene. Fasiten til flervalgsspørsmålene sendes aldri til
 * nettleseren før quizen er levert — ellers kunne den leses i nettleserens
 * utviklerverktøy, og forsøkene i FR-15 ville ikke sagt noe.
 */
export async function hentEksempelsvar(tekstId: string): Promise<Eksempelsvar[]> {
  const t = await tilgang();
  const q = await hentQuiz(t, tekstId);
  if (!q) return [];
  return q.sporsmal
    .filter((s) => !s.erFlervalg)
    .map((s) => ({
      sporsmalId: s.id,
      eksempelsvar: s.riktigSvar,
      kildeavsnitt: s.kildeavsnitt,
    }));
}

/** Det nettleseren sender. Valideres, fordi alt fra nettleseren kan være laget for hånd. */
const ElevsvarSkjema = z
  .array(
    z.object({
      sporsmalId: z.string().uuid(),
      valgt: z.string().max(2000).optional(),
      skrevet: z.string().max(5000).optional(),
      selvvurdertRiktig: z.boolean().optional(),
    }),
  )
  .max(20);

export type Leveringssvar = Handlingssvar & {
  resultat?: {
    antallRiktige: number;
    antallTotalt: number;
    per: {
      sporsmalId: string;
      riktig: boolean;
      riktigSvar: string;
      kildeavsnitt: { nummer: number; innhold: string };
    }[];
  };
};

/**
 * Retter og lagrer et forsøk (FR-15). Rettingen skjer HER, på serveren, mot
 * fasiten i databasen — nettleseren sender bare hva eleven svarte.
 */
export async function leverQuiz(
  tekstId: string,
  svar: unknown,
): Promise<Leveringssvar> {
  const t = await tilgang();
  const tolket = ElevsvarSkjema.safeParse(svar);
  if (!tolket.success) {
    return {
      feil: {
        melding: "Svarene kom ikke fram i riktig form.",
        handling: "Last siden på nytt og prøv igjen.",
      },
    };
  }

  try {
    const q = await hentQuiz(t, tekstId);
    if (!q) {
      return {
        feil: {
          melding: "Fant ikke quizen.",
          handling: "Gå tilbake til teksten og åpne quizen på nytt.",
        },
      };
    }
    const elevsvar: Elevsvar[] = tolket.data;
    const retting = rettQuiz(q.sporsmal, elevsvar);
    await lagreForsoek(t, tekstId, elevsvar, retting);

    revalidatePath(`/tekst/${tekstId}/quiz`);
    return {
      resultat: {
        antallRiktige: retting.antallRiktige,
        antallTotalt: retting.antallTotalt,
        per: q.sporsmal.map((s) => ({
          sporsmalId: s.id,
          riktig: retting.per.find((p) => p.sporsmalId === s.id)?.riktig ?? false,
          riktigSvar: s.riktigSvar,
          kildeavsnitt: s.kildeavsnitt,
        })),
      },
    };
  } catch (e) {
    return somFeil(e);
  }
}

/* ------------------------------------------------------------------ *
 * FR-17 — øvekort
 * ------------------------------------------------------------------ */

/** Lagrer elevens merking av ett øvekort, slik at neste økt starter der denne sluttet. */
export async function merkKort(
  tekstId: string,
  begrepId: string,
  merking: Merking | null,
): Promise<Handlingssvar> {
  const t = await tilgang();
  if (merking !== null && merking !== "kan" && merking !== "maa_oeve") {
    return { feil: { melding: "Merkingen kom ikke fram riktig.", handling: "Last siden på nytt og prøv igjen." } };
  }
  try {
    await merkOevekort(t, tekstId, begrepId, merking);
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/oppgaver`);
  return INGEN_FEIL;
}

/* ------------------------------------------------------------------ *
 * FR-18 til FR-23 — fagsamtale
 * ------------------------------------------------------------------ */

/** FR-18: starter en ny samtale om en låst Tekst, og sender eleven dit. */
export async function startFagsamtale(
  tekstId: string,
  _forrige: Handlingssvar,
): Promise<Handlingssvar> {
  const t = await tilgang();
  let samtaleId: string;
  try {
    const laast = await hentLaast(t, tekstId);
    const start = await startSamtale(laast.avsnitt);
    // AD-4: samtalen bruker to prompter, og begge stemples. Vurderingens
    // versjon er den som er gjeldende når samtalen starter.
    const vurdering = await hentPrompt("svarvurdering");
    samtaleId = await opprettFagsamtale(laast, {
      ...start,
      promptversjon: `samtalestart ${start.promptversjon}, svarvurdering ${vurdering.versjon}`,
    });
  } catch (e) {
    return somFeil(e);
  }
  redirect(`/tekst/${tekstId}/samtale/${samtaleId}`);
}

/** De besvarte rundene før en gitt runde, i formen generatoren tar. */
function tidligereRunder(runder: Runde[], foer: number): TidligereRunde[] {
  return runder
    .filter((r) => r.nummer < foer && r.elevsvar !== null && r.svarvurdering !== null)
    .map((r) => ({
      nummer: r.nummer,
      sporsmal: r.sporsmal,
      kildeavsnittNummer: r.kildeavsnitt.nummer,
      elevsvar: r.elevsvar!,
      tilstand: r.svarvurdering!,
      begrunnelse: r.vurderingsbegrunnelse ?? "",
    }));
}

/** Øvre grense for et svar. Et svar i en fagsamtale er et par setninger. */
const MAKS_SVARLENGDE = 3000;

/** FR-19, FR-20: vurderer elevens svar og legger til neste spørsmål. */
export async function svarISamtale(
  samtaleId: string,
  nummer: number,
  _forrige: Handlingssvar,
  data: FormData,
): Promise<Handlingssvar> {
  const t = await tilgang();
  const svar = String(data.get("svar") ?? "").trim();
  if (svar.length === 0) {
    return {
      feil: {
        melding: "Du har ikke skrevet noe ennå.",
        handling:
          "Skriv svaret med egne ord. Vet du ikke, kan du skrive det — da får du et enklere spørsmål.",
      },
    };
  }
  if (svar.length > MAKS_SVARLENGDE) {
    return {
      feil: {
        melding: `Svaret er lengre enn ${MAKS_SVARLENGDE} tegn.`,
        handling: "Prøv å si det kortere — et par setninger holder.",
      },
    };
  }

  let tekstId: string;
  try {
    const s = await hentFagsamtale(t, samtaleId);
    tekstId = s.tekstId;
    if (s.avsluttet) {
      return { feil: { melding: "Samtalen er avsluttet.", handling: "Start en ny samtale fra oppgavesiden." } };
    }
    const runde = s.runder.find((r) => r.nummer === nummer && r.elevsvar === null);
    if (!runde) {
      return { feil: { melding: "Dette spørsmålet er alt besvart.", handling: "Last siden på nytt." } };
    }
    const laast = await hentLaast(t, s.tekstId);
    const v = await vurderSvar({
      avsnitt: laast.avsnitt,
      tidligere: tidligereRunder(s.runder, nummer),
      gjeldende: { sporsmal: runde.sporsmal, kildeavsnittNummer: runde.kildeavsnitt.nummer },
      elevsvar: svar,
      sisteRunde: nummer >= MAKS_RUNDER,
    });
    await lagreSamtalesvar(t, samtaleId, nummer, svar, v, v.oppfolging);
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/samtale/${samtaleId}`);
  return INGEN_FEIL;
}

/**
 * FR-22: «jeg tror du misforsto svaret mitt». Én gang per runde: knappen er
 * en mulighet til å bli lest på nytt, ikke en måte å be om ny vurdering til
 * den blir den eleven vil ha.
 */
export async function revurderRunde(samtaleId: string, nummer: number): Promise<Handlingssvar> {
  const t = await tilgang();
  let tekstId: string;
  try {
    const s = await hentFagsamtale(t, samtaleId);
    tekstId = s.tekstId;
    const runde = s.runder.find((r) => r.nummer === nummer);
    if (!runde || runde.elevsvar === null) {
      return { feil: { melding: "Denne runden har ikke noe svar å vurdere.", handling: "Last siden på nytt." } };
    }
    if (runde.revurdert) {
      return {
        feil: {
          melding: "Denne runden er alt vurdert på nytt.",
          handling: "Les avsnittet det lenkes til, og se om teksten sier noe annet enn du tenkte.",
        },
      };
    }
    const laast = await hentLaast(t, s.tekstId);
    const v = await vurderSvar({
      avsnitt: laast.avsnitt,
      tidligere: tidligereRunder(s.runder, nummer),
      gjeldende: { sporsmal: runde.sporsmal, kildeavsnittNummer: runde.kildeavsnitt.nummer },
      elevsvar: runde.elevsvar,
      sisteRunde: nummer >= MAKS_RUNDER,
      nyVurdering: true,
    });
    await lagreNyVurdering(t, samtaleId, nummer, v, v.oppfolging);
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/samtale/${samtaleId}`);
  return INGEN_FEIL;
}

/** FR-22: eleven avslutter selv. */
export async function avsluttSamtale(samtaleId: string): Promise<Handlingssvar> {
  const t = await tilgang();
  let tekstId: string;
  try {
    const s = await hentFagsamtale(t, samtaleId);
    tekstId = s.tekstId;
    await avsluttFagsamtale(t, samtaleId);
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/samtale/${samtaleId}`);
  return INGEN_FEIL;
}

/* ------------------------------------------------------------------ *
 * FR-37 — sletting
 * ------------------------------------------------------------------ */

/**
 * Sletter én Tekst og alt generert innhold knyttet til den.
 *
 * Svarer med om det gikk, framfor å omdirigere: knappen som kaller den
 * (SlettTekstKnapp) må kunne vise en feil, og en omdirigering inne i en
 * try/catch i nettleseren er ikke noe den skal måtte skille fra en feil.
 */
export async function slett(tekstId: string): Promise<{ slettet: boolean }> {
  const t = await tilgang();
  try {
    await slettTekst(t, tekstId);
  } catch {
    return { slettet: false };
  }
  revalidatePath("/");
  return { slettet: true };
}
