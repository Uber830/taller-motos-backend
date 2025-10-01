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
        message:
          "Password is required for email login when not using social authentication",
        path: ["password"],
      });
    }
  });

// Esquema para registro tradicional (con email y password)
export const registerTraditionalSchema = z.object({
  sessionFacebook: z.boolean().default(false),
  sessionGoogle: z.boolean().default(false),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  avatar: z
    .string()
    .url()
    .optional()
    .transform(val => val ?? null),
  habeas_data: z.boolean().default(false),
});

// Esquema para registro social (con sessionFacebook o sessionGoogle)
export const registerSocialSchema = z
  .object({
    sessionFacebook: z.boolean().default(false),
    sessionGoogle: z.boolean().default(false),
    email: z.string().email(),
    password: z.string().min(6).optional(),
    firstName: z.string().optional().default("Usuario"),
    lastName: z.string().optional().default("Social"),
    avatar: z
      .string()
      .url()
      .optional()
      .transform(val => val ?? null),
    habeas_data: z.boolean().default(false),
  })
  .refine(data => data.sessionFacebook || data.sessionGoogle, {
    message: "Social registration requires sessionFacebook or sessionGoogle",
    path: ["sessionFacebook"],
  });

// Schema unificado que decide cuál usar según los datos
export const registerSchema = z.union([
  registerSocialSchema,
  registerTraditionalSchema,
]);

export const updateMeSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatar: z.string().url().optional(),
  sessionFacebook: z.boolean().optional(),
  sessionGoogle: z.boolean().optional(),
  habeas_data: z.boolean().optional(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
export type UpdateMeCredentials = z.infer<typeof updateMeSchema>;
