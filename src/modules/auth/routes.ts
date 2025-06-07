import { Router } from "express";
import { authController } from "./controllers/auth";

const router = Router();

// Route auth
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
