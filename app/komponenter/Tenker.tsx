"use client";

/**
 * Tenkeindikatoren — DESIGN.md (thinking-indicator) og EXPERIENCE.md
 * (Component Patterns, State Patterns).
 *
 * Én felles visning for all venting på språkmodellen (§5), i tre former
 * (bolk 5). Buddy er alltid `BuddyMerke`. I de små formene er det mini-Buddy
 * M1: samme tegning, beskåret til brillene. Størrelsene står i globals.css
 * (`--tenker-merke`), som er fasit:
 *
 *   flate  Merket på 64 px med statusen ved siden av, i flaten der innholdet
 *          kommer. Smalere enn 760 px er den i stedet en pille som ligger fast
 *          nederst på skjermen, med brillene 28 px høye. Det er det samme
 *          elementet, så det finnes fortsatt bare én statusregion. Begge
 *          merkene tegnes, og CSS-en viser det som passer bredden.
 *   knapp  Brillene 20 px høye inne i knappen som ble trykket, med statusen
 *          som knappetekst. For korte ventinger. Komponenten tegner selve
 *          knappen; `children` er knappeteksten når ingenting venter.
 *   linje  Brillene 22 px høye foran én linje med status, for oversettelser i
 *          bakgrunnen.
 *
 * Felles for alle formene:
 *
 *   - Statusregionen (`role="status"`) rendres ALLTID, også når ingenting
 *     venter, så den finnes tom i siden før teksten skrives inn. Ellers er det
 *     tilfeldig om skjermleseren sier noe.
 *   - Mens `aktiv`: øynene leser i en løkke. Etter 30 s kommer et tillegg.
 *   - Går den fra aktiv til ikke aktiv med `ferdigStatus`, spilles
 *     avslutningen (4,05 s) én gang i indikatorens plass, og statusen settes
 *     til `ferdigStatus`. Uten `ferdigStatus` (feil) forsvinner indikatoren
 *     bare. Pillen glir bort etter avslutningen.
 *
 * Overleveringen (17.11): forsvinner en flate eller knapp mens den venter,
 * fordi svaret kom og siden byttet side (`redirect`) eller innhold
 * (`revalidatePath`, `router.refresh`), gir den avslutningen videre til
 * `TenkerVert` i rotlayouten, som lever videre gjennom navigeringen. Det
 * skjer bare når stedet har en `ferdigStatus` i siste tegning mens det
 * ventet. Linjeformen og `bareAvslutning` gir ikke videre. Reglene:
 *
 *   - Steder som selv vet svaret (`kjentSvar`: quizen som lages, fagord på
 *     nytt, «Prøv igjen» og ny vurdering i samtalen, bildeinnlesingen)
 *     setter `ferdigStatus` først når kallet har lyktes, og sjekker ikke
 *     adressen.
 *   - Serverskjemaene kan ikke vite svaret. De setter `ferdigStatus` mens det
 *     ventes, og avslutningen gis videre bare når siden eleven havner på ikke
 *     har en feil i adressen (`feil`, `fagordfeil`, app/feiladresse.ts), og
 *     skjemaet ikke fikk en feil tilbake.
 *   - Forlat-vernet: trykker eleven en lenke eller går tilbake mens det
 *     ventes, avbrytes overleveringen.
 *
 * Overleveringen utsettes til etter tegningen og avbrytes om samme instans
 * monteres igjen (StrictMode i utvikling monterer to ganger). Verten spiller
 * avslutningen i tenkepillen på telefon, og fra 760 px i et lite fast kort
 * nederst til høyre, som ikke teller i pilleregnskapet. Verten flytter ikke
 * fokus og holder aldri igjen navigeringen.
 *
 * Med `prefers-reduced-motion` står øynene stille, avslutningen viser B-en
 * direkte, og pillen forsvinner uten bevegelse (globals.css). Statusteksten
 * bærer beskjeden.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type ReactNode,
} from "react";
import { feilIAdressen } from "../feiladresse";
import { TELEFON } from "./brytepunkt";
import { BuddyMerke } from "./Merke";

const LANG_VENTING_MS = 30_000;
/** Avslutningen er 4,05 s; B-en blir stående 0,8 s før indikatoren går (bolk 8, 18.11). */
const AVSLUTNING_MS = 4050 + 800;
/**
 * Pillen er borte når `tenker-pille-ut` er ferdig (animationend). Tidtakeren
 * er en reserve for når animasjonen ikke kjører: på PC og med redusert
 * bevegelse skjules flaten uten animasjon.
 */
