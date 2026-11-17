/*
  Warnings:

  - Made the column `startDate` on table `Batch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Batch" ALTER COLUMN "startDate" SET NOT NULL,
ALTER COLUMN "startDate" SET DATA TYPE TEXT;
