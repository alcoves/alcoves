/*
  Warnings:

  - You are about to drop the column `content_type` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `storage_bucket` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `storage_key` on the `Image` table. All the data in the column will be lost.
  - Added the required column `contentType` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageBucket` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageKey` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "content_type",
DROP COLUMN "storage_bucket",
DROP COLUMN "storage_key",
ADD COLUMN     "contentType" TEXT NOT NULL,
ADD COLUMN     "storageBucket" TEXT NOT NULL,
ADD COLUMN     "storageKey" TEXT NOT NULL;
