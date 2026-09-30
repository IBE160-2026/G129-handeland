CREATE TYPE "public"."innlesingsvei" AS ENUM('liming', 'pdf', 'bilde');--> statement-breakpoint
CREATE TYPE "public"."morsmaal_nivaa" AS ENUM('kvalitetssikret', 'modellstoettet');--> statement-breakpoint
CREATE TYPE "public"."oevekort_merking" AS ENUM('kan', 'maa_oeve');--> statement-breakpoint
CREATE TYPE "public"."oppfoelgingsmaal" AS ENUM('nytt_aspekt', 'peker_mot_manglende', 'motsigende_avsnitt', 'ber_om_utdyping', 'deler_opp');--> statement-breakpoint
CREATE TYPE "public"."svartilstand" AS ENUM('dekkende', 'delvis', 'misoppfatning', 'uklart', 'utenfor');--> statement-breakpoint
CREATE TYPE "public"."tekst_tilstand" AS ENUM('innlest', 'aktivert', 'laast');--> statement-breakpoint
CREATE TABLE "avsnitt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tekst_id" uuid NOT NULL,
	"nummer" integer NOT NULL,
	"innhold" text NOT NULL,
	"er_overskrift" boolean DEFAULT false NOT NULL,
	"er_generert_etikett" boolean DEFAULT false NOT NULL,
	CONSTRAINT "avsnitt_tekst_nummer_unik" UNIQUE("tekst_id","nummer")
);
--> statement-breakpoint
CREATE TABLE "begrep" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"begrepssett_id" uuid NOT NULL,
	"uttrykk" text NOT NULL,
	"forklaring" text NOT NULL,
	"viktighetsrangering" integer NOT NULL,
	"kildeavsnitt_id" uuid NOT NULL,
	"merking" "oevekort_merking"
);
--> statement-breakpoint
CREATE TABLE "begrepssett" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tekst_id" uuid NOT NULL,
	"promptversjon" text NOT NULL,
	"modell" text NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "begrepssett_tekst_unik" UNIQUE("tekst_id")
);
--> statement-breakpoint
CREATE TABLE "fagsamtale" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tekst_id" uuid NOT NULL,
	"promptversjon" text NOT NULL,
	"modell" text NOT NULL,
	"avsluttet" timestamp with time zone,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "forekomst" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"begrep_id" uuid NOT NULL,
	"avsnitt_id" uuid NOT NULL,
	"start" integer NOT NULL,
	"slutt" integer NOT NULL,
	CONSTRAINT "forekomst_unik" UNIQUE("begrep_id","avsnitt_id","start")
);
--> statement-breakpoint
CREATE TABLE "minnevers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tekst_id" uuid NOT NULL,
	"innhold" text NOT NULL,
	"er_suno_prompt" boolean DEFAULT false NOT NULL,
	"promptversjon" text NOT NULL,
	"modell" text NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "morsmaalsvalg" (
	"konto_id" uuid PRIMARY KEY NOT NULL,
	"spraak" text NOT NULL,
	"nivaa" "morsmaal_nivaa" NOT NULL,
	"endret" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tekst_id" uuid NOT NULL,
	"promptversjon" text NOT NULL,
	"modell" text NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_tekst_unik" UNIQUE("tekst_id")
);
--> statement-breakpoint
CREATE TABLE "quizforsoek" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"svar" text NOT NULL,
	"antall_riktige" integer NOT NULL,
	"antall_totalt" integer NOT NULL,
	"gjennomfoert" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizsporsmal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"nummer" integer NOT NULL,
	"sporsmal" text NOT NULL,
	"er_flervalg" boolean NOT NULL,
	"alternativer" text[],
	"riktig_svar" text NOT NULL,
	"kildeavsnitt_id" uuid NOT NULL,
	CONSTRAINT "quizsporsmal_nummer_unik" UNIQUE("quiz_id","nummer")
);
--> statement-breakpoint
CREATE TABLE "samtalerunde" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fagsamtale_id" uuid NOT NULL,
	"nummer" integer NOT NULL,
	"sporsmal" text NOT NULL,
	"kildeavsnitt_id" uuid NOT NULL,
	"maal" "oppfoelgingsmaal" NOT NULL,
	"elevsvar" text,
	"svarvurdering" "svartilstand",
	"vurderingsbegrunnelse" text,
	"revurdert" boolean DEFAULT false NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "samtalerunde_nummer_unik" UNIQUE("fagsamtale_id","nummer")
);
--> statement-breakpoint
CREATE TABLE "tekst" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"konto_id" uuid NOT NULL,
	"tittel" text NOT NULL,
	"raatekst" text NOT NULL,
	"redigert_tekst" text NOT NULL,
	"tilstand" "tekst_tilstand" DEFAULT 'innlest' NOT NULL,
	"vei" "innlesingsvei" NOT NULL,
	"forkunnskapssvar" text,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL,
	"laast_tidspunkt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "avsnitt" ADD CONSTRAINT "avsnitt_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "begrep" ADD CONSTRAINT "begrep_begrepssett_id_begrepssett_id_fk" FOREIGN KEY ("begrepssett_id") REFERENCES "public"."begrepssett"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "begrep" ADD CONSTRAINT "begrep_kildeavsnitt_id_avsnitt_id_fk" FOREIGN KEY ("kildeavsnitt_id") REFERENCES "public"."avsnitt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "begrepssett" ADD CONSTRAINT "begrepssett_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fagsamtale" ADD CONSTRAINT "fagsamtale_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forekomst" ADD CONSTRAINT "forekomst_begrep_id_begrep_id_fk" FOREIGN KEY ("begrep_id") REFERENCES "public"."begrep"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forekomst" ADD CONSTRAINT "forekomst_avsnitt_id_avsnitt_id_fk" FOREIGN KEY ("avsnitt_id") REFERENCES "public"."avsnitt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "minnevers" ADD CONSTRAINT "minnevers_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizforsoek" ADD CONSTRAINT "quizforsoek_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizsporsmal" ADD CONSTRAINT "quizsporsmal_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizsporsmal" ADD CONSTRAINT "quizsporsmal_kildeavsnitt_id_avsnitt_id_fk" FOREIGN KEY ("kildeavsnitt_id") REFERENCES "public"."avsnitt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "samtalerunde" ADD CONSTRAINT "samtalerunde_fagsamtale_id_fagsamtale_id_fk" FOREIGN KEY ("fagsamtale_id") REFERENCES "public"."fagsamtale"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "samtalerunde" ADD CONSTRAINT "samtalerunde_kildeavsnitt_id_avsnitt_id_fk" FOREIGN KEY ("kildeavsnitt_id") REFERENCES "public"."avsnitt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "avsnitt_tekst_idx" ON "avsnitt" USING btree ("tekst_id");--> statement-breakpoint
CREATE INDEX "begrep_begrepssett_idx" ON "begrep" USING btree ("begrepssett_id");--> statement-breakpoint
CREATE INDEX "fagsamtale_tekst_idx" ON "fagsamtale" USING btree ("tekst_id");--> statement-breakpoint
CREATE INDEX "forekomst_avsnitt_idx" ON "forekomst" USING btree ("avsnitt_id");--> statement-breakpoint
CREATE INDEX "minnevers_tekst_idx" ON "minnevers" USING btree ("tekst_id");--> statement-breakpoint
CREATE INDEX "quizforsoek_quiz_idx" ON "quizforsoek" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quizsporsmal_quiz_idx" ON "quizsporsmal" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "samtalerunde_fagsamtale_idx" ON "samtalerunde" USING btree ("fagsamtale_id");--> statement-breakpoint
CREATE INDEX "tekst_konto_idx" ON "tekst" USING btree ("konto_id");