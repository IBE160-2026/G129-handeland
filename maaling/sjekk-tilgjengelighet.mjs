/**
 * Sjekker tilgjengelighetskravene i en ekte nettleser — §5, FR-10, FR-12.
 *
 *   npm run sjekk:tilgjengelighet
 *
 * Starter en Postgres i minnet og appen i testmodus `les`, og går gjennom
 * Kjerneløypen i Chrome slik en elev ville gjort: registrering, innliming av
 * eksempelteksten, aktivering, lesing (innlimt tekst har ikke gjennomsyn,
 * FR-3). Deretter:
 *
 *   - axe-core på hver side, på PC og på telefon (WCAG 2.1 A og AA)
 *   - FR-10: forklaringen åpnes med fokus, pekerhvil og trykk; lukkes med
 *     Escape, trykk utenfor og lukkeknappen; rulleposisjonen står stille
 *   - FR-12: tekststørrelsen endres og huskes etter ny innlasting
 *   - §5: hopp-lenken er det første tastaturet treffer
 *   - fokusringen: en fylt primærknapp får 3 px heltrukken ring i
 *     primærfargen når den nås med Tab (DESIGN.md, focus-ring)
 *   - mørk modus: axe på de samme sidene med colorScheme «dark»
 *   - §5 mobil: ingen side ruller sidelengs på en 375 px bred telefon
 *   - FR-48: tomt bord, hovedbunken med neste steg, viften som dialog
 *     (fem kort, fokus i dialogen, `inert`, Esc og «Legg sammen» gir fokus
 *     tilbake), og at Tab fra «+ Ny tekst» aldri treffer et usynlig element
 *   - FR-49: Samlinger, tittelen til neste steg, og søk uten treff
 *   - FR-50 til FR-52: en Mappe lages fra Samlinger, eksempelteksten legges
 *     til, og mappesiden, de samlede øvekortene og den samlede quizen sjekkes
 *     med axe på PC, i mørk modus og på telefon (uten sidelengs rulling);
 *     arbeidsbordet lenker til «Mappene dine»
 *   - 320 px og 200 % tekst: ingen sidelengs rulling og ingen klippet tekst
 *     på arbeidsbordet, i viften, i Samlinger og på Ny tekst
 *   - FR-47: landingssiden på `/` uten innlogging (200, ikke omdirigering),
 *     axe i lys og mørk modus, med og uten redusert bevegelse, uten
 *     JavaScript og på telefon; den statiske versjonen (alle steg, fire
 *     markerte fagord og forklaringslisten), ingen live-regioner, Følge-Buddy
 *     skjult for skjermlesere og bare fra 760 px ved vanlig tekst, og 320 px
 *     med 200 % tekst. Med SKJERMBILDE=<mappe> lagres skjermbilder av siden.
 *   - bolk 4, temavalget: «Utseende» på kontosiden setter informasjonskapselen
 *     (SameSite=Lax, ett år), med og uten JavaScript, og «Følg enheten» sletter
 *     den; axe med `tema=moerk` og systemet i lys modus, og omvendt, og at både
 *     tokenene og `dark:`-klassene følger valget fra første tegning
 *   - bolk 4, mobilfeilene: ingen tomrom over 160 px mellom fagorddemoen og
 *     neste seksjon på 375 px, og ingen tittel i en liten bunke brytes midt i
 *     et ord («Novelleanalyse» i to kolonner)
 *   - bolk 5, tenkepillen: på 375 px ligger tenkeindikatoren fast nederst mens
 *     quizen lages (mini-Buddy med brillene 28 px høye, én statusregion,
 *     `--tenker-pille` lik høyden), ingen knapp eller lenke ligger under den
 *     rullet til bunns og fokus havner aldri bak den (også med 200 % tekst),
 *     og axe er grønn mens den vises; på 1280 px er den flaten på 64 px som
 *     før. «Lever» med Buddy i knappen er låst med aria-disabled (fokus blir
 *     stående, opasitet ≥ 0,9, brillene om lag 20 px) og sender ikke to ganger
 *   - bolk 6, mobilflatene: på 375 px hilser Buddy (36 px) ved «Hei!», de små
 *     bunkene er striper i full bredde med «N av 5», og viften er et ark
 *     nederst (fem rader, fokusfelle, Esc, trykk på bakgrunnen, axe, aldri
 *     høyere enn 90 % av skjermen, og arket og «Legg sammen» innenfor
 *     skjermen; låste rader for en tekst som bare er lagt inn). Med 200 % tekst
 *     på 320 px ruller arket internt, og ingen tittel på en stripe deles midt
 *     i et ord. Fagorddemoen på landingssiden er trykkbar på telefon (knapper
 *     med aria-expanded og aria-controls, forklaringen under teksten, ingen
 *     aria-live, axe), og statisk uten JavaScript og ved redusert bevegelse
 *   - PRD §6.4, bruksgrensene: med 5 tekster i dag (hendelsesrader, talt fra
 *     midnatt i Oslo) viser /ny meldingen før innlesingen, og over dagstaket
 *     gir en ny quiz takmeldingen uten at noen quiz lages, på en egen låst
 *     tekst uten quiz (axe på begge). Det sjekken legger inn, ryddes bort
 *   - rotasjon over 760 px: landingssiden åpnes på 375 px, endres til 1280 px
 *     og tilbake (effekt A markerer spenn, trykkdemoen kommer tilbake), og
 *     arbeidsbordet med arket åpent går over til viften og tilbake uten
 *     skriptfeil og uten `inert`- eller `har-ark`-rester
 *   - FR-3 fase 3b: gjennomsynet via PDF og via bilde (tekster lagt rett inn
 *     i databasen i tilstand `aktivert`), axe i lys og mørk modus
 *   - FR-6 (glideren 23.11): på 375 px har hver overskrift i aktiveringen en
 *     glider (`input type=range`) navngitt av overskriften (legend) og
 *     beskrevet av «Hva vet du om dette fra før?» (én gang over
 *     overskriftene), med trinnmerkene «Ingenting ennå», «Litt», «Mye» og
 *     knappen «Skjønner ikke overskriften» (aria-pressed) under. Urørt sier
 *     den «Ikke merket ennå» og sender ingenting. Med tastaturet: Tab går
 *     glider → knapp → neste glider, mellomrom gir «Litt» fra urørt, → «Mye»,
 *     ← tilbake; knappen på gir «Satt til side» og `uklar`, av igjen gir
 *     urørt eller verdien glideren hadde, og ← etter knappen slår den av. Klikk
 *     på håndtaket i midten gir «Litt». Minst 44 px, synlig fokus, 320 px også
 *     med 200 % tekst, axe i lys og mørk modus. Lesevisningen viser «Før du
 *     leste» med spørsmålet, lenken og overskriften eleven ikke skjønte
 *   - overleveringen (17.11): når svaret sender eleven til en ny side, spilles
 *     avslutningen av verten i rotlayouten. På 375 px: en lenke i topplinjen
 *     trykket mens Buddy tenker, gir ingen avslutning (forlat-vernet); et
 *     tomt skjema i aktiveringen (feil, komponenten står) gir ingen
 *     avslutning; «Videre» på en innlimt tekst gir pillen på lesevisningen
 *     med «Teksten er klar.» i statusregionen, axe med pillen, og den står
 *     gjennom avslutningen og er så borte; «Prøv igjen» med ?fagordfeil
 *     fjerner feilen fra adressen og gir «Fagordene er klare.». På 1280 px et
 *     fast kort nederst til høyre med Buddy på 64 px, og siden blir ikke
 *     lengre av kortet
 *   - design bolk 7 (18.11): på 320 og 375 px, også med 200 % tekst, står
 *     fanene «Lim inn», «PDF» og «Bilder» på én rad og er like brede; i
 *     bildefanen står «Før du tar bildene» (fet og understreket «Før») til
 *     to bilder er valgt, og så «Etter at du har valgt bildene» rett over
 *     listen, med axe i lys og mørk modus
 *   - design bolk 9 (18.11, endret 23.11): på 375 px står «Må øve mer» over
 *     «Har kontroll» over øvekortet til høyre (like brede, minst 44 × 44 px),
 *     og pilknappene «Forrige kort» og «Neste kort» ved siden av hverandre
 *     under; med `hand=venstre` står merkeknappene til venstre, og HTML-en
 *     fra serveren har allerede `data-hand="venstre"`. Tab etter kortet går
 *     «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort». Samme plassering på 320 px, også med 200 % tekst,
 *     axe i lys og mørk modus, og «Venstrehendt» på /konto setter og sletter
 *     informasjonskapselen, med og uten JavaScript
 *   - design bolk 10 (18.11): i gjennomsynet via bilde står Buddy (64 px,
 *     aria-hidden) til venstre i merknaden, ser ned med bekymrede bryn, og
 *     står stille med redusert bevegelse; teksten er den fra bolk 7, og axe
 *     er grønn i lys og mørk modus. Quizsiden har tusjstrøket bak navnet
 *     (bare navnet, ikke «Quiz:»), overskriften leses som «Quiz: EM-bølger»,
 *     og på 320 px med 200 % tekst ruller siden ikke sidelengs, heller ikke
 *     med et langt navn over flere linjer. «leser» på landingssiden har det
 *     samme strøket
 *
 * Bruker Chrome som er installert på maskinen (playwright-core laster ikke ned
 * nettlesere). Rører ALDRI Neon: databaseadressen settes til 127.0.0.1, og
 * skriptet stopper før noe startes om den ikke er det.
 *
 * Rapporten skrives til maaling/resultater/tilgjengelighet-<dato>.md.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { chromium } from "playwright-core";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const DBPORT = 5437;
const APPPORT = 3107;
const DB = `postgresql://postgres:postgres@127.0.0.1:${DBPORT}/postgres`;
const APP = `http://localhost:${APPPORT}`;
const KODE = "tilgjengelighet";
const EPOST = "sjekk@test.no";
const PASSORD = "et-langt-passord";

if (new URL(DB).hostname !== "127.0.0.1") throw new Error("Databasen må være lokal.");

const require = createRequire(import.meta.url);
const AXE = require.resolve("axe-core/axe.min.js");

const barn = [];
function start(kommando, argv, env = {}) {
  const p = spawn(kommando, argv, { shell: true, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  barn.push(p);
  return p;
}
function stopp() {
  for (const p of barn) {
    // På Windows dreper `kill` bare skallet; taskkill tar hele treet. Synkront,
    // ellers rekker skriptet å avslutte før serverne er borte, og neste kjøring
    // møter en gammel server på samme port.
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(p.pid), "/T", "/F"], { stdio: "ignore" });
    else p.kill();
  }
}
process.on("SIGINT", () => {
  stopp();
  process.exit(130);
});

async function vent(sjekk, hva, ms = 180000) {
  const slutt = Date.now() + ms;
  for (;;) {
    try {
      if (await sjekk()) return;
    } catch {}
    if (Date.now() > slutt) throw new Error(`Ventet for lenge på ${hva}`);
    await new Promise((ok) => setTimeout(ok, 500));
  }
}

/* ------------------------------------------------------------------ */

// Trykk øverst til venstre på bunken: midt på hovedbunken ligger lenken for neste steg.
const HJOERNE = { position: { x: 24, y: 24 } };

const funn = [];
const axeFunn = [];
function sjekk(navn, ok, detalj = "") {
  funn.push({ navn, ok, detalj });
  console.log(`${ok ? "✓" : "✗"} ${navn}${detalj ? ` — ${detalj}` : ""}`);
}

async function axe(side, navn) {
  await side.addScriptTag({ path: AXE });
  const r = await side.evaluate(() =>
    axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } }),
  );
  for (const v of r.violations) {
    axeFunn.push({ side: navn, id: v.id, alvor: v.impact, hjelp: v.help, antall: v.nodes.length, eksempel: v.nodes[0]?.target.join(" ") });
  }
  sjekk(`axe: ${navn}`, r.violations.length === 0, r.violations.map((v) => `${v.id} (${v.nodes.length})`).join(", "));
}

/** Landingsmenyen («Logg inn», «For lærere») skal bare stå i topplinjen på landingssiden. */
async function ingenLandingsmeny(side) {
  return (
    (await side.locator("header a:visible", { hasText: "Logg inn" }).count()) === 0 &&
    (await side.locator("header a:visible", { hasText: "For lærere" }).count()) === 0
  );
}

async function ingenSiderulling(side, navn) {
  const [bredde, vindu] = await side.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  sjekk(`mobil uten sidelengs rulling: ${navn}`, bredde <= vindu + 1, `${bredde} px innhold i ${vindu} px vindu`);
}

/**
 * Navnet på h1 slik Chrome gir det til skjermlesere (tilgjengelighetstreet via
 * CDP). Playwrights egen navneberegning (getByRole) setter inn mellomrom rundt
 * inline-block-elementer, så «leser.» ble «leser .» der, men ikke i Chrome.
 */
async function overskriftsnavn(side) {
  const cdp = await side.context().newCDPSession(side);
  try {
    const { nodes } = await cdp.send("Accessibility.getFullAXTree");
    return nodes
      .filter((n) => n.role?.value === "heading" && n.properties?.some((p) => p.name === "level" && p.value.value === 1))
      .map((n) => n.name?.value ?? "");
  } finally {
    await cdp.detach();
  }
}

