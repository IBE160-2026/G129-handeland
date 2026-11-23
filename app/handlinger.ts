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
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hentBegrepssett, lagreBegrepssett } from "../data/begrepssett";
import { tilgang } from "../data/konto";
import { FAGORDFEIL, FEIL, FEILKODE } from "./feiladresse";
import {
  IkkeFunnet,
  godkjennOverskrifter,
  hentAvsnitt,
  lagreEtiketter,
  hentTekst,
  lagreForkunnskapssvar,
  opprettTekst,
  slettTekst,
  type Tilgang,
} from "../data/tilgang";
import { z } from "zod";
import {
  hentQuiz,
  lagreForsoek,
  lagreQuiz,
  oppdaterSelvvurdering,
  rettQuiz,
  tilElevsvar,
  UgyldigVurdering,
} from "../data/quiz";
import {
  avsluttFagsamtale,
  hentFagsamtale,
  lagreElevsvar,
  lagreNesteSporsmal,
  lagreNyVurdering,
  lagreVurdering,
  opprettFagsamtale,
  type LagretFagsamtale,
  type Runde,
} from "../data/fagsamtale";
import {
  MAKS_RUNDER,
  startSamtale,
  vurderSvar,
  type TidligereRunde,
} from "../generatorer/fagsamtale";
import { merkOevekort, type Merking } from "../data/oevekort";
import {
  fjernTekst,
  giNyttNavn,
  hentMappequiz,
  lagreMappeforsoek,
  leggTilTekst,
  MAPPEGRENSER,
  MappeAvvist,
  oppdaterMappeSelvvurdering,
  opprettMappe,
  slettMappe,
  SPORSMAL_PER_TEKST,
  tolkLengde,
} from "../data/mapper";
import { hentFaguttrykk } from "../generatorer/faguttrykk";
import { genererQuiz } from "../generatorer/quiz";
import { hentPrompt } from "../generatorer/kontrakt";
import { KI_FEIL, feilkodeFor, kiFeil, somFeil, type Feiltekst } from "./kifeil";
import { samtalegrenseNaadd, underTaket } from "../data/forbruk";
import { GrenseNaadd } from "../data/grenser";
import { GRENSER } from "../opplasting/pdf-tekst";
import { delIAvsnitt, overskrifter } from "../tekst/avsnittsdeling";
import { lesLurerPaa, lesMerking } from "../tekst/forkunnskap";
import { hentLaast, laasTekst } from "../tekst/las";
import {
  hentMorsmaal,
  hentOppsummering,
  hentOversettelse,
  hentUtpeking,
  kildeHash,
  lagreOppsummering,
  lagreOversettelse,
  lagreUtpeking,
  velgMorsmaal,
  type Oversettelsestype,
} from "../data/morsmaal";
import { oppsummer, oversett, pekUt, type Element } from "../generatorer/morsmaal";
import {
  begrepElementer,
  oppsummeringElementer,
  overskriftElementer,
  utpekingElementer,
} from "../morsmaal/elementer";
import { finnSpraak } from "../morsmaal/spraak";
import { byttOverskrifter, overskriftsfeil, overskriftsplasser, settInnEtiketter } from "../tekst/overskrifter";
import { lagEtiketter } from "../generatorer/etiketter";
import { foreslaaTittel } from "../tekst/tittel";
import { lagreMinnevers } from "../data/minnevers";
import { harSjekketForstaaelsen } from "../data/sjekket";
import { lagreLeseinnstillinger } from "../data/leseinnstillinger";
import { tolkInnstillinger } from "../tekst/leseinnstillinger";
import { TEMA_KAPSEL, TEMA_LEVETID, tolkTema } from "../data/tema";
import { HAND_KAPSEL, HAND_LEVETID, tolkHand } from "../data/hand";
import { lagMinnevers, type Versform } from "../generatorer/minnevers";

/** Formen alle handlingene svarer med ved feil. §5: aldri en blindvei. */
export type Handlingssvar = {
  /** `grense`: en bruksgrense er nådd (PRD §6.4), og «Prøv igjen» vises ikke. */
  feil?: Feiltekst;
};

const INGEN_FEIL: Handlingssvar = {};

// `somFeil` og `kiFeil` (meldingene per funksjon, PRD §5) står i `kifeil.ts`,
// fordi en fil med "use server" bare kan eksportere async-funksjoner.
//
// PRD §6.4, bruksgrensene: hvert KI-kall går gjennom `underTaket`
// (data/forbruk.ts), som stopper før modellen kalles når dagstaket er nådd,
// og registrerer tokenbruken etterpå, også når kallet feilet. Stoppet gir
// `GrenseNaadd`, som `somFeil` og `kiFeil` gjør om til takmeldingen.
// Grensen på 5 Tekster sjekkes i `opprettTekst`, og grensen på 5
// Fagsamtaler i `startFagsamtale` før første spørsmål lages.

/** `opprettTekst` med grensen på 5 Tekster per døgn (PRD §6.4) som svar framfor kast. */
async function opprettEllerGrense(
  t: Tilgang,
  ny: Parameters<typeof opprettTekst>[1],
): Promise<{ ny: { id: string }; svar?: undefined } | { ny?: undefined; svar: Handlingssvar }> {
  try {
    return { ny: await opprettTekst(t, ny) };
  } catch (e) {
    if (e instanceof GrenseNaadd) return { svar: somFeil(e) };
    throw e;
  }
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

  // FR-1: under 400 tegn er for lite til overskrifter, Begrepssett og Quiz.
  // Antallet som mangler oppgis, så eleven vet hvor mye mer som trengs.
  const lengde = raatekst.trim().length;
  if (lengde < GRENSER.minTegnTotalt) {
    return {
      feil: {
        melding: `Teksten er for kort: ${lengde} tegn. LeseBuddy trenger minst ${GRENSER.minTegnTotalt}, så det mangler ${GRENSER.minTegnTotalt - lengde}.`,
        handling: "Lim inn mer av teksten — gjerne hele delkapittelet. Overskrifter, fagord og quiz trenger nok tekst å bygge på.",
      },
    };
  }

  // FR-1: grensen håndheves her også, ikke bare i skjemaet. Skjemaet gir
  // eleven valget (bruk begynnelsen eller del opp); dette er vernet om
  // skjemaet blir gått forbi.
  const forLang = sjekkTak(raatekst);
  if (forLang) return forLang;

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

  const { ny, svar } = await opprettEllerGrense(await tilgang(), {
    tittel: tittel.length > 0 ? tittel : foreslaaTittel(avsnitt),
    raatekst,
    // Ved liming er råtekst og redigert tekst like til eleven endrer noe.
    redigertTekst: raatekst,
    vei: "liming",
  });
  if (!ny) return svar;

  redirect(`/tekst/${ny.id}/overskrifter`);
}

