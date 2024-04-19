-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'FAILED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "status" "UploadStatus" NOT NULL DEFAULT 'PENDING';
