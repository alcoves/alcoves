-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('UPLOADING', 'PROCESSING', 'READY');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "status" "MediaStatus" NOT NULL DEFAULT E'UPLOADING';
