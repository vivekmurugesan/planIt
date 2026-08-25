'use client';

import { useEffect, useState } from 'react';
import { stepoutAPI } from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface StepOut {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  recurring: boolean;
  frequency?: string;
}

interface StepOutPanelProps {
  profileId: string;
}

export default function StepOutPanel({ profileId }: StepOutPanelProps) {
  const [stepouts, setStepouts] = useState<StepOut[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newStepout, setNewStepout] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStepouts();
  }, [profileId]);

  const fetchStepouts = async () => {
    try {
      const response = await stepoutAPI.getAll(profileId);
      setStepouts(response.data.stepout);
    } catch (error) {
      console.error('Failed to fetch step-outs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStepout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await stepoutAPI.create({
        ...newStepout,
        profileId,
        recurring: false,
      });
      setNewStepout({ title: '', description: '' });
      setShowForm(false);
      fetchStepouts();
    } catch (error) {
      console.error('Failed to add step-out:', error);
    }
  };

  const handleToggleStatus = async (stepout: StepOut) => {
    const newStatus = stepout.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    try {
      await stepoutAPI.update(stepout.id, { status: newStatus });
      fetchStepouts();
    } catch (error) {
      console.error('Failed to update step-out:', error);
    }
  };

  const handleDeleteStepout = async (id: string) => {
    try {
      await stepoutAPI.delete(id);
      fetchStepouts();
    } catch (error) {
      console.error('Failed to delete step-out:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading step-out items...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">StepOut - Step Out Items</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Step Out
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddStepout} className="space-y-3">
            <input
              type="text"
              placeholder="Step out activity or task"
              value={newStepout.title}
              onChange={(e) => setNewStepout({ ...newStepout, title: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newStepout.description}
              onChange={(e) => setNewStepout({ ...newStepout, description: e.target.value })}
              className="input"
              rows={2}
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Add Step Out
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {stepouts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No step-out items yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-2">
          {stepouts.map((stepout) => (
            <div
              key={stepout.id}
              className={`card flex items-start gap-3 ${
                stepout.status === 'COMPLETED' ? 'bg-gray-50' : ''
              }`}
            >
              <button
                onClick={() => handleToggleStatus(stepout)}
                className="mt-1 text-purple-600 hover:text-purple-800 flex-shrink-0"
              >
                {stepout.status === 'COMPLETED' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    stepout.status === 'COMPLETED'
                      ? 'line-through text-gray-500'
                      : 'text-gray-800'
                  }`}
                >
                  {stepout.title}
                </p>
                {stepout.description && (
                  <p className="text-sm text-gray-600 mt-1">{stepout.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDeleteStepout(stepout.id)}
                className="text-red-500 hover:text-red-700 flex-shrink-0 mt-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
