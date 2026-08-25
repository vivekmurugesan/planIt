'use client';

import { useState } from 'react';
import { profilesAPI } from '@/lib/api';
import { X } from 'lucide-react';

interface CreateProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AVATARS = ['👦', '👧', '👨', '👩', '👴', '👵', '🧑', '👱', '🧔', '👨‍🦱', '👩‍🦱', '🧑‍🦰'];
const COLORS = ['#9333ea', '#2196F3', '#FF9800', '#E91E63', '#00BCD4', '#10b981', '#f59e0b'];

export default function CreateProfileModal({
  onClose,
  onSuccess,
}: CreateProfileModalProps) {
  const [formData, setFormData] = useState({
    displayName: '',
    relationship: 'CHILD',
    avatar: AVATARS[0],
    colorCode: COLORS[0],
    age: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
      };
      await profilesAPI.create(data);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Create Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Name
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Mom, Alex, Sister"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relationship
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="input"
            >
              <option value="OWNER">Owner</option>
              <option value="PARENT">Parent</option>
              <option value="CHILD">Child</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, avatar }))
                  }
                  className={`text-3xl p-2 rounded-lg transition-all ${
                    formData.avatar === avatar
                      ? 'bg-primary ring-2 ring-primary'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, colorCode: color }))
                  }
                  className={`w-full h-10 rounded-lg transition-all ${
                    formData.colorCode === color
                      ? 'ring-2 ring-offset-2 ring-gray-800'
                      : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
