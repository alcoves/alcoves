/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Video_id_createdAt_key";

-- CreateIndex
CREATE UNIQUE INDEX "Video_createdAt_id_key" ON "Video"("createdAt", "id");
