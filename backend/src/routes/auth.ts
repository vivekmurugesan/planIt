import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import {
  generateAccessToken,
  generateRefreshToken,
  generateSessionPin,
  hashPassword,
  comparePasswords,
} from '../utils/auth';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  accountType: z.enum(['SINGLE', 'FAMILY']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const profileSwitchSchema = z.object({
  profileId: z.string(),
  pin: z.string().optional(),
});

authRouter.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, accountType } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ApiError(409, 'Email already registered');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        accountType,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', (req: AuthRequest, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionPin');
  res.json({ message: 'Logged out' });
});

authRouter.post(
  '/profile-switch',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const { profileId } = profileSwitchSchema.parse(req.body);

      const profile = await prisma.profile.findFirst({
        where: {
          id: profileId,
          userId: req.userId,
        },
      });

      if (!profile) {
        throw new ApiError(404, 'Profile not found');
      }

      const sessionPin = generateSessionPin(profileId, req.userId!);

      res.cookie('sessionPin', sessionPin, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        profile: {
          id: profile.id,
          displayName: profile.displayName,
          avatar: profile.avatar,
          relationship: profile.relationship,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, 'No refresh token');
    }

    const decoded = JSON.parse(
      Buffer.from(refreshToken.split('.')[1], 'base64').toString()
    ) as { userId: string };

    const accessToken = generateAccessToken(decoded.userId);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    next(error);
  }
});
