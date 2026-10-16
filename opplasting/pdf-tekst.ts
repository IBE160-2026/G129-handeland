/**
 * Fra tekstbitene i en PDF til Råtekst — FR-2, FR-4. Rene funksjoner.
 *
 * pdfjs gir en liste med tekstbiter per side, hver med posisjon og
 * skriftstørrelse. Herfra bygges linjer, så avsnitt, og topp-/bunntekst og
 * orddeling håndteres etter reglene i FR-2. Ingenting her vet om pdfjs eller
 * nettleseren, så alt kan testes med konstruerte sider.
 *
 * Sidegrensene bevares helt til slutt, fordi PF-1 regnes som tegn per side
 * (AGENTS.md: «Sidegrenser maa bevares ved PDF-uttrekk»).
 */

/** Grensene i FR-1, FR-2 og FR-4. Ett sted, så melding og sjekk aldri spriker. */
export const GRENSER = {
  /** FR-2: filer over dette avvises før uttrekk. */
  maksBytes: 10 * 1024 * 1024,
  /** FR-2: og filer med flere sider enn dette. */
  maksSider: 40,
  /** FR-1: lengre tekst kuttes ikke stille — eleven velger. */
  maksTegn: 8000,
  /** PF-1: under dette i snitt per side ser filen ut som et bilde. */
  minTegnPerSide: 100,
  /** PF-6: under dette totalt er det for lite til en leseløype. */
  minTegnTotalt: 400,
  /** FR-2: uttrekket fullføres eller feiler innen dette. */
  tidsavbruddMs: 20_000,
} as const;

export type Tekstbit = { str: string; x: number; y: number; h: number };
export type Linje = { tekst: string; y: number; h: number };

/**
 * Tekstbitene på én side, gruppert i linjer ovenfra og ned. Biter med nesten
 * samme høyde på siden (y) hører til samme linje; innenfor en linje sorteres
 * de fra venstre.
 */
