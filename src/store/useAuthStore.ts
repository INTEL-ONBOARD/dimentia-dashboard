import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Helper to set cookie
const setAuthCookie = (value: string) => {
  document.cookie = `auth-token=${value}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
};

// Helper to remove cookie
const removeAuthCookie = () => {
  document.cookie = 'auth-token=; path=/; max-age=0';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (email === 'admin@demo.com' && password === 'password123') {
          // Set auth cookie for middleware
          setAuthCookie('authenticated');

          set({
            user: {
              id: '1',
              name: 'Admin User',
              email: 'admin@demo.com',
              role: 'admin',
            },
            isAuthenticated: true,
          });
        } else {
          throw new Error('Invalid credentials');
        }
      },

      logout: () => {
        removeAuthCookie();
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    { name: 'auth-storage' }
  )
);
