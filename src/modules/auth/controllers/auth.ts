import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth';
import { loginSchema, registerSchema } from '../validators/auth';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = registerSchema.parse(req.body);
      const user = await this.authService.register(credentials);
      
      res.status(201).json({
        message: 'User registered successfully',
        user: { ...user, password: undefined },
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = loginSchema.parse(req.body);
      const token = await this.authService.login(credentials);
      
      res.json({ token });
    } catch (error: unknown) {
      next(error);
    }
  }
}
