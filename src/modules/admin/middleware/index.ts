import { Request, Response, NextFunction } from 'express';
// import { authMiddleware } from '../auth/middleware';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }

  next();
};