const UTGANG_RESERVE_MS = 1000;
export const LANG_VENTING_TEKST = "Dette tar lenger tid enn vanlig. Buddy jobber fortsatt.";

/* ------------------------------------------------------------------ */
/*
 * Pillene på siden. Pillen ligger over innholdet, så siden får like mye luft
 * nederst som pillene er høye (globals.css, `html.har-tenkepille`). Én eier på
 * modulnivå holder regnskapet, så to piller ikke overskriver hverandres verdi:
 * de stables nedenfra (eldste nederst), og klassen og variabelen på <html>
 * fjernes først når den siste synlige pillen er borte. Bare piller som faktisk
 * ligger fast og har høyde, telles.
 */
const piller: HTMLElement[] = [];
const PILLE_MELLOMROM_PX = 8;
let pilleObservator: ResizeObserver | null = null;

function oppdaterPiller() {
  const rot = document.documentElement;
  let hoeyde = 0;
  for (const el of piller) {
    const fast = getComputedStyle(el).position === "fixed" && el.offsetHeight > 0;
    if (!fast) {
      el.style.removeProperty("--tenker-over");
      continue;
    }
    if (hoeyde > 0) hoeyde += PILLE_MELLOMROM_PX;
    el.style.setProperty("--tenker-over", `${hoeyde}px`);
    hoeyde += el.offsetHeight;
  }
  if (hoeyde > 0) {
    rot.classList.add("har-tenkepille");
    rot.style.setProperty("--tenker-pille", `${hoeyde}px`);
  } else {
    rot.classList.remove("har-tenkepille");
    rot.style.removeProperty("--tenker-pille");
  }
}

function meldPille(el: HTMLElement): () => void {
  piller.push(el);
  if (!pilleObservator) {
    pilleObservator = new ResizeObserver(oppdaterPiller);
    window.addEventListener("resize", oppdaterPiller);
  }
  pilleObservator.observe(el);
  oppdaterPiller();
  return () => {
    piller.splice(piller.indexOf(el), 1);
    pilleObservator?.unobserve(el);
    el.style.removeProperty("--tenker-over");
    if (piller.length === 0) {
      pilleObservator?.disconnect();
      pilleObservator = null;
      window.removeEventListener("resize", oppdaterPiller);
    }
    oppdaterPiller();
  };
}

/* ------------------------------------------------------------------ */
/*
 * Overleveringen til verten. En liten butikk på modulnivå, som `TenkerVert`
 * abonnerer på med `useSyncExternalStore`. Den holder høyst én avslutning;
 * en ny erstatter den gamle, med ny id, så avslutningen starter på nytt.
 */
export type Avslutning = { id: number; status: string };

let avslutning: Avslutning | null = null;
let nesteAvslutning = 0;
const lyttere = new Set<() => void>();

function varsle() {
  for (const l of lyttere) l();
}

export function abonnerAvslutning(lytter: () => void): () => void {
  lyttere.add(lytter);
  return () => {
    lyttere.delete(lytter);
  };
}

export function hentAvslutning(): Avslutning | null {
  return avslutning;
}

const ingenAvslutning = () => null;

/** Verten er ferdig med avslutningen. En nyere avslutning får stå. */
export function avslutningFerdig(id: number) {
  if (avslutning?.id !== id) return;
  avslutning = null;
  varsle();
}

/**
 * «Tilbake» i nettleseren, talt av én varig lytter. Når eleven trykker
 * tilbake, gjør React sidebyttet synkront inne i Nexts egen popstate-lytter,
 * før en lytter som bare lever mens indikatoren venter, rekker å kjøre (målt
 * i sjekk:tilgjengelighet 18.11). Telleren leses derfor først i
 * overleveringens tidsbryter, når popstate er ferdig sendt.
 */
let antallTilbake = 0;
let lytterPaaTilbake = false;

export function lyttEtterTilbake(): void {
  if (lytterPaaTilbake || typeof window === "undefined") return;
  lytterPaaTilbake = true;
  window.addEventListener("popstate", () => {
    antallTilbake++;
  });
}

