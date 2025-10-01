import { Request, Response, NextFunction } from "express";
import {
  createVehicle,
  getCustomerVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../services/customer-vehicle.service";
import {
  CreateVehicleDto,
  UpdateVehicleDto,
} from "../types/customer-vehicle.types";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { NotFoundError } from "../../../core/errors";

/**
 * Controller for customer vehicle management
 * @module customer/controller/vehicle
 * @category Controllers
 */

/**
 * Creates a new vehicle for a customer.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const createVehicleController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { customerId } = req.params as { customerId: string };
    const vehicleData: CreateVehicleDto = req.body as CreateVehicleDto;

    const newVehicle = await createVehicle(userId, customerId, vehicleData);
    res.status(201).json(newVehicle);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Gets all vehicles for a specific customer.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getCustomerVehiclesController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { customerId } = req.params as { customerId: string };
    const vehicles = await getCustomerVehicles(userId, customerId);
    res.status(200).json(vehicles);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Gets a specific vehicle by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getVehicleByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    if (!id) {
      res.status(400).json({ message: "Vehicle ID is required" });
      return;
    }

    const vehicle = await getVehicleById(id);
    if (!vehicle) {
      throw new NotFoundError("Vehicle not found");
    }
    res.status(200).json(vehicle);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates a vehicle.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const updateVehicleController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { id: vehicleId } = req.params as { id: string };
    const vehicleData: UpdateVehicleDto = req.body as UpdateVehicleDto;

    const updatedVehicle = await updateVehicle(vehicleId, userId, vehicleData);

    res.status(200).json(updatedVehicle);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a vehicle.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const deleteVehicleController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { id: vehicleId } = req.params as { id: string };
    await deleteVehicle(vehicleId, userId);

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error: unknown) {
    next(error);
  }
};
