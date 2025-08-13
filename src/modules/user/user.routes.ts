import { Router } from "express";
import { userController } from "./controllers/user.controller";
import { authMiddleware } from "../auth/middleware/auth";
import { validateRequest } from "../../core/middleware/validate-request.middleware";
import { updateUserSchema } from "./validators/user.validator";

const router = Router();

router.use(authMiddleware);

router
  .route("/me")
  .get(userController.getMe)
  .patch(validateRequest(updateUserSchema), userController.updateMe);

export default router; 