import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError, InternalServerError } from '../errors';

// Basic console logger for now, you can replace this with a more robust logger like Winston or Pino
const logger = {
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error instanceof Error ? error.stack : error);
  },
  info: (message: string) => {
    console.log(`[INFO] ${message}`);
  }
};

/**
 * @description Global error handling middleware for Express.
 * It catches errors and sends a standardized JSON response.
 */
export const errorHandler: ErrorRequestHandler = (err, _req: Request, res: Response, _next: NextFunction) => {
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
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  // Handle unexpected errors (likely bugs)
  logger.error(`Unexpected error: ${err.message}`, err);

  // Respond with a generic 500 error to avoid leaking sensitive details
  const internalError = new InternalServerError('An unexpected error occurred. Please try again later.');
  res.status(internalError.statusCode).json({
    status: 'error',
    statusCode: internalError.statusCode,
    message: internalError.message,
  });
};
