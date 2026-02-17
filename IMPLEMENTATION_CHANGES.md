# Dashboard Transformation - Detailed Changes

## Overview
This document outlines the **specific changes** required to transform the current NFT Dashboard into the DementiaMithura Analytics Dashboard.

---

## Current State Analysis

### Existing Components (to be replaced/modified)
- `Sidebar.tsx` - NFT-themed navigation (Dashboard, Marketplace, Analytics)
- `TopNav.tsx` - Search and user profile
- `HeroBanner.tsx` - NFT hero section
- `StatsCards.tsx` - NFT statistics
- `NFTCards.tsx` - NFT card grid
- `TopCreators.tsx` - NFT creators list
- `ActivityTable.tsx` - NFT activity feed

### Components to Keep (Structure Only)
- Sidebar navigation structure ✓
- TopNav user profile area ✓
- Card-based layout system ✓
- Grid system ✓

---

## PHASE 1: SIDEBAR NAVIGATION CHANGES

### File: `src/components/Sidebar.tsx`

**Current Navigation:**
```typescript
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Store, label: "Marketplace" },
  { icon: Activity, label: "Analytics" },
];

const profileItems = [
  { icon: Briefcase, label: "My Projects" },
  { icon: Wallet, label: "Billing" },
  { icon: Heart, label: "Favourites" },
  { icon: Clock, label: "History" },
  { icon: Settings, label: "Settings" },
];
```

**NEW Navigation:**
```typescript
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
  HelpCircle,
} from "lucide-react";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/", active: true },
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
```

**Logo Changes:**
```typescript
// FROM:
<h1 className="text-lg font-bold text-gray-900 leading-none">Apex.</h1>
<p className="text-[11px] text-gray-400 mt-0.5">Open Framework</p>

// TO:
<h1 className="text-lg font-bold text-gray-900 leading-none">DementiaMithura</h1>
<p className="text-[11px] text-gray-400 mt-0.5">Analytics Dashboard</p>
```

**Remove "Current Plan" Card:**
```typescript
// DELETE this section entirely (lines 116-133)
<div className="mt-6 rounded-2xl p-5 text-white relative overflow-hidden"
     style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)" }}>
  {/* ... Pro plan card ... */}
</div>
```

**Add Help Section:**
```typescript
// ADD at the bottom before </aside>
<div className="mt-4 pt-4 border-t border-gray-100">
  <a href="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-gray-50">
    <HelpCircle size={18} strokeWidth={1.8} />
    Help & Documentation
  </a>
</div>
```

---

## PHASE 2: PAGE STRUCTURE CHANGES

### Create New Directory Structure

