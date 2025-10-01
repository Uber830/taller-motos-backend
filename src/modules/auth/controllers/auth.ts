import { NextFunction, Request, Response, RequestHandler } from "express";

import { register, login, updateUser, generateToken } from "../services/auth";
import {
  loginSchema,
  registerSchema,
  updateMeSchema,
} from "../validators/auth";

export const registerController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const credentials = registerSchema.parse(req.body);
    const result = await register(credentials);

    const isSocialRegistration =
      credentials.sessionFacebook || credentials.sessionGoogle;

    // Handle case where user already exists but is trying to register with social provider
    if (result.isExistingUser && isSocialRegistration) {
      const token = generateToken(result.user.id);
      res.status(200).json({
        message: "User already exists, continuing registration process",
        user: { ...result.user, password: undefined },
        token,
        isExistingUser: true,
      });
      return;
    }

    // Generate token for social registration
    if (isSocialRegistration) {
      const token = generateToken(result.user.id);
      res.status(201).json({
        message: "User registered successfully (social)",
        user: { ...result.user, password: undefined },
        token,
      });
      return;
    }

    // Traditional registration (without token)
    res.status(201).json({
      message: "User registered successfully",
      user: { ...result.user, password: undefined },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const credentials = loginSchema.parse(req.body);
    const { habeas_data, token } = await login(credentials);

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
};

export const updateMeController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as { user?: { id: string } }).user?.id;
    if (!userId) throw new Error("Unauthorized");

    // Validate and filter the fields that can be updated
    const updates = updateMeSchema.parse(req.body);
    const updatedUser = await updateUser(userId, updates);
    res.status(200).json({
      message: "User updated successfully",
      user: { ...updatedUser, password: undefined },
    });
  } catch (error) {
    next(error);
  }
};
