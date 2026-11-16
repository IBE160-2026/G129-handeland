/**
 * Bruksgrensene i PRD §6.4: forbruket for hele appen, og grensene per konto.
 *
 *   - Taket: når summen for døgnet er 30 kroner eller mer, starter ingen nye
 *     KI-kall. Summen regnes fra `forbruk`, der hvert API-kall har én rad.
 *   - Per konto: høyst 5 nye Tekster og 5 nye Fagsamtaler per døgn, talt fra
 *     hendelsesradene i `forbruk` (`ny_tekst`, `ny_fagsamtale`). De skrives i
 *     samme transaksjon som Teksten eller Fagsamtalen, og overlever at den
 *     slettes, så sletting gir ikke en ny plass samme dag.
 *
 * Døgnet er norsk tid (Europe/Oslo), fra midnatt til midnatt.
 *
 * Generatorlaget kjenner ikke denne fila (AD-10). Det melder tokenbruken til
 * en `paaForbruk` og spør en `foerKall`-vakt før hvert API-kall, begge sendt
 * inn av kalleren. `underTaket` her lager dem: vakten sjekker taket før hvert
 * kall, og bruken registreres underveis og etterpå, også når arbeidet feilet.
 *
 * Grensene per konto tar `Tilgang` (AD-8). Taket gjelder hele appen og trenger
 * ingen eierskap, men skrives bare fra serveren: ingen handling tar imot et
 * forbruk fra nettleseren.
 */

import { and, count, eq, gte, sql } from "drizzle-orm";
import type { Forbrukspost, Forbruksvakt } from "../generatorer/feil";
import { testmodus } from "../generatorer/lagretsvar";
import { db } from "./db";
import { BRUKSGRENSER, DAGSTAK_KRONER, GrenseNaadd, TAK_KODE } from "./grenser";
import { kostnadMikrodollar, tilKroner } from "./priser";
import { forbruk } from "./skjema";
import type { Tilgang } from "./tilgang";

/* ------------------------------------------------------------------ *
 * Døgnet
 * ------------------------------------------------------------------ */

const OSLO = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Oslo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/** Klokka i Oslo på tidspunktet, som om den var UTC. Forskjellen er Oslos avvik fra UTC. */
function veggklokke(d: Date): number {
  const del = Object.fromEntries(OSLO.formatToParts(d).map((p) => [p.type, p.value]));
  return Date.UTC(+del.year, +del.month - 1, +del.day, +del.hour, +del.minute, +del.second);
}

const DOEGN_MS = 86_400_000;

/**
 * Midnatt i Oslo ved starten av døgnet `naa` ligger i, som et tidspunkt.
 *
 * Avviket fra UTC er en time om vinteren og to om sommeren. Det regnes ved
 * midnatt og ikke ved `naa`, fordi sommertiden skifter klokka 02 og 03: et
 * kall klokka 12 den dagen klokka stilles, har et annet avvik enn midnatt.
 */
export function startPaaDoegnet(naa: Date): Date {
  const vegg = veggklokke(naa);
  const midnatt = vegg - (vegg % DOEGN_MS);
  // Første gjetning med avviket nå, så rettet med avviket ved gjetningen.
  const avvikNaa = vegg - Math.floor(naa.getTime() / 1000) * 1000;
  const gjetning = midnatt - avvikNaa;
  return new Date(midnatt - (veggklokke(new Date(gjetning)) - gjetning));
}

/* ------------------------------------------------------------------ *
 * Taket for hele appen
 * ------------------------------------------------------------------ */

/**
 * Lagrer én rad per API-kall, med kostnaden etter `data/priser.ts` og
 * kontoen når den er kjent. En tom liste gjør ingenting.
 */
