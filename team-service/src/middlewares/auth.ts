import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Missing or invalid token' });
    return;
  }

  const token = authHeader?.split(' ')[1] || '';

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
    return;
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
};
