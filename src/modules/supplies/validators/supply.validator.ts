import { z } from "zod";

export const createSupplySchema = z.object({
  name: z
    .string()
    .min(1, "Supply name is required")
    .max(100, "Supply name too long"),
  description: z.string().max(500, "Description too long").optional(),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
});

export const updateSupplySchema = z.object({
  name: z
    .string()
    .min(1, "Supply name is required")
    .max(100, "Supply name too long")
    .optional(),
  description: z.string().max(500, "Description too long").optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  stock: z.number().int().min(0, "Stock must be non-negative").optional(),
});
