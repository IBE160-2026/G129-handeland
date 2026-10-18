/**
 * Minnevers og Suno-prompt — FR-30 og FR-31.
 *
 * FR-31 er et faktakrav: et rim som stemmer dårlig faglig er verre enn ingen
 * huskeregel. Det maskinelle i kravet — at hvert Faguttrykk i verset finnes i
 * Begrepssettet, og at minst tre er brukt — håndheves her. Et vers som
 * bryter det, er et hardt brudd (AD-11): det vises ikke, og kallet prøves
 * én gang til. At ingen påstand i verset motsier Teksten, kan ikke kode se;
 * det måles manuelt på ti vers (maaling/maal-minnevers.test.ts).
 *
 * §5: «Ingen KI-utdata uten kilde» nevner vers spesielt. Fra v3 har hver
 * linje et kildeavsnitt, og en linje som peker på et avsnitt som ikke finnes,
 * eller på en overskrift, gjør verset ugyldig.
 */

import { z } from "zod";
import type { Avsnitt } from "../tekst/avsnittsdeling";
import { GeneratorFeil, formaterAvsnitt, kjoerGenerator } from "./kontrakt";

export const MinneversSkjema = z.object({
  linjer: z
    .array(
      z.object({
        tekst: z.string().describe("Én linje i verset."),
        kildeavsnitt: z.number().int().describe("Avsnittet linjen bygger på. Aldri en overskrift."),
      }),
    )
    .describe("Fire til åtte linjer."),
  faguttrykk: z.array(z.string()).describe("Fagordene fra listen som er brukt, slik de står i listen."),
  stil: z.string().describe("Ved suno: musikkstilen på engelsk, høyst 120 tegn. Ved vers: tom streng."),
});

export type Versform = "vers" | "suno";

/** FR-30. */
export const MIN_LINJER = 4;
export const MAKS_LINJER = 8;
export const MIN_FAGUTTRYKK = 3;
export const MAKS_STIL = 120;
/**
 * Et minnevers har korte linjer. v1 ga linjer på opptil 25 stavelser — en
 * oppsummering med linjeskift, ikke et vers (funnet av utvikleren 17.10).
 * Prompten ber om seks til ti; koden avviser over fjorten. Grensen var tolv,
 * men lange fagord tar alene halve linjen («applikasjonsprogrammer» har seks
 * stavelser), og et vers om operativsystem ble avvist fire ganger på rad.
 */
export const MAKS_STAVELSER = 14;

/**
 * Stavelser, grovt: grupper av vokaler. Norsk har få diftonger utenom «ei»,
 * «øy», «au» og «ai», og de gir én gruppe her, som er riktig. Grovheten går
 * begge veier med en stavelse eller to, og grensen er satt med slingring.
 */
export function stavelser(linje: string): number {
  return (linje.toLowerCase().match(/[aeiouyæøå]+/g) ?? []).length;
}

/** Høyst så mange forsøk før generatoren gir opp (AD-11). */
const FORSOEK = 2;

export type Minneversresultat = {
  form: Versform;
  linjer: string[];
  /** Kildeavsnittet til hver linje, i samme rekkefølge (§5). */
  kildeavsnitt: number[];
  /** Fagordene i verset, slik de står i Begrepssettet. */
  faguttrykk: string[];
  /** Tom ved vers. */
  stil: string;
  promptversjon: string;
  modell: string;
};

const ORDTEGN = /[\p{L}\p{N}]/u;

/**
 * Står uttrykket i verset, i grunnform eller en vanlig bøyning? Treffet må
 * begynne på en ordgrense; etter uttrykket tillates en kort bøyningsendelse
 * («mitose» → «mitosen», «mitosene»), men ikke et helt nytt ord.
 */
export function brukesIVers(uttrykk: string, vers: string): boolean {
  const h = vers.toLowerCase();
  const naal = uttrykk.trim().toLowerCase();
  if (naal.length === 0) return false;
  for (let i = h.indexOf(naal); i !== -1; i = h.indexOf(naal, i + 1)) {
    const foer = h[i - 1];
    if (foer && ORDTEGN.test(foer)) continue;
    let slutt = i + naal.length;
    let hale = 0;
    while (slutt < h.length && ORDTEGN.test(h[slutt])) {
      slutt++;
      hale++;
    }
    if (hale <= 3) return true;
  }
  return false;
}

/**
 * Den maskinelle delen av FR-31, og formkravene i FR-30. Tom liste betyr
 * at verset kan vises. Eksportert for testene.
 */
