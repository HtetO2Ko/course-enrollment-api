import { Prisma } from "../../prisma/generated/prisma/client";
import type { TCreateEnrollment } from "../types/enrollment";
import type { UserJwtPayload } from "../types/auth";
import { prisma } from "../utils/prisma";

export class EnrollmentRepo {
  public async create(
    enrollmentData: TCreateEnrollment,
    reqUser: UserJwtPayload,
  ) {
    const { batchid, isWaiting } = enrollmentData;
    const enrolledBy = reqUser.userid;

    return await prisma.$transaction(
      async (tx) => {
        const batch = await tx.batch.findUnique({
          where: { batchid },
          select: {
            batchid: true,
            capacity: true,
          },
        });

        if (!batch) {
          throw new Error("BATCH_NOT_FOUND");
        }

        const existingEnrollment = await tx.enrollment.findUnique({
          where: {
            batchid_enrolledBy: {
              batchid,
              enrolledBy,
            },
          },
        });

        if (existingEnrollment) {
          throw new Error("ALREADY_ENROLLED");
        }

        const enrollmentCount = await tx.enrollment.count({
          where: { batchid },
        });

        // Never allow a normal enrollment when the batch is full.
        const actualWaitingStatus =
          isWaiting || enrollmentCount >= batch.capacity;

        return await tx.enrollment.create({
          data: {
            batchid,
            enrolledBy,
            isWaiting: actualWaitingStatus,
          },
        });
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  public async getMyEnrollments(reqUser: UserJwtPayload) {
    return await prisma.enrollment.findMany({
      where: {
        enrolledBy: reqUser.userid,
      },
      include: {
        batch: {
          include: {
            course: {
              select: {
                courseid: true,
                title: true,
                imageURL: true,
                level: true,
                fees: true,
                duration: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
