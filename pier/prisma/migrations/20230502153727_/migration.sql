/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "hash" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Video_hash_key" ON "Video"("hash");
