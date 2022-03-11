/*
  Warnings:

  - You are about to drop the column `cursor` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,createdAt]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Video_createdAt_id_key";

-- DropIndex
DROP INDEX "Video_cursor_key";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "cursor";

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_createdAt_key" ON "Video"("id", "createdAt");
