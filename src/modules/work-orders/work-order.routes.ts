import { Router } from "express";
import {
  createController,
  getControllers,
  getByIdController,
  updateController,
  deleteController,
} from "./controllers/work-order.controller";
import { authMiddleware } from "../auth/middleware/auth";
import { workshopAccessMiddleware } from "../services/middleware/workshop-access.middleware";
import { validateRequest } from "../../core/middleware/validate-request.middleware";
import {
  createWorkOrderSchema,
  updateWorkOrderSchema,
} from "./validators/work-order.validator";

const router = Router();

/**
 * Routes for work order management
 * @module work-orders/work-order.routes
 * @category Routes
 */

// Authenticate all routes and determine workshop access
router.use(authMiddleware);
router.use(workshopAccessMiddleware);

// Get all work orders and create work order
router
  .route("/")
  .post(validateRequest(createWorkOrderSchema), createController)
  .get(getControllers);

// Get work order by id, update work order, and delete work order
router
  .route("/:id")
  .get(getByIdController)
  .patch(validateRequest(updateWorkOrderSchema), updateController)
  .delete(deleteController);

export default router;
