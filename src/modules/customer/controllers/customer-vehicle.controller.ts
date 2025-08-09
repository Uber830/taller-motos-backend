import { Request, Response, NextFunction } from "express";
import { customerVehicleService } from "../services/customer-vehicle.service";
import {
    CreateVehicleDto,
    UpdateVehicleDto,
} from "../interfaces/customer-vehicle.interface";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { NotFoundError } from "../../../core/errors";

/**
 * Controller for customer vehicle management
 * @module customer/controller/vehicle
 * @category Controllers
 */
class CustomerVehicleController {
    /**
     * Creates a new vehicle for a customer.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async createVehicle(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;

            const { customerId } = req.params;
            const vehicleData: CreateVehicleDto = req.body;

            const newVehicle = await customerVehicleService.createVehicle(
                userId,
                customerId,
                vehicleData,
            );
            res.status(201).json(newVehicle);
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Gets all vehicles for a specific customer.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async getCustomerVehicles(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;

            const { customerId } = req.params;
            const vehicles = await customerVehicleService.getCustomerVehicles(
                userId,
                customerId,
            );
            res.status(200).json(vehicles);
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Gets a specific vehicle by ID.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async getVehicleById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { id } = req.params;
            const vehicle = await customerVehicleService.getVehicleById(id);
            if (!vehicle) {
                throw new NotFoundError("Vehicle not found");
            }
            res.status(200).json(vehicle);
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Updates a vehicle.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async updateVehicle(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;

            const { id: vehicleId } = req.params;
            const vehicleData: UpdateVehicleDto = req.body;

            const updatedVehicle = await customerVehicleService.updateVehicle(
                vehicleId,
                userId,
                vehicleData,
            );

            res.status(200).json(updatedVehicle);
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Deletes a vehicle.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async deleteVehicle(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;

            const { id: vehicleId } = req.params;
            await customerVehicleService.deleteVehicle(vehicleId, userId);

            res.status(200).json({ message: "Vehicle deleted successfully" });
        } catch (error: unknown) {
            next(error);
        }
    }
}

export const customerVehicleController = new CustomerVehicleController();
