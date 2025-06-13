import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth";
import { loginSchema, registerSchema } from "../validators/auth";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = registerSchema.parse(req.body);
      const user = await authService.register(credentials);

      res.status(201).json({
        message: "User registered successfully",
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
        ? res.json({
            message: `${credentials.session_network} login successful`,
            habeas_data,
            token,
          })
        : res.json({
            message: "Login successful",
            token,
          });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
