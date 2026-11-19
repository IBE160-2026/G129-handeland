CREATE TABLE "vilkaarsbekreftelse" (
	"konto_id" uuid PRIMARY KEY NOT NULL,
	"versjon" text NOT NULL,
	"bekreftet" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vilkaarsbekreftelse" ADD CONSTRAINT "vilkaarsbekreftelse_konto_id_user_id_fk" FOREIGN KEY ("konto_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- Engangssletting (spec-vilkaar-og-aldersgrense, kodefunn 28): radene i
-- rate_limit hadde IP-adressen i klartekst i nøkkelen. Fra nå hashes nøkkelen
-- (data/auth.ts, rateLimit.customStorage). Radene er bare tellere med et
-- vindu på sekunder, så ingenting av verdi går tapt.
DELETE FROM "rate_limit";
