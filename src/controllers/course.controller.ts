import type { Request, Response } from "express";
import { sendResponse } from "../utils/response.util";
import { StatusCode } from "../types/response";
import { getErrorMessage } from "../utils/error";
import type { CourseService } from "../services/course.service";
import type { TCourse } from "../types/course";

export class CourseController {
  constructor(private courseService: CourseService) {}

  create = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Unauthorized!",
        });
      }

      const {
        title,
        level,
        description,
        code,
        fees,
        duration,
        outlines,
        prerequisite,
        imageId,
      } = req.body;

      if (
        !title ||
        !level ||
        !description ||
        !code ||
        !fees ||
        !duration ||
        !outlines ||
        !prerequisite ||
        !imageId
      ) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message:
            "Missing parameters. title, level, description, code, fees, duration, outlines, prerequisite, imageId are required.",
        });
      }

      const data: TCourse = req.body;

      const result = await this.courseService.create(data, req.user);
      return sendResponse(res, {
        statusCode: StatusCode.CREATED,
        data: result,
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during user creation",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };
}
