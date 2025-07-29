import { Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import { AuthenticatedRequest } from "../../auth/middleware/auth";
import { UpdateUserDto } from "../types/user.types";

export class UserController {
    async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = String(req.user?.id);
            const updatedUser = await userService.updateUser(userId, req.body as UpdateUserDto);
            res.status(200).json(updatedUser);
        } catch (error: unknown) {
            next(  error);
        }
    }
}

export const userController = new UserController();