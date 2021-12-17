/*
  Warnings:

  - You are about to drop the `_MediaToPod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MediaToPod" DROP CONSTRAINT "_MediaToPod_A_fkey";

-- DropForeignKey
ALTER TABLE "_MediaToPod" DROP CONSTRAINT "_MediaToPod_B_fkey";

-- DropTable
DROP TABLE "_MediaToPod";

-- CreateTable
CREATE TABLE "MediaOnPods" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "podId" TEXT NOT NULL,

    CONSTRAINT "MediaOnPods_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaOnPods" ADD CONSTRAINT "MediaOnPods_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaOnPods" ADD CONSTRAINT "MediaOnPods_podId_fkey" FOREIGN KEY ("podId") REFERENCES "Pod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
