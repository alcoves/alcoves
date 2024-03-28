-- AlterTable
ALTER TABLE "UserSession" ADD COLUMN     "userAgent" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "ip" SET DEFAULT '';
