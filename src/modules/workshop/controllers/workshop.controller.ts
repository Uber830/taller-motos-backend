import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  createWorkshop,
  getWorkshopByOwner,
  getWorkshopById,
  updateWorkshop,
} from "../services/workshop.service";
import {
  CreateWorkshopDto,
  UpdateWorkshopDto,
  UpdateWorkshopWithFileDto,
} from "../interfaces/workshop.interface";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
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

/**
 * Creates a new workshop.
 * Expects workshop data in the request body and the user ID from an authenticated request.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const createWorkshopController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }
    const workshopData = req.body as CreateWorkshopDto;
    const newWorkshop = await createWorkshop(userId, workshopData);
    res.status(201).json(newWorkshop);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Gets the workshop owned by the authenticated user.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getMyWorkshopController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }
    const workshop = await getWorkshopByOwner(userId);
    if (!workshop) {
      throw new NotFoundError("Workshop not found for this user");
    }
    res.status(200).json(workshop);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Gets a workshop by its ID.
 * Expects workshop ID as a URL parameter.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const getWorkshopByIdController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const workshop = await getWorkshopById(id);
    if (!workshop) {
      throw new NotFoundError("Workshop not found");
    }
    res.status(200).json(workshop);
  } catch (error: unknown) {
    next(error);
  }
};

/**
 * Updates a workshop with logo file upload.
 * Expects workshop ID as a URL parameter, form data with workshop info and logo file.
 * Only the owner of the workshop can update it.
 * @param {AuthenticatedRequest} req - The Express request object, authenticated.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export const updateWorkshopWithLogoController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }

    const { id: workshopId } = req.params;
    const workshopData = req.body as UpdateWorkshopWithFileDto;

    // Get the current workshop to check if it has an existing logo
    const currentWorkshop = await getWorkshopById(workshopId);
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

    const updatedWorkshop = await updateWorkshop(
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
};
