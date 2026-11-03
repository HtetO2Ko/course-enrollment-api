import { prisma } from "../utils/prisma";
import type { Prisma, User } from "../../prisma/generated/prisma/client";

export class AuthRepository {
  async findExistingUser(
    username: string,
    phone: string,
  ): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ username }, { phone }],
      },
    });
  }

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { phone: identifier }],
      },
    });
  }

  async register(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }
}
