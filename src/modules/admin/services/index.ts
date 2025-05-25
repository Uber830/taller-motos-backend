import { PrismaClient } from '@prisma/client';
import { AssignRoleParams, DeleteUserParams } from '../validators';
import { AdminDashboardStats } from '../types';

const prisma = new PrismaClient();

export class AdminService {
  async assignRole(params: AssignRoleParams): Promise<void> {
    await prisma.user.update({
      where: { id: params.userId },
      data: { role: params.role },
    });
  }

  async deleteUser(params: DeleteUserParams): Promise<void> {
    await prisma.user.delete({
      where: { id: params.userId },
    });
  }

  async getDashboardStats(): Promise<AdminDashboardStats> {
    const [totalUsers, totalMechanics, totalReceptionists, recentActions] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'MECHANIC' } }),
      prisma.user.count({ where: { role: 'RECEPTIONIST' } }),
      prisma.user.findMany({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      totalUsers,
      totalMechanics,
      totalReceptionists,
      recentActions: recentActions.map(user => user.role),
    };
  }
}
