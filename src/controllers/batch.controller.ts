import type { Request, Response } from "express";
import { sendResponse } from "../utils/response.util";
import { StatusCode } from "../types/response";
import { getErrorMessage } from "../utils/error";
import type { BatchService } from "../services/batch.service";
import type { TCreateBatch } from "../types/batch";

export class BatchController {
  constructor(private batchService: BatchService) {}

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
        name,
        capacity,
        startDate,
        endDate,
        classDays,
        classTime,
        timezone,
        courseId,
      } = req.body;

      if (
        !name ||
        !capacity ||
        !startDate ||
        !endDate ||
        !classDays ||
        !classTime ||
        !timezone ||
        !courseId
      ) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message:
            "Missing parameters. name, capacity, startDate, endDate, classDays, classTime, timezone, courseId are required.",
        });
      }

      const data: TCreateBatch = req.body;

      const result = await this.batchService.create(data, req.user);
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
