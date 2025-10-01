import { Response, NextFunction, RequestHandler } from "express";
import { updateUser, getUserById } from "../services/user.service";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { UpdateUserDto } from "../types/user.types";

export const updateMeController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const body = req.body as UpdateUserDto;

    // Convert dateOfBirth string to Date if provided
    if (body.dateOfBirth && typeof body.dateOfBirth === "string") {
      body.dateOfBirth = new Date(body.dateOfBirth);
    }

    const updatedUser = await updateUser(userId, body);
    res.status(200).json(updatedUser);
  } catch (error: unknown) {
    next(error);
  }
};

export const getMeController: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error: unknown) {
    next(error);
  }
};
