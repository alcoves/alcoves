/*
  Warnings:

  - The values [UPLOADING] on the enum `MediaStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `optimizedUrl` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `sourceUrl` on the `Media` table. All the data in the column will be lost.
  - Added the required column `url` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Made the column `duration` on table `Media` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thumbnailUrl` on table `Media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MediaStatus_new" AS ENUM ('CREATED', 'PROCESSING', 'READY', 'ERROR');
ALTER TABLE "Media" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Media" ALTER COLUMN "status" TYPE "MediaStatus_new" USING ("status"::text::"MediaStatus_new");
ALTER TYPE "MediaStatus" RENAME TO "MediaStatus_old";
ALTER TYPE "MediaStatus_new" RENAME TO "MediaStatus";
DROP TYPE "MediaStatus_old";
ALTER TABLE "Media" ALTER COLUMN "status" SET DEFAULT 'CREATED';
COMMIT;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "optimizedUrl",
DROP COLUMN "sourceUrl",
ADD COLUMN     "url" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT E'CREATED',
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "duration" SET DEFAULT 0,
ALTER COLUMN "thumbnailUrl" SET NOT NULL,
ALTER COLUMN "thumbnailUrl" SET DEFAULT E'';
