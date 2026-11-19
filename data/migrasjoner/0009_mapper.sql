CREATE TYPE "public"."mappequiz_lengde" AS ENUM('kort', 'middels', 'alle');--> statement-breakpoint
CREATE TABLE "mappe" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"konto_id" uuid NOT NULL,
	"tittel" text NOT NULL,
	"opprettet" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mappe_tekst" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mappe_id" uuid NOT NULL,
	"tekst_id" uuid NOT NULL,
	"lagt_til" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mappe_tekst_unik" UNIQUE("mappe_id","tekst_id")
);
--> statement-breakpoint
CREATE TABLE "mappeforsoek" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mappe_id" uuid NOT NULL,
	"lengde" "mappequiz_lengde" NOT NULL,
	"svar" text NOT NULL,
	"antall_riktige" integer NOT NULL,
	"antall_totalt" integer NOT NULL,
	"gjennomfoert" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mappe" ADD CONSTRAINT "mappe_konto_id_user_id_fk" FOREIGN KEY ("konto_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mappe_tekst" ADD CONSTRAINT "mappe_tekst_mappe_id_mappe_id_fk" FOREIGN KEY ("mappe_id") REFERENCES "public"."mappe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mappe_tekst" ADD CONSTRAINT "mappe_tekst_tekst_id_tekst_id_fk" FOREIGN KEY ("tekst_id") REFERENCES "public"."tekst"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mappeforsoek" ADD CONSTRAINT "mappeforsoek_mappe_id_mappe_id_fk" FOREIGN KEY ("mappe_id") REFERENCES "public"."mappe"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "mappe_konto_idx" ON "mappe" USING btree ("konto_id");--> statement-breakpoint
CREATE INDEX "mappe_tekst_tekst_idx" ON "mappe_tekst" USING btree ("tekst_id");--> statement-breakpoint
CREATE INDEX "mappeforsoek_mappe_idx" ON "mappeforsoek" USING btree ("mappe_id");