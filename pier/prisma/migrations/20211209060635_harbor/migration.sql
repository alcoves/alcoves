/*
  Warnings:

  - You are about to drop the column `harbourId` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `harbourId` on the `Membership` table. All the data in the column will be lost.
  - You are about to drop the `Harbour` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `harborId` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `harborId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_harbourId_fkey";

-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_harbourId_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "harbourId",
ADD COLUMN     "harborId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Membership" DROP COLUMN "harbourId",
ADD COLUMN     "harborId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Harbour";

-- CreateTable
CREATE TABLE "Harbor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Harbor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_harborId_fkey" FOREIGN KEY ("harborId") REFERENCES "Harbor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_harborId_fkey" FOREIGN KEY ("harborId") REFERENCES "Harbor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
