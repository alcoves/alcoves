/*
  Warnings:

  - The primary key for the `video_views` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `video_id` on table `video_views` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "viewsCreatedAt";

-- AlterTable
ALTER TABLE "video_views" DROP CONSTRAINT "video_views_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "video_id" SET NOT NULL,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "video_views_id_seq";
