import { PrismaClient, User, Workshop, WorkshopEmployeeInfo, EmployeeRole } from '@prisma/client';
import { CreateWorkshopEmployeeDto, UpdateWorkshopEmployeeDto } from '../interfaces/workshop-employee.interface';
import { NotFoundError, ForbiddenError, ConflictError, BadRequestError } from '../../../core/errors';
import { Role } from '../../auth/types';

const prisma = new PrismaClient();

/**
 * Service for managing workshop employees (WorkshopUser entities).
 */
export class WorkshopEmployeeService {
  /**
   * Verifies if the acting user is the owner of the specified workshop.
   * @param workshopId - The ID of the workshop.
   * @param actingUserId - The ID of the user performing the action.
   * @throws ForbiddenError if the user is not the owner.
   * @throws NotFoundError if the workshop is not found.
   */
  private async verifyWorkshopOwner(workshopId: string, actingUserId: string): Promise<Workshop> {
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
    });

    if (!workshop) {
      throw new NotFoundError('Workshop not found.');
    }

    if (workshop.ownerId !== actingUserId) {
      throw new ForbiddenError('User is not authorized to manage employees for this workshop.');
    }
    return workshop;
  }

  private async validateWorkshopAccess(workshopId: string, actingUserId: string) {
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      include: {
        employees: {
          where: {
            active: true,
            role: EmployeeRole.ADMIN
          }
        }
      }
    });

    if (!workshop) {
      throw new NotFoundError('Workshop not found');
    }

    const isOwner = workshop.ownerId === actingUserId;
    const isAdmin = workshop.employees.some(emp => emp.id === actingUserId);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('User is not authorized to manage workshop employees');
    }

    return workshop;
  }

  /**
   * Adds a user as an employee to a workshop.
   * @param workshopId - The ID of the workshop.
   * @param employeeData - Data for the new employee (userId, role).
   * @param actingUserId - The ID of the user performing the action (must be workshop owner).
   * @returns The created WorkshopUser record.
   */
  public async addEmployeeToWorkshop(
    workshopId: string,
    employeeData: CreateWorkshopEmployeeDto,
    actingUserId: string
  ): Promise<WorkshopEmployeeInfo> {
    await this.validateWorkshopAccess(workshopId, actingUserId);

    // Check if an employee with the same email already exists in this workshop
    if (employeeData.email) {
      const existingEmployee = await prisma.workshopEmployeeInfo.findFirst({
        where: {
          workshopId,
          email: employeeData.email,
          active: true
        }
      });

      if (existingEmployee) {
        throw new ConflictError('An employee with this email already exists in this workshop');
      }
    }

    return prisma.workshopEmployeeInfo.create({
      data: {
        ...employeeData,
        workshop: {
          connect: { id: workshopId }
        },
        active: true
      }
    });
  }

  /**
   * Retrieves all employees for a specific workshop.
   * @param workshopId - The ID of the workshop.
   * @param actingUserId - The ID of the user performing the action (must be workshop owner).
   * @returns A list of workshop employees with their user details.
   */
  public async getEmployeesByWorkshop(
    workshopId: string,
    actingUserId: string
  ): Promise<WorkshopEmployeeInfo[]> {
    await this.validateWorkshopAccess(workshopId, actingUserId);

    return prisma.workshopEmployeeInfo.findMany({
      where: {
        workshopId,
        active: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });
  }

  /**
   * Updates an employee's details within a workshop.
   * @param workshopId - The ID of the workshop.
   * @param employeeId - The ID of the user (employee) to update.
   * @param data - The data to update (role, active status).
   * @param actingUserId - The ID of the user performing the action (must be workshop owner).
   * @returns The updated WorkshopUser record.
   */
  public async updateEmployeeInWorkshop(
    workshopId: string,
    employeeId: string,
    data: UpdateWorkshopEmployeeDto,
    actingUserId: string
  ): Promise<WorkshopEmployeeInfo> {
    // Get workshop to check if acting user is owner
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      select: { ownerId: true }
    });

    if (!workshop) {
      throw new NotFoundError('Workshop not found');
    }

    const isOwner = workshop.ownerId === actingUserId;

    // If not owner, validate normal workshop access and prevent modifying admins
    if (!isOwner) {
      await this.validateWorkshopAccess(workshopId, actingUserId);

      const employeeToUpdate = await prisma.workshopEmployeeInfo.findFirst({
        where: {
          id: employeeId,
          workshopId
        }
      });

      if (!employeeToUpdate) {
        throw new NotFoundError('Employee not found in this workshop');
      }

      if (employeeToUpdate.role === EmployeeRole.ADMIN) {
        throw new ForbiddenError('Only workshop owners can modify admin employee details');
      }
    }

    return prisma.workshopEmployeeInfo.update({
      where: {
        id: employeeId,
        workshopId
      },
      data: {
        ...data
      }
    });
  }

  /**
   * Retrieves a specific employee from a workshop.
   * @param workshopId - The ID of the workshop.
   * @param employeeId - The ID of the user (employee) to retrieve.
   * @param actingUserId - The ID of the user performing the action (must be workshop owner).
   * @returns The WorkshopUser record with user details.
   * @throws NotFoundError if the employee is not found in the workshop.
   */
  public async getEmployeeInWorkshop(
    workshopId: string,
    employeeId: string,
    actingUserId: string
  ): Promise<WorkshopEmployeeInfo> {
    await this.validateWorkshopAccess(workshopId, actingUserId);

    const employee = await prisma.workshopEmployeeInfo.findFirst({
      where: {
        id: employeeId,
        workshopId
      }
    });

    if (!employee) {
      throw new NotFoundError('Employee not found in this workshop');
    }

    return employee;
  }

  /**
   * Sets the active status of an employee in a workshop.
   * @param workshopId - The ID of the workshop.
   * @param employeeId - The ID of the user (employee) whose status to set.
   * @param active - The new active status (true or false).
   * @param actingUserId - The ID of the user performing the action (must be workshop owner).
   * @returns The updated WorkshopUser record.
   */
  public async setEmployeeActiveStatus(
    workshopId: string,
    employeeId: string,
    active: boolean,
    actingUserId: string
  ): Promise<WorkshopEmployeeInfo> {
    // Get workshop to check if acting user is owner
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId }
    });

    if (!workshop) {
      throw new NotFoundError('Workshop not found');
    }

    const employeeToUpdate = await prisma.workshopEmployeeInfo.findFirst({
      where: {
        id: employeeId,
        workshopId
      }
    });

    if (!employeeToUpdate) {
      throw new NotFoundError('Employee not found in this workshop');
    }

    // If employee is admin, only workshop owner can change their status
    if (employeeToUpdate.role === EmployeeRole.ADMIN) {
      if (workshop.ownerId !== actingUserId) {
        throw new ForbiddenError('Only workshop owners can modify admin employee status');
      }
    } else {
      // For non-admin employees, validate normal workshop access
      await this.validateWorkshopAccess(workshopId, actingUserId);
    }

    return prisma.workshopEmployeeInfo.update({
      where: {
        id: employeeId,
        workshopId
      },
      data: {
        active
      }
    });
  }

  public async getEmployeesByRole(
    workshopId: string,
    role: EmployeeRole,
    actingUserId: string
  ): Promise<WorkshopEmployeeInfo[]> {
    await this.validateWorkshopAccess(workshopId, actingUserId);

    return prisma.workshopEmployeeInfo.findMany({
      where: {
        workshopId,
        role,
        active: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}

export const workshopEmployeeService = new WorkshopEmployeeService();
