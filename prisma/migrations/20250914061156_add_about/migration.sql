/*
  Warnings:

  - You are about to drop the column `pdfData` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `pdfFileName` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `pdfMimeType` on the `works` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."works" DROP COLUMN "pdfData",
DROP COLUMN "pdfFileName",
DROP COLUMN "pdfMimeType";

-- CreateTable
CREATE TABLE "public"."about" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_pkey" PRIMARY KEY ("id")
);
