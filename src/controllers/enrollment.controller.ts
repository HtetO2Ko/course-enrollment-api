import type { Request, Response } from "express";
import { sendResponse } from "../utils/response.util";
import { StatusCode } from "../types/response";
import { getErrorMessage } from "../utils/error";
import type { EnrollmentService } from "../services/enrollment.service";
import type { TCreateEnrollment } from "../types/enrollment";

export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  create = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Unauthorized!",
        });
      }

      const { batchid } = req.body;

      if (!batchid || typeof batchid !== "string") {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Batch ID is required.",
        });
      }

      const data: TCreateEnrollment = { batchid: batchid.trim() };

      const result = await this.enrollmentService.create(data, req.user);

      return sendResponse(res, {
        statusCode: StatusCode.CREATED,
        message: result.isWaiting
          ? "Batch is full. You have been added to the waiting list."
          : "Enrollment created successfully.",
        data: result,
      });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      if (errorMessage === "BATCH_NOT_FOUND") {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Batch not found.",
        });
      }

      if (errorMessage === "ALREADY_ENROLLED") {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "You have already enrolled in this batch.",
        });
      }

      // Prisma transaction serialization conflict
      if (error instanceof Error && "code" in error && error.code === "P2034") {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Enrollment conflict. Please try again.",
        });
      }

      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during enrollment creation.",
        error: process.env.NODE_ENV === "production" ? null : errorMessage,
      });
    }
  };

  getMyEnrollments = async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Unauthorized!",
        });
      }

      const result = await this.enrollmentService.getMyEnrollments(req.user);

      return sendResponse(res, {
        data: result,
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during enrollment retrieval.",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };
}
