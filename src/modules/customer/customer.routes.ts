import { Router } from "express";
import { customerController } from "./controllers/customer.controller";
import { customerVehicleController } from "./controllers/customer-vehicle.controller";
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
router.use(authMiddleware)
router.route("/")
    .post(
        validateRequest(createCustomerSchema),
        customerController.createCustomer
    )
    .get(
        customerController.getCustomers
    );

// Customer stats routes
router.route("/stats")
    .get(
        customerController.getCustomerStats
    );

// Customer by id routes
router.route("/:id")
    .get(
        customerController.getCustomerById
    )
    .put(
        validateRequest(updateCustomerSchema),
        customerController.updateCustomer
    )
    .delete(
        customerController.deleteCustomer
    );

// Customer vehicles routes
router.route("/:customerId/vehicles")
    .post(
        validateRequest(createVehicleSchema),
        customerVehicleController.createVehicle
    )
    .get(
        customerVehicleController.getCustomerVehicles
    );

// Customer vehicle by id routes
router.route("/vehicles/:id")
    .get(
        customerVehicleController.getVehicleById
    )
    .put(
        validateRequest(updateVehicleSchema),
        customerVehicleController.updateVehicle
    )
    .delete(
        customerVehicleController.deleteVehicle
    );


export default router; 