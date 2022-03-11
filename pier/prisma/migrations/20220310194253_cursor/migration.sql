/*
  Warnings:

  - A unique constraint covering the columns `[cursor]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "cursor" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Video_cursor_key" ON "Video"("cursor");