/* ------------------------------------------------------------------ *
 * FR-6 — aktivering
 * ------------------------------------------------------------------ */

export async function lagreAktivering(
  tekstId: string,
  _forrige: Handlingssvar,
  data: FormData,
) {
  // FR-6 (endret 17.11): spørsmålet kappes her også, ikke bare i feltet.
  const lurerPaa = lesLurerPaa(data.get("lurerPaa"));
  const t = await tilgang();

  // FR-3: fase 3a kan ikke hoppes over — heller ikke ved å sende skjemaet
  // uten å gå via siden.
  let rad;
  try {
    rad = await hentTekst(t, tekstId);
  } catch (e) {
    if (e instanceof IkkeFunnet) return somFeil(e);
    throw e;
  }
  if (rad.tilstand === "innlest" && rad.overskrifterGodkjent === null) redirect(`/tekst/${tekstId}/overskrifter`);
  // Et skjema sendt på nytt (tilbakeknappen, to faner) etter at svaret alt er
  // lagret: send videre i stedet for å feile i lagreForkunnskapssvar.
  if (rad.tilstand === "laast") redirect(`/tekst/${tekstId}/lesing`);
  // Innlimt tekst i `aktivert`: svaret er lagret, men låsingen feilet. Den
  // går ikke til gjennomsynet (FR-3), men låses på nytt her.
  const nyttLaaseforsoek = rad.tilstand === "aktivert" && rad.vei === "liming";
  if (rad.tilstand === "aktivert" && !nyttLaaseforsoek) redirect(`/tekst/${tekstId}/gjennomsyn`);

  // FR-6 (endret 17.11): merket per overskrift. Overskriftene regnes ut her
  // fra den lagrede teksten (AD-12), ikke fra skjemaet, så klienten sender
  // bare et merke per nummer. Ukjente nummer og verdier forkastes stille.
  const titler = overskrifter(delIAvsnitt(rad.redigertTekst));
  const merking = lesMerking(data, titler);

  // FR-6: ingenting vurderes og rettes. Et tomt skjema får ÉN oppfordring;
  // sender eleven tomt igjen, slipper hun videre. Steget skal ikke bli en
  // sperre for den som synes dette er vanskelig. (Før 17.10 ble tomt svar
  // stoppet for godt — et avvik fra FR-6.)
  if (
    !nyttLaaseforsoek &&
    merking.length === 0 &&
    lurerPaa.length === 0 &&
    data.get("tomtEtterOppfordring") !== "1"
  ) {
    // Uten overskrifter er spørsmålet det eneste feltet.
    return {
      feil:
        titler.length > 0
          ? {
              melding: "Du har ikke merket noe ennå.",
              handling:
                "Merk en overskrift, eller skriv noe du lurer på — det blir ikke vurdert. Vil du heller gå rett videre, trykk «Videre» en gang til.",
            }
          : {
              melding: "Du har ikke skrevet noe ennå.",
              handling:
                "Skriv noe du lurer på om emnet — det blir ikke vurdert. Vil du heller gå rett videre, trykk «Videre» en gang til.",
            },
    };
  }

  if (!nyttLaaseforsoek) await lagreForkunnskapssvar(t, tekstId, { merking, lurerPaa });

  // FR-3 (endret 11.11): innlimt tekst har ingen fase 3b. Eleven har selv
  // valgt teksten, og det finnes ingen uttrekksfeil å rette, så den låses
  // slik den ble limt inn. PDF og bilde går via gjennomsynet som før.
  if (rad.vei === "liming") {
    const { laast, svar: feil, fagordfeil } = await laasOgLagBegrepssett(t, tekstId, rad.redigertTekst);
    // Feilet låsingen, står teksten fortsatt som aktivert, og feilen vises
    // her. Feilet bare genereringen, er teksten låst, og lesevisningen tåler
    // et manglende Begrepssett og tilbyr å prøve igjen (AD-9, §5). Koden
    // følger med, så lesevisningen gir rådet som passer feilen (FR-7).
    if (!laast && feil) return feil;
    redirect(lesingEtterLaasing(tekstId, fagordfeil));
  }

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

  // FR-1 og BF-4: kort tekst fra et bilde slipper gjennom innlesingen, så
  // eleven kan skrive inn resten her. Før låsingen gjelder samme grense som
  // ved innliming — uten den ventet eleven på fem uttrekkskall som ga opp,
  // og fikk beskjeden sent (telefontest 10.11). Teksten låses ikke, så
  // eleven kan skrive mer og godkjenne på nytt.
  const lengde = redigert.trim().length;
  if (lengde < GRENSER.minTegnTotalt) {
    return {
      feil: {
        melding: `Teksten er for kort: ${lengde} tegn. LeseBuddy trenger minst ${GRENSER.minTegnTotalt}, så det mangler ${GRENSER.minTegnTotalt - lengde}.`,
        handling: "Skriv inn resten av teksten i feltet, eller ta bilde av flere sider.",
      },
    };
  }

  const t = await tilgang();
  const { laast, svar, fagordfeil } = await laasOgLagBegrepssett(t, tekstId, redigert);
  // Som i aktiveringen: feilet bare fagordene (FR-7), er teksten låst, og
  // gjennomsynet kan ikke sendes på nytt. Lesevisningen sier at fagordene
  // ikke kunne lages, med rådet som passer koden, og har «Prøv igjen».
  if (!laast && svar) return svar;
  redirect(lesingEtterLaasing(tekstId, fagordfeil));
}

/** Lesevisningen etter låsing. Feilet fagordene, bærer adressen koden (FR-7). */
function lesingEtterLaasing(tekstId: string, fagordfeil: string | undefined): string {
  const rot = `/tekst/${tekstId}/lesing`;
  return fagordfeil ? `${rot}?${FAGORDFEIL}=${encodeURIComponent(fagordfeil)}` : rot;
}

/**
 * Låser teksten og lager Begrepssettet — felles for gjennomsynet (fase 3b)
 * og for aktiveringen av innlimt tekst, som ikke har fase 3b (FR-3, endret
 * 11.11). `laast` sier om teksten ble låst; `svar` har feilen når noe gikk
 * galt. Feiler bare genereringen, er teksten likevel låst (AD-9).
 */
