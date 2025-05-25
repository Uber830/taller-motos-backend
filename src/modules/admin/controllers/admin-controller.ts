import { Request, Response } from 'express';
import { AdminService } from '../services';
import { AssignRoleParams, DeleteUserParams } from '../validators';

export class AdminController {
  private readonly adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async assignRole(req: Request, res: Response): Promise<void> {
    try {
      const params = req.body as AssignRoleParams;
      await this.adminService.assignRole(params);
      res.status(200).json({ message: 'Role assigned successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to assign role' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const params = { userId: req.params.userId } as DeleteUserParams;
      await this.adminService.deleteUser(params);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete user' });
    }
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.adminService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  }
}
