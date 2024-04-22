ALTER TABLE "alcove_memberships" RENAME COLUMN "user_roles" TO "role";--> statement-breakpoint
ALTER TABLE "uploads" RENAME COLUMN "upload_status_enum" TO "status";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "user_roles" TO "role";--> statement-breakpoint
ALTER TABLE "video_renditions" RENAME COLUMN "rendition_status_enum" TO "status";