import type { CourseRepo } from "../repositories/course.repository";
import type { UserJwtPayload } from "../types/auth";
import type { TCourse } from "../types/course";

export class CourseService {
  constructor(private courseRepo: CourseRepo) {
    this.courseRepo = courseRepo;
  }

  public async create(data: TCourse, reqUser: UserJwtPayload) {
    const create = await this.courseRepo.create(data, reqUser);
    return create;
  }

  public async getAll(search?: string) {
    return await this.courseRepo.getAll(search);
  }
}
