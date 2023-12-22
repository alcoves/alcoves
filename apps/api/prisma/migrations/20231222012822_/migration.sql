-- CreateEnum
CREATE TYPE "RenditionStatus" AS ENUM ('CREATED', 'INGESTING', 'PROCESSING', 'ERROR', 'READY');

-- CreateTable
CREATE TABLE "Rendition" (
    "id" TEXT NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "metadata" JSONB,
    "status" "RenditionStatus" NOT NULL DEFAULT 'CREATED',
    "assetId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rendition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rendition" ADD CONSTRAINT "Rendition_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
