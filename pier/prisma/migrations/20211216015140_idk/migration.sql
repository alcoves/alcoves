/*
  Warnings:

  - The primary key for the `MediaOnPods` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MediaOnPods" DROP CONSTRAINT "MediaOnPods_pkey",
ADD CONSTRAINT "MediaOnPods_pkey" PRIMARY KEY ("mediaId", "podId");
