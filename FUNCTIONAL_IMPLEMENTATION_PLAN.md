# 🎯 DementiaMithura Analytics Dashboard - 100% Functional Implementation Plan

## ⚠️ CRITICAL REQUIREMENT: ALL FEATURES MUST WORK

This document outlines the **complete, production-ready implementation** where **EVERY feature is 100% functional**, not mock/demo components.

---

## 📋 Current Dashboard Analysis

### Existing Features (Working)
✅ **Sidebar Navigation**
- Light/Dark mode toggle (client-side state)
- Navigation items with active states
- Collapsible sidebar structure
- Pro plan upgrade card

✅ **Top Navigation**
- Search input (functional)
- User/Creator role toggle (working state management)
- Notification bell with badge indicator
- User avatar

✅ **Stats Cards**
- Dynamic data display
- Up/down trend indicators
- Percentage changes

✅ **NFT Cards Grid**
- Category filtering tabs
- Project cards with gradients
- Progress tracking
- Time remaining display

✅ **Contributors List**
- Follow/Following state management
- See All functionality

### What's NOT Functional (Static Only)
❌ Search doesn't actually search
❌ Notifications don't show dropdown
❌ User profile doesn't have dropdown menu
❌ Follow buttons don't persist state
❌ Category tabs don't filter
❌ Theme toggle doesn't persist
❌ No actual data fetching
❌ No routing between pages

---

## 🎯 NEW DASHBOARD: 100% FUNCTIONAL REQUIREMENTS

### Core Infrastructure Needed

#### 1. **State Management**
```typescript
// Use Zustand for global state
- User authentication state
- Notifications state
- Theme preference (light/dark)
- User profile data
- Dashboard settings
- Data cache
```

#### 2. **Data Layer**
```typescript
// Real data fetching with API integration
- API client with error handling
- Data caching (React Query or SWR)
- Real-time updates (WebSocket or polling)
- Offline support
- Loading states
- Error states
```

#### 3. **Routing**
```typescript
// Next.js App Router (already in place)
- 8 functional pages with proper routing
- Protected routes (authentication required)
- Dynamic routes for user profiles, articles, etc.
- Breadcrumbs
```

#### 4. **Authentication**
```typescript
// Full authentication system
- Login/Logout functionality
- Session management
- Protected routes
- Role-based access (Admin, Analyst, Viewer)
- Password reset
- Remember me
```

---

## 🔧 PHASE-BY-PHASE FUNCTIONAL IMPLEMENTATION

### PHASE 1: Core Infrastructure Setup (Week 1)

#### Task 1.1: Install Required Dependencies
```bash
npm install zustand                    # State management
npm install @tanstack/react-query      # Data fetching
npm install recharts                   # Charts
npm install date-fns                   # Date utilities
npm install react-hot-toast            # Toast notifications
npm install @headlessui/react          # Accessible UI components
npm install @heroicons/react           # Additional icons
npm install react-hook-form            # Form handling
npm install zod                        # Schema validation
npm install clsx                       # Conditional classes
npm install tailwind-merge             # Tailwind class merging
npm install sonner                     # Better toast notifications
npm install vaul                       # Drawer component
```

#### Task 1.2: Setup Global State (Zustand)
**Create: `src/store/useAuthStore.ts`**
```typescript
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        // Real API call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Login failed');

        const { user, token } = await response.json();
        localStorage.setItem('auth_token', token);
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
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
```

**Create: `src/store/useThemeStore.ts`**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',

      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          // Apply theme to document
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          return { theme: newTheme };
        });
      },

      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
    }),
    { name: 'theme-storage' }
  )
);
```

**Create: `src/store/useNotificationStore.ts`**
```typescript
import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.read
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
```

**Create: `src/store/useSettingsStore.ts`**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  dateRange: 'last7days' | 'last30days' | 'last90days' | 'custom';
  customDateRange?: { start: Date; end: Date };
  refreshInterval: number; // in seconds
  chartAnimations: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
  };
  dataRetention: number; // in days
}

interface SettingsState {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        dateRange: 'last30days',
        refreshInterval: 300, // 5 minutes
        chartAnimations: true,
        notifications: {
          email: true,
          push: true,
          slack: false,
        },
        dataRetention: 730, // 2 years
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
    }),
    { name: 'settings-storage' }
  )
);
```

#### Task 1.3: Setup React Query Provider
**Update: `src/app/layout.tsx`**
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DementiaMithura - Analytics Dashboard",
  description: "Analytics Dashboard for DementiaMithura Mobile App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Create: `src/app/providers.tsx`**
