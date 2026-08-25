'use client';

import { useEffect, useState } from 'react';
import { homeworkAPI } from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Homework {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const SUBJECTS = ['English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Language'];

export default function HomeworkPanel({ profileId }: { profileId: string }) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newHomework, setNewHomework] = useState({
    subject: SUBJECTS[0],
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomework();
  }, [profileId]);

  const fetchHomework = async () => {
    try {
      const response = await homeworkAPI.getAll(profileId);
      setHomework(response.data.homework);
    } catch (error) {
      console.error('Failed to fetch homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await homeworkAPI.create({
        ...newHomework,
        profileId,
        dueDate: new Date(newHomework.dueDate).toISOString(),
      });
      setNewHomework({
        subject: SUBJECTS[0],
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
      });
      setShowForm(false);
      fetchHomework();
    } catch (error) {
      console.error('Failed to add homework:', error);
    }
  };

  const handleToggleStatus = async (hw: Homework) => {
    const newStatus = hw.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    try {
      await homeworkAPI.update(hw.id, { status: newStatus });
      fetchHomework();
    } catch (error) {
      console.error('Failed to update homework:', error);
    }
  };

  const handleDeleteHomework = async (id: string) => {
    try {
      await homeworkAPI.delete(id);
      fetchHomework();
    } catch (error) {
      console.error('Failed to delete homework:', error);
    }
  };

  const priorityColor = {
    LOW: 'text-purple-600 bg-purple-50',
    MEDIUM: 'text-yellow-600 bg-yellow-50',
    HIGH: 'text-red-600 bg-red-50',
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading homework...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Homework Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 btn-primary"
        >
          <Plus className="w-4 h-4" />
          Assign Homework
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddHomework} className="space-y-3">
            <select
              value={newHomework.subject}
              onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
              className="input"
            >
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Homework title"
              value={newHomework.title}
              onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newHomework.description}
              onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
              className="input"
              rows={2}
            />
            <select
              value={newHomework.priority}
              onChange={(e) => setNewHomework({ ...newHomework, priority: e.target.value })}
              className="input"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
            </select>
            <input
              type="datetime-local"
              value={newHomework.dueDate}
              onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
              className="input"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Assign Homework
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

      {homework.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No homework assigned yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-2">
          {homework.map((hw) => (
            <div
              key={hw.id}
              className={`card flex items-start gap-3 ${
                hw.status === 'COMPLETED' ? 'bg-gray-50' : ''
              }`}
            >
              <button
                onClick={() => handleToggleStatus(hw)}
                className="mt-1 text-purple-600 hover:text-purple-800 flex-shrink-0"
              >
                {hw.status === 'COMPLETED' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded mb-2">
                      {hw.subject}
                    </span>
                    <p
                      className={`font-medium ${
                        hw.status === 'COMPLETED'
                          ? 'line-through text-gray-500'
                          : 'text-gray-800'
                      }`}
                    >
                      {hw.title}
                    </p>
                  </div>
                </div>
                {hw.description && (
                  <p className="text-sm text-gray-600 mt-1">{hw.description}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColor[hw.priority]}`}>
                    {hw.priority}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    Due: {new Date(hw.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteHomework(hw.id)}
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
