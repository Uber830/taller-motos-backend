import { Router } from "express";
import {
  getMeController,
  updateMeController,
} from "./controllers/user.controller";
import { authMiddleware } from "../auth/middleware/auth";
import { validateRequest } from "../../core/middleware/validate-request.middleware";
import { updateUserSchema } from "./validators/user.validator";

const router = Router();

router.use(authMiddleware);

router
  .route("/me")
  .get(getMeController)
  .patch(validateRequest(updateUserSchema), updateMeController);

export default router;
