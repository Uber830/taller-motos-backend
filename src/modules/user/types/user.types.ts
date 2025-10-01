export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  avatar?: string | null;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  // Agrega otros campos relevantes según tu modelo de usuario
}

export enum UserRole {
  OWNER = "OWNER",
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

// Optionally, you can add the role to the User interface if needed:
export interface UserWithRole extends User {
  role: UserRole;
}
