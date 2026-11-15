import type { Request, Response } from "express";
import { sendResponse } from "../utils/response.util";
import { StatusCode } from "../types/response";
import { getErrorMessage } from "../utils/error";
import type { CourseService } from "../services/course.service";
import type { TCreateCourse } from "../types/course";

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

      const data: TCreateCourse = req.body;

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

  getAll = async (req: Request, res: Response) => {
    try {
      const search =
        typeof req.query.search === "string"
          ? req.query.search.trim()
          : undefined;

      const result = await this.courseService.getAll(search);

      return sendResponse(res, {
        data: result,
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during course retrieval",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const courseid =
        typeof req.query.courseid === "string"
          ? req.query.courseid.trim()
          : undefined;

      if (!courseid) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Missing course id.",
        });
      }

      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "At least one field is required to update.",
        });
      }

      const result = await this.courseService.update(data, courseid);

      return sendResponse(res, {
        data: result,
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during course update",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const courseid =
        typeof req.query.courseid === "string"
          ? req.query.courseid.trim()
          : undefined;

      if (!courseid) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Missing course id.",
        });
      }

      const result = await this.courseService.delete(courseid);

      return sendResponse(res, {
        data: result,
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during course update",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };
}
