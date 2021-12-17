/*
  Warnings:

  - You are about to drop the `Media` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_userId_fkey";

-- DropForeignKey
ALTER TABLE "MediaRecord" DROP CONSTRAINT "MediaRecord_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaRecord" DROP CONSTRAINT "MediaRecord_podId_fkey";

-- DropTable
DROP TABLE "Media";

-- DropTable
DROP TABLE "MediaRecord";

-- CreateTable
CREATE TABLE "MediaItem" (
    "id" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "thumbnailUrl" TEXT NOT NULL DEFAULT E'',
    "type" TEXT NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT E'CREATED',
    "userId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaReference" (
    "id" SERIAL NOT NULL,
    "mediaId" TEXT NOT NULL,
    "podId" TEXT NOT NULL,

    CONSTRAINT "MediaReference_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaItem" ADD CONSTRAINT "MediaItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaReference" ADD CONSTRAINT "MediaReference_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaReference" ADD CONSTRAINT "MediaReference_podId_fkey" FOREIGN KEY ("podId") REFERENCES "Pod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
