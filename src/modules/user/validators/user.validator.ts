import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phoneNumber: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  dateOfBirth: z.string().optional(),
  avatar: z.string().optional(),
});
