/**
 * Demotesten — PRD §9.5, «den faktiske ferdig-testen».
 *
 *   npm run demotest            tre kjøringer på tom database (standard)
 *   npm run demotest -- 1       én kjøring
 *
 * «Et nivå er ferdig når demoløypen kjører gjennom på en tom database, tre
 * ganger etter hverandre, uten inngrep fra utvikleren.» De 14 stegene står i
 * §9.5 og er gjengitt i rapporten. Hvert steg er en sjekk her.
 *
 * Testmodus `fyll`: et lagret modellsvar brukes når det finnes; ellers kalles
 * modellen én gang og svaret lagres. Første kjøring koster derfor noen kall
 * (krever ANTHROPIC_API_KEY i .env.local), de neste er gratis og like. Elevens
 * svar er faste, så nøklene er de samme hver gang.
 *
 * §9.5 sier hva demoløypen bevisst IKKE tester: at Fagsamtalen klassifiserer
 * et bestemt svar i en bestemt tilstand. Den sjekker at flyten holder og at
 * feltene finnes — kvaliteten måles i FR-21.
 *
 * Rører aldri Neon: databasen er en PGlite på 127.0.0.1, og den tømmes og
 * migreres før hver kjøring.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const KJOERINGER = Number(process.argv[2] ?? 3);
const DBPORT = 5441;
const APPPORT = 3110;
const DB = `postgresql://postgres:postgres@127.0.0.1:${DBPORT}/postgres`;
const APP = `http://localhost:${APPPORT}`;
const KODE = "demotest";
const PASSORD = "et-langt-passord";
const BILDEMAPPE = path.join("testdata", "demotest");

if (new URL(DB).hostname !== "127.0.0.1") throw new Error("Databasen må være lokal.");

/* ------------------------------------------------------------------ */

