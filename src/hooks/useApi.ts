/**
 * React Query Hooks for API Integration
 * Centralized data fetching with loading, error states, and caching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  DashboardMetrics,
  DailyActiveUsersData,
  FeatureUsage,
  UserData,
  Demographics,
  SymptomData,
  MoodData,
  ArticlePerformance,
  SessionsResponse,
  ArticlesResponse,
  SymptomsResponse,
  MoodsResponse,
  RemindersResponse,
  UsersResponse,
} from '@/lib/types';

// ============================================
// QUERY KEYS (for cache management)
// ============================================
export const queryKeys = {
  metrics: ['metrics'] as const,
  dau: (days: number) => ['dau', days] as const,
  mau: ['mau'] as const,
  featureUsage: ['featureUsage'] as const,
  users: (params?: any) => ['users', params] as const,
  user: (id: string) => ['user', id] as const,
  demographics: ['demographics'] as const,
  sessions: ['sessions'] as const,
  articles: ['articles'] as const,
  symptoms: ['symptoms'] as const,
  moods: ['moods'] as const,
  reminders: ['reminders'] as const,
  notifications: ['notifications'] as const,
  settings: ['settings'] as const,
};

// ============================================
// METRICS & OVERVIEW
// ============================================

/**
 * Get dashboard overview metrics
 * Refetches every 5 minutes
 */
export function useMetrics() {
  return useQuery({
    queryKey: queryKeys.metrics,
    queryFn: () => apiClient.metrics.getOverview(),
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // Consider stale after 2 minutes
  });
}

/**
 * Get Daily Active Users data
 * @param days - Number of days to fetch (default: 30)
 */
export function useDailyActiveUsers(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.dau(days),
    queryFn: () => apiClient.metrics.getDailyActiveUsers(days),
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * Get Monthly Active Users
 */
export function useMonthlyActiveUsers() {
  return useQuery({
    queryKey: queryKeys.mau,
    queryFn: () => apiClient.metrics.getMonthlyActiveUsers(),
    refetchInterval: 30 * 60 * 1000, // 30 minutes (less frequent)
  });
}

/**
 * Get feature usage distribution
 */
export function useFeatureUsage() {
  return useQuery({
    queryKey: queryKeys.featureUsage,
    queryFn: () => apiClient.metrics.getFeatureUsage(),
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}

// ============================================
// USERS
// ============================================

/**
 * Get all users with pagination and filtering
 */
export function useUsers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery<UsersResponse>({
    queryKey: queryKeys.users(params),
    queryFn: () => apiClient.users.getAll(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Get single user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiClient.users.getById(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

/**
 * Get user demographics
 */
export function useDemographics() {
  return useQuery({
    queryKey: queryKeys.demographics,
    queryFn: () => apiClient.users.getDemographics(),
    refetchInterval: 10 * 60 * 1000,
  });
}

// ============================================
// ENGAGEMENT
// ============================================

/**
 * Get session analytics
 */
export function useSessions() {
  return useQuery<SessionsResponse>({
    queryKey: queryKeys.sessions,
    queryFn: () => apiClient.engagement.getSessions(),
    refetchInterval: 5 * 60 * 1000,
  });
}

/**
 * Get article engagement data
 */
export function useArticles() {
  return useQuery<ArticlesResponse>({
    queryKey: queryKeys.articles,
    queryFn: () => apiClient.engagement.getArticles(),
    refetchInterval: 10 * 60 * 1000,
  });
}

// ============================================
// HEALTH INSIGHTS
// ============================================

/**
 * Get symptom analytics
 */
export function useSymptoms() {
  return useQuery<SymptomsResponse>({
    queryKey: queryKeys.symptoms,
    queryFn: () => apiClient.health.getSymptoms(),
    refetchInterval: 10 * 60 * 1000,
  });
}

/**
 * Get mood analytics
 */
export function useMoods() {
  return useQuery<MoodsResponse>({
    queryKey: queryKeys.moods,
    queryFn: () => apiClient.health.getMoods(),
    refetchInterval: 10 * 60 * 1000,
  });
}

// ============================================
// REMINDERS
// ============================================

/**
 * Get reminder analytics
 */
export function useReminders() {
  return useQuery<RemindersResponse>({
    queryKey: queryKeys.reminders,
    queryFn: () => apiClient.reminders.getAnalytics(),
    refetchInterval: 10 * 60 * 1000,
  });
}

// ============================================
// NOTIFICATIONS
// ============================================

/**
 * Get notifications
 */
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => apiClient.notifications.getAll(),
    refetchInterval: 60 * 1000, // 1 minute
  });
}

/**
 * Mark notification as read (mutation)
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.notifications.markAsRead(id),
    onSuccess: () => {
      // Invalidate notifications query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
}

// ============================================
// SETTINGS
// ============================================

/**
 * Get dashboard settings
 */
export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => apiClient.settings.get(),
  });
}

/**
 * Update settings (mutation)
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: any) => apiClient.settings.update(settings),
    onSuccess: () => {
      toast.success('Settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });
}

// ============================================
// EXPORT UTILITIES
// ============================================

/**
 * Export users data
 */
export function useExportUsers() {
  return useMutation({
    mutationFn: (format: 'csv' | 'excel') => apiClient.export.users(format),
    onSuccess: () => {
      toast.success('Export started! Download will begin shortly.');
    },
    onError: () => {
      toast.error('Export failed. Please try again.');
    },
  });
}

/**
 * Export articles data
 */
export function useExportArticles() {
  return useMutation({
    mutationFn: (format: 'csv' | 'excel') => apiClient.export.articles(format),
    onSuccess: () => {
      toast.success('Export started! Download will begin shortly.');
    },
    onError: () => {
      toast.error('Export failed. Please try again.');
    },
  });
}

// ============================================
// ACTIVITY FEED
// ============================================

export function useActivity(limit = 10) {
  return useQuery({
    queryKey: ['activity', limit] as const,
    queryFn: () => apiClient.activity.getRecent(limit),
    refetchInterval: 60 * 1000, // 1 minute
  });
}

// ============================================
// REMINDERS INSIGHTS
// ============================================

export function useReminderInsights() {
  return useQuery({
    queryKey: ['reminderInsights'] as const,
    queryFn: () => apiClient.reminders.getInsights(),
    refetchInterval: 10 * 60 * 1000,
  });
}

// ============================================
// MANUAL REFETCH UTILITIES
// ============================================

/**
 * Hook to manually refresh all dashboard data
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.metrics });
    queryClient.invalidateQueries({ queryKey: ['dau'] });
    queryClient.invalidateQueries({ queryKey: queryKeys.featureUsage });
    toast.success('Dashboard refreshed!');
  };

  return { refresh };
}

/**
 * Hook to get last updated timestamp
 */
export function useLastUpdated() {
  const queryClient = useQueryClient();

  const getLastUpdated = (queryKey: any[]) => {
    const query = queryClient.getQueryState(queryKey);
    return query?.dataUpdatedAt ? new Date(query.dataUpdatedAt) : null;
  };

  return { getLastUpdated };
}