export function linjerPaaSide(biter: Tekstbit[]): Linje[] {
  const synlige = biter.filter((b) => b.str.trim().length > 0);
  const grupper: Tekstbit[][] = [];
  for (const b of [...synlige].sort((a, c) => c.y - a.y || a.x - c.x)) {
    const g = grupper.find((x) => Math.abs(x[0].y - b.y) < Math.max(2, b.h * 0.4));
    if (g) g.push(b);
    else grupper.push([b]);
  }
  return grupper.map((g) => {
    const sortert = g.sort((a, c) => a.x - c.x);
    const tekst = sortert
      .map((b) => b.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    return { tekst, y: sortert[0].y, h: Math.max(...sortert.map((b) => b.h)) };
  });
}

/** Nøkkelen to linjer sammenlignes på: tall byttes ut, så «Side 3» og «Side 4» er like. */
function nokkel(tekst: string): string {
  return tekst.toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim();
}

/**
 * FR-2: linjer som gjentas på mer enn halvparten av sidene, fjernes som topp-
 * og bunntekst. Det gjelder bare filer med minst to sider — på én side ville
 * hver linje gjentatt seg på «alle» sider. De fjernede linjene returneres,
 * så eleven kan se dem i gjennomsynet; ingenting slettes i det skjulte.
 */
export function fjernToppOgBunntekst(sider: Linje[][]): { sider: Linje[][]; fjernet: string[] } {
  if (sider.length < 2) return { sider, fjernet: [] };

  // Bare linjene ytterst på siden kan være topp- eller bunntekst. Uten den
  // begrensningen ble «Innhold 1» og «Innhold 2» midt på sidene regnet som
  // like (tallene byttes ut i nøkkelen) og fjernet — funnet av testen.
  const KANT = 2;
  const kantlinjer = (side: Linje[]) => new Set([...side.slice(0, KANT), ...side.slice(-KANT)]);

  const sidetall = new Map<string, number>();
  for (const side of sider) {
    for (const k of new Set([...kantlinjer(side)].map((l) => nokkel(l.tekst)))) {
      sidetall.set(k, (sidetall.get(k) ?? 0) + 1);
    }
  }
  const gjentatt = new Set([...sidetall].filter(([, n]) => n >= 2 && n > sider.length / 2).map(([k]) => k));
  const fjernet: string[] = [];
  const vasket = sider.map((side) => {
    const kant = kantlinjer(side);
    return side.filter((l) => {
      if (!kant.has(l) || !gjentatt.has(nokkel(l.tekst))) return true;
      fjernet.push(l.tekst);
      return false;
    });
  });
  return { sider: vasket, fjernet };
}

const LITEN = /\p{Ll}/u;

/**
 * FR-2: orddeling over linjeskift. Slås sammen når tegnet før bindestreken og
 * tegnet etter linjeskiftet begge er små bokstaver («informa-» + «sjon»);
 * bindestreken beholdes når en av sidene er stor bokstav eller siffer
 * («KI-» + «assistert», «20-» + «åring»). Kjent begrensning: ekte
 * bindestreksord med små bokstaver på begge sider slås feilaktig sammen —
 * gjennomsynet i FR-3 fanger dem.
 */
export function skjoet(forrige: string, neste: string): { tekst: string; slaattSammen: boolean } {
  if (forrige.endsWith("-") && forrige.length >= 2) {
    const foer = forrige.at(-2)!;
    const etter = neste.charAt(0);
    if (LITEN.test(foer) && LITEN.test(etter)) {
      return { tekst: forrige.slice(0, -1) + neste, slaattSammen: true };
    }
    return { tekst: forrige + neste, slaattSammen: false };
  }
  return { tekst: `${forrige} ${neste}`, slaattSammen: false };
}

/**
 * Bygger Råteksten: avsnitt skilles med en tom linje, slik delIAvsnitt (AD-12)
 * forventer. Nytt avsnitt når mellomrommet til forrige linje er tydelig større
 * enn vanlig linjeavstand, når skriftstørrelsen skifter (en overskrift), og
 * ved hvert sideskift.
 */
export function byggTekst(sider: Linje[][]): { tekst: string; sammenslaatte: number } {
  let sammenslaatte = 0;
  const avsnitt: string[] = [];

  for (const side of sider) {
    let gjeldende: string | null = null;
    let forrige: Linje | null = null;
    for (const l of side) {
      const nyttAvsnitt =
        forrige === null ||
        forrige.y - l.y > 1.5 * Math.max(forrige.h, l.h) ||
        Math.abs(forrige.h - l.h) > 1.5;
      if (nyttAvsnitt || gjeldende === null) {
        if (gjeldende !== null) avsnitt.push(gjeldende);
        gjeldende = l.tekst;
      } else {
        const s = skjoet(gjeldende, l.tekst);
        gjeldende = s.tekst;
        if (s.slaattSammen) sammenslaatte++;
      }
      forrige = l;
    }
    if (gjeldende !== null) avsnitt.push(gjeldende);
  }

  return { tekst: avsnitt.join("\n\n"), sammenslaatte };
}

/** PF-1 og PF-6, etter terskelene i FR-4. Regnet på teksten før topp/bunn-fjerning. */
export function vurderMengde(tegnPerSide: number[]): "PF-1" | "PF-6" | null {
  const totalt = tegnPerSide.reduce((a, b) => a + b, 0);
  const snitt = tegnPerSide.length ? totalt / tegnPerSide.length : 0;
  if (snitt < GRENSER.minTegnPerSide) return "PF-1";
  if (totalt < GRENSER.minTegnTotalt) return "PF-6";
  return null;
}

/**
 * FR-3: «Inneholder Råteksten tabeller eller formler, varsles eleven.»
 * En grov heuristikk, og den sier det: matematiske tegn, eller flere linjer der
 * de fleste ordene er tall. Bommer den, får eleven en advarsel for mye, ikke
 * en for lite — og advarselen ber bare om å se ekstra nøye etter.
 */
export function muligTabellEllerFormel(tekst: string): boolean {
  const formeltegn = (tekst.match(/[=∑∫√±≤≥×÷∆π^]/g) ?? []).length;
  const talllinjer = tekst
    .split("\n")
    .filter((l) => {
      const ord = l.trim().split(/\s+/).filter(Boolean);
      return ord.length >= 3 && ord.filter((o) => /^[\d.,%-]+$/.test(o)).length / ord.length > 0.5;
    }).length;
  return formeltegn >= 3 || talllinjer >= 3;
}

/* ------------------------------------------------------------------ *
 * FR-1 — taket på 8 000 tegn, felles for liming og PDF
 * ------------------------------------------------------------------ */

/**
 * Kutter teksten ved siste avsnittsgrense før taket — eller siste
 * setningsslutt, om det ikke finnes noen avsnittsgrense. Aldri midt i et ord.
 * Kuttpunktet returneres, så det kan vises for eleven (FR-1: «synlig markert»).
 */
export function kuttVedTak(tekst: string, tak: number = GRENSER.maksTegn): { tekst: string; kuttet: boolean; restTegn: number } {
  if (tekst.length <= tak) return { tekst, kuttet: false, restTegn: 0 };
  const del = tekst.slice(0, tak);
  let kutt = del.lastIndexOf("\n\n");
  if (kutt < tak * 0.5) {
    const setning = Math.max(del.lastIndexOf(". "), del.lastIndexOf("? "), del.lastIndexOf("! "));
    kutt = setning > tak * 0.5 ? setning + 1 : del.lastIndexOf(" ");
  }
  if (kutt <= 0) kutt = tak;
  const beholdt = tekst.slice(0, kutt).trimEnd();
  return { tekst: beholdt, kuttet: true, restTegn: tekst.length - beholdt.length };
}
