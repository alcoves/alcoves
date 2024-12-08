CREATE TABLE IF NOT EXISTS "asset_image_proxies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"size" integer NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"status" text,
	"storage_key" text NOT NULL,
	"storage_bucket" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asset_video_proxies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"type" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"status" text,
	"storage_key" text NOT NULL,
	"storage_bucket" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text,
	"metadata" jsonb,
	"size" integer NOT NULL,
	"storage_key" text NOT NULL,
	"storage_bucket" text NOT NULL,
	"mime_type" text NOT NULL,
	"trashed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"expires_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"avatar" text,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
