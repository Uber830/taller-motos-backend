import { Request, Response, NextFunction } from "express";
import { workshopService } from "../services/workshop.service";
import {
  CreateWorkshopDto,
  UpdateWorkshopDto,
} from "../interfaces/workshop.interface";
import { AuthenticatedRequest } from "../../auth/middleware/auth"; // Adjusted path
import { UnauthorizedError, NotFoundError } from "../../../core/errors";

/**
 * Controller for workshop management
 * @module workshop/controller
 * @category Controllers
 */
class WorkshopController {
  /**
   * Creates a new workshop.
   * Expects workshop data in the request body and the user ID from an authenticated request.
   * @param {AuthenticatedRequest} req - The Express request object, authenticated.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  async createWorkshop(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError("User not authenticated");
      }
      const workshopData: CreateWorkshopDto = req.body;
      const newWorkshop = await workshopService.createWorkshop(
        userId,
        workshopData,
      );
      res.status(201).json(newWorkshop);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets the workshop owned by the authenticated user.
   * @param {AuthenticatedRequest} req - The Express request object, authenticated.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  async getMyWorkshop(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError("User not authenticated");
      }
      const workshop = await workshopService.getWorkshopByOwner(userId);
      if (!workshop) {
        throw new NotFoundError("Workshop not found for this user");
      }
      res.status(200).json(workshop);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets a workshop by its ID.
   * Expects workshop ID as a URL parameter.
   * @param {Request} req - The Express request object.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  async getWorkshopById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const workshop = await workshopService.getWorkshopById(id);
      if (!workshop) {
        throw new NotFoundError("Workshop not found");
      }
      res.status(200).json(workshop);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a workshop.
   * Expects workshop ID as a URL parameter and update data in the request body.
   * Only the owner of the workshop can update it.
   * @param {AuthenticatedRequest} req - The Express request object, authenticated.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  async updateWorkshop(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new UnauthorizedError("User not authenticated");
      }
      const { id: workshopId } = req.params;
      const workshopData: UpdateWorkshopDto = req.body;
      const updatedWorkshop = await workshopService.updateWorkshop(
        workshopId,
        userId,
        workshopData,
      );
      res.status(200).json(updatedWorkshop);
    } catch (error) {
      next(error);
    }
  }
}

export const workshopController = new WorkshopController();
