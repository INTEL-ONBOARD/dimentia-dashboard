import type {
  ApiResponse,
  ApiError,
  DashboardMetrics,
  DailyActiveUsersData,
  FeatureUsage,
  UsersResponse,
  Demographics,
  SessionsResponse,
  ArticlesResponse,
  SymptomsResponse,
  MoodsResponse,
  RemindersResponse,
} from './types';
import {
  mockMetrics,
  mockDailyActiveUsers,
  mockFeatureUsage,
  mockUsers,
  mockDemographics,
  mockSymptoms,
  mockMoodData,
  mockArticlePerformance,
} from './mockData';

/**
 * API Client for making requests to the backend
 * Handles authentication, error handling, and request/response formatting
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false'; // Default to mock data

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      return state.token || null;
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Main fetch wrapper with error handling and auth
 */
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with provided headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new ApiClientError(
        errorData.message || `HTTP Error ${response.status}`,
        response.status,
        errorData.code
      );
    }

    // Parse JSON response
    const data = await response.json();

    // If response has ApiResponse structure, return the data
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as ApiResponse<T>).data;
    }

    return data;
  } catch (error) {
    // Re-throw ApiClientError
    if (error instanceof ApiClientError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError) {
      throw new ApiClientError(
        'Network error - please check your connection',
        0
      );
    }

    // Handle other errors
    throw new ApiClientError(
      'An unexpected error occurred',
      500
    );
  }
}

/**
 * API Client methods
 */
export const apiClient = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    logout: () =>
      fetchWithAuth('/api/auth/logout', {
        method: 'POST',
      }),

    me: () =>
      fetchWithAuth('/api/auth/me'),
  },

  // Metrics endpoints
  metrics: {
    getOverview: async (): Promise<DashboardMetrics> =>
      USE_MOCK_DATA
        ? mockMetrics
        : fetchWithAuth('/api/metrics'),

    getDailyActiveUsers: async (days: number = 30): Promise<DailyActiveUsersData[]> =>
      USE_MOCK_DATA
        ? mockDailyActiveUsers
        : fetchWithAuth(`/api/analytics/dau?days=${days}`),

    getMonthlyActiveUsers: async (): Promise<{ users: number; change: number }> =>
      USE_MOCK_DATA
        ? { users: 4567, change: 8.1 }
        : fetchWithAuth('/api/analytics/mau'),

    getFeatureUsage: async (): Promise<FeatureUsage[]> =>
      USE_MOCK_DATA
        ? mockFeatureUsage
        : fetchWithAuth('/api/analytics/feature-usage'),
  },

  // Users endpoints
  users: {
    getAll: async (params?: { page?: number; limit?: number; search?: string }): Promise<{ users: any[], total: number, page: number, pageSize?: number }> =>
      USE_MOCK_DATA
        ? { users: mockUsers, total: mockUsers.length, page: 1, pageSize: 20 }
        : fetchWithAuth(`/api/users?${new URLSearchParams(params as any)}`),

    getById: (id: string) =>
      USE_MOCK_DATA
        ? Promise.resolve(mockUsers.find(u => u.id.toString() === id) || null)
        : fetchWithAuth(`/api/users/${id}`),

    getDemographics: async (): Promise<Demographics> =>
      USE_MOCK_DATA
        ? mockDemographics
        : fetchWithAuth('/api/analytics/demographics'),
  },

  // Engagement endpoints
  engagement: {
    getSessions: async (): Promise<SessionsResponse> =>
      USE_MOCK_DATA
        ? {
          totalViews: 4847,
          viewsChange: 12,
          avgSessionDuration: 6.5,
          durationChange: 8
        }
        : fetchWithAuth('/api/analytics/sessions'),

    getArticles: async (): Promise<ArticlesResponse> =>
      USE_MOCK_DATA
        ? {
          totalCompletions: 3716,
          completionsChange: 8,
          avgCompletionRate: 76,
          completionRateChange: 3,
          totalBookmarks: 1651,
          bookmarksChange: 15,
          topArticles: mockArticlePerformance.slice(0, 5),
          articles: mockArticlePerformance
        }
        : fetchWithAuth('/api/analytics/articles'),
  },

  // Health endpoints
  health: {
    getSymptoms: async (): Promise<SymptomsResponse> =>
      USE_MOCK_DATA
        ? {
          totalEntries: 1532,
          entriesChange: 12,
          trackingAdherence: 78,
          adherenceChange: 5,
          avgSymptomsPerEntry: 2.4,
          avgChange: 0,
          topSymptoms: mockSymptoms
        }
        : fetchWithAuth('/api/analytics/symptoms'),

    getMoods: async (): Promise<MoodsResponse> =>
      USE_MOCK_DATA
        ? {
          totalEntries: 2341,
          entriesChange: 8,
          moodDistribution: mockMoodData
        }
        : fetchWithAuth('/api/analytics/mood'),
  },

  // Reminders endpoints
  reminders: {
    getAnalytics: async (): Promise<RemindersResponse> =>
      USE_MOCK_DATA
        ? {
          totalReminders: 1234,
          remindersChange: 5,
          activeReminders: 789,
          activeChange: 0,
          voiceReminders: 456,
          voiceChange: 12,
          completionRate: 85,
          completionChange: 3,
          statusDistribution: [
            { name: "Active", value: 789, color: "#7C3AED" },
            { name: "Inactive", value: 445, color: "#C4B5FD" }
          ],
          byDayOfWeek: [
            { day: "Mon", count: 156 },
            { day: "Tue", count: 178 },
            { day: "Wed", count: 165 },
            { day: "Thu", count: 172 },
            { day: "Fri", count: 167 },
            { day: "Sat", count: 143 },
            { day: "Sun", count: 138 }
          ]
        }
        : fetchWithAuth('/api/analytics/reminders'),
  },

  // Export endpoints
  export: {
    users: (format: 'csv' | 'excel') =>
      fetchWithAuth(`/api/export/users?format=${format}`),

    articles: (format: 'csv' | 'excel') =>
      fetchWithAuth(`/api/export/articles?format=${format}`),
  },

  // Notifications endpoints
  notifications: {
    getAll: () =>
      fetchWithAuth('/api/notifications'),

    markAsRead: (id: string) =>
      fetchWithAuth(`/api/notifications/${id}/read`, {
        method: 'PUT',
      }),
  },

  // Settings endpoints
  settings: {
    get: () =>
      fetchWithAuth('/api/settings'),

    update: (settings: any) =>
      fetchWithAuth('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
  },
};

export default apiClient;
