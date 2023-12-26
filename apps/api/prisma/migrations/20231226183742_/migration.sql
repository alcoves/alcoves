-- DropForeignKey
ALTER TABLE "Storyboard" DROP CONSTRAINT "Storyboard_assetId_fkey";

-- AddForeignKey
ALTER TABLE "Storyboard" ADD CONSTRAINT "Storyboard_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
