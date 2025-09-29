import { Router } from "express";
import {
  createController,
  getControllers,
  getByIdController,
  updateController,
  deleteController,
} from "./controllers/supply.controller";
import { authMiddleware } from "../auth/middleware/auth";
import { workshopAccessMiddleware } from "../services/middleware/workshop-access.middleware";
import { validateRequest } from "../../core/middleware/validate-request.middleware";
import {
  createSupplySchema,
  updateSupplySchema,
} from "./validators/supply.validator";

const router = Router();

/**
 * Routes for supply management
 * @module supplies/supply.routes
 * @category Routes
 */

// Authenticate all routes and determine workshop access
router.use(authMiddleware);
router.use(workshopAccessMiddleware);

// Get all supplies and create supply
router
  .route("/")
  .post(validateRequest(createSupplySchema), createController)
  .get(getControllers);

// Get supply by id, update supply, and delete supply
router
  .route("/:id")
  .get(getByIdController)
  .patch(validateRequest(updateSupplySchema), updateController)
  .delete(deleteController);

export default router;
