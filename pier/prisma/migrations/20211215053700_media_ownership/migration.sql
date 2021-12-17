/*
  Warnings:

  - You are about to drop the column `podId` on the `Media` table. All the data in the column will be lost.
  - Changed the type of `role` on the `Membership` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_podId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "podId";

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateTable
CREATE TABLE "_MediaToPod" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToPod_AB_unique" ON "_MediaToPod"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToPod_B_index" ON "_MediaToPod"("B");

-- AddForeignKey
ALTER TABLE "_MediaToPod" ADD FOREIGN KEY ("A") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToPod" ADD FOREIGN KEY ("B") REFERENCES "Pod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
