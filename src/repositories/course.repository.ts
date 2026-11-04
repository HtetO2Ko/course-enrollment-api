import type { Prisma } from "../../prisma/generated/prisma/client";
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

  public async getAll(search?: string) {
    const where: Prisma.CourseWhereInput = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              code: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    return await prisma.course.findMany({
      where,
    });
  }
}
