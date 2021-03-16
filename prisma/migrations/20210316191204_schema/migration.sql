-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "source_segments_count" DROP NOT NULL,
ALTER COLUMN "percent_completed" DROP NOT NULL;