/** Hvor mange ganger eleven har gått tilbake (eller fram) i historikken. */
export function hentAntallTilbake(): number {
  return antallTilbake;
}

/**
 * Gir avslutningen videre, utsatt til etter tegningen: da står den nye
 * adressen i nettleseren, og StrictMode har rukket å montere instansen igjen
 * og avbryte. Returnerer avbrytelsen.
 *
 * `sjekkAdressen`: et serverskjema kan ikke vite svaret, så har siden eleven
 * havner på en feil i adressen (`feil`, `fagordfeil`, app/feiladresse.ts),
 * spilles ingen avslutning. Steder som selv vet at kallet lyktes
 * (`kjentSvar`), sjekker ikke adressen.
 */
export function giAvslutningVidere(
  status: string,
  {
    sjekkAdressen = true,
    sok = () => window.location.search,
    gikkTilbake,
  }: { sjekkAdressen?: boolean; sok?: () => string; gikkTilbake?: () => boolean } = {},
): () => void {
  const t = setTimeout(() => {
    // Forlat-vernet for «tilbake»: lest her, etter at popstate er sendt.
    if (gikkTilbake?.()) return;
    if (sjekkAdressen && feilIAdressen(sok())) return;
    avslutning = { id: ++nesteAvslutning, status };
    varsle();
  }, 0);
  return () => clearTimeout(t);
}

/**
 * Forlat-vernet: forlater et klikk siden? Bare et vanlig venstreklikk på en
 * lenke som åpnes i samme fane, og som ikke bare er et anker på samme side.
 * Ren logikk, så den kan testes uten nettleser.
 */
export function klikkForlater(
  k: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean },
  lenke: { href: string; target: string; download: boolean } | null,
  her: string,
): boolean {
  if (!lenke || k.button !== 0 || k.metaKey || k.ctrlKey || k.shiftKey || k.altKey) return false;
  if (lenke.download || (lenke.target !== "" && lenke.target !== "_self")) return false;
  let til: URL;
  let fra: URL;
  try {
    til = new URL(lenke.href, her);
    fra = new URL(her);
  } catch {
    return false;
  }
  if (til.protocol !== "http:" && til.protocol !== "https:") return false;
  const sammeSide = til.origin === fra.origin && til.pathname === fra.pathname && til.search === fra.search;
  // Et anker på samme side, også et tomt «#», forlater ikke siden.
  return !(sammeSide && (til.hash !== "" || lenke.href.startsWith("#")));
}

type Siste = {
  aktiv: boolean;
  ferdigStatus?: string;
  form: TenkerForm;
  bareAvslutning: boolean;
  /** Stedet setter `ferdigStatus` først når kallet har lyktes. */
  kjentSvar: boolean;
  /** Eleven trykket en lenke mens det ventet. */
  forlatt: boolean;
  /** Gikk eleven tilbake mens det ventet? Leses i tidsbryteren (se `lyttEtterTilbake`). */
  gikkTilbake?: () => boolean;
};

/**
 * Overleveringen for én instans: `montert()` i en effekt uten avhengigheter,
 * `gaar(siste)` i oppryddingen. Ren logikk, så den kan testes uten React.
 */
export function lagOverlevering(
  gi: (status: string, sjekkAdressen: boolean, gikkTilbake?: () => boolean) => () => void = (
    status,
    sjekkAdressen,
    gikkTilbake,
  ) => giAvslutningVidere(status, { sjekkAdressen, gikkTilbake }),
) {
  let avbryt: (() => void) | null = null;
  return {
    montert() {
      avbryt?.();
      avbryt = null;
    },
    gaar(s: Siste) {
      if (!s.aktiv || !s.ferdigStatus || s.form === "linje" || s.bareAvslutning || s.forlatt) return;
      avbryt = gi(s.ferdigStatus, !s.kjentSvar, s.gikkTilbake);
    },
  };
}

/* ------------------------------------------------------------------ */

export type TenkerForm = "flate" | "knapp" | "linje";

