import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const eventRouter = Router();

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  eventType: z.enum(['GO_OUT', 'SCHOOL_EVENT', 'SOCIAL_VISIT', 'APPOINTMENT', 'OTHER']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  profileId: z.string().optional(),
});

const updateEventSchema = createEventSchema.partial();

eventRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId } = req.query;

    const events = await prisma.event.findMany({
      where: {
        userId: req.userId,
        ...(profileId && { profileId: profileId as string }),
      },
      orderBy: { startDate: 'asc' },
    });

    res.json({ events });
  } catch (error) {
    next(error);
  }
});

eventRouter.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createEventSchema.parse(req.body);

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

    const event = await prisma.event.create({
      data: {
        userId: req.userId!,
        title: data.title,
        description: data.description,
        location: data.location,
        eventType: data.eventType,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        profileId: data.profileId,
      },
    });

    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
});

eventRouter.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const event = await prisma.event.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    res.json({ event });
  } catch (error) {
    next(error);
  }
});

eventRouter.patch(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const data = updateEventSchema.parse(req.body);

      const event = await prisma.event.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!event) {
        throw new ApiError(404, 'Event not found');
      }

      const updated = await prisma.event.update({
        where: { id: req.params.id },
        data: {
          title: data.title,
          description: data.description,
          location: data.location,
          eventType: data.eventType,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          profileId: data.profileId,
        },
      });

      res.json({ event: updated });
    } catch (error) {
      next(error);
    }
  }
);

eventRouter.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const event = await prisma.event.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!event) {
        throw new ApiError(404, 'Event not found');
      }

      await prisma.event.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Event deleted' });
    } catch (error) {
      next(error);
    }
  }
);
