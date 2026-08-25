'use client';

import { useEffect, useState } from 'react';
import { fitnessAPI } from '@/lib/api';
import { Trash2, CheckCircle, Circle, Zap } from 'lucide-react';

interface FitnessExercise {
  id: string;
  name: string;
  description?: string;
  sets: number;
  reps: number;
  difficulty: string;
  date: string;
  completed: boolean;
}

export default function ChildFitnessPanel({ profileId }: { profileId: string }) {
  const [exercises, setExercises] = useState<FitnessExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, [profileId]);

  const fetchExercises = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateStr = today.toISOString().split('T')[0];

      const response = await fitnessAPI.getAll(profileId, dateStr);
      setExercises(response.data.fitness);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (exercise: FitnessExercise) => {
    try {
      await fitnessAPI.update(exercise.id, { completed: !exercise.completed });
      fetchExercises();
    } catch (error) {
      console.error('Failed to update exercise:', error);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    try {
      await fitnessAPI.delete(id);
      fetchExercises();
    } catch (error) {
      console.error('Failed to delete exercise:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-700';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700';
      case 'HARD':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const completedCount = exercises.filter((e) => e.completed).length;
  const completionPercentage = exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0;

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading today's fitness plan...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Today's Fitness Challenge</h2>
      </div>

      {/* Progress Bar */}
      {exercises.length > 0 && (
        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Progress</span>
            <span className="text-sm font-bold text-purple-600">
              {completedCount}/{exercises.length} Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Exercises List */}
      {exercises.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No fitness exercises assigned for today!</p>
          <p className="text-sm mt-2">Your parent will create your daily fitness plan here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`card p-4 ${exercise.completed ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-600' : 'hover:shadow-lg transition-all'}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(exercise)}
                  className="mt-1 text-purple-600 hover:text-purple-800 flex-shrink-0"
                >
                  {exercise.completed ? (
                    <CheckCircle className="w-7 h-7" />
                  ) : (
                    <Circle className="w-7 h-7" />
                  )}
                </button>

                <div className="flex-1">
                  <p
                    className={`font-bold text-lg ${
                      exercise.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {exercise.name}
                  </p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty} LEVEL
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold">
                      💪 {exercise.sets}×{exercise.reps}
                    </span>
                  </div>

                  {exercise.description && (
                    <p className="text-sm text-gray-600 mt-3">{exercise.description}</p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteExercise(exercise.id)}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {completedCount === exercises.length && exercises.length > 0 && (
        <div className="card bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-400 text-center py-6">
          <p className="text-2xl">🏆</p>
          <p className="font-bold text-purple-900 text-lg">Awesome Work!</p>
          <p className="text-purple-700 text-sm">You completed all today's fitness exercises!</p>
        </div>
      )}
    </div>
  );
}
