-- CreateEnum
CREATE TYPE "StoryboardStatus" AS ENUM ('CREATED', 'PROCESSING', 'ERROR', 'READY');

-- CreateTable
CREATE TABLE "Storyboard" (
    "id" TEXT NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "filter" TEXT NOT NULL,
    "status" "StoryboardStatus" NOT NULL DEFAULT 'CREATED',
    "assetId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Storyboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Storyboard_assetId_key" ON "Storyboard"("assetId");

-- AddForeignKey
ALTER TABLE "Storyboard" ADD CONSTRAINT "Storyboard_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
