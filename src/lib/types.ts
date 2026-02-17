// Type definitions for API responses and data structures

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
}

export interface DashboardMetrics {
  totalUsers: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  totalSessions: number;
  articlesRead: number;
  symptomsLogged: number;
  activeReminders: number;
  totalPoints: number;
  userGrowth: number;
  dauChange: number;
  mauChange: number;
  sessionChange: number;
}

export interface DailyActiveUsersData {
  date: string;
  users: number;
}

export interface FeatureUsage {
  name: string;
  value: number;
  color: string;
}

export interface UserData {
  id: number;
  fullName: string;
  age: number;
  gender: string;
  role: 'Patient' | 'Caregiver';
  registeredDate: string;
  lastActive: string;
  totalSessions: number;
  totalPoints: number;
  status: 'Active' | 'Inactive';
}

export interface Demographics {
  byRole: { name: string; value: number; color: string }[];
  byGender: { name: string; value: number; color: string }[];
  byAge: { ageGroup: string; count: number }[];
}

export interface SymptomData {
  symptom: string;
  count: number;
}

export interface MoodData {
  name: string;
  value: number;
  color: string;
}

export interface ArticlePerformance {
  id: number;
  title: string;
  category: string;
  views: number;
  completions: number;
  completionRate: number;
  bookmarks: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API Response Types
export interface SessionsResponse {
  totalViews: number;
  viewsChange: number;
  avgSessionDuration: number;
  durationChange: number;
}

export interface ArticlesResponse {
  totalCompletions: number;
  completionsChange: number;
  avgCompletionRate: number;
  completionRateChange: number;
  totalBookmarks: number;
  bookmarksChange: number;
  topArticles: ArticlePerformance[];
  articles: ArticlePerformance[];
}

export interface SymptomsResponse {
  totalEntries: number;
  entriesChange: number;
  trackingAdherence: number;
  adherenceChange: number;
  avgSymptomsPerEntry: number;
  avgChange: number;
  topSymptoms: SymptomData[];
}

export interface MoodsResponse {
  totalEntries: number;
  entriesChange: number;
  moodDistribution: MoodData[];
}

export interface RemindersResponse {
  totalReminders: number;
  remindersChange: number;
  activeReminders: number;
  activeChange: number;
  voiceReminders: number;
  voiceChange: number;
  completionRate: number;
  completionChange: number;
  statusDistribution: { name: string; value: number; color: string }[];
  byDayOfWeek: { day: string; count: number }[];
}

export interface UsersResponse {
  users: UserData[];
  total: number;
  page: number;
  pageSize?: number;
  limit?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}
