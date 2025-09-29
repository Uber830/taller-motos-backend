import { PrismaClient, OrderPriority, OrderStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} from "../../../core/errors";
import {
  CreateWorkOrderDto,
  UpdateWorkOrderDto,
} from "../types/work-order.types";
import { logger } from "../../../core/logger";

const prisma = new PrismaClient();

export const createWorkOrder = async (
  workshopId: string,
  data: CreateWorkOrderDto,
) => {
  try {
    // Verify that customer belongs to this workshop
    const customer = await prisma.customer.findFirst({
      where: {
        id: data.customerId,
        workshopId,
      },
    });

    if (!customer) {
      throw new BadRequestError("Customer not found in this workshop");
    }

    // Verify that vehicle belongs to this customer
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: data.vehicleId,
        customerId: data.customerId,
      },
    });

    if (!vehicle) {
      throw new BadRequestError("Vehicle not found for this customer");
    }

    // Verify that service belongs to this workshop
    const service = await prisma.service.findFirst({
      where: {
        id: data.serviceId,
        workshopId,
      },
    });

    if (!service) {
      throw new BadRequestError("Service not found in this workshop");
    }

    // Verify supplies if provided
    if (data.supplies && data.supplies.length > 0) {
      for (const supplyItem of data.supplies) {
        const supply = await prisma.supply.findFirst({
          where: {
            id: supplyItem.supplyId,
            workshopId,
          },
        });

        if (!supply) {
          throw new BadRequestError(
            `Supply ${supplyItem.supplyId} not found in this workshop`,
          );
        }
      }
    }

    const workOrderData: Prisma.WorkOrderUncheckedCreateInput = {
      workshopId,
      customerId: data.customerId,
      vehicleId: data.vehicleId,
      serviceId: data.serviceId,
      mechanic: data.mechanic,
      description: data.description,
      additionalNotes: data.additionalNotes,
      priority: (data.priority ?? "MEDIUM") as OrderPriority,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      total: new Decimal(data.total),
    };

    const workOrder = await prisma.workOrder.create({
      data: workOrderData,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            plate: true,
            color: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        supplies: {
          include: {
            supply: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    // Create supply relationships if provided
    if (data.supplies && data.supplies.length > 0) {
      const supplyData = data.supplies.map(supplyItem => ({
        workOrderId: workOrder.id,
        supplyId: supplyItem.supplyId,
        quantity: supplyItem.quantity,
      }));

      await prisma.supplyOnWorkOrder.createMany({
        data: supplyData,
      });

      // Refetch work order with supplies
      const workOrderWithSupplies = await prisma.workOrder.findUnique({
        where: { id: workOrder.id },
        include: {
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          vehicle: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true,
              plate: true,
              color: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          supplies: {
            include: {
              supply: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
      });

      return workOrderWithSupplies;
    }

    return workOrder;
  } catch (error) {
    logger.error("Work order creation error:", { error });
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError("Failed to create work order");
  }
};

export const getWorkOrders = async (workshopId: string) => {
  try {
    const workOrders = await prisma.workOrder.findMany({
      where: { workshopId },
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            plate: true,
            color: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        supplies: {
          include: {
            supply: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return workOrders;
  } catch (error) {
    throw new InternalServerError("Failed to get work orders");
  }
};

export const getWorkOrderById = async (
  workshopId: string,
  workOrderId: string,
) => {
  try {
    const workOrder = await prisma.workOrder.findFirst({
      where: {
        id: workOrderId,
        workshopId,
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            plate: true,
            color: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        supplies: {
          include: {
            supply: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!workOrder) {
      throw new NotFoundError("Work order not found");
    }

    return workOrder;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("Failed to get work order");
  }
};

export const updateWorkOrder = async (
  workshopId: string,
  workOrderId: string,
  data: UpdateWorkOrderDto,
) => {
  try {
    const existingWorkOrder = await prisma.workOrder.findFirst({
      where: {
        id: workOrderId,
        workshopId,
      },
    });

    if (!existingWorkOrder) {
      throw new NotFoundError("Work order not found");
    }

    const updateData: {
      mechanic?: string;
      description?: string;
      additionalNotes?: string;
      status?: OrderStatus;
      priority?: OrderPriority;
      startDate?: Date;
      total?: Decimal;
    } = {};

    if (data.mechanic !== undefined) {
      updateData.mechanic = data.mechanic;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.additionalNotes !== undefined) {
      updateData.additionalNotes = data.additionalNotes;
    }
    if (data.status !== undefined) {
      updateData.status = data.status as OrderStatus;
    }
    if (data.priority !== undefined) {
      updateData.priority = data.priority as OrderPriority;
    }
    if (data.startDate !== undefined) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.total !== undefined) {
      updateData.total = new Decimal(data.total);
    }

    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id: workOrderId },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            year: true,
            plate: true,
            color: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
          },
        },
        supplies: {
          include: {
            supply: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return updatedWorkOrder;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("Failed to update work order");
  }
};

export const deleteWorkOrder = async (workOrderId: string) => {
  try {
    const existingWorkOrder = await prisma.workOrder.findFirst({
      where: {
        id: workOrderId,
      },
    });

    if (!existingWorkOrder) {
      throw new NotFoundError("Work order not found");
    }

    // Check if work order has an invoice
    const invoice = await prisma.invoice.findUnique({
      where: { workOrderId },
    });

    if (invoice) {
      throw new BadRequestError("Cannot delete work order that has an invoice");
    }

    // Remove related supplies relations
    await prisma.supplyOnWorkOrder.deleteMany({
      where: { workOrderId },
    });

    await prisma.workOrder.delete({
      where: { id: workOrderId },
    });

    return { message: "Work order deleted successfully" };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError("Failed to delete work order");
  }
};
