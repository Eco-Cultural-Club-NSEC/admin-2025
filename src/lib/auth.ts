import { create } from 'zustand';

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
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  signIn: (user: User) => {
    // Simulate a sign in with dummy data
    set({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        admin: user.admin
      }
    });    
  },
  signOut: () => set({ user: null })
}));