import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret = (process.env.JWT_SECRET || 'secret') as string;

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: process.env.JWT_EXPIRY || '15m',
  };
  return jwt.sign({ userId }, secret, options);
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  };
  return jwt.sign({ userId }, secret, options);
};

export const generateSessionPin = (profileId: string, userId: string): string => {
  const options: SignOptions = {
    expiresIn: '24h',
  };
  return jwt.sign({ profileId, userId }, secret, options);
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
