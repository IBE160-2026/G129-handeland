CREATE TABLE "forbruk" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL,
	"konto_id" uuid,
	"hendelse" text,
	"oppgave" text NOT NULL,
	"modell" text NOT NULL,
	"tokens_inn" integer NOT NULL,
	"tokens_ut" integer NOT NULL,
	"mikrodollar" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX "forbruk_opprettet_idx" ON "forbruk" USING btree ("opprettet");--> statement-breakpoint
CREATE INDEX "forbruk_konto_hendelse_idx" ON "forbruk" USING btree ("konto_id","hendelse","opprettet");