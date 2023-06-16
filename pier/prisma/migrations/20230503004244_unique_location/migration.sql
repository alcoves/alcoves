/*
  Warnings:

  - A unique constraint covering the columns `[location]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_location_key" ON "Video"("location");
