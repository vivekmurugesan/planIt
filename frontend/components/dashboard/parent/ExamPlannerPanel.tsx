'use client';

import { useEffect, useState } from 'react';
import { examAPI } from '@/lib/api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Exam {
  id: string;
  subject: string;
  topic: string;
  testDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function ExamPlannerPanel({ profileId }: { profileId: string }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newExam, setNewExam] = useState({ subject: '', topic: '', testDate: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, [profileId]);

  const fetchExams = async () => {
    try {
      const response = await examAPI.getAll(profileId);
      setExams(response.data.exams);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await examAPI.create({
        ...newExam,
        profileId,
        testDate: new Date(newExam.testDate).toISOString(),
      });
      setNewExam({ subject: '', topic: '', testDate: '' });
      setShowForm(false);
      fetchExams();
    } catch (error) {
      console.error('Failed to add exam:', error);
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      await examAPI.delete(id);
      fetchExams();
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading exams...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Exam Planner</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary">
          <Plus className="w-4 h-4" />
          Add Exam
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddExam} className="space-y-3">
            <input
              type="text"
              placeholder="Subject"
              value={newExam.subject}
              onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Topic"
              value={newExam.topic}
              onChange={(e) => setNewExam({ ...newExam, topic: e.target.value })}
              className="input"
              required
            />
            <input
              type="datetime-local"
              value={newExam.testDate}
              onChange={(e) => setNewExam({ ...newExam, testDate: e.target.value })}
              className="input"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Add Exam
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {exams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No exams scheduled</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Topic</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{exam.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{exam.topic}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(exam.testDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
