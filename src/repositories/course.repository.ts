import type { UserJwtPayload } from "../types/auth";
import type { TCourse } from "../types/course";
import { prisma } from "../utils/prisma";

export class CourseRepo {
  public async create(courseData: TCourse, reqUser: UserJwtPayload) {
    const createdby = reqUser.userid;

    const result = await prisma.course.create({
      data: {
        ...courseData,
        createdby,
      },
    });
    return result;
  }
}
