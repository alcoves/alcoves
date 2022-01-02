/*
  Warnings:

  - You are about to drop the `MediaItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MediaReference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MediaItem" DROP CONSTRAINT "MediaItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "MediaReference" DROP CONSTRAINT "MediaReference_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "MediaReference" DROP CONSTRAINT "MediaReference_podId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_podId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropTable
DROP TABLE "MediaItem";

-- DropTable
DROP TABLE "MediaReference";

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "Pod";

-- DropEnum
DROP TYPE "Role";
