export type Role = "ADMIN" | "OWNER" | "MECHANIC";

export interface User {
  id: string;
  sessionFacebook: boolean;
  sessionGoogle: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  habeas_data: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  sessionFacebook: boolean;
  sessionGoogle: boolean;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  habeas_data: boolean;
}

export interface AuthToken {
  token: string;
}

export interface AuthenticatedUser extends Omit<User, "password"> {
  token: string;
}
