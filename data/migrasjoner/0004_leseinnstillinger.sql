CREATE TABLE "leseinnstillinger" (
	"konto_id" uuid PRIMARY KEY NOT NULL,
	"tekststorrelse" text NOT NULL,
	"linjeavstand" text NOT NULL,
	"endret" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leseinnstillinger" ADD CONSTRAINT "leseinnstillinger_konto_id_user_id_fk" FOREIGN KEY ("konto_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;