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

      const { batchCode, capacity, startDate, classDays, classTime, courseId } =
        req.body;

      if (
        !batchCode ||
        !capacity ||
        !startDate ||
        !classDays ||
        !classTime ||
        !courseId
      ) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message:
            "Missing parameters. batchCode, name, capacity, startDate, classDays, classTime, courseId are required.",
        });
      }

      const date = new Date(req.body.startDate);

      const data: TCreateBatch = {
        ...req.body,
        startDate: date,
      };

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

  get = async (req: Request, res: Response) => {
    try {
      const { search, startDate, courseid, page, limit } = req.query as {
        search?: string;
        startDate?: string;
        courseid?: string;
        page?: string;
        limit?: string;
      };

      const filters = {
        search,
        startDate,
        courseid,
      };

      const options = {
        page: page ? Number(page) : 1,
        perPage: limit ? Number(limit) : 10,
      };

      const result = await this.batchService.get(filters, options);

      return sendResponse(res, {
        data: result,
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during batch retrieval",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const batchid =
        typeof req.query.batchid === "string"
          ? req.query.batchid.trim()
          : undefined;

      if (!batchid) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Missing batch id.",
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

      const result = await this.batchService.update(data, batchid);

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
      const batchid =
        typeof req.query.batchid === "string"
          ? req.query.batchid.trim()
          : undefined;

      if (!batchid) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Missing batch id.",
        });
      }

      const result = await this.batchService.delete(batchid);

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

  getBatchesForUser = async (req: Request, res: Response) => {
    try {
      const status =
        typeof req.query.status === "string"
          ? req.query.status.trim()
          : undefined;

      if (!status) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Missing status.",
        });
      }

      const result = await this.batchService.getBatchesForUser(status);

      return sendResponse(res, {
        data: result,
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during batch retrieval",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };

  getBatchByID = async (req: Request, res: Response) => {
    try {
      const id =
        typeof req.query.id === "string" ? req.query.id.trim() : undefined;

      if (!id) {
        return sendResponse(res, {
          statusCode: StatusCode.BAD_REQUEST,
          success: false,
          message: "Missing id.",
        });
      }

      const result = await this.batchService.getBatchByID(id);

      return sendResponse(res, {
        data: result,
      });
    } catch (error: unknown) {
      return sendResponse(res, {
        statusCode: StatusCode.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Internal Server Error during batch retrieval",
        error:
          process.env.NODE_ENV === "production" ? null : getErrorMessage(error),
      });
    }
  };
}