const barn = [];
function start(kommando, argv, env = {}) {
  const p = spawn(kommando, argv, { shell: true, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  barn.push(p);
  return p;
}
function stopp() {
  for (const p of barn) {
    if (process.platform === "win32") spawnSync("taskkill", ["/pid", String(p.pid), "/T", "/F"], { stdio: "ignore" });
    else p.kill();
  }
}
process.on("SIGINT", () => {
  stopp();
  process.exit(130);
});
async function vent(sjekkFn, hva, ms = 180000) {
  const slutt = Date.now() + ms;
  for (;;) {
    try {
      if (await sjekkFn()) return;
    } catch {}
    if (Date.now() > slutt) throw new Error(`Ventet for lenge på ${hva}`);
    await new Promise((ok) => setTimeout(ok, 500));
  }
}

/** Tømmer databasen og kjører migrasjonene — «en tom database». */
async function tomDatabase() {
  const c = new pg.Client(DB);
  await c.connect();
  await c.query("DROP SCHEMA IF EXISTS public CASCADE; DROP SCHEMA IF EXISTS drizzle CASCADE; CREATE SCHEMA public;");
  await c.end();
  const pool = new pg.Pool({ connectionString: DB, max: 1 });
  await migrate(drizzle(pool, { casing: "snake_case" }), { migrationsFolder: "data/migrasjoner" });
  await pool.end();
}

async function sql(sporring, verdier = []) {
  const c = new pg.Client(DB);
  await c.connect();
  try {
    return (await c.query(sporring, verdier)).rows;
  } finally {
    await c.end();
  }
}

/* --- Sjekker og rapport ------------------------------------------- */

let kjoering = 0;
const funn = [];
function sjekk(steg, navn, ok, detalj = "") {
  funn.push({ kjoering, steg, navn, ok: !!ok, detalj: String(detalj ?? "") });
  console.log(`  ${ok ? "✓" : "✗"} [${steg}] ${navn}${detalj ? ` — ${detalj}` : ""}`);
  if (!ok) throw new Error(`Steg ${steg}: ${navn}${detalj ? ` (${detalj})` : ""}`);
}

/* --- Testbildene til steg 13 -------------------------------------- */

/**
 * To «boksider» som PNG, laget én gang ved å tegne tekst i Chrome. Lagres i
 * testdata/demotest/, så bildene — og dermed nøklene til de lagrede svarene —
 * er de samme hver gang.
 */
async function testbilder(nettleser, eksempel) {
  await mkdir(BILDEMAPPE, { recursive: true });
  const filer = [path.join(BILDEMAPPE, "side-1.png"), path.join(BILDEMAPPE, "side-2.png")];
  if (filer.every((f) => existsSync(f))) return filer;
  const avsnitt = eksempel.split(/\r?\n\s*\r?\n/).map((a) => a.trim()).filter(Boolean);
  const sider = [avsnitt.slice(0, 4), avsnitt.slice(4, 8)];
  const s = await nettleser.newPage({ viewport: { width: 900, height: 1200 } });
  for (const [i, side] of sider.entries()) {
    const html = side
      .map((a) => (a.length < 60 ? `<h2>${a}</h2>` : `<p>${a}</p>`))
      .join("");
    await s.setContent(
      `<body style="font-family:Georgia,serif;font-size:22px;line-height:1.5;padding:48px;background:#fff;color:#111">${html}</body>`,
    );
    await s.screenshot({ path: filer[i], fullPage: true });
  }
  await s.close();
  return filer;
}

/* --- Kjerneløypen: steg 2–8 (og 9 på PC) --------------------------- */

const SVAR = [
  "Mikrobølgene har en frekvens som passer med frekvensen vannmolekylene svinger med, så molekylene rister og maten blir varm.",
  "Jeg tror mikrobølgene varmer opp luften inne i ovnen, og så er det luften som varmer maten.",
  "vet ikke",
];

async function loeype(s, { mobil, eksempel, brod }) {
  const trykk = (l) => (mobil ? l.tap() : l.click());
  const p = mobil ? "12/" : "";

  // Steg 2: lim inn, fase 3a.
  await s.goto(`${APP}/`);
  await s.fill("#tittel", "EM-bølger");
  await s.fill("#tekst", eksempel);
  await trykk(s.locator('button[type=submit]:visible:has-text("Begynn")'));
  await s.waitForURL(/\/overskrifter$/);
  sjekk(`${p}2`, "fase 3a viser bare overskriftene, ikke brødteksten", !(await s.content()).includes(brod));
  const andre = s.locator("ol input[name^=o-]").nth(1);
  const gammel = await andre.inputValue();
  await andre.fill(`Om ${gammel.toLowerCase()}`);
  await trykk(s.locator("text=Overskriftene stemmer — videre"));
  await s.waitForURL(/\/aktivering$/);
  sjekk(`${p}2`, "én overskrift rettet og godkjent", (await s.content()).includes(`Om ${gammel.toLowerCase()}`));

  // Steg 3: aktivering.
  sjekk(`${p}3`, "aktiveringen viser ikke brødteksten", !(await s.content()).includes(brod));
  await s.fill("#svar", "Noe om bølger og stråling, kanskje mikrobølgeovner.");
  await trykk(s.locator("text=Videre"));
  await s.waitForURL(/\/gjennomsyn$/);

  // Steg 4: fase 3b, rett én linje, lås.
  const felt = s.locator("textarea#tekst");
  const tekst = await felt.inputValue();
  sjekk(`${p}4`, "fase 3b viser hele teksten", tekst.includes(brod));
  await felt.fill(tekst.replace("Heinrich Hertz", "Heinrich Rudolf Hertz"));
  await trykk(s.locator("text=Lås og finn fagordene"));
  await s.waitForURL(/\/lesing$/, { timeout: 240000 });
  const lesing = s.url();
  const tekstUrl = lesing.replace(/\/lesing$/, "");
  await s.goto(`${tekstUrl}/gjennomsyn`);
  sjekk(`${p}4`, "teksten er låst for redigering etterpå", !s.url().endsWith("/gjennomsyn") && (await s.locator("textarea#tekst").count()) === 0);

  // Steg 5: tre forklaringer, én med tastatur alene.
  await s.goto(lesing);
  const ord = s.locator("article button[aria-expanded]");
  const dialog = s.locator("article [role=dialog]");
  sjekk(`${p}5`, "fagord er markert", (await ord.count()) >= 3, `${await ord.count()} markeringer`);
  if (!mobil) {
    await s.locator("#lesetekst").evaluate((el) => el.scrollIntoView());
    for (let i = 0; i < 80 && !(await s.evaluate(() => document.activeElement?.getAttribute("aria-expanded") !== null)); i++) {
      await s.keyboard.press("Tab");
    }
    sjekk(`${p}5`, "forklaring 1 åpnet med tastatur alene", await dialog.isVisible());
    await s.keyboard.press("Escape");
  }
  for (const i of mobil ? [0, 1, 2] : [1, 2]) {
    await trykk(ord.nth(i));
    sjekk(`${p}5`, `forklaring åpnet med ${mobil ? "trykk" : "klikk"} (ord ${i + 1})`, await dialog.isVisible());
    await trykk(s.locator("h1"));
  }

  // Steg 6: quiz, resultat, følg én tilbakevisning.
  await s.goto(`${tekstUrl}/quiz`);
  const lag = s.locator('button:has-text("Lag quizen")');
  if (await lag.count()) await trykk(lag);
  await s.waitForSelector("ol fieldset", { timeout: 240000 });
  for (const f of await s.locator("ol > li fieldset").all()) {
    const radio = f.locator("input[type=radio]");
    if (await radio.count()) await radio.first().check();
    const t = f.locator("textarea");
    if (await t.count()) await t.fill("Det har med frekvens å gjøre.");
  }
  await trykk(s.locator('button:has-text("Lever")'));
  const nei = s.locator("label:has-text('Nei, ikke helt')");
  await nei.first().waitFor({ timeout: 30000 }).catch(() => {});
  for (const n of await nei.all()) await trykk(n);
  if (await s.locator('button:has-text("Se resultatet")').count()) await trykk(s.locator('button:has-text("Se resultatet")'));
  await s.waitForSelector("text=/Du fikk \\d+ av \\d+ riktige/");
  sjekk(`${p}6`, "quiz levert og resultat vist", true, (await s.locator("text=/Du fikk/").first().textContent())?.trim());
  const tilbake = s.locator("text=Les avsnittet i teksten").first();
  if (await tilbake.count()) {
    await trykk(tilbake);
    await s.waitForURL(/\/lesing#avsnitt-\d+$/);
    await vent(async () => (await s.locator("[data-uthevet=true]").count()) === 1, "uthevet avsnitt", 10000).catch(() => {});
    sjekk(`${p}6`, "tilbakevisning fører til kildeavsnittet, uthevet", (await s.locator("[data-uthevet=true]").count()) === 1, s.url().split("#")[1]);
  } else {
    sjekk(`${p}6`, "tilbakevisning fører til kildeavsnittet", false, "ingen feil svar å følge");
  }

  // Steg 7: øvekort, merk to.
  await s.goto(`${tekstUrl}/oevekort`);
  await trykk(s.locator('button:has-text("Kan")'));
  await trykk(s.locator('button:has-text("Neste →")'));
  await trykk(s.locator('button:has-text("Må øve mer")'));
  await s.waitForTimeout(1500);
  await s.goto(`${tekstUrl}/oppgaver`);
  // Synlig tekst, ikke kildekoden: React setter kommentarer mellom tekst og tall i HTML-en.
  sjekk(`${p}7`, "to kort merket og lagret", (await s.locator("text=/kan 1 · må øve 1/").count()) > 0);

  // Steg 8: fagsamtale, tre runder.
  await trykk(s.locator('button:has-text("Start en fagsamtale")'));
  await s.waitForURL(/\/samtale\/[0-9a-f-]+$/, { timeout: 240000 });
  const samtaleId = s.url().split("/").pop();
  for (let n = 1; n <= 3; n++) {
    await s.locator(`#svar-${n}`).waitFor({ timeout: 240000 });
    await s.fill(`#svar-${n}`, SVAR[n - 1]);
    await trykk(s.locator('button[type=submit]:has-text("Svar")'));
    // Samtalen har opptil seks runder, så etter tre svar kommer alltid et fjerde felt.
    await s.locator(`#svar-${n + 1}`).waitFor({ timeout: 240000 });
  }
  const runder = await sql(
    `SELECT nummer, svarvurdering, vurderingsbegrunnelse, kildeavsnitt_id, maal FROM samtalerunde WHERE fagsamtale_id = $1 ORDER BY nummer`,
    [samtaleId],
  );
  for (let n = 1; n <= 3; n++) {
    const r = runder.find((x) => x.nummer === n);
    sjekk(`${p}8`, `runde ${n}: svarvurdering med begrunnelse`, r?.svarvurdering && r?.vurderingsbegrunnelse, r?.svarvurdering);
    const neste = runder.find((x) => x.nummer === n + 1);
    sjekk(`${p}8`, `runde ${n}: oppfølging med kildeavsnitt og mål`, neste?.kildeavsnitt_id && neste?.maal, neste?.maal);
  }

  // Steg 9 (bare på PC): «jeg tror du misforsto svaret mitt».
  if (!mobil) {
    await trykk(s.locator('button:has-text("Jeg tror du misforsto svaret mitt")').first());
    await vent(async () => (await sql(`SELECT 1 FROM samtalerunde WHERE fagsamtale_id = $1 AND revurdert`, [samtaleId])).length > 0, "ny vurdering", 240000);
    sjekk("9", "runden ble vurdert på nytt", true);
  }

  await trykk(s.locator('button:has-text("Avslutt samtalen og se oppsummeringen")'));
  await s.waitForSelector("text=Det du forklarte godt", { timeout: 60000 });
  sjekk(
    `${p}8`,
    "oppsummeringen lister både det godtatte og misoppfatningene",
    (await s.locator("text=Det som ikke stemte med teksten").count()) > 0 && (await s.locator("text=Det du forklarte godt").count()) > 0,
  );
  return tekstUrl;
}

/* --- Én kjøring ----------------------------------------------------- */

async function enKjoering(nettleser) {
  await tomDatabase();
  const eksempel = await readFile("testdata/eksempeltekst/em-egenskaper.txt", "utf8");
  const brod = eksempel
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.replace(/\s+/g, " ").trim())
    .find((b) => b.split(" ").length > 20)
    .split(" ")
    .slice(0, 6)
    .join(" ");
  const epost = `demo${kjoering}@test.no`;

  // Steg 1: opprett konto, logg inn.
  const pc = await (await nettleser.newContext({ viewport: { width: 1280, height: 900 }, locale: "nb-NO" })).newPage();
  pc.setDefaultTimeout(60000);
  await pc.goto(`${APP}/registrer`);
  await pc.fill("#kode", KODE);
  await pc.fill("#epost", epost);
  await pc.fill("#passord", PASSORD);
  await pc.fill("#gjenta", PASSORD);
  await pc.click("form button[type=submit]");
  await pc.waitForURL(`${APP}/`);
  sjekk("1", "konto opprettet og innlogget", true);

  // Steg 2–9.
  const tekstUrl = await loeype(pc, { mobil: false, eksempel, brod });

  // Steg 10: arabisk.
  await pc.goto(`${APP}/konto`);
  await pc.selectOption("#spraak", "ar");
  await pc.click('form button:has-text("Lagre")');
  await pc.waitForTimeout(1500);
  await pc.goto(`${tekstUrl}/aktivering`);
  await pc.locator("li [lang=ar][dir=rtl]").first().waitFor({ timeout: 240000 });
  sjekk("10", "aktiveringens overskrifter på arabisk, høyre-til-venstre, med norsk ved siden av", (await pc.content()).includes("Om "));
  await pc.goto(`${tekstUrl}/lesing`);
  const lagOpps = pc.locator('button:has-text("Vis en kort oppsummering")');
  if (await lagOpps.count()) await lagOpps.click();
  await pc.locator("#oppsummering [lang=ar][dir=rtl]").first().waitFor({ timeout: 240000 });
  const norskOpps = await pc.locator("#oppsummering ol > li > p").first().textContent();
  sjekk("10", "oppsummeringen på begge språk, arabisk høyre-til-venstre", norskOpps && norskOpps.length > 10);
  await pc.locator("aside [lang=ar]").first().waitFor({ timeout: 240000 });
  const parentes = await pc.locator("aside dd").evaluateAll((dd) =>
    dd.some((d) => d.querySelector("[lang=ar]") && /\([^)]+\)/.test(d.textContent ?? "")),
  );
  sjekk("10", "norsk fagord i parentes etter det oversatte", parentes);
  await pc.goto(`${APP}/konto`);
  await pc.selectOption("#spraak", "");
  await pc.click('form button:has-text("Lagre")');
  await pc.waitForTimeout(1000);

  // Steg 11: PF-1.
  await pc.goto(`${APP}/`);
  await pc.click('[role=tab]:has-text("Last opp PDF")');
  await pc.setInputFiles("#pdf", "testdata/pdf/pf1-skannet.pdf");
  await pc.locator("text=Filen ser ut til å være et bilde av en tekst.").waitFor({ timeout: 30000 });
  sjekk("11", "PF-1: melding og anbefalt handling", (await pc.locator("text=Ta bilder av sidene i stedet").count()) > 0);

  // Steg 12: steg 2–8 på telefon.
  const kontekst = await nettleser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, locale: "nb-NO" });
  const tlf = await kontekst.newPage();
  tlf.setDefaultTimeout(60000);
  await tlf.goto(`${APP}/logg-inn`);
  await tlf.fill("#epost", epost);
  await tlf.fill("#passord", PASSORD);
  await tlf.tap("form button[type=submit]");
  await tlf.waitForURL(`${APP}/`);
  await loeype(tlf, { mobil: true, eksempel, brod });
  await kontekst.close();

  // Steg 13: to bilder.
  const bilder = await testbilder(nettleser, eksempel);
  await pc.goto(`${APP}/`);
  await pc.click('[role=tab]:has-text("Ta bilder")');
  await pc.setInputFiles("#bilder", bilder);
  await pc.click('button[aria-label="Flytt side 2 opp"]');
  await pc.click('button[aria-label="Flytt side 1 ned"]');
  sjekk("13", "rekkefølgen kan endres", true);
  await pc.click('button:has-text("Les teksten fra de 2 bildene")');
  await pc.locator("text=Det blir ofte feil når tekst leses fra bilder").waitFor({ timeout: 240000 });
  sjekk("13", "merknaden om at bildeuttrekk ikke er kvalitetssikret vises", true);
  await pc.fill("#tittel", "Fra bilder");
  await pc.click('button[type=submit]:visible:has-text("Begynn")');
  await pc.waitForURL(/\/overskrifter$/);
  await pc.click("text=Overskriftene stemmer — videre");
  await pc.waitForURL(/\/aktivering$/);
  await pc.fill("#svar", "Bølger.");
  await pc.click("text=Videre");
  await pc.waitForURL(/\/gjennomsyn$/);
  sjekk("13", "uttrekket går gjennom fase 3a og 3b som alt annet", (await pc.locator("textarea#tekst").inputValue()).length > 100);

  // Steg 14: slett tekst A, logg ut.
  await pc.goto(`${APP}/`);
  const forFoer = (await sql(`SELECT count(*)::int AS n FROM tekst`))[0].n;
  const kort = pc.locator("aside li").filter({ hasText: "EM-bølger" }).first();
  await kort.locator('button:has-text("Slett")').click();
  await pc.click('[role=alertdialog] button:has-text("Slett for godt")');
  await pc.waitForTimeout(1500);
  const etter = (await sql(`SELECT count(*)::int AS n FROM tekst`))[0].n;
  sjekk("14", "testtekst A slettet", etter === forFoer - 1, `${forFoer} → ${etter} tekster`);
  await pc.goto(`${APP}/konto`);
  await pc.click('button:has-text("Logg ut")');
  await pc.waitForURL(/\/logg-inn/);
  sjekk("14", "logget ut", true);
  await pc.context().close();
}

