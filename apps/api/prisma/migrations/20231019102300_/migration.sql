/*
  Warnings:

  - Added the required column `input` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "input" TEXT NOT NULL;
