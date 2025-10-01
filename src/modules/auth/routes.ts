import { Router } from "express";
import {
  registerController,
  loginController,
  updateMeController,
} from "./controllers/auth";
import { authMiddleware } from "./middleware/auth";

const router = Router();

// Route auth
router.post("/register", registerController);
router.post("/login", loginController);
router.patch("/me", authMiddleware, updateMeController);

export default router;
