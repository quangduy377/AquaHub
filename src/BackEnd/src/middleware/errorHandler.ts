import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { AppError } from "../utils/AppError.js";

const ERROR_MESSAGES = {
  INVALID_REQUEST_DATA: "Invalid request data",
  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;

export const errorHandler: ErrorRequestHandler = (error, _request, response) => {
  if (error instanceof ZodError) {
    response.status(HTTP_STATUS.BAD_REQUEST).json({
      message: ERROR_MESSAGES.INVALID_REQUEST_DATA,
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error(error);
  response.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  });
};
