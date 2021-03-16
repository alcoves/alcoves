/*
  Warnings:

  - You are about to alter the column `source_segments_count` on the `videos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - Made the column `created_at` on table `video_views` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `video_views` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `video_id` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `status` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `title` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `views` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `visibility` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `source_segments_count` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `percent_completed` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `videos` required. The migration will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `videos` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "video_views" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "video_id" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "duration" SET DEFAULT 0.0,
ALTER COLUMN "views" SET NOT NULL,
ALTER COLUMN "visibility" SET NOT NULL,
ALTER COLUMN "source_segments_count" SET NOT NULL,
ALTER COLUMN "source_segments_count" SET DEFAULT 0,
ALTER COLUMN "source_segments_count" SET DATA TYPE INTEGER,
ALTER COLUMN "percent_completed" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