/* --- Hovedløkka ---------------------------------------------------- */

const resultat = [];
try {
  console.log("Starter database i minnet og appen i testmodus «fyll» …");
  start("npx", ["pglite-server", `--port=${DBPORT}`, "--max-connections=20"]);
  await vent(async () => {
    const c = new pg.Client(DB);
    await c.connect();
    await c.end();
    return true;
  }, "databasen");
  await vent(async () => (await tomDatabase(), true), "første migrering", 60000);

  start("npx", ["next", "dev", "-p", String(APPPORT)], {
    DATABASE_URL: DB,
    DATABASE_URL_UNPOOLED: DB,
    LESEVENN_TESTMODUS: "fyll",
    LESEVENN_BYGGEMAPPE: ".next-sjekk",
    LESEVENN_INVITASJONSKODE: KODE,
    BETTER_AUTH_SECRET: "lokal-hemmelighet-kun-for-demotesten",
    BETTER_AUTH_URL: APP,
  });
  await vent(async () => (await fetch(`${APP}/api/helse`)).ok, "appen");

  const nettleser = await chromium.launch({ channel: "chrome", headless: true });
  for (kjoering = 1; kjoering <= KJOERINGER; kjoering++) {
    console.log(`\nKjøring ${kjoering} av ${KJOERINGER} (tom database)`);
    const t0 = Date.now();
    try {
      await enKjoering(nettleser);
      resultat.push({ kjoering, ok: true, sek: Math.round((Date.now() - t0) / 1000) });
    } catch (e) {
      console.log(`  ✗ stoppet: ${e.message.split("\n")[0]}`);
      if (!funn.some((f) => f.kjoering === kjoering && !f.ok)) {
        funn.push({ kjoering, steg: "?", navn: "kjøringen stoppet", ok: false, detalj: e.message.split("\n")[0] });
      }
      resultat.push({ kjoering, ok: false, sek: Math.round((Date.now() - t0) / 1000) });
      for (const ctx of nettleser.contexts()) {
        for (const [i, s] of ctx.pages().entries()) {
          await s.screenshot({ path: path.join("maaling", "resultater", `demotest-feil-${kjoering}-${i}.png`), fullPage: true }).catch(() => {});
        }
        await ctx.close().catch(() => {});
      }
    }
  }
  await nettleser.close();
} finally {
  stopp();
}

