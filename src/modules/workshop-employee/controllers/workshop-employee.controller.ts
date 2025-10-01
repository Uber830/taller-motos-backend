import { Response, NextFunction, RequestHandler } from "express";
import {
  addEmployeeToWorkshop,
  getEmployeesByWorkshop,
  updateEmployeeInWorkshop,
  getEmployeeInWorkshop,
  setEmployeeActiveStatus,
} from "../services/workshop-employee.service";
import {
  CreateWorkshopEmployeeDto,
  UpdateWorkshopEmployeeDto,
  SetWorkshopEmployeeStatusDto,
} from "../interfaces/workshop-employee.interface";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { UnauthorizedError } from "../../../core/errors";

/**
 * Controller for managing workshop employees.
 */

/**
 * Adds a new employee to a specific workshop.
 * @param req - Express request object, expects workshopId in params and employee data in body.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export const addEmployeeController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actingUserId = req.user?.id;
    if (!actingUserId) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const { workshopId } = req.params;
    const employeeData = req.body as CreateWorkshopEmployeeDto;

    const newEmployee = await addEmployeeToWorkshop(
      workshopId,
      employeeData,
      actingUserId,
    );

    res.status(201).json(newEmployee);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all employees for a specific workshop.
 * @param req - Express request object, expects workshopId in params.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export const getEmployeesController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actingUserId = req.user?.id;
    if (!actingUserId) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const { workshopId } = req.params;
    const employees = await getEmployeesByWorkshop(workshopId, actingUserId);
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates an employee's details in a workshop.
 * @param req - Express request object, expects workshopId and employeeUserId in params, and update data in body.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export const updateEmployeeController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actingUserId = req.user?.id;
    if (!actingUserId) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const { workshopId, employeeUserId } = req.params;
    const updateData = req.body as UpdateWorkshopEmployeeDto;

    const updatedEmployee = await updateEmployeeInWorkshop(
      workshopId,
      employeeUserId,
      updateData,
      actingUserId,
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific employee from a workshop.
 * @param req - Express request object, expects workshopId and employeeUserId in params.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export const getEmployeeController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actingUserId = req.user?.id;
    if (!actingUserId) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const { workshopId, employeeUserId } = req.params;
    const employee = await getEmployeeInWorkshop(
      workshopId,
      employeeUserId,
      actingUserId,
    );
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

/**
 * Sets the active status of an employee in a workshop.
 * @param req - Express request object, expects workshopId and employeeUserId in params, and { active: boolean } in body.
 * @param res - Express response object.
 * @param next - Express next middleware function.
 */
export const setEmployeeStatusController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const actingUserId = req.user?.id;
    if (!actingUserId) {
      throw new UnauthorizedError("User not authenticated.");
    }

    const { workshopId, employeeUserId } = req.params;
    const { active } = req.body as SetWorkshopEmployeeStatusDto;

    const updatedEmployee = await setEmployeeActiveStatus(
      workshopId,
      employeeUserId,
      active,
      actingUserId,
    );

    res.status(200).json(updatedEmployee);
  } catch (error) {
    next(error);
  }
};
