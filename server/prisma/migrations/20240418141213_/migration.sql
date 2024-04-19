/*
  Warnings:

  - Added the required column `contentType` to the `Upload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "contentType" TEXT NOT NULL;
