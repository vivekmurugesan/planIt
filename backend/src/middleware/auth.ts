import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  profileId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const profileAuthMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const sessionPin = req.cookies.sessionPin;

  if (!sessionPin) {
    return res.status(401).json({ error: 'Profile session expired' });
  }

  try {
    const decoded = jwt.verify(sessionPin, process.env.JWT_SECRET || 'secret') as {
      profileId: string;
      userId: string;
    };
    req.profileId = decoded.profileId;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid session' });
  }
};
