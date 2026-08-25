'use client';

import { useEffect, useState } from 'react';
import { homeworkAPI } from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Profile } from '@/lib/store';

interface Homework {
  id: string;
  subject: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  profileId?: string;
}

const SUBJECTS = ['English', 'Maths', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Language'];

interface HomeworkPanelProps {
  profileId: string;
  allProfiles: Profile[];
}

export default function HomeworkPanel({ profileId, allProfiles }: HomeworkPanelProps) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
  });
  const [loading, setLoading] = useState(true);

  const children = allProfiles.filter((p) => p.relationship === 'CHILD');

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

    if (selectedSubjects.length === 0) {
      alert('Please select at least one subject');
      return;
    }

    if (selectedChildren.length === 0) {
      alert('Please select at least one child to assign homework to');
      return;
    }

    try {
      for (const subject of selectedSubjects) {
        for (const childId of selectedChildren) {
          await homeworkAPI.create({
            subject,
            title: newHomework.title,
            description: newHomework.description,
            dueDate: new Date(newHomework.dueDate).toISOString(),
            priority: newHomework.priority,
            profileId: childId,
          });
        }
      }

      setNewHomework({
        title: '',
        description: '',
        dueDate: '',
        priority: 'MEDIUM',
      });
      setSelectedSubjects([]);
      setSelectedChildren([]);
      setShowForm(false);
      fetchHomework();
    } catch (error) {
      console.error('Failed to add homework:', error);
      alert('Failed to assign homework');
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

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const toggleChild = (childId: string) => {
    setSelectedChildren((prev) =>
      prev.includes(childId) ? prev.filter((id) => id !== childId) : [...prev, childId]
    );
  };

  const getChildName = (childId: string) => {
    return allProfiles.find((p) => p.id === childId)?.displayName || 'Unknown';
  };

  const getHomeworkForChild = (childId: string): Homework[] => {
    return homework.filter((hw) => hw.profileId === childId);
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
          {showForm ? 'Cancel' : 'Assign Homework'}
        </button>
      </div>

      {showForm && (
        <div className="card space-y-4">
          <form onSubmit={handleAddHomework} className="space-y-4">
            {/* Children Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Select Children to Assign Homework *
              </label>
              {children.length === 0 ? (
                <p className="text-gray-600 text-sm">No children profiles found. Create children profiles first.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => toggleChild(child.id)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all ${
                        selectedChildren.includes(child.id)
                          ? 'border-purple-500 bg-purple-50 text-purple-900'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-2xl">{child.avatar || '👤'}</div>
                        <span className="text-sm">{child.displayName}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Select Subjects *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {SUBJECTS.map((subject) => (
                  <label
                    key={subject}
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-all ${
                      selectedSubjects.includes(subject)
                        ? 'bg-purple-50 border-purple-400'
                        : 'bg-white border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={() => toggleSubject(subject)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-medium">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Homework Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Homework Title *
              </label>
              <input
                type="text"
                placeholder="E.g., Chapter 5 exercises, Essay assignment"
                value={newHomework.title}
                onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="Details about the homework (optional)"
                value={newHomework.description}
                onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
                className="input"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="datetime-local"
                  value={newHomework.dueDate}
                  onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newHomework.priority}
                  onChange={(e) => setNewHomework({ ...newHomework, priority: e.target.value })}
                  className="input"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Assign Homework
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedSubjects([]);
                  setSelectedChildren([]);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Display Homework by Child */}
      {children.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No children profiles found. Create children profiles to assign homework.
        </div>
      ) : (
        <div className="space-y-6">
          {children.map((child) => {
            const childHomework = getHomeworkForChild(child.id);
            return (
              <div key={child.id} className="card">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="text-3xl">{child.avatar || '👤'}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{child.displayName}</h3>
                    <p className="text-xs text-gray-600">{childHomework.length} homework assignments</p>
                  </div>
                </div>

                {childHomework.length === 0 ? (
                  <p className="text-center py-4 text-gray-500 text-sm">
                    No homework assigned yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {childHomework.map((hw) => (
                      <div
                        key={hw.id}
                        className={`p-3 border rounded-lg flex items-start gap-3 ${
                          hw.status === 'COMPLETED' ? 'bg-gray-50' : ''
                        }`}
                      >
                        <button
                          onClick={() => handleToggleStatus(hw)}
                          className="mt-1 text-purple-600 hover:text-purple-800 flex-shrink-0"
                        >
                          {hw.status === 'COMPLETED' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
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
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
