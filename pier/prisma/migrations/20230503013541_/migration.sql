-- DropIndex
DROP INDEX "Video_location_key";

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "location" DROP NOT NULL;
