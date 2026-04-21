import { z } from "zod";

const supplySchema = z.object({
  supplyId: z.string().cuid("Supply ID must be a valid CUID"),
  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(50, "Quantity must be less than 50")
    .positive("Quantity must be positive"),
});

export const createWorkOrderSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  mechanic: z
    .string()
    .min(1, "Mechanic name is required")
    .max(100, "Mechanic name too long"),
  serviceId: z.string().min(1, "Service ID is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  startDate: z.string().datetime().optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  additionalNotes: z.string().max(500, "Additional notes too long").optional(),
  supplies: z.array(supplySchema).optional(),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  total: z.number().min(0, "Total must be positive"),
});

export const updateWorkOrderSchema = z.object({
  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .optional(),
  mechanic: z
    .string()
    .min(1, "Mechanic name is required")
    .max(100, "Mechanic name too long")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long")
    .optional(),
  additionalNotes: z.string().max(500, "Additional notes too long").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  startDate: z.string().datetime().optional(),
  supplies: z.array(supplySchema).optional(),
  subtotal: z.number().min(0, "Subtotal must be positive").optional(),
  total: z.number().min(0, "Total must be positive").optional(),
});

export const workOrderQuerySchema = z.object({
  page: z.string().transform(Number).pipe(z.number().min(1)).optional(),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(100))
    .optional(),
  status: z
    .enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .optional(),
  customerId: z.string().optional(),
  vehicleId: z.string().optional(),
  serviceId: z.string().optional(),
});