```bash
src/
├── app/
│   ├── page.tsx                    # Overview Dashboard (MODIFY EXISTING)
│   ├── users/
│   │   └── page.tsx                # NEW: User Analytics
│   ├── engagement/
│   │   └── page.tsx                # NEW: Engagement Analytics
│   ├── health-insights/
│   │   └── page.tsx                # NEW: Health Insights
│   ├── content/
│   │   └── page.tsx                # NEW: Content Analytics
│   ├── reminders/
│   │   └── page.tsx                # NEW: Reminder Analytics
│   ├── reports/
│   │   └── page.tsx                # NEW: Reports & Export
│   └── settings/
│       └── page.tsx                # NEW: Settings
├── components/
│   ├── Sidebar.tsx                 # MODIFY: Update navigation
│   ├── TopNav.tsx                  # MODIFY: Update for analytics context
│   ├── charts/                     # NEW FOLDER
│   │   ├── LineChart.tsx          # NEW: Reusable line chart
│   │   ├── BarChart.tsx           # NEW: Reusable bar chart
│   │   ├── PieChart.tsx           # NEW: Reusable pie chart
│   │   ├── AreaChart.tsx          # NEW: Reusable area chart
│   │   └── DonutChart.tsx         # NEW: Reusable donut chart
│   ├── tables/                     # NEW FOLDER
│   │   ├── UserTable.tsx          # NEW: User data table
│   │   ├── ArticleTable.tsx       # NEW: Article performance table
│   │   └── ExportButton.tsx       # NEW: CSV/Excel export
│   ├── overview/                   # NEW FOLDER (for Overview page components)
│   │   ├── MetricsCards.tsx       # NEW: Key metrics cards
│   │   ├── ActivityFeed.tsx       # NEW: Recent activity
│   │   └── QuickStats.tsx         # NEW: Quick stats panel
│   ├── users/                      # NEW FOLDER (for User Analytics components)
│   │   ├── DemographicsCharts.tsx # NEW: Age, gender, role charts
│   │   ├── UserActivityStats.tsx  # NEW: Activity metrics
│   │   └── RetentionChart.tsx     # NEW: Cohort analysis
│   ├── engagement/                 # NEW FOLDER
│   │   ├── FeatureUsageChart.tsx  # NEW: Feature comparison
│   │   └── SessionAnalytics.tsx   # NEW: Session metrics
│   ├── health/                     # NEW FOLDER
│   │   ├── SymptomChart.tsx       # NEW: Symptom analytics
│   │   └── MoodChart.tsx          # NEW: Mood analytics
│   └── DateRangePicker.tsx        # NEW: Shared date picker
└── lib/
    ├── api.ts                      # NEW: API client for analytics data
    ├── mockData.ts                 # NEW: Mock data for development
    └── types.ts                    # NEW: TypeScript interfaces
```

---

## PHASE 3: COMPONENT-BY-COMPONENT CHANGES

### 1. `src/app/page.tsx` (Overview Dashboard)

**DELETE:**
- `<HeroBanner />` component
- `<NFTCards />` component
- `<TopCreators />` component
- Old `<StatsCards />` component

**ADD:**
```typescript
import MetricsCards from "@/components/overview/MetricsCards";
import ActivityFeed from "@/components/overview/ActivityFeed";
import QuickStats from "@/components/overview/QuickStats";
import FeatureUsageChart from "@/components/charts/PieChart";
import DailyActiveUsersChart from "@/components/charts/LineChart";
import UserGrowthChart from "@/components/charts/AreaChart";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8 bg-white">
        <TopNav title="Overview Dashboard" />

        {/* Key Metrics - 4 cards */}
        <MetricsCards />

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <DailyActiveUsersChart />
          <FeatureUsageChart />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <UserGrowthChart />
          <ActivityFeed />
        </div>

        {/* Quick Stats Panel */}
        <QuickStats />
      </main>
    </div>
  );
}
```

---

### 2. NEW: `src/components/overview/MetricsCards.tsx`

```typescript
"use client";
import { Users, Activity, TrendingUp, Zap } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export default function MetricsCards() {
  const metrics: Metric[] = [
    {
      label: "Total Users",
      value: "5,678",
      change: "+12.3%",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Daily Active Users",
      value: "1,234",
      change: "+5.2%",
      icon: Activity,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Monthly Active Users",
      value: "4,567",
      change: "+8.1%",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Sessions",
      value: "8,901",
      change: "+15.7%",
      icon: Zap,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 mt-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
              <metric.icon size={20} strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-green-600">{metric.change}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
          <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 3. NEW: `src/components/TopNav.tsx` Update

**MODIFY existing file:**

```typescript
"use client";
import { Search, Bell, User } from "lucide-react";

interface TopNavProps {
  title?: string;
}

