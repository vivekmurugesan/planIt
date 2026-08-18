'use client';

import { useEffect, useState } from 'react';
import { olympiadAPI } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

interface Olympiad {
  id: string;
  subject: string;
  topic: string;
  prepDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function OlympiadPlannerPanel({ profileId }: { profileId: string }) {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newOlympiad, setNewOlympiad] = useState({ subject: '', topic: '', prepDate: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOlympiads();
  }, [profileId]);

  const fetchOlympiads = async () => {
    try {
      const response = await olympiadAPI.getAll(profileId);
      setOlympiads(response.data.olympiads);
    } catch (error) {
      console.error('Failed to fetch olympiads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOlympiad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await olympiadAPI.create({
        ...newOlympiad,
        profileId,
        prepDate: new Date(newOlympiad.prepDate).toISOString(),
      });
      setNewOlympiad({ subject: '', topic: '', prepDate: '' });
      setShowForm(false);
      fetchOlympiads();
    } catch (error) {
      console.error('Failed to add olympiad:', error);
    }
  };

  const handleDeleteOlympiad = async (id: string) => {
    try {
      await olympiadAPI.delete(id);
      fetchOlympiads();
    } catch (error) {
      console.error('Failed to delete olympiad:', error);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading Olympiad plans...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Olympiad Planner</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary">
          <Plus className="w-4 h-4" />
          Add Olympiad
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddOlympiad} className="space-y-3">
            <input
              type="text"
              placeholder="Subject (e.g., Math, Science)"
              value={newOlympiad.subject}
              onChange={(e) => setNewOlympiad({ ...newOlympiad, subject: e.target.value })}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Topic"
              value={newOlympiad.topic}
              onChange={(e) => setNewOlympiad({ ...newOlympiad, topic: e.target.value })}
              className="input"
              required
            />
            <input
              type="datetime-local"
              value={newOlympiad.prepDate}
              onChange={(e) => setNewOlympiad({ ...newOlympiad, prepDate: e.target.value })}
              className="input"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Add Olympiad
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

      {olympiads.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No Olympiad preparations scheduled</div>
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
              {olympiads.map((olympiad) => (
                <tr key={olympiad.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{olympiad.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{olympiad.topic}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(olympiad.prepDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                      {olympiad.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteOlympiad(olympiad.id)}
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
