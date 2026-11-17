/*
  Warnings:

  - You are about to drop the column `endDate` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `Batch` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageURL` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Course_imageId_key";

-- AlterTable
ALTER TABLE "Batch" DROP COLUMN "endDate",
DROP COLUMN "timezone";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "imageId",
ADD COLUMN     "imageURL" TEXT NOT NULL;

-- DropTable
DROP TABLE "Image";
