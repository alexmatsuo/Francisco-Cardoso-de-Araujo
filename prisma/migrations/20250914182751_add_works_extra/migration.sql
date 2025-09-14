/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `works` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."works" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "imageFileName" TEXT,
ADD COLUMN     "information" TEXT,
ADD COLUMN     "programNotes" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "soundcloudUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "works_slug_key" ON "public"."works"("slug");
