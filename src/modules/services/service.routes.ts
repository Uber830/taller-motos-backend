import { Router } from "express";
import {
  createController,
  getControllers,
  getByIdController,
  updateController,
  deleteController,
} from "./controllers/service.controller";
import { authMiddleware } from "../auth/middleware/auth";
import { workshopAccessMiddleware } from "./middleware/workshop-access.middleware";
import { validateRequest } from "../../core/middleware/validate-request.middleware";
import {
  createServiceSchema,
  updateServiceSchema,
} from "./validators/service.validator";

const router = Router();

/**
 * Routes for service management
 * @module services/service.routes
 * @category Routes
 */

// Authenticate all routes and determine workshop access
router.use(authMiddleware);
router.use(workshopAccessMiddleware);

// Get all services and create service
router
  .route("/")
  .post(validateRequest(createServiceSchema), createController)
  .get(getControllers);

// Get service by id, update service, and delete service
router
  .route("/:id")
  .get(getByIdController)
  .patch(validateRequest(updateServiceSchema), updateController)
  .delete(deleteController);

export default router;
