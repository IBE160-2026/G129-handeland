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

  // Viften på telefon: kortene i et rutenett under bunken, uten sidelengs rulling.
  await tlf.goto(`${APP}/`);
  await tlf.locator("button:has-text('Vis aktiviteter for EM-bølger')").tap(HJOERNE);
  await tlf.locator("[role=dialog]").waitFor();
  await tlf.waitForTimeout(1000);
  sjekk("viften på telefon er et rutenett", (await tlf.locator("[role=dialog]").getAttribute("data-oppsett")) === "rutenett");
  await ingenSiderulling(tlf, "arbeidsbord med åpen vifte");
  await axe(tlf, "arbeidsbord med åpen vifte (telefon)");
  sjekk(
    "menyen på telefon viser Samlingen og Konto",
    (await tlf.locator("nav a:visible", { hasText: "Samlingen" }).count()) === 1 && (await tlf.locator("nav a:visible", { hasText: "Konto" }).count()) === 1,
  );

  /* --- 320 px og 200 % tekst: ingen sidelengs rulling, ingen tekst klippes */
  async function ingenKlipping(side, navn) {
    const klippet = await side.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((e) => {
          const s = getComputedStyle(e);
          if (!/hidden|clip/.test(`${s.overflowX} ${s.overflowY}`)) return false;
          // Skjult tekst for skjermlesere, og tittelen på en bunke, som med vilje
          // avkortes etter tre linjer (EXPERIENCE.md, Lang tittel).
          if (e.closest(".sr-only") || e.classList.contains("bunke-tittel") || !e.textContent.trim()) return false;
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
  await ingenSiderulling(smal, "åpen vifte 320 px, 200 % tekst");
  await ingenKlipping(smal, "åpen vifte 320 px, 200 % tekst");
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
