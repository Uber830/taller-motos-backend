import { Request, Response } from "express";

import { AdminService } from "../services";
import { assignRoleSchema, deleteUserSchema } from "../validators";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  assignRole(req: Request, res: Response): void {
    try {
      const params = assignRoleSchema.parse(req.body);
      // await this.adminService.assignRole(params);
      res.json({ message: "Role assigned successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ error: errorMessage });
    }
  }

  deleteUser(req: Request, res: Response): void {
    try {
      const params = deleteUserSchema.parse(req.params);
      // await this.adminService.deleteUser(params);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ error: errorMessage });
    }
  }

  getDashboardStats(req: Request, res: Response): void {
    try {
      // const stats = await this.adminService.getDashboardStats();
      // res.json(stats);
      res.json({ message: "Dashboard stats fetched successfully" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({ error: errorMessage });
    }
  }
}
