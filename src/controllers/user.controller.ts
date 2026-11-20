import type { Request, Response } from "express";
import { sendResponse } from "../utils/response.util";
import { StatusCode } from "../types/response";
import { getErrorMessage } from "../utils/error";
import type { UserService } from "../services/user.service";

export class UserController {
  constructor(private userService: UserService) {}

  getMe = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendResponse(res, {
          statusCode: StatusCode.UNAUTHORIZED,
          success: false,
          message: "Unauthorized.",
        });
      }

      const result = await this.userService.getMe(req.user.userid);

      return sendResponse(res, { data: result });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to retrieve user profile.",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };

  updateMe = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendResponse(res, {
          statusCode: StatusCode.UNAUTHORIZED,
          success: false,
          message: "Unauthorized.",
        });
      }

      const { fullname, phone } = req.body;

      if (
        (fullname !== undefined &&
          (typeof fullname !== "string" || !fullname.trim())) ||
        (phone !== undefined && (typeof phone !== "string" || !phone.trim()))
      ) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Invalid profile information.",
        });
      }

      if (fullname === undefined && phone === undefined) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "At least one field is required.",
        });
      }

      const result = await this.userService.updateMe(req.user.userid, {
        ...(fullname !== undefined && { fullname: fullname.trim() }),
        ...(phone !== undefined && { phone: phone.trim() }),
      });

      return sendResponse(res, {
        data: result,
        message: "Profile updated successfully.",
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Failed to update profile.",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };
}
