// Mock data for development until backend is ready

export const mockMetrics = {
  totalUsers: 5678,
  dailyActiveUsers: 1234,
  monthlyActiveUsers: 4567,
  totalSessions: 8901,
  articlesRead: 234,
  symptomsLogged: 456,
  activeReminders: 789,
  totalPoints: 12345,
  userGrowth: 12.3,
  dauChange: 5.2,
  mauChange: 8.1,
  sessionChange: 15.7,
};

export const mockDailyActiveUsers = [
  { date: 'Feb 11', users: 980 },
  { date: 'Feb 12', users: 1050 },
  { date: 'Feb 13', users: 1120 },
  { date: 'Feb 14', users: 1090 },
  { date: 'Feb 15', users: 1180 },
  { date: 'Feb 16', users: 1240 },
  { date: 'Feb 17', users: 1234 },
];

export const mockFeatureUsage = [
  { name: 'Articles', value: 35, color: '#3B82F6' },
  { name: 'Symptoms', value: 25, color: '#10B981' },
  { name: 'Mood', value: 20, color: '#8B5CF6' },
  { name: 'Breathing', value: 10, color: '#F59E0B' },
  { name: 'Reminders', value: 10, color: '#EF4444' },
];

export const mockUsers = [
  {
    id: 1,
    fullName: 'John Doe',
    age: 68,
    gender: 'Male',
    role: 'Patient',
    registeredDate: '2026-01-15',
    lastActive: '2026-02-17',
    totalSessions: 45,
    totalPoints: 230,
    status: 'Active',
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    age: 42,
    gender: 'Female',
    role: 'Caregiver',
    registeredDate: '2026-01-18',
    lastActive: '2026-02-16',
    totalSessions: 67,
    totalPoints: 450,
    status: 'Active',
  },
  {
    id: 3,
    fullName: 'Robert Johnson',
    age: 71,
    gender: 'Male',
    role: 'Patient',
    registeredDate: '2026-01-20',
    lastActive: '2026-02-15',
    totalSessions: 32,
    totalPoints: 180,
    status: 'Active',
  },
  {
    id: 4,
    fullName: 'Emily Williams',
    age: 38,
    gender: 'Female',
    role: 'Caregiver',
    registeredDate: '2026-01-22',
    lastActive: '2026-02-10',
    totalSessions: 28,
    totalPoints: 210,
    status: 'Inactive',
  },
  {
    id: 5,
    fullName: 'Michael Brown',
    age: 65,
    gender: 'Male',
    role: 'Patient',
    registeredDate: '2026-01-25',
    lastActive: '2026-02-17',
    totalSessions: 51,
    totalPoints: 320,
    status: 'Active',
  },
];

export const mockDemographics = {
  byRole: [
    { name: 'Patients', value: 3200, color: '#3B82F6' },
    { name: 'Caregivers', value: 2478, color: '#10B981' },
  ],
  byGender: [
    { name: 'Male', value: 2850, color: '#3B82F6' },
    { name: 'Female', value: 2610, color: '#EC4899' },
    { name: 'Other', value: 218, color: '#8B5CF6' },
  ],
  byAge: [
    { ageGroup: '18-30', count: 234 },
    { ageGroup: '31-45', count: 1456 },
    { ageGroup: '46-60', count: 2123 },
    { ageGroup: '61-75', count: 1534 },
    { ageGroup: '76+', count: 331 },
  ],
};

export const mockSymptoms = [
  { symptom: 'Memory Loss', count: 245 },
  { symptom: 'Confusion', count: 189 },
  { symptom: 'Mood Changes', count: 167 },
  { symptom: 'Difficulty Concentrating', count: 134 },
  { symptom: 'Sleep Problems', count: 121 },
  { symptom: 'Anxiety/Worry', count: 108 },
  { symptom: 'Agitation/Restlessness', count: 95 },
  { symptom: 'Depression', count: 87 },
  { symptom: 'Difficulty Communicating', count: 76 },
  { symptom: 'Apathy', count: 65 },
];

export const mockMoodData = [
  { name: 'Happy', value: 28, color: '#10B981' },
  { name: 'Calm', value: 24, color: '#3B82F6' },
  { name: 'Okay', value: 20, color: '#8B5CF6' },
  { name: 'Tired', value: 12, color: '#F59E0B' },
  { name: 'Anxious', value: 8, color: '#F97316' },
  { name: 'Sad', value: 5, color: '#EF4444' },
  { name: 'Irritable', value: 2, color: '#DC2626' },
  { name: 'Upset', value: 1, color: '#991B1B' },
];

export const mockArticlePerformance = [
  {
    id: 1,
    title: 'Understanding Dementia Symptoms',
    category: 'Health Tips',
    views: 1234,
    completions: 987,
    completionRate: 80,
    bookmarks: 456,
  },
  {
    id: 2,
    title: 'Daily Activities for Brain Health',
    category: 'Daily Activities',
    views: 1089,
    completions: 871,
    completionRate: 80,
    bookmarks: 392,
  },
  {
    id: 3,
    title: 'Caregiver Self-Care Tips',
    category: 'Caregiver Resources',
    views: 956,
    completions: 717,
    completionRate: 75,
    bookmarks: 324,
  },
  {
    id: 4,
    title: 'Managing Memory Loss',
    category: 'Health Tips',
    views: 845,
    completions: 634,
    completionRate: 75,
    bookmarks: 278,
  },
  {
    id: 5,
    title: 'Communication Strategies',
    category: 'Caregiver Resources',
    views: 723,
    completions: 507,
    completionRate: 70,
    bookmarks: 201,
  },
];
