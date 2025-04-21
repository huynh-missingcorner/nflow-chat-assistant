import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

interface UserState {
  // State
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  signOut: () => void;
}

// Mock user data - Replace with real data from your auth system
const mockUser = {
  name: "Admin",
  email: "admin@gmail.com",
  avatarUrl: "", // Add avatar URL if available
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      user: mockUser, // For demo purposes, initialize with mock data
      isAuthenticated: true, // For demo purposes, assume authenticated

      // Actions
      setUser: (user: User) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
      signOut: () => {
        // Implement sign out logic here (e.g., API call to logout)
        console.log("User signed out");
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "user-storage",
    }
  )
);
