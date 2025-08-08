import { Request, Response, NextFunction } from "express";
import { customerService } from "../services/customer.service";
import {
    CreateCustomerDto,
    UpdateCustomerDto,
} from "../interfaces/customer.interface";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { NotFoundError } from "../../../core/errors";

/**
 * Controller for customer management
 * @module customer/controller
 * @category Controllers
 */
class CustomerController {
    /**
     * Creates a new customer for a workshop.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async createCustomer(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;
            const customerData: CreateCustomerDto = req.body;
            const newCustomer = await customerService.createCustomer(
                userId,
                customerData,
            );

            res.status(201).json(newCustomer);
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Gets all customers for the authenticated user's workshop.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async getCustomers(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;
            const customers = await customerService.getCustomersByWorkshop(userId);
            res.status(200).json(customers);
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Gets a specific customer by ID.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async getCustomerById(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { id } = req.params;
            const customer = await customerService.getCustomerById(id);
            if (!customer) {
                throw new NotFoundError("Customer not found");
            }
            res.status(200).json(customer);
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Updates a customer.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async updateCustomer(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;

            const { id: customerId } = req.params;
            const customerData: UpdateCustomerDto = req.body;

            const updatedCustomer = await customerService.updateCustomer(
                customerId,
                userId,
                customerData,
            );

            res.status(200).json(updatedCustomer);
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Deletes a customer.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async deleteCustomer(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;

            const { id: customerId } = req.params;
            await customerService.deleteCustomer(customerId, userId);

            res.status(200).json({ message: "Customer deleted successfully" });
        } catch (error: unknown) {
            next(error);
        }
    }

    /**
     * Gets customer statistics for the workshop.
     * @param {AuthenticatedRequest} req - The Express request object, authenticated.
     * @param {Response} res - The Express response object.
     * @param {NextFunction} next - The Express next middleware function.
     */
    async getCustomerStats(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const userId = req.user!.id;

            const stats = await customerService.getCustomerStats(userId);
            res.status(200).json(stats);
        } catch (error: unknown) {
            next(error);
        }
    }
}

export const customerController = new CustomerController(); 