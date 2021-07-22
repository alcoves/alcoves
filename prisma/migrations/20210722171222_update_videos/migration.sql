/*
  Warnings:

  - The primary key for the `videos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `video_id` on the `videos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_userId_fkey";

-- DropIndex
DROP INDEX "videos.video_id_unique";

-- DropIndex
DROP INDEX "videosVideoId";

-- AlterTable
ALTER TABLE "videos" DROP CONSTRAINT "videos_pkey",
DROP COLUMN "userId",
DROP COLUMN "video_id",
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "videos_id_seq";

-- CreateIndex
CREATE INDEX "videosUserId" ON "videos"("user_id");

-- AddForeignKey
ALTER TABLE "videos" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
