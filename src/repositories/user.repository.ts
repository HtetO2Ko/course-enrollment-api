import { prisma } from "../utils/prisma";

const userSelect = {
  userid: true,
  username: true,
  fullname: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export class UserRepo {
  async getMe(userid: string) {
    return prisma.user.findUnique({
      where: { userid },
      select: userSelect,
    });
  }

  async updateMe(
    userid: string,
    data: {
      fullname?: string;
      phone?: string;
    },
  ) {
    return prisma.user.update({
      where: { userid },
      data,
      select: userSelect,
    });
  }
}
