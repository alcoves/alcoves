/*
  Warnings:

  - The primary key for the `Media` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "MediaOnPods" DROP CONSTRAINT "MediaOnPods_mediaId_fkey";

-- AlterTable
ALTER TABLE "Media" DROP CONSTRAINT "Media_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Media_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Media_id_seq";

-- AlterTable
ALTER TABLE "MediaOnPods" ALTER COLUMN "mediaId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "MediaOnPods" ADD CONSTRAINT "MediaOnPods_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
