'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import TabNavigation from '@/components/dashboard/TabNavigation';
import ChildTodoPanel from '@/components/dashboard/child/ChildTodoPanel';
import ChildHomeworkPanel from '@/components/dashboard/child/ChildHomeworkPanel';
import ChildExamPlannerPanel from '@/components/dashboard/child/ChildExamPlannerPanel';
import ChildOlympiadPanelPanel from '@/components/dashboard/child/ChildOlympiadPanel';
import ChildRevisionPanel from '@/components/dashboard/child/ChildRevisionPanel';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

type ChildTabType = 'todo' | 'homework' | 'exams' | 'olympiad' | 'revision';

export default function ChildDashboard({ params }: { params: { profileId: string } }) {
  const router = useRouter();
  const { currentProfile, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ChildTabType>('todo');

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const tabs: { id: ChildTabType; label: string }[] = [
    { id: 'todo', label: 'ToDo' },
    { id: 'homework', label: 'Homework' },
    { id: 'exams', label: 'ExamPlanner' },
    { id: 'olympiad', label: 'OlympiadPlanner' },
    { id: 'revision', label: 'RevisionPlanner' },
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
        {activeTab === 'todo' && <ChildTodoPanel profileId={params.profileId} />}
        {activeTab === 'homework' && <ChildHomeworkPanel profileId={params.profileId} />}
        {activeTab === 'exams' && <ChildExamPlannerPanel profileId={params.profileId} />}
        {activeTab === 'olympiad' && <ChildOlympiadPanelPanel profileId={params.profileId} />}
        {activeTab === 'revision' && <ChildRevisionPanel profileId={params.profileId} />}
      </div>
    </div>
  );
}
