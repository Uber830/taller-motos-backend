import { Router } from "express";

import { AdminController } from "./controllers/admin-controller";

const router = Router();
const adminController = new AdminController();

// Admin routes
router.post("/assign-role", (req, res) => adminController.assignRole(req, res));
router.delete("/users/:userId", (req, res) =>
  adminController.deleteUser(req, res),
);
router.get("/dashboard", (req, res) =>
  adminController.getDashboardStats(req, res),
);

export default router;
