import type { BatchRepo } from "../repositories/batch.repository";
import type { UserJwtPayload } from "../types/auth";
import type { BatchFilterQuery, TCreateBatch, TUpdateBatch } from "../types/batch";

export class BatchService {
  constructor(private batchRepo: BatchRepo) {
    this.batchRepo = batchRepo;
  }

  public async create(data: TCreateBatch, reqUser: UserJwtPayload) {
    const create = await this.batchRepo.create(data, reqUser);
    return create;
  }

  public async get(
    filters: BatchFilterQuery,
    options: { page?: number; perPage?: number },
  ) {
    return await this.batchRepo.get(filters, options);
  }

  public async update(data: TUpdateBatch, courseid: string) {
    return await this.batchRepo.update(data, courseid);
  }

  public async delete(courseid: string) {
    return await this.batchRepo.delete(courseid);
  }
}
