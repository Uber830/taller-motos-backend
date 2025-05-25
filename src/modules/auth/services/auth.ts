import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, LoginCredentials, RegisterCredentials, AuthenticatedUser, Role } from '../types/index';
import { ConflictError, UnauthorizedError, InternalServerError } from '../../../core/errors';

const prisma = new PrismaClient();

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = '24h';

    /**
   * Registers a new user.
   * @param {RegisterCredentials} credentials - User registration details.
   * @returns {Promise<User>} The created user (without password).
   * @throws {ConflictError} If the email is already registered.
   * @throws {InternalServerError} For other unexpected errors.
   */
  async register(credentials: RegisterCredentials): Promise<User> {
    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    try {
      return await prisma.user.create({
        data: {
          sessionFacebook: credentials.sessionFacebook,
          sessionGoogle: credentials.sessionGoogle,
          email: credentials.email,
          password: hashedPassword,
          fullName: credentials.fullName,
          role: credentials.role,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictError('Email already exists');
      }
      // Re-throw any other unexpected errors
      throw new InternalServerError('Failed to register user');
    }
  }

  /**
   * Logs in a user.
   * @param {LoginCredentials} credentials - User login details.
   * @returns {Promise<string>} The authentication token.
   * @throws {UnauthorizedError} If credentials are invalid.
   */
  async login(credentials: LoginCredentials): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      AuthService.JWT_SECRET,
      { expiresIn: AuthService.JWT_EXPIRES_IN }
    );

    return token
  }

  /**
   * Validates a JWT token and returns the authenticated user.
   * @param {string} token - The JWT token.
   * @returns {Promise<AuthenticatedUser>} The authenticated user.
   * @throws {UnauthorizedError} If the token is invalid or expired.
   */
  async validateToken(token: string): Promise<AuthenticatedUser> {
    try {
      const decoded = jwt.verify(token, AuthService.JWT_SECRET) as { userId: string; role: Role };
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return {
        ...user,
        token,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
}
