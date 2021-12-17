/*
  Warnings:

  - You are about to drop the `MediaOnPods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MediaOnPods" DROP CONSTRAINT "MediaOnPods_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaOnPods" DROP CONSTRAINT "MediaOnPods_podId_fkey";

-- DropTable
DROP TABLE "MediaOnPods";

-- CreateTable
CREATE TABLE "MediaRecord" (
    "id" SERIAL NOT NULL,
    "mediaId" TEXT NOT NULL,
    "podId" TEXT NOT NULL,

    CONSTRAINT "MediaRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaRecord" ADD CONSTRAINT "MediaRecord_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaRecord" ADD CONSTRAINT "MediaRecord_podId_fkey" FOREIGN KEY ("podId") REFERENCES "Pod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
