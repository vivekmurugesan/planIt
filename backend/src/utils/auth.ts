import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret = (process.env.JWT_SECRET || 'secret') as string;

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRY || '15m' } as any
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' } as any
  );
};

export const generateSessionPin = (profileId: string, userId: string): string => {
  return jwt.sign(
    { profileId, userId },
    secret,
    { expiresIn: '24h' } as any
  );
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
