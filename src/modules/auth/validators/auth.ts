import { Role } from "@prisma/client";
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
  sessionFacebook: z.number().default(0),
  sessionGoogle: z.number().default(0),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  role: z.enum([Role.ADMIN, Role.OWNER, Role.MECHANIC]),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type RegisterCredentials = z.infer<typeof registerSchema>;
