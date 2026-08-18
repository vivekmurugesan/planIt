import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const examRouter = Router();

const createExamSchema = z.object({
  subject: z.string().min(1),
  topic: z.string().min(1),
  testDate: z.string().datetime(),
  profileId: z.string().optional(),
});

const updateExamSchema = createExamSchema.partial().extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

examRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId } = req.query;

    const exams = await prisma.examRevision.findMany({
      where: {
        userId: req.userId,
        ...(profileId && { profileId: profileId as string }),
      },
      orderBy: { testDate: 'asc' },
    });

    res.json({ exams });
  } catch (error) {
    next(error);
  }
});

examRouter.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createExamSchema.parse(req.body);

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

    const exam = await prisma.examRevision.create({
      data: {
        userId: req.userId!,
        subject: data.subject,
        topic: data.topic,
        testDate: new Date(data.testDate),
        profileId: data.profileId,
      },
    });

    res.status(201).json({ exam });
  } catch (error) {
    next(error);
  }
});

examRouter.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const exam = await prisma.examRevision.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!exam) {
      throw new ApiError(404, 'Exam not found');
    }

    res.json({ exam });
  } catch (error) {
    next(error);
  }
});

examRouter.patch(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const data = updateExamSchema.parse(req.body);

      const exam = await prisma.examRevision.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!exam) {
        throw new ApiError(404, 'Exam not found');
      }

      const updated = await prisma.examRevision.update({
        where: { id: req.params.id },
        data: {
          subject: data.subject,
          topic: data.topic,
          testDate: data.testDate ? new Date(data.testDate) : undefined,
          status: data.status,
          profileId: data.profileId,
        },
      });

      res.json({ exam: updated });
    } catch (error) {
      next(error);
    }
  }
);

examRouter.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const exam = await prisma.examRevision.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!exam) {
        throw new ApiError(404, 'Exam not found');
      }

      await prisma.examRevision.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Exam deleted' });
    } catch (error) {
      next(error);
    }
  }
);