/* --- Rapport ------------------------------------------------------- */

const dato = new Date().toISOString().slice(0, 10);
const bestaatt = resultat.filter((r) => r.ok).length;
const linjer = [
  `# Demotest (§9.5) — ${dato}`,
  "",
  `Kjørt med \`npm run demotest\`: ${KJOERINGER} kjøringer etter hverandre, hver på en tom database, uten inngrep. Chrome, PC (1280 px) og telefon (390 px, berøring). Testmodus \`fyll\`: lagrede modellsvar der de finnes, ellers ett ekte kall som lagres.`,
  "",
  `**${bestaatt} av ${KJOERINGER} kjøringer gikk gjennom.** ${bestaatt === KJOERINGER && KJOERINGER >= 3 ? "Demotesten er bestått." : "Demotesten er ikke bestått."}`,
  "",
  "| Kjøring | Resultat | Tid |",
  "|---|---|---|",
  ...resultat.map((r) => `| ${r.kjoering} | ${r.ok ? "✓ gjennom" : "✗ stoppet"} | ${r.sek} s |`),
  "",
  "## Sjekkene",
  "",
  "| Kjøring | Steg | Sjekk | Detalj |",
  "|---|---|---|---|",
  ...funn.map((f) => `| ${f.kjoering} | ${f.steg} | ${f.ok ? "✓" : "✗"} ${f.navn} | ${f.detalj.replace(/\|/g, "\\|")} |`),
  "",
  "Steg med «12/» foran er steg 2–8 gjentatt på telefon (steg 12 i §9.5). Demotesten tester at flyten holder og at feltene finnes, ikke kvaliteten på Fagsamtalens klassifisering — den måles i FR-21.",
  "",
];
await mkdir(path.join("maaling", "resultater"), { recursive: true });
await writeFile(path.join("maaling", "resultater", `demotest-${dato}.md`), linjer.join("\n"));
console.log(`\n${bestaatt} av ${KJOERINGER} kjøringer gikk gjennom. Rapport: maaling/resultater/demotest-${dato}.md`);
process.exit(bestaatt === KJOERINGER ? 0 : 1);
