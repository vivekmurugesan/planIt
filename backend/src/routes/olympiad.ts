import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const olympiadRouter = Router();

const createOlympiadSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  prepDate: z.string().datetime(),
  profileId: z.string().optional(),
});

const updateOlympiadSchema = createOlympiadSchema.partial().extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

olympiadRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId } = req.query;

    const olympiads = await prisma.olympiadRevision.findMany({
      where: {
        userId: req.userId,
        ...(profileId && { profileId: profileId as string }),
      },
      orderBy: { prepDate: 'asc' },
    });

    res.json({ olympiads });
  } catch (error) {
    next(error);
  }
});

olympiadRouter.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createOlympiadSchema.parse(req.body);

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

    const olympiad = await prisma.olympiadRevision.create({
      data: {
        userId: req.userId!,
        subject: data.subject,
        topic: data.topic,
        prepDate: new Date(data.prepDate),
        profileId: data.profileId,
      },
    });

    res.status(201).json({ olympiad });
  } catch (error) {
    next(error);
  }
});

olympiadRouter.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const olympiad = await prisma.olympiadRevision.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!olympiad) {
      throw new ApiError(404, 'Olympiad not found');
    }

    res.json({ olympiad });
  } catch (error) {
    next(error);
  }
});

olympiadRouter.patch(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const data = updateOlympiadSchema.parse(req.body);

      const olympiad = await prisma.olympiadRevision.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!olympiad) {
        throw new ApiError(404, 'Olympiad not found');
      }

      const updated = await prisma.olympiadRevision.update({
        where: { id: req.params.id },
        data: {
          subject: data.subject,
          topic: data.topic,
          prepDate: data.prepDate ? new Date(data.prepDate) : undefined,
          status: data.status,
          profileId: data.profileId,
        },
      });

      res.json({ olympiad: updated });
    } catch (error) {
      next(error);
    }
  }
);

olympiadRouter.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const olympiad = await prisma.olympiadRevision.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!olympiad) {
        throw new ApiError(404, 'Olympiad not found');
      }

      await prisma.olympiadRevision.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Olympiad deleted' });
    } catch (error) {
      next(error);
    }
  }
);
