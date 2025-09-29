import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} from "../../../core/errors";
import { CreateSupplyDto, UpdateSupplyDto } from "../types/supply.types";

const prisma = new PrismaClient();

export const createSupply = async (
  workshopId: string,
  data: CreateSupplyDto,
) => {
  try {
    const supplyData = {
      name: data.name,
      description: data.description,
      price: new Decimal(data.price),
      stock: data.stock,
      workshopId,
    };

    const supply = await prisma.supply.create({
      data: supplyData,
    });
    return supply;
  } catch (error) {
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError("Failed to create supply");
  }
};

export const getSupplies = async (workshopId: string) => {
  try {
    const supplies = await prisma.supply.findMany({
      where: {
        workshopId,
      },
      orderBy: { createdAt: "desc" },
    });

    return supplies;
  } catch (error) {
    throw new InternalServerError("Failed to get supplies");
  }
};

export const getSupplyById = async (workshopId: string, supplyId: string) => {
  try {
    const supply = await prisma.supply.findFirst({
      where: {
        id: supplyId,
        workshopId,
      },
    });

    if (!supply) {
      throw new NotFoundError("Supply not found");
    }

    return supply;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("Failed to get supply");
  }
};

export const updateSupply = async (
  workshopId: string,
  supplyId: string,
  data: UpdateSupplyDto,
) => {
  try {
    // First check if supply exists and belongs to workshop
    const existingSupply = await prisma.supply.findFirst({
      where: {
        id: supplyId,
        workshopId,
      },
    });

    if (!existingSupply) {
      throw new NotFoundError("Supply not found");
    }

    const updateData: {
      name?: string;
      description?: string;
      price?: Decimal;
      stock?: number;
    } = {
      name: data.name,
      description: data.description,
      stock: data.stock,
    };

    if (data.price !== undefined) {
      updateData.price = new Decimal(data.price);
    }

    const updatedSupply = await prisma.supply.update({
      where: { id: supplyId },
      data: updateData,
    });

    return updatedSupply;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError("Failed to update supply");
  }
};

export const deleteSupply = async (workshopId: string, supplyId: string) => {
  try {
    // First check if supply exists and belongs to workshop
    const existingSupply = await prisma.supply.findFirst({
      where: {
        id: supplyId,
        workshopId,
      },
    });

    if (!existingSupply) {
      throw new NotFoundError("Supply not found");
    }

    // Check if supply is being used in any work orders
    const workOrdersCount = await prisma.supplyOnWorkOrder.count({
      where: { supplyId },
    });

    if (workOrdersCount > 0) {
      throw new BadRequestError(
        "Cannot delete supply that is being used in work orders",
      );
    }

    await prisma.supply.delete({
      where: { id: supplyId },
    });

    return { message: "Supply deleted successfully" };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    throw new InternalServerError("Failed to delete supply");
  }
};
