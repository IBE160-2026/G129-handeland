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
 *   - FR-49: Samlingen, tittelen til neste steg, og søk uten treff
 *   - 320 px og 200 % tekst: ingen sidelengs rulling og ingen klippet tekst
 *     på arbeidsbordet, i viften, i Samlingen og på Ny tekst
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

  /* --- PC: løypen fram til lesevisningen --------------------------- */
  const pc = await (await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO" })).newPage();
  pc.setDefaultTimeout(120000);

  await pc.goto(`${APP}/registrer`);
  await axe(pc, "registrering");
  await pc.fill("#kode", KODE);
  await pc.fill("#epost", EPOST);
  await pc.fill("#passord", PASSORD);
  await pc.fill("#gjenta", PASSORD);
  await pc.click("form button[type=submit]");
  await pc.waitForURL(`${APP}/`);
  // FR-48: en ny elev lander på et tomt arbeidsbord.
  sjekk(
    "FR-48: tomt arbeidsbord for ny elev",
    (await pc.locator("text=Her blir tekstene dine liggende. Legg den første på bordet.").count()) === 1 &&
      (await pc.locator("main a:has-text('+ Ny tekst')").count()) === 1,
  );
  await axe(pc, "arbeidsbord (tomt)");

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
  await pc.fill("#svar", "Noe om bølger og stråling.");
  await pc.click("text=Videre");
  // Gjennomsynet nås nå bare via PDF og bilde; innlimt tekst låses i aktiveringen (FR-3, 11.11).
  await pc.waitForURL(/\/lesing$/, { timeout: 240000 });
  const lesing = pc.url();
  const tekstUrl = lesing.replace(/\/lesing$/, "");
  await pc.waitForSelector("article button");
  await axe(pc, "lesevisning");

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
  const kortnavn = await vifte.locator(".vifte-kort > li .kort-navn").allTextContents();
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

  /* --- FR-49: Samlingen --------------------------------------------- */
  await pc.goto(`${APP}/samling`);
  await axe(pc, "samling");
  const tittellenke = pc.locator("main h2 a", { hasText: "EM-bølger" });
  sjekk(
    "FR-49: tittelen i Samlingen lenker til neste steg",
    (await tittellenke.getAttribute("href")) === `${tekstUrl.replace(APP, "")}/quiz`,
    `${await tittellenke.getAttribute("href")}`,
  );
  await pc.goto(`${APP}/samling?sok=mitose`);
  sjekk(
    "FR-49: søk uten treff sier det, med «Vis alle»",
    (await pc.locator("text=Ingen titler inneholder «mitose».").count()) === 1 && (await pc.locator("main a:has-text('Vis alle')").count()) === 1,
  );
  sjekk("menyen markerer Samlingen som aktiv", (await pc.locator("nav a[aria-current=page]").textContent()) === "Samlingen");
  sjekk("innlogget (/samling): ingen «Logg inn» eller «For lærere» i topplinjen", await ingenLandingsmeny(pc));

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
    ["konto", `${APP}/konto`],
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
    "menyen på telefon viser Samlingen og Konto",
    (await tlf.locator("nav a:visible", { hasText: "Samlingen" }).count()) === 1 && (await tlf.locator("nav a:visible", { hasText: "Konto" }).count()) === 1,
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
  sjekk("demoen har overskriften «Se hvordan Buddy markerer fagord»", (await land.locator("h2", { hasText: "Se hvordan Buddy markerer fagord" }).count()) === 1);
  sjekk(
    "topplinjen på landingssiden: «For lærere» og «Logg inn», ikke appmenyen",
    (await land.locator("header a:visible", { hasText: "For lærere" }).count()) === 1 &&
      (await land.locator("header a:visible", { hasText: "Logg inn" }).count()) === 1 &&
      (await land.locator("header a:visible", { hasText: "Samlingen" }).count()) === 0,
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
          await axe(side, `gjennomsyn via ${vei} (${modusnavn})`);
        }
      }
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
