/*
  Warnings:

  - A unique constraint covering the columns `[batchCode]` on the table `Batch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batchCode` to the `Batch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "batchCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchCode_key" ON "Batch"("batchCode");
