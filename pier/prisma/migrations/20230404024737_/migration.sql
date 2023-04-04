/*
  Warnings:

  - You are about to drop the column `alcoveId` on the `Media` table. All the data in the column will be lost.
  - The `roles` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Membership` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_alcoveId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_alcoveId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_alcoveId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_alcoveId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "alcoveId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "roles" "Role"[];

-- DropTable
DROP TABLE "Invitation";

-- DropTable
DROP TABLE "Membership";

-- DropTable
DROP TABLE "Tag";

-- DropEnum
DROP TYPE "AlcoveRole";

-- DropEnum
DROP TYPE "UserRole";
