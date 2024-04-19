/*
  Warnings:

  - You are about to drop the column `storageId` on the `Video` table. All the data in the column will be lost.
  - Added the required column `storageBucket` to the `Video` table without a default value. This is not possible if the table is not empty.
  - The required column `storageKey` was added to the `Video` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "storageId",
ADD COLUMN     "storageBucket" TEXT NOT NULL,
ADD COLUMN     "storageKey" TEXT NOT NULL;
