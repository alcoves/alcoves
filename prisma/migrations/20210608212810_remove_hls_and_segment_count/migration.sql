/*
  Warnings:

  - You are about to drop the column `hls_master_link` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `source_segments_count` on the `videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "videos" DROP COLUMN "hls_master_link",
DROP COLUMN "source_segments_count";
