import { PrismaClient } from "@prisma/client";
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleWithCustomer,
} from "../types/customer-vehicle.types";
import {
  ConflictError,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../../core/errors";

/**
 * Service for customer vehicle management
 * @module customer/service/vehicle
 * @category Services
 */

const prisma = new PrismaClient();

/**
 * Gets the workshop ID for a given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string>} The workshop ID.
 * @throws {NotFoundError} If the user doesn't own a workshop.
 */
const getWorkshopIdByUserId = async (userId: string): Promise<string> => {
  const workshop = await prisma.workshop.findUnique({
    where: { ownerId: userId },
    select: { id: true },
  });

  if (!workshop) {
    throw new NotFoundError("Workshop not found for this user");
  }

  return workshop.id;
};

/**
 * Validates if the user has access to the customer.
 * @param {string} customerId - The ID of the customer.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} If the user doesn't have access.
 */
const validateCustomerAccess = async (
  customerId: string,
  userId: string,
): Promise<void> => {
  const workshopId = await getWorkshopIdByUserId(userId);

  const customer = await prisma.customer.findFirst({
    where: {
      id: customerId,
      workshopId,
    },
  });

  if (!customer) {
    throw new ForbiddenError("Customer not found in your workshop");
  }
};

/**
 * Validates if the user has access to the vehicle.
 * @param {string} vehicleId - The ID of the vehicle.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} If the user doesn't have access.
 */
const validateVehicleAccess = async (
  vehicleId: string,
  userId: string,
): Promise<void> => {
  const workshopId = await getWorkshopIdByUserId(userId);

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      id: vehicleId,
      customer: {
        workshopId,
      },
    },
  });

  if (!vehicle) {
    throw new ForbiddenError("Vehicle not found in your workshop");
  }
};

/**
 * Creates a new vehicle for a customer.
 * @param {string} userId - The ID of the user creating the vehicle.
 * @param {string} customerId - The ID of the customer.
 * @param {CreateVehicleDto} vehicleData - The vehicle data.
 * @returns {Promise<VehicleWithCustomer>} The created vehicle.
 * @throws {ConflictError} If a vehicle with the same plate already exists.
 * @throws {BadRequestError} If the customer already has 3 vehicles.
 */
export const createVehicle = async (
  userId: string,
  customerId: string,
  vehicleData: CreateVehicleDto,
): Promise<VehicleWithCustomer> => {
  await validateCustomerAccess(customerId, userId);

  // Check vehicle limit (maximum 3 vehicles per customer)
  const customerVehicleCount = await prisma.vehicle.count({
    where: { customerId },
  });

  if (customerVehicleCount >= 3)
    throw new BadRequestError(
      "Customer has reached the maximum limit of 3 vehicles",
    );

  // Check if vehicle with same plate already exists in this workshop
  const workshopId = await getWorkshopIdByUserId(userId);
  const existingVehicle = await prisma.vehicle.findFirst({
    where: {
      plate: vehicleData.plate,
      customer: {
        workshopId,
      },
    },
  });

  if (existingVehicle)
    throw new ConflictError(
      "A vehicle with this plate already exists in your workshop",
    );

  // Validate year is not in the future
  // const currentYear = new Date().getFullYear();
  // if (vehicleData.year > currentYear + 1) throw new BadRequestError("Vehicle year cannot be in the future");

  const vehicle = await prisma.vehicle.create({
    data: {
      ...vehicleData,
      customer: {
        connect: { id: customerId },
      },
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
      _count: {
        select: {
          workOrders: true,
        },
      },
    },
  });

  return vehicle as VehicleWithCustomer;
};

/**
 * Gets all vehicles for a specific customer.
 * @param {string} userId - The ID of the user.
 * @param {string} customerId - The ID of the customer.
 * @returns {Promise<VehicleWithCustomer[]>} The vehicles.
 */
export const getCustomerVehicles = async (
  userId: string,
  customerId: string,
): Promise<VehicleWithCustomer[]> => {
  await validateCustomerAccess(customerId, userId);

  const vehicles = await prisma.vehicle.findMany({
    where: {
      customerId,
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
      _count: {
        select: {
          workOrders: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return vehicles as VehicleWithCustomer[];
};

/**
 * Gets a specific vehicle by ID.
 * @param {string} vehicleId - The ID of the vehicle.
 * @returns {Promise<VehicleWithCustomer | null>} The vehicle or null if not found.
 */
export const getVehicleById = async (
  vehicleId: string,
): Promise<VehicleWithCustomer | null> => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      _count: {
        select: {
          workOrders: true,
        },
      },
    },
  });

  return vehicle as VehicleWithCustomer | null;
};

/**
 * Updates a vehicle.
 * @param {string} vehicleId - The ID of the vehicle to update.
 * @param {string} userId - The ID of the user performing the update.
 * @param {UpdateVehicleDto} vehicleData - The data to update.
 * @returns {Promise<VehicleWithCustomer>} The updated vehicle.
 * @throws {ForbiddenError} If the user doesn't have access to the vehicle.
 * @throws {ConflictError} If the plate already exists.
 */
export const updateVehicle = async (
  vehicleId: string,
  userId: string,
  vehicleData: UpdateVehicleDto,
): Promise<VehicleWithCustomer> => {
  await validateVehicleAccess(vehicleId, userId);

  const workshopId = await getWorkshopIdByUserId(userId);

  // Check for conflicts if plate is being updated
  if (vehicleData.plate) {
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        plate: vehicleData.plate,
        customer: {
          workshopId,
        },
        id: { not: vehicleId },
      },
    });

    if (existingVehicle)
      throw new ConflictError(
        "A vehicle with this plate already exists in your workshop",
      );
  }

  const vehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: vehicleData,
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
      _count: {
        select: {
          workOrders: true,
        },
      },
    },
  });

  return vehicle as VehicleWithCustomer;
};

/**
 * Deletes a vehicle.
 * @param {string} vehicleId - The ID of the vehicle to delete.
 * @param {string} userId - The ID of the user performing the deletion.
 * @returns {Promise<void>}
 * @throws {ForbiddenError} If the user doesn't have access to the vehicle.
 * @throws {BadRequestError} If the vehicle has associated work orders.
 */
export const deleteVehicle = async (
  vehicleId: string,
  userId: string,
): Promise<void> => {
  await validateVehicleAccess(vehicleId, userId);

  // Check if vehicle has work orders
  const vehicleWithWorkOrders = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      _count: {
        select: {
          workOrders: true,
        },
      },
    },
  });

  if (vehicleWithWorkOrders && vehicleWithWorkOrders._count.workOrders > 0) {
    throw new BadRequestError(
      "Cannot delete vehicle with associated work orders",
    );
  }

  // Delete vehicle
  await prisma.vehicle.delete({
    where: { id: vehicleId },
  });
};