export function kontrollerVers(
  svar: z.infer<typeof MinneversSkjema>,
  form: Versform,
  begrepssett: string[],
  avsnitt: Avsnitt[],
): string[] {
  const brudd: string[] = [];
  const linjer = svar.linjer.map((l) => l.tekst.trim()).filter(Boolean);
  const brodtekst = new Set(avsnitt.filter((a) => !a.erOverskrift).map((a) => a.nummer));
  for (const l of svar.linjer) {
    if (l.tekst.trim() && !brodtekst.has(l.kildeavsnitt)) {
      brudd.push(`linjen «${l.tekst.trim()}» peker på avsnitt ${l.kildeavsnitt}, som ikke er et brødtekstavsnitt`);
    }
  }
  const vers = linjer.join("\n");
  const sett = new Map(begrepssett.map((b) => [b.trim().toLowerCase(), b.trim()]));

  if (linjer.length < MIN_LINJER || linjer.length > MAKS_LINJER) {
    brudd.push(`${linjer.length} linjer, skal være ${MIN_LINJER}–${MAKS_LINJER}`);
  }
  for (const l of linjer) {
    const n = stavelser(l);
    if (n > MAKS_STAVELSER) brudd.push(`linjen «${l}» har ${n} stavelser, høyst ${MAKS_STAVELSER}`);
  }
  for (const f of svar.faguttrykk) {
    if (!sett.has(f.trim().toLowerCase())) brudd.push(`«${f}» står ikke i Begrepssettet`);
  }
  // Det som teller, er hva som faktisk står i verset — ikke hva modellen sier
  // den har brukt.
  const brukt = [...sett.values()].filter((b) => brukesIVers(b, vers));
  if (brukt.length < MIN_FAGUTTRYKK) {
    brudd.push(`${brukt.length} Faguttrykk fra Begrepssettet i verset, skal være minst ${MIN_FAGUTTRYKK}`);
  }
  if (form === "suno") {
    const stil = svar.stil.trim();
    if (stil.length === 0) brudd.push("Suno-prompten mangler stil");
    if (stil.length > MAKS_STIL) brudd.push(`stilen er ${stil.length} tegn, høyst ${MAKS_STIL}`);
  }
  return brudd;
}

export async function lagMinnevers({
  avsnitt,
  begreper,
  form,
  overstyrVersjon,
}: {
  avsnitt: Avsnitt[];
  begreper: { uttrykk: string; forklaring: string }[];
  form: Versform;
  overstyrVersjon?: string;
}): Promise<Minneversresultat> {
  if (begreper.length < MIN_FAGUTTRYKK) {
    throw new GeneratorFeil(
      "ugyldig_utdata",
      `Teksten har for få fagord til et minnevers — det trengs minst ${MIN_FAGUTTRYKK}.`,
      "Prøv øvekortene eller quizen i stedet.",
    );
  }
  const begrepssett = begreper.map((b) => b.uttrykk);
  const melding = [
    `type: ${form}`,
    `fagord: ${JSON.stringify(begreper.map((b) => ({ uttrykk: b.uttrykk, forklaring: b.forklaring })))}`,
    "",
    formaterAvsnitt(avsnitt),
  ].join("\n");

  let sisteBrudd: string[] = [];
  for (let k = 1; k <= FORSOEK; k++) {
    const r = await kjoerGenerator({
      oppgave: "minnevers",
      skjema: MinneversSkjema,
      brukermelding: melding,
      overstyrVersjon,
      // Rim krever mer tenking enn oppramsing: med 4000 gikk sju av ti v2-kall
      // tom for tokens før svaret var ferdig (17.10).
      maksTokens: 16000,
      kjoering: k === 1 ? undefined : k,
    });
    sisteBrudd = kontrollerVers(r.data, form, begrepssett, avsnitt);
    if (sisteBrudd.length === 0) {
      const gyldige = r.data.linjer.filter((l) => l.tekst.trim());
      const linjer = gyldige.map((l) => l.tekst.trim());
      const vers = linjer.join("\n");
      return {
        form,
        linjer,
        kildeavsnitt: gyldige.map((l) => l.kildeavsnitt),
        faguttrykk: begrepssett.filter((b) => brukesIVers(b, vers)),
        stil: form === "suno" ? r.data.stil.trim() : "",
        promptversjon: r.promptversjon,
        modell: r.modell,
      };
    }
  }
  throw new GeneratorFeil(
    "ugyldig_utdata",
    "Lesevenn fikk ikke laget et vers som holdt seg til fagordene i teksten.",
    "Prøv igjen. Får du det ikke til, er øvekortene en god måte å pugge fagordene på.",
    new Error(sisteBrudd.join("; ")),
  );
}
