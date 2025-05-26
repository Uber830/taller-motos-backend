import { NextFunction, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    role: string;
  };
}

export const adminMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const user = req.user;

  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
};
