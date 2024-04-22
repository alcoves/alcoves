DO $$ BEGIN
 CREATE TYPE "alcove_roles" AS ENUM('OWNER', 'ADMIN', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TYPE "user_roles" ADD VALUE 'OWNER';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alcove_memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"alcove_id" integer NOT NULL,
	"user_roles" "alcove_roles" DEFAULT 'USER' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alcoves" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "alcoves_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "videos" ADD CONSTRAINT "videos_alcoves_id_alcoves_id_fk" FOREIGN KEY ("alcoves_id") REFERENCES "alcoves"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alcove_memberships" ADD CONSTRAINT "alcove_memberships_alcove_id_alcoves_id_fk" FOREIGN KEY ("alcove_id") REFERENCES "alcoves"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
