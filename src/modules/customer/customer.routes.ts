import { Router } from "express";
import { customerController } from "./controllers/customer.controller";
// import { customerMotorcycleController } from "./controllers/customer-motorcycle.controller";
import { validateRequest } from "../../core/middleware";
import {
    createCustomerSchema,
    updateCustomerSchema,
} from "./validators/customer.validator";
// import {
//     createMotorcycleSchema,
//     updateMotorcycleSchema,
// } from "./validators/customer-motorcycle.validator";
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

// Customer motorcycles routes
// router.route("/:customerId/motorcycles")
//     .post(
//         validateRequest(createMotorcycleSchema),
//         customerMotorcycleController.createMotorcycle
//     )
//     .get(
//         customerMotorcycleController.getCustomerMotorcycles
//     );

// Customer motorcycle by id routes
// router.route("/motorcycles/:id")
//     .get(
//         customerMotorcycleController.getMotorcycleById
//     )
//     .put(
//         validateRequest(updateMotorcycleSchema),
//         customerMotorcycleController.updateMotorcycle
//     )
//     .delete(
//         customerMotorcycleController.deleteMotorcycle
//     );


export default router; 