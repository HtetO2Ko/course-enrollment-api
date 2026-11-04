import type { Batch, Prisma } from "../../prisma/generated/prisma/client";
import type { UserJwtPayload } from "../types/auth";
import type {
  BatchFilterQuery,
  TCreateBatch,
  TUpdateBatch,
} from "../types/batch";
import { paginate, type PaginatedResult } from "../utils/paginate";
import { prisma } from "../utils/prisma";

export class BatchRepo {
  public async create(batchData: TCreateBatch, reqUser: UserJwtPayload) {
    const createdBy = reqUser.userid;

    const result = await prisma.batch.create({
      data: {
        ...batchData,
        createdBy,
      },
    });
    return result;
  }

  public async get(
    filters: BatchFilterQuery,
    options: { page?: number; perPage?: number },
  ) {
    const { search, startDate, courseid } = filters;

    const where: Prisma.BatchWhereInput = {};

    if (courseid) {
      where.courseId = courseid;
    }

    if (startDate) {
      where.startDate = {
        gte: new Date(startDate),
      };
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    return await paginate(
      prisma.batch,
      { where },
      options,
      { course: true },
      { startDate: "desc" },
    );
  }

  public async update(data: TUpdateBatch, batchid: string) {
    return await prisma.batch.update({
      where: {
        batchid,
      },
      data,
    });
  }

  public async delete(batchid: string) {
    return await prisma.batch.delete({
      where: {
        batchid,
      },
    });
  }

  public async getBatchesForUser(
    status: string,
  ): Promise<Batch[] | PaginatedResult<Batch>> {
    const where: Prisma.BatchWhereInput = {};
    const now = new Date();

    if (status === "upcoming") {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      where.startDate = {
        gte: tomorrow,
      };

      return await prisma.batch.findMany({
        where,
        include: { course: true },
        orderBy: { startDate: "asc" },
      });
    }

    if (status === "ongoing") {
      where.startDate = {
        lte: now,
      };
      where.endDate = {
        gte: now,
      };

      return await paginate(
        prisma.batch,
        { where },
        { page: 1, perPage: 5 },
        { course: true },
        { startDate: "desc" },
      );
    }

    throw new Error(
      "Invalid status provided. Must be 'upcoming' or 'ongoing'.",
    );
  }
}
