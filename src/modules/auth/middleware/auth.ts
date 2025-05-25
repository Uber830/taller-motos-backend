import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('No token provided');
    }

    const authService = new AuthService();
    const user = await authService.validateToken(token);

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
