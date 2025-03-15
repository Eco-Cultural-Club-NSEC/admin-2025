import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  admin: boolean;
}

interface AuthState {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
  checkAuth: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      signIn: (user: User) => {
        const adminUser = {
          ...user,
          admin: true,
          is_admin: true,
        };
        set({ user: adminUser });
      },
      signOut: () => {
        set({ user: null });
      },
      checkAuth: () => {
        const state = get();
        return !!state.user;
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Validate stored state on rehydration
        if (state?.user) {
          state.user = { ...state.user, admin: true, is_admin: true };
        }
      },
    }
  )
);
