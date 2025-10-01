import { Response, NextFunction } from "express";
import {
  createCustomer,
  getCustomersByWorkshop,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
} from "../services/customer.service";
import { CreateCustomerDto, UpdateCustomerDto } from "../types/customer.types";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { NotFoundError } from "../../../core/errors";

/**
 * Controller for customer management
 * @module customer/controller
 * @category Controllers
 */

/**
 * Creates a new customer for a workshop.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const createCustomerController = async (
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

    const customerData: CreateCustomerDto = req.body as CreateCustomerDto;
    const newCustomer = await createCustomer(userId, customerData);

    res.status(201).json(newCustomer);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Gets all customers for the authenticated user's workshop.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getCustomersController = async (
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

    const customers = await getCustomersByWorkshop(userId);
    res.status(200).json(customers);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Gets a specific customer by ID.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getCustomerByIdController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    if (!id) {
      res.status(400).json({ message: "Customer ID is required" });
      return;
    }

    const customer = await getCustomerById(id);
    if (!customer) {
      throw new NotFoundError("Customer not found");
    }
    res.status(200).json(customer);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates a customer.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const updateCustomerController = async (
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

    const { id: customerId } = req.params as { id: string };
    const customerData: UpdateCustomerDto = req.body as UpdateCustomerDto;

    const updatedCustomer = await updateCustomer(
      customerId,
      userId,
      customerData,
    );

    res.status(200).json(updatedCustomer);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Deletes a customer.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const deleteCustomerController = async (
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

    const { id: customerId } = req.params as { id: string };
    await deleteCustomer(customerId, userId);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Gets customer statistics for the workshop.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getCustomerStatsController = async (
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

    const stats = await getCustomerStats(userId);
    res.status(200).json(stats);
  } catch (error: unknown) {
    next(error);
  }
};
