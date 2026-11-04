-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "Image" (
    "imageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "Course" (
    "courseid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "fees" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "outlines" TEXT NOT NULL,
    "prerequisite" TEXT NOT NULL,
    "createdby" TEXT NOT NULL,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("courseid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Course_imageId_key" ON "Course"("imageId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_createdby_fkey" FOREIGN KEY ("createdby") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("imageId") ON DELETE SET NULL ON UPDATE CASCADE;
