ALTER TABLE "tekst" ADD COLUMN "overskrifter_godkjent" timestamp with time zone;--> statement-breakpoint
-- Tekster lest inn før fase 3a fantes, regnes som godkjent: ingen elev skal
-- sendes bakover i løypen av en ny funksjon.
UPDATE "tekst" SET "overskrifter_godkjent" = "opprettet";
