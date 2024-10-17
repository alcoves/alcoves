CREATE TYPE "public"."status" AS ENUM('UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'ERROR');--> statement-breakpoint
ALTER TABLE "assets" RENAME COLUMN "content_type" TO "mime_type";