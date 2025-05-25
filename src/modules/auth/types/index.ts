export type Role = 'ADMIN' | 'OWNER' | 'MECHANIC';

export interface User {
  id: string;
  sessionFacebook: number;
  sessionGoogle: number;
  email: string;
  password: string;
  fullName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  sessionFacebook: number;
  sessionGoogle: number;
  email: string;
  password: string;
  fullName: string;
  role: Role;
}

export interface AuthToken {
  token: string;
}

export interface AuthenticatedUser extends Omit<User, 'password'> {
  token: string;
}