async function laasOgLagBegrepssett(
  t: Tilgang,
  tekstId: string,
  redigert: string,
): Promise<{ laast: boolean; svar: Handlingssvar | null; fagordfeil?: string }> {
  let laast;
  try {
    laast = await laasTekst(t, tekstId, redigert);
  } catch {
    return {
      laast: false,
      svar: {
        feil: {
          melding: "Teksten kunne ikke låses.",
          handling:
            "Den er kanskje alt låst. Gå til lesevisningen for å se om den er klar.",
        },
      },
    };
  }

  // Generering skjer rett etter låsing, ikke ved visning. FR-7 sier at
  // kappingen skjer én gang ved uttrekk, slik at Lesevisningen og Øvekortene
  // viser nøyaktig samme sett.
  try {
    const resultat = await underTaket(t, (vakt) => hentFaguttrykk(laast.avsnitt, vakt));
    await lagreBegrepssett(laast, resultat);
  } catch (e) {
    // Teksten ER låst nå, selv om genereringen feilet. Det er riktig: AD-9
    // går bare framover. Eleven sendes videre til lesevisningen, som tåler
    // et manglende Begrepssett og tilbyr å prøve igjen.
    revalidatePath(`/tekst/${tekstId}/lesing`);
    return { laast: true, svar: kiFeil(e, KI_FEIL.fagord), fagordfeil: feilkodeFor(e) };
  }
  return { laast: true, svar: null };
}

/**
 * Genererer Begrepssettet på nytt for en alt låst Tekst.
 *
 * Finnes fordi låsingen og genereringen kan feile hver for seg: en Tekst kan
 * være låst uten Begrepssett om modellkallet feilet. Uten denne ville eleven
 * sittet med en låst tekst og ingen vei videre, som er en blindvei (§5).
 */
export async function genererPaaNytt(tekstId: string): Promise<Handlingssvar> {
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
    const resultat = await underTaket(t, (vakt) => hentFaguttrykk(laast.avsnitt, vakt));
    await lagreBegrepssett(laast, resultat);
  } catch (e) {
    return kiFeil(e, KI_FEIL.fagord);
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
      const resultat = await underTaket(t, (vakt) => genererQuiz(laast.avsnitt, vakt));
      await lagreQuiz(laast, resultat);
    }
  } catch (e) {
    // FR-13: ingen Quiz lagres fra et mislykket kall (lagreQuiz nås ikke).
    return kiFeil(e, KI_FEIL.quiz);
  }
  revalidatePath(`/tekst/${tekstId}/quiz`);
  return INGEN_FEIL;
}

/**
 * Det nettleseren sender. Valideres, fordi alt fra nettleseren kan være laget
 * for hånd. Ingen selvvurdering her: den gjøres i resultatet, etter levering
 * (`vurderKortsvar`), og et kortsvar teller ikke før eleven har krysset av.
 */
const Elevsvarelement = z.object({
  sporsmalId: z.string().uuid(),
  valgt: z.string().max(2000).optional(),
  skrevet: z.string().max(5000).optional(),
});
const ElevsvarSkjema = z.array(Elevsvarelement).max(20);

/** FR-52: den samlede quizen har høyst 8 spørsmål fra hver av høyst 8 Tekster. */
const MappesvarSkjema = z.array(Elevsvarelement).max(MAPPEGRENSER.tekster * SPORSMAL_PER_TEKST.alle);

