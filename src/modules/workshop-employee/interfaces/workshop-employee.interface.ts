import { EmployeeRole } from '@prisma/client';

export interface CreateWorkshopEmployeeDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: EmployeeRole;
}

export interface UpdateWorkshopEmployeeDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: EmployeeRole;
}

export interface SetWorkshopEmployeeStatusDto {
  active: boolean;
}
