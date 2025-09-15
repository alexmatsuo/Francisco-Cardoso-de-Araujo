/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `works` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."works" DROP COLUMN "videoUrl",
ADD COLUMN     "videoUrls" JSONB;
