import type { UserJwtPayload } from "../types/auth";
import type { TCreateBatch } from "../types/batch";
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
}
