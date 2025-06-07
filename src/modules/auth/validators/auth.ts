import { z } from "zod";
import { SessionNetwork } from "../types/index";

/**
 * Schemas for authentication
 * @module auth/validators/auth
 * @category Validators
 */

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6).optional(),
    session_network: z.nativeEnum(SessionNetwork).optional(),
  })
  .superRefine((data, ctx) => {
    // If it is a social login, no need to have a password
    if (data.session_network) {
      return true;
    }
    // If it is not a social login, it must have a password
    if (!data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required for email login when not using social authentication",
        path: ["password"],
      });
    }
  });

export const registerSchema = z
  .object({
    sessionFacebook: z.boolean().default(false),
    sessionGoogle: z.boolean().default(false),
    email: z.string().email(),
    password: z.string().min(6).optional(),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    avatar: z
      .string()
      .url()
      .optional()
      .transform(val => val ?? null),
    habeas_data: z.boolean().default(false),
  })
  .refine(
    data => {
      // Password is required if not using social auth
      if (!data.sessionFacebook && !data.sessionGoogle && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required when not using social authentication",
      path: ["password"],
    },
  );

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
