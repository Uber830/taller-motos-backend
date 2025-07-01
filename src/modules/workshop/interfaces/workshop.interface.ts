import { z } from "zod";
import {
  createWorkshopSchema,
  updateWorkshopSchema,
  updateWorkshopWithFileSchema,
} from "../validators/workshop.validator";

/**
 * DTOs for workshop management
 * @module workshop/interfaces/workshop
 * @category Interfaces
 */

export type CreateWorkshopDto = z.infer<typeof createWorkshopSchema>;
export type UpdateWorkshopDto = z.infer<typeof updateWorkshopSchema>;
export type UpdateWorkshopWithFileDto = z.infer<
  typeof updateWorkshopWithFileSchema
>;
