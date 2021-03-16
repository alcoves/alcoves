/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `video_views` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "video_views" DROP COLUMN "deleted_at";

-- CreateIndex
CREATE INDEX "ip" ON "video_views"("ip");

-- CreateIndex
CREATE INDEX "viewsUserId" ON "video_views"("user_id");

-- CreateIndex
CREATE INDEX "viewsVideoId" ON "video_views"("video_id");

-- CreateIndex
CREATE INDEX "visibility" ON "videos"("visibility");

-- CreateIndex
CREATE INDEX "videosVideoId" ON "videos"("video_id");
