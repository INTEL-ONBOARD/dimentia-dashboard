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
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const setAuthCookie = (value: string) => {
  document.cookie = `auth-token=${value}; path=/; max-age=${60 * 60 * 24 * 7}`;
};

const removeAuthCookie = () => {
  document.cookie = 'auth-token=; path=/; max-age=0';
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.message || 'Invalid credentials');
        }

        const { token, user } = json.data;

        setAuthCookie(token);

        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        removeAuthCookie();
        set({ user: null, token: null, isAuthenticated: false });
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
