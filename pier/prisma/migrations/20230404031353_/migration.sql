/*
  Warnings:

  - You are about to drop the column `sourceId` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `roles` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_sourceId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "sourceId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roles",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
