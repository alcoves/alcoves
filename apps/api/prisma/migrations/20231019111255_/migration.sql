/*
  Warnings:

  - Added the required column `content_type` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "content_type" TEXT NOT NULL,
ALTER COLUMN "name" SET DEFAULT '';
