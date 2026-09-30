/**
 * Databaseskjema for Lesevenn.
 *
 * Kilde: ER-diagrammet i _bmad-output/planning-artifacts/arkitektur-lesevenn.md.
 * Flere invarianter fra spinen er kodet inn her framfor å stå som tekst:
 *
 *   AD-2   Avsnitt er numererte rader. Kildeavsnitt er en referanse til ett av dem,
 *          aldri et tegnspenn.
 *   AD-4   Alt generert innhold bærer promptversjon OG modellidentitet.
 *   AD-9   Tekst har tre tilstander, og overgangene går bare framover.
 *   AD-13  Forekomstsettet er lagret. Tetthetstaket regnes på det, og Lesevisningen
 *          rendrer bare fra det.
 *   AD-15  Unike indekser på begrepssett og quiz per tekst. Diagrammet sier ||--o|,
 *          men uten skranken er det bare en tegning.
 *
 * Navnekonvensjon: domenebegreper på norsk etter PRD-ens ordliste, ASCII-translitterert
 * der det trengs (oe, aa, ae). Tekniske begreper på engelsk.
 */

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ *
 * Kodeverk — lukkede sett, aldri fritekst (konsistenskonvensjonene)
 * ------------------------------------------------------------------ */

/** AD-9: tre tilstander, én vei framover. */
export const tekstTilstand = pgEnum("tekst_tilstand", [
  "innlest",
  "aktivert",
  "laast",
]);

/** Hvilken vei teksten kom inn. Brukes til å måle bildeuttrekk (FR-45). */
export const innlesingsvei = pgEnum("innlesingsvei", [
  "liming",
  "pdf",
  "bilde",
]);

/** FR-19: de fem svartilstandene. Skjemaet tillater bare disse. */
export const svartilstand = pgEnum("svartilstand", [
  "dekkende",
  "delvis",
  "misoppfatning",
  "uklart",
  "utenfor",
]);

/** FR-20: de fem oppfølgingsmålene, ett per regel i FR-19, samme rekkefølge. */
export const oppfoelgingsmaal = pgEnum("oppfoelgingsmaal", [
  "nytt_aspekt",
  "peker_mot_manglende",
  "motsigende_avsnitt",
  "ber_om_utdyping",
  "deler_opp",
]);

/** FR-17: elevens egen merking av et øvekort. */
export const oevekortMerking = pgEnum("oevekort_merking", ["kan", "maa_oeve"]);

/** FR-24: de to dekningsnivåene for morsmål. */
export const morsmaalNivaa = pgEnum("morsmaal_nivaa", [
  "kvalitetssikret",
  "modellstoettet",
]);

/* ------------------------------------------------------------------ *
 * Tekst og avsnitt
 * ------------------------------------------------------------------ */

export const tekst = pgTable(
  "tekst",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /**
     * Eier. FR-35, og AD-8 krever at hver datatilgangsfunksjon sjekker denne.
     *
     * TODO: fremmednøkkel legges til når Better Auth har generert sine tabeller.
     * Better Auth eier brukertabellen; å definere den her ville gitt to sannheter.
     */
    kontoId: uuid("konto_id").notNull(),

    tittel: text("tittel").notNull(),

    /** FR-3: bevares uendret ved siden av den redigerte teksten. */
    raatekst: text("raatekst").notNull(),
    redigertTekst: text("redigert_tekst").notNull(),

    /** AD-9. Låsen settes når eleven godkjenner fase 3b. */
    tilstand: tekstTilstand("tilstand").notNull().default("innlest"),

    vei: innlesingsvei("vei").notNull(),

    /** FR-6. Vurderes ikke og rettes ikke. */
    forkunnskapssvar: text("forkunnskapssvar"),

    opprettet: timestamp("opprettet", { withTimezone: true })
      .notNull()
      .defaultNow(),
    laastTidspunkt: timestamp("laast_tidspunkt", { withTimezone: true }),
  },
  (t) => [index("tekst_konto_idx").on(t.kontoId)],
);

/**
 * AD-2 og AD-12. Teksten deles i avsnitt én gang, av den ene delingsfunksjonen,
 * og listen fryses når Teksten låses. Alt generert innhold peker hit.
 */
