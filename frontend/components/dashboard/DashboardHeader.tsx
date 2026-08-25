'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type Profile } from '@/lib/store';
import { LogOut, Home, ChevronDown } from 'lucide-react';
import { authAPI } from '@/lib/api';

interface DashboardHeaderProps {
  allProfiles: Profile[];
  onProfileSwitch: (profile: Profile) => void;
}

export default function DashboardHeader({ allProfiles, onProfileSwitch }: DashboardHeaderProps) {
  const router = useRouter();
  const { currentProfile, logout } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleBackToProfiles = () => {
    router.push('/profiles');
  };

  const handleProfileSelect = (profile: Profile) => {
    setShowProfileMenu(false);
    onProfileSwitch(profile);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToProfiles}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to profiles"
          >
            <Home className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: currentProfile?.colorCode }}
              >
                {currentProfile?.avatar || '👤'}
              </div>
              <span className="font-semibold text-gray-800">
                {currentProfile?.displayName}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showProfileMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                <div className="p-2">
                  <p className="text-xs text-gray-500 px-3 py-2 font-semibold">Switch Profile</p>
                  {allProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => handleProfileSelect(profile)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        currentProfile?.id === profile.id
                          ? 'bg-purple-100 text-purple-900'
                          : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: profile.colorCode }}
                      >
                        {profile.avatar || '👤'}
                      </div>
                      <span className="flex-1">{profile.displayName}</span>
                      {currentProfile?.id === profile.id && (
                        <span className="text-purple-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </nav>
  );
}
