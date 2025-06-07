import { Router } from "express";
import { workshopEmployeeController } from "./controllers/workshop-employee.controller";
import { validateRequest } from "../../core/middleware";
import {
  createWorkshopEmployeeSchema,
  updateWorkshopEmployeeSchema,
  setWorkshopEmployeeStatusSchema,
} from "./validators/workshop-employee.validator";
import { authMiddleware } from "../auth/middleware/auth";

/**
 * Routes for managing workshop employees.
 * All routes are prefixed with /api/workshops/:workshopId/employees
 */
const router = Router({ mergeParams: true }); // mergeParams allows access to :workshopId from parent router

// Add a new employee to the workshop
router.post(
  "/",
  authMiddleware,
  validateRequest(createWorkshopEmployeeSchema),
  workshopEmployeeController.addEmployee,
);

// Get all employees for the workshop
router.get("/", authMiddleware, workshopEmployeeController.getEmployees);

// Update an employee's details
router.put(
  "/:employeeUserId",
  authMiddleware,
  validateRequest(updateWorkshopEmployeeSchema),
  workshopEmployeeController.updateEmployee,
);

// Get a specific employee
router.get(
  "/:employeeUserId",
  authMiddleware,
  workshopEmployeeController.getEmployee,
);

// Set employee active status (activate/deactivate)
router.patch(
  "/:employeeUserId/status",
  authMiddleware,
  validateRequest(setWorkshopEmployeeStatusSchema),
  workshopEmployeeController.setEmployeeStatus,
);

export default router;
