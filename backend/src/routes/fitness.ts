import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const prisma = new PrismaClient();
export const fitnessRouter = Router();

const EXERCISES = [
  { name: 'Push-ups', sets: 3, reps: 15, difficulty: 'MEDIUM' },
  { name: 'Squats', sets: 3, reps: 20, difficulty: 'MEDIUM' },
  { name: 'Plank Hold', sets: 3, reps: 1, difficulty: 'HARD', duration: 60 },
  { name: 'Jumping Jacks', sets: 3, reps: 30, difficulty: 'EASY' },
  { name: 'Burpees', sets: 3, reps: 10, difficulty: 'HARD' },
  { name: 'Lunges', sets: 3, reps: 15, difficulty: 'MEDIUM' },
  { name: 'Mountain Climbers', sets: 3, reps: 20, difficulty: 'MEDIUM' },
  { name: 'Tricep Dips', sets: 3, reps: 12, difficulty: 'MEDIUM' },
  { name: 'Leg Raises', sets: 3, reps: 15, difficulty: 'HARD' },
  { name: 'High Knees', sets: 3, reps: 30, difficulty: 'EASY' },
];

const createFitnessSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  sets: z.number().optional(),
  reps: z.number().optional(),
  duration: z.number().optional(),
  difficulty: z.string().optional(),
  date: z.string().datetime(),
  profileId: z.string().optional(),
});

const updateFitnessSchema = createFitnessSchema.partial().extend({
  completed: z.boolean().optional(),
});

fitnessRouter.get('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId, date } = req.query;

    const fitness = await prisma.fitnessExercise.findMany({
      where: {
        userId: req.userId,
        ...(profileId && { profileId: profileId as string }),
        ...(date && {
          date: {
            gte: new Date(date as string),
            lt: new Date(new Date(date as string).getTime() + 24 * 60 * 60 * 1000),
          },
        }),
      },
      orderBy: { date: 'desc' },
    });

    res.json({ fitness });
  } catch (error) {
    next(error);
  }
});

fitnessRouter.post('/generate-daily/:profileId', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const { profileId } = req.params;

    const profile = await prisma.profile.findFirst({
      where: {
        id: profileId,
        userId: req.userId,
      },
    });

    if (!profile) {
      throw new ApiError(404, 'Profile not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingExercises = await prisma.fitnessExercise.findMany({
      where: {
        userId: req.userId,
        profileId: profileId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (existingExercises.length > 0) {
      return res.json({
        message: 'Exercises already generated for today',
        fitness: existingExercises,
      });
    }

    const created = await Promise.all(
      EXERCISES.map((exercise) =>
        prisma.fitnessExercise.create({
          data: {
            userId: req.userId!,
            profileId,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            difficulty: exercise.difficulty,
            duration: exercise.duration,
            date: new Date(),
          },
        })
      )
    );

    res.status(201).json({ fitness: created, message: '10 exercises generated for today' });
  } catch (error) {
    next(error);
  }
});

fitnessRouter.post('/', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = createFitnessSchema.parse(req.body);

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

    const fitness = await prisma.fitnessExercise.create({
      data: {
        userId: req.userId!,
        profileId: data.profileId,
        name: data.name,
        description: data.description,
        sets: data.sets || 3,
        reps: data.reps || 10,
        duration: data.duration,
        difficulty: data.difficulty || 'MEDIUM',
        date: new Date(data.date),
      },
    });

    res.status(201).json({ fitness });
  } catch (error) {
    next(error);
  }
});

fitnessRouter.patch('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const data = updateFitnessSchema.parse(req.body);

    const fitness = await prisma.fitnessExercise.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!fitness) {
      throw new ApiError(404, 'Exercise not found');
    }

    const updated = await prisma.fitnessExercise.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        description: data.description,
        sets: data.sets,
        reps: data.reps,
        duration: data.duration,
        difficulty: data.difficulty,
        date: data.date ? new Date(data.date) : undefined,
        completed: data.completed,
      },
    });

    res.json({ fitness: updated });
  } catch (error) {
    next(error);
  }
});

fitnessRouter.delete('/:id', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const fitness = await prisma.fitnessExercise.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    });

    if (!fitness) {
      throw new ApiError(404, 'Exercise not found');
    }

    await prisma.fitnessExercise.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Exercise deleted' });
  } catch (error) {
    next(error);
  }
});
