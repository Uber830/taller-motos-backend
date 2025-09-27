import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { UserRole } from "../../user/types/user.types";

const prisma = new PrismaClient();

/**
 * Middleware to determine workshop access for the authenticated user
 * Handles both workshop owners and employees
 */
export const workshopAccessMiddleware = async (
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

    // First check if user is a workshop owner
    const userWithWorkshop = await prisma.user.findUnique({
      where: { id: userId },
      include: { ownedWorkshop: true },
    });

    if (userWithWorkshop?.ownedWorkshop) {
      // User is a workshop owner
      req.workshopId = userWithWorkshop.ownedWorkshop.id;
      req.userRole = UserRole.OWNER;
      return next();
    }

    // If not owner, check if user is an employee
    const employeeInfo = await prisma.workshopEmployeeInfo.findFirst({
      where: {
        email: userWithWorkshop?.email,
        active: true,
      },
    });

    if (employeeInfo) {
      // User is a workshop employee
      req.workshopId = employeeInfo.workshopId;
      req.userRole = UserRole.EMPLOYEE;
      return next();
    }

    // User has no workshop access
    res.status(403).json({
      message: "User does not have access to any workshop",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error determining workshop access",
    });
  }
};
