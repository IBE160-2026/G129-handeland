CREATE TABLE "oppsummering" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tekst_id" uuid NOT NULL,
	"setninger" jsonb NOT NULL,
	"promptversjon" text NOT NULL,
	"modell" text NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "oppsummering_tekst_id_unique" UNIQUE("tekst_id")
);
--> statement-breakpoint
CREATE TABLE "oversettelse" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tekst_id" uuid NOT NULL,
	"spraak" text NOT NULL,
	"type" text NOT NULL,
	"kilde_hash" text NOT NULL,
	"innhold" jsonb NOT NULL,
	"promptversjon" text NOT NULL,
	"modell" text NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "oversettelse_unik" UNIQUE("tekst_id","spraak","type")
);
--> statement-breakpoint
CREATE TABLE "utpekingssett" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tekst_id" uuid NOT NULL,
	"uttrykk" jsonb NOT NULL,
	"promptversjon" text NOT NULL,
	"modell" text NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "utpekingssett_tekst_id_unique" UNIQUE("tekst_id")
);
--> statement-breakpoint
ALTER TABLE "oppsummering" ADD CONSTRAINT "oppsummering_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oversettelse" ADD CONSTRAINT "oversettelse_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "utpekingssett" ADD CONSTRAINT "utpekingssett_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;