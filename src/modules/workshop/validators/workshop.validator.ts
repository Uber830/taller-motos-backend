import { z } from "zod";

/**
 * Schemas for workshop management
 * @module workshop/validators/workshop
 * @category Validators
 */

export const createWorkshopSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Workshop name must be at least 3 characters long" }),
  address: z
    .string()
    .min(5, { message: "Workshop address must be at least 5 characters long" }),
  phone: z.string().min(7, {
    message: "Workshop phone number must be at least 7 digits long",
  }),
  email: z
    .string()
    .email({ message: "Invalid email format for workshop" })
    .optional()
    .nullable(),
  logo: z
    .string()
    .url({ message: "Invalid URL format for workshop logo" })
    .optional()
    .nullable(),
  nit: z
    .string()
    .min(9, { message: "NIT must be at least 9 characters long" })
    .max(10, { message: "NIT must be at most 10 characters long" })
    .optional()
    .nullable(),
});

export const updateWorkshopSchema = createWorkshopSchema.partial();

// Schema for workshop update with file upload (multipart/form-data)
export const updateWorkshopWithFileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Workshop name must be at least 3 characters long" })
    .optional(),
  address: z
    .string()
    .min(5, { message: "Workshop address must be at least 5 characters long" })
    .optional(),
  phone: z
    .string()
    .min(7, { message: "Workshop phone number must be at least 7 digits long" })
    .optional(),
  email: z
    .string()
    .email({ message: "Invalid email format for workshop" })
    .optional()
    .nullable(),
  nit: z
    .string()
    .min(9, { message: "NIT must be at least 9 characters long" })
    .max(10, { message: "NIT must be at most 10 characters long" })
    .optional()
    .nullable(),
});