type Felles = {
  aktiv: boolean;
  /** Hva Buddy gjør, for eksempel «Buddy finner fagordene …». */
  status: string;
  /**
   * Statusen når svaret kom, for eksempel «Quizen er rettet.». Settes bare
   * når ingen feil er kjent. Går indikatoren fra aktiv til ikke aktiv med
   * den, spilles avslutningen på plassen. Forsvinner flaten eller knappen
   * mens den venter og har den, gis avslutningen videre til `TenkerVert`.
   */
  ferdigStatus?: string;
  /**
   * Stedet vet selv at svaret kom: `ferdigStatus` settes først når kallet
   * eller lesingen har lyktes, aldri mens det ventes. Da sjekkes ikke
   * adressen ved overleveringen. Serverskjemaene kan ikke vite svaret og
   * lar den stå av.
   */
  kjentSvar?: boolean;
  /** Avstand rundt indikatoren (flate, linje) eller knappens klasser (knapp). */
  className?: string;
};

type Flate = Felles & {
  form?: "flate";
  /** En kort linje under statusen, for eksempel hvor lenge det pleier å ta. */
  hjelp?: string;
  /**
   * Vis bare avslutningen, ikke selve ventingen. Brukes der svaret vises et
   * annet sted enn knappen (quizen ruller til resultatet øverst), mens en
   * annen Tenker i knappen viser ventingen.
   */
  bareAvslutning?: boolean;
};

type Linje = Felles & { form: "linje"; hjelp?: string };

type Knapp = Felles & {
  form: "knapp";
  /** Knappeteksten når ingenting venter. */
  children?: ReactNode;
  type?: "submit" | "button";
  onClick?: () => void;
};

type Fase = "hvile" | "slutt" | "gaar";