export const avsnitt = pgTable(
  "avsnitt",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tekstId: uuid("tekst_id")
      .notNull()
      .references(() => tekst.id, { onDelete: "cascade" }),

    /** 1-basert, i dokumentrekkefølge. */
    nummer: integer("nummer").notNull(),
    innhold: text("innhold").notNull(),

    /** FR-5: overskrifter vises i Aktiveringen, brødtekst gjør ikke. */
    erOverskrift: boolean("er_overskrift").notNull().default(false),

    /** FR-5: satt når overskriften er generert av Lesevenn, ikke hentet fra teksten. */
    erGenerertEtikett: boolean("er_generert_etikett").notNull().default(false),
  },
  (t) => [
    unique("avsnitt_tekst_nummer_unik").on(t.tekstId, t.nummer),
    index("avsnitt_tekst_idx").on(t.tekstId),
  ],
);

/* ------------------------------------------------------------------ *
 * Begrepssett, begrep og forekomster
 * ------------------------------------------------------------------ */

/**
 * AD-15: unik per Tekst. To kallsteder som begge gjør «generer hvis mangler»
 * ville ellers gitt to rader, og da måler avviksstesten i FR-16 bare hvilken
 * rad spørringen tilfeldigvis fant.
 */
export const begrepssett = pgTable(
  "begrepssett",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tekstId: uuid("tekst_id")
      .notNull()
      .references(() => tekst.id, { onDelete: "cascade" }),

    /** AD-4. Uten modellidentitet er to måletall ikke sammenlignbare. */
    promptversjon: text("promptversjon").notNull(),
    modell: text("modell").notNull(),

    opprettet: timestamp("opprettet", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique("begrepssett_tekst_unik").on(t.tekstId)],
);

export const begrep = pgTable(
  "begrep",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    begrepssettId: uuid("begrepssett_id")
      .notNull()
      .references(() => begrepssett.id, { onDelete: "cascade" }),

    /** FR-7: forekommer ordrett i Teksten. Kastes før lagring hvis ikke (AD-11). */
    uttrykk: text("uttrykk").notNull(),

    /** FR-7: maksimalt to setninger, og ikke sirkulær. */
    forklaring: text("forklaring").notNull(),

    /** AD-7 i FR-7: intern sorteringsnøkkel. Vises ikke til eleven. */
    viktighetsrangering: integer("viktighetsrangering").notNull(),

    /** AD-2: hvor uttrykket er forankret. */
    kildeavsnittId: uuid("kildeavsnitt_id")
      .notNull()
      .references(() => avsnitt.id, { onDelete: "cascade" }),

    /** FR-17: elevens merking. Null betyr ikke gjennomgått. */
    merking: oevekortMerking("merking"),
  },
  (t) => [index("begrep_begrepssett_idx").on(t.begrepssettId)],
);

/**
 * AD-13. Hver enkelte markering, ikke hvert unike uttrykk.
 *
 * Dette er settet begge tetthetsmålene i FR-7 regnes på, og det eneste
 * Lesevisningen rendrer fra. Uten det regnes taket på antall unike uttrykk
 * mens visningen markerer hver forekomst — og et fagtungt avsnitt får fire
 * ganger taket uten at noe sier fra.
 */
export const forekomst = pgTable(
  "forekomst",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    begrepId: uuid("begrep_id")
      .notNull()
      .references(() => begrep.id, { onDelete: "cascade" }),
    avsnittId: uuid("avsnitt_id")
      .notNull()
      .references(() => avsnitt.id, { onDelete: "cascade" }),

    /** Tegnposisjon relativt til avsnittets innhold, ikke til hele Teksten (AD-2). */
    start: integer("start").notNull(),
    slutt: integer("slutt").notNull(),
  },
  (t) => [
    unique("forekomst_unik").on(t.begrepId, t.avsnittId, t.start),
    index("forekomst_avsnitt_idx").on(t.avsnittId),
  ],
);

/* ------------------------------------------------------------------ *
 * Quiz
 * ------------------------------------------------------------------ */

/** AD-15: unik per Tekst, samme grunn som begrepssett. */
export const quiz = pgTable(
  "quiz",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tekstId: uuid("tekst_id")
      .notNull()
      .references(() => tekst.id, { onDelete: "cascade" }),
    promptversjon: text("promptversjon").notNull(),
    modell: text("modell").notNull(),
    opprettet: timestamp("opprettet", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique("quiz_tekst_unik").on(t.tekstId)],
);

