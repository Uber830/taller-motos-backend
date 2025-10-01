import { Router } from "express";
import {
  createCustomerController,
  getCustomersController,
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
  getCustomerStatsController,
} from "./controllers/customer.controller";
import {
  createVehicleController,
  getCustomerVehiclesController,
  getVehicleByIdController,
  updateVehicleController,
  deleteVehicleController,
} from "./controllers/customer-vehicle.controller";
import { validateRequest } from "../../core/middleware";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./validators/customer.validator";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "./validators/customer-vehicle.validator";
import { authMiddleware } from "../auth/middleware/auth";

/**
 * Routes for customer management
 * @module customer/routes
 * @category Routes
 */

const router = Router();

// Customer routes
router.use(authMiddleware);
router
  .route("/")
  .post(validateRequest(createCustomerSchema), createCustomerController)
  .get(getCustomersController);

// Customer stats routes
router.route("/stats").get(getCustomerStatsController);

// Customer by id routes
router
  .route("/:id")
  .get(getCustomerByIdController)
  .put(validateRequest(updateCustomerSchema), updateCustomerController)
  .delete(deleteCustomerController);

// Customer vehicles routes
router
  .route("/:customerId/vehicles")
  .post(validateRequest(createVehicleSchema), createVehicleController)
  .get(getCustomerVehiclesController);

// Customer vehicle by id routes
router
  .route("/vehicles/:id")
  .get(getVehicleByIdController)
  .put(validateRequest(updateVehicleSchema), updateVehicleController)
  .delete(deleteVehicleController);

export default router;
