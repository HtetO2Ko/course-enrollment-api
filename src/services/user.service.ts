import type { UserRepo } from "../repositories/user.repository";

export class UserService {
  constructor(private userRepo: UserRepo) {}

  async getMe(userid: string) {
    const user = await this.userRepo.getMe(userid);

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }

  async updateMe(
    userid: string,
    data: {
      fullname?: string;
      phone?: string;
    },
  ) {
    return this.userRepo.updateMe(userid, data);
  }
}
