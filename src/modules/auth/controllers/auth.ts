import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth";
import { loginSchema, registerSchema, updateMeSchema } from "../validators/auth";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = registerSchema.parse(req.body);
      const user = await authService.register(credentials);

      const isSocialRegistration = credentials.sessionFacebook || credentials.sessionGoogle;
      const message = isSocialRegistration
        ? "User registered successfully (social)"
        : "User registered successfully";
       
      // Generate token for social registration
      if (isSocialRegistration) {
        const token = authService.generateToken(user.id);
        res.status(201).json({
          message,
          user: { ...user, password: undefined },
          token,
        });
        return;
      }

      // Traditional registration (without token)
      res.status(201).json({
        message,
        user: { ...user, password: undefined },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = loginSchema.parse(req.body);
      const { habeas_data, token } = await authService.login(credentials);

      credentials?.session_network
        ? res.status(200).json({
          message: `${credentials.session_network} login successful`,
          habeas_data,
          token,
        })
        : res.status(200).json({
          message: "Login successful",
          token,
        });
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) throw new Error("Unauthorized");

      // Validate and filter the fields that can be updated
      const updates = updateMeSchema.parse(req.body);
      const updatedUser = await authService.updateUser(userId, updates);
      res.status(200).json({
        message: "User updated successfully",
        user: { ...updatedUser, password: undefined },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
