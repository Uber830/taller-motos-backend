import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { logger } from "../logger";

/**
 * Middleware to handle Zod validation errors
 */
export const validationErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const errors = err.errors.map(error => ({
      field: error.path.join("."),
      message: error.message,
    }));

    logger.error("Validation error", { errors });

    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation error",
      errors,
    });
    return;
  }

  next(err);
};
