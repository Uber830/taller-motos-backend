import { z } from 'zod';
import { EmployeeRole } from '@prisma/client';

/**
 * Enum for WorkshopUser roles, mirroring Prisma's Role enum but excluding OWNER.
 */
export const WorkshopEmployeeRole = z.enum(['ADMIN', 'MECHANIC'], {
  required_error: 'Role is required.',
  invalid_type_error: 'Role must be either ADMIN or MECHANIC.',
});

/**
 * Zod schema for creating a new workshop employee.
 */
export const createWorkshopEmployeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(7, 'Phone number must be at least 7 digits long').optional(),
  role: z.nativeEnum(EmployeeRole, {
    errorMap: () => ({ message: 'Invalid employee role' })
  })
});

/**
 * Zod schema for updating an existing workshop employee.
 */
export const updateWorkshopEmployeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(7, 'Phone number must be at least 7 digits long').optional(),
  role: z.nativeEnum(EmployeeRole, {
    errorMap: () => ({ message: 'Invalid employee role' })
  }).optional()
});

/**
 * Schema for validating the request body when setting an employee's active status.
 */
export const setWorkshopEmployeeStatusSchema = z.object({
  active: z.boolean({
    required_error: 'Active status is required',
    invalid_type_error: 'Active status must be a boolean'
  })
});
