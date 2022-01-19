/*
  Warnings:

  - You are about to alter the column `size` on the `Video` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "size" SET DEFAULT 0,
ALTER COLUMN "size" SET DATA TYPE INTEGER;
