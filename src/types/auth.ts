import type { Role } from "../../prisma/generated/prisma/client";
import type { JwtPayload } from "jsonwebtoken";

export interface UserJwtPayload extends JwtPayload {
  userid: string;
  phone: string;
  username: string;
  fullname: string;
  role: Role;
}

export interface RegisterUserPayload {
  username: string;
  phone: string;
  fullname: string;
  password: string;
  role: Role;
}


export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    userid: string;
    username: string;
    fullname: string;
    role: Role;
  };
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserJwtPayload;
  }
}
