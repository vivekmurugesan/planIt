import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const profileRouter = Router();

const createProfileSchema = z.object({
  displayName: z.string().min(2),
  relationship: z.enum(['PARENT', 'CHILD', 'OWNER']),
  avatar: z.string().optional(),
  colorCode: z.string().optional(),
  age: z.number().optional(),
});

const updateProfileSchema = createProfileSchema.partial();

profileRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const profiles = await prisma.profile.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        displayName: true,
        avatar: true,
        relationship: true,
        colorCode: true,
        age: true,
      },
    });

    res.json({ profiles });
  } catch (error) {
    next(error);
  }
});

profileRouter.post(
  '/',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const data = createProfileSchema.parse(req.body);

      const existing = await prisma.profile.findFirst({
        where: {
          userId: req.userId,
          displayName: data.displayName,
        },
      });

      if (existing) {
        throw new ApiError(409, 'Profile name already exists');
      }

      const profile = await prisma.profile.create({
        data: {
          userId: req.userId!,
          name: data.displayName,
          displayName: data.displayName,
          avatar: data.avatar,
          colorCode: data.colorCode || '#4CAF50',
          relationship: data.relationship,
          age: data.age,
        },
      });

      res.status(201).json({ profile });
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.get(
  '/:profileId',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const profile = await prisma.profile.findFirst({
        where: {
          id: req.params.profileId,
          userId: req.userId,
        },
      });

      if (!profile) {
        throw new ApiError(404, 'Profile not found');
      }

      res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.patch(
  '/:profileId',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const data = updateProfileSchema.parse(req.body);

      const profile = await prisma.profile.findFirst({
        where: {
          id: req.params.profileId,
          userId: req.userId,
        },
      });

      if (!profile) {
        throw new ApiError(404, 'Profile not found');
      }

      const updated = await prisma.profile.update({
        where: { id: req.params.profileId },
        data: {
          displayName: data.displayName,
          avatar: data.avatar,
          colorCode: data.colorCode,
          relationship: data.relationship,
          age: data.age,
        },
      });

      res.json({ profile: updated });
    } catch (error) {
      next(error);
    }
  }
);

profileRouter.delete(
  '/:profileId',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const profile = await prisma.profile.findFirst({
        where: {
          id: req.params.profileId,
          userId: req.userId,
        },
      });

      if (!profile) {
        throw new ApiError(404, 'Profile not found');
      }

      await prisma.profile.delete({
        where: { id: req.params.profileId },
      });

      res.json({ message: 'Profile deleted' });
    } catch (error) {
      next(error);
    }
  }
);
