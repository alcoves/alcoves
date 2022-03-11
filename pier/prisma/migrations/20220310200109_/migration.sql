/*
  Warnings:

  - A unique constraint covering the columns `[id,createdAt]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_id_createdAt_key" ON "Video"("id", "createdAt");
