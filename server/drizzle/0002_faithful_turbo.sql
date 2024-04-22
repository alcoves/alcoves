ALTER TABLE "uploads" ADD COLUMN "storage_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "video_renditions" ADD COLUMN "storage_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "videos" ADD COLUMN "storage_key" text NOT NULL;