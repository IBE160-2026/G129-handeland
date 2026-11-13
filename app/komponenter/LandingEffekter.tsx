"use client";

/**
 * Rulleeffektene på landingssiden — EXPERIENCE.md, Rulleeffekter på
 * landingssiden og Følge-Buddy.
 *
 * Effektene legges oppå den statiske siden fra serveren (Landingsside), og
 * bare når JavaScript kjører og bevegelse er tillatt. De endrer klasser på
 * elementer som allerede finnes, og aldri innholdet:
 *
 *   A  fagordene i eksempelteksten markeres ett for ett mens forklaringen ved
 *      siden av skifter. Uten `aria-live`: skjermleseren har hele `<dl>`-en
 *      hele tiden, fordi forklaringene som ikke vises, bare skjules visuelt.
 *      Flaten måles med den høyeste forklaringen vist, og den klistrede
 *      visningen slås av når flaten er høyere enn synsfeltet minus 32 px.
 *      Da står demoen statisk.
 *   B  Følge-Buddy nede i hjørnet når heroen er rullet forbi. Øynene leser i
 *      takt med rullingen, og boblene er ekko av seksjonsoverskriftene. Bare
 *      pynt (`aria-hidden`), bare fra 760 px, ved vanlig tekststørrelse, og
 *      bare når margen ved siden av tekstkolonnen har plass til Buddy og
 *      boblen, så de aldri dekker tekst (WCAG 2.4.11).
 *   C  stegene i «Slik hjelper Buddy deg» dukker fram mens en linje tegnes.
 *
 * Ved `prefers-reduced-motion` slås alle tre av, også om innstillingen
 * endres mens siden er åpen. Ingen avhengigheter: IntersectionObserver for
 * stegene, rAF for alt som følger rulleposisjonen, og ResizeObserver på
 * demoflaten og på en 1 rem-prøve (som `.bord-proeve` på arbeidsbordet), så
 * skriftlasting og endret tekststørrelse fanges opp uten en resize.
 */

import { useEffect, useRef } from "react";
import { BuddyMerke } from "./Merke";

const REDUSERT = "(prefers-reduced-motion: reduce)";
const BRED = "(min-width: 760px)";
/** Hvor lenge en boble står, i ms. Ingen animasjon varer over fem sekunder. */
const BOBLETID = 4500;
/** Luft mellom demoflaten og kanten av synsfeltet (EXPERIENCE.md: høyere enn synsfeltet). */
const LUFT = 32;

