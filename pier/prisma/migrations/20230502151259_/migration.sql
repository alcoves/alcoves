/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Video` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hash` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_hash_key" ON "Video"("hash");
