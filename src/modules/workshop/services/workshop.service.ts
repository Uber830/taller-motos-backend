import { PrismaClient, Workshop, User, EmployeeRole } from '@prisma/client';
import { CreateWorkshopDto, UpdateWorkshopDto } from '../interfaces/workshop.interface';
import { ConflictError, NotFoundError, ForbiddenError } from '../../../core/errors';

/**
 * Service for workshop management
 * @module workshop/service
 * @category Services
 */

const prisma = new PrismaClient();

export class WorkshopService {
  /**
   * Creates a new workshop for a given user.
   * The user creating the workshop becomes its owner.
   * @param {string} userId - The ID of the user creating the workshop.
   * @param {CreateWorkshopDto} workshopData - The data for the new workshop.
   * @returns {Promise<Workshop>} The created workshop.
   * @throws {HttpError} If the user already owns a workshop.
   */
  async createWorkshop(userId: string, workshopData: CreateWorkshopDto) {
    const existingWorkshop = await prisma.workshop.findUnique({
      where: { ownerId: userId },
    });

    if (existingWorkshop) {
      throw new ConflictError('User already owns a workshop');
    }

    return prisma.workshop.create({
      data: {
        ...workshopData,
        owner: {
          connect: { id: userId },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        employees: true
      }
    });
  }

  /**
   * Gets the workshop owned by a user.
   * @param {string} userId - The ID of the owner user.
   * @returns {Promise<Workshop | null>} The workshop or null if not found.
   */
  async getWorkshopByOwner(userId: string) {
    return prisma.workshop.findUnique({
      where: { ownerId: userId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        employees: {
          where: {
            active: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        services: true,
        supplies: {
          where: {
            stock: {
              gt: 0
            }
          }
        }
      }
    });
  }

  /**
   * Gets a workshop by its ID.
   * @param {string} workshopId - The ID of the workshop.
   * @returns {Promise<Workshop | null>} The workshop or null if not found.
   */
  async getWorkshopById(workshopId: string) {
    return prisma.workshop.findUnique({
      where: { id: workshopId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        employees: {
          where: {
            active: true
          }
        },
        services: true,
        supplies: {
          where: {
            stock: {
              gt: 0
            }
          }
        }
      }
    });
  }

  /**
   * Updates a workshop. Only the owner can update it.
   * @param {string} workshopId - The ID of the workshop to update.
   * @param {string} userId - The ID of the user attempting the update.
   * @param {UpdateWorkshopDto} workshopData - The data to update.
   * @returns {Promise<Workshop>} The updated workshop.
   * @throws {HttpError} If the workshop is not found or the user is not the owner.
   */
  async updateWorkshop(workshopId: string, userId: string, workshopData: UpdateWorkshopDto) {
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

    // Check if user is owner or admin
    const isOwner = workshop.ownerId === userId;
    const isAdmin = workshop.employees.some(emp => emp.id === userId);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError('User is not authorized to update this workshop');
    }

    return prisma.workshop.update({
      where: { id: workshopId },
      data: workshopData,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        employees: {
          where: {
            active: true
          }
        }
      }
    });
  }

  async getWorkshopStats(workshopId: string, userId: string) {
    const workshop = await prisma.workshop.findUnique({
      where: { id: workshopId },
      include: {
        employees: {
          where: {
            active: true
          }
        },
        workOrders: {
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
            }
          },
          include: {
            service: true,
            supplies: true
          }
        },
        supplies: {
          where: {
            stock: {
              lte: 10 // Low stock alert
            }
          }
        }
      }
    });

    if (!workshop) {
      throw new NotFoundError('Workshop not found');
    }

    if (workshop.ownerId !== userId && !workshop.employees.some(emp => emp.id === userId)) {
      throw new ForbiddenError('User is not authorized to view workshop stats');
    }

    return {
      totalEmployees: workshop.employees.length,
      recentWorkOrders: workshop.workOrders.length,
      lowStockSupplies: workshop.supplies.length,
      totalRevenue: workshop.workOrders.reduce((sum, order) => sum + order.total, 0)
    };
  }

  // Consider adding a deleteWorkshop method if necessary, 
  // ensuring proper authorization and handling of related data.
}

export const workshopService = new WorkshopService();
