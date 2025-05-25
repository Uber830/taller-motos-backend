import { Request, Response } from 'express';
import { AdminService } from '../services';
import { assignRoleSchema, deleteUserSchema } from '../validators';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async assignRole(req: Request, res: Response) {
    try {
      const params = assignRoleSchema.parse(req.body);
      await this.adminService.assignRole(params);
      res.json({ message: 'Role assigned successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const params = deleteUserSchema.parse(req.params);
      await this.adminService.deleteUser(params);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await this.adminService.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
