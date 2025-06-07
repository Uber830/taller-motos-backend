import { Request, Response, NextFunction } from "express";
import { workshopEmployeeService } from "../services/workshop-employee.service";
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
export class WorkshopEmployeeController {
  /**
   * Adds a new employee to a specific workshop.
   * @param req - Express request object, expects workshopId in params and employee data in body.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async addEmployee(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const actingUserId = req.user?.id;
      if (!actingUserId) {
        throw new UnauthorizedError("User not authenticated.");
      }

      const { workshopId } = req.params;
      const employeeData: CreateWorkshopEmployeeDto = req.body;

      const newEmployee = await workshopEmployeeService.addEmployeeToWorkshop(
        workshopId,
        employeeData,
        actingUserId,
      );

      res.status(201).json(newEmployee);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves all employees for a specific workshop.
   * @param req - Express request object, expects workshopId in params.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async getEmployees(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const actingUserId = req.user?.id;
      if (!actingUserId) {
        throw new UnauthorizedError("User not authenticated.");
      }

      const { workshopId } = req.params;
      const employees = await workshopEmployeeService.getEmployeesByWorkshop(
        workshopId,
        actingUserId,
      );
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates an employee's details in a workshop.
   * @param req - Express request object, expects workshopId and employeeUserId in params, and update data in body.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async updateEmployee(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const actingUserId = req.user?.id;
      if (!actingUserId) {
        throw new UnauthorizedError("User not authenticated.");
      }

      const { workshopId, employeeUserId } = req.params;
      const updateData: UpdateWorkshopEmployeeDto = req.body;

      const updatedEmployee =
        await workshopEmployeeService.updateEmployeeInWorkshop(
          workshopId,
          employeeUserId,
          updateData,
          actingUserId,
        );

      res.status(200).json(updatedEmployee);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves a specific employee from a workshop.
   * @param req - Express request object, expects workshopId and employeeUserId in params.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async getEmployee(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const actingUserId = req.user?.id;
      if (!actingUserId) {
        throw new UnauthorizedError("User not authenticated.");
      }

      const { workshopId, employeeUserId } = req.params;
      const employee = await workshopEmployeeService.getEmployeeInWorkshop(
        workshopId,
        employeeUserId,
        actingUserId,
      );
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sets the active status of an employee in a workshop.
   * @param req - Express request object, expects workshopId and employeeUserId in params, and { active: boolean } in body.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  public async setEmployeeStatus(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const actingUserId = req.user?.id;
      if (!actingUserId) {
        throw new UnauthorizedError("User not authenticated.");
      }

      const { workshopId, employeeUserId } = req.params;
      const { active } = req.body as SetWorkshopEmployeeStatusDto;

      const updatedEmployee =
        await workshopEmployeeService.setEmployeeActiveStatus(
          workshopId,
          employeeUserId,
          active,
          actingUserId,
        );

      res.status(200).json(updatedEmployee);
    } catch (error) {
      next(error);
    }
  }
}

export const workshopEmployeeController = new WorkshopEmployeeController();
