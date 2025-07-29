import { Router } from "express";
import { userController } from "./controllers/user.controller";
import { authMiddleware } from "../auth/middleware/auth";
import { validateRequest } from "../../core/middleware/validate-request.middleware";
import { updateUserSchema } from "./validators/user.validator";

const router = Router();

router.patch("/me", authMiddleware, validateRequest(updateUserSchema), userController.updateMe);

export default router;