export function LandingEffekter() {
  const folgerRef = useRef<HTMLDivElement>(null);
  const proeveRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rot = document.getElementById("landingsside");
    const folger = folgerRef.current;
    const proeve = proeveRef.current;
    if (!rot || !folger || !proeve) return;

    const ettene = [...rot.querySelectorAll<HTMLElement>(".ls-ett")];
    const steg = rot.querySelector<HTMLElement>(".ls-steg");
    const fyll = rot.querySelector<HTMLElement>(".ls-linje > i");
    const spor = rot.querySelector<HTMLElement>(".ls-demo-spor");
    const klistre = rot.querySelector<HTMLElement>(".ls-demo-klistre");
    const panel = rot.querySelector<HTMLElement>(".ls-forklaringer");
    const ord = [...rot.querySelectorAll<HTMLElement>(".ls-fagord")];
    const forklaringer = [...rot.querySelectorAll<HTMLElement>(".ls-forklaring")];
    const teller = rot.querySelector<HTMLElement>(".ls-teller");
    const hero = rot.querySelector<HTMLElement>(".ls-hero");
    const innhold = rot.querySelector<HTMLElement>(".ls-innhold");
    const seksjoner = [...rot.querySelectorAll<HTMLElement>("[data-boble]")];
    const boble = folger.querySelector<HTMLElement>(".ls-boble");
    const oyne = folger.querySelector<SVGGElement>(".oyne");

    const redusert = matchMedia(REDUSERT);
    const bred = matchMedia(BRED);
    /** 1 rem i px, målt på prøven, så nettleserens tekststørrelse virker. */
    const remPx = () => proeve.getBoundingClientRect().width || 16;

    let a = false;
    let b = false;
    let c = false;
    let aktivt = -2;
    /** Demoflatens høyde med den høyeste forklaringen vist, og panelets. Bufret. */
    let flateHoeyde = 0;
    let panelHoeyde = 0;
    let sisteBoble = "";
    let bobleTimer: ReturnType<typeof setTimeout> | undefined;
    let ramme = 0;

    /* --- A ------------------------------------------------------------ */
    /** Tegner demoen for fagord i (−1: ingen ennå). */
    function tegnDemo(i: number) {
      ord.forEach((o, n) => o.classList.toggle("paa", i >= 0 && n <= i));
      // Bare visuelt skjult (sr-only), så skjermleseren alltid har hele listen.
      forklaringer.forEach((f, n) => {
        f.classList.toggle("paa", n === i);
        f.classList.toggle("sr-only", n !== i);
      });
      rot!.classList.toggle("ls-demo-i-gang", i >= 0);
      if (teller) teller.textContent = i >= 0 ? `Fagord ${i + 1} av ${forklaringer.length}` : "";
    }
    function visFagord(i: number) {
      if (i === aktivt) return;
      aktivt = i;
      tegnDemo(i);
    }
    function slaaAvA() {
      rot!.classList.remove("effekt-a", "ls-demo-i-gang");
      ord.forEach((o) => o.classList.remove("paa"));
      forklaringer.forEach((f) => f.classList.remove("paa", "sr-only"));
      if (klistre) klistre.style.top = "";
      if (panel) panel.style.minHeight = "";
      if (teller) teller.textContent = "";
      aktivt = -2;
      a = false;
    }
    /** Måler flaten i effektoppsettet, med hver forklaring vist etter tur, og bufrer den høyeste. */
    function maalA() {
      if (!klistre || !panel) return;
      rot!.classList.add("effekt-a");
      panel.style.minHeight = "";
      let flate = 0;
      let pan = 0;
      for (let i = -1; i < forklaringer.length; i++) {
        tegnDemo(i);
        flate = Math.max(flate, klistre.offsetHeight);
        pan = Math.max(pan, panel.offsetHeight);
      }
      flateHoeyde = flate;
      panelHoeyde = pan;
    }
    /** Slår A av eller på ut fra den bufrede høyden og synsfeltet. */
    function brukA() {
      if (!spor || !klistre || !panel || ord.length === 0 || flateHoeyde === 0) return;
      if (flateHoeyde > window.innerHeight - LUFT) {
        slaaAvA();
        return;
      }
      rot!.classList.add("effekt-a");
      // Panelet holdes like høyt for alle fagordene, så flaten ikke endrer høyde underveis.
      panel.style.minHeight = `${panelHoeyde}px`;
      klistre.style.top = `${Math.max(LUFT / 2, (window.innerHeight - flateHoeyde) / 2)}px`;
      aktivt = -2;
      visFagord(-1);
      a = true;
    }

    /* --- B ------------------------------------------------------------ */
    function settBoble(tekst: string) {
      if (tekst === sisteBoble) return;
      sisteBoble = tekst;
      clearTimeout(bobleTimer);
      if (!tekst) {
        folger!.dataset.snakker = "nei";
        return;
      }
      if (boble) boble.textContent = tekst;
      folger!.dataset.snakker = "ja";
      bobleTimer = setTimeout(() => {
        folger!.dataset.snakker = "nei";
      }, BOBLETID);
    }
    /**
     * Har margen til høyre for tekstkolonnen plass til Buddy og boblen?
     * Regnet ut fra målte bredder: kanten av innholdet, Buddys bredde og
     * avstand fra kanten, og boblens største bredde.
     */
    function plassTilBuddy() {
      if (!innhold || !boble) return false;
      folger!.dataset.aktiv = "ja";
      const ics = getComputedStyle(innhold);
      const tekstkant = innhold.getBoundingClientRect().right - parseFloat(ics.paddingRight);
      const rom = document.documentElement.clientWidth - tekstkant;
      const fcs = getComputedStyle(folger!);
      const behov = parseFloat(fcs.right) + Math.max(folger!.offsetWidth, parseFloat(getComputedStyle(boble).maxWidth)) + remPx();
      return rom >= behov;
    }

    /* --- C ------------------------------------------------------------ */
    let stegvakt: IntersectionObserver | null = null;
    function slaaAvC() {
      stegvakt?.disconnect();
      stegvakt = null;
      rot!.classList.remove("effekt-c");
      ettene.forEach((e) => e.classList.remove("inne"));
      if (fyll) fyll.style.height = "";
      c = false;
    }
    function slaaPaaC() {
      rot!.classList.add("effekt-c");
      stegvakt = new IntersectionObserver(
        (poster) => {
          for (const p of poster) {
            if (!p.isIntersecting) continue;
            // Et steg som har dukket fram, blir stående.
            p.target.classList.add("inne");
            stegvakt?.unobserve(p.target);
          }
        },
        { rootMargin: "0px 0px -28% 0px" },
      );
      for (const e of ettene) stegvakt.observe(e);
      c = true;
    }

    /* --- Rullingen ---------------------------------------------------- */
    function tegn() {
      ramme = 0;
      const vh = window.innerHeight;
      if (c && steg && fyll) {
        const r = steg.getBoundingClientRect();
        const andel = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
        fyll.style.height = `${andel * 100}%`;
      }
      if (a && spor && klistre) {
        const d = spor.getBoundingClientRect();
        const topp = parseFloat(klistre.style.top) || 0;
        // Den bufrede høyden, ikke den levende: ordet skal ikke blafre ved stegskillene.
        const lengde = d.height - flateHoeyde;
        const andel = lengde > 0 ? (topp - d.top) / lengde : 0;
        visFagord(andel < 0 ? -1 : Math.min(forklaringer.length - 1, Math.floor(andel * forklaringer.length)));
      }
      if (b && hero) {
        folger!.dataset.synlig = hero.getBoundingClientRect().bottom < 0 ? "ja" : "nei";
        // Øynene leser fra side til side, én gang per 600 px rulling.
        const t = (window.scrollY / 600) % 1;
        const x = (t < 0.5 ? t * 2 : 2 - t * 2) * 14 - 7;
        if (oyne) oyne.style.transform = `translateX(${x.toFixed(2)}px)`;
        const her = seksjoner.find((s) => {
          const r = s.getBoundingClientRect();
          return r.top < vh * 0.5 && r.bottom > vh * 0.5;
        });
        settBoble(folger!.dataset.synlig === "ja" ? (her?.dataset.boble ?? "") : "");
      }
    }
    function planlegg() {
      if (!ramme) ramme = requestAnimationFrame(tegn);
    }

    /* --- Av og på ----------------------------------------------------- */
    /** Sist målte størrelser, så ResizeObserver ikke reagerer på våre egne endringer. */
    const sist = { bredde: 0, flate: 0, rem: 0 };
    function vurder() {
      const bevegelse = !redusert.matches;

      if (bevegelse && !c) slaaPaaC();
      if (!bevegelse && c) slaaAvC();

      slaaAvA();
      if (bevegelse) {
        maalA();
        brukA();
      }

      b = bevegelse && bred.matches && remPx() <= 16.5 && plassTilBuddy();
      folger!.dataset.aktiv = b ? "ja" : "nei";
      if (!b) {
        folger!.dataset.synlig = "nei";
        settBoble("");
      }

      tegn();
      sist.bredde = window.innerWidth;
      sist.flate = klistre?.offsetHeight ?? 0;
      sist.rem = remPx();
    }

    let endring = 0;
    const vedEndring = () => {
      cancelAnimationFrame(endring);
      endring = requestAnimationFrame(vurder);
    };
    // Ny bredde: mål alt på nytt. Bare ny høyde (adresselinja på telefon):
    // bruk den bufrede flatehøyden mot det nye synsfeltet, uten å nullstille.
    const vedStoerrelse = () => {
      if (window.innerWidth !== sist.bredde) {
        vedEndring();
        return;
      }
      if (!redusert.matches && flateHoeyde > 0) {
        const fikk = flateHoeyde <= window.innerHeight - LUFT;
        if (fikk !== a) brukA();
        else if (a && klistre) klistre.style.top = `${Math.max(LUFT / 2, (window.innerHeight - flateHoeyde) / 2)}px`;
        sist.flate = klistre?.offsetHeight ?? 0;
      }
      planlegg();
    };
    // Skriftlasting, ny tekststørrelse eller annen ny høyde på flaten.
    const stoerrelsesvakt = new ResizeObserver(() => {
      const flate = klistre?.offsetHeight ?? 0;
      const rem = remPx();
      if (Math.abs(flate - sist.flate) < 1 && Math.abs(rem - sist.rem) < 0.01) return;
      vedEndring();
    });
    stoerrelsesvakt.observe(proeve);
    if (klistre) stoerrelsesvakt.observe(klistre);
    let levende = true;
    document.fonts?.ready.then(() => {
      if (levende) vedEndring();
    });

    const vedRulling = () => planlegg();

    vurder();
    window.addEventListener("scroll", vedRulling, { passive: true });
    window.addEventListener("resize", vedStoerrelse);
    redusert.addEventListener("change", vedEndring);
    bred.addEventListener("change", vedEndring);

    return () => {
      levende = false;
      window.removeEventListener("scroll", vedRulling);
      window.removeEventListener("resize", vedStoerrelse);
      redusert.removeEventListener("change", vedEndring);
      bred.removeEventListener("change", vedEndring);
      stoerrelsesvakt.disconnect();
      cancelAnimationFrame(ramme);
      cancelAnimationFrame(endring);
      clearTimeout(bobleTimer);
      slaaAvC();
      slaaAvA();
    };
  }, []);

  return (
    <>
      {/* Prøven måler 1 rem, så endret tekststørrelse fanges opp. */}
      <span ref={proeveRef} className="bord-proeve" aria-hidden="true" />
      <div ref={folgerRef} className="ls-folger" data-aktiv="nei" data-synlig="nei" data-snakker="nei" aria-hidden="true">
        <span className="ls-boble" />
        <BuddyMerke variant="ansikt" storrelse={70} />
      </div>
    </>
  );
}
