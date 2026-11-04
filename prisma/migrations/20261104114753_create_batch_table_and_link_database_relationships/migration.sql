/*
  Warnings:

  - You are about to drop the column `createdby` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[createdBy]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdBy` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_createdby_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "createdby",
ADD COLUMN     "createdBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Batch" (
    "batchid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "classDays" "Weekday"[],
    "classTime" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Yangon',
    "courseId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("batchid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Batch_courseId_key" ON "Batch"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_createdBy_key" ON "Course"("createdBy");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("courseid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
