import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const todoRouter = Router();

const createTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional(),
  profileId: z.string().optional(),
});

const updateTodoSchema = createTodoSchema.partial().extend({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
});

todoRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId } = req.query;

    const todos = await prisma.todo.findMany({
      where: {
        userId: req.userId,
        ...(profileId && { profileId: profileId as string }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ todos });
  } catch (error) {
    next(error);
  }
});

todoRouter.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createTodoSchema.parse(req.body);

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

    const todo = await prisma.todo.create({
      data: {
        userId: req.userId!,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        profileId: data.profileId,
      },
    });

    res.status(201).json({ todo });
  } catch (error) {
    next(error);
  }
});

todoRouter.get('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const todo = await prisma.todo.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!todo) {
      throw new ApiError(404, 'Todo not found');
    }

    res.json({ todo });
  } catch (error) {
    next(error);
  }
});

todoRouter.patch(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const data = updateTodoSchema.parse(req.body);

      const todo = await prisma.todo.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!todo) {
        throw new ApiError(404, 'Todo not found');
      }

      const updated = await prisma.todo.update({
        where: { id: req.params.id },
        data: {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          profileId: data.profileId,
        },
      });

      res.json({ todo: updated });
    } catch (error) {
      next(error);
    }
  }
);

todoRouter.delete(
  '/:id',
  authMiddleware,
  async (req: AuthRequest, res, next) => {
    try {
      const todo = await prisma.todo.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!todo) {
        throw new ApiError(404, 'Todo not found');
      }

      await prisma.todo.delete({
        where: { id: req.params.id },
      });

      res.json({ message: 'Todo deleted' });
    } catch (error) {
      next(error);
    }
  }
);
