import { Router } from "express";
import { authController } from "./controllers/auth";
import { authMiddleware } from "./middleware/auth";

const router = Router();

// Route auth
router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch("/me", authMiddleware, authController.updateMe);

export default router;
