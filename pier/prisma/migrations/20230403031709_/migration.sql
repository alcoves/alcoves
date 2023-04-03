/*
  Warnings:

  - Added the required column `name` to the `Alcove` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alcove" ADD COLUMN     "name" TEXT NOT NULL;
