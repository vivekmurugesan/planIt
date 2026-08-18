import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const homeworkRouter = Router();

const createHomeworkSchema = z.object({
  subject: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  profileId: z.string().optional(),
  attachments: z.string().optional(),
});

const updateHomeworkSchema = createHomeworkSchema.partial().extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

homeworkRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId, subject } = req.query;

    const homework = await prisma.homework.findMany({
      where: {
        userId: req.userId,
        ...(profileId && { profileId: profileId as string }),
        ...(subject && { subject: subject as string }),
      },
      orderBy: { dueDate: 'asc' },
    });

    res.json({ homework });
  } catch (error) {
    next(error);
  }
});

homeworkRouter.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createHomeworkSchema.parse(req.body);

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

    const hw = await prisma.homework.create({
      data: {
        userId: req.userId!,
        subject: data.subject,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority || 'MEDIUM',
        profileId: data.profileId,
        attachments: data.attachments,
      },
    });

    res.status(201).json({ homework: hw });
  } catch (error) {
    next(error);
  }
});

homeworkRouter.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const hw = await prisma.homework.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!hw) {
      throw new ApiError(404, 'Homework not found');
    }

    res.json({ homework: hw });
  } catch (error) {
    next(error);
  }
});

homeworkRouter.patch(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const data = updateHomeworkSchema.parse(req.body);

      const hw = await prisma.homework.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!hw) {
        throw new ApiError(404, 'Homework not found');
      }

      const updated = await prisma.homework.update({
        where: { id: req.params.id },
        data: {
          subject: data.subject,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          priority: data.priority,
          status: data.status,
          profileId: data.profileId,
          attachments: data.attachments,
        },
      });

      res.json({ homework: updated });
    } catch (error) {
      next(error);
    }
  }
);

homeworkRouter.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const hw = await prisma.homework.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!hw) {
        throw new ApiError(404, 'Homework not found');
      }

      await prisma.homework.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Homework deleted' });
    } catch (error) {
      next(error);
    }
  }
);
