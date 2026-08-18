import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const choreRouter = Router();

const createChoreSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  recurring: z.boolean().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ONE_OFF']).optional(),
  profileId: z.string().optional(),
});

const updateChoreSchema = createChoreSchema.partial().extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

choreRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId } = req.query;

    const chores = await prisma.chore.findMany({
      where: {
        userId: req.userId,
        ...(profileId && { profileId: profileId as string }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ chores });
  } catch (error) {
    next(error);
  }
});

choreRouter.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createChoreSchema.parse(req.body);

    if (data.profileId) {
      const profile = await prisma.profile.findFirst({
        where: {
          id: data.profileId,
          userId: req.userId,
        },
      });

      if (!profile) {
        throw new ApiError(404, 'Profile not found');
      }
    }

    const chore = await prisma.chore.create({
      data: {
        userId: req.userId!,
        title: data.title,
        description: data.description,
        recurring: data.recurring || false,
        frequency: data.frequency || 'ONE_OFF',
        profileId: data.profileId,
      },
    });

    res.status(201).json({ chore });
  } catch (error) {
    next(error);
  }
});

choreRouter.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const chore = await prisma.chore.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!chore) {
      throw new ApiError(404, 'Chore not found');
    }

    res.json({ chore });
  } catch (error) {
    next(error);
  }
});

choreRouter.patch(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const data = updateChoreSchema.parse(req.body);

      const chore = await prisma.chore.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!chore) {
        throw new ApiError(404, 'Chore not found');
      }

      const updated = await prisma.chore.update({
        where: { id: req.params.id },
        data: {
          title: data.title,
          description: data.description,
          recurring: data.recurring,
          frequency: data.frequency,
          status: data.status,
          profileId: data.profileId,
        },
      });

      res.json({ chore: updated });
    } catch (error) {
      next(error);
    }
  }
);

choreRouter.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const chore = await prisma.chore.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!chore) {
        throw new ApiError(404, 'Chore not found');
      }

      await prisma.chore.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Chore deleted' });
    } catch (error) {
      next(error);
    }
  }
);