export default function TopNav({ title = "Overview Dashboard" }: TopNavProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 4. NEW: `src/app/users/page.tsx` (User Analytics Page)

```typescript
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DemographicsCharts from "@/components/users/DemographicsCharts";
import UserActivityStats from "@/components/users/UserActivityStats";
import UserTable from "@/components/tables/UserTable";

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8 bg-white">
        <TopNav title="User Analytics" />

        {/* Demographics Section */}
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Demographics</h2>
          <DemographicsCharts />
        </section>

        {/* Activity Stats Section */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Activity</h2>
          <UserActivityStats />
        </section>

        {/* User Details Table */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">All Users</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Export CSV
            </button>
          </div>
          <UserTable />
        </section>
      </main>
    </div>
  );
}
```

---

## PHASE 4: CHART COMPONENTS

### Install Chart Library

```bash
npm install recharts
npm install @types/recharts --save-dev
```

### Example: `src/components/charts/LineChart.tsx`

```typescript
"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  data: any[];
  title: string;
  dataKey: string;
  xAxisKey: string;
  color?: string;
}

export default function CustomLineChart({
  data,
  title,
  dataKey,
  xAxisKey,
  color = "#3B82F6",
}: LineChartProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey={xAxisKey} stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ fill: color }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## PHASE 5: DATA LAYER

### Create Mock Data: `src/lib/mockData.ts`

```typescript
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
};

export const mockDailyActiveUsers = [
  { date: "Jan 18", users: 980 },
  { date: "Jan 19", users: 1050 },
  { date: "Jan 20", users: 1120 },
  { date: "Jan 21", users: 1090 },
  { date: "Jan 22", users: 1180 },
  { date: "Jan 23", users: 1240 },
  { date: "Jan 24", users: 1234 },
];

export const mockFeatureUsage = [
  { name: "Articles", value: 35, color: "#3B82F6" },
  { name: "Symptoms", value: 25, color: "#10B981" },
  { name: "Mood", value: 20, color: "#8B5CF6" },
  { name: "Breathing", value: 10, color: "#F59E0B" },
  { name: "Reminders", value: 10, color: "#EF4444" },
];

export const mockUsers = [
  {
    id: 1,
    fullName: "John Doe",
    age: 68,
    gender: "Male",
    role: "Patient",
    registeredDate: "2026-01-15",
    lastActive: "2026-02-17",
    totalSessions: 45,
    totalPoints: 230,
    status: "Active",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    age: 42,
    gender: "Female",
    role: "Caregiver",
    registeredDate: "2026-01-18",
    lastActive: "2026-02-16",
    totalSessions: 67,
    totalPoints: 450,
    status: "Active",
  },
  // ... more users
];

export const mockSymptoms = [
  { symptom: "Memory Loss", count: 245, severity: { mild: 120, moderate: 90, severe: 35 } },
  { symptom: "Confusion", count: 189, severity: { mild: 95, moderate: 70, severe: 24 } },
  { symptom: "Mood Changes", count: 167, severity: { mild: 100, moderate: 50, severe: 17 } },
  // ... more symptoms
];

export const mockArticlePerformance = [
  {
    id: 1,
    title: "Understanding Dementia Symptoms",
    category: "Health Tips",
    views: 1234,
    completions: 987,
    completionRate: 80,
    bookmarks: 456,
  },
  // ... more articles
];
```

---

## PHASE 6: TYPE DEFINITIONS

### Create Types: `src/lib/types.ts`

```typescript
export interface User {
  id: number;
  fullName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  role: "Patient" | "Caregiver";
  mobileNumber: string;
  registeredDate: string;
  lastActive: string;
  totalSessions: number;
  totalPoints: number;
  status: "Active" | "Inactive";
}

export interface Metric {
  label: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
}

export interface ChartData {
  [key: string]: string | number;
}

export interface Article {
  id: number;
  title: string;
  category: "Health Tips" | "Daily Activities" | "Caregiver Resources";
  views: number;
  completions: number;
  completionRate: number;
  bookmarks: number;
}

export interface Symptom {
  symptom: string;
  count: number;
  severity: {
    mild: number;
    moderate: number;
    severe: number;
  };
}

