/*
  Warnings:

  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoView` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Video";

-- DropTable
DROP TABLE "VideoView";

-- CreateTable
CREATE TABLE "video_views" (
    "id" BIGSERIAL NOT NULL,
    "ip" TEXT,
    "video_id" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "video_id" TEXT,
    "status" TEXT DEFAULT E'queued',
    "title" TEXT DEFAULT E'new-upload',
    "duration" DECIMAL,
    "views" BIGINT DEFAULT 0,
    "visibility" TEXT DEFAULT E'unlisted',
    "thumbnail" TEXT,
    "hls_master_link" TEXT,
    "source_segments_count" BIGINT DEFAULT 0,
    "percent_completed" DECIMAL DEFAULT 0.000000,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "videos.video_id_unique" ON "videos"("video_id");
