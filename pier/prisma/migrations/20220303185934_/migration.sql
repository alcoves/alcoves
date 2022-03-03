/*
  Warnings:

  - You are about to drop the column `shortId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailFilename` on the `Video` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Video_shortId_key";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "shortId",
DROP COLUMN "thumbnailFilename",
ADD COLUMN     "cdnUrl" TEXT NOT NULL DEFAULT E'';
