-- CreateEnum
CREATE TYPE "RenditionStatus" AS ENUM ('QUEUED', 'PROCESSING', 'FAILED', 'COMPLETED');

-- DropIndex
DROP INDEX "Upload_storageKey_key";

-- DropIndex
DROP INDEX "Video_storageKey_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "username" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "uploadId" INTEGER;

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL DEFAULT '0.0.0.0',
    "userAgent" TEXT NOT NULL DEFAULT 'Unknown',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoRendition" (
    "id" SERIAL NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "status" "RenditionStatus" NOT NULL DEFAULT 'QUEUED',
    "videoId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VideoRendition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoRendition" ADD CONSTRAINT "VideoRendition_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
