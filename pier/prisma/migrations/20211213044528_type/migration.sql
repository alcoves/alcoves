/*
  Warnings:

  - You are about to drop the column `mimeType` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `originalUrl` on the `Media` table. All the data in the column will be lost.
  - Added the required column `type` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "mimeType",
DROP COLUMN "originalUrl",
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