export const quizsporsmal = pgTable(
  "quizsporsmal",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),

    nummer: integer("nummer").notNull(),
    sporsmal: text("sporsmal").notNull(),

    /** FR-13: minst fem flervalg med fire alternativer, minst ett kort skriftlig. */
    erFlervalg: boolean("er_flervalg").notNull(),

    /** Fire alternativer ved flervalg, null ved kort svar. */
    alternativer: text("alternativer").array(),

    /** FR-14: nøyaktig ett alternativ støttes av Teksten. */
    riktigSvar: text("riktig_svar").notNull(),

    /** FR-14: hvert spørsmål har ett Kildeavsnitt. */
    kildeavsnittId: uuid("kildeavsnitt_id")
      .notNull()
      .references(() => avsnitt.id, { onDelete: "cascade" }),
  },
  (t) => [
    unique("quizsporsmal_nummer_unik").on(t.quizId, t.nummer),
    index("quizsporsmal_quiz_idx").on(t.quizId),
  ],
);

/** FR-15: tidligere forsøk beholdes, slik at eleven ser utviklingen. */
export const quizforsoek = pgTable(
  "quizforsoek",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),

    /** Elevens svar per spørsmål, som JSON-tekst. Rettingen er avledet. */
    svar: text("svar").notNull(),
    antallRiktige: integer("antall_riktige").notNull(),
    antallTotalt: integer("antall_totalt").notNull(),

    gjennomfoert: timestamp("gjennomfoert", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("quizforsoek_quiz_idx").on(t.quizId)],
);

/* ------------------------------------------------------------------ *
 * Fagsamtale
 * ------------------------------------------------------------------ */

export const fagsamtale = pgTable(
  "fagsamtale",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tekstId: uuid("tekst_id")
      .notNull()
      .references(() => tekst.id, { onDelete: "cascade" }),
    promptversjon: text("promptversjon").notNull(),
    modell: text("modell").notNull(),

    /** FR-22: høyst seks runder, eller til eleven avslutter selv. */
    avsluttet: timestamp("avsluttet", { withTimezone: true }),

    opprettet: timestamp("opprettet", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("fagsamtale_tekst_idx").on(t.tekstId)],
);

export const samtalerunde = pgTable(
  "samtalerunde",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fagsamtaleId: uuid("fagsamtale_id")
      .notNull()
      .references(() => fagsamtale.id, { onDelete: "cascade" }),

    nummer: integer("nummer").notNull(),

    sporsmal: text("sporsmal").notNull(),

    /** AD-2 og FR-20: hvert Samtalespørsmål er forankret. */
    kildeavsnittId: uuid("kildeavsnitt_id")
      .notNull()
      .references(() => avsnitt.id, { onDelete: "cascade" }),

    /** FR-20: strukturert utdata. Gjør avsnittstesten i FR-21 målbar. */
    maal: oppfoelgingsmaal("maal").notNull(),

    elevsvar: text("elevsvar"),

    /** FR-19: vises til eleven, med én setnings begrunnelse. Aldri en karakter. */
    svarvurdering: svartilstand("svarvurdering"),
    vurderingsbegrunnelse: text("vurderingsbegrunnelse"),

    /** FR-22: eleven kan be om ny vurdering av en runde. */
    revurdert: boolean("revurdert").notNull().default(false),

    opprettet: timestamp("opprettet", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("samtalerunde_nummer_unik").on(t.fagsamtaleId, t.nummer),
    index("samtalerunde_fagsamtale_idx").on(t.fagsamtaleId),
  ],
);

/* ------------------------------------------------------------------ *
 * Morsmål og minnevers
 * ------------------------------------------------------------------ */

/** FR-24: valget lagres på kontoen og gjelder til eleven endrer det. */
export const morsmaalsvalg = pgTable("morsmaalsvalg", {
  kontoId: uuid("konto_id").primaryKey(),

  /** ISO 639-1, fra den lukkede listen i FR-24. */
  spraak: text("spraak").notNull(),
  nivaa: morsmaalNivaa("nivaa").notNull(),

  endret: timestamp("endret", { withTimezone: true }).notNull().defaultNow(),
});

/** FR-30 og FR-31. Verset faktasjekkes før det vises (AD-11). */
export const minnevers = pgTable(
  "minnevers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tekstId: uuid("tekst_id")
      .notNull()
      .references(() => tekst.id, { onDelete: "cascade" }),

    /** Enten verset selv, eller en ferdig Suno-prompt. */
    innhold: text("innhold").notNull(),
    erSunoPrompt: boolean("er_suno_prompt").notNull().default(false),

    promptversjon: text("promptversjon").notNull(),
    modell: text("modell").notNull(),

    opprettet: timestamp("opprettet", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("minnevers_tekst_idx").on(t.tekstId)],
);
