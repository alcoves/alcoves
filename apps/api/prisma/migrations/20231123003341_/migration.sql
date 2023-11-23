-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('CREATED', 'INGESTING', 'PROCESSING', 'ERROR', 'READY');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "status" "AssetStatus" NOT NULL DEFAULT 'CREATED';
