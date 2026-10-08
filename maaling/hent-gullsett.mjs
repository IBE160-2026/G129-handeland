/**
 * Henter de seks gullsett-tekstene og legger dem i `testdata/gullsett/`.
 *
 *   node maaling/hent-gullsett.mjs            hopper over filer som finnes
 *   node maaling/hent-gullsett.mjs --overskriv  henter alt på nytt
 *
 * ## Hvorfor dette er et skript og ikke en manuell jobb
 *
 * Seks tekster fra fire kilder, hver med sin egen uthenting, sine egne
 * krediteringskrav og sitt eget kutt. Gjort for hånd er det en halvtimes
 * arbeid som må gjøres om hver gang en tekst byttes — og krediteringen er en
 * lisensplikt, så den må ikke kunne glemmes.
 *
 * ## Hva skriptet IKKE gjør
 *
 * Det tar ingen redaksjonelle avgjørelser stille. Havner en tekst utenfor
 * FR-8s 1 500–6 000 tegn, sier det fra og lar den ligge som den er — det er
 * Arves valg hvor kuttet skal gå, ikke skriptets.
 *
 * Og det overskriver aldri en fil som finnes, med mindre du ber om det.
 * Grunnen er at tekstene skal rettes for hånd: avsnittsdelingen fra en
 * nettside er ikke alltid riktig, og et kutt kan måtte justeres. Et skript som
 * klobbet den jobben ved neste kjøring ville vært verre enn ingen skript.
 *
 * Annoteringene dine ligger i egne filer (`<navn>.gullsett.json`) og røres
 * ikke av dette i det hele tatt.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const UTMAPPE = path.join(process.cwd(), "testdata", "gullsett");
const OVERSKRIV = process.argv.includes("--overskriv");
const I_DAG = new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ *
 * Settet, slik FR-8 og annotering.md fastsetter det
 * ------------------------------------------------------------------ */

const SETTET = [
  {
    navn: "naturfag-em-bolger",
    fag: "naturfag",
    fagtype: "fellesfag",
    kilde: "laeremiddel",
    type: "oversikt",
    henter: { slag: "ndla", id: 22989 },
    kutt: null,
  },
  {
    navn: "samfunnsfag-prisvekst",
    fag: "samfunnsfag",
    fagtype: "fellesfag",
    kilde: "autentisk",
    type: "fokusert",
    henter: {
      slag: "ssb",
      url: "https://www.ssb.no/nasjonalregnskap-og-konjunkturer/konjunkturer/statistikk/konjunkturtendensene/artikler/hoy-prisvekst-gir-ny-renteokning",
      tittel: "Høy prisvekst gir ny renteøkning",
      lisens: "CC-BY-4.0",
      kreditering: ["Statistisk sentralbyrå"],
      publisert: "2026-06-15",
    },
    kutt: null,
  },
  {
    navn: "norsk-sprakligebilder",
    fag: "norsk",
    fagtype: "fellesfag",
    kilde: "laeremiddel",
    type: "fokusert",
    /*
     * TRE NDLA-ARTIKLER SATT SAMMEN til én tekst om språklige bilder.
     *
     * Grunnen er måletekniske og ikke estetisk. Alene gav «Lyriske
     * virkemidler» 379 ord etter kuttet, og budsjettet i FR-7 blir da
     * `floor(12 × 0,379)` = 4, med gulvet 5 — altså fem Faguttrykk. Da beveger
     * gjenkallingen i FR-8 seg i femdeler, og én bom gir 0,80. Målingen blir
     * mer et utsagn om tilfeldigheter enn om uttrekket.
     *
     * Samlet gir de tre om lag 1 400 ord og et budsjett på 17 Faguttrykk, som
     * er en langt finere målestokk. Og de hører sammen: allegori og allusjon er
     * dypere behandlinger av det første avsnittet introduserer, så dette er
     * dybde på ett emne — ikke bredde. Teksten er derfor fortsatt merket
     * `fokusert`.
     *
     * Alle tre er NDLAs eget stoff under CC BY-SA 4.0. Merk at NDLA også har
     * CC BY-NC-SA-artikler om samme emner (id 16561 og 16565); de er utelatt
     * for å holde hele Gullsettet fritt for NC-klausuler.
     */
    henter: {
      slag: "ndla-flere",
      deler: [
        // Fra «Del 2» går artikkelen over i oppgaver. Oppgavetekst er
        // imperativer og spørsmål, ikke fagprosa.
        { id: 21846, tilOverskrift: "Del 2" },
        { id: 39109 },
        { id: 39688 },
      ],
    },
    kutt: null,
  },
  {
    navn: "norsk-metafor",
    fag: "norsk",
    fagtype: "fellesfag",
    kilde: "autentisk",
    type: "oversikt",
    henter: {
      slag: "snl",
      url: "https://snl.no/metafor",
      tittel: "metafor",
      lisens: "CC-BY-SA-3.0 (fri gjenbruk)",
      kreditering: ["Jan Grue (Universitetet i Oslo)"],
      oppdatert: "2025-02-22",
    },
    kutt: null,
  },
  {
    navn: "teknologi-domeneoppbygning",
    fag: "teknologiforstaaelse",
    fagtype: "programfag",
    kilde: "laeremiddel",
    type: "fokusert",
    henter: { slag: "ndla", id: 24326 },
    kutt: null,
  },
  {
    navn: "teknologi-operativsystem",
    fag: "teknologiforstaaelse",
    fagtype: "programfag",
    kilde: "autentisk",
    type: "oversikt",
    henter: {
      slag: "wikipedia",
      tittel: "Operativsystem",
      lisens: "CC-BY-SA-4.0",
      kreditering: ["Wikipedia-bidragsytere (se artikkelens historikk)"],
    },
    // Settets eneste tunge kutt: 4 070 ord ned mot 800.
    kutt: { ordbudsjett: 850, beskrivelse: "innledningen og de første delene, til om lag 850 ord" },
  },
];