export async function registrerForbruk(liste: readonly Forbrukspost[], kontoId: string | null = null): Promise<void> {
  if (liste.length === 0) return;
  await db.insert(forbruk).values(
    liste.map((p) => ({
      kontoId,
      oppgave: p.oppgave,
      modell: p.modell,
      tokensInn: p.inn,
      tokensUt: p.ut,
      mikrodollar: kostnadMikrodollar(p.modell, p.inn, p.ut, p.bufferSkriving),
    })),
  );
}

/** Det samlede forbruket i døgnet `naa` ligger i, i kroner. */
export async function dagensKroner(naa: Date = new Date()): Promise<number> {
  const [rad] = await db
    .select({ sum: sql<string | null>`sum(${forbruk.mikrodollar})` })
    .from(forbruk)
    .where(gte(forbruk.opprettet, startPaaDoegnet(naa)));
  return tilKroner(Number(rad?.sum ?? 0));
}

/**
 * Om taket er nådd. Testmodus `les` stoppes aldri (PRD §6.4, spec), fordi den
 * ikke kaller modellen og demotestene skal virke uansett hva databasen har fra
 * før. `LESEVENN_DAGSTAK_I_TESTMODUS=1` slår taket på også der, bare for
 * nettlesersjekken som viser takmeldingen (`maaling/sjekk-tilgjengelighet.mjs`).
 */
export async function taketNaadd(naa: Date = new Date()): Promise<boolean> {
  if (testmodus() === "les" && process.env.LESEVENN_DAGSTAK_I_TESTMODUS !== "1") return false;
  const kroner = await dagensKroner(naa);
  if (kroner < DAGSTAK_KRONER) return false;
  varsleTaket(naa, kroner);
  return true;
}

/**
 * Feilkoden fra adressen, slik den gjelder nå. `dagstak` (`TAK_KODE`) gjelder
 * bare så lenge taket er nådd: dagen etter er det ingen kode, og siden viser
 * standardmeldingen med «Prøv igjen».
 */
export async function kodeSomGjelder(kode: string | undefined): Promise<string | undefined> {
  if (kode !== TAK_KODE) return kode;
  return (await taketNaadd()) ? kode : undefined;
}

/** Døgnet taket sist ble meldt i loggen, per serverinstans. */
let varsletDoegn: number | null = null;

/** Én advarsel i loggen første gang taket nås i et døgn (per serverinstans). */
function varsleTaket(naa: Date, kroner: number): void {
  const doegn = startPaaDoegnet(naa).getTime();
  if (varsletDoegn === doegn) return;
  varsletDoegn = doegn;
  console.warn(`[forbruk] Dagstaket på ${DAGSTAK_KRONER} kr er nådd (${kroner.toFixed(2)} kr). Nye KI-kall stoppes til midnatt.`);
}

/**
 * Kjører KI-arbeid under taket. Er taket nådd, kastes `GrenseNaadd("taket")`
 * før modellen kalles. Ellers får arbeidet en vakt å gi videre til
 * generatoren (`Forbruksvakt`):
 *
 *   - `foerKall` kjøres før hvert API-kall. Den registrerer kallene så langt
 *     og kaster `GrenseNaadd("taket")` om taket er nådd, så en handling med
 *     mange kall (selvkonsistensen, samtaleløkkene) stopper midt i.
 *   - `paaForbruk` samler tokenbruken. Det som er igjen, registreres til
 *     slutt, også når arbeidet feilet.
 *
 * Kall som går samtidig (de parallelle uttrekkene, eller flere elever i samme
 * øyeblikk), passerer vakten hver for seg før noen av dem er registrert. Taket
 * kan derfor gå over med høyst ett kall per kall som var i gang.
 *
 * Feiler registreringen, logges det, og eleven får likevel det som ble laget:
 * kallet er betalt, og å kaste det bort hjelper ikke budsjettet.
 */
