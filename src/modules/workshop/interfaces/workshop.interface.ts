import { z } from 'zod';
import { createWorkshopSchema, updateWorkshopSchema } from '../validators/workshop.validator';

/**
 * DTOs for workshop management
 * @module workshop/interfaces/workshop
 * @category Interfaces
 */

export type CreateWorkshopDto = z.infer<typeof createWorkshopSchema>;
export type UpdateWorkshopDto = z.infer<typeof updateWorkshopSchema>;