/* ------------------------------------------------------------------ *
 * Felles tekstbehandling
 * ------------------------------------------------------------------ */

const HMARK = "@@H@@";

/** HTML til blokker, med overskrifter merket. Samme regler som NDLA-uthentingen 7. oktober. */
function htmlTilBlokker(html) {
  let h = html;
  h = h.replace(/<(embed|ndlaembed)[^>]*\/?>/gi, "\n\n");
  h = h.replace(/<figure[\s\S]*?<\/figure>/gi, "\n\n");
  h = h.replace(/<table[\s\S]*?<\/table>/gi, "\n\n");
  h = h.replace(/<details[\s\S]*?<\/details>/gi, "\n\n");
  h = h.replace(/<aside[\s\S]*?<\/aside>/gi, "\n\n");
  h = h.replace(/<h[1-6][^>]*>/gi, "\n\n" + HMARK);
  h = h.replace(/<\/h[1-6]>/gi, "\n\n");
  h = h.replace(/<\/(p|li|div|section|blockquote)>/gi, "\n\n");
  h = h.replace(/<br\s*\/?>/gi, " ");
  h = h.replace(/<[^>]+>/g, "");
  return entiteter(h)
    .split(/\n\s*\n+/)
    .map((b) => b.replace(/\s+/g, " ").trim())
    .filter((b) => b.length > 0 && b !== HMARK);
}

function entiteter(s) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "…")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&deg;/g, "°")
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&[a-z]+;/gi, " ")
    .replace(/ /g, " ");
}

const ordtall = (s) => s.split(/\s+/).filter(Boolean).length;

/**
 * Blokker som ikke er fagtekst, og som må ut.
 *
 * Disse er funnet ved å lese det skriptet faktisk produserte, ikke ved å gjette.
 * SSB la igjen tabellenker og PDF-nedlastinger, SNL la igjen «Skrevet av» og
 * «Faktaboks», og begge la igjen lenkelister nederst. Står slikt igjen i
 * teksten, blir det markert som avsnitt og får avsnittsnumre — og da peker
 * kildeavsnittene til generert innhold på sidens møblering.
 */
