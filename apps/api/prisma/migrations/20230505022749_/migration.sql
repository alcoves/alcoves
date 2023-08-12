/*
  Warnings:

  - You are about to drop the column `hash` on the `ImageFile` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `VideoFile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImageFile" DROP COLUMN "hash";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "duration",
DROP COLUMN "hash",
DROP COLUMN "location",
DROP COLUMN "size";

-- AlterTable
ALTER TABLE "VideoFile" DROP COLUMN "hash",
ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL DEFAULT 0;
