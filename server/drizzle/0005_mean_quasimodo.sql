ALTER TABLE "uploads" ADD COLUMN "alcove_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "uploads" ADD CONSTRAINT "uploads_alcove_id_alcoves_id_fk" FOREIGN KEY ("alcove_id") REFERENCES "alcoves"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
