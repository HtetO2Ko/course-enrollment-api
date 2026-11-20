import type { EnrollmentRepo } from "../repositories/enrollment.repository";
import type { UserJwtPayload } from "../types/auth";
import type { TCreateEnrollment } from "../types/enrollment";

export class EnrollmentService {
  constructor(private enrollmentRepo: EnrollmentRepo) {}

  public async create(data: TCreateEnrollment, reqUser: UserJwtPayload) {
    return await this.enrollmentRepo.create(data, reqUser);
  }

  public async getMyEnrollments(reqUser: UserJwtPayload) {
    return await this.enrollmentRepo.getMyEnrollments(reqUser);
  }
}
