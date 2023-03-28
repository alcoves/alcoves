/*
  Warnings:

  - The `roles` column on the `Membership` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AlcoveRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "roles",
ADD COLUMN     "roles" "AlcoveRole"[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "UserRole"[];

-- DropEnum
DROP TYPE "Role";
