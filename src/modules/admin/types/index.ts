import { User } from "@/src/modules/auth/types";

export type AdminAction =
  | "CREATE_USER"
  | "DELETE_USER"
  | "UPDATE_USER"
  | "ASSIGN_ROLE";

export interface AdminUser extends User {
  lastLogin: Date;
  actions: AdminAction[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalMechanics: number;
  totalOwners: number;
  recentActions: AdminAction[];
}
