'use client';

import { useState, useEffect } from 'react';
import { useAuthStore, type Profile } from '@/lib/store';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TabNavigation from '@/components/dashboard/TabNavigation';
import TodoPanel from '@/components/dashboard/parent/TodoPanel';
import HomeworkPanel from '@/components/dashboard/parent/HomeworkPanel';
import EventTrackerPanel from '@/components/dashboard/parent/EventTrackerPanel';
import ExamPlannerPanel from '@/components/dashboard/parent/ExamPlannerPanel';
import OlympiadPlannerPanel from '@/components/dashboard/parent/OlympiadPlannerPanel';
import { useRouter } from 'next/navigation';
import { profilesAPI } from '@/lib/api';

type TabType = 'todo' | 'homework' | 'events' | 'exams' | 'olympiad';

export default function ParentDashboard({ params }: { params: { profileId: string } }) {
  const router = useRouter();
  const { setCurrentProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('todo');
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

  const tabs: { id: TabType; label: string }[] = [
    { id: 'todo', label: 'StepOut' },
    { id: 'homework', label: 'Homework' },
    { id: 'events', label: 'EventTrack' },
    { id: 'exams', label: 'ExamPlanner' },
    { id: 'olympiad', label: 'OlympiadPlanner' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader allProfiles={allProfiles} onProfileSwitch={handleProfileSwitch} />

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-6xl mx-auto p-4">
        {activeTab === 'todo' && <TodoPanel profileId={params.profileId} />}
        {activeTab === 'homework' && <HomeworkPanel profileId={params.profileId} />}
        {activeTab === 'events' && <EventTrackerPanel profileId={params.profileId} />}
        {activeTab === 'exams' && <ExamPlannerPanel profileId={params.profileId} />}
        {activeTab === 'olympiad' && <OlympiadPlannerPanel profileId={params.profileId} />}
      </div>
    </div>
  );
}