export type Leveringssvar = Handlingssvar & {
  resultat?: {
    /** Forsøket som ble lagret — selvvurderingen av kortsvarene skrives dit. */
    forsoekId: string;
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
 *
 * Svaret har fasiten og eksempelsvarene (`riktigSvar`). Det er første gang de
 * når nettleseren: før levering ville de kunnet leses i utviklerverktøyet,
 * og forsøkene i FR-15 ville ikke sagt noe.
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
    const elevsvar = tilElevsvar(tolket.data);
    const retting = rettQuiz(q.sporsmal, elevsvar);
    const forsoekId = await lagreForsoek(t, tekstId, elevsvar, retting);

    revalidatePath(`/tekst/${tekstId}/quiz`);
    return {
      resultat: {
        forsoekId,
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

export type Vurderingssvar = Handlingssvar & {
  /** Det nye antallet, rettet på serveren med samme regel som ved levering. */
  antallRiktige?: number;
};

const VurderingSkjema = z.object({
  forsoekId: z.string().uuid(),
  sporsmalId: z.string().uuid(),
  riktig: z.boolean(),
});

/**
 * FR-15 (endret 11.11): eleven krysser av i resultatet for om kortsvaret var
 * riktig. Nettleseren sender bare «spørsmål X: riktig ja/nei» for et forsøk,
 * aldri et antall — antallet regnes ut på nytt i `oppdaterSelvvurdering`.
 */
export async function vurderKortsvar(
  tekstId: string,
  forsoekId: string,
  sporsmalId: string,
  riktig: boolean,
): Promise<Vurderingssvar> {
  const t = await tilgang();
  const tolket = VurderingSkjema.safeParse({ forsoekId, sporsmalId, riktig });
  if (!tolket.success) {
    return { feil: { melding: "Avkrysningen kom ikke fram i riktig form.", handling: "Last siden på nytt og prøv igjen." } };
  }
  try {
    const retting = await oppdaterSelvvurdering(t, tekstId, forsoekId, sporsmalId, riktig);
    revalidatePath(`/tekst/${tekstId}/quiz`);
    return { antallRiktige: retting.antallRiktige };
  } catch (e) {
    if (e instanceof UgyldigVurdering) {
      return { feil: { melding: e.message, handling: "Last siden på nytt." } };
    }
    if (e instanceof IkkeFunnet) {
      return { feil: { melding: "Fant ikke forsøket.", handling: "Last siden på nytt og ta quizen igjen." } };
    }
    return { feil: { melding: "Avkrysningen ble ikke lagret.", handling: "Prøv igjen." } };
  }
}

/** FR-1: taket på 8 000 tegn, felles for liming og PDF. */
function sjekkTak(tekst: string): Handlingssvar | null {
  if (tekst.length <= GRENSER.maksTegn) return null;
  return {
    feil: {
      melding: `Teksten er på ${tekst.length.toLocaleString("nb-NO")} tegn. LeseBuddy tar høyst ${GRENSER.maksTegn.toLocaleString("nb-NO")}.`,
      handling: "Bruk de første 8 000 tegnene, eller del teksten i flere og legg dem inn hver for seg.",
    },
  };
}

/* ------------------------------------------------------------------ *
 * FR-2 — innlesing av PDF
 * ------------------------------------------------------------------ */

/** Rapporten kommer fra nettleseren og valideres før den lagres. */
const RapportSkjema = z.object({
  sider: z.number().int().min(1).max(GRENSER.maksSider),
  fjernedeLinjer: z.array(z.string().max(500)).max(500),
  sammenslaatteOrddelinger: z.number().int().min(0),
  muligTabellEllerFormel: z.boolean(),
});

/**
 * Tar imot teksten nettleseren har trukket ut av en PDF. Selve filen kommer
 * aldri hit (AD-16, FR-2): bare teksten og rapporten om hva uttrekket gjorde.
 */
/**
 * FR-44: tar imot teksten som er lest ut av bildene. Bildene selv kom aldri
 * hit — de ble sendt ett og ett til /api/bilde, holdt i minnet gjennom
 * uttrekket, og er borte (AD-16). Det som lagres, er Råteksten.
 */
export async function limInnBilde(_forrige: Handlingssvar, data: FormData): Promise<Handlingssvar> {
  const tittel = String(data.get("tittel") ?? "").trim();
  const raatekst = String(data.get("raatekst") ?? "");
  if (raatekst.trim().length === 0) {
    return { feil: { melding: "Det kom ingen tekst fra bildene.", handling: "Ta bildene på nytt, eller lim inn teksten." } };
  }
  const forLang = sjekkTak(raatekst);
  if (forLang) return forLang;

  // BF-4: lite tekst stopper ikke. Gjennomsynet vises likevel, så eleven kan
  // skrive inn resten — men delIAvsnitt må gi minst ett avsnitt.
  const avsnitt = delIAvsnitt(raatekst);
  const { ny, svar } = await opprettEllerGrense(await tilgang(), {
    tittel: tittel.length > 0 ? tittel : foreslaaTittel(avsnitt),
    raatekst,
    redigertTekst: raatekst,
    vei: "bilde",
  });
  if (!ny) return svar;
  redirect(`/tekst/${ny.id}/overskrifter`);
}

export async function limInnPdf(_forrige: Handlingssvar, data: FormData): Promise<Handlingssvar> {
  const tittel = String(data.get("tittel") ?? "").trim();
  const raatekst = String(data.get("raatekst") ?? "");
  let rapport;
  try {
    rapport = RapportSkjema.parse(JSON.parse(String(data.get("rapport") ?? "")));
  } catch {
    return { feil: { melding: "Opplastingen kom ikke fram i riktig form.", handling: "Velg filen på nytt og prøv igjen." } };
  }
  if (raatekst.trim().length === 0) {
    return { feil: { melding: "Det kom ingen tekst fra filen.", handling: "Velg filen på nytt, eller lim inn teksten." } };
  }
  const forLang = sjekkTak(raatekst);
  if (forLang) return forLang;

  const avsnitt = delIAvsnitt(raatekst);
  const { ny, svar } = await opprettEllerGrense(await tilgang(), {
    tittel: tittel.length > 0 ? tittel : foreslaaTittel(avsnitt),
    raatekst,
    redigertTekst: raatekst,
    vei: "pdf",
    innlesingsrapport: rapport,
  });
  if (!ny) return svar;
  redirect(`/tekst/${ny.id}/overskrifter`);
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
 * FR-50 til FR-52 — Mapper lett
 *
 * Ingen av handlingene kaller en generator: Mappen leser bare det Tekstene
 * har lagret. Eierskapet til både Mappen og hver Tekst sjekkes i
 * `data/mapper.ts` (AD-8).
 * ------------------------------------------------------------------ */

const MappeId = z.string().uuid();

/** Avvisninger fra datalaget, som tekst eleven kan handle på (§5). */
function mappefeil(e: unknown): { feil: Feiltekst } {
  if (e instanceof MappeAvvist) return { feil: { melding: e.melding, handling: e.handling } };
  if (e instanceof IkkeFunnet) {
    return {
      feil: {
        melding: "Fant ikke mappen eller teksten.",
        handling: "Last siden på nytt. Er den slettet, finner du resten i Samlinger.",
      },
    };
  }
  return somFeil(e);
}

function oppdaterMappesider(mappeId?: string) {
  revalidatePath("/samling");
  if (mappeId) revalidatePath(`/mappe/${mappeId}`);
}

/** FR-50: lager en Mappe og sender eleven dit. */
export async function opprettMappeHandling(_forrige: Handlingssvar, data: FormData): Promise<Handlingssvar> {
  const t = await tilgang();
  let id: string;
  try {
    id = await opprettMappe(t, String(data.get("tittel") ?? ""));
  } catch (e) {
    return mappefeil(e);
  }
  oppdaterMappesider();
  redirect(`/mappe/${id}`);
}

export async function giMappeNyttNavn(mappeId: string, _forrige: Handlingssvar, data: FormData): Promise<Handlingssvar> {
  const t = await tilgang();
  if (!MappeId.safeParse(mappeId).success) return mappefeil(new IkkeFunnet("Mappen"));
  try {
    await giNyttNavn(t, mappeId, String(data.get("tittel") ?? ""));
  } catch (e) {
    return mappefeil(e);
  }
  oppdaterMappesider(mappeId);
  return INGEN_FEIL;
}

/** Sletter Mappen. Tekstene står igjen. Svarer som `slett`, så knappen kan vise en feil. */
export async function slettMappeHandling(mappeId: string): Promise<{ slettet: boolean }> {
  const t = await tilgang();
  if (!MappeId.safeParse(mappeId).success) return { slettet: false };
  try {
    await slettMappe(t, mappeId);
  } catch {
    return { slettet: false };
  }
  oppdaterMappesider();
  return { slettet: true };
}

export async function leggTilIMappe(mappeId: string, _forrige: Handlingssvar, data: FormData): Promise<Handlingssvar> {
  const t = await tilgang();
  const tekstId = String(data.get("tekstId") ?? "");
  if (!MappeId.safeParse(mappeId).success || !MappeId.safeParse(tekstId).success) {
    return { feil: { melding: "Velg en tekst å legge til.", handling: "Velg en av tekstene dine i listen, og trykk «Legg til»." } };
  }
  try {
    await leggTilTekst(t, mappeId, tekstId);
  } catch (e) {
    return mappefeil(e);
  }
  oppdaterMappesider(mappeId);
  return INGEN_FEIL;
}

export async function fjernFraMappe(mappeId: string, tekstId: string, _forrige: Handlingssvar): Promise<Handlingssvar> {
  const t = await tilgang();
  if (!MappeId.safeParse(mappeId).success || !MappeId.safeParse(tekstId).success) {
    return mappefeil(new IkkeFunnet("Teksten i mappen"));
  }
  try {
    await fjernTekst(t, mappeId, tekstId);
  } catch (e) {
    return mappefeil(e);
  }
  oppdaterMappesider(mappeId);
  return INGEN_FEIL;
}

/**
 * FR-52: retter og lagrer et forsøk på den samlede quizen, som `leverQuiz`.
 * Spørsmålene hentes på nytt her med lengden, og rettes mot fasiten i
 * databasen med `rettQuiz`. Svarene lagres per spørsmål serveren valgte, så
 * et spørsmål nettleseren ikke sendte, står som ubesvart.
 */
export async function leverMappequiz(mappeId: string, lengde: string, svar: unknown): Promise<Leveringssvar> {
  const t = await tilgang();
  const l = tolkLengde(lengde);
  const tolket = MappesvarSkjema.safeParse(svar);
  if (!l || !tolket.success || !MappeId.safeParse(mappeId).success) {
    return { feil: { melding: "Svarene kom ikke fram i riktig form.", handling: "Last siden på nytt og prøv igjen." } };
  }
  try {
    const sporsmal = await hentMappequiz(t, mappeId, l);
    if (sporsmal.length === 0) {
      return { feil: { melding: "Ingen av tekstene i mappen har quiz.", handling: "Gå tilbake til mappen og lag quizen i en av tekstene." } };
    }
    // Er Mappen endret siden quizen ble åpnet, er settet et annet enn eleven
    // så. Da rettes og lagres ingenting, i stedet for å rette spørsmål hun
    // ikke har sett.
    const innsendt = new Set(tolket.data.map((s) => s.sporsmalId));
    if (innsendt.size !== sporsmal.length || sporsmal.some((s) => !innsendt.has(s.id))) {
      return { feil: { melding: "Mappen er endret siden du åpnet quizen.", handling: "Last siden på nytt for å få de nye spørsmålene." } };
    }
    const fra = new Map(tilElevsvar(tolket.data).map((s) => [s.sporsmalId, s]));
    const elevsvar = sporsmal.map((s) => fra.get(s.id) ?? { sporsmalId: s.id });
    const retting = rettQuiz(sporsmal, elevsvar);
    const forsoekId = await lagreMappeforsoek(t, mappeId, l, elevsvar, retting);

    revalidatePath(`/mappe/${mappeId}/quiz`);
    return {
      resultat: {
        forsoekId,
        antallRiktige: retting.antallRiktige,
        antallTotalt: retting.antallTotalt,
        per: sporsmal.map((s) => ({
          sporsmalId: s.id,
          riktig: retting.per.find((p) => p.sporsmalId === s.id)?.riktig ?? false,
          riktigSvar: s.riktigSvar,
          kildeavsnitt: s.kildeavsnitt,
        })),
      },
    };
  } catch (e) {
    return mappefeil(e);
  }
}

/** FR-52 og FR-15: selvvurderingen av et kortsvar i den samlede quizen, som `vurderKortsvar`. */
export async function vurderMappeKortsvar(
  mappeId: string,
  forsoekId: string,
  sporsmalId: string,
  riktig: boolean,
): Promise<Vurderingssvar> {
  const t = await tilgang();
  const tolket = VurderingSkjema.safeParse({ forsoekId, sporsmalId, riktig });
  if (!tolket.success || !MappeId.safeParse(mappeId).success) {
    return { feil: { melding: "Avkrysningen kom ikke fram i riktig form.", handling: "Last siden på nytt og prøv igjen." } };
  }
  try {
    const retting = await oppdaterMappeSelvvurdering(t, mappeId, forsoekId, sporsmalId, riktig);
    revalidatePath(`/mappe/${mappeId}/quiz`);
    return { antallRiktige: retting.antallRiktige };
  } catch (e) {
    if (e instanceof UgyldigVurdering) {
      return { feil: { melding: e.message, handling: "Last siden på nytt." } };
    }
    if (e instanceof IkkeFunnet) {
      return { feil: { melding: "Fant ikke forsøket.", handling: "Last siden på nytt og ta quizen igjen." } };
    }
    return { feil: { melding: "Avkrysningen ble ikke lagret.", handling: "Prøv igjen." } };
  }
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
    // PRD §6.4: 5 nye Fagsamtaler per døgn. Sjekkes før første spørsmål
    // lages, så grensen ikke koster et kall. Påbegynte samtaler går videre.
    if (await samtalegrenseNaadd(t)) throw new GrenseNaadd("samtaler");
    const laast = await hentLaast(t, tekstId);
    const start = await underTaket(t, (vakt) => startSamtale(laast.avsnitt, vakt));
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

  let s;
  try {
    s = await hentFagsamtale(t, samtaleId);
    if (s.avsluttet) {
      return { feil: { melding: "Samtalen er avsluttet.", handling: "Start en ny samtale fra oppgavesiden." } };
    }
    if (!s.runder.some((r) => r.nummer === nummer && r.elevsvar === null)) {
      return { feil: { melding: "Dette spørsmålet er alt besvart.", handling: "Last siden på nytt." } };
    }
    // FR-19: svaret lagres før det vurderes. Feiler vurderingen, er svaret
    // ikke tapt, og «Prøv igjen» vurderer det som ligger i databasen.
    await lagreElevsvar(t, samtaleId, nummer, svar);
  } catch (e) {
    return somFeil(e);
  }
  const utfall = await vurderOgLagre(t, s, nummer, svar);
  const side = `/tekst/${s.tekstId}/samtale/${samtaleId}`;
  revalidatePath(side);
  if (utfall.slag === "ok") return INGEN_FEIL;
  /*
   * Svaret er lagret, så skjemaet forsvinner når siden tegnes på nytt, og en
   * melding i skjemaets tilstand ville forsvunnet med det. Siden viser i
   * stedet feilen ut fra det som er lagret (FR-19, FR-20). Adressen sier at
   * det skjedde nå (så «Prøv igjen» får fokus), og bærer koden, så en feil
   * som ikke kan prøves på nytt (401, 429, testmodus, databasen) gir sitt
   * eget råd.
   */
  if (utfall.slag === "oppfolging") redirect(`${side}?${FEIL}=oppfolging`);
  redirect(`${side}?${FEIL}=vurdering&${FEILKODE}=${encodeURIComponent(utfall.kode)}`);
}

type Vurderingsutfall =
  | { slag: "ok" }
  /** FR-20: vurderingen er lagret, men neste spørsmål mangler. */
  | { slag: "oppfolging" }
  /** FR-19: vurderingen feilet. Svaret er lagret. */
  | { slag: "feil"; svar: Handlingssvar; kode: string };

/**
 * Et annet forsøk kom først (en fane til, eller siden ble lastet på nytt
 * mens kallet pågikk): raden er alt endret, eller neste runde finnes. Da er
 * ingenting galt, og siden skal bare vise det som ble lagret.
 */
function annetForsoekKomFoerst(e: unknown): boolean {
  if (e instanceof IkkeFunnet) return true;
  let x: unknown = e;
  for (let i = 0; i < 3 && x; i++) {
    if ((x as { code?: unknown }).code === "23505") return true; // brudd på unik-begrensning
    x = (x as { cause?: unknown }).cause;
  }
  return false;
}

/**
 * Vurderer et lagret svar og lagrer vurderingen, og neste spørsmål når det
 * finnes. Felles for svaret (`svarISamtale`) og «Prøv igjen» etter FR-19.
 * Feiler oppfølgingen (FR-20), lagres vurderingen likevel, og samtalen står
 * åpen uten neste spørsmål.
 */
async function vurderOgLagre(
  t: Tilgang,
  s: LagretFagsamtale,
  nummer: number,
  elevsvar: string,
): Promise<Vurderingsutfall> {
  const runde = s.runder.find((r) => r.nummer === nummer);
  if (!runde) return { slag: "ok" };
  let v;
  try {
    const laast = await hentLaast(t, s.tekstId);
    v = await underTaket(t, (vakt) =>
      vurderSvar({
        avsnitt: laast.avsnitt,
        tidligere: tidligereRunder(s.runder, nummer),
        gjeldende: { sporsmal: runde.sporsmal, kildeavsnittNummer: runde.kildeavsnitt.nummer },
        elevsvar,
        sisteRunde: nummer >= MAKS_RUNDER,
        ...vakt,
      }),
    );
  } catch (e) {
    return { slag: "feil", svar: kiFeil(e, KI_FEIL.vurdering), kode: feilkodeFor(e) };
  }
  const neste = v.oppfolging ?? (v.oppfolgingFeilet ? "mangler" : null);
  try {
    await lagreVurdering(t, s.id, nummer, v, neste);
  } catch (e) {
    if (annetForsoekKomFoerst(e)) return { slag: "ok" };
    return { slag: "feil", svar: somFeil(e), kode: feilkodeFor(e) };
  }
  return neste === "mangler" ? { slag: "oppfolging" } : { slag: "ok" };
}

/** FR-19, «Prøv igjen»: vurderer svaret som ble lagret da vurderingen feilet. */
export async function vurderLagretSvar(samtaleId: string, nummer: number): Promise<Handlingssvar> {
  const t = await tilgang();
  let s;
  try {
    s = await hentFagsamtale(t, samtaleId);
  } catch (e) {
    return somFeil(e);
  }
  const side = `/tekst/${s.tekstId}/samtale/${samtaleId}`;
  const runde = s.runder.find((r) => r.nummer === nummer);
  if (!runde || runde.elevsvar === null) {
    return { feil: { melding: "Dette svaret venter ikke på vurdering.", handling: "Last siden på nytt." } };
  }
  // Alt vurdert (et annet forsøk kom først), eller samtalen er avsluttet:
  // siden viser det som er lagret.
  if (s.avsluttet || runde.svarvurdering !== null) {
    revalidatePath(side);
    return INGEN_FEIL;
  }
  const utfall = await vurderOgLagre(t, s, nummer, runde.elevsvar);
  revalidatePath(side);
  // FR-20 etter «Prøv igjen»: vurderingen er lagret, og siden viser «Prøv
  // igjen» for neste spørsmål. Det er ikke en feil i dette trykket.
  return utfall.slag === "feil" ? utfall.svar : INGEN_FEIL;
}

/**
 * FR-20, «Prøv igjen» for neste spørsmål: vurderingen er lagret og beholdes,
 * og bare oppfølgingen lages på nytt. Den må passe den lagrede tilstanden.
 */
export async function lagNesteSporsmal(samtaleId: string, nummer: number): Promise<Handlingssvar> {
  const t = await tilgang();
  let s;
  try {
    s = await hentFagsamtale(t, samtaleId);
  } catch (e) {
    return somFeil(e);
  }
  const side = `/tekst/${s.tekstId}/samtale/${samtaleId}`;
  const runde = s.runder.find((r) => r.nummer === nummer);
  if (!runde || runde.elevsvar === null || runde.svarvurdering === null) {
    return { feil: { melding: "Denne runden venter ikke på neste spørsmål.", handling: "Last siden på nytt." } };
  }
  // Neste spørsmål finnes alt (et annet forsøk kom først), eller samtalen er
  // avsluttet: siden viser det som er lagret.
  if (s.avsluttet || s.runder.some((r) => r.nummer > nummer)) {
    revalidatePath(side);
    return INGEN_FEIL;
  }
  let v;
  try {
    const laast = await hentLaast(t, s.tekstId);
    const { elevsvar, svarvurdering } = runde;
    v = await underTaket(t, (vakt) =>
      vurderSvar({
        avsnitt: laast.avsnitt,
        tidligere: tidligereRunder(s.runder, nummer),
        gjeldende: { sporsmal: runde.sporsmal, kildeavsnittNummer: runde.kildeavsnitt.nummer },
        elevsvar,
        sisteRunde: nummer >= MAKS_RUNDER,
        // En begrunnelse som mangler (null), erstattes av modellens i sjekken,
        // så den ikke stopper hvert «Prøv igjen» for alltid.
        beholdVurdering: { tilstand: svarvurdering, begrunnelse: runde.vurderingsbegrunnelse },
        ...vakt,
      }),
    );
  } catch (e) {
    return kiFeil(e, KI_FEIL.oppfolging);
  }
  if (!v.oppfolging) return { feil: KI_FEIL.oppfolging };
  try {
    await lagreNesteSporsmal(t, samtaleId, nummer, v.oppfolging);
  } catch (e) {
    if (!annetForsoekKomFoerst(e)) return somFeil(e);
  }
  revalidatePath(side);
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
    // FR-19: vurderingen feilet, så det finnes ingen vurdering å be om på
    // nytt. «Prøv igjen» (vurderLagretSvar) bruker ikke opp FR-22-muligheten.
    if (runde.svarvurdering === null) return { feil: KI_FEIL.vurdering };
    if (runde.revurdert) {
      return {
        feil: {
          melding: "Denne runden er alt vurdert på nytt.",
          handling: "Les avsnittet det lenkes til, og se om teksten sier noe annet enn du tenkte.",
        },
      };
    }
    const laast = await hentLaast(t, s.tekstId);
    const elevsvar = runde.elevsvar;
    const v = await underTaket(t, (vakt) =>
      vurderSvar({
        avsnitt: laast.avsnitt,
        tidligere: tidligereRunder(s.runder, nummer),
        gjeldende: { sporsmal: runde.sporsmal, kildeavsnittNummer: runde.kildeavsnitt.nummer },
        elevsvar,
        sisteRunde: nummer >= MAKS_RUNDER,
        nyVurdering: true,
        ...vakt,
      }),
    );
    // Feilet oppfølgingen, og eleven har et ubesvart neste spørsmål, ville
    // den nye vurderingen stått over et spørsmål som bygger på den gamle.
    // Da lagres ingenting, og den gamle vurderingen står.
    const ubesvartNeste = s.runder.some((r) => r.nummer === nummer + 1 && r.elevsvar === null);
    if (v.oppfolgingFeilet && ubesvartNeste && !s.avsluttet) return { feil: KI_FEIL.oppfolging };
    await lagreNyVurdering(t, samtaleId, nummer, v, v.oppfolging);
  } catch (e) {
    return kiFeil(e, KI_FEIL.vurdering);
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
  revalidatePath("/samling");
  return { slettet: true };
}

/* ------------------------------------------------------------------ *
 * FR-24 til FR-29 — morsmål
 * ------------------------------------------------------------------ */

/** FR-24: lagrer valget på kontoen. Et tomt valg fjerner Morsmålet. */
export async function velgMorsmaalHandling(
  _forrige: Handlingssvar,
  data: FormData,
): Promise<Handlingssvar> {
  const t = await tilgang();
  const kode = String(data.get("spraak") ?? "").trim();
  if (kode !== "" && !finnSpraak(kode)) {
    return { feil: { melding: "Det språket står ikke på listen.", handling: "Velg et språk fra listen." } };
  }
  try {
    await velgMorsmaal(t, kode === "" ? null : kode);
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath("/", "layout");
  return INGEN_FEIL;
}

/**
 * FR-26: lager den norske oppsummeringen, når eleven ber om den. Lagres og
 * gjenbrukes, så knappen koster ett kall per Tekst.
 */
export async function lagOppsummering(tekstId: string, _forrige: Handlingssvar): Promise<Handlingssvar> {
  const t = await tilgang();
  try {
    // PRD §6: ikke før eleven er sjekket. Sjekkes her og ikke bare i visningen.
    if (!(await harSjekketForstaaelsen(t, tekstId))) {
      return {
        feil: {
          melding: "Oppsummeringen kommer etter at du har sjekket deg selv.",
          handling: "Ta quizen eller svar i en fagsamtale først, så kan du se den.",
        },
      };
    }
    if (!(await hentOppsummering(t, tekstId))) {
      const avsnittene = await hentAvsnitt(t, tekstId);
      const r = await underTaket(t, (vakt) => oppsummer({ avsnitt: avsnittene, ...vakt }));
      await lagreOppsummering(t, tekstId, r.setninger, { promptversjon: r.promptversjon, modell: r.modell });
    }
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/lesing`);
  return INGEN_FEIL;
}

/**
 * FR-25 til FR-27: lager én oversettelse som mangler. Kalles fra visningen
 * etter at siden er tegnet, så teksten aldri venter på den (FR-29).
 *
 * For utpekingen lages det norske settet først, om det mangler. Det er det
 * norske som vises likeverdig ved siden av, og det som valideres mot teksten.
 */
export async function lagOversettelse(tekstId: string, type: Oversettelsestype): Promise<Handlingssvar> {
  const t = await tilgang();
  const side = type === "overskrifter" ? "aktivering" : "lesing";
  try {
    const spraak = await hentMorsmaal(t);
    if (!spraak) return INGEN_FEIL;

    let elementer: Element[] = [];
    let fagord: string[] = [];

    if (type === "overskrifter") {
      // Aktiveringen kommer før låsingen, så overskriftene regnes fra
      // gjeldende tekst — samme utregning som siden gjør (AD-12).
      const rad = await hentTekst(t, tekstId);
      elementer = overskriftElementer(delIAvsnitt(rad.redigertTekst));
    } else {
      const sett = await hentBegrepssett(t, tekstId);
      fagord = (sett?.begreper ?? []).map((b) => b.uttrykk);
      if (type === "begreper") {
        elementer = begrepElementer(sett?.begreper ?? []);
      } else if (type === "oppsummering") {
        elementer = oppsummeringElementer((await hentOppsummering(t, tekstId)) ?? []);
      } else {
        let norsk = await hentUtpeking(t, tekstId);
        if (!norsk) {
          const avsnittene = await hentAvsnitt(t, tekstId);
          const r = await underTaket(t, (vakt) => pekUt({ avsnitt: avsnittene, fagord, ...vakt }));
          await lagreUtpeking(t, tekstId, r.uttrykk, { promptversjon: r.promptversjon, modell: r.modell });
          norsk = r.uttrykk;
        }
        elementer = utpekingElementer(norsk);
      }
    }

    const hash = kildeHash(elementer);
    if (elementer.length > 0 && !(await hentOversettelse(t, tekstId, spraak.kode, type, hash))) {
      const r = await underTaket(t, (vakt) => oversett({ spraak, elementer, fagord, ...vakt }));
      await lagreOversettelse(t, tekstId, spraak.kode, type, hash, r.oversatt, {
        promptversjon: r.promptversjon,
        modell: r.modell,
      });
    }
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/${side}`);
  return INGEN_FEIL;
}

/* ------------------------------------------------------------------ *
 * FR-30 og FR-31 — minnevers
 * ------------------------------------------------------------------ */

/** Lager et nytt vers eller en ny Suno-prompt. Et nytt erstatter ikke det gamle i databasen, men vises i stedet. */
export async function lagVers(tekstId: string, form: Versform, _forrige: Handlingssvar): Promise<Handlingssvar> {
  const t = await tilgang();
  try {
    const [avsnittene, sett] = await Promise.all([hentAvsnitt(t, tekstId), hentBegrepssett(t, tekstId)]);
    const r = await underTaket(t, (vakt) =>
      lagMinnevers({ avsnitt: avsnittene, begreper: sett?.begreper ?? [], form, ...vakt }),
    );
    await lagreMinnevers(t, tekstId, r);
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/minnevers`);
  return INGEN_FEIL;
}

/* ------------------------------------------------------------------ *
 * FR-12 — leseinnstillinger
 * ------------------------------------------------------------------ */

export async function lagreLesing(_forrige: Handlingssvar, data: FormData): Promise<Handlingssvar> {
  const t = await tilgang();
  try {
    await lagreLeseinnstillinger(
      t,
      tolkInnstillinger({ tekststorrelse: data.get("tekststorrelse"), linjeavstand: data.get("linjeavstand") }),
    );
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath("/tekst/[id]/lesing", "page");
  return INGEN_FEIL;
}

/* ------------------------------------------------------------------ *
 * FR-3 fase 3a — overskriftskontrollen
 * ------------------------------------------------------------------ */

/**
 * Lagrer overskriftene eleven har godkjent, og sender henne til aktiveringen.
 * Feltene er `o-<nummer>` per plass (tomt sletter) og `topp` for en ny
 * overskrift øverst. Plasser som ikke finnes i teksten, ignoreres.
 */
export async function lagreOverskrifter(tekstId: string, _forrige: Handlingssvar, data: FormData): Promise<Handlingssvar> {
  const t = await tilgang();
  let rad;
  try {
    rad = await hentTekst(t, tekstId);
  } catch (e) {
    return somFeil(e);
  }
  const endringer = new Map<number, string>();
  for (const p of overskriftsplasser(rad.redigertTekst)) {
    const ny = String(data.get(`o-${p.nummer}`) ?? p.tekst).trim();
    const feil = ny === "" ? null : overskriftsfeil(ny);
    if (feil) return { feil: { melding: `«${ny}»: ${feil}`, handling: "Gjør overskriften kortere, eller fjern punktumet." } };
    endringer.set(p.nummer, ny);
  }
  const topp = String(data.get("topp") ?? "").trim();
  const toppfeil = topp === "" ? null : overskriftsfeil(topp);
  if (toppfeil) return { feil: { melding: `«${topp}»: ${toppfeil}`, handling: "Gjør overskriften kortere, eller fjern punktumet." } };

  try {
    await godkjennOverskrifter(t, tekstId, byttOverskrifter(rad.redigertTekst, endringer, topp));
  } catch {
    return {
      feil: {
        melding: "Overskriftene kunne ikke lagres.",
        handling: "Teksten er kanskje alt aktivert. Gå videre til aktiveringen.",
      },
    };
  }
  redirect(`/tekst/${tekstId}/aktivering`);
}

/**
 * FR-5: lager avsnittsetiketter når teksten mangler overskrifter. Kalles fra
 * fase 3a etter at siden er tegnet, så eleven aldri venter på den. Feiler det,
 * går hun videre uten — slik som før funksjonen fantes.
 */
export async function lagEtiketterHandling(tekstId: string): Promise<Handlingssvar> {
  const t = await tilgang();
  try {
    const rad = await hentTekst(t, tekstId);
    const avsnittene = delIAvsnitt(rad.redigertTekst);
    if (rad.tilstand !== "innlest" || rad.genererteOverskrifter !== null || avsnittene.some((a) => a.erOverskrift)) {
      return INGEN_FEIL;
    }
    const r = await underTaket(t, (vakt) => lagEtiketter(avsnittene, vakt));
    await lagreEtiketter(
      t,
      tekstId,
      settInnEtiketter(rad.redigertTekst, r.etiketter),
      r.etiketter.map((e) => e.etikett),
    );
  } catch (e) {
    return somFeil(e);
  }
  revalidatePath(`/tekst/${tekstId}/overskrifter`);
  return INGEN_FEIL;
}


/* ------------------------------------------------------------------ *
 * Utseende — lys eller mørk modus (EXPERIENCE.md, Gjelder overalt)
 * ------------------------------------------------------------------ */

/**
 * Lagrer valget i en informasjonskapsel på denne enheten: `lys`, `moerk`,
 * eller ingen kapsel for «Følg enheten». Ingen tabell og ingen migrering
 * (avveining godkjent 15.11), så valget følger ikke kontoen til en annen
 * enhet. Et vanlig skjema, så det virker uten JavaScript.
 *
 * `tilgang()` som alle handlingene her: valget gjøres på kontosiden, som
 * krever innlogging. Rotlayouten leser kapselen og setter `data-tema`.
 */
export async function velgTemaHandling(data: FormData): Promise<void> {
  await tilgang();
  const tema = tolkTema(data.get("tema"));
  const kapsler = await cookies();
  if (tema === null) {
    kapsler.delete(TEMA_KAPSEL);
  } else {
    kapsler.set(TEMA_KAPSEL, tema, {
      path: "/",
      sameSite: "lax",
      maxAge: TEMA_LEVETID,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }
  revalidatePath("/", "layout");
  // `n` gir bekreftelsen en ny nøkkel, så to lagringer etter hverandre begge kunngjøres.
  redirect(`/konto?lagret=utseende&n=${Date.now()}`);
}

/**
 * «Venstrehendt» (design runde 2, bolk 9): speiler øvekortene, så «Må øve
 * mer» og «Har kontroll» står til venstre. Lagres som temaet: en informasjonskapsel på
 * denne enheten, `venstre` eller ingen kapsel. En avkrysningsboks i et vanlig
 * skjema, så det virker uten JavaScript; uten kryss sendes ingenting, og
 * kapselen slettes. Rotlayouten leser kapselen og setter `data-hand`.
 */
export async function velgHandHandling(data: FormData): Promise<void> {
  await tilgang();
  const hand = tolkHand(data.get("hand"));
  const kapsler = await cookies();
  if (hand === null) {
    kapsler.delete(HAND_KAPSEL);
  } else {
    kapsler.set(HAND_KAPSEL, hand, {
      path: "/",
      sameSite: "lax",
      maxAge: HAND_LEVETID,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  }
  revalidatePath("/", "layout");
  // `n` gir bekreftelsen en ny nøkkel, som for temaet.
  redirect(`/konto?lagret=hand&n=${Date.now()}`);
}

/**
 * Sletter valgene som gjelder enheten — temaet og «Venstrehendt» — ved
 * utlogging og sletting av kontoen, så neste elev på en delt PC ikke arver
 * dem. Kapslene er httpOnly, så klienten kan ikke slette dem selv.
 *
 * Unntaket fra `tilgang()` først: handlingen kalles etter `signOut` og
 * `deleteUser`, når økten alt er borte. Den rører ingen data på noen konto,
 * bare informasjonskapsler på enheten som sender forespørselen, og den kan
 * bare sette enheten tilbake til standardvalgene (AD-8 gjelder datatilgang).
 */
export async function slettEnhetsvalgHandling(): Promise<void> {
  const kapsler = await cookies();
  const finnes = [TEMA_KAPSEL, HAND_KAPSEL].filter((k) => kapsler.has(k));
  // Uten kapsler er det ingenting å gjøre, og hurtigbufferen får stå.
  if (finnes.length === 0) return;
  for (const k of finnes) kapsler.delete(k);
  revalidatePath("/", "layout");
}
