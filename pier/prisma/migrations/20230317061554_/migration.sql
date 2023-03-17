-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" "Role"[],
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
