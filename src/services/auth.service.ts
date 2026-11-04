import type { AuthRepository } from "../repositories/auth.repository";
import type {
  LoginCredentials,
  AuthResponseData,
  UserJwtPayload,
  RegisterUserPayload,
} from "../types/auth";
import { StatusCode } from "../types/response";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { StringValue } from "ms";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  private generateTokens(payload: object) {
    const accessToken = jwt.sign(
      payload,
      String(process.env.ACCESS_TOKEN_SECRET),
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as StringValue,
      },
    );

    const refreshToken = jwt.sign(
      payload,
      String(process.env.REFRESH_TOKEN_SECRET),
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as StringValue,
      },
    );

    return { accessToken, refreshToken };
  }

  async register(payload: RegisterUserPayload): Promise<{
    statusCode: StatusCode;
    success: boolean;
    message: string;
    data?: AuthResponseData;
  }> {
    const existingUser = await this.authRepository.findExistingUser(
      payload.username,
      payload.phone,
    );

    if (existingUser) {
      const message =
        existingUser.username === payload.username
          ? "Username is already registered"
          : "Phone is already registered";

      return {
        statusCode: StatusCode.CONFLICT,
        success: false,
        message,
      };
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);

    const newUser = await this.authRepository.register({
      username: payload.username,
      phone: payload.phone,
      fullname: payload.fullname,
      password: hashedPassword,
      role: payload.role,
    });

    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!tokenSecret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is missing in environmental variables",
      );
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
      throw new Error(
        "REFRESH_TOKEN_SECRET is missing in environmental variables",
      );
    }

    const jwtPayload = {
      userid: newUser.userid,
      phone: newUser.phone,
      username: newUser.username,
      fullname: newUser.fullname,
      role: newUser.role,
    };
    const tokens = this.generateTokens(jwtPayload);
    return {
      statusCode: StatusCode.SUCCESS,
      success: true,
      message: "Register successful",
      data: {
        ...tokens,
        user: newUser,
      },
    };
  }

  async login({ identifier, password }: LoginCredentials): Promise<{
    statusCode: StatusCode;
    success: boolean;
    message: string;
    data?: AuthResponseData;
  }> {
    const user = await this.authRepository.findUserByIdentifier(identifier);
    if (!user) {
      return {
        statusCode: StatusCode.UNAUTHORIZED,
        success: false,
        message: "Invalid username or phone number",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: StatusCode.UNAUTHORIZED,
        success: false,
        message: "Invalid password",
      };
    }

    const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!tokenSecret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is missing in environmental variables",
      );
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
      throw new Error(
        "REFRESH_TOKEN_SECRET is missing in environmental variables",
      );
    }

    const payload = {
      userid: user.userid,
      phone: user.phone,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
    };
    const tokens = this.generateTokens(payload);

    return {
      statusCode: StatusCode.SUCCESS,
      success: true,
      message: "Login successful",
      data: {
        ...tokens,
        user: {
          userid: user.userid,
          username: user.username,
          fullname: user.fullname,
          role: user.role,
        },
      },
    };
  }

  async renewAccessToken(refreshToken: string): Promise<{
    statusCode: StatusCode;
    success: boolean;
    message: string;
    data?: { accessToken: string };
  }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as UserJwtPayload;

      const payload = {
        userid: decoded.userid,
        phone: decoded.phone,
        username: decoded.username,
        fullname: decoded.fullname,
        role: decoded.role,
      };

      const newAccessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY as StringValue,
        },
      );

      return {
        statusCode: StatusCode.SUCCESS,
        success: true,
        message: "Renew Access Token successfully",
        data: {
          accessToken: newAccessToken,
        },
      };
    } catch {
      return {
        statusCode: StatusCode.UNAUTHORIZED,
        success: false,
        message: "Invalid or expired refresh token",
      };
    }
  }

  async renewRefreshToken(refreshToken: string): Promise<{
    statusCode: StatusCode;
    success: boolean;
    message: string;
    data?: { refreshToken: string };
  }> {
    try {
      const decoded = jwt.decode(refreshToken) as UserJwtPayload;

      const payload = {
        userid: decoded.userid,
        phone: decoded.phone,
        username: decoded.username,
        fullname: decoded.fullname,
        role: decoded.role,
      };

      const newRefreshToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY as StringValue,
        },
      );

      return {
        statusCode: StatusCode.SUCCESS,
        success: true,
        message: "Renew Refresh Token successfully",
        data: {
          refreshToken: newRefreshToken,
        },
      };
    } catch {
      return {
        statusCode: StatusCode.UNAUTHORIZED,
        success: false,
        message: "Invalid or expired refresh token",
      };
    }
  }
}
