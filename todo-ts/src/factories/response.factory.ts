import { injectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: unknown[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface IResponseFactory {
  success<T>(data: T, message?: string, statusCode?: StatusCodes): ApiResponse<T>;
  error(message: string, statusCode?: StatusCodes, errors?: unknown[]): ApiResponse;
  paginated<T>(data: T[], total: number, page: number, limit: number): ApiResponse<T[]>;
  created<T>(data: T, message?: string): ApiResponse<T>;
  noContent(): ApiResponse;
}

@injectable()
export class ResponseFactory implements IResponseFactory {
  success<T>(data: T, message: string = "Success", statusCode: StatusCodes = StatusCodes.OK): ApiResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  error(message: string, statusCode: StatusCodes = StatusCodes.BAD_REQUEST, errors: unknown[] = []): ApiResponse {
    return {
      success: false,
      statusCode,
      message,
      errors,
    };
  }

  paginated<T>(data: T[], total: number, page: number, limit: number): ApiResponse<T[]> {
    return {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Success",
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  created<T>(data: T, message: string = "Created successfully"): ApiResponse<T> {
    return {
      success: true,
      statusCode: StatusCodes.CREATED,
      message,
      data,
    };
  }

  noContent(): ApiResponse {
    return {
      success: true,
      statusCode: StatusCodes.NO_CONTENT,
      message: "No content",
    };
  }
}
