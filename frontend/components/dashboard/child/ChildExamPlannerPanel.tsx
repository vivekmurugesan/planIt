'use client';

import { useEffect, useState } from 'react';
import { examAPI } from '@/lib/api';
import { Calendar, Clock } from 'lucide-react';

interface Exam {
  id: string;
  subject: string;
  topic: string;
  testDate: string;
  status: string;
}

export default function ChildExamPlannerPanel({ profileId }: { profileId: string }) {
  const [exams, setExams] = useState<Exam[]>([]);
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

  const getCountdown = (testDate: string) => {
    const now = new Date();
    const date = new Date(testDate);
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const sortedExams = [...exams].sort((a, b) =>
    new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
  );

  if (loading) return <div className="text-center py-8 text-gray-600">Loading exam schedule...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">My Exam Schedule</h2>

      {sortedExams.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No exams scheduled yet!</div>
      ) : (
        <div className="space-y-3">
          {sortedExams.map((exam) => {
            const countdown = getCountdown(exam.testDate);
            const isUrgent = countdown <= 7 && countdown > 0;

            return (
              <div
                key={exam.id}
                className={`card ${isUrgent ? 'border-l-4 border-red-500 bg-red-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-800">{exam.subject}</p>
                    <p className="text-sm text-gray-600 mt-1">{exam.topic}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{new Date(exam.testDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{new Date(exam.testDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-3 rounded-lg text-center flex-shrink-0 ${
                    countdown <= 0
                      ? 'bg-gray-100 text-gray-600'
                      : countdown <= 3
                      ? 'bg-red-100 text-red-700'
                      : countdown <= 7
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    <p className="text-2xl font-bold">{countdown <= 0 ? '✓' : countdown}</p>
                    <p className="text-xs mt-1">{countdown <= 0 ? 'Done' : 'Days'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