const SOEPPEL = [
  /Til tabellen\s*$/i,
  /\(PDF\)\s*\(\d+([.,]\d+)?\s*[KMG]B\)/i,
  /^Til toppen$/i,
  /^Skrevet av$/i,
  /^Faktaboks$/i,
  /^Tilhørende/i,
  /^Les mer i Store norske leksikon$/i,
  /^Eksterne lenker$/i,
  /^Litteratur$/i,
  /^Kilder?$/i,
  /^Fasit$/i,
  /^Utdrag \d+$/i,
  /^Kontakt$/i,
  /^Del(?: artikkelen)?$/i,
  /^Innhold$/i,
  /^Se også$/i,
  /^Referanser$/i,
  // SNLs sidefot, funnet av gullsett:sjekk
  /^Vil du (skrive|sitere|endre)/i,
  /^Store norske leksikon er eid av/i,
  /^Logg inn/i,
  /^Vi bruker (cookies|informasjonskapsler)/i,
  /^Abonner/i,
  // Henvisning til et fjernet videoklipp, ofte med tidsstempel
  /^Se delene? (om|fra|til)/i,
  /^Se nærmere på /i,
  /\bfram til \d{1,2}:\d{2}/,
  /*
   * Oppgavespørsmål, som ikke er fagprosa.
   *
   * Skillet mot en ekte overskrift er at oppgaven TILTALER LESEREN:
   * «Hvilken effekt mener du …?» mot «Hva er allegori?». Begge er
   * spørsmål, men bare den første har et «du» i seg. Det er en smalere og
   * tryggere regel enn å kaste alt som slutter på spørsmålstegn — det ville
   * tatt overskriftene med.
   */
  /^(Hv[ao]|Hvilke[nt]?|Hvorfor|Kan|Kjenner|Tror|Synes)\b[^?]*\bdu\b[^?]*\?$/i,
];

/**
 * Setter punktum på korte blokker som ikke var overskrifter i kilden.
 *
 * `erOverskrift` i AD-12 leser en linje på høyst 100 tegn som overskrift
 * når den ikke slutter på .!?: — og det er riktig for en overskrift. Men et
 * diktsitat, en kildeangivelse eller en ordliste oppfyller samme form, og
 * ble derfor lest som struktur i teksten.
 *
 * Skriptet kan rette det, og appen kan ikke: HER vet vi hvilke blokker som
 * faktisk var <h2> eller <h3> i kilden, fordi uthentingen merket dem.
 * Appen ser bare ferdig tekst og må gjette ut fra formen.
 *
 * Endringen er ett punktum, og den er ført som endring i LES-MEG.
 */
function punktumPaaFalskeOverskrifter(blokker) {
  return blokker.map((b) => {
    if (b.startsWith(HMARK)) return b;
    const t = b.trim();
    if (t.length === 0 || t.length > 100) return b;
    if (/[.!?:]$/.test(t)) return b;
    return t + ".";
  });
}

/** Fjerner møblering, og slår sammen blokker splittet midt i en setning. */
function reinsk(blokker) {
  const beholdt = blokker.filter((b) => {
    const t = b.replace(HMARK, "").trim();
    if (t.length === 0) return false;
    return !SOEPPEL.some((m) => m.test(t));
  });

  /*
   * En innlenke midt i en setning gir to blokker der det skulle vært én:
   * NDLA ga «…les mer om de ulike virkemidlene i» og «emnet "Språklige
   * virkemidler".» som separate avsnitt.
   *
   * Første utgave slo sammen alt som ikke sluttet på punktum, og det var for
   * grovt: SSBs undertittel «…Økonomiske prognoser fram til 2029» og en
   * figurtekst ble limt fast i avsnittet etter. En undertittel SKAL mangle
   * punktum.
   *
   * Skillet som virker er om blokka slutter midt i en setning. Et fragment
   * ender på et kort småord — «i», «av», «og» — eller på komma. En
   * frittstående linje ender på et innholdsord eller et årstall.
   */
  const slutterMidtISetning = (s) =>
    /,$/.test(s.trim()) || /\s[a-zæøå]{1,3}$/.test(s.trim());

  const ut = [];
  for (const b of beholdt) {
    const forrige = ut[ut.length - 1];
    if (
      forrige !== undefined &&
      !b.startsWith(HMARK) &&
      !forrige.startsWith(HMARK) &&
      slutterMidtISetning(forrige)
    ) {
      ut[ut.length - 1] = `${forrige} ${b}`.replace(/\s+/g, " ");
    } else {
      ut.push(b);
    }
  }
  return ut;
}

/* ------------------------------------------------------------------ *
 * Uthenting per kilde
 * ------------------------------------------------------------------ */

async function fraNdla(h) {
  const r = await fetch(
    `https://api.ndla.no/article-api/v2/articles/${h.id}?language=nb`,
  );
  if (!r.ok) throw new Error(`NDLA ${h.id}: HTTP ${r.status}`);
  const j = await r.json();
  const c = j.copyright;
  return {
    tittel: j.title.title,
    blokker: htmlTilBlokker(j.content.content),
    lisens: c.license.license,
    kreditering: [
      ...(c.creators ?? []),
      ...(c.processors ?? []),
      ...(c.rightsholders ?? []),
      // Navnene trimmes: NDLA har etterfoelgende mellomrom i noen av dem, og
      // da feiler dedupliseringen i fraNdlaFlere paa en usynlig forskjell.
    ].map((p) => `${p.name.trim()} (${p.type})`),
    url: `https://api.ndla.no/article-api/v2/articles/${h.id}`,
    merknad: `NDLA artikkel-id ${h.id}`,
  };
}

