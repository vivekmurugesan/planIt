'use client';

import { useEffect, useState } from 'react';
import { examAPI } from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface RevisionItem {
  id: string;
  subject: string;
  date: string;
  topic: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function ChildRevisionPanel({ profileId }: { profileId: string }) {
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newRevision, setNewRevision] = useState({
    subject: '',
    topic: '',
    date: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevisions();
  }, [profileId]);

  const fetchRevisions = async () => {
    try {
      const response = await examAPI.getAll(profileId);
      setRevisions(response.data.exams || []);
    } catch (error) {
      console.error('Failed to fetch revisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await examAPI.create({
        ...newRevision,
        profileId,
        testDate: new Date(newRevision.date).toISOString(),
      });
      setNewRevision({ subject: '', topic: '', date: '' });
      setShowForm(false);
      fetchRevisions();
    } catch (error) {
      console.error('Failed to add revision:', error);
    }
  };

  const handleToggleStatus = async (revision: RevisionItem) => {
    const newStatus = revision.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    try {
      await examAPI.update(revision.id, { status: newStatus });
      fetchRevisions();
    } catch (error) {
      console.error('Failed to update revision:', error);
    }
  };

  const handleDeleteRevision = async (id: string) => {
    try {
      await examAPI.delete(id);
      fetchRevisions();
    } catch (error) {
      console.error('Failed to delete revision:', error);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading revision planner...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Revision Planner</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary">
          <Plus className="w-4 h-4" />
          Add Revision
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddRevision} className="space-y-3">
            <input
              type="text"
              placeholder="Subject"
              value={newRevision.subject}
              onChange={(e) => setNewRevision({ ...newRevision, subject: e.target.value })}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Topic to revise"
              value={newRevision.topic}
              onChange={(e) => setNewRevision({ ...newRevision, topic: e.target.value })}
              className="input"
              required
            />
            <input
              type="date"
              value={newRevision.date}
              onChange={(e) => setNewRevision({ ...newRevision, date: e.target.value })}
              className="input"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Add
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

      {revisions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No revision items added yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Subject</th>
                <th className="px-4 py-2 text-left font-semibold">Topic</th>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {revisions.map((revision) => (
                <tr key={revision.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{revision.subject}</td>
                  <td className="px-4 py-3">{revision.topic}</td>
                  <td className="px-4 py-3">{new Date(revision.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleStatus(revision)}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                    >
                      {revision.status === 'COMPLETED' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteRevision(revision.id)}
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
