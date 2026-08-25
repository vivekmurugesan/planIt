'use client';

import { useEffect, useState } from 'react';
import { fitnessAPI } from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle, Zap } from 'lucide-react';
import { Profile } from '@/lib/store';

interface FitnessExercise {
  id: string;
  name: string;
  description?: string;
  sets: number;
  reps: number;
  difficulty: string;
  date: string;
  completed: boolean;
  profileId?: string;
}

interface FitnessPanelProps {
  profileId: string;
  allProfiles: Profile[];
}

export default function FitnessPanel({ profileId, allProfiles }: FitnessPanelProps) {
  const [exercises, setExercises] = useState<FitnessExercise[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>(allProfiles.find(p => p.relationship === 'CHILD')?.id || '');
  const [loading, setLoading] = useState(true);

  const children = allProfiles.filter((p) => p.relationship === 'CHILD');

  useEffect(() => {
    if (selectedChild) {
      fetchExercises();
    }
  }, [selectedChild]);

  const fetchExercises = async () => {
    if (!selectedChild) return;
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateStr = today.toISOString().split('T')[0];

      const response = await fitnessAPI.getAll(selectedChild, dateStr);
      setExercises(response.data.fitness);
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDaily = async () => {
    if (!selectedChild) {
      alert('Please select a child first');
      return;
    }

    try {
      const response = await fitnessAPI.generateDaily(selectedChild);
      setExercises(response.data.fitness);
      alert(response.data.message);
    } catch (error) {
      console.error('Failed to generate exercises:', error);
      alert('Exercises already generated for today or error occurred');
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

  const getChildName = (childId: string) => {
    return allProfiles.find((p) => p.id === childId)?.displayName || 'Unknown';
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

  if (children.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No children profiles found. Create children profiles to assign fitness exercises.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Fitness & Exercises</h2>
        <button
          onClick={handleGenerateDaily}
          className="flex items-center gap-2 btn-primary"
        >
          <Zap className="w-4 h-4" />
          Generate Today's Exercises
        </button>
      </div>

      {/* Child Selection */}
      <div className="card">
        <label className="block text-sm font-semibold text-gray-800 mb-3">
          Select Child for Fitness Training
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`p-3 border-2 rounded-lg font-medium transition-all text-center ${
                selectedChild === child.id
                  ? 'border-purple-500 bg-purple-50 text-purple-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
              }`}
            >
              <div className="text-2xl mb-1">{child.avatar || '👤'}</div>
              <span className="text-sm">{child.displayName}</span>
            </button>
          ))}
        </div>
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
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading exercises...</div>
      ) : exercises.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">
          <p className="mb-4">No exercises for today yet.</p>
          <button
            onClick={handleGenerateDaily}
            className="inline-flex items-center gap-2 btn-primary"
          >
            <Zap className="w-4 h-4" />
            Generate 10 Daily Exercises
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className={`card p-4 ${exercise.completed ? 'bg-gray-50 border-l-4 border-purple-600' : ''}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(exercise)}
                  className="mt-1 text-purple-600 hover:text-purple-800 flex-shrink-0"
                >
                  {exercise.completed ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      exercise.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {exercise.name}
                  </p>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                      {exercise.sets} Sets × {exercise.reps} Reps
                    </span>
                  </div>

                  {exercise.description && (
                    <p className="text-sm text-gray-600 mt-2">{exercise.description}</p>
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
    </div>
  );
}
