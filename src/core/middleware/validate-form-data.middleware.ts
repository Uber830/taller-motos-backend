import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";
import { logger } from "../logger";

/**
 * Middleware to validate form data against a Zod schema.
 * This is specifically for multipart/form-data requests where the body contains form fields.
 * @param schema - The Zod schema to validate against.
 * @returns Express middleware function.
 */
export const validateFormData =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // For multipart/form-data, the body contains the form fields
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        logger.error("Non-Zod error during form data validation:", { error });
        next(new Error("Error validating form data"));
      }
    }
  };
