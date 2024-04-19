/*
  Warnings:

  - A unique constraint covering the columns `[storageKey]` on the table `Upload` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storageKey]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Upload_storageKey_key" ON "Upload"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "Video_storageKey_key" ON "Video"("storageKey");
