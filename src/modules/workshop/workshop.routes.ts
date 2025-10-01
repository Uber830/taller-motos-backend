import { Router } from "express";
import {
  createWorkshopController,
  getMyWorkshopController,
  getWorkshopByIdController,
  updateWorkshopWithLogoController,
} from "./controllers/workshop.controller";
import { validateRequest } from "../../core/middleware";
import { validateFormData } from "../../core/middleware/validate-form-data.middleware";
import {
  createWorkshopSchema,
  updateWorkshopWithFileSchema,
} from "./validators/workshop.validator";
import { authMiddleware } from "../auth/middleware/auth";
import {
  uploadSingle,
  validateFileUpload,
} from "../../core/middleware/upload.middleware";

/**
 * Routes for workshop management
 * @module workshop/routes
 * @category Routes
 */

const router = Router();

// Create a new workshop (user must be authenticated)
router.post(
  "/",
  authMiddleware,
  validateRequest(createWorkshopSchema),
  createWorkshopController,
);

// Get the workshop owned by the authenticated user
router.get("/my-workshop", authMiddleware, getMyWorkshopController);

// Get a specific workshop by ID (publicly accessible or add auth if needed)
router.get(
  "/:id",
  // isAuthenticated, // Uncomment if only authenticated users can view any workshop
  getWorkshopByIdController,
);

router.put(
  "/:id",
  authMiddleware,
  uploadSingle,
  validateFileUpload,
  validateFormData(updateWorkshopWithFileSchema),
  updateWorkshopWithLogoController,
);

// Example: router.post('/:workshopId/employees', isAuthenticated, workshopEmployeeController.addEmployee);

import workshopEmployeeRoutes from "../workshop-employee/workshop-employee.routes";

// Mount employee routes under /:workshopId/employees
router.use("/:workshopId/employees", workshopEmployeeRoutes);

export default router;
