'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import TabNavigation from '@/components/dashboard/TabNavigation';
import TodoPanel from '@/components/dashboard/parent/TodoPanel';
import ChoresPanel from '@/components/dashboard/parent/ChoresPanel';
import EventTrackerPanel from '@/components/dashboard/parent/EventTrackerPanel';
import ExamPlannerPanel from '@/components/dashboard/parent/ExamPlannerPanel';
import OlympiadPlannerPanel from '@/components/dashboard/parent/OlympiadPlannerPanel';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

type TabType = 'todo' | 'chores' | 'events' | 'exams' | 'olympiad';

export default function ParentDashboard({ params }: { params: { profileId: string } }) {
  const router = useRouter();
  const { currentProfile, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('todo');

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'todo', label: 'StepOut' },
    { id: 'chores', label: 'Chores' },
    { id: 'events', label: 'EventTrack' },
    { id: 'exams', label: 'ExamPlanner' },
    { id: 'olympiad', label: 'OlympiadPlanner' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: currentProfile?.colorCode }}>
              {currentProfile?.avatar || '👤'}
            </div>
            <h1 className="text-xl font-bold text-gray-800">
              {currentProfile?.displayName}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </nav>

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'todo' && <TodoPanel profileId={params.profileId} />}
        {activeTab === 'chores' && <ChoresPanel profileId={params.profileId} />}
        {activeTab === 'events' && <EventTrackerPanel profileId={params.profileId} />}
        {activeTab === 'exams' && <ExamPlannerPanel profileId={params.profileId} />}
        {activeTab === 'olympiad' && <OlympiadPlannerPanel profileId={params.profileId} />}
      </div>
    </div>
  );
}
