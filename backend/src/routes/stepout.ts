import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const stepoutRouter = Router();

const createStepoutSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  recurring: z.boolean().optional(),
  frequency: z.string().optional(),
  profileId: z.string().optional(),
});

const updateStepoutSchema = createStepoutSchema.partial().extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

stepoutRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId } = req.query;

    const stepout = await prisma.stepout.findMany({
      where: {
        userId: req.userId,
        ...(profileId && { profileId: profileId as string }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ stepout });
  } catch (error) {
    next(error);
  }
});

stepoutRouter.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createStepoutSchema.parse(req.body);

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

    const stepout = await prisma.stepout.create({
      data: {
        userId: req.userId!,
        title: data.title,
        description: data.description,
        recurring: data.recurring || false,
        frequency: data.frequency,
        profileId: data.profileId,
      },
    });

    res.status(201).json({ stepout });
  } catch (error) {
    next(error);
  }
});

stepoutRouter.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const stepout = await prisma.stepout.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!stepout) {
      throw new ApiError(404, 'Stepout not found');
    }

    res.json({ stepout });
  } catch (error) {
    next(error);
  }
});

stepoutRouter.patch('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = updateStepoutSchema.parse(req.body);

    const stepout = await prisma.stepout.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!stepout) {
      throw new ApiError(404, 'Stepout not found');
    }

    const updated = await prisma.stepout.update({
      where: { id: req.params.id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        recurring: data.recurring,
        frequency: data.frequency,
        profileId: data.profileId,
      },
    });

    res.json({ stepout: updated });
  } catch (error) {
    next(error);
  }
});

stepoutRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const stepout = await prisma.stepout.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!stepout) {
      throw new ApiError(404, 'Stepout not found');
    }

    await prisma.stepout.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Stepout deleted' });
  } catch (error) {
    next(error);
  }
});
