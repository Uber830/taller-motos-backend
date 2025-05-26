import { PrismaClient, Role } from "@prisma/client";

import { AdminAction, AdminDashboardStats } from "../types";
import { AssignRoleParams, DeleteUserParams } from "../validators";

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
    const [totalUsers, totalMechanics, totalOwners, recentActions] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: Role.MECHANIC } }),
        prisma.user.count({ where: { role: Role.OWNER } }),
        prisma.user.findMany({
          where: { role: Role.ADMIN },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    return {
      totalUsers,
      totalMechanics,
      totalOwners,
      recentActions: recentActions.map(() => "UPDATE_USER" as AdminAction),
    };
  }
}
