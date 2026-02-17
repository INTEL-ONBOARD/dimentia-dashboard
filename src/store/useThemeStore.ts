import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        console.log('[Theme] Toggling from', currentTheme, 'to', newTheme);

        if (typeof document !== 'undefined') {
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log('[Theme] Added dark class');
          } else {
            document.documentElement.classList.remove('dark');
            console.log('[Theme] Removed dark class');
          }
        }

        set({ theme: newTheme });
        console.log('[Theme] State updated to', newTheme);
      },

      setTheme: (theme) => {
        console.log('[Theme] setTheme called with:', theme);
        if (typeof document !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log('[Theme] Added dark class via setTheme');
          } else {
            document.documentElement.classList.remove('dark');
            console.log('[Theme] Removed dark class via setTheme');
          }
        }
        set({ theme });
      },
    }),
    { name: 'theme-storage' }
  )
);
