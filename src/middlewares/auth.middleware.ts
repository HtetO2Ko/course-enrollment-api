import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/response.util";
import { StatusCode } from "../types/response";
import type { UserJwtPayload } from "../types/auth";
import { getErrorMessage } from "../utils/error";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return sendResponse(res, {
      statusCode: StatusCode.FORBIDDEN,
      success: false,
      message: "Access Denied: No authentication token provided",
    });
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET environment variable is missing");
    }

    const decoded = jwt.verify(token, secret) as UserJwtPayload;
    req.user = decoded;

    return next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      return sendResponse(res, {
        statusCode: StatusCode.UNAUTHORIZED,
        success: false,
        message: "Session expired: Please authenticate again",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return sendResponse(res, {
        statusCode: StatusCode.FORBIDDEN,
        success: false,
        message: "Access Denied: Invalid authentication token",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }

    return sendResponse(res, {
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Internal Server Error",
      error:
        process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
    });
  }
};

export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return sendResponse(res, {
        statusCode: StatusCode.FORBIDDEN,
        success: false,
        message:
          "Access Denied: You do not have permission to execute this action.",
      });
    }

    return next();
  };
};
