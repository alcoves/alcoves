/*
  Warnings:

  - Added the required column `harbourId` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "harbourId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_harbourId_fkey" FOREIGN KEY ("harbourId") REFERENCES "Harbour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
