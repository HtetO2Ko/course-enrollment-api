import type { BatchRepo } from "../repositories/batch.repository";
import type { UserJwtPayload } from "../types/auth";
import type { BatchFilterQuery, TCreateBatch } from "../types/batch";

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
}
