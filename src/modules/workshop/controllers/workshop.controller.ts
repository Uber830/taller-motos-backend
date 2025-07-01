import { Request, Response, NextFunction } from "express";
import { workshopService } from "../services/workshop.service";
import {
  CreateWorkshopDto,
  UpdateWorkshopDto,
  UpdateWorkshopWithFileDto,
} from "../interfaces/workshop.interface";
import { AuthenticatedRequest } from "../../auth/middleware/auth"; // Adjusted path
import {
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from "../../../core/errors";
import { cloudinaryService } from "../../../core/services/cloudinary.service";

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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Updates a workshop with logo file upload.
   * Expects workshop ID as a URL parameter, form data with workshop info and logo file.
   * Only the owner of the workshop can update it.
   * @param {AuthenticatedRequest} req - The Express request object, authenticated.
   * @param {Response} res - The Express response object.
   * @param {NextFunction} next - The Express next middleware function.
   */
  async updateWorkshopWithLogo(
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
      const workshopData: UpdateWorkshopWithFileDto = req.body;

      // Get the current workshop to check if it has an existing logo
      const currentWorkshop = await workshopService.getWorkshopById(workshopId);
      if (!currentWorkshop) {
        throw new NotFoundError("Workshop not found");
      }

      let logoUrl = currentWorkshop.logo;
      let logoPublicId: string | undefined;

      // Handle logo upload if file is provided
      if (req.file) {
        try {
          // Extract public ID from current logo URL if it exists
          let oldPublicId: string | undefined;
          if (currentWorkshop.logo) {
            // Extract public ID from Cloudinary URL
            const urlParts = currentWorkshop.logo.split("/");
            const filenameWithExtension = urlParts[urlParts.length - 1];
            const filename = filenameWithExtension.split(".")[0];
            oldPublicId = `workshop-logos/${filename}`;
          }

          // Generate a unique public ID for the new image
          const newPublicId = `workshop-${workshopId}-logo-${Date.now()}`;

          // Upload new image with unique public ID
          const uploadResult = await cloudinaryService.uploadImage(
            req.file.buffer,
            "workshop-logos",
            newPublicId,
          );

          logoUrl = uploadResult.url;
          logoPublicId = uploadResult.publicId;

          // Delete old image if it exists and is different from the new one
          if (oldPublicId && oldPublicId !== logoPublicId) {
            await cloudinaryService.deleteImage(oldPublicId);
          }
        } catch (uploadError: unknown) {
          throw new InternalServerError(
            `Failed to upload logo image: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`,
          );
        }
      }

      // Prepare update data
      const updateData: UpdateWorkshopDto = {
        ...workshopData,
        ...(logoUrl && { logo: logoUrl }),
      };

      const updatedWorkshop = await workshopService.updateWorkshop(
        workshopId,
        userId,
        updateData,
      );

      res.status(200).json({
        ...updatedWorkshop,
        logoPublicId,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const workshopController = new WorkshopController();
