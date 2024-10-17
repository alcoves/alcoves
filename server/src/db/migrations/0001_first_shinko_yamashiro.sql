ALTER TABLE "assets" RENAME COLUMN "user_id" TO "owner_id";--> statement-breakpoint
ALTER TABLE "assets" DROP CONSTRAINT "assets_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "assets" ALTER COLUMN "owner_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" DROP NOT NULL;