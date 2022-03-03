/*
  Warnings:

  - You are about to drop the column `libraryId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `Library` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pod` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoOnPod` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shortId]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - The required column `shortId` was added to the `Video` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MediaStatus" ADD VALUE 'UPLOADED';
ALTER TYPE "MediaStatus" ADD VALUE 'UPLOADING';

-- DropForeignKey
ALTER TABLE "Library" DROP CONSTRAINT "Library_userId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_podId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_libraryId_fkey";

-- DropForeignKey
ALTER TABLE "VideoOnPod" DROP CONSTRAINT "VideoOnPod_podId_fkey";

-- DropForeignKey
ALTER TABLE "VideoOnPod" DROP CONSTRAINT "VideoOnPod_videoId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "libraryId",
ADD COLUMN     "shortId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Library";

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "Pod";

-- DropTable
DROP TABLE "VideoOnPod";

-- DropEnum
DROP TYPE "PodRole";

-- CreateIndex
CREATE UNIQUE INDEX "Video_shortId_key" ON "Video"("shortId");
