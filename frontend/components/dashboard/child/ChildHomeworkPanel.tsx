'use client';

import { useEffect, useState } from 'react';
import { homeworkAPI } from '@/lib/api';
import { BookOpen, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Homework {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: string;
}

const SUBJECTS = ['English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Language'];

export default function ChildHomeworkPanel({ profileId }: { profileId: string }) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
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

  if (loading) return <div className="text-center py-8 text-gray-600">Loading homework...</div>;

  const filteredHomework = selectedSubject
    ? homework.filter((h) => h.subject === selectedSubject)
    : homework;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">My Homework</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          onClick={() => setSelectedSubject('')}
          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
            selectedSubject === ''
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {SUBJECTS.map((subject) => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSubject === subject
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {filteredHomework.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {selectedSubject ? `No homework for ${selectedSubject}` : 'No homework assigned yet!'}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredHomework.map((hw) => (
            <div
              key={hw.id}
              className={`card flex items-start gap-3 ${hw.status === 'COMPLETED' ? 'bg-purple-50' : ''}`}
            >
              <button
                onClick={() => handleToggleStatus(hw)}
                className="mt-1 text-primary hover:text-primary/80 flex-shrink-0"
              >
                {hw.status === 'COMPLETED' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className={`font-medium ${hw.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {hw.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{hw.subject}</p>
                    {hw.description && <p className="text-sm text-gray-600 mt-1">{hw.description}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                      Due: {new Date(hw.dueDate).toLocaleDateString()}
                    </p>
                  </div>
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