/** Elementene som stikker ut til høyre for vinduet (de innerste), til feilsøking av sidelengs rulling. */
async function stikkerUt(side) {
  return side.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && ![...e.children].some((b) => b.getBoundingClientRect().right > window.innerWidth + 1))
      .map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 3).join(".")} (${Math.round(e.getBoundingClientRect().right)} px)`)
      .slice(0, 5),
  );
}

/**
 * Bolk 10: tusjstrøkene (Tusj.tsx) i elementet `sel`. Ett per ord, hvert med en
 * SVG (preserveAspectRatio="none", aria-hidden) bak den nederste delen av
 * ordet, fylt med --lb-tusj, og aldri i en lenke eller knapp.
 */
async function tusjer(side, sel) {
  return side.evaluate((sel) => {
    const proeve = document.createElement("span");
    proeve.style.color = "var(--lb-tusj)";
    document.body.append(proeve);
    const tusjfarge = getComputedStyle(proeve).color;
    proeve.remove();
    return [...document.querySelectorAll(`${sel} .tusj`)].map((e) => {
      const svg = e.querySelector(":scope > svg");
      const bane = svg?.querySelector("path");
      const r = e.getBoundingClientRect();
      const s = svg?.getBoundingClientRect();
      const em = parseFloat(getComputedStyle(e).fontSize);
      return {
        ord: e.textContent,
        bane: bane?.getAttribute("d") ?? "",
        ok:
          !!svg &&
          svg.getAttribute("preserveAspectRatio") === "none" &&
          svg.getAttribute("aria-hidden") === "true" &&
          getComputedStyle(bane).fill === tusjfarge &&
          getComputedStyle(svg).position === "absolute" &&
          getComputedStyle(svg).zIndex === "-1" &&
          // bak den nederste delen: toppen under midten av ordet, bunnen ved bunnen
          s.top > r.top + r.height * 0.4 &&
          s.bottom <= r.bottom + 1 &&
          s.width >= r.width &&
          !e.closest("a, button"),
        hoeyde: s ? Math.round((s.height / em) * 100) / 100 : 0,
      };
    });
  }, sel);
}

/* ------------------------------------------------------------------ */

try {
  console.log("Starter database i minnet og appen i testmodus …");
  start("npx", ["pglite-server", `--port=${DBPORT}`, "--max-connections=20"]);
  await vent(async () => {
    const c = new pg.Client(DB);
    await c.connect();
    await c.end();
    return true;
  }, "databasen");
  // PGlite-serveren svarer på tilkobling litt før den tar imot spørringer.
  await vent(async () => {
    const pool = new pg.Pool({ connectionString: DB, max: 1 });
    try {
      await migrate(drizzle(pool, { casing: "snake_case" }), { migrationsFolder: "data/migrasjoner" });
      return true;
    } finally {
      await pool.end();
    }
  }, "migrasjonene", 60000);

  const app = start("npx", ["next", "dev", "-p", String(APPPORT)], {
    DATABASE_URL: DB,
    DATABASE_URL_UNPOOLED: DB,
    LESEVENN_TESTMODUS: "les",
    // PRD §6.4: testmodus `les` stoppes ellers aldri av dagstaket. Slås på
    // her, så sjekken av takmeldingen nederst kan kjøre. Ingenting
    // registreres i `les`, så taket nås bare når sjekken legger inn forbruk.
    LESEVENN_DAGSTAK_I_TESTMODUS: "1",
    LESEVENN_BYGGEMAPPE: ".next-sjekk",
    LESEVENN_INVITASJONSKODE: KODE,
    BETTER_AUTH_SECRET: "lokal-hemmelighet-kun-for-tilgjengelighetssjekken",
    BETTER_AUTH_URL: APP,
    ANTHROPIC_API_KEY: "",
  });
  app.stderr.on("data", (d) => process.env.VERBOSE && process.stderr.write(d));
  app.stdout.on("data", (d) => process.env.VERBOSE && process.stdout.write(d));
  await vent(async () => (await fetch(`${APP}/api/helse`)).ok, "appen");

  const nettleser = await chromium.launch({ channel: "chrome", headless: true });
  globalThis.__nettleser = nettleser;
  // Bolk 10: banen til tusjstrøket i sidetitlene, sammenlignet med «leser» på landingssiden.
  let tusjBane = null;

  /* --- PC: løypen fram til lesevisningen --------------------------- */
  const pc = await (await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO" })).newPage();
  pc.setDefaultTimeout(120000);

  await pc.goto(`${APP}/registrer`);
  await axe(pc, "registrering");
  await pc.fill("#kode", KODE);
  await pc.fill("#epost", EPOST);
  await pc.fill("#passord", PASSORD);
  await pc.fill("#gjenta", PASSORD);
  // FR-53: uten avkrysningene stopper nettleseren innsendingen. Ingen er
  // forhåndsavkrysset, og begge har en lesbar etikett.
  sjekk(
    "FR-53: avkrysningene for alder og vilkår er påkrevde og ikke forhåndsavkrysset",
    (await pc.locator("#alder:required:not(:checked)").count()) === 1 &&
      (await pc.locator("#vilkaar:required:not(:checked)").count()) === 1 &&
      (await pc.getByLabel("Jeg er 15 år eller eldre").count()) === 1 &&
      (await pc.getByLabel("Jeg har lest vilkårene og personvernerklæringen").count()) === 1,
  );
  await pc.click("form button[type=submit]");
  await pc.waitForTimeout(500);
  sjekk(
    "FR-53: uten avkrysning sendes ikke skjemaet",
    new URL(pc.url()).pathname === "/registrer" && (await pc.locator("#alder:invalid").count()) === 1,
    pc.url(),
  );
  sjekk(
    "FR-53: registreringen lenker til «Vilkår og personvern»",
    (await pc.locator("main a[href='/vilkaar']").count()) >= 1,
  );
  // Tastatur: mellomrom krysser av når boksen har fokus.
  await pc.focus("#alder");
  await pc.keyboard.press("Space");
  await pc.check("#vilkaar");
  sjekk("FR-53: avkrysningen virker med tastaturet", await pc.isChecked("#alder"));
  await pc.click("form button[type=submit]");
  await pc.waitForURL(`${APP}/`);
  // FR-48: en ny elev lander på et tomt arbeidsbord.
  sjekk(
    "FR-48: tomt arbeidsbord for ny elev",
    (await pc.locator("text=Her blir tekstene dine liggende. Legg den første på bordet.").count()) === 1 &&
      (await pc.locator("main a:has-text('+ Ny tekst')").count()) === 1,
  );
  await axe(pc, "arbeidsbord (tomt)");

  // FR-53: kontosiden lenker til «Vilkår og personvern».
  await pc.goto(`${APP}/konto`);
  sjekk(
    "FR-53: kontosiden lenker til «Vilkår og personvern»",
    (await pc.locator("main a[href='/vilkaar']", { hasText: "Vilkår og personvern" }).count()) === 1,
  );

  // Hopp-lenken skal være det første Tab treffer etter en sidelasting.
  await pc.goto(`${APP}/`);
  await pc.keyboard.press("Tab");
  const foerste = await pc.evaluate(() => document.activeElement?.textContent?.trim());
  sjekk("hopp-lenken er første fokus", foerste === "Hopp til innholdet", `fikk «${foerste}»`);

  // Innlesingen ligger på /ny (FR-48, EXPERIENCE.md, Ny tekst).
  await pc.goto(`${APP}/ny`);
  await axe(pc, "ny tekst");

  // DESIGN.md, focus-ring: Tab fra tekstfeltet til primærknappen «Begynn».
  await pc.focus("#tekst");
  await pc.keyboard.press("Tab");
  const ring = await pc.evaluate(() => {
    const e = document.activeElement;
    const s = getComputedStyle(e);
    return { tekst: e.textContent.trim(), stil: s.outlineStyle, bredde: s.outlineWidth, farge: s.outlineColor, synlig: e.matches(":focus-visible") };
  });
  sjekk(
    "fokusringen på primærknappen er 3 px heltrukken i primærfargen",
    ring.tekst === "Begynn" && ring.synlig && ring.stil === "solid" && ring.bredde === "3px" && ring.farge === "rgb(100, 39, 214)",
    `«${ring.tekst}»: ${ring.stil} ${ring.bredde} ${ring.farge}`,
  );

  const eksempel = await readFile("testdata/eksempeltekst/em-egenskaper.txt", "utf8");
  await pc.fill("#tittel", "EM-bølger");
  await pc.fill("#tekst", eksempel);
  await pc.click("button[type=submit]:visible:has-text(\"Begynn\")");

  // FR-3 og FR-5: brødteksten er verken synlig eller i kildekoden — heller
  // ikke i dataene Next legger ved siden. Et utdrag fra et langt avsnitt
  // brukes som prøve.
  const brod = eksempel
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.replace(/\s+/g, " ").trim())
    .find((b) => b.split(" ").length > 20)
    .split(" ")
    .slice(0, 6)
    .join(" ");
  const lekker = async () => (await pc.content()).includes(brod);

  await pc.waitForURL(/\/overskrifter$/);
  await axe(pc, "overskriftskontroll (3a)");
  sjekk("FR-3: brødteksten finnes ikke i kildekoden i fase 3a", !(await lekker()), `prøve: «${brod}»`);
  await pc.click("text=Overskriftene stemmer — videre");
  await pc.waitForURL(/\/aktivering$/);
  await axe(pc, "aktivering");
  sjekk("FR-5: brødteksten finnes ikke i kildekoden i aktiveringen", !(await lekker()));

  /* --- FR-6 (glideren 23.11): forkunnskapen, på 320 og 375 px og bare med tastatur --- */
  await pc.setViewportSize({ width: 375, height: 800 });
  await axe(pc, "aktivering (375 px)");
  // Det skjemaet ville sendt for merkene, lest fra skjemaet selv.
  const sendtMerking = () =>
    pc.evaluate(() =>
      Object.fromEntries(
        [...new FormData(document.querySelector("main form")).entries()].filter(([k]) => k.startsWith("merke-")),
      ),
    );
  const grupper = await pc.evaluate(() => {
    const tekstAv = (ider) =>
      (ider ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent.replace(/\s+/g, " ").trim() ?? "")
        .join(" | ");
    return [...document.querySelectorAll("main form fieldset")].map((f) => {
        const glidere = [...f.querySelectorAll("input[type=range]")];
        const g = glidere[0];
        const knapp = f.querySelector(".forkunnskap-uklar button");
        return {
          navn: (f.querySelector(":scope > legend")?.textContent ?? "").trim(),
          glidere: glidere.length,
          felt: (g?.getAttribute("aria-labelledby") ?? "").replace(/-navn$/, ""),
          gliderNavn: tekstAv(g?.getAttribute("aria-labelledby")),
          legendNavn: (f.querySelector(":scope > legend")?.textContent ?? "").replace(/\s+/g, " ").trim(),
          beskrivelse: tekstAv(g?.getAttribute("aria-describedby")),
          verditekst: g?.getAttribute("aria-valuetext") ?? "",
          status: f.querySelector(".forkunnskap-status")?.textContent.trim() ?? "",
          gliderNavngitt: !!g?.getAttribute("name"),
          trinn: [...f.querySelectorAll(".forkunnskap-trinn > *")].map((s) => s.textContent.trim()).join(" / "),
          knapp: knapp?.textContent.trim() ?? "",
          trykket: knapp?.getAttribute("aria-pressed") ?? "",
          gliderHoeyde: g ? g.getBoundingClientRect().height : 0,
          knappHoeyde: knapp ? knapp.getBoundingClientRect().height : 0,
        };
      });
  });
  sjekk(
    "FR-6 (23.11): hver overskrift har én glider navngitt av overskriften (legend), uten eget feltnavn",
    grupper.length >= 2 && grupper.every((g) => g.navn.length > 0 && g.glidere === 1 && g.gliderNavn === g.legendNavn && !g.gliderNavngitt),
    `${grupper.length} overskrifter: ${grupper.map((g) => `«${g.gliderNavn}» (${g.glidere})`).join(", ")}`,
  );
  sjekk(
    "FR-6 (23.11): trinnmerkene «Ingenting ennå / Litt / Mye» står under glideren, og knappen heter «Skjønner ikke overskriften» (aria-pressed=false)",
    grupper.every((g) => g.trinn === "Ingenting ennå / Litt / Mye" && g.knapp === "Skjønner ikke overskriften" && g.trykket === "false"),
    `${grupper[0]?.trinn ?? ""}; «${grupper[0]?.knapp ?? ""}» ${grupper[0]?.trykket ?? ""}`,
  );
  sjekk(
    "FR-6 (23.11): urørt sier glideren «Ikke merket ennå», synlig og som aria-valuetext, og skjemaet sender ingen merker",
    grupper.every((g) => g.verditekst === "Ikke merket ennå" && g.status === "Ikke merket ennå") &&
      Object.keys(await sendtMerking()).length === 0,
    `${grupper[0]?.verditekst ?? ""} / ${grupper[0]?.status ?? ""}; ${JSON.stringify(await sendtMerking())}`,
  );
  sjekk(
    "FR-6 (18.11): «Hva vet du om dette fra før?» står én gang over overskriftene og beskriver hver glider",
    (await pc.locator("main form #merke-spoersmaal", { hasText: "Hva vet du om dette fra før?" }).count()) === 1 &&
      (await pc.locator("fieldset #merke-spoersmaal").count()) === 0 &&
      grupper.every((g) => g.beskrivelse === "Hva vet du om dette fra før?"),
    grupper[0]?.beskrivelse ?? "",
  );
  sjekk(
    "FR-6 (23.11): glideren og knappen har minst 44 px trykkflate",
    grupper.every((g) => g.gliderHoeyde >= 44 && g.knappHoeyde >= 44),
    grupper.map((g) => `${Math.round(g.gliderHoeyde)}/${Math.round(g.knappHoeyde)}`).join(", "),
  );
  await pc.emulateMedia({ colorScheme: "dark" });
  await axe(pc, "aktivering (375 px, mørk modus)");
  // Tilbake til lys (standarden i konteksten); null ville gitt systemets valg.
  await pc.emulateMedia({ colorScheme: "light" });
  // På 320 px, også med 200 % tekst: glideren, trinnmerkene og knappen
  // holder seg innenfor overskriften, ingen tekst kuttes, og siden ruller
  // ikke sidelengs.
  await pc.setViewportSize({ width: 320, height: 800 });
  const smalt = () =>
    pc.evaluate(() => {
      const feil = [];
      for (const f of document.querySelectorAll("main form fieldset")) {
        const fb = f.getBoundingClientRect();
        for (const e of f.querySelectorAll(".forkunnskap-glider, .forkunnskap-trinn > *, .forkunnskap-uklar button, .forkunnskap-status")) {
          const b = e.getBoundingClientRect();
          if (b.left < fb.left - 0.5 || b.right > fb.right + 0.5 || e.scrollWidth > e.clientWidth + 1) {
            feil.push(`${e.textContent.trim() || e.className} (${Math.round(b.left)}–${Math.round(b.right)} i ${Math.round(fb.left)}–${Math.round(fb.right)})`);
          }
        }
      }
      return { feil, sidelengs: document.documentElement.scrollWidth > window.innerWidth };
    });
  const smal1 = await smalt();
  sjekk(
    "FR-6 (23.11): på 320 px står glideren, trinnmerkene og knappen innenfor overskriften, og siden ruller ikke sidelengs",
    smal1.feil.length === 0 && !smal1.sidelengs,
    smal1.feil.join(", "),
  );
  await axe(pc, "aktivering (320 px)");
  const stor = await pc.addStyleTag({ content: "html { font-size: 200% !important; }" });
  const smal2 = await smalt();
  sjekk(
    "FR-6 (23.11): på 320 px med 200 % tekst kuttes ingenting, og siden ruller ikke sidelengs",
    smal2.feil.length === 0 && !smal2.sidelengs,
    smal2.feil.join(", "),
  );
  await stor.evaluate((e) => e.remove());
  await pc.setViewportSize({ width: 375, height: 800 });
  const aktiv = () =>
    pc.evaluate(() => {
      const e = document.activeElement;
      const f = e?.closest("fieldset");
      return {
        type: e?.type ?? "",
        tag: e?.tagName ?? "",
        tekst: e?.tagName === "BUTTON" ? e.textContent.trim() : "",
        trykket: e?.getAttribute("aria-pressed") ?? "",
        navn: e?.getAttribute("aria-labelledby") ?? "",
        overskrift: f ? [...document.querySelectorAll("main form fieldset")].indexOf(f) : -1,
        verditekst: f?.querySelector("input[type=range]")?.getAttribute("aria-valuetext") ?? "",
        status: f?.querySelector(".forkunnskap-status")?.textContent.trim() ?? "",
        ring: getComputedStyle(e).outlineStyle,
        synlig: e?.matches(":focus-visible") ?? false,
        sidelengs: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
  const kort = (a) => `${a.overskrift}:${a.type || a.tag} «${a.verditekst}» ${a.trykket}`;
  // Tab fram til første glider.
  let foersteValg;
  for (let i = 0; i < 40; i++) {
    await pc.keyboard.press("Tab");
    foersteValg = await aktiv();
    if (foersteValg.type === "range") break;
  }
  sjekk(
    "FR-6: Tab når første glider, med synlig fokusring",
    foersteValg.type === "range" && foersteValg.overskrift === 0 && foersteValg.navn === `${grupper[0].felt}-navn` && foersteValg.synlig && foersteValg.ring === "solid",
    JSON.stringify(foersteValg),
  );
  // «Litt» fra urørt med mellomrom, der håndtaket allerede står.
  await pc.keyboard.press(" ");
  const etterMellomrom = await aktiv();
  sjekk(
    "FR-6 (23.11): mellomrom på en urørt glider velger «Litt» (`litt`)",
    etterMellomrom.verditekst === "Litt" && etterMellomrom.status === "Litt" && (await sendtMerking())[grupper[0].felt] === "litt",
    `${kort(etterMellomrom)}; ${JSON.stringify(await sendtMerking())}`,
  );
  await pc.keyboard.press("ArrowRight");
  const etterPil = await aktiv();
  sjekk(
    "FR-6 (23.11): → gir «Mye» (aria-valuetext, det skjermleseren leser) og `kjent`",
    etterPil.verditekst === "Mye" && (await sendtMerking())[grupper[0].felt] === "kjent",
    `${kort(etterPil)}; ${JSON.stringify(await sendtMerking())}`,
  );
  await pc.keyboard.press("ArrowLeft");
  const tilbake = await aktiv();
  sjekk("FR-6 (23.11): ← går et trinn tilbake, til «Litt»", tilbake.verditekst === "Litt" && (await sendtMerking())[grupper[0].felt] === "litt", kort(tilbake));
  await pc.keyboard.press("Tab");
  const knapp1 = await aktiv();
  await pc.keyboard.press("Tab");
  const glider2 = await aktiv();
  await pc.keyboard.press("Tab");
  const knapp2 = await aktiv();
  sjekk(
    "FR-6 (23.11): Tab går glider → «Skjønner ikke overskriften» → neste glider → dens knapp",
    knapp1.tekst === "Skjønner ikke overskriften" &&
      knapp1.overskrift === 0 &&
      glider2.type === "range" &&
      glider2.overskrift === 1 &&
      knapp2.tekst === "Skjønner ikke overskriften" &&
      knapp2.overskrift === 1,
    [knapp1, glider2, knapp2].map(kort).join(" → "),
  );
  // Knappen på og av over en glider som aldri er rørt: urørt igjen.
  await pc.keyboard.press(" ");
  const paa = await aktiv();
  sjekk(
    "FR-6 (23.11): «Skjønner ikke overskriften» på: aria-pressed=true, glideren «Satt til side», `uklar` sendes",
    paa.trykket === "true" && paa.verditekst === "Satt til side" && paa.status === "Satt til side" && (await sendtMerking())[grupper[1].felt] === "uklar",
    `${kort(paa)}; ${JSON.stringify(await sendtMerking())}`,
  );
  await pc.keyboard.press(" ");
  const av = await aktiv();
  sjekk(
    "FR-6 (23.11): av igjen over en urørt glider: «Ikke merket ennå», og ingenting sendes for overskriften",
    av.trykket === "false" && av.verditekst === "Ikke merket ennå" && !(grupper[1].felt in (await sendtMerking())),
    `${kort(av)}; ${JSON.stringify(await sendtMerking())}`,
  );
  // På igjen, og så ← på glideren: glideren gjelder, og knappen går av.
  await pc.keyboard.press(" ");
  await pc.keyboard.press("Shift+Tab");
  await pc.keyboard.press("ArrowLeft");
  const etterKnapp = await aktiv();
  const knappEtter = await pc.locator("main form fieldset").nth(1).locator(".forkunnskap-uklar button").getAttribute("aria-pressed");
  sjekk(
    "FR-6 (23.11): ← etter «Skjønner ikke»: «Ingenting ennå» (`nytt`), og knappen går av",
    etterKnapp.verditekst === "Ingenting ennå" && knappEtter === "false" && (await sendtMerking())[grupper[1].felt] === "nytt",
    `${kort(etterKnapp)}, knapp ${knappEtter}; ${JSON.stringify(await sendtMerking())}`,
  );
  // Knappen på og av over en rørt glider: verdien kommer tilbake. Så på igjen,
  // og den blir stående på (lesevisningen sjekker overskriften under).
  await pc.keyboard.press("Tab");
  await pc.keyboard.press(" ");
  await pc.keyboard.press(" ");
  const avIgjen = await aktiv();
  sjekk(
    "FR-6 (23.11): av igjen over en rørt glider: glideren har sin verdi («Ingenting ennå»)",
    avIgjen.trykket === "false" && avIgjen.verditekst === "Ingenting ennå" && (await sendtMerking())[grupper[1].felt] === "nytt",
    kort(avIgjen),
  );
  await pc.keyboard.press(" ");
  sjekk("FR-6 (23.11): knappen på igjen sender `uklar`", (await sendtMerking())[grupper[1].felt] === "uklar", JSON.stringify(await sendtMerking()));
  // Klikk på håndtaket i midten av en urørt glider gir «Litt».
  if (grupper.length >= 3) {
    await pc.locator("main form fieldset").nth(2).locator("input[type=range]").click();
    const klikket = await pc.locator("main form fieldset").nth(2).locator("input[type=range]").getAttribute("aria-valuetext");
    sjekk(
      "FR-6 (23.11): klikk på håndtaket i midten av en urørt glider velger «Litt»",
      klikket === "Litt" && (await sendtMerking())[grupper[2].felt] === "litt",
      `${klikket}; ${JSON.stringify(await sendtMerking())}`,
    );
  }
  sjekk("FR-6: aktiveringen ruller ikke sidelengs på 375 px", !(await aktiv()).sidelengs);
  await pc.setViewportSize({ width: 1280, height: 900 });

  await pc.fill("#lurer-paa", "Hvorfor kan vi ikke se radiobølger?");
  await pc.click("text=Videre");
  // Gjennomsynet nås nå bare via PDF og bilde; innlimt tekst låses i aktiveringen (FR-3, 11.11).
  await pc.waitForURL(/\/lesing$/, { timeout: 240000 });
  const lesing = pc.url();
  const tekstUrl = lesing.replace(/\/lesing$/, "");
  // Overleveringen (17.11): fra 760 px spilles avslutningen etter sidebyttet i
  // et lite fast kort nederst til høyre, med Buddy på 64 px og statusen.
  // Kortet teller ikke i pilleregnskapet, så siden blir ikke lengre av det.
  const maalSiden = () =>
    pc.evaluate(() => ({
      luft: getComputedStyle(document.body).paddingBottom,
      hoeyde: document.documentElement.scrollHeight,
      pille: document.documentElement.classList.contains("har-tenkepille"),
    }));
  const pcVert = await pc
    .locator(".tenker-vert")
    .waitFor({ timeout: 10000 })
    .then(
      async () => ({
        ...(await pc.locator(".tenker-vert").evaluate((el) => {
          const svg = [...el.querySelectorAll("svg.merke")].find((m) => getComputedStyle(m).display !== "none");
          const b = el.getBoundingClientRect();
          return {
            posisjon: getComputedStyle(el).position,
            hoeyre: Math.round(window.innerWidth - b.right),
            nederst: Math.round(window.innerHeight - b.bottom),
            mini: !!svg?.classList.contains("mini"),
            merke: svg ? Math.round(svg.getBoundingClientRect().height) : 0,
            tekst: el.querySelector("[role=status]")?.textContent ?? "",
          };
        })),
        side: await maalSiden(),
      }),
      () => null,
    );
  sjekk(
    "overleveringen, 1280 px: avslutningen spilles i et fast kort nederst til høyre (16 px), Buddy 64 px, «Teksten er klar.»",
    !!pcVert &&
      pcVert.posisjon === "fixed" &&
      pcVert.hoeyre === 16 &&
      pcVert.nederst === 16 &&
      !pcVert.mini &&
      pcVert.merke === 64 &&
      pcVert.tekst === "Teksten er klar.",
    JSON.stringify(pcVert),
  );
  if (pcVert) {
    await pc.locator(".tenker-vert").waitFor({ state: "detached", timeout: 20000 }).catch(() => {});
    const etterKortet = await maalSiden();
    sjekk(
      "overleveringen, 1280 px: siden blir ikke lengre mens kortet vises (ingen luft nederst, ikke har-tenkepille)",
      !pcVert.side.pille && pcVert.side.luft === etterKortet.luft && pcVert.side.hoeyde <= etterKortet.hoeyde,
      `${JSON.stringify(pcVert.side)} / etter ${JSON.stringify(etterKortet)}`,
    );
  }
  await pc.waitForSelector("article button");
  await axe(pc, "lesevisning");

  /* --- FR-6: «Før du leste» i lesevisningen --- */
  const foerDel = (await pc.locator("#foer-du-leste").count()) > 0 ? await pc.locator("#foer-du-leste").innerText() : "";
  const uklarOverskrift = grupper[1]?.navn.replace(/\s*\(laget av LeseBuddy\)$/, "") ?? "";
  sjekk(
    "FR-6: «Før du leste» viser spørsmålet, lenken til fagsamtalen og overskriften eleven ikke skjønte (18.11)",
    foerDel.includes("Du lurte på: Hvorfor kan vi ikke se radiobølger?") &&
      (await pc.locator('#foer-du-leste a[href$="/oppgaver"]').count()) === 1 &&
      foerDel.includes(`Denne overskriften skjønte du ikke: ${uklarOverskrift.replace(/[.?!:;]+$/u, "")}. Gir den mening nå?`),
    foerDel.replace(/\s+/g, " ").slice(0, 200),
  );
  const rekkefoelge = await pc.evaluate(() => {
    const h = [...document.querySelectorAll("main h2")].map((e) => e.textContent.trim());
    return h.indexOf("Før du leste") >= 0 && h.indexOf("Før du leste") === h.indexOf("Ferdig med å lese?") - 1;
  });
  sjekk("FR-6: «Før du leste» står rett før «Ferdig med å lese?»", rekkefoelge);

  // FR-6: aktiveringen åpnet igjen etter låsingen viser merkene, uten skjema.
  await pc.goto(`${tekstUrl}/aktivering`);
  const merketRad = pc.locator("main li", { hasText: uklarOverskrift }).first();
  const merketTekst = (await merketRad.count()) > 0 ? await merketRad.innerText() : "";
  sjekk(
    "FR-6: låst aktivering viser «du merket: Skjønner ikke overskriften» ved overskriften eleven ikke skjønte",
    uklarOverskrift.length > 0 && merketTekst.includes("du merket: Skjønner ikke overskriften"),
    merketTekst.replace(/\s+/g, " ").slice(0, 120),
  );
  sjekk(
    "FR-6: låst aktivering har verken glidere, «Skjønner ikke»-knapper eller spørsmålsfelt",
    (await pc.locator("input[type=range]").count()) === 0 &&
      (await pc.locator(".forkunnskap-uklar button").count()) === 0 &&
      (await pc.locator("#lurer-paa").count()) === 0,
  );
  // Tilbake til lesevisningen, der FR-10 under fortsetter.
  await pc.goto(lesing);
  await pc.waitForSelector("article button");

  /* --- FR-10 på PC ------------------------------------------------- */
  const ord = pc.locator("article button[aria-expanded]");
  const dialog = pc.locator("article [role=dialog]");
  const rull = () => pc.evaluate(() => window.scrollY);

  await pc.evaluate(() => window.scrollTo(0, 300));
  const foer = await rull();
  await ord.nth(0).focus();
  sjekk("FR-10: fokus åpner forklaringen", await dialog.isVisible());
  await pc.keyboard.press("Escape");
  sjekk("FR-10: Escape lukker", (await dialog.count()) === 0);
  sjekk(
    "FR-10: fokus står på ordet etter Escape",
    await ord.nth(0).evaluate((el) => el === document.activeElement),
  );
  sjekk("FR-10: rulleposisjonen står stille (fokus/Escape)", (await rull()) === foer, `${foer} → ${await rull()}`);

  await pc.locator("h1").click(); // fjern fokus
  await ord.nth(1).hover();
  sjekk("FR-10: pekerhvil åpner forklaringen", await dialog.isVisible());
  await pc.mouse.move(5, 5);
  sjekk("FR-10: forklaringen lukkes når pekeren går", (await dialog.count()) === 0);

  await ord.nth(1).click();
  await pc.mouse.move(5, 5);
  sjekk("FR-10: trykk fester forklaringen", await dialog.isVisible());
  await pc.locator("article [role=dialog] button").click();
  sjekk("FR-10: lukkeknappen lukker", (await dialog.count()) === 0);
  await ord.nth(1).click();
  await pc.locator("h1").click();
  sjekk("FR-10: trykk utenfor lukker", (await dialog.count()) === 0);
  await axe(pc, "lesevisning med åpen forklaring").catch(() => {});

  /* --- FR-12 ------------------------------------------------------- */
  const storrelse = () => pc.locator("#lesetekst").evaluate((el) => getComputedStyle(el).fontSize);
  // Forventningen leses fra trinnene i koden, ikke hardkodet: «Ekstra stor» ble
  // endret fra 1,625 til 2 rem 10.11, og et fast «26px» ble da stående feil.
  const ekstraRem = Number(
    (await readFile("tekst/leseinnstillinger.ts", "utf8")).match(/ekstra:\s*\{[^}]*rem:\s*([\d.]+)/)[1],
  );
  const ekstraPx = `${ekstraRem * 16}px`;
  await pc.click("summary:has-text('Leseinnstillinger')");
  await pc.click("label:has-text('Ekstra stor')");
  sjekk("FR-12: tekststørrelsen endres med en gang", (await storrelse()) === ekstraPx, await storrelse());
  await pc.waitForTimeout(1500);
  await pc.reload();
  sjekk("FR-12: tekststørrelsen huskes", (await storrelse()) === ekstraPx, await storrelse());
  const tegnPerLinje = await pc.locator("#lesetekst").evaluate((el) => {
    const p = el.querySelector("p");
    const ch = document.createElement("span");
    ch.textContent = "0";
    p.appendChild(ch);
    const w = ch.getBoundingClientRect().width;
    ch.remove();
    return Math.round(p.getBoundingClientRect().width / w);
  });
  sjekk("FR-12: linjelengden er om lag 70 tegn også med stor skrift", tegnPerLinje <= 75, `${tegnPerLinje} tegn`);
  await pc.click("summary:has-text('Leseinnstillinger')");
  await pc.click("label:has-text('Normal') >> nth=0");
  await pc.waitForTimeout(1500);

  for (const [navn, url] of [
    ["oppgaver", `${tekstUrl}/oppgaver`],
    ["øvekort", `${tekstUrl}/oevekort`],
    ["minnevers", `${tekstUrl}/minnevers`],
    ["konto", `${APP}/konto`],
  ]) {
    await pc.goto(url);
    await axe(pc, navn);
  }

  /* --- FR-48: arbeidsbordet og viften ------------------------------- */
  await pc.goto(`${APP}/`);
  const bunkeknapp = pc.locator("button[aria-expanded]", { hasText: "Vis aktiviteter for EM-bølger" });
  await bunkeknapp.waitFor();
  const neste = pc.locator(".bunke-hoved a.bunke-neste");
  // Uten quizforsøk er neste steg quizen (EXPERIENCE.md, Neste steg).
  sjekk(
    "FR-48: hovedbunken har neste steg som egen lenke, rett til steget",
    (await neste.count()) === 1 && (await neste.getAttribute("href")) === `${tekstUrl.replace(APP, "")}/quiz`,
    `«${(await neste.textContent())?.trim()}» → ${await neste.getAttribute("href")}`,
  );
  sjekk("FR-48: hilsenen sier hvilken tekst eleven holdt på med", (await pc.locator("main p:has-text('Du holdt på med EM-bølger')").count()) === 1);
  await axe(pc, "arbeidsbord");
  sjekk("viften finnes ikke i DOM-en når den er lukket", (await pc.locator("[role=dialog]").count()) === 0);
  await bunkeknapp.focus();
  await pc.keyboard.press("Enter");
  const vifte = pc.locator("[role=dialog][aria-modal=true]");
  await vifte.waitFor();
  // 1280 px, vanlig tekst: kortene ligger rundt bunken, uten å dekke hverandre,
  // bunken eller «Legg sammen». Målt etter at de er ferdige med å fly ut.
  await pc.waitForTimeout(1000);
  const oppsett = await vifte.getAttribute("data-oppsett");
  sjekk("1280 px: viften legger kortene rundt bunken", oppsett === "rundt", `data-oppsett=${oppsett}`);
  const overlapp = await vifte.evaluate((d) => {
    const flater = [
      ["bunken", d.querySelector(".vifte-senter .bunke-forside")],
      ["Legg sammen", d.querySelector(".vifte-lukk")],
      ...[...d.querySelectorAll(".vifte-kort > li > .kort")].map((k) => [k.querySelector(".kort-navn").textContent, k]),
    ].map(([navn, e]) => [navn, e.getBoundingClientRect()]);
    const funn = [];
    for (let i = 0; i < flater.length; i++)
      for (let j = i + 1; j < flater.length; j++) {
        const [a, b] = [flater[i][1], flater[j][1]];
        if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) funn.push(`${flater[i][0]}/${flater[j][0]}`);
      }
    return funn;
  });
  sjekk("1280 px: kortene dekker ikke hverandre, bunken eller «Legg sammen»", overlapp.length === 0, overlapp.join(", "));
  // Navnet uten merket («Minnevers Uferdig» er Minnevers), se kortstatus i data/arbeidsbord.ts.
  const kortnavn = await vifte.locator(".vifte-kort > li .kort-navn").evaluateAll((navn) =>
    navn.map((n) => {
      const kopi = n.cloneNode(true);
      kopi.querySelector(".kort-merke")?.remove();
      return kopi.textContent.trim();
    }),
  );
  const merker = await vifte.locator(".vifte-kort > li .kort-merke").allTextContents();
  sjekk("bare Minnevers er merket «Uferdig» i viften", merker.join(",") === "Uferdig", merker.join(", "));
  sjekk(
    "viften har fem kort i fast rekkefølge",
    kortnavn.join(",") === "Teksten,Quiz,Øvekort,Fagsamtale,Minnevers",
    kortnavn.join(", "),
  );
  sjekk(
    "viften har tittelen på teksten som navn",
    (await vifte.evaluate((d) => document.getElementById(d.getAttribute("aria-labelledby"))?.textContent)) === "EM-bølger",
  );
  const iVifta = () => pc.evaluate(() => !!document.activeElement?.closest("[role=dialog]"));
  sjekk(
    "fokus flyttes til det første kortet",
    (await iVifta()) && (await pc.evaluate(() => document.activeElement?.textContent?.includes("Teksten"))),
  );
  let utenfor = 0;
  for (let i = 0; i < 10; i++) {
    await pc.keyboard.press("Tab");
    if (!(await iVifta())) utenfor++;
  }
  for (let i = 0; i < 4; i++) {
    await pc.keyboard.press("Shift+Tab");
    if (!(await iVifta())) utenfor++;
  }
  sjekk("Tab og Shift+Tab holder fokus i viften", utenfor === 0, `${utenfor} av 14 trykk gikk ut`);
  sjekk(
    "resten av siden er inert mens viften er åpen",
    await pc.evaluate(() => !!document.querySelector(".bord-flate")?.inert && !!document.querySelector("body > header, header")?.closest("[inert]")),
  );
  await pc.waitForTimeout(1000); // kortene er ferdige med å fly ut
  await axe(pc, "arbeidsbord med åpen vifte");
  await pc.keyboard.press("Escape");
  sjekk("Esc lukker viften", (await vifte.count()) === 0);
  sjekk("fokus tilbake på bunkens knapp etter Esc", await bunkeknapp.evaluate((e) => e === document.activeElement));
  await bunkeknapp.click(HJOERNE);
  await vifte.waitFor();
  await pc.click("[role=dialog] button:has-text('Legg sammen')");
  sjekk(
    "«Legg sammen» lukker viften og gir fokus tilbake",
    (await vifte.count()) === 0 && (await bunkeknapp.evaluate((e) => e === document.activeElement)),
  );

  // EXPERIENCE.md, Accessibility Floor: Tab fra «+ Ny tekst» treffer aldri et usynlig element.
  await pc.locator("main a:has-text('+ Ny tekst')").first().focus();
  const usynlige = [];
  for (let i = 0; i < 15; i++) {
    await pc.keyboard.press("Tab");
    const r = await pc.evaluate(() => {
      const e = document.activeElement;
      // Utviklingsoverlegget til next dev er ikke en del av appen.
      if (!e || e === document.body || e.tagName === "NEXTJS-PORTAL") return null;
      const b = e.getBoundingClientRect();
      const synlig =
        b.width > 0 && b.height > 0 && e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && !e.closest("[inert],[aria-hidden=true]");
      return { tekst: (e.textContent || e.tagName).trim().slice(0, 40), synlig };
    });
    if (!r) break;
    if (!r.synlig) usynlige.push(r.tekst);
  }
  sjekk("Tab fra «+ Ny tekst» treffer aldri et usynlig element", usynlige.length === 0, usynlige.join(", "));

  /* --- FR-49: Samlinger --------------------------------------------- */
  await pc.goto(`${APP}/samling`);
  await axe(pc, "samling");
  const tittellenke = pc.locator("main h2 a", { hasText: "EM-bølger" });
  sjekk(
    "FR-49: tittelen i Samlinger lenker til neste steg",
    (await tittellenke.getAttribute("href")) === `${tekstUrl.replace(APP, "")}/quiz`,
    `${await tittellenke.getAttribute("href")}`,
  );
  await pc.goto(`${APP}/samling?sok=mitose`);
  sjekk(
    "FR-49: søk uten treff sier det, med «Vis alle»",
    (await pc.locator("text=Ingen titler inneholder «mitose».").count()) === 1 && (await pc.locator("main a:has-text('Vis alle')").count()) === 1,
  );
  sjekk("menyen markerer Samlinger som aktiv", (await pc.locator("nav a[aria-current=page]").textContent()) === "Samlinger");
  sjekk("overskriften på /samling er «Samlinger»", (await pc.locator("main h1").textContent())?.trim() === "Samlinger");
  sjekk("innlogget (/samling): ingen «Logg inn» eller «For lærere» i topplinjen", await ingenLandingsmeny(pc));

  /* --- FR-50 til FR-52: Mapper lett ------------------------------------ */
  // Mappen lages fra Samlinger, teksten legges til, og de tre mappesidene
  // sjekkes med axe. Ingen generator kalles fra mappesidene.
  await pc.goto(`${APP}/samling`);
  sjekk("FR-50: Samlinger har «Mappene dine» øverst", (await pc.locator("#mapper h2", { hasText: "Mappene dine" }).count()) === 1);
  await pc.fill("#mapper input[name=tittel]", "Naturfag");
  await pc.click("#mapper button[type=submit]");
  await pc.waitForURL(/\/mappe\/[0-9a-f-]{36}$/, { timeout: 60000 });
  const mappeUrl = pc.url();
  await axe(pc, "mappe uten tekster");
  await pc.click("main button:has-text('Legg til')");
  await pc.locator("main h3 a", { hasText: "EM-bølger" }).waitFor();
  sjekk("FR-50: teksten ligger i mappen", (await pc.locator("main h3 a", { hasText: "EM-bølger" }).count()) === 1);
  await axe(pc, "mappe");
  for (const [navn, url] of [
    ["mappe: øvekort", `${mappeUrl}/oevekort`],
    ["mappe: quiz, valg av lengde", `${mappeUrl}/quiz`],
    ["mappe: quiz, kort", `${mappeUrl}/quiz?lengde=kort`],
  ]) {
    await pc.goto(url);
    await axe(pc, navn);
  }
  // FR-51: et kort i mappen bærer sin egen Tekst. Kildeavsnittet lenker dit,
  // og «Har kontroll» lagres på begrepet, så teksten alene viser kortet som merket.
  {
    const tekstSti = tekstUrl.replace(APP, "");
    await pc.goto(`${mappeUrl}/oevekort`);
    await pc.locator(".oevekort-flate > button[aria-pressed]").click();
    await pc.locator("summary", { hasText: "Se hvor det står i teksten" }).click();
    const kilde = await pc.locator("a", { hasText: "Les avsnittet i teksten" }).getAttribute("href");
    sjekk("FR-51: kildeavsnittet i mappen lenker til kortets egen tekst", !!kilde && kilde.startsWith(`${tekstSti}/lesing`), kilde ?? "");
    await pc.locator(".oevekort-merk button", { hasText: /^Har kontroll$/ }).click();
    const lagret = await pc.getByText(/Har kontroll: 1 ·|Du har kontroll på 1 av/).first().waitFor({ timeout: 15000 }).then(
      () => true,
      () => false,
    );
    await pc.goto(`${tekstUrl}/oevekort`);
    const iTeksten = (await pc.getByText(/Har kontroll: 1 ·/).count()) === 1;
    sjekk("FR-51: et kort merket «Har kontroll» i mappen står som merket i teksten", lagret && iTeksten);
    // Sjekkene av øvekortene lenger ned venter umerkede kort.
    const pool = new pg.Pool({ connectionString: DB, max: 1 });
    try {
      await pool.query(
        "update begrep set merking = null where begrepssett_id in (select id from begrepssett where tekst_id = $1)",
        [tekstSti.split("/").pop()],
      );
    } finally {
      await pool.end();
    }
  }
  await pc.goto(`${APP}/`);
  sjekk("FR-50: arbeidsbordet lenker til «Mappene dine»", (await pc.locator("main a[href='/samling#mapper']", { hasText: "Mappene dine" }).count()) === 1);

  /* --- Mørk modus: axe på de samme sidene ----------------------------- */
  const moerkUt = await (await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO", colorScheme: "dark" })).newPage();
  moerkUt.setDefaultTimeout(120000);
  await moerkUt.goto(`${APP}/registrer`);
  await axe(moerkUt, "registrering (mørk)");
  const moerkKontekst = await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO", colorScheme: "dark" });
  await moerkKontekst.addCookies(await pc.context().cookies());
  const moerk = await moerkKontekst.newPage();
  moerk.setDefaultTimeout(120000);
  for (const [navn, url] of [
    ["arbeidsbord", `${APP}/`],
    ["samling", `${APP}/samling`],
    ["ny tekst", `${APP}/ny`],
    ["overskriftskontroll (3a)", `${tekstUrl}/overskrifter`],
    ["aktivering", `${tekstUrl}/aktivering`],
    ["lesevisning", lesing],
    ["oppgaver", `${tekstUrl}/oppgaver`],
    ["øvekort", `${tekstUrl}/oevekort`],
    ["minnevers", `${tekstUrl}/minnevers`],
    ["mappe", mappeUrl],
    ["mappe: øvekort", `${mappeUrl}/oevekort`],
    ["mappe: quiz", `${mappeUrl}/quiz?lengde=kort`],
    ["konto", `${APP}/konto`],
    ["vilkår og personvern", `${APP}/vilkaar`],
  ]) {
    await moerk.goto(url);
    // Etter låsingen sender overskriftssiden videre; da er det en annen side som sjekkes.
    if (moerk.url() !== url) {
      sjekk(`mørk: ${navn} omdirigert, sjekkes ikke her`, true, moerk.url().replace(APP, ""));
      continue;
    }
    await axe(moerk, `${navn} (mørk)`);
  }
  await moerk.goto(`${APP}/`);
  await moerk.locator("button:has-text('Vis aktiviteter for EM-bølger')").click(HJOERNE);
  await moerk.locator("[role=dialog]").waitFor();
  await moerk.waitForTimeout(1000);
  await axe(moerk, "arbeidsbord med åpen vifte (mørk)");
  await moerk.goto(lesing);
  await moerk.locator("article button[aria-expanded]").first().focus();
  await moerk.locator("article [role=dialog]").waitFor();
  await axe(moerk, "lesevisning med åpen forklaring (mørk)");

  /* --- Design bolk 7: bildefanen følger steget (telefontesten 18.11) --- */
  // Før noe er valgt: «Før du tar bildene». Med ett bilde står den der fortsatt.
  // Med to eller flere: «Etter at du har valgt bildene» med oppfordringen
  // om rekkefølgen, rett over listen. Axe i lys og mørk modus på begge.
  // Bildene er tomme PNG-er: valget sjekker bare formatet, og ingenting leses.
  {
    const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
    const bilde = (n) => ({ name: `side-${n}.png`, mimeType: "image/png", buffer: PNG });
    const foer = (side) => side.locator("p", { hasText: "du tar bildene" });
    const etter = (side) =>
      side.locator("p:has-text('Etter at du har valgt bildene'):has-text('Sjekk at sidene står i riktig rekkefølge. Bruk pilene for å flytte dem.') + ol");
    for (const [side, modusnavn] of [
      [pc, "lys"],
      [moerk, "mørk"],
    ]) {
      await side.goto(`${APP}/ny`);
      await side.click('[role=tab]:text-is("Bilder")');
      await foer(side).waitFor();
      const uthevet = await foer(side)
        .locator("strong")
        .evaluate((e) => ({ tekst: e.textContent, vekt: Number(getComputedStyle(e).fontWeight), strek: getComputedStyle(e).textDecorationLine }));
      sjekk(
        `bolk 7 (${modusnavn}): «Før» er fet og understreket i boksen før opplasting`,
        uthevet.tekst === "Før" && uthevet.vekt >= 700 && uthevet.strek.includes("underline"),
        JSON.stringify(uthevet),
      );
      await axe(side, `ny tekst, bildefanen før opplasting (${modusnavn})`);
      await side.setInputFiles("#bilder", [bilde(1)]);
      await side.locator("ol li").first().waitFor();
      sjekk(`bolk 7 (${modusnavn}): med ett bilde står «Før du tar bildene» som før`, (await foer(side).count()) === 1 && (await etter(side).count()) === 0);
      // Grensen: nøyaktig to bilder gir «Etter».
      await side.setInputFiles("#bilder", [bilde(2)]);
      const toBilder = await etter(side).waitFor({ timeout: 10000 }).then(() => true, () => false);
      sjekk(
        `bolk 7 (${modusnavn}): med to bilder står «Etter» rett over listen, og «Før» er borte`,
        toBilder && (await foer(side).count()) === 0 && (await side.locator("ol li").count()) === 2,
        `etter ${toBilder}, før ${await foer(side).count()}, ${await side.locator("ol li").count()} bilder`,
      );
      await side.setInputFiles("#bilder", [bilde(3)]);
      await side.locator("ol li").nth(2).waitFor();
      const etterTekst = await etter(side).count();
      sjekk(
        `bolk 7 (${modusnavn}): med tre bilder står «Etter at du har valgt bildene» rett over listen, og «Før» er borte`,
        etterTekst === 1 && (await foer(side).count()) === 0 && (await side.locator("ol li").count()) === 3,
        `etter ${etterTekst}, før ${await foer(side).count()}`,
      );
      const uthevetEtter = await side
        .locator("p:has-text('Etter at du har valgt bildene') strong")
        .evaluate((e) => ({ tekst: e.textContent, vekt: Number(getComputedStyle(e).fontWeight), strek: getComputedStyle(e).textDecorationLine }));
      sjekk(
        `bolk 7 (${modusnavn}): «Etter» er fet og understreket`,
        uthevetEtter.tekst === "Etter" && uthevetEtter.vekt >= 700 && uthevetEtter.strek.includes("underline"),
        JSON.stringify(uthevetEtter),
      );
      const etterBoks = await side.locator("p:has-text('Etter at du har valgt bildene')").textContent();
      const status = await side.locator("p[role=status].sr-only", { hasText: "riktig rekkefølge" }).count();
      sjekk(
        `bolk 7 (${modusnavn}): «Etter»-boksen har grensen og «lagres ikke», og byttet leses opp (statusregion)`,
        /Høyst [0-9]+ bilder/.test(etterBoks) && etterBoks.includes("lagres ikke") && status === 1,
        `${etterBoks} / status ${status}`,
      );
      await axe(side, `ny tekst, bildefanen med tre bilder (${modusnavn})`);
      // Fjernes bildene ned til ett, kommer «Før» tilbake.
      await side.locator("button[aria-label='Fjern side 3']").click();
      await side.locator("button[aria-label='Fjern side 2']").click();
      const tilbake = await foer(side).waitFor({ timeout: 10000 }).then(() => true, () => false);
      sjekk(
        `bolk 7 (${modusnavn}): fjernes bildene ned til ett, står «Før du tar bildene» igjen`,
        tilbake && (await etter(side).count()) === 0 && (await side.locator("ol li").count()) === 1,
        `før ${tilbake}, ${await side.locator("ol li").count()} bilder`,
      );
    }
  }

  /* --- Bolk 4: temavalget («Utseende» på kontosiden) ------------------ */
  /** Modus slik siden er tegnet: data-tema, color-scheme, bakgrunnen og en `dark:`-klasse. */
  const modus = (side) =>
    side.evaluate(() => {
      const d = document.querySelector("[class~='dark:text-slate-400']");
      return {
        tema: document.documentElement.dataset.tema ?? null,
        skjema: getComputedStyle(document.documentElement).colorScheme,
        bakgrunn: getComputedStyle(document.body).backgroundColor,
        darkKlasse: d ? getComputedStyle(d).color : null,
      };
    });
  const MOERK_BG = "rgb(15, 18, 38)";
  const LYS_BG = "rgb(255, 245, 247)";
  const SLATE_400 = "rgb(169, 175, 211)";
  const SLATE_600 = "rgb(90, 86, 112)";
  const temaKake = (value) => ({ name: "tema", value, url: APP });

  // Valget overstyrer systemet, også for `dark:`-klassene (konto har en slik på «Logget inn som»).
  for (const [system, valg, ventetBg, ventetDark, navn] of [
    ["light", "moerk", MOERK_BG, SLATE_400, "tema=moerk, systemet lyst"],
    ["dark", "lys", LYS_BG, SLATE_600, "tema=lys, systemet mørkt"],
  ]) {
    const ctx = await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO", colorScheme: system });
    await ctx.addCookies([...(await pc.context().cookies()), temaKake(valg)]);
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    // Første tegning: HTML-en fra serveren har allerede valget, før noe skript kjører.
    const forside = await (await side.request.get(`${APP}/konto`)).text();
    const htmlTagg = forside.match(/<html[^>]*>/)?.[0] ?? "";
    sjekk(
      `temavalg (${navn}): HTML-en fra serveren har data-tema`,
      htmlTagg.includes(`data-tema="${valg}"`),
      htmlTagg.replace(/ class="[^"]*"/, ""),
    );
    await side.goto(`${APP}/konto`);
    const m = await modus(side);
    sjekk(
      `temavalg (${navn}): fargene, color-scheme og dark:-klassene følger valget`,
      m.tema === valg && m.skjema === (valg === "moerk" ? "dark" : "light") && m.bakgrunn === ventetBg && m.darkKlasse === ventetDark,
      JSON.stringify(m),
    );
    for (const [sidenavn, url] of [
      ["konto", `${APP}/konto`],
      ["arbeidsbord", `${APP}/`],
      ["lesevisning", lesing],
    ]) {
      await side.goto(url);
      await axe(side, `${sidenavn} (${navn})`);
    }
    // Landingssiden uten innlogging, med det samme valget.
    const ut = await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO", colorScheme: system, reducedMotion: "reduce" });
    await ut.addCookies([temaKake(valg)]);
    const land = await ut.newPage();
    land.setDefaultTimeout(120000);
    await land.goto(`${APP}/`);
    sjekk(`temavalg (${navn}): landingssiden følger valget`, (await modus(land)).bakgrunn === ventetBg);
    await axe(land, `landingsside (${navn})`);
    await ut.close();
    await ctx.close();
  }
  // Ugyldig verdi behandles som ingen: siden følger systemet.
  {
    const ctx = await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO", colorScheme: "dark" });
    await ctx.addCookies([temaKake("rosa")]);
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    await side.goto(`${APP}/registrer`);
    const m = await modus(side);
    sjekk("temavalg: tema=rosa ignoreres, og siden følger systemet", m.tema === null && m.bakgrunn === MOERK_BG, JSON.stringify(m));
    await ctx.close();
  }
  // Skjemaet: radioknapper i en fieldset med legend, «Lagre» og informasjonskapselen.
  for (const js of [true, false]) {
    const hvordan = js ? "med JavaScript" : "uten JavaScript";
    const ctx = await nettleser.newContext({ viewport: { width: 375, height: 740 }, locale: "nb-NO", colorScheme: "light", javaScriptEnabled: js });
    await ctx.addCookies(await pc.context().cookies());
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    await side.goto(`${APP}/konto`);
    const skjema = side.locator("form:has(legend:has-text('Utseende'))");
    sjekk(
      `temavalg (${hvordan}): «Utseende» er en fieldset med legend og tre radioknapper, «Følg enheten» valgt`,
      (await skjema.locator("fieldset > legend", { hasText: "Utseende" }).count()) === 1 &&
        (await skjema.locator("input[type=radio][name=tema]").count()) === 3 &&
        (await skjema.locator("input[type=radio]:checked").getAttribute("value")) === "",
    );
    /** Bekreftelsen etter lagring: statusregionen med JavaScript, <noscript> uten. */
    const melding = (tekst) => side.locator("p:visible", { hasText: new RegExp(`^${tekst}$`) });
    const valgt = () => skjema.locator("input[type=radio]:checked").getAttribute("value");
    await skjema.locator("label", { hasText: "Mørk" }).click();
    await skjema.locator("button[type=submit]", { hasText: "Lagre" }).click();
    await melding("Lagret: Mørk\\.").waitFor();
    await side.waitForLoadState("load");
    const valgtEtterLagring = await valgt();
    const adresse = side.url().replace(APP, "");
    sjekk(
      `temavalg (${hvordan}): etter «Lagre» er «Mørk» valgt og statusen sier «Lagret: Mørk.»`,
      valgtEtterLagring === "moerk" && (!js || !adresse.includes("lagret")),
      `valgt ${valgtEtterLagring}, adresse ${adresse}`,
    );
    await side.goto(`${APP}/konto`);
    const valgtEtterNy = await valgt();
    const gammel = await side.locator("p:visible", { hasText: /^Lagret:/ }).count();
    sjekk(
      `temavalg (${hvordan}): ny innlasting av /konto viser «Mørk» valgt, uten gammel melding`,
      valgtEtterNy === "moerk" && gammel === 0,
      `valgt ${valgtEtterNy}, ${gammel} meldinger`,
    );
    const kake = (await ctx.cookies()).find((c) => c.name === "tema");
    const dager = kake ? Math.round((kake.expires - Date.now() / 1000) / 86400) : 0;
    const m = await modus(side);
    sjekk(
      `temavalg (${hvordan}): «Mørk» + «Lagre» gir tema=moerk (SameSite=Lax, ett år) og mørk side`,
      kake?.value === "moerk" && kake.sameSite === "Lax" && dager >= 364 && dager <= 366 && m.tema === "moerk" && m.bakgrunn === MOERK_BG,
      kake ? `${kake.value}, ${kake.sameSite}, ${dager} dager, ${m.bakgrunn}` : "ingen informasjonskapsel",
    );
    await side.goto(`${APP}/samling`);
    sjekk(`temavalg (${hvordan}): andre sider er også mørke`, (await modus(side)).bakgrunn === MOERK_BG);
    await side.goto(`${APP}/konto`);
    await skjema.locator("label", { hasText: "Følg enheten" }).click();
    await skjema.locator("button[type=submit]", { hasText: "Lagre" }).click();
    await melding("Lagret: Følg enheten\\.").waitFor();
    await side.waitForLoadState("load");
    const etter = await modus(side);
    sjekk(
      `temavalg (${hvordan}): «Følg enheten» sletter informasjonskapselen og følger systemet igjen`,
      !(await ctx.cookies()).some((c) => c.name === "tema") && etter.tema === null && etter.bakgrunn === LYS_BG,
      JSON.stringify(etter),
    );
    await ctx.close();
  }

  /* --- Design bolk 9: øvekortknappene for én hånd og «Venstrehendt» -- */
  const handKake = (value) => ({ name: "hand", value, url: APP });
  /** Plasseringen av kortet og de fire knappene, og hva Tab treffer etter kortet. */
  async function oevekortOppsett(side) {
    return side.evaluate(() => {
      const flate = document.querySelector(".oevekort-flate");
      const kort = flate?.querySelector(":scope > button[aria-pressed]");
      // Navnet skjermleseren hører: aria-label om den finnes (pilknappene), ellers teksten.
      const knapp = (re) => [...(flate?.querySelectorAll("button") ?? [])].find((b) => re.test(b.getAttribute("aria-label") ?? b.textContent.trim()));
      const r = (e) => {
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return { v: Math.round(b.left), h: Math.round(b.right), t: Math.round(b.top), b: Math.round(b.bottom), w: Math.round(b.width), hoeyde: Math.round(b.height) };
      };
      const maa = knapp(/^Må øve mer$/);
      const kan = knapp(/^Har kontroll$/);
      return {
        hand: document.documentElement.dataset.hand ?? null,
        kort: r(kort),
        maa: r(maa),
        kan: r(kan),
        forrige: r(knapp(/^Forrige kort$/)),
        neste: r(knapp(/^(Neste kort|Ferdig)$/)),
        pressed: [maa?.getAttribute("aria-pressed"), kan?.getAttribute("aria-pressed")],
      };
    });
  }
  function riktigOppsett(o, venstre) {
    const { kort, maa, kan, forrige, neste } = o;
    if (!kort || !maa || !kan || !forrige || !neste) return false;
    const side = venstre ? Math.abs(maa.v - kort.v) <= 1 && Math.abs(kan.v - kort.v) <= 1 : Math.abs(maa.h - kort.h) <= 1 && Math.abs(kan.h - kort.h) <= 1;
    return (
      side &&
      maa.b <= kan.t && kan.b <= kort.t && // «Må øve mer» over «Har kontroll» over kortet
      Math.abs(maa.w - kan.w) <= 1 && // like brede
      [maa, kan, forrige, neste].every((k) => k.w >= 44 && k.hoeyde >= 44) &&
      forrige.t >= kort.b && Math.abs(forrige.t - neste.t) <= 1 && forrige.h <= neste.v && // ved siden av hverandre under
      Math.abs(forrige.w - neste.w) <= 1 && // like brede
      Math.abs(forrige.v - kort.v) <= 1 && Math.abs(neste.h - kort.h) <= 1 && // i full bredde under kortet
      o.pressed.every((p) => p === "true" || p === "false") &&
      o.hand === (venstre ? "venstre" : null)
    );
  }
  for (const [venstre, farge] of [
    [false, "light"],
    [false, "dark"],
    [true, "light"],
    [true, "dark"],
  ]) {
    const navn = `${venstre ? "venstrehendt" : "høyrehendt"}, ${farge === "dark" ? "mørk" : "lys"}`;
    const ctx = await nettleser.newContext({ viewport: { width: 375, height: 800 }, locale: "nb-NO", colorScheme: farge, isMobile: true, hasTouch: true });
    await ctx.addCookies([...(await pc.context().cookies()), ...(venstre ? [handKake("venstre")] : [])]);
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    // Første tegning: HTML-en fra serveren har allerede valget, før noe skript kjører.
    const html = await (await side.request.get(`${tekstUrl}/oevekort`)).text();
    const htmlTagg = html.match(/<html[^>]*>/)?.[0] ?? "";
    sjekk(
      `bolk 9 (${navn}): HTML-en fra serveren ${venstre ? "har" : "har ikke"} data-hand="venstre"`,
      htmlTagg.includes('data-hand="venstre"') === venstre,
      htmlTagg.replace(/ class="[^"]*"/, ""),
    );
    await side.goto(`${tekstUrl}/oevekort`);
    await side.locator(".oevekort-flate").waitFor();
    const o = await oevekortOppsett(side);
    sjekk(
      `bolk 9, 375 px (${navn}): «Må øve mer» over «Har kontroll» over kortet til ${venstre ? "venstre" : "høyre"}, like brede, og pilknappene ved siden av hverandre under`,
      riktigOppsett(o, venstre),
      JSON.stringify(o),
    );
    // Tab-rekkefølgen: kortet, «Må øve mer», «Har kontroll», (feilmeldingen),
    // (kilden når kortet er snudd), «Forrige kort», «Neste kort». På første
    // kort er «Forrige kort» låst og hoppes over, så det sjekkes på et kort med en før.
    // Sjekken trenger minst to kort; med ett er «Neste» «Ferdig» og avslutter runden.
    const forrigeKnapp = side.locator(".oevekort-nav").getByRole("button", { name: "Forrige kort", exact: true });
    const ettKort = (await forrigeKnapp.isDisabled()) && (await side.locator(".oevekort-nav button", { hasText: /^Ferdig$/ }).count()) === 1;
    if (!ettKort && (await forrigeKnapp.isDisabled())) {
      await side.locator(".oevekort-nav").getByRole("button", { name: "Neste kort", exact: true }).click();
    }
    // Navnet skjermleseren hører, så Tab-rekka sammenlignes med det.
    const fokusnavn = () =>
      side.evaluate(() => {
        const e = document.activeElement;
        return e?.getAttribute("aria-label") ?? e?.textContent.trim() ?? "";
      });
    const kortet = side.locator(".oevekort-flate > button[aria-pressed]");
    if ((await kortet.count()) === 1) {
      await kortet.focus();
      const rekke = [];
      for (let i = 0; i < 4; i++) {
        await side.keyboard.press("Tab");
        rekke.push(await fokusnavn());
      }
      sjekk(
        `bolk 9 (${navn}): Tab etter kortet går «Må øve mer» → «Har kontroll» → «Forrige kort» → «Neste kort»`,
        rekke.slice(0, 3).join(" | ") === "Må øve mer | Har kontroll | Forrige kort" && /^(Neste kort|Ferdig)$/.test(rekke[3]),
        rekke.join(" | "),
      );
      // Snudd kort: «Se hvor det står i teksten» kommer etter merkeknappene.
      await kortet.click();
      await side.locator("summary", { hasText: "Se hvor det står i teksten" }).waitFor();
      await kortet.focus();
      const snudd = [];
      for (let i = 0; i < 4; i++) {
        await side.keyboard.press("Tab");
        snudd.push(await fokusnavn());
      }
      sjekk(
        `bolk 9 (${navn}): snudd kort, Tab går «Må øve mer» → «Har kontroll» → «Se hvor det står i teksten» → «Forrige kort»`,
        snudd.join(" | ") === "Må øve mer | Har kontroll | Se hvor det står i teksten | Forrige kort",
        snudd.join(" | "),
      );
      await kortet.click();
    } else {
      sjekk(`bolk 9 (${navn}): Tab-rekkefølgen`, false, ettKort ? "testteksten har bare ett øvekort; sjekken trenger minst to" : "fant ikke kortet etter «Neste»");
    }
    await ingenSiderulling(side, `øvekort 375 px (${navn})`);
    await axe(side, `øvekort 375 px (${navn})`);
    // 320 px, også med 200 % tekst: samme plassering, ingen sidelengs rulling.
    await side.setViewportSize({ width: 320, height: 700 });
    for (const stor of [false, true]) {
      await side.goto(`${tekstUrl}/oevekort`);
      await side.locator(".oevekort-flate").waitFor();
      if (stor) await side.addStyleTag({ content: "html { font-size: 200% !important; }" });
      const smalt = `320 px${stor ? ", 200 % tekst" : ""}`;
      const o2 = await oevekortOppsett(side);
      sjekk(`bolk 9, ${smalt} (${navn}): samme plassering`, riktigOppsett(o2, venstre), JSON.stringify(o2));
      await ingenSiderulling(side, `øvekort ${smalt} (${navn})`);
    }
    await ctx.close();
  }
  // Ugyldig verdi behandles som ingen: standardoppsettet.
  {
    const ctx = await nettleser.newContext({ viewport: { width: 375, height: 800 }, locale: "nb-NO" });
    await ctx.addCookies([...(await pc.context().cookies()), handKake("hoeyre")]);
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    await side.goto(`${tekstUrl}/oevekort`);
    await side.locator(".oevekort-flate").waitFor();
    const o = await oevekortOppsett(side);
    sjekk("bolk 9: hand=hoeyre ignoreres, og merkeknappene står til høyre", riktigOppsett(o, false), JSON.stringify(o));
    await ctx.close();
  }
  // Runde 3, bolk 2b: pilknappene har navn og trykkflate, tilbakelenken står
  // øverst, og ←/→/mellomrom virker på øvekortsiden uten å tabbe rundt.
  {
    const ctx = await nettleser.newContext({ viewport: { width: 375, height: 800 }, locale: "nb-NO" });
    await ctx.addCookies(await pc.context().cookies());
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    await side.goto(`${tekstUrl}/oevekort`);
    await side.locator(".oevekort-flate").waitFor();
    const nav = side.locator(".oevekort-nav");
    const forrige = nav.getByRole("button", { name: "Forrige kort", exact: true });
    const neste = nav.getByRole("button", { name: /^(Neste kort|Ferdig)$/ });
    const boks = async (l) => ((await l.count()) === 1 ? await l.boundingBox() : null);
    const [bf, bn] = [await boks(forrige), await boks(neste)];
    sjekk(
      "bolk 2b: pilknappene heter «Forrige kort» og «Neste kort» (eller «Ferdig» på siste) og er minst 44 × 44 px",
      !!bf &&
        !!bn &&
        [bf, bn].every((b) => b.width >= 44 && b.height >= 44) &&
        (await nav.locator("button", { hasText: /Forrige|Neste/ }).count()) === 0,
      JSON.stringify({ bf, bn }),
    );
    // Tilbakelenken på begge øvekortsidene: én gang, i headeren over overskriften,
    // minst 44 px høy, og til riktig side.
    for (const [url, tekst, riktigHref] of [
      [`${mappeUrl}/oevekort`, "Tilbake til mappen", (h) => h === mappeUrl.replace(APP, "")],
      [`${tekstUrl}/oevekort`, "Tilbake til oppgavene", (h) => h === `${tekstUrl.replace(APP, "")}/oppgaver`],
    ]) {
      await side.goto(url);
      await side.locator("main h1").waitFor();
      const tilbake = side.locator("main header a", { hasText: tekst });
      const h1 = await side.locator("main h1").boundingBox();
      const bt = await boks(tilbake);
      const href = bt ? await tilbake.getAttribute("href") : null;
      sjekk(
        `bolk 2b: «${tekst}» står én gang øverst i headeren, over overskriften, minst 44 px høy, og lenker til ${tekst === "Tilbake til mappen" ? "mappen" : "oppgavene"}`,
        !!bt &&
          !!h1 &&
          bt.y + bt.height <= h1.y &&
          bt.height >= 44 &&
          !!href &&
          riktigHref(href) &&
          (await side.locator("main a", { hasText: tekst }).count()) === 1,
        JSON.stringify({ bt, href }),
      );
    }
    await side.locator(".oevekort-flate").waitFor();
    const teller = side.locator("main p", { hasText: /^Kort \d+ av \d+/ }).first();
    const kortnr = async () => Number((await teller.textContent()).match(/Kort (\d+)/)?.[1]);
    const antall = Number((await teller.textContent()).match(/av (\d+)/)?.[1]);
    const kortet = side.locator(".oevekort-flate > button[aria-pressed]");
    const snudd = async () => (await kortet.getAttribute("aria-pressed")) === "true";
    const slippFokus = () => side.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
    // Fokus på body: ← på første gjør ingenting, mellomrom snur, → går videre med forsiden opp, ← tilbake.
    await slippFokus();
    const start = await kortnr();
    const funnet = {};
    if (start === 1) {
      await side.keyboard.press("ArrowLeft");
      funnet.venstrePaaFoerste = await kortnr();
    }
    await side.keyboard.press("Space");
    funnet.mellomromSnur = await snudd();
    await side.keyboard.press("Space");
    funnet.mellomromSnurTilbake = !(await snudd());
    if (start < antall) {
      await side.keyboard.press("Space");
      await side.keyboard.press("ArrowRight");
      funnet.hoeyre = await kortnr();
      funnet.forsidenOpp = !(await snudd());
      await side.keyboard.press("ArrowLeft");
      funnet.venstre = await kortnr();
    }
    // Ctrl+→ er nettleserens.
    await side.keyboard.press("Control+ArrowRight");
    funnet.ctrl = await kortnr();
    // Mellomrom på kortknappen snur én gang, ikke to.
    await kortet.focus();
    await side.keyboard.press("Space");
    funnet.paaKortet = await snudd();
    // Mellomrom på «Se hvor det står i teksten» feller den ut; kortet snus ikke.
    const kilde = side.locator("summary", { hasText: "Se hvor det står i teksten" });
    await kilde.focus();
    await side.keyboard.press("Space");
    funnet.paaSummary = (await snudd()) && (await kilde.evaluate((e) => e.parentElement.open));
    await kortet.click();
    // Et skjemafelt på siden fanger ingenting: piltaster og mellomrom går til feltet.
    await side.evaluate(() => {
      const f = document.createElement("input");
      f.id = "proevefelt";
      document.querySelector("main").prepend(f);
    });
    await side.locator("#proevefelt").focus();
    const foer = await kortnr();
    await side.keyboard.press("ArrowRight");
    await side.keyboard.press("Space");
    funnet.iFeltet = (await kortnr()) === foer && !(await snudd()) && (await side.locator("#proevefelt").inputValue()) === " ";
    await side.evaluate(() => document.getElementById("proevefelt")?.remove());
    // → på siste kort avslutter runden, som «Ferdig».
    await slippFokus();
    const ferdig = side.locator("h2", { hasText: "Runden er ferdig" });
    for (let i = 0; i <= antall && (await ferdig.count()) === 0; i++) await side.keyboard.press("ArrowRight");
    funnet.ferdig = (await ferdig.count()) === 1;
    sjekk(
      "bolk 2b: ← (ikke på første), → (forsiden opp), mellomrom (én gang, også på kortet), ikke i skjemafelt, ikke med Ctrl, og → på siste avslutter runden",
      (start !== 1 || funnet.venstrePaaFoerste === 1) &&
        funnet.mellomromSnur &&
        funnet.mellomromSnurTilbake &&
        (start >= antall || (funnet.hoeyre === start + 1 && funnet.forsidenOpp && funnet.venstre === start)) &&
        funnet.ctrl === start &&
        funnet.paaKortet &&
        funnet.paaSummary &&
        funnet.iFeltet &&
        funnet.ferdig,
      JSON.stringify({ start, antall, ...funnet }),
    );
    await ctx.close();
  }
  // Skjemaet på /konto: en avkrysningsboks, «Lagre» og informasjonskapselen, med og uten skript.
  for (const js of [true, false]) {
    const hvordan = js ? "med JavaScript" : "uten JavaScript";
    const ctx = await nettleser.newContext({ viewport: { width: 375, height: 740 }, locale: "nb-NO", javaScriptEnabled: js });
    await ctx.addCookies(await pc.context().cookies());
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    await side.goto(`${APP}/konto`);
    const skjema = side.locator("form:has(legend:has-text('Øvekortene'))");
    const boks = skjema.locator("input[type=checkbox][name=hand]");
    sjekk(
      `venstrehendt (${hvordan}): «Venstrehendt» er en avkrysningsboks i en fieldset med legend, ikke valgt`,
      (await skjema.locator("fieldset > legend", { hasText: "Øvekortene" }).count()) === 1 &&
        (await skjema.locator("label", { hasText: "Venstrehendt" }).count()) === 1 &&
        (await boks.count()) === 1 &&
        !(await boks.isChecked()),
    );
    const navn = await side.evaluate(() => {
      const boks = document.querySelector("input[name=hand]");
      const hjelp = document.getElementById(boks?.getAttribute("aria-describedby") ?? "");
      const tema = document.querySelector("fieldset[aria-describedby]");
      return {
        knapper: [...document.querySelectorAll("main form button[type=submit]")].map((b) => b.textContent.trim()).filter((t) => t.startsWith("Lagre")),
        hjelp: hjelp?.textContent.replace(/\s+/g, " ").trim() ?? "",
        hjelpIFieldset: !!hjelp?.closest("fieldset"),
        tema: document.getElementById(tema?.getAttribute("aria-describedby") ?? "")?.textContent.trim() ?? "",
      };
    });
    sjekk(
      `venstrehendt (${hvordan}): «Lagre»-knappene har ulike navn, og hjelpetekstene er koblet til valgene`,
      navn.knapper.includes("Lagre utseendet") &&
        navn.knapper.includes("Lagre valget for øvekortene") &&
        navn.hjelp.startsWith("«Må øve mer» og «Har kontroll» står til venstre") &&
        navn.hjelpIFieldset &&
        navn.tema.startsWith("Valget gjelder denne enheten."),
      JSON.stringify(navn),
    );
    const melding = (tekst) => side.locator("p:visible", { hasText: new RegExp(`^${tekst}$`) });
    await skjema.locator("label", { hasText: "Venstrehendt" }).click();
    await skjema.locator("button[type=submit]", { hasText: "Lagre" }).click();
    await melding("Lagret: Venstrehendt\\.").waitFor();
    await side.waitForLoadState("load");
    const kake = (await ctx.cookies()).find((c) => c.name === "hand");
    const dager = kake ? Math.round((kake.expires - Date.now() / 1000) / 86400) : 0;
    sjekk(
      `venstrehendt (${hvordan}): kryss + «Lagre» gir hand=venstre (SameSite=Lax, httpOnly, ett år), og boksen er krysset`,
      kake?.value === "venstre" && kake.sameSite === "Lax" && kake.httpOnly && dager >= 364 && dager <= 366 && (await boks.isChecked()),
      kake ? `${kake.value}, ${kake.sameSite}, ${dager} dager` : "ingen informasjonskapsel",
    );
    if (js) await axe(side, "konto med «Venstrehendt» valgt");
    await side.goto(`${tekstUrl}/oevekort`);
    await side.locator(".oevekort-flate").waitFor();
    const o = await oevekortOppsett(side);
    sjekk(`venstrehendt (${hvordan}): øvekortene har merkeknappene til venstre etter lagring`, riktigOppsett(o, true), JSON.stringify(o));
    await side.goto(`${APP}/konto`);
    await skjema.locator("label", { hasText: "Venstrehendt" }).click();
    await skjema.locator("button[type=submit]", { hasText: "Lagre" }).click();
    await melding("Lagret: Ikke venstrehendt\\.").waitFor();
    await side.waitForLoadState("load");
    sjekk(
      `venstrehendt (${hvordan}): uten kryss + «Lagre» slettes informasjonskapselen`,
      !(await ctx.cookies()).some((c) => c.name === "hand") && !(await boks.isChecked()),
    );
    await ctx.close();
  }

  /* --- Telefon ------------------------------------------------------ */
  const kontekst = await nettleser.newContext({
    viewport: { width: 375, height: 740 },
    isMobile: true,
    hasTouch: true,
    locale: "nb-NO",
  });
  const tlf = await kontekst.newPage();
  tlf.setDefaultTimeout(120000);
  await tlf.goto(`${APP}/logg-inn`);
  await tlf.fill("#epost", EPOST);
  await tlf.fill("#passord", PASSORD);
  await tlf.click("form button[type=submit]");
  await tlf.waitForURL(`${APP}/`);
  sjekk("innlogget (/ på telefon): ingen «Logg inn» eller «For lærere» i topplinjen", await ingenLandingsmeny(tlf));

  for (const [navn, url] of [
    ["arbeidsbord", `${APP}/`],
    ["samling", `${APP}/samling`],
    ["ny tekst", `${APP}/ny`],
    ["aktivering", `${tekstUrl}/aktivering`],
    ["lesevisning", lesing],
    ["oppgaver", `${tekstUrl}/oppgaver`],
    ["øvekort", `${tekstUrl}/oevekort`],
    ["minnevers", `${tekstUrl}/minnevers`],
    ["mappe", mappeUrl],
    ["mappe: øvekort", `${mappeUrl}/oevekort`],
    ["mappe: quiz", `${mappeUrl}/quiz?lengde=kort`],
    ["konto", `${APP}/konto`],
  ]) {
    await tlf.goto(url);
    await ingenSiderulling(tlf, navn);
    await axe(tlf, `${navn} (telefon)`);
  }

  await tlf.goto(lesing);
  const tOrd = tlf.locator("article button[aria-expanded]");
  const tDialog = tlf.locator("article [role=dialog]");
  // Et ord langt til høyre i linja er det vanskeligste for plasseringen.
  const n = await tOrd.count();
  let hoeyre = 0;
  let maks = -1;
  for (let i = 0; i < Math.min(n, 15); i++) {
    const b = await tOrd.nth(i).boundingBox();
    if (b && b.x > maks) {
      maks = b.x;
      hoeyre = i;
    }
  }
  await tOrd.nth(hoeyre).scrollIntoViewIfNeeded();
  const tFoer = await tlf.evaluate(() => window.scrollY);
  await tOrd.nth(hoeyre).tap();
  sjekk("FR-10 telefon: trykk åpner forklaringen", await tDialog.isVisible());
  const kant = await tDialog.boundingBox();
  sjekk("FR-10 telefon: forklaringen er innenfor skjermen", !!kant && kant.x >= 0 && kant.x + kant.width <= 375 + 1, kant ? `${Math.round(kant.x)}–${Math.round(kant.x + kant.width)} px` : "");
  sjekk("FR-10 telefon: rulleposisjonen står stille", (await tlf.evaluate(() => window.scrollY)) === tFoer);
  await tlf.locator("h1").tap();
  sjekk("FR-10 telefon: trykk utenfor lukker", (await tDialog.count()) === 0);
  await ingenSiderulling(tlf, "lesevisning etter forklaring");

  // Bolk 6, utkast C: Buddy hilser ved siden av «Hei!» med neste steg i en boble, som pynt.
  await tlf.goto(`${APP}/`);
  const hilsen = await tlf.evaluate(() => {
    const h = document.querySelector(".hilsen-buddy");
    const svg = h?.querySelector("svg.merke.mini");
    const b = h?.getBoundingClientRect();
    return {
      synlig: !!h?.checkVisibility(),
      skjult: h?.getAttribute("aria-hidden") === "true",
      brille: svg ? Math.round(svg.getBoundingClientRect().height) : 0,
      boble: h?.querySelector(".hilsen-boble")?.textContent ?? "",
      innenfor: !!b && b.left >= 0 && b.right <= window.innerWidth,
    };
  });
  sjekk(
    "bolk 6, 375 px: Buddy (brillene 36 px) hilser ved «Hei!» med neste steg i boblen, aria-hidden",
    hilsen.synlig && hilsen.skjult && hilsen.brille === 36 && hilsen.boble.includes("EM-bølger") && hilsen.innenfor,
    JSON.stringify(hilsen),
  );

  // Bolk 6, utkast D: viften på telefon er et ark som glir opp fra bunnen.
  const tVifte = tlf.locator("[role=dialog][aria-modal=true]");
  const tBunke = tlf.locator("button[aria-expanded]", { hasText: "Vis aktiviteter for EM-bølger" });
  await tBunke.tap(HJOERNE);
  await tVifte.waitFor();
  await tlf.waitForTimeout(1000); // arket har glidd opp
  /** Arket og «Legg sammen» innenfor skjermen, og arket høyst 90 % av den. */
  const maalArk = (side) =>
    side.evaluate(() => {
      const d = document.querySelector("[role=dialog]");
      const a = d.getBoundingClientRect();
      const l = d.querySelector(".vifte-lukk").getBoundingClientRect();
      const inne = (r) => r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth + 0.5 && r.bottom <= window.innerHeight + 0.5;
      return {
        oppsett: d.dataset.oppsett,
        posisjon: getComputedStyle(d).position,
        arkInne: inne(a),
        lukkInne: inne(l) && l.top >= a.top && l.bottom <= a.bottom,
        andel: Math.round((a.height / window.innerHeight) * 100),
        ruller: d.scrollHeight > d.clientHeight + 1,
        siden: document.documentElement.scrollHeight > window.innerHeight && getComputedStyle(document.documentElement).overflowY !== "hidden",
        rader: d.querySelectorAll(".vifte-kort > li").length,
      };
    });
  const tArk = await maalArk(tlf);
  sjekk(
    "bolk 6, 375 px: viften er et ark nederst, med fem rader, og arket og «Legg sammen» er innenfor skjermen",
    tArk.oppsett === "ark" && tArk.posisjon === "fixed" && tArk.arkInne && tArk.lukkInne && tArk.rader === 5,
    JSON.stringify(tArk),
  );
  sjekk("bolk 6, 375 px: arket er høyst 90 % av skjermen, og siden under ruller ikke", tArk.andel <= 90 && !tArk.siden, `${tArk.andel} %`);
  sjekk(
    "bolk 6, arket: fokus på den første raden",
    await tlf.evaluate(() => !!document.activeElement?.closest("[role=dialog]") && document.activeElement.textContent.includes("Teksten")),
  );
  let tUtenfor = 0;
  for (let i = 0; i < 8; i++) {
    await tlf.keyboard.press("Tab");
    if (!(await tlf.evaluate(() => !!document.activeElement?.closest("[role=dialog]")))) tUtenfor++;
  }
  for (let i = 0; i < 3; i++) {
    await tlf.keyboard.press("Shift+Tab");
    if (!(await tlf.evaluate(() => !!document.activeElement?.closest("[role=dialog]")))) tUtenfor++;
  }
  sjekk("bolk 6, arket: Tab og Shift+Tab holder fokus i arket", tUtenfor === 0, `${tUtenfor} av 11 trykk gikk ut`);
  await ingenSiderulling(tlf, "arbeidsbord med åpent ark");
  await axe(tlf, "arbeidsbord med åpent ark (telefon)");
  /** Etter hver lukkevei: arket er borte, siden ruller igjen, og fokus er tilbake på bunkens knapp. */
  async function arketLukket(navn) {
    await tlf.waitForTimeout(200);
    const r = await tlf.evaluate(() => ({
      dialog: document.querySelectorAll("[role=dialog]").length,
      harArk: document.documentElement.classList.contains("har-ark"),
      overflow: getComputedStyle(document.documentElement).overflowY,
    }));
    const fokus = await tBunke.evaluate((e) => e === document.activeElement);
    sjekk(
      `bolk 6, arket: ${navn} lukker, har-ark er borte, siden ruller igjen, og fokus er tilbake på bunkens knapp`,
      r.dialog === 0 && !r.harArk && r.overflow !== "hidden" && fokus,
      JSON.stringify({ ...r, fokus }),
    );
  }
  await tlf.keyboard.press("Escape");
  await arketLukket("Esc");
  await tBunke.tap(HJOERNE);
  await tVifte.waitFor();
  await tlf.waitForTimeout(700);
  // Et trykk på bakgrunnen over arket legger det sammen (ingen sveip eller dragging).
  // Midt i plassen mellom toppen av skjermen og toppen av arket.
  const arkTopp = await tVifte.evaluate((d) => d.getBoundingClientRect().top);
  if (arkTopp < 10) {
    sjekk("bolk 6, arket: det er plass over arket til å trykke på bakgrunnen", false, `arket starter ${Math.round(arkTopp)} px fra toppen`);
  } else {
    await tlf.touchscreen.tap(187, Math.round(arkTopp / 2));
    await arketLukket("trykk på bakgrunnen");
  }
  if ((await tVifte.count()) === 0) {
    await tBunke.tap(HJOERNE);
    await tVifte.waitFor();
  }
  await tlf.locator("[role=dialog] button:has-text('Legg sammen')").tap();
  await arketLukket("«Legg sammen»");
  sjekk(
    "menyen på telefon viser Samlinger og Konto",
    (await tlf.locator("nav a:visible", { hasText: "Samlinger" }).count()) === 1 && (await tlf.locator("nav a:visible", { hasText: "Konto" }).count()) === 1,
  );

  /* --- Bolk 5: tenkepillen og Buddy i knappen, på telefon ----------- */
  // Handlingskall (POST med Next-Action) holdes igjen til sjekkene er gjort, så
  // ventingen står stille. `slipp()` slipper dem, venter på svaret og fjerner ruten.
  async function holdHandlinger(side) {
    let aapne;
    const holdt = new Promise((ok) => (aapne = ok));
    const erHandling = (r) => r.method() === "POST" && !!r.headers()["next-action"];
    const hold = { antall: 0 };
    const svar = side.waitForResponse((r) => erHandling(r.request()), { timeout: 180000 }).then(
      () => true,
      () => false,
    );
    await side.route("**/*", async (rute) => {
      if (erHandling(rute.request())) {
        hold.antall++;
        await holdt;
      }
      await rute.continue();
    });
    hold.slipp = async () => {
      aapne();
      const ok = await svar;
      await side.unrouteAll({ behavior: "ignoreErrors" });
      return ok;
    };
    return hold;
  }
  const PILLE = ".tenker-flate";
  // Knapper og lenker utenfor pillen som ligger (helt eller delvis) under den.
  const underPillen = (side) =>
    side.evaluate((sel) => {
      const pb = document.querySelector(sel).getBoundingClientRect();
      const treff = (b) => b.width > 0 && b.height > 0 && b.left < pb.right && b.right > pb.left && b.top < pb.bottom && b.bottom > pb.top;
      return [...document.querySelectorAll("a, button, input, select, textarea, [tabindex]:not([tabindex='-1'])")]
        .filter((e) => !e.closest(sel) && !e.closest(".sr-only") && getComputedStyle(e).visibility !== "hidden")
        .filter((e) => treff(e.getBoundingClientRect()))
        .map((e) => e.textContent.trim().slice(0, 30) || e.tagName.toLowerCase());
    }, PILLE);
  // Tab gjennom siden: fokus skal aldri havne bak pillen (scroll-padding-bottom).
  async function fokusBakPillen(side) {
    await side.evaluate(() => window.scrollTo(0, 0));
    const dekket = [];
    for (let i = 0; i < 25; i++) {
      await side.keyboard.press("Tab");
      const d = await side.evaluate((sel) => {
        const e = document.activeElement;
        if (!e || e === document.body || e.closest(sel)) return null;
        const pb = document.querySelector(sel).getBoundingClientRect();
        const b = e.getBoundingClientRect();
        const over = b.left < pb.right && b.right > pb.left && b.top < pb.bottom && b.bottom > pb.top;
        return over ? e.textContent.trim().slice(0, 30) || e.tagName.toLowerCase() : null;
      }, PILLE);
      if (d) dekket.push(d);
    }
    return dekket;
  }
  async function bunnOgFokus(side, navn) {
    await side.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await side.waitForTimeout(200);
    const bunn = await underPillen(side);
    sjekk(
      `bolk 5, ${navn}: rullet til bunns er pillen fortsatt synlig, og ingen knapp eller lenke ligger under den`,
      (await side.locator(PILLE).isVisible()) && bunn.length === 0,
      bunn.join(", "),
    );
    const dekket = await fokusBakPillen(side);
    sjekk(`bolk 5, ${navn}: pillen dekker ikke fokusert innhold`, dekket.length === 0, dekket.join(", "));
  }

  // Quizen lages av seg selv første gang siden åpnes.
  const quizHold = await holdHandlinger(tlf);
  try {
    await tlf.goto(`${tekstUrl}/quiz`);
    const pille = tlf.locator(PILLE);
    const kom = await pille.waitFor({ timeout: 60000 }).then(
      () => true,
      () => false,
    );
    sjekk("bolk 5, 375 px: tenkepillen vises mens quizen lages", kom);
    if (kom) {
      await tlf.waitForTimeout(500); // inngangen (0,3 s) er ferdig
      const p = await pille.evaluate((el) => {
        const s = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        const svg = [...el.querySelectorAll("svg.merke")].find((m) => getComputedStyle(m).display !== "none");
        const rot = document.documentElement;
        return {
          posisjon: s.position,
          nederst: Math.round(window.innerHeight - b.bottom),
          innenfor: b.left >= 0 && b.right <= window.innerWidth && b.bottom <= window.innerHeight,
          mini: !!svg?.classList.contains("mini"),
          merke: svg ? Math.round(svg.getBoundingClientRect().height) : 0,
          tekst: el.textContent,
          regioner: el.querySelectorAll("[role=status]").length,
          regionTekst: el.querySelector("[role=status]")?.textContent ?? "",
          svgSkjult: [...el.querySelectorAll("svg")].every((m) => m.getAttribute("aria-hidden") === "true"),
          variabel: getComputedStyle(rot).getPropertyValue("--tenker-pille").trim(),
          hoeyde: el.offsetHeight,
          klasse: rot.classList.contains("har-tenkepille"),
        };
      });
      sjekk(
        "bolk 5, 375 px: pillen ligger fast nederst med mini-Buddy (brillene 28 px) og «Buddy lager quizen din …»",
        p.posisjon === "fixed" && p.innenfor && p.nederst >= 16 && p.mini && p.merke === 28 && p.tekst.includes("Buddy lager quizen din"),
        JSON.stringify({ posisjon: p.posisjon, nederst: p.nederst, mini: p.mini, merke: p.merke }),
      );
      sjekk(
        "bolk 5: pillen har én statusregion (ikke en ekstra), med teksten, og merkene er skjult for skjermlesere",
        p.regioner === 1 && p.regionTekst.includes("Buddy lager quizen din") && p.svgSkjult,
      );
      sjekk(
        "bolk 5: --tenker-pille på <html> er lik høyden på pillen, og html har klassen har-tenkepille",
        p.klasse && p.variabel === `${p.hoeyde}px`,
        `${p.variabel} / ${p.hoeyde}px`,
      );

      await bunnOgFokus(tlf, "375 px");
      await axe(tlf, "quiz som lages, med tenkepillen (telefon)");

      // Én gang til med 200 % tekst.
      await tlf.evaluate(() => {
        const s = document.createElement("style");
        s.id = "sjekk-stor-tekst";
        s.textContent = "html { font-size: 200% !important; }";
        document.head.append(s);
      });
      await tlf.waitForTimeout(400);
      await bunnOgFokus(tlf, "375 px, 200 % tekst");
      await tlf.evaluate(() => document.getElementById("sjekk-stor-tekst")?.remove());

      // 760 px og bredere: ingen pille, flaten som i dag (64 px).
      await tlf.setViewportSize({ width: 1280, height: 900 });
      await tlf.waitForTimeout(400);
      const bred = await pille.evaluate((el) => {
        const svg = [...el.querySelectorAll("svg.merke")].find((m) => getComputedStyle(m).display !== "none");
        return {
          posisjon: getComputedStyle(el).position,
          mini: !!svg?.classList.contains("mini"),
          merke: svg ? Math.round(svg.getBoundingClientRect().height) : 0,
          luft: getComputedStyle(document.body).paddingBottom,
          klasse: document.documentElement.classList.contains("har-tenkepille"),
        };
      });
      sjekk(
        "bolk 5, 1280 px: ingen pille, flaten med Buddy på 64 px",
        bred.posisjon !== "fixed" && !bred.mini && bred.merke === 64 && bred.luft === "0px" && !bred.klasse,
        JSON.stringify(bred),
      );
    }
  } finally {
    await tlf.setViewportSize({ width: 375, height: 740 });
    sjekk("bolk 5: handlingen som ble holdt igjen (quizen), fikk svar", await quizHold.slipp());
  }
  // Quizen (eller feilmeldingen i testmodus) tar over, og pillen forsvinner.
  sjekk(
    "bolk 5: pillen forsvinner når quizen er laget",
    await tlf
      .locator(PILLE)
      .waitFor({ state: "detached", timeout: 120000 })
      .then(
        () => true,
        () => false,
      ),
  );

  // Buddy i knappen: «Lever» er låst (aria-disabled, ikke nedtonet) mens quizen rettes.
  const lever = tlf.locator("button.tenker-knapp", { hasText: "Lever" });
  const fantLever = await lever.waitFor({ timeout: 60000 }).then(
    () => true,
    () => false,
  );
  sjekk("bolk 5: quizsiden har «Lever»-knappen (Tenker i knapp-form)", fantLever);
  if (fantLever) {
    const leverHold = await holdHandlinger(tlf);
    try {
      await lever.click();
      const laast = tlf.locator("button.tenker-knapp[aria-disabled=true]");
      const ble = await laast.waitFor({ timeout: 10000 }).then(
        () => true,
        () => false,
      );
      // Et nytt trykk mens Buddy tenker, sender ikke svarene en gang til.
      // force: Playwright regner aria-disabled som låst og ville ellers ventet på at knappen ble ledig.
      if (ble) await laast.click({ force: true, timeout: 5000 });
      await tlf.waitForTimeout(300);
      const k = await tlf.evaluate(() => {
        const b = document.querySelector("button.tenker-knapp");
        const svg = b?.querySelector("svg.merke.mini");
        return {
          laast: b?.getAttribute("aria-disabled") === "true" && !b.disabled,
          opasitet: b ? Number(getComputedStyle(b).opacity) : 0,
          brille: svg ? Math.round(svg.getBoundingClientRect().height) : 0,
          tekst: b?.textContent ?? "",
          fokus: document.activeElement === b,
        };
      });
      sjekk(
        "bolk 5, knapp: låst med aria-disabled, opasitet ≥ 0,9, brillene om lag 20 px, statusen som knappetekst og fokus på knappen",
        ble && k.laast && k.opasitet >= 0.9 && Math.abs(k.brille - 20) <= 1 && k.tekst.includes("Buddy retter quizen") && k.fokus,
        JSON.stringify(k),
      );
      sjekk("bolk 5, knapp: et nytt trykk mens Buddy tenker, sender ikke en gang til", leverHold.antall === 1, `${leverHold.antall} kall`);
    } finally {
      sjekk("bolk 5: handlingen som ble holdt igjen (rettingen), fikk svar", await leverHold.slipp());
    }
  }

  /* --- FR-52: levering av den samlede quizen ------------------------- */
  // Quizen til eksempelteksten finnes nå. Mappequizen med lengden «Kort»
  // (2 spørsmål fra den ene teksten) leveres uten svar, og forsøket står
  // under «Tidligere forsøk» med lengden og antallet.
  {
    await pc.goto(`${mappeUrl}/quiz?lengde=kort`);
    const leverM = pc.locator("button.tenker-knapp", { hasText: "Lever" });
    const fant = await leverM.waitFor({ timeout: 60000 }).then(
      () => true,
      () => false,
    );
    const antallSp = await pc.locator("main ol > li").count();
    sjekk("FR-52: mappequizen «Kort» har 2 spørsmål og «Lever»", fant && antallSp === 2, `${antallSp} spørsmål`);
    if (fant) {
      await leverM.click();
      await pc.locator("main [role=status]", { hasText: /Du fikk 0 av 2 riktige/ }).waitFor({ timeout: 60000 });
      await axe(pc, "mappe: quiz, levert");
      await pc.goto(`${mappeUrl}/quiz`);
      const rad = pc.locator("main li", { hasText: "Kort" }).filter({ hasText: "0 av 2 riktige" });
      sjekk("FR-52: forsøket står under «Tidligere forsøk» med lengden og antallet", (await rad.count()) === 1);
    }
  }

  /* --- Overleveringen (17.11): avslutningen når svaret bytter side ---- */
  // Svaret sender eleven til en ny side, så indikatoren i skjemaet forsvinner.
  // Avslutningen gis videre til verten i rotlayouten (TenkerVert), som spiller
  // den i pillen på lesevisningen. Tekstene legges rett inn i databasen, limt
  // inn og med godkjente overskrifter (aktiveringen er neste steg), eller låst
  // uten fagord (lesevisningen med «Prøv igjen»). De ryddes bort etterpå, så
  // arbeidsbordet er som før for sjekkene under.
  {
    const pool = new pg.Pool({ connectionString: DB, max: 1 });
    const proever = [];
    const VERT = ".tenker-vert";
    const vertRegion = (side) =>
      side.evaluate(() => {
        // Verten er den siste statusregionen i <body>, rett etter #innhold.
        const r = [...document.querySelectorAll("body > [role=status], body > div > [role=status]")].filter((e) => !e.closest("#innhold"));
        return { antall: r.length, tekst: r.map((e) => e.textContent).join(" | ") };
      });
    // Merker om verten viser seg en eneste gang, også mellom to målinger.
    // Lever gjennom navigeringen i appen (samme vindu).
    const vaktVert = (side) =>
      side.evaluate((sel) => {
        window.__vertSett = !!document.querySelector(sel);
        window.__vertVakt?.disconnect();
        window.__vertVakt = new MutationObserver(() => {
          const v = document.querySelector(sel);
          if (v) {
            window.__vertSett = true;
            window.__vertTekst = `${location.pathname}: ${v.textContent}`;
          }
        });
        window.__vertVakt.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
      }, VERT);
    const vertSett = (side) => side.evaluate(() => window.__vertSett === true);
    const nyTekst = async (kontoId, tittel, laast, innhold = eksempel) => {
      const r = await pool.query(
        laast
          ? `insert into tekst (konto_id, tittel, raatekst, redigert_tekst, vei, tilstand, overskrifter_godkjent, laast_tidspunkt)
             values ($1, $2, $3, $3, 'liming', 'laast', now(), now()) returning id`
          : `insert into tekst (konto_id, tittel, raatekst, redigert_tekst, vei, tilstand, overskrifter_godkjent)
             values ($1, $2, $3, $3, 'liming', 'innlest', now()) returning id`,
        [kontoId, tittel, innhold],
      );
      proever.push(r.rows[0].id);
      return r.rows[0].id;
    };
    try {
      const [{ id: kontoId }] = (await pool.query(`select id from "user" where email = $1`, [EPOST])).rows;

      // Forlat-vernet: eleven trykker en lenke i topplinjen mens Buddy tenker.
      // Handlingen holdes igjen til lenken er trykket, og slippes så.
      const forlatt = await nyTekst(kontoId, "Overleveringsprøve, forlatt", false);
      await tlf.goto(`${APP}/tekst/${forlatt}/aktivering`);
      // Et svar i skjemaet, så handlingen ikke bare svarer med oppfordringen.
      await tlf.fill("#lurer-paa", "Hvorfor kan vi ikke se radiobølger?");
      await tlf.locator("input[type=range]").first().focus();
      await tlf.keyboard.press("ArrowRight");
      const forlatHold = await holdHandlinger(tlf);
      let forlatOk = false;
      let forlatDetaljer = "";
      try {
        await tlf.locator("button[type=submit]", { hasText: "Videre" }).click();
        await tlf.locator(PILLE).waitFor({ timeout: 15000 });
        await vaktVert(tlf);
        const lenke = tlf.locator("header a[href]:visible", { hasText: "Samlinger" }).first();
        await lenke.click();
        // React fletter navigeringen sammen med handlingen som venter, så
        // siden byttes først når handlingen har svart. Next forkaster svaret
        // (navigeringen går foran), og eleven havner på Samlingen.
        await tlf.waitForTimeout(500);
        const slapp = await forlatHold.slipp();
        await tlf.waitForURL(/\/samling(\?.*)?$/, { timeout: 60000 });
        // Verten ville vist seg straks etter byttet (og stått i 4,85 s).
        await tlf.waitForTimeout(1500);
        const sett = await vertSett(tlf);
        forlatOk = slapp && !sett && (await tlf.locator(VERT).count()) === 0;
        forlatDetaljer = `svar ${slapp}, verten sett ${sett}, ${tlf.url().replace(APP, "")}`;
      } catch (e) {
        await forlatHold.slipp().catch(() => false);
        forlatDetaljer = e.message.split("\n")[0];
      }
      sjekk("overleveringen: en lenke i topplinjen trykket mens Buddy tenker, gir ingen avslutning", forlatOk, forlatDetaljer);

      // Forlat-vernet med «tilbake» (popstate): eleven kom til aktiveringen fra
      // Samlingen i appen, og trykker tilbake mens Buddy tenker.
      const tilbakeTekst = await nyTekst(kontoId, "Overleveringsprøve, tilbake", false);
      await tlf.goto(`${APP}/samling`);
      await tlf.locator(`a[href="/tekst/${tilbakeTekst}/aktivering"]`).first().click();
      await tlf.waitForURL(/\/aktivering$/);
      await tlf.fill("#lurer-paa", "Hvorfor kan vi ikke se radiobølger?");
      const tilbakeHold = await holdHandlinger(tlf);
      let tilbakeOk = false;
      let tilbakeDetaljer = "";
      try {
        await tlf.locator("button[type=submit]", { hasText: "Videre" }).click();
        await tlf.locator(PILLE).waitFor({ timeout: 15000 });
        await vaktVert(tlf);
        await tlf.goBack();
        await tlf.waitForTimeout(500);
        const slapp = await tilbakeHold.slipp();
        await tlf.waitForURL(/\/samling(\?.*)?$/, { timeout: 60000 });
        await tlf.waitForTimeout(1500);
        const sett = await vertSett(tlf);
        tilbakeOk = slapp && !sett && (await tlf.locator(VERT).count()) === 0;
        tilbakeDetaljer = `svar ${slapp}, verten sett ${sett} (${await tlf.evaluate(() => window.__vertTekst ?? "")}), ${tlf.url().replace(APP, "")}`;
      } catch (e) {
        await tilbakeHold.slipp().catch(() => false);
        tilbakeDetaljer = e.message.split("\n")[0];
      }
      sjekk("overleveringen: «tilbake» trykket mens Buddy tenker, gir ingen avslutning", tilbakeOk, tilbakeDetaljer);

      // Omdirigering til en feiladresse: teksten låses, men fagordene kan ikke
      // lages (i testmodus `les` finnes ikke noe lagret svar for denne
      // teksten), så eleven havner på /lesing?fagordfeil=… Ingen avslutning.
      const feilTekst = await nyTekst(kontoId, "Overleveringsprøve, fagordfeil", false, `${eksempel}\n\nEt ekstra avsnitt som bare finnes i feilprøven.`);
      await tlf.goto(`${APP}/tekst/${feilTekst}/aktivering`);
      await tlf.fill("#lurer-paa", "Hva er en bølge?");
      await vaktVert(tlf);
      await tlf.locator("button[type=submit]", { hasText: "Videre" }).click();
      const tilFeil = await tlf.waitForURL((u) => u.pathname.endsWith("/lesing") && u.searchParams.has("fagordfeil"), { timeout: 120000 }).then(
        () => true,
        () => false,
      );
      await tlf.waitForTimeout(1500);
      const feilSett = await vertSett(tlf);
      sjekk(
        "overleveringen: en omdirigering til ?fagordfeil gir ingen avslutning",
        tilFeil && !feilSett,
        `${tlf.url().replace(APP, "")}, verten sett ${feilSett}`,
      );

      const proeve = await nyTekst(kontoId, "Overleveringsprøve", false);
      await tlf.goto(`${APP}/tekst/${proeve}/aktivering`);
      const foer = await vertRegion(tlf);
      sjekk("overleveringen: verten har én statusregion, tom før noe venter", foer.antall === 1 && foer.tekst === "", JSON.stringify(foer));

      // En venting som ender med feil (tomt skjema gir oppfordringen): komponenten står, ingen avslutning.
      const videre = tlf.locator("button[type=submit]", { hasText: "Videre" });
      await vaktVert(tlf);
      await videre.click();
      await tlf.locator("[role=alert]", { hasText: "Du har ikke merket noe ennå" }).waitFor({ timeout: 60000 });
      await tlf.waitForTimeout(800);
      const etterFeil = await vertRegion(tlf);
      sjekk(
        "overleveringen: en venting som ender med feil, gir ingen avslutning noe sted",
        !(await vertSett(tlf)) && etterFeil.tekst === "" && (await tlf.locator("text=Teksten er klar.").count()) === 0,
        JSON.stringify(etterFeil),
      );

      // «Videre» en gang til: lesevisningen, og avslutningen spilles i pillen der.
      await videre.click();
      await tlf.waitForURL(/\/lesing(\?.*)?$/, { timeout: 240000 });
      const vert = tlf.locator(VERT);
      const kom = await vert.waitFor({ timeout: 10000 }).then(
        () => true,
        () => false,
      );
      const kom_t = Date.now();
      sjekk("overleveringen, 375 px: «Videre» på en innlimt tekst gir avslutningen på lesevisningen", kom, tlf.url().replace(APP, ""));
      if (kom) {
        await tlf.waitForTimeout(400); // inngangen (0,3 s) er ferdig
        const p = await vert.evaluate((el) => {
          const svg = [...el.querySelectorAll("svg.merke")].find((m) => getComputedStyle(m).display !== "none");
          const b = el.getBoundingClientRect();
          const rot = document.documentElement;
          return {
            posisjon: getComputedStyle(el).position,
            innenfor: b.left >= 0 && b.right <= window.innerWidth && b.bottom <= window.innerHeight,
            mini: !!svg?.classList.contains("mini"),
            slutt: !!svg?.classList.contains("slutt"),
            merke: svg ? Math.round(svg.getBoundingClientRect().height) : 0,
            regioner: el.querySelectorAll("[role=status]").length,
            regionTekst: el.querySelector("[role=status]")?.textContent ?? "",
            fokusIPillen: el.contains(document.activeElement),
            variabel: getComputedStyle(rot).getPropertyValue("--tenker-pille").trim(),
            hoeyde: el.offsetHeight,
            klasse: rot.classList.contains("har-tenkepille"),
          };
        });
        sjekk(
          "overleveringen, 375 px: pillen ligger fast nederst med mini-Buddy (28 px) som spiller avslutningen, og statusregionen sier «Teksten er klar.»",
          p.posisjon === "fixed" && p.innenfor && p.mini && p.slutt && p.merke === 28 && p.regioner === 1 && p.regionTekst === "Teksten er klar.",
          JSON.stringify(p),
        );
        sjekk(
          "overleveringen: pillen teller med i --tenker-pille og har-tenkepille, og fokus er ikke flyttet til den",
          p.klasse && p.variabel === `${p.hoeyde}px` && !p.fokusIPillen,
          `${p.variabel} / ${p.hoeyde}px`,
        );
        await axe(tlf, "lesevisning med avslutningen i pillen (telefon)");
        // Avslutningen er 4,05 s + 0,8 s (bolk 8, 18.11), og så glir pillen bort
        // (0,3 s). Romslig nedre grense, men den skal ha stått omtrent hele
        // avslutningen; den øvre skiller den nye lengden fra den gamle (5,5 s + 0,3 s og
        // ventetiden i målingen, ca. 0,4 s; målt 5,5 s med den nye 18.11).
        const borte = await vert.waitFor({ state: "detached", timeout: 20000 }).then(
          () => true,
          () => false,
        );
        const varte = Date.now() - kom_t;
        const etter = await vertRegion(tlf);
        sjekk(
          "overleveringen: pillen står gjennom avslutningen (4,5–5,9 s), er så borte, og html har ikke lenger har-tenkepille",
          borte &&
            varte >= 4500 &&
            varte < 5900 &&
            etter.tekst === "" &&
            !(await tlf.evaluate(() => document.documentElement.classList.contains("har-tenkepille"))),
          `${varte} ms, ${JSON.stringify(etter)}`,
        );
      }

      // «Prøv igjen» på lesevisningen med en gammel feil i adressen: lykkes
      // det, er `fagordfeil` borte fra adressen, og avslutningen spilles.
      // Teksten fra «Videre» over er låst gjennom den ekte flyten, så den har
      // avsnittene, og i testmodus `les` finnes det lagrede svaret for
      // fagordene. En tekst lagt rett inn som låst har ingen avsnittsrader, og
      // da feiler «Prøv igjen» på et manglende lagret svar. Fagordene slettes,
      // så siden tilbyr «Prøv igjen».
      const retry = proeve;
      await pool.query(`delete from begrepssett where tekst_id = $1`, [retry]);
      await tlf.goto(`${APP}/tekst/${retry}/lesing?fagordfeil=ukjent`);
      await vaktVert(tlf);
      await tlf.locator("aside button", { hasText: "Prøv igjen" }).click();
      const utenFeil = await tlf.waitForURL((u) => u.pathname.endsWith("/lesing") && !u.searchParams.has("fagordfeil"), { timeout: 120000 }).then(
        () => true,
        () => false,
      );
      const retryVert = await vert.waitFor({ timeout: 15000 }).then(
        () => vertRegion(tlf),
        () => null,
      );
      sjekk(
        "overleveringen: «Prøv igjen» med ?fagordfeil lykkes, adressen er uten fagordfeil, og verten sier «Fagordene er klare.»",
        utenFeil && retryVert?.tekst === "Fagordene er klare.",
        `${tlf.url().replace(APP, "")} ${JSON.stringify(retryVert)}`,
      );
      await vert.waitFor({ state: "detached", timeout: 20000 }).catch(() => {});
    } finally {
      for (const id of proever) {
        try {
          const { rowCount } = await pool.query(`delete from tekst where id = $1`, [id]);
          sjekk("overleveringen: prøveteksten er ryddet bort", rowCount === 1);
        } catch (e) {
          sjekk("overleveringen: prøveteksten er ryddet bort", false, e.message.split("\n")[0]);
        }
      }
      await pool.end();
    }
  }

  /* --- 320 px og 200 % tekst: ingen sidelengs rulling, ingen tekst klippes */
  async function ingenKlipping(side, navn) {
    const klippet = await side.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((e) => {
          const s = getComputedStyle(e);
          if (!/hidden|clip/.test(`${s.overflowX} ${s.overflowY}`)) return false;
          // Skjult tekst for skjermlesere, og tittelen på en bunke, som med vilje
          // avkortes etter tre linjer (EXPERIENCE.md, Lang tittel).
          // Tekst som er skjult med sr-only, også bare på telefon («påbegynt» på stripene).
          if (e.closest('.sr-only, [class~="max-[759.98px]:sr-only"]') || e.classList.contains("bunke-tittel") || !e.textContent.trim()) return false;
          return e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1;
        })
        .map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join(".")}`)
        .slice(0, 5),
    );
    sjekk(`ingen tekst klippes: ${navn}`, klippet.length === 0, klippet.join(", "));
  }
  const smal = await (await nettleser.newContext({ viewport: { width: 320, height: 700 }, locale: "nb-NO" })).newPage();
  smal.setDefaultTimeout(120000);
  await smal.context().addCookies(await pc.context().cookies());
  for (const [navn, url, stor] of [
    ["arbeidsbord 320 px", `${APP}/`, false],
    ["samling 320 px", `${APP}/samling`, false],
    ["ny tekst 320 px", `${APP}/ny`, false],
    ["arbeidsbord 320 px, 200 % tekst", `${APP}/`, true],
    ["samling 320 px, 200 % tekst", `${APP}/samling`, true],
    ["ny tekst 320 px, 200 % tekst", `${APP}/ny`, true],
  ]) {
    await smal.goto(url);
    if (stor) await smal.addStyleTag({ content: "html { font-size: 200% !important; }" });
    await ingenSiderulling(smal, navn);
    await ingenKlipping(smal, navn);
  }

  /* --- Design bolk 10: tusjstrøket under tekstnavnet i sidetitlene ---- */
  // «Quiz: EM-bølger»: bare navnet får strøk, ikke «Quiz:», og overskriften
  // leses som før. På 320 px, også med 200 % tekst, ruller siden ikke sidelengs.
  // Overskriften og strøkene står innenfor vinduet (vinduet minus 1 px).
  const innenforVinduet = (side) =>
    side.evaluate(() =>
      [document.querySelector("main h1"), ...document.querySelectorAll("main h1 .tusj > svg")].every(
        (e) => e.getBoundingClientRect().left >= -1 && e.getBoundingClientRect().right <= window.innerWidth + 1,
      ),
    );
  for (const [side, navn] of [
    [pc, "1280 px"],
    [moerk, "1280 px, mørk"],
    [smal, "320 px"],
    [smal, "320 px, 200 % tekst"],
  ]) {
    await side.goto(`${tekstUrl}/quiz`);
    if (navn.includes("200 %")) await side.addStyleTag({ content: "html { font-size: 200% !important; }" });
    const t = await tusjer(side, "main h1");
    tusjBane ??= t[0]?.bane ?? null;
    sjekk(
      `bolk 10, quiz ${navn}: «EM-bølger» har tusjstrøket bak den nederste delen, «Quiz:» har det ikke`,
      t.length === 1 && t[0].ord === "EM-bølger" && t[0].ok && t[0].hoeyde >= 0.4 && t[0].hoeyde <= 0.56,
      JSON.stringify(t.map(({ bane, ...rest }) => rest)),
    );
    const navnene = await overskriftsnavn(side);
    sjekk(
      `bolk 10, quiz ${navn}: overskriften leses som «Quiz: EM-bølger» (Chromes tilgjengelighetstre)`,
      navnene.length === 1 && navnene[0] === "Quiz: EM-bølger",
      JSON.stringify(navnene),
    );
    if (navn === "1280 px" || navn === "1280 px, mørk") await axe(side, `quiz med tusjstrøket (${navn})`);
    else {
      sjekk(`bolk 10, quiz ${navn}: overskriften og strøket står innenfor vinduet`, await innenforVinduet(side));
      await ingenSiderulling(side, `quiz ${navn}`);
      const ut = await stikkerUt(side);
      if (ut.length > 0) console.log(`  stikker ut (quiz ${navn}): ${ut.join(", ")}`);
      await ingenKlipping(side, `quiz ${navn}`);
    }
  }
  // Tusjen med redusert bevegelse står bare der, og i kontrastmodus er den en
  // vanlig understrek (SVG-en skjult).
  {
    await pc.goto(`${tekstUrl}/quiz`);
    const stil = () =>
      pc.evaluate(() => {
        const t = document.querySelector("main h1 .tusj");
        const svg = t?.querySelector("svg");
        return {
          animasjon: svg ? getComputedStyle(svg).animationName : "",
          vises: svg ? getComputedStyle(svg).display : "",
          strek: t ? getComputedStyle(t).textDecorationLine : "",
        };
      });
    await pc.emulateMedia({ reducedMotion: "reduce" });
    const rolig = await stil();
    sjekk("bolk 10: med redusert bevegelse tegnes tusjen ikke inn", rolig.animasjon === "none" && rolig.vises !== "none", JSON.stringify(rolig));
    await pc.emulateMedia({ reducedMotion: null, forcedColors: "active" });
    const kontrast = await stil();
    sjekk("bolk 10: i kontrastmodus er tusjen en vanlig understrek", kontrast.vises === "none" && kontrast.strek.includes("underline"), JSON.stringify(kontrast));
    await pc.emulateMedia({ reducedMotion: null, forcedColors: null });
  }
  // Et langt ord i et svaralternativ på 320 px med 200 % tekst: alternativet
  // brytes, og siden ruller ikke sidelengs.
  {
    await smal.goto(`${tekstUrl}/quiz`);
    await smal.addStyleTag({ content: "html { font-size: 200% !important; }" });
    const byttet = await smal.evaluate(() => {
      const s = document.querySelector("main fieldset label span, main fieldset li > span");
      if (!s) return false;
      s.textContent = "Elektromagnetiskstrålingsspekterets";
      return true;
    });
    sjekk("bolk 10, 320 px, 200 % tekst: fant et svaralternativ å prøve et langt ord i", byttet);
    await ingenSiderulling(smal, "quiz med langt ord i et svar 320 px, 200 % tekst");
  }
  // Et langt navn som brytes over flere linjer: hver linje får sitt strøk, og
  // ingenting ruller sidelengs. Tittelen byttes bare i nettleseren.
  await smal.goto(`${tekstUrl}/quiz`);
  await smal.addStyleTag({ content: "html { font-size: 200% !important; }" });
  const langt = await smal.evaluate(() => {
    const h1 = document.querySelector("main h1");
    const mal = h1.querySelector(".tusj");
    for (const e of h1.querySelectorAll(".tusj")) e.remove();
    for (const [i, o] of ["Fotosyntese", "og", "celleånding", "i", "planter"].entries()) {
      const k = mal.cloneNode(true);
      k.firstChild.textContent = o;
      h1.append(i > 0 ? " " : "", k);
    }
    const linjer = new Set([...h1.querySelectorAll(".tusj")].map((e) => Math.round(e.getBoundingClientRect().top)));
    return { linjer: linjer.size, strok: h1.querySelectorAll(".tusj > svg").length };
  });
  sjekk(
    "bolk 10, 320 px, 200 % tekst: et langt navn brytes over flere linjer med strøk på hvert ord, innenfor vinduet",
    langt.linjer > 1 && langt.strok === 5 && (await innenforVinduet(smal)),
    JSON.stringify(langt),
  );
  await ingenSiderulling(smal, "quiz med langt navn 320 px, 200 % tekst");
  await ingenKlipping(smal, "quiz med langt navn 320 px, 200 % tekst");
  // Design bolk 7 (telefontesten 18.11): «Lim inn», «PDF» og «Bilder» står på
  // én rad og er like brede, på 320 og 375 px, også med 200 % tekst.
  for (const bredde of [320, 375]) {
    await smal.setViewportSize({ width: bredde, height: 700 });
    for (const stor of [false, true]) {
      await smal.goto(`${APP}/ny`);
      if (stor) await smal.addStyleTag({ content: "html { font-size: 200% !important; }" });
      const faner = await smal.locator("[role=tablist] [role=tab]").evaluateAll((f) =>
        f.map((e) => ({ navn: e.textContent.trim(), topp: e.offsetTop, bredde: Math.round(e.getBoundingClientRect().width), valgt: e.getAttribute("aria-selected"), flyter: e.scrollWidth > e.clientWidth + 1 })),
      );
      const navn = `${bredde} px${stor ? ", 200 % tekst" : ""}`;
      sjekk(
        `bolk 7, ${navn}: «Lim inn», «PDF» og «Bilder» står på én rad, er like brede og navnet får plass i fanen`,
        faner.map((f) => f.navn).join(",") === "Lim inn,PDF,Bilder" &&
          faner.every((f) => f.topp === faner[0].topp && !f.flyter) &&
          Math.max(...faner.map((f) => f.bredde)) - Math.min(...faner.map((f) => f.bredde)) <= 1 &&
          faner.map((f) => f.valgt).join(",") === "true,false,false",
        JSON.stringify(faner),
      );
      if (stor) {
        await ingenSiderulling(smal, `ny tekst ${navn}, fanene`);
        await ingenKlipping(smal, `ny tekst ${navn}, fanene`);
      }
    }
  }
  await smal.setViewportSize({ width: 320, height: 700 });
  await smal.goto(`${APP}/`);
  await smal.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await smal.locator("button:has-text('Vis aktiviteter for EM-bølger')").click(HJOERNE);
  await smal.locator("[role=dialog]").waitFor();
  await smal.waitForTimeout(800);
  await ingenSiderulling(smal, "åpent ark 320 px, 200 % tekst");
  await ingenKlipping(smal, "åpent ark 320 px, 200 % tekst");
  const stortArk = await maalArk(smal);
  sjekk(
    "bolk 6, 320 px, 200 % tekst: arket ruller internt, er høyst 90 % av skjermen, og «Legg sammen» er innenfor skjermen",
    stortArk.oppsett === "ark" && stortArk.ruller && stortArk.andel <= 90 && stortArk.arkInne && stortArk.lukkInne && !stortArk.siden,
    JSON.stringify(stortArk),
  );
  // PC med 200 % tekst: viften faller tilbake til rutenettet når kortene ikke får plass rundt bunken.
  const storPc = await (await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO" })).newPage();
  storPc.setDefaultTimeout(120000);
  await storPc.context().addCookies(await pc.context().cookies());
  await storPc.goto(`${APP}/`);
  await storPc.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await storPc.locator("button:has-text('Vis aktiviteter for EM-bølger')").click(HJOERNE);
  await storPc.locator("[role=dialog]").waitFor();
  const storOppsett = await storPc.locator("[role=dialog]").getAttribute("data-oppsett");
  sjekk("1280 px, 200 % tekst: viften er et rutenett", storOppsett === "rutenett", `data-oppsett=${storOppsett}`);
  await ingenSiderulling(storPc, "åpen vifte 1280 px, 200 % tekst");
  await ingenKlipping(storPc, "åpen vifte 1280 px, 200 % tekst");

  /* --- Bolk 4: titlene i de små bunkene brytes ikke midt i et ord ---- */
  // To tekster til: «Diktanalyse» blir hovedbunken (sist lagt inn), og
  // «Novelleanalyse» havner i en liten bunke. Lagt inn her, etter alle
  // sjekkene som venter at EM-bølger er hovedbunken.
  for (const tittel of ["Novelleanalyse", "Diktanalyse"]) {
    await pc.goto(`${APP}/ny`);
    await pc.fill("#tittel", tittel);
    await pc.fill("#tekst", eksempel);
    await pc.click('button[type=submit]:visible:has-text("Begynn")');
    await pc.waitForURL(/\/overskrifter$/);
  }
  /**
   * Titlene i de små bunkene: et ord som brytes over to linjer, gir to
   * rektangler, med eller uten bindestrek. Delene mellom ekte bindestreker
   * måles hver for seg, så «EM-bølger» kan brytes etter «EM-».
   */
  async function ingenDelteOrd(side, navn) {
    await side.locator(".bunker > li:not(.bunke-hoved) .bunke-tittel", { hasText: "Novelleanalyse" }).waitFor();
    const delteOrd = await side.evaluate(() =>
      [...document.querySelectorAll(".bunker > li:not(.bunke-hoved) .bunke-tittel")].flatMap((h) => {
        const node = h.firstChild;
        if (!node || node.nodeType !== Node.TEXT_NODE) return [`${h.textContent}: ikke ren tekst`];
        const delt = [];
        for (const m of node.textContent.matchAll(/[^\s-]+/g)) {
          const r = document.createRange();
          r.setStart(node, m.index);
          r.setEnd(node, m.index + m[0].length);
          if ([...r.getClientRects()].filter((b) => b.width > 0).length !== 1) delt.push(m[0]);
        }
        return delt;
      }),
    );
    const smaaTitler = await side.locator(".bunker > li:not(.bunke-hoved) .bunke-tittel").allTextContents();
    sjekk(
      `${navn}: ingen tittel i en liten bunke brytes midt i et ord («Novelleanalyse» på én linje)`,
      smaaTitler.includes("Novelleanalyse") && delteOrd.length === 0,
      delteOrd.length ? `delt: ${delteOrd.join(", ")}` : smaaTitler.join(", "),
    );
  }
  const bunkeTlf = await (
    await nettleser.newContext({ viewport: { width: 375, height: 800 }, isMobile: true, hasTouch: true, locale: "nb-NO" })
  ).newPage();
  bunkeTlf.setDefaultTimeout(120000);
  await bunkeTlf.context().addCookies(await pc.context().cookies());
  await bunkeTlf.goto(`${APP}/`);
  await ingenDelteOrd(bunkeTlf, "375 px");
  if (process.env.SKJERMBILDE) await bunkeTlf.screenshot({ path: path.join(process.env.SKJERMBILDE, "arbeidsbord-375.png"), fullPage: true });
  // Bolk 6, utkast C: de små bunkene er striper i full bredde, med tittelen, framdriften og «N av 5».
  const striper = await bunkeTlf.evaluate(() => {
    const ul = document.querySelector(".bunker").getBoundingClientRect();
    return [...document.querySelectorAll(".bunker > li:not(.bunke-hoved)")].map((li) => {
      const b = li.getBoundingClientRect();
      const antall = li.querySelector(".bunke-antall");
      return {
        full: Math.abs(b.width - ul.width) <= 1,
        dato: li.querySelector(".bunke-dato").checkVisibility(),
        // «påbegynt» er visuelt skjult (1 × 1 px), men står i teksten for skjermleseren.
        synlig: [...antall.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent).join("").trim(),
        skjult: antall.querySelector(".bunke-paabegynt").getBoundingClientRect().width <= 1,
        lest: antall.textContent.trim(),
        navn: li.querySelector(".bunke-knapp").textContent,
      };
    });
  });
  sjekk(
    "bolk 6, 375 px: de små bunkene er striper i full bredde med «N av 5», og knappen heter fortsatt «Vis aktiviteter for …»",
    striper.length > 0 &&
      striper.every((s) => s.full && !s.dato && /^\d av 5$/.test(s.synlig) && s.skjult && s.lest.endsWith("påbegynt") && s.navn.startsWith("Vis aktiviteter for ")),
    JSON.stringify(striper[0]),
  );
  // Låst tekst («Novelleanalyse» er bare lagt inn): fire låste rader i arket.
  await bunkeTlf.locator("button:has-text('Vis aktiviteter for Novelleanalyse')").tap();
  await bunkeTlf.locator("[role=dialog]").waitFor();
  await bunkeTlf.waitForTimeout(800);
  const rader = await bunkeTlf.evaluate(() =>
    [...document.querySelectorAll("[role=dialog] .vifte-kort > li")].map((li) => ({
      lenke: !!li.querySelector("a"),
      laast: li.textContent.includes("Låst. Åpnes når du har lest teksten."),
      pil: [...li.querySelectorAll(".kort-pil")].some((p) => p.checkVisibility()),
    })),
  );
  sjekk(
    "bolk 6, arket: en tekst som bare er lagt inn, har fire låste rader (ikke lenker) etter Teksten",
    rader.length === 5 && rader[0].lenke && rader.slice(1).every((r) => r.laast && !r.lenke),
    JSON.stringify(rader),
  );
  sjekk(
    "bolk 6, arket: pilen vises på den åpne raden og ikke på de låste",
    rader.length === 5 && rader[0].pil && rader.slice(1).every((r) => !r.pil),
    rader.map((r) => (r.pil ? "pil" : "-")).join(" "),
  );
  await axe(bunkeTlf, "arbeidsbord med åpent ark, låst tekst (telefon)");
  await bunkeTlf.context().close();
  // 320 px med 200 % tekst: i bolk 4 var «Novelleanalyse» om lag 1,5 px bredere
  // enn kolonnen. Med stripene i full bredde (bolk 6) har tittelen hele linjen.
  const bunkeSmal = await (await nettleser.newContext({ viewport: { width: 320, height: 700 }, locale: "nb-NO" })).newPage();
  bunkeSmal.setDefaultTimeout(120000);
  await bunkeSmal.context().addCookies(await pc.context().cookies());
  await bunkeSmal.goto(`${APP}/`);
  await bunkeSmal.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await ingenDelteOrd(bunkeSmal, "320 px, 200 % tekst");
  // Hilsenen med Buddy og stripene, med alle tekstene på bordet.
  await ingenSiderulling(bunkeSmal, "arbeidsbord med striper 320 px, 200 % tekst");
  await ingenKlipping(bunkeSmal, "arbeidsbord med striper 320 px, 200 % tekst");
  await bunkeSmal.context().close();
  // FR-48 på 1280 px: telefonflatene fra bolk 6 vises ikke. Ingen hilsen-Buddy
  // (Buddy står på bordet), datoen og «påbegynt» er synlige på alle bunkene,
  // og viften har kort uten pil.
  const bredBord = await (await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO" })).newPage();
  bredBord.setDefaultTimeout(120000);
  await bredBord.context().addCookies(await pc.context().cookies());
  await bredBord.goto(`${APP}/`);
  const bredFlater = await bredBord.evaluate(() => {
    const bredde = (e) => e.getBoundingClientRect().width;
    return {
      hilsen: [...document.querySelectorAll(".hilsen-buddy")].some((e) => e.checkVisibility()),
      bordBuddy: [...document.querySelectorAll(".bord-buddy")].some((e) => e.checkVisibility()),
      dato: [...document.querySelectorAll(".bunker .bunke-dato")].map((e) => e.checkVisibility() && bredde(e) > 1),
      paabegynt: [...document.querySelectorAll(".bunker .bunke-paabegynt")].map((e) => e.checkVisibility() && bredde(e) > 1),
    };
  });
  sjekk(
    "1280 px: ingen hilsen-Buddy (Buddy står på bordet), og datoen og «påbegynt» er synlige på alle bunkene",
    !bredFlater.hilsen && bredFlater.bordBuddy && bredFlater.dato.length > 1 && bredFlater.dato.every(Boolean) && bredFlater.paabegynt.every(Boolean) && bredFlater.paabegynt.length === bredFlater.dato.length,
    JSON.stringify(bredFlater),
  );
  await bredBord.locator("button:has-text('Vis aktiviteter for EM-bølger')").click(HJOERNE);
  await bredBord.locator("[role=dialog]").waitFor();
  await bredBord.waitForTimeout(800);
  sjekk(
    "1280 px: viften har kort uten pil (pilen hører til arket på telefon)",
    !(await bredBord.evaluate(() => [...document.querySelectorAll("[role=dialog] .kort-pil")].some((p) => p.checkVisibility()))),
  );
  await bredBord.context().close();

  /* --- FR-47: landingssiden, uten innlogging ------------------------- */
  // Nye kontekster har ingen informasjonskapsler, så ingen er innlogget.
  const svar = await fetch(`${APP}/`, { redirect: "manual" });
  const html = await svar.text();
  sjekk(
    "FR-47: / uten innlogging gir 200 med landingssiden, ikke en omdirigering",
    svar.status === 200 && html.includes("Forstå mer av det du"),
    `status ${svar.status}`,
  );

  const SKJERM = process.env.SKJERMBILDE;
  async function skjermbilde(side, navn) {
    if (SKJERM) await side.screenshot({ path: path.join(SKJERM, `landingsside-${navn}.png`), fullPage: true });
  }
  async function landing({ bredde = 1280, hoeyde = 900, farge = "light", redusert = false, js = true, mobil = false } = {}) {
    const ctx = await nettleser.newContext({
      viewport: { width: bredde, height: hoeyde },
      locale: "nb-NO",
      colorScheme: farge,
      reducedMotion: redusert ? "reduce" : "no-preference",
      javaScriptEnabled: js,
      isMobile: mobil,
      hasTouch: mobil,
    });
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    await side.goto(`${APP}/`);
    if (js) await side.waitForLoadState("networkidle");
    return side;
  }
  /** Ruller hele siden ned og opp igjen, så effektene har kjørt, og venter til overgangene er ferdige. */
  async function rullGjennom(side) {
    await side.evaluate(async () => {
      for (let y = 0; y <= document.documentElement.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((ok) => requestAnimationFrame(() => setTimeout(ok, 30)));
      }
    });
    await side.waitForTimeout(800);
  }
  /** Den statiske versjonen: alle steg synlige, alle fire fagord markert og forklaringslisten synlig. */
  async function statisk(side) {
    return side.evaluate(() => {
      const synlig = (e) => e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && !e.closest(".sr-only");
      const steg = [...document.querySelectorAll("#landingsside .ls-ett")];
      const ord = [...document.querySelectorAll("#landingsside .ls-fagord")];
      const dt = [...document.querySelectorAll("#landingsside .ls-forklaringer dl dt")];
      return {
        steg: steg.filter((e) => synlig(e) && getComputedStyle(e).opacity === "1").length,
        markert: ord.filter((e) => getComputedStyle(e).backgroundColor !== "rgba(0, 0, 0, 0)").length,
        forklaringer: dt.filter((e) => synlig(e.parentElement)).length,
        folger: [...document.querySelectorAll(".ls-folger")].some((e) => e.checkVisibility()),
      };
    });
  }
  const statiskOk = (s) => s.steg === 3 && s.markert === 4 && s.forklaringer === 4 && !s.folger;
  const statiskTekst = (s) => `${s.steg} steg, ${s.markert} fagord markert, ${s.forklaringer} forklaringer, Følge-Buddy ${s.folger ? "synlig" : "skjult"}`;

  // PC, lys modus, bevegelse tillatt: effektene kjører.
  const land = await landing();
  sjekk(
    "FR-47: landingssiden har «Logg inn» og «Registrer deg»",
    (await land.locator("main a[href='/logg-inn']", { hasText: "Logg inn" }).count()) > 0 &&
      (await land.locator("main a[href='/registrer']", { hasText: "Registrer deg" }).count()) > 0,
  );
  sjekk("FR-47: siden sier at registrering krever en kode fra læreren", (await land.locator("text=Har du fått en kode fra læreren? Da kan du registrere deg.").count()) > 0);
  sjekk("landingssiden har én h1", (await land.locator("h1").count()) === 1);

  // FR-53: «Vilkår og personvern» åpnes fra landingssiden uten innlogging.
  {
    const ctx = await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO" });
    const side = await ctx.newPage();
    side.setDefaultTimeout(120000);
    await side.goto(`${APP}/`);
    await side.click("a[href='/vilkaar']");
    await side.waitForURL(`${APP}/vilkaar`);
    sjekk(
      "FR-53: «Vilkår og personvern» vises uten innlogging, fra landingssiden",
      (await side.locator("h1", { hasText: "Vilkår og personvern" }).count()) === 1,
      side.url(),
    );
    sjekk(
      "FR-53: siden sier hva som lagres, hvor teksten går, hvordan man sletter og hvem man kontakter",
      (await side.locator("h2", { hasText: "Hva som lagres" }).count()) === 1 &&
        (await side.locator("h2", { hasText: "Hvor tekstene dine går" }).count()) === 1 &&
        (await side.locator("text=Slett kontoen:").count()) === 1 &&
        (await side.locator("a[href^='mailto:']").count()) >= 1,
    );
    await axe(side, "vilkår og personvern");
    await ctx.close();
    const tlfCtx = await nettleser.newContext({ viewport: { width: 375, height: 740 }, locale: "nb-NO", isMobile: true, hasTouch: true });
    const tlfSide = await tlfCtx.newPage();
    tlfSide.setDefaultTimeout(120000);
    await tlfSide.goto(`${APP}/vilkaar`);
    await ingenSiderulling(tlfSide, "vilkår og personvern");
    await tlfCtx.close();
  }
  sjekk("demoen har overskriften «Se hvordan Buddy markerer fagord»", (await land.locator("h2", { hasText: "Se hvordan Buddy markerer fagord" }).count()) === 1);
  sjekk(
    "topplinjen på landingssiden: «For lærere» og «Logg inn», ikke appmenyen",
    (await land.locator("header a:visible", { hasText: "For lærere" }).count()) === 1 &&
      (await land.locator("header a:visible", { hasText: "Logg inn" }).count()) === 1 &&
      (await land.locator("header a:visible", { hasText: "Samlinger" }).count()) === 0,
  );
  sjekk(
    "skjermleser: ingen live-regioner på landingssiden, Følge-Buddy er aria-hidden",
    await land.evaluate(
      () =>
        document.querySelectorAll("#landingsside [aria-live], #landingsside [role=status], #landingsside [role=alert]").length === 0 &&
        [...document.querySelectorAll(".ls-folger, .ls-boble")].every((e) => e.closest("[aria-hidden=true]")),
    ),
  );
  sjekk("rulleeffektene A og C er slått på med JavaScript og bevegelse", await land.evaluate(() => {
    const r = document.getElementById("landingsside");
    return r.classList.contains("effekt-a") && r.classList.contains("effekt-c");
  }));
  await land.evaluate(() => window.scrollTo(0, document.querySelector(".ls-demo-spor").offsetTop + window.innerHeight * 0.9));
  await land.waitForTimeout(600);
  const demoNaa = await land.evaluate(() => ({
    paa: document.querySelectorAll("#landingsside .ls-fagord.paa").length,
    vist: [...document.querySelectorAll("#landingsside .ls-forklaring")].filter((e) => !e.classList.contains("sr-only")).length,
    iDom: document.querySelectorAll("#landingsside .ls-forklaringer dl dt").length,
  }));
  sjekk(
    "effekt A: fagordene markeres ett for ett, og alle forklaringene står i DOM-en",
    demoNaa.paa >= 1 && demoNaa.paa < 4 && demoNaa.vist === 1 && demoNaa.iDom === 4,
    `${demoNaa.paa} markert, ${demoNaa.vist} vist, ${demoNaa.iDom} i listen`,
  );
  // 1280 px: margen ved siden av tekstkolonnen har ikke plass til Buddy og boblen (WCAG 2.4.11).
  sjekk(
    "1280 px: ingen Følge-Buddy, fordi den ville dekket tekstkolonnen",
    !(await land.locator(".ls-folger").evaluate((e) => e.checkVisibility({ opacityProperty: true }))),
  );
  await rullGjennom(land);
  sjekk("effekt C: alle stegene har dukket fram etter rullingen", (await statisk(land)).steg === 3);
  await skjermbilde(land, "1280-lys");
  await land.evaluate(() => window.scrollTo(0, 0));
  await land.waitForTimeout(800);
  await axe(land, "landingsside");
  // Bolk 10: «leser» har det samme tusjstrøket som tekstnavnet i sidetitlene.
  const leserTusj = await tusjer(land, "#ls-tittel");
  sjekk(
    "bolk 10, landingssiden: «leser» har det samme tusjstrøket som sidetitlene, og overskriften leses som før",
    leserTusj.length === 1 &&
      leserTusj[0].ord === "leser" &&
      leserTusj[0].ok &&
      !!tusjBane &&
      leserTusj[0].bane === tusjBane &&
      (await overskriftsnavn(land)).includes("Forstå mer av det du leser."),
    JSON.stringify({
      tusj: leserTusj.map(({ bane, ...rest }) => ({ ...rest, sammeBane: bane === tusjBane })),
      navn: await overskriftsnavn(land),
    }),
  );
  // Bevegelsen slås av mens effektene går: siden går over til den statiske versjonen.
  await land.emulateMedia({ reducedMotion: "reduce" });
  await land.evaluate(() => new Promise((ok) => requestAnimationFrame(() => requestAnimationFrame(ok))));
  await land.waitForTimeout(100);
  const stByttet = await statisk(land);
  sjekk(
    "redusert bevegelse slått på underveis: statisk versjon og ingen effekt-klasser",
    statiskOk(stByttet) && !(await land.evaluate(() => document.getElementById("landingsside").className.includes("effekt"))),
    statiskTekst(stByttet),
  );
  await land.context().close();

  // Bred skjerm: Følge-Buddy og boblen står i margen, utenfor tekstkolonnen.
  const bred = await landing({ bredde: 1920, hoeyde: 1000 });
  // Overskriften «Slik hjelper Buddy deg» like over synsfeltet: heroen er forbi, og stegene står midt i.
  await bred.evaluate(() => window.scrollTo(0, document.querySelector("#ls-slik").getBoundingClientRect().top + window.scrollY + 100));
  await bred.waitForTimeout(700);
  const plass = await bred.evaluate(() => {
    const f = document.querySelector(".ls-folger");
    const b = f.querySelector(".ls-boble");
    const i = document.querySelector("#landingsside .ls-innhold");
    const kant = i.getBoundingClientRect().right - parseFloat(getComputedStyle(i).paddingRight);
    return {
      synlig: f.dataset.synlig === "ja" && f.checkVisibility({ opacityProperty: true }),
      snakker: f.dataset.snakker === "ja",
      venstre: Math.min(f.getBoundingClientRect().left, b.getBoundingClientRect().left),
      kant,
    };
  });
  sjekk(
    "1920 px: Følge-Buddy vises når heroen er rullet forbi, med boblen, utenfor tekstkolonnen",
    plass.synlig && plass.snakker && plass.venstre >= plass.kant,
    `Buddy/boble fra ${Math.round(plass.venstre)} px, tekstkolonnen slutter ved ${Math.round(plass.kant)} px`,
  );
  await bred.context().close();

  const landMoerk = await landing({ farge: "dark" });
  await rullGjennom(landMoerk);
  await skjermbilde(landMoerk, "1280-moerk");
  await landMoerk.evaluate(() => window.scrollTo(0, 0));
  await landMoerk.waitForTimeout(800);
  await axe(landMoerk, "landingsside (mørk)");
  await landMoerk.context().close();

  // Innloggingssiden uten økt: topplinjen er appens, ikke landingssidens.
  const innlogging = await (await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO" })).newPage();
  await innlogging.goto(`${APP}/logg-inn`);
  sjekk("/logg-inn: ingen «Logg inn» eller «For lærere» i topplinjen", await ingenLandingsmeny(innlogging));
  await innlogging.context().close();

  // Redusert bevegelse gir den statiske versjonen.
  for (const farge of ["light", "dark"]) {
    const s = await landing({ farge, redusert: true });
    await rullGjennom(s);
    const st = await statisk(s);
    const navn = farge === "dark" ? "mørk" : "lys";
    sjekk(`redusert bevegelse (${navn}): den statiske versjonen`, statiskOk(st) && !(await s.evaluate(() => document.getElementById("landingsside").className.includes("effekt"))), statiskTekst(st));
    await skjermbilde(s, `1280-${farge === "dark" ? "moerk" : "lys"}-redusert`);
    await axe(s, `landingsside med redusert bevegelse (${navn})`);
    await s.context().close();
  }

  // Uten JavaScript: alt innhold er der.
  const utenJs = await landing({ js: false });
  const stJs = await statisk(utenJs);
  sjekk("uten JavaScript: alle steg, alle fire fagord markert og forklaringslisten synlige", statiskOk(stJs), statiskTekst(stJs));
  // axe kjører ikke uten JavaScript. Siden er da den samme statiske HTML-en som axe sjekket med redusert bevegelse.
  await skjermbilde(utenJs, "1280-uten-js");
  await utenJs.context().close();

  // Telefon: én kolonne, ingen Følge-Buddy, ingen sidelengs rulling.
  for (const farge of ["light", "dark"]) {
    const navn = farge === "dark" ? "mørk" : "lys";
    const s = await landing({ bredde: 375, hoeyde: 740, farge, mobil: true });
    await rullGjennom(s);
    await ingenSiderulling(s, `landingsside (${navn})`);
    sjekk(`telefon (${navn}): ingen Følge-Buddy`, !(await s.locator(".ls-folger").evaluate((e) => e.checkVisibility())));
    sjekk(
      `telefon (${navn}): «For lærere» er skjult i topplinjen, men lærerdelen står`,
      (await s.locator("header a:visible", { hasText: "For lærere" }).count()) === 0 && (await s.locator("#laerere h2").isVisible()),
    );
    await skjermbilde(s, `375-${farge === "dark" ? "moerk" : "lys"}`);
    await s.evaluate(() => window.scrollTo(0, 0));
    await s.waitForTimeout(800);
    await axe(s, `landingsside (telefon, ${navn})`);
    await s.context().close();
  }
  // Bolk 4: sporet til effekt A ga 1584 px tomrom fra demoflaten til
  // overskriften i neste seksjon (målt på 375 × 800, utlogget). Målt i
  // dokumentet, som i et langt skjermbilde. Vanlig seksjonsluft er 2 × 72 px.
  for (const redusert of [false, true]) {
    const navn = redusert ? "redusert bevegelse" : "bevegelse tillatt";
    const s = await landing({ bredde: 375, hoeyde: 800, mobil: true, redusert });
    const r = await s.evaluate(() => {
      const flate = document.querySelector("#landingsside .ls-demo-klistre");
      const neste = document.querySelector("#landingsside .ls-demo").nextElementSibling.querySelector("h2");
      return {
        effektA: document.getElementById("landingsside").classList.contains("effekt-a"),
        tomrom: Math.round(neste.getBoundingClientRect().top - flate.getBoundingClientRect().bottom),
      };
    });
    // Bolk 6: effekt A er av på telefon, med og uten redusert bevegelse.
    sjekk(
      `landingsside 375 px (${navn}): ingen tomrom over 160 px mellom demoen og neste seksjon, og effekt A er av`,
      r.tomrom <= 160 && !r.effektA,
      `${r.tomrom} px, effekt A ${r.effektA ? "på" : "av"}`,
    );
    if (redusert) {
      // Redusert bevegelse: den statiske demoen, uten knapper.
      const st = await statisk(s);
      sjekk(
        "landingsside 375 px, redusert bevegelse: den statiske demoen (fire markert og listen), ingen knapper",
        statiskOk(st) && (await s.locator("#landingsside button.ls-fagord").count()) === 0,
        statiskTekst(st),
      );
    } else {
      // Bolk 6, utkast E: fagordene er knapper, og et trykk viser forklaringen i panelet under teksten.
      const knapper = s.locator("#landingsside button.ls-fagord");
      const foer = await s.evaluate(() => {
        const k = [...document.querySelectorAll("#landingsside button.ls-fagord")];
        const panel = document.getElementById(k[0]?.getAttribute("aria-controls"));
        return {
          antall: k.length,
          lukket: k.every((e) => e.getAttribute("aria-expanded") === "false"),
          panel: !!panel && k.every((e) => e.getAttribute("aria-controls") === panel.id),
          panelTekst: panel?.textContent.trim() ?? "",
          dlSkjult: !!document.querySelector("#landingsside .ls-forklaringer dl.sr-only"),
          dt: document.querySelectorAll("#landingsside .ls-forklaringer dl dt").length,
        };
      });
      sjekk(
        "landingsside 375 px: fire fagord er knapper (aria-expanded, aria-controls), panelet er aldri tomt, og <dl> er bare visuelt skjult",
        foer.antall === 4 && foer.lukket && foer.panel && foer.panelTekst.length > 0 && foer.dlSkjult && foer.dt === 4,
        JSON.stringify(foer),
      );
      const mitose = knapper.filter({ hasText: "mitose" });
      await mitose.scrollIntoViewIfNeeded();
      const rullFoer = await s.evaluate(() => window.scrollY);
      await mitose.tap();
      const etter = await s.evaluate(() => {
        const k = document.querySelector("#landingsside button.ls-fagord[aria-expanded=true]");
        const panel = document.getElementById(k?.getAttribute("aria-controls"));
        const tekst = document.querySelector("#landingsside article").getBoundingClientRect();
        const pb = panel?.getBoundingClientRect();
        const buddy = panel?.parentElement.querySelector("svg.merke.mini");
        return {
          valgt: k?.textContent,
          fokus: document.activeElement === k,
          panel: panel?.textContent ?? "",
          under: !!pb && pb.top >= tekst.bottom,
          buddy: buddy ? Math.round(buddy.getBoundingClientRect().height) : 0,
          live: document.querySelectorAll("#landingsside [aria-live], #landingsside [role=status], #landingsside [role=alert]").length,
        };
      });
      sjekk(
        "landingsside 375 px: trykk på «mitose» viser forklaringen under teksten med Buddy (30 px), og fokus blir på ordet",
        etter.valgt === "mitose" && etter.fokus && etter.panel.startsWith("mitose") && etter.panel.includes("Avsnitt 1") && etter.under && etter.buddy === 30,
        JSON.stringify(etter),
      );
      sjekk("landingsside 375 px: trykkdemoen har ingen aria-live", etter.live === 0);
      sjekk("landingsside 375 px: siden ruller ikke av trykket", Math.abs((await s.evaluate(() => window.scrollY)) - rullFoer) <= 1);
      await ingenSiderulling(s, "landingsside med trykkdemoen");
      await axe(s, "landingsside med åpen forklaring i trykkdemoen (telefon)");
      if (SKJERM) await s.locator(".ls-demo").screenshot({ path: path.join(SKJERM, "landingsside-375-trykkdemo.png") });
      /** Hvilke ord som er åpne, og hva panelet sier. */
      const demo = () =>
        s.evaluate(() => ({
          aapne: [...document.querySelectorAll("#landingsside button.ls-fagord[aria-expanded=true]")].map((k) => k.textContent),
          panel: document.querySelector("#landingsside .ls-trykkpanel")?.textContent ?? "",
        }));
      // Et trykk på et annet ord flytter aria-expanded og bytter innholdet.
      await knapper.filter({ hasText: "kromosomene" }).tap();
      const byttet = await demo();
      sjekk(
        "landingsside 375 px: trykk på et annet ord («kromosomene») flytter aria-expanded og bytter forklaringen",
        byttet.aapne.join() === "kromosomene" && byttet.panel.startsWith("kromosom") && !byttet.panel.includes("mitose"),
        JSON.stringify(byttet),
      );
      // Et nytt trykk på samme ord lukker forklaringen, og hinten kommer tilbake.
      await knapper.filter({ hasText: "kromosomene" }).tap();
      const lukket = await demo();
      sjekk(
        "landingsside 375 px: nytt trykk på samme ord lukker forklaringen (aria-expanded=false, hinten tilbake)",
        lukket.aapne.length === 0 && lukket.panel.startsWith("Trykk på et fagord"),
        JSON.stringify(lukket),
      );
    }
    await s.context().close();
  }
  // Uten JavaScript på telefon: den statiske demoen.
  const tlfUtenJs = await landing({ bredde: 375, hoeyde: 740, mobil: true, js: false });
  const stTlf = await statisk(tlfUtenJs);
  sjekk(
    "landingsside 375 px uten JavaScript: den statiske demoen med alle fire forklaringer",
    statiskOk(stTlf) && (await tlfUtenJs.locator("#landingsside button.ls-fagord").count()) === 0,
    statiskTekst(stTlf),
  );
  await tlfUtenJs.context().close();
  if (SKJERM) {
    for (const [navn, valg] of [
      ["375-lys-redusert", { redusert: true }],
      ["375-uten-js", { js: false }],
    ]) {
      const s = await landing({ bredde: 375, hoeyde: 740, mobil: true, ...valg });
      await skjermbilde(s, navn);
      await s.context().close();
    }
  }

  // 320 px og 200 % tekst, med og uten effektene.
  for (const [navn, redusert] of [
    ["landingsside 320 px, 200 % tekst", false],
    ["landingsside 320 px, 200 % tekst, redusert bevegelse", true],
  ]) {
    const s = await landing({ bredde: 320, hoeyde: 700, redusert });
    await s.addStyleTag({ content: "html { font-size: 200% !important; }" });
    await s.evaluate(() => window.dispatchEvent(new Event("resize")));
    await rullGjennom(s);
    await ingenSiderulling(s, navn);
    await ingenKlipping(s, navn);
    if (!redusert) {
      // Telefonbredde: effekt A er av, og demoen er trykkbar (bolk 6).
      await s.locator("#landingsside button.ls-fagord", { hasText: "kromosomene" }).click();
      const st = await s.evaluate(() => ({
        a: document.getElementById("landingsside").classList.contains("effekt-a"),
        panel: document.querySelector("#landingsside .ls-trykkpanel")?.textContent ?? "",
      }));
      sjekk(
        "320 px, 200 % tekst: effekt A er av, og trykkdemoen viser forklaringen",
        !st.a && st.panel.startsWith("kromosom"),
        JSON.stringify(st),
      );
      await ingenSiderulling(s, `${navn}, åpen forklaring`);
      await ingenKlipping(s, `${navn}, åpen forklaring`);
    }
    await s.context().close();
  }
  // Bred skjerm med 200 % tekst: Følge-Buddy vises bare ved vanlig tekststørrelse.
  const landStor = await landing({ bredde: 1920, hoeyde: 1000 });
  await landStor.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await landStor.evaluate(() => window.dispatchEvent(new Event("resize")));
  await rullGjennom(landStor);
  sjekk("1920 px, 200 % tekst: ingen Følge-Buddy", !(await landStor.locator(".ls-folger").evaluate((e) => e.checkVisibility())));
  await ingenSiderulling(landStor, "landingsside 1920 px, 200 % tekst");
  await landStor.context().close();

  /* --- Rotasjon over 760 px (bolk 6) -------------------------------- */
  // Alle sjekkene over åpner en fersk kontekst med fast bredde. Her endres
  // bredden mens siden er åpen, som når en nettbrett snus: fagorddemoen bytter
  // mellom knapper og spenn (FagordDemo), effekt A måler på nytt, og viften
  // går fra ark til vifte og tilbake mens den er åpen. Det ventes på
  // tilstanden (effekt-a, data-oppsett, har-ark), ikke på faste tider.
  {
    const ctx = await nettleser.newContext({ viewport: { width: 375, height: 740 }, locale: "nb-NO" });
    try {
      const s = await ctx.newPage();
      s.setDefaultTimeout(120000);
      const feil = [];
      s.on("pageerror", (e) => feil.push(e.message.split("\n")[0]));
      await s.goto(`${APP}/`);
      await s.waitForLoadState("networkidle");
      const demoTilstand = () =>
        s.evaluate(() => ({
          effektA: document.getElementById("landingsside").classList.contains("effekt-a"),
          knapper: document.querySelectorAll("#landingsside button.ls-fagord").length,
          spenn: document.querySelectorAll("#landingsside span.ls-fagord").length,
          paa: document.querySelectorAll("#landingsside .ls-fagord.paa").length,
          klistret: document.getElementById("landingsside").classList.contains("ls-demo-klistret"),
          panel: document.querySelector("#landingsside .ls-trykkpanel")?.textContent ?? "",
        }));
      /** Venter til effekt A er på uten knapper (bred), eller av med trykkdemoen tilbake (smal). */
      const ventPaaDemo = (bred) =>
        s.waitForFunction(
          (bred) => {
            const rot = document.getElementById("landingsside");
            const knapper = document.querySelectorAll("#landingsside button.ls-fagord").length;
            return bred ? rot.classList.contains("effekt-a") && knapper === 0 : !rot.classList.contains("effekt-a") && knapper === 4;
          },
          bred,
          { timeout: 15000 },
        );
      const foer = await demoTilstand();
      sjekk("rotasjon, landingsside 375 px: trykkdemoen med fire knapper, effekt A av", foer.knapper === 4 && !foer.effektA, JSON.stringify(foer));
      await s.setViewportSize({ width: 1280, height: 900 });
      await ventPaaDemo(true);
      const sporFinnes = await s.evaluate(() => {
        const spor = document.querySelector(".ls-demo-spor");
        if (!spor) return false;
        window.scrollTo(0, spor.offsetTop + window.innerHeight * 0.9);
        return true;
      });
      sjekk("rotasjon, landingsside 1280 px: demosporet finnes", sporFinnes);
      if (sporFinnes) {
        await s.waitForFunction(() => document.querySelectorAll("#landingsside span.ls-fagord.paa").length >= 1, null, { timeout: 15000 });
      }
      const bredt = await demoTilstand();
      sjekk(
        "rotasjon, landingsside 375 → 1280 px: effekt A markerer span.ls-fagord, og ingen knapper er igjen",
        bredt.effektA && bredt.knapper === 0 && bredt.spenn === 4 && bredt.paa >= 1 && bredt.panel === "",
        JSON.stringify(bredt),
      );
      await s.setViewportSize({ width: 375, height: 740 });
      await ventPaaDemo(false);
      const tilbake = await demoTilstand();
      sjekk(
        "rotasjon, landingsside 1280 → 375 px: trykkdemoen er tilbake, uten rester av effekt A",
        !tilbake.effektA && tilbake.knapper === 4 && tilbake.paa === 0 && !tilbake.klistret && tilbake.panel.startsWith("Trykk på et fagord"),
        JSON.stringify(tilbake),
      );
      await s.locator("#landingsside button.ls-fagord", { hasText: "mitose" }).click();
      const trykket = await demoTilstand();
      sjekk("rotasjon, landingsside 375 px igjen: et trykk på «mitose» viser forklaringen", trykket.panel.startsWith("mitose"), trykket.panel.slice(0, 40));
      await ingenSiderulling(s, "landingsside etter rotasjon");

      // Arbeidsbordet med arket åpent.
      await ctx.addCookies(await pc.context().cookies());
      await s.goto(`${APP}/`);
      const bunke = s.locator("button[aria-expanded]", { hasText: "Vis aktiviteter for EM-bølger" });
      await bunke.click(HJOERNE);
      const bord = () =>
        s.evaluate(() => {
          const d = document.querySelector("[role=dialog]");
          return {
            dialog: !!d,
            oppsett: d?.dataset.oppsett ?? null,
            harArk: document.documentElement.classList.contains("har-ark"),
            overflow: getComputedStyle(document.documentElement).overflowY,
            inert: document.querySelectorAll("[inert]").length,
            fokusIDialog: !!document.activeElement?.closest("[role=dialog]"),
          };
        });
      /** Venter til viften er åpen med et av oppsettene, og har-ark stemmer med det. */
      const ventPaaOppsett = (oppsett) =>
        s.waitForFunction(
          (oppsett) => {
            const d = document.querySelector("[role=dialog][aria-modal=true]");
            const harArk = document.documentElement.classList.contains("har-ark");
            return !!d && oppsett.includes(d.dataset.oppsett) && harArk === oppsett.includes("ark");
          },
          oppsett,
          { timeout: 15000 },
        );
      await ventPaaOppsett(["ark"]);
      const ark = await bord();
      sjekk("rotasjon, arbeidsbord 375 px: arket er åpent", ark.oppsett === "ark" && ark.harArk, JSON.stringify(ark));
      await s.setViewportSize({ width: 1280, height: 900 });
      await ventPaaOppsett(["rundt", "rutenett"]);
      const vifteBredt = await bord();
      sjekk(
        "rotasjon, arbeidsbord 375 → 1280 px med arket åpent: viften står åpen som vifte, uten har-ark, og resten av siden er fortsatt inert",
        vifteBredt.dialog &&
          (vifteBredt.oppsett === "rundt" || vifteBredt.oppsett === "rutenett") &&
          !vifteBredt.harArk &&
          vifteBredt.overflow !== "hidden" &&
          vifteBredt.inert > 0,
        JSON.stringify(vifteBredt),
      );
      await ingenSiderulling(s, "arbeidsbord med åpen vifte etter rotasjon");
      await s.setViewportSize({ width: 375, height: 740 });
      await ventPaaOppsett(["ark"]);
      const arkIgjen = await bord();
      sjekk(
        "rotasjon, arbeidsbord 1280 → 375 px: viften er et ark igjen",
        arkIgjen.dialog && arkIgjen.oppsett === "ark" && arkIgjen.harArk,
        JSON.stringify(arkIgjen),
      );
      await s.keyboard.press("Escape");
      await s.waitForFunction(
        () => !document.querySelector("[role=dialog]") && !document.documentElement.classList.contains("har-ark"),
        null,
        { timeout: 15000 },
      );
      const lukket = await bord();
      sjekk(
        "rotasjon, arbeidsbord: Esc etter rotasjonene lukker, og ingen inert- eller har-ark-rester står igjen",
        !lukket.dialog && !lukket.harArk && lukket.inert === 0 && lukket.overflow !== "hidden",
        JSON.stringify(lukket),
      );
      sjekk("rotasjon: ingen skriptfeil i nettleseren", feil.length === 0, feil.join(" | "));
    } finally {
      await ctx.close();
    }
  }

  /* --- FR-3 fase 3b: gjennomsynet via PDF og bilde -------------------- */
  // Innlimt tekst går ikke lenger via gjennomsynet (FR-3, 11.11), så sjekken
  // når det med en tekst som er lagt rett inn i databasen: lest inn fra PDF
  // eller bilde, med godkjente overskrifter og aktiveringen gjort. Det er
  // tilstanden en elev står i etter innlesingen. Tekstene ryddes bort, og en
  // opprydding som feiler, er et funn.
  {
    const pool = new pg.Pool({ connectionString: DB, max: 1 });
    const lagt = [];
    try {
      const [{ id: kontoId }] = (await pool.query(`select id from "user" where email = $1`, [EPOST])).rows;
      const rapport = { sider: 3, fjernedeLinjer: ["Side 2", "Fysikk 1 – kapittel 4"], sammenslaatteOrddelinger: 2, muligTabellEllerFormel: true };
      for (const [vei, tittel, innlesingsrapport] of [
        ["pdf", "PDF-prøve", JSON.stringify(rapport)],
        ["bilde", "Bildeprøve", null],
      ]) {
        const r = await pool.query(
          `insert into tekst (konto_id, tittel, raatekst, redigert_tekst, vei, tilstand, innlesingsrapport, overskrifter_godkjent, forkunnskapssvar)
           values ($1, $2, $3, $3, $4, 'aktivert', $5::jsonb, now(), 'Noe om bølger.') returning id`,
          [kontoId, tittel, eksempel, vei, innlesingsrapport],
        );
        lagt.push(r.rows[0].id);
        const adresse = `${APP}/tekst/${r.rows[0].id}/gjennomsyn`;
        for (const [side, modusnavn] of [
          [pc, "lys"],
          [moerk, "mørk"],
        ]) {
          await side.goto(adresse);
          const framme = side.url() === adresse && (await side.locator("textarea").count()) > 0;
          sjekk(`gjennomsyn (${vei}, ${modusnavn}): siden vises med redigeringsfeltet`, framme, side.url().replace(APP, ""));
          if (vei === "pdf") {
            sjekk(
              `gjennomsyn (pdf, ${modusnavn}): innlesingsrapporten står over feltet`,
              (await side.locator("main", { hasText: "Fysikk 1 – kapittel 4" }).count()) > 0,
            );
          }
          if (vei === "bilde") {
            // Bolk 10: Buddy beklager seg i merknaden (ser ned, bekymrede bryn),
            // er skjult for skjermlesere, og teksten fra bolk 7 er uendret.
            const buddy = () =>
              side.evaluate(() => {
                const m = document.querySelector("main [role=note]");
                const svg = m?.querySelector("svg.merke.unnskyld");
                const oyne = svg?.querySelector(".oyne");
                const bryn = [...(svg?.querySelectorAll(".bryn path") ?? [])];
                return {
                  merke: !!svg && svg.getAttribute("aria-hidden") === "true" && Math.round(svg.getBoundingClientRect().height) === 64,
                  tilVenstre: !!svg && m.firstElementChild === svg,
                  // Lys modus: som rammen. Mørk modus: som pupillene (lyse glass).
                  bryn:
                    bryn.length === 2 &&
                    bryn.every((b) =>
                      [getComputedStyle(svg.querySelector(".ramme")).stroke, getComputedStyle(oyne.querySelector(".oye")).fill].includes(getComputedStyle(b).stroke),
                    ),
                  brynFarge: bryn[0] ? getComputedStyle(bryn[0]).stroke : "",
                  pupillFarge: oyne ? getComputedStyle(oyne.querySelector(".oye")).fill : "",
                  rammeFarge: svg ? getComputedStyle(svg.querySelector(".ramme")).stroke : "",
                  animasjon: oyne ? getComputedStyle(oyne).animationName : "",
                  brynAnimasjon: bryn.map((b) => getComputedStyle(b).animationName).join(","),
                  nede: oyne ? new DOMMatrix(getComputedStyle(oyne).transform).f : 0,
                  tekst: m?.textContent.replace(/\s+/g, " ").trim() ?? "",
                };
              });
            const b = await buddy();
            sjekk(
              `bolk 10, gjennomsyn (bilde, ${modusnavn}): Buddy (64 px, aria-hidden) ser ned med bekymrede bryn til venstre i merknaden, og teksten er uendret`,
              b.merke &&
                b.tilVenstre &&
                b.bryn &&
                b.animasjon === "u-flakk" &&
                b.brynAnimasjon === "u-bryn-v,u-bryn-h" &&
                b.brynFarge === (modusnavn.includes("mørk") ? b.pupillFarge : b.rammeFarge) &&
                b.nede >= 6.5 &&
                b.tekst ===
                  "Når du laster opp bilder, hender det at Buddy leser feil. Les gjennom teksten under for å se at den er lik teksten du tok bilde av. Rett det som er feil før du går videre.",
              JSON.stringify(b),
            );
            await side.emulateMedia({ reducedMotion: "reduce" });
            const r = await buddy();
            sjekk(
              `bolk 10, gjennomsyn (bilde, ${modusnavn}): med redusert bevegelse står pupillene nede og brynene stille`,
              r.animasjon === "none" && r.brynAnimasjon === "none,none" && Math.abs(r.nede - 7) < 0.01,
              JSON.stringify({ animasjon: r.animasjon, bryn: r.brynAnimasjon, nede: r.nede }),
            );
            await axe(side, `gjennomsyn via bilde, redusert bevegelse (${modusnavn})`);
            await side.emulateMedia({ reducedMotion: null });
          }
          await axe(side, `gjennomsyn via ${vei} (${modusnavn})`);
        }
      }

      // FR-6: en tekst låst før 17.11 har bare det frie svaret, og de nye
      // kolonnene er null. Lesevisningen viser det under «Før du leste».
      const gammelt = "Noe om bølger og lys.";
      const g = await pool.query(
        `insert into tekst (konto_id, tittel, raatekst, redigert_tekst, vei, tilstand, overskrifter_godkjent, forkunnskapssvar, laast_tidspunkt)
         values ($1, 'Gammel prøve', $2, $2, 'liming', 'laast', now(), $3, now()) returning id`,
        [kontoId, eksempel, gammelt],
      );
      lagt.push(g.rows[0].id);
      await pc.goto(`${APP}/tekst/${g.rows[0].id}/lesing`);
      const gammelDel = (await pc.locator("#foer-du-leste").count()) > 0 ? await pc.locator("#foer-du-leste").innerText() : "";
      sjekk(
        "FR-6: gammel tekst viser «Før du leste, skrev du: …»",
        gammelDel.includes(`Før du leste, skrev du: ${gammelt}`),
        gammelDel.replace(/\s+/g, " ").slice(0, 200),
      );
    } finally {
      if (lagt.length > 0) {
        try {
          const { rowCount } = await pool.query(`delete from tekst where id = any($1::uuid[])`, [lagt]);
          sjekk("gjennomsyn: prøvetekstene er ryddet bort", rowCount === lagt.length, `${rowCount} av ${lagt.length}`);
        } catch (e) {
          sjekk("gjennomsyn: prøvetekstene er ryddet bort", false, e.message.split("\n")[0]);
        }
      }
      await pool.end();
    }
  }

  /* --- PRD §6.4: bruksgrensene ------------------------------------- */
  // Sist, fordi sjekken endrer dataene. Grensen fylles med hendelsesrader
  // (`forbruk.hendelse = 'ny_tekst'`), slik appen teller, og døgnet regnes fra
  // midnatt i Oslo. Takmeldingen sjekkes på en egen låst tekst uten quiz, så
  // EM-bølger beholder sin. Alt sjekken legger inn, ryddes bort etterpå.
  {
    const pool = new pg.Pool({ connectionString: DB, max: 1 });
    const forbruksrader = [];
    let tomTekst = null;
    const IDAG = `opprettet >= (date_trunc('day', now() at time zone 'Europe/Oslo') at time zone 'Europe/Oslo')`;
    try {
      const [{ id: kontoId }] = (await pool.query(`select id from "user" where email = $1`, [EPOST])).rows;
      const { rows: idag } = await pool.query(
        `select count(*)::int as n from forbruk where konto_id = $1 and hendelse = 'ny_tekst' and ${IDAG}`,
        [kontoId],
      );
      for (let i = idag[0].n; i < 5; i++) {
        const r = await pool.query(
          `insert into forbruk (konto_id, hendelse, oppgave, modell, tokens_inn, tokens_ut, mikrodollar)
           values ($1, 'ny_tekst', 'ny_tekst', '', 0, 0, 0) returning id`,
          [kontoId],
        );
        forbruksrader.push(r.rows[0].id);
      }
      await pc.goto(`${APP}/ny`);
      const grense = pc.locator("[data-grense=tekster]");
      sjekk(
        "PRD §6.4: 5 tekster i dag — /ny viser meldingen før innlesingen, med lenke til arbeidsbordet",
        (await grense.count()) === 1 &&
          // Meldingen står i to avsnitt, så textContent har ikke mellomrom mellom dem.
          (await grense.textContent()).includes("Du har lagt inn 5 tekster i dag.") &&
          (await grense.textContent()).includes("Du kan legge inn flere i morgen.") &&
          (await grense.locator("a[href='/']").count()) === 1 &&
          (await pc.locator("#tekst").count()) === 0,
        (await grense.textContent().catch(() => "")) ?? "",
      );
      await axe(pc, "ny tekst, grensen er nådd");

      // Taket: over 30 kroner i dag, og en låst tekst uten quiz.
      const ny = await pool.query(
        `insert into tekst (konto_id, tittel, raatekst, redigert_tekst, vei, tilstand, laast_tidspunkt)
         values ($1, 'Takprøve', $2, $2, 'liming', 'laast', now()) returning id`,
        [kontoId, eksempel],
      );
      tomTekst = ny.rows[0].id;
      const tak = await pool.query(
        `insert into forbruk (oppgave, modell, tokens_inn, tokens_ut, mikrodollar)
         values ('sjekk', 'claude-sonnet-5-5', 0, 0, 3000000) returning id`,
      );
      forbruksrader.push(tak.rows[0].id);
      await pc.goto(`${APP}/tekst/${tomTekst}/quiz`);
      const takmelding = pc.locator("[data-grense=taket]");
      await takmelding.waitFor({ timeout: 30000 }).catch(() => {});
      const { rows: quizer } = await pool.query(`select count(*)::int as n from quiz where tekst_id = $1`, [tomTekst]);
      sjekk(
        "PRD §6.4: taket er nådd — ny quiz gir takmeldingen i stedet for tenkeindikatoren, og ingen quiz lages",
        (await takmelding.count()) === 1 &&
          (await takmelding.textContent()).includes("LeseBuddy har nådd dagens grense for nye oppgaver.") &&
          (await pc.locator("text=Buddy lager quizen din").count()) === 0 &&
          quizer[0].n === 0,
        `${quizer[0].n} quiz(er)`,
      );
      await axe(pc, "quiz, dagstaket er nådd");
    } finally {
      if (forbruksrader.length > 0) {
        await pool.query(`delete from forbruk where id = any($1::uuid[])`, [forbruksrader]).catch(() => {});
      }
      if (tomTekst) await pool.query(`delete from tekst where id = $1`, [tomTekst]).catch(() => {});
      await pool.end();
    }
  }

  await nettleser.close();
} catch (e) {
  sjekk("skriptet kjørte ferdig", false, e.message.split("\n")[0]);
  if (process.env.SKJERMBILDE) {
    for (const ctx of globalThis.__nettleser?.contexts() ?? [])
      for (const [i, p] of ctx.pages().entries()) {
        await p.screenshot({ path: path.join(process.env.SKJERMBILDE, `feil-${i}.png`), fullPage: true }).catch(() => {});
        console.log("Side ved feil:", p.url(), (await p.locator("[role=alert]").allTextContents().catch(() => [])).join(" | "));
      }
  }
} finally {
  stopp();
}

/* --- Rapport --------------------------------------------------------- */
const dato = new Date().toISOString().slice(0, 10);
const ok = funn.filter((f) => f.ok).length;
const linjer = [
  `# Tilgjengelighetssjekk — ${dato}`,
  "",
  "Kjørt med `npm run sjekk:tilgjengelighet`: Chrome, PC (1280 px, lys og mørk modus) og telefon (375 px, berøring), axe-core WCAG 2.1 A/AA.",
  "",
  `**${ok} av ${funn.length} sjekker bestått.**`,
  "",
  "| | Sjekk | Detalj |",
  "|---|---|---|",
  ...funn.map((f) => `| ${f.ok ? "✓" : "✗"} | ${f.navn} | ${f.detalj.replace(/\|/g, "\\|")} |`),
  "",
];
if (axeFunn.length > 0) {
  linjer.push("## Funn fra axe-core", "", "| Side | Regel | Alvor | Antall | Eksempel | Hva |", "|---|---|---|---|---|---|");
  for (const a of axeFunn) linjer.push(`| ${a.side} | ${a.id} | ${a.alvor} | ${a.antall} | \`${a.eksempel}\` | ${a.hjelp} |`);
  linjer.push("");
}
linjer.push("Det axe-core ikke kan se — om rekkefølgen gir mening, om teksten er forståelig — krever en person. Se også testen på ekte telefon i fremdriftsplanen.", "");
await mkdir(path.join("maaling", "resultater"), { recursive: true });
await writeFile(path.join("maaling", "resultater", `tilgjengelighet-${dato}.md`), linjer.join("\n"));
console.log(`\n${ok} av ${funn.length} bestått. Rapport: maaling/resultater/tilgjengelighet-${dato}.md`);
process.exit(ok === funn.length ? 0 : 1);
