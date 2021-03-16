/*
  Warnings:

  - You are about to alter the column `user_id` on the `videos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `views` on the `videos` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "user_id" SET DATA TYPE INTEGER,
ALTER COLUMN "views" SET DEFAULT 0,
ALTER COLUMN "views" SET DATA TYPE INTEGER;
