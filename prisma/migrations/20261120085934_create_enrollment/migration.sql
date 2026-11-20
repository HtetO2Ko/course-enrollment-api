-- CreateTable
CREATE TABLE "Enrollment" (
    "enrollmentid" TEXT NOT NULL,
    "isWaiting" BOOLEAN NOT NULL DEFAULT false,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "batchid" TEXT NOT NULL,
    "enrolledBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("enrollmentid")
);

-- CreateIndex
CREATE INDEX "Enrollment_enrolledBy_idx" ON "Enrollment"("enrolledBy");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_batchid_enrolledBy_key" ON "Enrollment"("batchid", "enrolledBy");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_batchid_fkey" FOREIGN KEY ("batchid") REFERENCES "Batch"("batchid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_enrolledBy_fkey" FOREIGN KEY ("enrolledBy") REFERENCES "User"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
