'use client';

import { useEffect, useState } from 'react';
import { olympiadAPI } from '@/lib/api';
import { Trophy, Calendar } from 'lucide-react';

interface Olympiad {
  id: string;
  subject: string;
  topic: string;
  prepDate: string;
  status: string;
}

export default function ChildOlympiadPanel({ profileId }: { profileId: string }) {
  const [olympiads, setOlympiads] = useState<Olympiad[]>([]);
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

  if (loading) return <div className="text-center py-8 text-gray-600">Loading Olympiad schedule...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Olympiad Preparation</h2>

      {olympiads.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No Olympiad preparations scheduled yet!
        </div>
      ) : (
        <div className="grid gap-3">
          {olympiads.map((olympiad) => (
            <div key={olympiad.id} className="card border-l-4 border-purple-500">
              <div className="flex items-start gap-4">
                <Trophy className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-800">{olympiad.subject} Olympiad</p>
                  <p className="text-sm text-gray-600 mt-1">Topic: {olympiad.topic}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Prep Date: {new Date(olympiad.prepDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {olympiad.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
