import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  accountType: 'SINGLE' | 'FAMILY';
}

export interface Profile {
  id: string;
  displayName: string;
  avatar?: string;
  relationship: 'PARENT' | 'CHILD' | 'OWNER';
  colorCode: string;
  age?: number;
}

interface AuthStore {
  user: User | null;
  currentProfile: Profile | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setCurrentProfile: (profile: Profile | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  currentProfile: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  logout: () => set({ user: null, currentProfile: null, isAuthenticated: false }),
}));
