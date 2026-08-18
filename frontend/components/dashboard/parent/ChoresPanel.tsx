'use client';

import { useEffect, useState } from 'react';
import { choreAPI } from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Chore {
  id: string;
  title: string;
  description?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  recurring: boolean;
  frequency?: string;
}

export default function ChoresPanel({ profileId }: { profileId: string }) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newChore, setNewChore] = useState({
    title: '',
    description: '',
    recurring: false,
    frequency: 'ONE_OFF',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChores();
  }, [profileId]);

  const fetchChores = async () => {
    try {
      const response = await choreAPI.getAll(profileId);
      setChores(response.data.chores);
    } catch (error) {
      console.error('Failed to fetch chores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await choreAPI.create({ ...newChore, profileId });
      setNewChore({
        title: '',
        description: '',
        recurring: false,
        frequency: 'ONE_OFF',
      });
      setShowForm(false);
      fetchChores();
    } catch (error) {
      console.error('Failed to add chore:', error);
    }
  };

  const handleToggleStatus = async (chore: Chore) => {
    const newStatus = chore.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED';
    try {
      await choreAPI.update(chore.id, { status: newStatus });
      fetchChores();
    } catch (error) {
      console.error('Failed to update chore:', error);
    }
  };

  const handleDeleteChore = async (id: string) => {
    try {
      await choreAPI.delete(id);
      fetchChores();
    } catch (error) {
      console.error('Failed to delete chore:', error);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading chores...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Chores Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary">
          <Plus className="w-4 h-4" />
          Add Chore
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddChore} className="space-y-3">
            <input
              type="text"
              placeholder="Chore name"
              value={newChore.title}
              onChange={(e) => setNewChore({ ...newChore, title: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Description"
              value={newChore.description}
              onChange={(e) => setNewChore({ ...newChore, description: e.target.value })}
              className="input"
              rows={2}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newChore.recurring}
                onChange={(e) => setNewChore({ ...newChore, recurring: e.target.checked })}
              />
              <span className="text-gray-700">Recurring</span>
            </label>
            {newChore.recurring && (
              <select
                value={newChore.frequency}
                onChange={(e) => setNewChore({ ...newChore, frequency: e.target.value })}
                className="input"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            )}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Add Chore
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

      {chores.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No chores assigned</div>
      ) : (
        <div className="space-y-2">
          {chores.map((chore) => (
            <div key={chore.id} className="card flex items-start gap-3">
              <button
                onClick={() => handleToggleStatus(chore)}
                className="mt-1 text-primary flex-shrink-0"
              >
                {chore.status === 'COMPLETED' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{chore.title}</p>
                {chore.description && <p className="text-sm text-gray-600">{chore.description}</p>}
                {chore.recurring && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                    {chore.frequency}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteChore(chore.id)}
                className="text-red-500 flex-shrink-0 mt-1"
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
