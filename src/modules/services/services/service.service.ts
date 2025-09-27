import { PrismaClient } from "@prisma/client";
import {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} from "../../../core/errors";
import { CreateServiceDto, UpdateServiceDto } from "../types/service.types";

const prisma = new PrismaClient();

export const createService = async (
  workshopId: string,
  data: CreateServiceDto,
) => {
  try {
    const serviceData = {
      name: data.name,
      workshopId,
    };

    const service = await prisma.service.create({
      data: serviceData,
    });
    return service;
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError("Failed to create service");
  }
};

export const getServices = async (workshopId: string) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        workshopId,
      },
      orderBy: { createdAt: "desc" },
    });

    return services;
  } catch (error) {
    throw new InternalServerError("Failed to get services");
  }
};

export const getServiceById = async (workshopId: string, serviceId: string) => {
  try {
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        workshopId,
      },
    });

    if (!service) {
      throw new NotFoundError("Service not found");
    }

    return service;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("Failed to get service");
  }
};

export const updateService = async (
  workshopId: string,
  serviceId: string,
  data: UpdateServiceDto,
) => {
  try {
    // First check if service exists and belongs to workshop
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        workshopId,
      },
    });

    if (!existingService) {
      throw new NotFoundError("Service not found");
    }

    const updateData: { name?: string } = { name: data.name };

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: updateData,
    });

    return updatedService;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("Failed to update service");
  }
};

export const deleteService = async (workshopId: string, serviceId: string) => {
  try {
    // First check if service exists and belongs to workshop
    const existingService = await prisma.service.findFirst({
      where: {
        id: serviceId,
        workshopId,
      },
    });

    if (!existingService) {
      throw new NotFoundError("Service not found");
    }

    // It's okay if services are referenced by work orders; they are simple types
    await prisma.service.delete({
      where: { id: serviceId },
    });

    return { message: "Service deleted successfully" };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError("Failed to delete service");
  }
};
