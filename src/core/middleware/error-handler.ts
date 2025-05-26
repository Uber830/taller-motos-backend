import { ErrorRequestHandler, Request, Response } from "express";

import { ApiError, InternalServerError } from "../errors";
import { logger } from "../logger";

/**
 * @description Global error handling middleware for Express.
 * It catches errors and sends a standardized JSON response.
 */
export const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next,
): void => {
  // If headers have been sent, don't try to send another response
  if (res.headersSent) {
    return;
  }

  if (err instanceof ApiError) {
    // Handle known API errors (operational errors)
    if (!err.isOperational) {
      // Log non-operational ApiErrors (bugs in our custom error handling)
      logger.error(`Non-operational ApiError: ${err.message}`, err);
    }
    res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  // Handle unexpected errors (likely bugs)
  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  logger.error(`Unexpected error: ${errorMessage}`, err);

  // Respond with a generic 500 error to avoid leaking sensitive details
  const internalError = new InternalServerError(
    "An unexpected error occurred. Please try again later.",
  );
  res.status(internalError.statusCode).json({
    status: "error",
    statusCode: internalError.statusCode,
    message: internalError.message,
  });
};
