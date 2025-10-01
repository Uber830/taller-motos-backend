import { z } from "zod";

/**
 * Schemas for customer vehicle management
 * @module customer/validators/vehicle
 * @category Validators
 */

export const createVehicleSchema = z.object({
  brand: z
    .string()
    .min(2, { message: "Brand must be at least 2 characters long" })
    .max(50, { message: "Brand must be at most 50 characters long" }),
  model: z
    .string()
    .min(2, { message: "Model must be at least 2 characters long" })
    .max(50, { message: "Model must be at most 50 characters long" }),
  year: z
    .number()
    .int({ message: "Year must be an integer" })
    .min(1900, { message: "Year must be at least 1900" })
    .max(new Date().getFullYear() + 1, {
      message: "Year cannot be in the future",
    }),
  plate: z
    .string()
    .min(3, { message: "Plate must be at least 3 characters long" })
    .max(15, { message: "Plate must be at most 15 characters long" })
    .regex(/^[A-Z0-9-]+$/, {
      message:
        "Plate must contain only uppercase letters, numbers, and hyphens",
    }),
  color: z
    .string()
    .min(2, { message: "Color must be at least 2 characters long" })
    .max(30, { message: "Color must be at most 30 characters long" }),
  type: z.enum(["MOTORCYCLE", "CAR"], {
    required_error: "Vehicle type is required",
    invalid_type_error: "Vehicle type must be either MOTORCYCLE or CAR",
  }),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
