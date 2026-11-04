import type { Prisma } from "../../prisma/generated/prisma/client";
import type { UserJwtPayload } from "../types/auth";
import type { TCreateCourse, TUpdateCourse } from "../types/course";
import { prisma } from "../utils/prisma";

export class CourseRepo {
  public async create(courseData: TCreateCourse, reqUser: UserJwtPayload) {
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

  public async update(data: TUpdateCourse, courseid: string) {
    return await prisma.course.update({
      where: {
        courseid,
      },
      data,
    });
  }

  public async delete(courseid: string) {
    return await prisma.course.delete({
      where: {
        courseid,
      },
    });
  }
}
