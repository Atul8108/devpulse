import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileStore {
  username: string;
  recentSearches: string[];
  isLoading: boolean;
  error: string | null;
  setUsername: (username: string) => void;
  addRecentSearch: (username: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      username: '',
      recentSearches: [],
      isLoading: false,
      error: null,
      setUsername: (username) => set({ username }),
      addRecentSearch: (username) =>
        set((state) => ({
          recentSearches: [
            username,
            ...state.recentSearches.filter((u) => u !== username),
          ].slice(0, 5),
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'devpulse-store',
      partialize: (state) => ({ recentSearches: state.recentSearches }),
    }
  )
);