export function Tenker(props: Flate | Linje | Knapp) {
  const { aktiv, status, ferdigStatus, kjentSvar = false, className = "" } = props;
  const form: TenkerForm = props.form ?? "flate";
  const hjelp = props.form === "knapp" ? undefined : props.hjelp;
  const bareAvslutning = props.form === undefined || props.form === "flate" ? (props.bareAvslutning ?? false) : false;

  // Avledet tilstand fra forrige `aktiv`, regnet ut under rendring (ikke i en
  // effekt), så avslutningen starter i samme tegning som svaret vises.
  const [forrigeAktiv, settForrigeAktiv] = useState(aktiv);
  const [sluttTekst, settSluttTekst] = useState<string | null>(null);
  const [fase, settFase] = useState<Fase>("hvile");
  const [lenge, settLenge] = useState(false);
  const [montert, settMontert] = useState(false);
  const flateRef = useRef<HTMLDivElement>(null);
  // Siste tegning som ble vist, og overleveringen når komponenten går.
  const siste = useRef<Omit<Siste, "forlatt">>({ aktiv, ferdigStatus, form, bareAvslutning, kjentSvar });
  const [overlevering] = useState(() => lagOverlevering());
  /** Forlat-vernet: eleven trykket en lenke eller gikk tilbake mens det ventet. */
  const forlatt = useRef(false);
  /** Telleren for «tilbake» og stien da ventingen begynte (forlat-vernet). */
  const ventFra = useRef({ tilbake: 0, sti: "" });

  if (aktiv !== forrigeAktiv) {
    settForrigeAktiv(aktiv);
    const slutt = !aktiv && ferdigStatus ? ferdigStatus : null;
    settSluttTekst(slutt);
    settFase(slutt ? "slutt" : "hvile");
    settLenge(false);
  }

  // Regionen skal finnes tom før teksten kommer, også når komponenten
  // monteres midt i en venting (quizen som lages av seg selv).
  useEffect(() => {
    const id = requestAnimationFrame(() => settMontert(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // I en layouteffekt, så verdien fra hver tegning er på plass før neste
  // tegning kan fjerne komponenten (bildeinnlesingen bytter visning rett
  // etter tegningen som satte `ferdigStatus`).
  useLayoutEffect(() => {
    siste.current = { aktiv, ferdigStatus, form, bareAvslutning, kjentSvar };
  });

  // Forlat-vernet: mens det ventes, lytter indikatoren på klikk på lenker og
  // på «tilbake». Går eleven selv fra siden, er det ikke svaret som byttet
  // den, og overleveringen avbrytes. En ny venting starter med blanke ark.
  useEffect(() => {
    if (!aktiv) return;
    forlatt.current = false;
    const klikk = (e: globalThis.MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      const lenke = a && {
        href: a.getAttribute("href") ?? "",
        target: a.getAttribute("target") ?? "",
        download: a.hasAttribute("download"),
      };
      if (klikkForlater(e, lenke, window.location.href)) forlatt.current = true;
    };
    // «Tilbake»: telleren og stien da ventingen begynte. Et anker på samme
    // side gir også popstate, så bare et bytte av sti eller søk teller.
    lyttEtterTilbake();
    ventFra.current = { tilbake: hentAntallTilbake(), sti: window.location.pathname + window.location.search };
    document.addEventListener("click", klikk, true);
    return () => {
      document.removeEventListener("click", klikk, true);
    };
  }, [aktiv]);

  // Går komponenten mens den venter, kom svaret og siden ble byttet: gi
  // avslutningen videre til verten. Monteres samme instans igjen
  // (StrictMode), avbrytes den.
  useEffect(() => {
    overlevering.montert();
    const ref = siste;
    const vern = forlatt;
    const fra = ventFra;
    return () => {
      const { tilbake, sti } = fra.current;
      overlevering.gaar({
        ...ref.current,
        forlatt: vern.current,
        gikkTilbake: () => hentAntallTilbake() !== tilbake && window.location.pathname + window.location.search !== sti,
      });
    };
  }, [overlevering]);

  useEffect(() => {
    if (!aktiv) return;
    const t = setTimeout(() => settLenge(true), LANG_VENTING_MS);
    return () => clearTimeout(t);
  }, [aktiv]);

  // Etter avslutningen glir pillen bort (bare flaten har en utgang).
  useEffect(() => {
    if (fase === "hvile") return;
    const t = setTimeout(
      () => settFase(fase === "slutt" && form === "flate" ? "gaar" : "hvile"),
      fase === "slutt" ? AVSLUTNING_MS : UTGANG_RESERVE_MS,
    );
    return () => clearTimeout(t);
  }, [fase, form]);

  const avslutter = !aktiv && fase !== "hvile" && sluttTekst !== null;
  // `bareAvslutning`: vis ingenting mens det ventes, bare avslutningen etterpå.
  const synlig = (aktiv && !bareAvslutning) || avslutter;
  const tilstand = aktiv ? "tenker" : "slutt";

  useEffect(() => {
    const el = flateRef.current;
    if (form !== "flate" || !synlig || !el) return;
    return meldPille(el);
  }, [form, synlig]);

  if (props.form === "knapp") {
    // Knappen er låst med aria-disabled, ikke disabled: da blir fokus stående
    // på knappen, også når kallet feiler og knappen går tilbake. Klikk og
    // innsending blokkeres mens Buddy tenker. Knappeteksten er statusen;
    // regionen ved siden av er bare for skjermlesere, og er tom før ventingen.
    const { onClick } = props;
    const trykk = (e: MouseEvent<HTMLButtonElement>) => {
      if (synlig) {
        e.preventDefault();
        return;
      }
      onClick?.();
    };
    return (
      <>
        <button
          type={props.type ?? "button"}
          aria-disabled={synlig || undefined}
          onClick={trykk}
          className={`tenker-knapp ${synlig ? "gap-2 text-start" : ""} ${className}`}
        >
          {synlig ? (
            <>
              <BuddyMerke variant="ansikt" mini tilstand={tilstand} storrelse="var(--tenker-merke)" />
              <span>{avslutter ? sluttTekst : status}</span>
            </>
          ) : (
            props.children
          )}
        </button>
        {aktiv && lenge && (
          <p aria-hidden="true" className="basis-full text-dempet">
            {LANG_VENTING_TEKST}
          </p>
        )}
        <div role="status" aria-live="polite" className="sr-only">
          {montert && synlig && (avslutter ? sluttTekst : lenge ? `${status} ${LANG_VENTING_TEKST}` : status)}
        </div>
      </>
    );
  }

  const innhold = !synlig ? null : avslutter ? (
    <p className="font-bold">{sluttTekst}</p>
  ) : form === "linje" ? (
    <p className="font-bold">
      {status}
      {hjelp && <span className="font-normal text-dempet"> {hjelp}</span>}
      {lenge && <span className="font-normal text-dempet"> {LANG_VENTING_TEKST}</span>}
    </p>
  ) : (
    <>
      <p className="font-bold">{status}</p>
      {hjelp && <p className="tenker-hjelp text-dempet">{hjelp}</p>}
      {lenge && <p className="tenker-lang text-dempet">{LANG_VENTING_TEKST}</p>}
    </>
  );

  const ramme =
    form === "linje"
      ? `tenker-linje flex items-center gap-2 ${className}`
      : `tenker-flate flex items-center gap-4 ${fase === "gaar" ? "gaar" : ""} ${className}`;

  return (
    <div
      ref={flateRef}
      className={synlig ? ramme : "contents"}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && e.animationName === "tenker-pille-ut") settFase("hvile");
      }}
    >
      {/* Flaten har begge merkene: 64 px fra 760 px, mini i pillen (globals.css). */}
      {synlig && form === "flate" && (
        <BuddyMerke variant="ansikt" tilstand={tilstand} storrelse="var(--tenker-merke)" />
      )}
      {synlig && <BuddyMerke variant="ansikt" mini tilstand={tilstand} storrelse="var(--tenker-merke)" />}
      {/*
        Før montering (serverrendringen og første tegning) står teksten som en
        synlig kopi utenfor regionen, skjult for skjermlesere. Regionen er tom
        til etter montering, så den finnes før teksten skrives inn.
      */}
      {synlig && !montert && (
        <div aria-hidden="true" className="min-w-0">
          {innhold}
        </div>
      )}
      <div role="status" aria-live="polite" className={synlig && montert ? "min-w-0" : "sr-only"}>
        {montert && innhold}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Verten for avslutninger som er gitt videre (overleveringen over). Montert
 * én gang i rotlayouten, utenfor sidene, så den lever videre gjennom
 * navigeringen. Den har én statusregion, som finnes tom fra første tegning.
 * Avslutningen tegnes med flatens markering: på telefon er det tenkepillen,
 * fra 760 px et lite fast kort nederst til høyre (`.tenker-vert`,
 * globals.css). Den vises bare under avslutningen, aldri mens Buddy tenker,
 * og flytter ikke fokus.
 */
export function TenkerVert() {
  const a = useSyncExternalStore(abonnerAvslutning, hentAvslutning, ingenAvslutning);
  const [montert, settMontert] = useState(false);
  /** Id-en til avslutningen som glir bort. */
  const [gaarId, settGaarId] = useState<number | null>(null);
  const flateRef = useRef<HTMLDivElement>(null);
  const gaar = a !== null && gaarId === a.id;

  useEffect(() => {
    const id = requestAnimationFrame(() => settMontert(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!a) return;
    const t = setTimeout(() => settGaarId(a.id), AVSLUTNING_MS);
    return () => clearTimeout(t);
  }, [a]);

  // Reserve når utgangen ikke animeres (PC, redusert bevegelse).
  useEffect(() => {
    if (!a || !gaar) return;
    const t = setTimeout(() => avslutningFerdig(a.id), UTGANG_RESERVE_MS);
    return () => clearTimeout(t);
  }, [a, gaar]);

  // Bare pillen på telefon teller i pilleregnskapet. Kortet fra 760 px ligger
  // i hjørnet, og siden skal ikke bli lengre av det.
  const id = a?.id;
  useEffect(() => {
    const el = flateRef.current;
    if (id === undefined || !el || !window.matchMedia(TELEFON).matches) return;
    return meldPille(el);
  }, [id]);

  return (
    <div
      ref={flateRef}
      className={a ? `tenker-flate tenker-vert flex items-center gap-4 ${gaar ? "gaar" : ""}` : "contents"}
      onAnimationEnd={(e) => {
        if (a && e.target === e.currentTarget && e.animationName === "tenker-pille-ut") avslutningFerdig(a.id);
      }}
    >
      {a && <BuddyMerke key={`s${a.id}`} variant="ansikt" tilstand="slutt" storrelse="var(--tenker-merke)" />}
      {a && <BuddyMerke key={`m${a.id}`} variant="ansikt" mini tilstand="slutt" storrelse="var(--tenker-merke)" />}
      <div role="status" aria-live="polite" className={a ? "min-w-0" : "sr-only"}>
        {montert && a && <p className="font-bold">{a.status}</p>}
      </div>
    </div>
  );
}
