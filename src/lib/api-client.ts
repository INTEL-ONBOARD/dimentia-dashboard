import type {
  ApiResponse,
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

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiClientError(
        errorData.message || `HTTP Error ${response.status}`,
        response.status,
        errorData.code
      );
    }

    const data = await response.json();

    if (data && typeof data === 'object' && 'data' in data) {
      return (data as ApiResponse<T>).data;
    }

    return data;
  } catch (error) {
    if (error instanceof ApiClientError) throw error;
    if (error instanceof TypeError) {
      throw new ApiClientError('Network error - please check your connection', 0);
    }
    throw new ApiClientError('An unexpected error occurred', 500);
  }
}

export const apiClient = {
  auth: {
    login: (email: string, password: string) =>
      fetchWithAuth('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    logout: () =>
      fetchWithAuth('/api/auth/logout', { method: 'POST' }),

    me: () =>
      fetchWithAuth('/api/auth/me'),
  },

  metrics: {
    getOverview: (): Promise<DashboardMetrics> =>
      fetchWithAuth('/api/metrics'),

    getDailyActiveUsers: (days: number = 7): Promise<DailyActiveUsersData[]> =>
      fetchWithAuth(`/api/analytics/dau?days=${days}`),

    getMonthlyActiveUsers: (): Promise<{ users: number; change: number }> =>
      fetchWithAuth('/api/analytics/mau'),

    getFeatureUsage: (): Promise<FeatureUsage[]> =>
      fetchWithAuth('/api/analytics/feature-usage'),
  },

  users: {
    getAll: (params?: { page?: number; limit?: number; search?: string }): Promise<UsersResponse> => {
      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries(params || {}).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
        )
      ).toString();
      return fetchWithAuth(`/api/users${qs ? `?${qs}` : ''}`);
    },

    getById: (id: string) =>
      fetchWithAuth(`/api/users/${id}`),

    getDemographics: (): Promise<Demographics> =>
      fetchWithAuth('/api/analytics/demographics'),
  },

  engagement: {
    getSessions: (): Promise<SessionsResponse> =>
      fetchWithAuth('/api/analytics/sessions'),

    getArticles: (): Promise<ArticlesResponse> =>
      fetchWithAuth('/api/analytics/articles'),
  },

  health: {
    getSymptoms: (): Promise<SymptomsResponse> =>
      fetchWithAuth('/api/analytics/symptoms'),

    getMoods: (): Promise<MoodsResponse> =>
      fetchWithAuth('/api/analytics/mood'),
  },

  reminders: {
    getAnalytics: (): Promise<RemindersResponse> =>
      fetchWithAuth('/api/analytics/reminders'),

    getInsights: () =>
      fetchWithAuth('/api/analytics/reminders/insights'),
  },

  activity: {
    getRecent: (limit = 10) =>
      fetchWithAuth(`/api/activity?limit=${limit}`),
  },

  export: {
    users: (format: 'csv' | 'excel') =>
      fetchWithAuth(`/api/export/users?format=${format}`),

    articles: (format: 'csv' | 'excel') =>
      fetchWithAuth(`/api/export/articles?format=${format}`),
  },

  notifications: {
    getAll: () =>
      fetchWithAuth('/api/notifications'),

    markAsRead: (id: string) =>
      fetchWithAuth(`/api/notifications/${id}/read`, { method: 'PUT' }),

    markAllAsRead: () =>
      fetchWithAuth('/api/notifications', { method: 'PUT' }),

    deleteAll: () =>
      fetchWithAuth('/api/notifications', { method: 'DELETE' }),
  },

  settings: {
    get: () =>
      fetchWithAuth('/api/settings'),

    update: (settings: any) =>
      fetchWithAuth('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
  },

  search: {
    query: (q: string) =>
      fetchWithAuth(`/api/search?q=${encodeURIComponent(q)}`),
  },
};

export default apiClient;