export interface MoodEntry {
  mood: "Happy" | "Calm" | "Okay" | "Sad" | "Anxious" | "Tired" | "Irritable" | "Upset";
  count: number;
  percentage: number;
}
```

---

## PHASE 7: COLOR THEME UPDATES

### Update `src/app/globals.css`

**ADD healthcare-friendly color palette:**

```css
:root {
  /* Primary Colors - Healthcare Blue */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  /* Secondary Colors - Health Green */
  --color-secondary-50: #f0fdf4;
  --color-secondary-100: #dcfce7;
  --color-secondary-500: #10b981;
  --color-secondary-600: #059669;

  /* Accent - Insights Purple */
  --color-accent-50: #f5f3ff;
  --color-accent-100: #ede9fe;
  --color-accent-500: #8b5cf6;
  --color-accent-600: #7c3aed;

  /* Status Colors */
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-success: #10b981;
  --color-info: #3b82f6;
}
```

---

## PHASE 8: BACKEND API INTEGRATION POINTS

### Create API Client: `src/lib/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function fetchMetrics() {
  const response = await fetch(`${API_BASE_URL}/metrics`);
  if (!response.ok) throw new Error("Failed to fetch metrics");
  return response.json();
}

export async function fetchUsers(page = 1, limit = 50) {
  const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
}

export async function fetchDailyActiveUsers(days = 30) {
  const response = await fetch(`${API_BASE_URL}/analytics/dau?days=${days}`);
  if (!response.ok) throw new Error("Failed to fetch DAU");
  return response.json();
}

export async function fetchFeatureUsage() {
  const response = await fetch(`${API_BASE_URL}/analytics/feature-usage`);
  if (!response.ok) throw new Error("Failed to fetch feature usage");
  return response.json();
}

export async function fetchSymptomAnalytics() {
  const response = await fetch(`${API_BASE_URL}/analytics/symptoms`);
  if (!response.ok) throw new Error("Failed to fetch symptoms");
  return response.json();
}

export async function fetchMoodAnalytics() {
  const response = await fetch(`${API_BASE_URL}/analytics/mood`);
  if (!response.ok) throw new Error("Failed to fetch mood data");
  return response.json();
}

export async function fetchArticlePerformance() {
  const response = await fetch(`${API_BASE_URL}/analytics/articles`);
  if (!response.ok) throw new Error("Failed to fetch article performance");
  return response.json();
}

export async function exportUserData(format: "csv" | "excel" = "csv") {
  const response = await fetch(`${API_BASE_URL}/export/users?format=${format}`);
  if (!response.ok) throw new Error("Failed to export data");
  return response.blob();
}
```

---

## PHASE 9: IMPLEMENTATION CHECKLIST

### Week 1-2: Foundation
- [ ] Install dependencies (recharts)
- [ ] Update color theme in globals.css
- [ ] Create type definitions (types.ts)
- [ ] Create mock data (mockData.ts)
- [ ] Update Sidebar.tsx with new navigation
- [ ] Update TopNav.tsx component
- [ ] Create API client structure (api.ts)

### Week 3: Core Pages
- [ ] Transform page.tsx into Overview Dashboard
- [ ] Create MetricsCards component
- [ ] Create ActivityFeed component
- [ ] Create QuickStats component
- [ ] Create reusable chart components (Line, Bar, Pie, Area, Donut)

### Week 4: Analytics Pages
- [ ] Create User Analytics page (/users/page.tsx)
- [ ] Create DemographicsCharts component
- [ ] Create UserActivityStats component
- [ ] Create UserTable component
- [ ] Create Engagement Analytics page (/engagement/page.tsx)
- [ ] Create FeatureUsageChart component

### Week 5: Health & Content Pages
- [ ] Create Health Insights page (/health-insights/page.tsx)
- [ ] Create SymptomChart component
- [ ] Create MoodChart component
- [ ] Create Content Analytics page (/content/page.tsx)
- [ ] Create ArticleTable component

### Week 6: Reports & Settings
- [ ] Create Reminder Analytics page (/reminders/page.tsx)
- [ ] Create Reports & Export page (/reports/page.tsx)
- [ ] Create ExportButton component
- [ ] Create Settings page (/settings/page.tsx)
- [ ] Implement CSV/Excel export functionality

### Week 7: Integration & Testing
- [ ] Connect all components to mock data
- [ ] Test all pages and navigation
- [ ] Ensure responsive design
- [ ] Test chart interactions
- [ ] Test export functionality

### Week 8: Backend Integration (When Ready)
- [ ] Replace mock data with API calls
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test with real data
- [ ] Performance optimization

---

## PHASE 10: FILE DELETION LIST

### Components to DELETE:
- `src/components/HeroBanner.tsx` - NFT hero banner (not needed)
- `src/components/NFTCards.tsx` - NFT card grid (not needed)
- `src/components/TopCreators.tsx` - NFT creators (not needed)
- `src/components/ActivityTable.tsx` - NFT activity (replace with ActivityFeed)
- `src/components/StatsCards.tsx` - NFT stats (replace with MetricsCards)

---

## PHASE 11: RESPONSIVE DESIGN CONSIDERATIONS

### Breakpoints
- Desktop: 1280px+ (primary target)
- Tablet: 768px - 1279px
- Mobile: < 768px (hide sidebar, show hamburger menu)

### Sidebar on Mobile
```typescript
// Add to Sidebar.tsx
const [isOpen, setIsOpen] = useState(false);