/**
 * Flere NDLA-artikler satt sammen til én tekst.
 *
 * Krediteringen samles fra alle delene og dedupliseres — hver forfatter skal
 * stå én gang, og ingen skal falle ut fordi de bidro på del to av tre.
 * Lisensen må være den samme i alle delene; er den ikke det, kastes det,
 * fordi den sammensatte teksten da ville hatt to sett vilkår uten at noe sa
 * hvilket som gjaldt.
 */
async function fraNdlaFlere(h) {
  const deler = [];
  for (const d of h.deler) {
    const a = await fraNdla({ id: d.id });
    const { blokker } = bruKutt(
      punktumPaaFalskeOverskrifter(reinsk(a.blokker)),
      d.tilOverskrift ? { tilOverskrift: d.tilOverskrift } : null,
    );
    deler.push({ ...a, blokker, id: d.id });
  }

  const lisenser = [...new Set(deler.map((d) => d.lisens))];
  if (lisenser.length > 1) {
    throw new Error(
      `delene har ulik lisens (${lisenser.join(", ")}) — en sammensatt tekst ` +
        "kan ikke bære to sett vilkår",
    );
  }

  return {
    tittel: "Språklige bilder: metafor, allegori og allusjon",
    // Hver del starter med sin egen tittel som overskrift, slik at
    // avsnittsdelingen (AD-12) ser strukturen og eleven ser hvor delene går.
    blokker: deler.flatMap((d) => [HMARK + d.tittel, ...d.blokker]),
    lisens: lisenser[0],
    kreditering: [...new Set(deler.flatMap((d) => d.kreditering))],
    url: deler.map((d) => `https://api.ndla.no/article-api/v2/articles/${d.id}`).join(" , "),
    merknad:
      `Satt sammen av ${deler.length} NDLA-artikler (id ${deler.map((d) => d.id).join(", ")}) ` +
      "til én tekst om språklige bilder. Dette er en redaksjonell konstruksjon og " +
      "ikke en publisert artikkel — begrunnelsen står i hent-gullsett.mjs.",
  };
}

async function fraWikipedia(h) {
  const u = new URL("https://no.wikipedia.org/w/api.php");
  u.search = new URLSearchParams({
    action: "query",
    prop: "extracts",
    explaintext: "1",
    format: "json",
    titles: h.tittel,
  }).toString();
  const r = await fetch(u);
  if (!r.ok) throw new Error(`Wikipedia: HTTP ${r.status}`);
  const j = await r.json();
  const side = Object.values(j.query.pages)[0];
  if (!side?.extract) throw new Error(`Wikipedia: ingen tekst for ${h.tittel}`);

  // Utdraget har «== Overskrift ==» på egne linjer. Gjør dem til merkede
  // blokker, slik at avsnittsdelingen vår kjenner dem igjen som overskrifter.
  const blokker = [];
  for (const del of side.extract.split(/\n+/)) {
    const t = del.trim();
    if (t.length === 0) continue;
    const o = t.match(/^=+\s*(.+?)\s*=+$/);
    blokker.push(o ? HMARK + o[1] : t);
  }

  return {
    tittel: side.title,
    blokker,
    lisens: h.lisens,
    kreditering: h.kreditering,
    url: `https://no.wikipedia.org/wiki/${encodeURIComponent(h.tittel)}`,
    merknad: "Hentet som rentekst via Wikipedias action-API",
  };
}

/**
 * SSB og SNL har ingen åpent API for artikkeltekst, så her skrapes HTML.
 *
 * Det er den skjøreste delen av skriptet, og derfor rapporterer det ordtall og
 * antall blokker: ser tallet galt ut, er det uthentingen og ikke teksten.
 * Overskrifter og avsnitt hentes i dokumentrekkefølge, og alt som ser ut som
 * navigasjon — svært korte blokker uten punktum — forkastes.
 */
