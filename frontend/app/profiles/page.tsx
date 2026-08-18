'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { profilesAPI } from '@/lib/api';
import { useAuthStore, Profile } from '@/lib/store';
import CreateProfileModal from '@/components/profiles/CreateProfileModal';
import { Plus } from 'lucide-react';

export default function ProfilesPage() {
  const router = useRouter();
  const { user, setCurrentProfile } = useAuthStore();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    fetchProfiles();
  }, [user, router]);

  const fetchProfiles = async () => {
    try {
      const response = await profilesAPI.getAll();
      setProfiles(response.data.profiles);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelect = (profile: Profile) => {
    setCurrentProfile(profile);
    if (profile.relationship === 'PARENT' || profile.relationship === 'OWNER') {
      router.push(`/dashboard/parent/${profile.id}`);
    } else {
      router.push(`/dashboard/child/${profile.id}`);
    }
  };

  const handleProfileCreated = () => {
    setShowModal(false);
    fetchProfiles();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-2">Select a profile to get started</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              className="group"
            >
              <div className="card hover:shadow-lg transition-all transform hover:scale-105">
                <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: profile.colorCode }}>
                  {profile.avatar ? profile.avatar : '👤'}
                </div>
                <p className="font-semibold text-gray-800 text-center">
                  {profile.displayName}
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {profile.relationship === 'PARENT' || profile.relationship === 'OWNER'
                    ? 'Parent'
                    : 'Child'}
                </p>
              </div>
            </button>
          ))}

          {user?.accountType === 'FAMILY' && profiles.length < 6 && (
            <button
              onClick={() => setShowModal(true)}
              className="group"
            >
              <div className="card hover:shadow-lg transition-all transform hover:scale-105 flex flex-col items-center justify-center h-full gap-3">
                <Plus className="w-8 h-8 text-primary" />
                <p className="font-semibold text-gray-800">Add Profile</p>
              </div>
            </button>
          )}
        </div>

        {showModal && (
          <CreateProfileModal
            onClose={() => setShowModal(false)}
            onSuccess={handleProfileCreated}
          />
        )}
      </div>
    </div>
  );
}
