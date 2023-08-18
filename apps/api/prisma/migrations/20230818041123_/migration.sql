/*
  Warnings:

  - You are about to drop the column `state` on the `Videos` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('QUEUING', 'DOWNLOADING', 'PROCESSING', 'FAILED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Videos" DROP COLUMN "state",
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'QUEUING';