// Add hamburger menu button for mobile
<button
  className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg"
  onClick={() => setIsOpen(!isOpen)}
>
  <Menu size={24} />
</button>

// Update aside classes
<aside className={`
  w-[240px] h-screen bg-white border-r border-gray-100
  flex flex-col justify-between py-7 px-5
  fixed left-0 top-0 overflow-y-auto z-40
  lg:translate-x-0
  ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  transition-transform duration-300
`}>
```

---

## PHASE 12: FINAL TOUCHES

### Add Loading States
```typescript
// Example loading component
export function LoadingCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}
```

### Add Error States
```typescript
// Example error component
export function ErrorCard({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  );
}
```

### Add Empty States
```typescript
// Example empty state
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
```

---

## Summary of Major Changes

### ✅ What's Being Replaced
1. **NFT Theme** → Healthcare Analytics Theme
2. **Marketplace/NFT Navigation** → User/Engagement/Health Navigation
3. **NFT Cards** → Analytics Cards and Charts
4. **Single Dashboard Page** → 8 Multi-Purpose Pages
5. **Violet Color Scheme** → Blue/Green Healthcare Palette
6. **Static Content** → Dynamic Data Visualizations

### ✅ What's Being Added
1. **8 New Pages** (Overview, Users, Engagement, Health, Content, Reminders, Reports, Settings)
2. **20+ New Components** (Charts, Tables, Cards, Feeds)
3. **Data Layer** (API client, Mock data, Types)
4. **Export Functionality** (CSV, Excel, PDF)
5. **Chart Library** (Recharts integration)
6. **Healthcare Design System** (Colors, icons, spacing)

### ✅ What's Being Kept
1. **Next.js Framework** (unchanged)
2. **Tailwind CSS** (with color updates)
3. **Component Structure** (card-based, grid layout)
4. **Sidebar + Main Layout** (structure retained, content replaced)
5. **Responsive Design Approach** (enhanced)

---

## Next Steps

1. **Review this document** and approve the proposed changes
2. **Start with Phase 1** (Sidebar navigation)
3. **Work through phases sequentially** (Foundation → Core Pages → Analytics Pages → Reports)
4. **Test with mock data** before backend integration
5. **Iterate based on feedback**

**Estimated Time:** 6-8 weeks for full implementation

---

**Questions?** This document outlines every file change, component addition, and deletion needed. Ready to start when you approve!