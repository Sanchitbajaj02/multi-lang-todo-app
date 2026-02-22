import { Response } from "express";
import { inject } from "tsyringe";
import { TOKENS } from "@/container/tokens";
import type { ILoggerService } from "@/logger/logger.service";
import type { IResponseFactory } from "@/factories/response.factory";
import { StatusCodes } from "http-status-codes";

export abstract class BaseController {
  constructor(
    @inject(TOKENS.Logger) protected logger: ILoggerService,
    @inject(TOKENS.ResponseFactory) protected responseFactory: IResponseFactory
  ) {}

  protected sendSuccess<T>(res: Response, data: T, message?: string, statusCode?: StatusCodes): Response {
    const response = this.responseFactory.success(data, message, statusCode);
    return res.status(response.statusCode).json(response);
  }

  protected sendCreated<T>(res: Response, data: T, message?: string): Response {
    const response = this.responseFactory.created(data, message);
    return res.status(response.statusCode).json(response);
  }

  protected sendPaginated<T>(res: Response, data: T[], total: number, page: number, limit: number): Response {
    const response = this.responseFactory.paginated(data, total, page, limit);
    return res.status(response.statusCode).json(response);
  }

  protected sendError(res: Response, message: string, statusCode?: StatusCodes, errors?: unknown[]): Response {
    const response = this.responseFactory.error(message, statusCode, errors);
    return res.status(response.statusCode).json(response);
  }

  protected sendNoContent(res: Response): Response {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
}
