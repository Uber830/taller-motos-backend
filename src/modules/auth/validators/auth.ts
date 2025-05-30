import { z } from "zod";

/**
 * Schemas for authentication
 * @module auth/validators/auth
 * @category Validators
 */

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
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

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