```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    setMounted(true);
    // Apply initial theme
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" theme={theme} richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### Task 1.4: Setup API Client
**Create: `src/lib/api-client.ts`**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => fetchApi('/auth/logout', { method: 'POST' }),

  // Metrics
  getMetrics: () => fetchApi('/metrics'),

  getDailyActiveUsers: (days = 30) =>
    fetchApi(`/analytics/dau?days=${days}`),

  getMonthlyActiveUsers: () =>
    fetchApi('/analytics/mau'),

  // Users
  getUsers: (page = 1, limit = 50, filters?: any) =>
    fetchApi(`/users?page=${page}&limit=${limit}${filters ? `&${new URLSearchParams(filters)}` : ''}`),

  getUserById: (id: string) =>
    fetchApi(`/users/${id}`),

  getUserDemographics: () =>
    fetchApi('/analytics/demographics'),

  // Engagement
  getFeatureUsage: () =>
    fetchApi('/analytics/feature-usage'),

  getSessionAnalytics: () =>
    fetchApi('/analytics/sessions'),

  // Health
  getSymptomAnalytics: () =>
    fetchApi('/analytics/symptoms'),

  getMoodAnalytics: () =>
    fetchApi('/analytics/mood'),

  // Content
  getArticlePerformance: () =>
    fetchApi('/analytics/articles'),

  getArticleById: (id: number) =>
    fetchApi(`/analytics/articles/${id}`),

  // Reminders
  getReminderAnalytics: () =>
    fetchApi('/analytics/reminders'),

  // Export
  exportData: (type: string, format: 'csv' | 'excel' | 'pdf') =>
    fetchApi(`/export/${type}?format=${format}`),

  // Notifications
  getNotifications: () =>
    fetchApi('/notifications'),

  markNotificationRead: (id: string) =>
    fetchApi(`/notifications/${id}/read`, { method: 'PUT' }),

  // Settings
  getSettings: () =>
    fetchApi('/settings'),

  updateSettings: (settings: any) =>
    fetchApi('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};
```

#### Task 1.5: Update Tailwind for Dark Mode
**Update: `src/app/globals.css`**
```css
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* Light mode (default) */
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;

  /* Healthcare palette */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-secondary: #10b981;
  --color-accent: #8b5cf6;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}

/* Dark mode */
.dark {
  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-border: #374151;

  --color-primary: #60a5fa;
  --color-primary-hover: #3b82f6;
  --color-secondary: #34d399;
  --color-accent: #a78bfa;
  --color-warning: #fbbf24;
  --color-danger: #f87171;
}

body {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

---

### PHASE 2: Functional Components (Week 2)

#### Task 2.1: Fully Functional Sidebar
**Update: `src/components/Sidebar.tsx`**
```typescript
"use client";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Heart,
  FileText,
  Bell,
  FileBarChart,
  Settings,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Users, label: "User Analytics", href: "/users" },
  { icon: TrendingUp, label: "Engagement", href: "/engagement" },
];

const analyticsItems = [
  { icon: Heart, label: "Health Insights", href: "/health-insights" },
  { icon: FileText, label: "Content Analytics", href: "/content" },
  { icon: Bell, label: "Reminder Analytics", href: "/reminders" },
];

const managementItems = [
  { icon: FileBarChart, label: "Reports & Export", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [analyticsExpanded, setAnalyticsExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const NavLink = ({ item }: { item: typeof mainNavItems[0] }) => {
    const isActive = pathname === item.href;

    return (
      <a
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
          isActive
            ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        }`}
      >
        <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
        {item.label}
      </a>
    );
  };

  return (
    <aside className="w-[240px] h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between py-7 px-5 fixed left-0 top-0 overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Heart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">
              DementiaMithura
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Analytics Dashboard</p>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Analytics Section */}
        <div className="mt-8">
          <button
            onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold text-gray-300 dark:text-gray-600 tracking-[0.15em] uppercase hover:text-gray-400"
          >
            Analytics
            <ChevronDown
              size={14}
              className={`transition-transform ${analyticsExpanded ? '' : '-rotate-90'}`}
            />
          </button>

          {analyticsExpanded && (
            <nav className="space-y-0.5 mt-2">
              {analyticsItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          )}
        </div>

        {/* Management */}
        <p className="text-[10px] font-bold text-gray-300 dark:text-gray-600 tracking-[0.15em] uppercase mt-8 mb-2 px-3">
          Management
        </p>
        <nav className="space-y-0.5">
          {managementItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Theme & Logout */}
        <div className="mt-8 space-y-2">
          <div className="flex items-center justify-between px-3 py-2.5">
            <div className="flex items-center gap-3 text-[13px] font-medium text-gray-500 dark:text-gray-400">
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              {theme === 'dark' ? 'Dark' : 'Light'} Mode
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-[3px]"
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  theme === 'light'
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <Sun size={11} />
              </span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  theme === 'dark'
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <Moon size={11} />
              </span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="mt-6 rounded-2xl p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-blue-100 capitalize">{user?.role || 'admin'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

#### Task 2.2: Fully Functional Top Navigation with Dropdowns
**Update: `src/components/TopNav.tsx`**
```typescript
"use client";
import { Search, Bell, User, Settings, LogOut, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { formatDistanceToNow } from "date-fns";

interface TopNavProps {
  title?: string;
  subtitle?: string;
}

export default function TopNav({ title = "Overview Dashboard", subtitle }: TopNavProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between mb-6">
      {/* Left: Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, articles..."
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-gray-900 dark:text-white"
          />
        </form>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications ({unreadCount})
                </h3>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          router.push(notification.actionUrl);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      router.push('/notifications');
                      setShowNotifications(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg pr-2 py-2 transition-colors"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role || 'admin'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.charAt(0) || 'A'
              )}
            </div>
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'admin@dementiamithura.com'}</p>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    router.push('/profile');
                    setShowProfile(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowProfile(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </button>
              </div>

              <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
```

---

### I'll continue with more functional components in the next response. This is getting long!

Would you like me to:
1. Continue with the rest of Phase 2 (Functional Charts, Tables, Forms)?
2. Move to Phase 3 (All 8 Pages with Full Functionality)?
3. Or focus on a specific feature you want to see first?

Let me know and I'll continue! 🚀