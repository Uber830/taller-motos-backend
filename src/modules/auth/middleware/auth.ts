import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../user/types/user.types";

import { validateToken } from "../services/auth";

import { AuthenticatedUser } from "../types";

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  workshopId?: string;
  userRole?: UserRole;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("No token provided");
    }

    const user = await validateToken(token);

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};
