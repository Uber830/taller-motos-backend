import { z } from "zod";

/**
 * Schemas for customer management
 * @module customer/validators/customer
 * @category Validators
 */

export const createCustomerSchema = z.object({
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name must be at most 50 characters long" }),
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name must be at most 50 characters long" }),
    email: z
        .string()
        .email({ message: "Invalid email format" }),
    phone: z
        .string()
        .min(7, { message: "Phone number must be at least 7 digits long" })
        .max(15, { message: "Phone number must be at most 15 digits long" })
        .regex(/^[\+]?[0-9\s\-\(\)]+$/, {
            message: "Phone number must contain only numbers, spaces, hyphens, parentheses, and optionally a plus sign",
        }),
    address: z
        .string()
        .min(5, { message: "Address must be at least 5 characters long" })
        .max(200, { message: "Address must be at most 200 characters long" })
        .optional()
        .nullable(),
    notes: z
        .string()
        .min(3, { message: "Notes must be at least 3 characters long" })
        .max(200, { message: "Notes must be at most 200 characters long" })
        .optional()
        .nullable()
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>; 