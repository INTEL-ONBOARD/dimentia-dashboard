"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    setMounted(true);

    // IMPORTANT: Always start by removing dark class to prevent stuck states
    document.documentElement.classList.remove('dark');

    // Initialize theme from localStorage or system preference
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      try {
        const { state } = JSON.parse(stored);
        const currentTheme = state.theme || 'light';

        // Apply the stored theme
        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark');
        }
        // Light mode: dark class already removed above

        // Update store if needed
        if (state.theme !== theme) {
          setTheme(currentTheme);
        }
      } catch (e) {
        // If parsing fails, use default (light mode)
        // Dark class already removed above
        setTheme('light');
      }
    } else {
      // No stored theme - check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
        setTheme('dark');
      } else {
        // Light mode: dark class already removed above
        setTheme('light');
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      // Use explicit add/remove for consistency
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme, mounted]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" theme={theme} richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
