import type { Prisma } from "../../prisma/generated/prisma/client";
import type { UserJwtPayload } from "../types/auth";
import type {
  BatchFilterQuery,
  TCreateBatch,
  TUpdateBatch,
} from "../types/batch";
import { paginate } from "../utils/paginate";
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
}
