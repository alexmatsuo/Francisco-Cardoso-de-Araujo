-- AlterTable
ALTER TABLE "public"."works" ADD COLUMN     "pdfData" BYTEA,
ADD COLUMN     "pdfFileName" TEXT,
ADD COLUMN     "pdfMimeType" TEXT;