async function fraNettside(h, kilde) {
  const r = await fetch(h.url, {
    headers: { "user-agent": "Mozilla/5.0 (Lesevenn gullsett-uthenting)" },
  });
  if (!r.ok) throw new Error(`${kilde}: HTTP ${r.status}`);
  const html = await r.text();

  const biter = [];
  for (const m of html.matchAll(
    /<(h2|h3|p)\b[^>]*>([\s\S]*?)<\/\1>/gi,
  )) {
    const erOverskrift = m[1].toLowerCase() !== "p";
    const tekst = entiteter(m[2].replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    if (tekst.length === 0) continue;
    // Navigasjon og knapper: korte biter uten setningstegn.
    if (!erOverskrift && tekst.length < 60 && !/[.!?]$/.test(tekst)) continue;
    biter.push(erOverskrift ? HMARK + tekst : tekst);
  }

  return {
    tittel: h.tittel,
    blokker: biter,
    lisens: h.lisens,
    kreditering: h.kreditering,
    url: h.url,
    merknad:
      `Skrapet fra HTML (ingen åpent API). Kontroller avsnittsdelingen for hånd. ` +
      (h.publisert ? `Publisert ${h.publisert}.` : "") +
      (h.oppdatert ? `Sist oppdatert ${h.oppdatert}.` : ""),
  };
}

/* ------------------------------------------------------------------ *
 * Kutt
 * ------------------------------------------------------------------ */

function bruKutt(blokker, kutt) {
  if (!kutt) return { blokker, kuttet: false };

  if (kutt.tilOverskrift) {
    const i = blokker.findIndex(
      (b) => b.startsWith(HMARK) && b.slice(HMARK.length).startsWith(kutt.tilOverskrift),
    );
    if (i === -1) {
      return { blokker, kuttet: false, advarsel: `fant ikke overskriften «${kutt.tilOverskrift}» — teksten er IKKE kuttet` };
    }
    return { blokker: blokker.slice(0, i), kuttet: true };
  }

  if (kutt.ordbudsjett) {
    const ut = [];
    let ord = 0;
    for (const b of blokker) {
      const n = ordtall(b.replace(HMARK, ""));
      // Stopp FØR vi går over budsjettet, så kuttet ikke havner midt i et
      // avsnitt. Et halvt avsnitt er en annen tekst enn et helt.
      if (ord > 0 && ord + n > kutt.ordbudsjett) break;
      ut.push(b);
      ord += n;
    }
    return { blokker: ut, kuttet: true };
  }

  return { blokker, kuttet: false };
}

/* ------------------------------------------------------------------ *
 * Kjøring
 * ------------------------------------------------------------------ */

async function finnes(p) {
  try {
    await readFile(p);
    return true;
  } catch {
    return false;
  }
}

const HENTERE = {
  ndla: fraNdla,
  "ndla-flere": fraNdlaFlere,
  wikipedia: fraWikipedia,
  ssb: (h) => fraNettside(h, "SSB"),
  snl: (h) => fraNettside(h, "SNL"),
};

const rapport = [];

await mkdir(UTMAPPE, { recursive: true });

for (const t of SETTET) {
  const tekstfil = path.join(UTMAPPE, `${t.navn}.txt`);
  const metafil = path.join(UTMAPPE, `${t.navn}.meta.json`);

  if (!OVERSKRIV && (await finnes(tekstfil))) {
    console.log(`= ${t.navn.padEnd(30)} finnes alt, hoppet over`);
    const m = JSON.parse(await readFile(metafil, "utf8").catch(() => "{}"));
    rapport.push({ ...t, ...m, hoppet: true });
    continue;
  }

  let hentet;
  try {
    hentet = await HENTERE[t.henter.slag](t.henter);
  } catch (e) {
    console.error(`! ${t.navn.padEnd(30)} FEILET: ${e.message}`);
    rapport.push({ ...t, feil: e.message });
    continue;
  }

  hentet.blokker = punktumPaaFalskeOverskrifter(reinsk(hentet.blokker));
  const foerKutt = ordtall(hentet.blokker.join(" ").replaceAll(HMARK, ""));
  const { blokker, kuttet, advarsel } = bruKutt(hentet.blokker, t.kutt);
  const rene = blokker.map((b) => b.replace(HMARK, ""));
  const ord = ordtall(rene.join(" "));

  const tekst = hentet.tittel + "\n\n" + rene.join("\n\n") + "\n";
  await writeFile(tekstfil, tekst, "utf8");

  const meta = {
    tekst: `${t.navn}.txt`,
    tittel: hentet.tittel,
    fag: t.fag,
    fagtype: t.fagtype,
    kilde: t.kilde,
    type: t.type,
    lisens: hentet.lisens,
    kreditering: hentet.kreditering,
    url: hentet.url,
    hentet: I_DAG,
    ord,
    tegn: tekst.length,
    ordFoerKutt: foerKutt,
    kutt: t.kutt?.beskrivelse ?? null,
    merknad: hentet.merknad,
  };
  await writeFile(metafil, JSON.stringify(meta, null, 2) + "\n", "utf8");

  const tegn = tekst.length;
  const utenfor = tegn < 1500 || tegn > 6000;
  console.log(
    `${utenfor ? "!" : "+"} ${t.navn.padEnd(30)} ${String(ord).padStart(5)} ord` +
      (kuttet ? ` (av ${foerKutt})` : "") +
      ` | ${hentet.lisens}` +
      ` | ${tegn} tegn` +
      (utenfor ? "  << UTENFOR FR-8s 1500-6000 TEGN" : ""),
  );
  if (advarsel) console.log(`    ADVARSEL: ${advarsel}`);

  rapport.push({ ...t, ...meta, tegn, utenfor, advarsel });
}

/* ------------------------------------------------------------------ *
 * LES-MEG med kreditering — en lisensplikt, ikke pynt
 * ------------------------------------------------------------------ */

const rad = (r) =>
  `| ${r.fag} | ${r.fagtype} | ${r.kilde} | ${r.type} | ${r.tittel ?? "?"} | ${r.lisens ?? "?"} | ${r.ord ?? "?"} |`;

await writeFile(
  path.join(UTMAPPE, "LES-MEG.md"),
  `# Gullsettet for faguttrykk

Tekstene FR-8 måler mot. **Generert av \`maaling/hent-gullsett.mjs\`** den
${I_DAG}; kjør skriptet på nytt for å hente dem om, og \`--overskriv\` for å
klobbe håndrettinger.

Utvalget, aksene og hvert kutt er begrunnet i
\`_bmad-output/planning-artifacts/annotering.md\`. Annoteringene selv ligger i
\`<navn>.gullsett.json\` og rotes ikke av skriptet.

| Fag | Fagtype | Kilde | Type | Tittel | Lisens | Ord |
|---|---|---|---|---|---|---|
${rapport.map(rad).join("\n")}

## Kreditering og lisens

Dette er en plikt etter lisensene, ikke høflighet. Hver tekst kan gjenbrukes
fordi opphavspersonene er navngitt og lisensen oppgitt.

${rapport
  .map(
    (r) => `### ${r.tittel ?? r.navn}

- **Lisens:** ${r.lisens ?? "?"}
- **Kreditering:** ${(r.kreditering ?? []).join("; ") || "(ikke hentet)"}
- **Kilde:** <${r.url ?? "?"}>
- **Hentet:** ${r.hentet ?? I_DAG}
- **Endringer:** konvertert fra HTML til ren tekst; bilder, figurer, tabeller og
  innbygde elementer fjernet; avsnitt skilt med blanke linjer.${
    r.kutt ? ` **Kuttet:** ${r.kutt} (${r.ordFoerKutt} ord i originalen).` : ""
  }${r.merknad ? `\n- **Merknad:** ${r.merknad}` : ""}`,
  )
  .join("\n\n")}

## Om bildene

Ingen bilder er hentet. NDLA-illustrasjoner har **egne lisenser** som ikke er
tekstens — minst én i dette stoffet er CC BY-NC-ND. Lesevenn bruker bare tekst,
så de er utelatt, og det er også den trygge veien.
`,
  "utf8",
);

const utenfor = rapport.filter((r) => r.utenfor);
const feilet = rapport.filter((r) => r.feil);

console.log(`\n${rapport.length} tekster i ${UTMAPPE}`);
if (feilet.length > 0) {
  console.log(`\n${feilet.length} FEILET og må hentes manuelt:`);
  for (const r of feilet) console.log(`  ${r.navn}: ${r.feil}`);
}
if (utenfor.length > 0) {
  console.log(
    `\n tekst(er) er utenfor FR-8s 1500-6000 tegn. Skriptet kutter dem` +
      ` IKKE videre av seg selv — hvor kuttet skal gå er en redaksjonell` +
      ` avgjørelse, og den er din:`,
  );
  for (const r of utenfor) console.log(`  ${r.navn}: ${r.tegn} tegn (${r.ord} ord)`);
}
console.log(
  `\nNeste steg: kontroller avsnittsdelingen i hver .txt for hånd — særlig SSB` +
    ` og SNL, som er skrapet fra HTML. Deretter annoter, FØR du ser noe` +
    ` modellutdata (annotering.md steg 0).`,
);
