import { Request, Response, NextFunction } from "express";
import { ZodError, ZodObject, ZodTypeAny } from "zod"; // Changed AnyZodObject to ZodTypeAny
import { logger } from "../logger";

/**
 * Middleware to validate request data against a Zod schema.
 * It can handle:
 * 1. A composite ZodObject schema: z.object({ body: ..., query: ..., params: ... })
 * 2. A direct ZodObject schema: z.object({ ... }) which will be applied to req.body
 * 3. Other ZodTypeAny schemas (e.g., ZodEffects, ZodArray) which will be applied to req.body
 * @param schema - The Zod schema to validate against.
 * @returns Express middleware function.
 */
export const validateRequest =
  (
    schema: ZodTypeAny, // Changed from AnyZodObject to ZodTypeAny
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema instanceof ZodObject) {
        // Check if it's a ZodObject (potentially composite or direct body schema)
        const shape = schema.shape; // Safe to access .shape now
        if (shape.body || shape.query || shape.params) {
          // Composite schema: validate specific parts of the request
          await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
          });
        } else {
          // Direct ZodObject schema: assume it's for req.body
          await schema.parseAsync(req.body);
        }
      } else {
        // Not a ZodObject (e.g., ZodEffects, ZodArray, etc.): assume it's for req.body
        await schema.parseAsync(req.body);
      }
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        logger.error("Non-Zod error during request validation:", { error });
        next(new Error("Error validating request data"));
      }
    }
  };
