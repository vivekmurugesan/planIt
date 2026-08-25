'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, type Profile } from '@/lib/store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TabNavigation from '@/components/dashboard/TabNavigation';
import ChildTodoPanel from '@/components/dashboard/child/ChildTodoPanel';
import ChildHomeworkPanel from '@/components/dashboard/child/ChildHomeworkPanel';
import ChildExamPlannerPanel from '@/components/dashboard/child/ChildExamPlannerPanel';
import ChildOlympiadPanelPanel from '@/components/dashboard/child/ChildOlympiadPanel';
import ChildRevisionPanel from '@/components/dashboard/child/ChildRevisionPanel';
import ChildFitnessPanel from '@/components/dashboard/child/ChildFitnessPanel';
import { useRouter } from 'next/navigation';
import { profilesAPI } from '@/lib/api';

type ChildTabType = 'todo' | 'homework' | 'exams' | 'olympiad' | 'revision' | 'fitness';

export default function ChildDashboard({ params }: { params: { profileId: string } }) {
  const router = useRouter();
  const { setCurrentProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ChildTabType>('todo');
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await profilesAPI.getAll();
      setAllProfiles(response.data.profiles);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    }
  };

  const handleProfileSwitch = (profile: Profile) => {
    setCurrentProfile(profile);
    if (profile.relationship === 'PARENT' || profile.relationship === 'OWNER') {
      router.push(`/dashboard/parent/${profile.id}`);
    } else {
      router.push(`/dashboard/child/${profile.id}`);
    }
  };

  const tabs: { id: ChildTabType; label: string }[] = [
    { id: 'todo', label: 'ToDo' },
    { id: 'homework', label: 'Homework' },
    { id: 'fitness', label: 'Fitness' },
    { id: 'exams', label: 'ExamPlanner' },
    { id: 'olympiad', label: 'OlympiadPlanner' },
    { id: 'revision', label: 'RevisionPlanner' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader allProfiles={allProfiles} onProfileSwitch={handleProfileSwitch} />

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'todo' && <ChildTodoPanel profileId={params.profileId} />}
        {activeTab === 'homework' && <ChildHomeworkPanel profileId={params.profileId} />}
        {activeTab === 'fitness' && <ChildFitnessPanel profileId={params.profileId} />}
        {activeTab === 'exams' && <ChildExamPlannerPanel profileId={params.profileId} />}
        {activeTab === 'olympiad' && <ChildOlympiadPanelPanel profileId={params.profileId} />}
        {activeTab === 'revision' && <ChildRevisionPanel profileId={params.profileId} />}
      </div>
    </div>
  );
}