export async function underTaket<T>(t: Tilgang | null, arbeid: (vakt: Forbruksvakt) => Promise<T>): Promise<T> {
  if (await taketNaadd()) throw new GrenseNaadd("taket");
  const kontoId = t?.kontoId ?? null;
  const poster: Forbrukspost[] = [];
  const registrer = async () => {
    const nye = poster.splice(0);
    try {
      await registrerForbruk(nye, kontoId);
    } catch (e) {
      console.error("[forbruk] Tokenbruken ble ikke registrert:", nye, e);
    }
  };
  const vakt: Forbruksvakt = {
    paaForbruk: (p) => {
      poster.push(p);
    },
    foerKall: async () => {
      await registrer();
      if (await taketNaadd()) throw new GrenseNaadd("taket");
    },
  };
  try {
    return await arbeid(vakt);
  } finally {
    await registrer();
  }
}

/* ------------------------------------------------------------------ *
 * Grensene per konto (AD-8)
 * ------------------------------------------------------------------ */

/** En hendelse som teller mot grensene per konto. */
export type Hendelse = "ny_tekst" | "ny_fagsamtale";

const GRENSE_FOR: Record<Hendelse, { antall: number; grense: "tekster" | "samtaler" }> = {
  ny_tekst: { antall: BRUKSGRENSER.tekster, grense: "tekster" },
  ny_fagsamtale: { antall: BRUKSGRENSER.samtaler, grense: "samtaler" },
};

/** En transaksjon fra `db.transaction`. */
export type Transaksjon = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function antallHendelser(
  k: typeof db | Transaksjon,
  kontoId: string,
  hendelse: Hendelse,
  naa: Date,
): Promise<number> {
  const [rad] = await k
    .select({ antall: count() })
    .from(forbruk)
    .where(
      and(eq(forbruk.kontoId, kontoId), eq(forbruk.hendelse, hendelse), gte(forbruk.opprettet, startPaaDoegnet(naa))),
    );
  return rad?.antall ?? 0;
}

/**
 * Kalles inne i transaksjonen som oppretter en Tekst eller en Fagsamtale.
 * Låser kontoen til transaksjonen er ferdig (`pg_advisory_xact_lock`), så to
 * samtidige forsøk ikke begge blir den femte, sjekker grensen og skriver
 * hendelsesraden. Kaster `GrenseNaadd` når grensen er nådd, og da rulles
 * opprettelsen tilbake.
 */
export async function regnInnHendelse(tx: Transaksjon, kontoId: string, hendelse: Hendelse): Promise<void> {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${kontoId}))`);
  const { antall, grense } = GRENSE_FOR[hendelse];
  if ((await antallHendelser(tx, kontoId, hendelse, new Date())) >= antall) throw new GrenseNaadd(grense);
  await tx
    .insert(forbruk)
    .values({ kontoId, hendelse, oppgave: hendelse, modell: "", tokensInn: 0, tokensUt: 0, mikrodollar: 0 });
}

/** Antall Tekster kontoen har lagt inn i døgnet `naa` ligger i. Slettede telles med. */
export async function teksterIDag(t: Tilgang, naa: Date = new Date()): Promise<number> {
  return antallHendelser(db, t.kontoId, "ny_tekst", naa);
}

/** Antall Fagsamtaler kontoen har startet i døgnet `naa` ligger i. Slettede telles med. */
export async function samtalerIDag(t: Tilgang, naa: Date = new Date()): Promise<number> {
  return antallHendelser(db, t.kontoId, "ny_fagsamtale", naa);
}

/** Om kontoen har nådd grensen på nye Tekster i dag. Siden og handlingen bruker samme predikat (AD-20). */
export async function tekstgrenseNaadd(t: Tilgang, naa: Date = new Date()): Promise<boolean> {
  return (await teksterIDag(t, naa)) >= BRUKSGRENSER.tekster;
}

/** Om kontoen har nådd grensen på nye Fagsamtaler i dag. Påbegynte samtaler kan fortsettes. */
export async function samtalegrenseNaadd(t: Tilgang, naa: Date = new Date()): Promise<boolean> {
  return (await samtalerIDag(t, naa)) >= BRUKSGRENSER.samtaler;
}
