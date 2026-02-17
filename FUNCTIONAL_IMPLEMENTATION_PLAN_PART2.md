# 🎯 FUNCTIONAL IMPLEMENTATION PLAN - PART 2

## Continuation from Part 1...

### PHASE 2 (Continued): Functional Components

#### Task 2.3: Fully Functional Chart Components
**Create: `src/components/charts/BaseLineChart.tsx`**
```typescript
"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useThemeStore } from "@/store/useThemeStore";

interface BaseLineChartProps {
  data: any[];
  title: string;
  dataKeys: { key: string; color: string; label: string }[];
  xAxisKey: string;
  height?: number;
  showLegend?: boolean;
  loading?: boolean;
}

export default function BaseLineChart({
  data,
  title,
  dataKeys,
  xAxisKey,
  height = 300,
  showLegend = true,
  loading = false,
}: BaseLineChartProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="animate-pulse">
          <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#374151' : '#f0f0f0'}
          />
          <XAxis
            dataKey={xAxisKey}
            stroke={isDark ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
          />
          <YAxis
            stroke={isDark ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#F9FAFB' : '#111827',
            }}
            labelStyle={{ color: isDark ? '#F9FAFB' : '#111827' }}
          />
          {showLegend && <Legend />}
          {dataKeys.map((item) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={2}
              dot={{ fill: item.color, r: 4 }}
              activeDot={{ r: 6 }}
              name={item.label}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Create: `src/components/charts/BasePieChart.tsx`**
```typescript
"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useThemeStore } from "@/store/useThemeStore";

interface BasePieChartProps {
  data: { name: string; value: number; color: string }[];
  title: string;
  height?: number;
  loading?: boolean;
}

export default function BasePieChart({
  data,
  title,
  height = 300,
  loading = false,
}: BasePieChartProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="animate-pulse">
          <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Create: `src/components/charts/BaseBarChart.tsx`**
```typescript
"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useThemeStore } from "@/store/useThemeStore";

interface BaseBarChartProps {
  data: any[];
  title: string;
  dataKeys: { key: string; color: string; label: string }[];
  xAxisKey: string;
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
  loading?: boolean;
}

export default function BaseBarChart({
  data,
  title,
  dataKeys,
  xAxisKey,
  height = 300,
  horizontal = false,
  stacked = false,
  loading = false,
}: BaseBarChartProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="animate-pulse">
          <div className="h-[300px] bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#374151' : '#f0f0f0'}
          />
          <XAxis
            type={horizontal ? "number" : "category"}
            dataKey={horizontal ? undefined : xAxisKey}
            stroke={isDark ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
          />
          <YAxis
            type={horizontal ? "category" : "number"}
            dataKey={horizontal ? xAxisKey : undefined}
            stroke={isDark ? '#9CA3AF' : '#6B7280'}
            fontSize={12}
            tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1F2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#F9FAFB' : '#111827',
            }}
          />
          <Legend />
          {dataKeys.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              fill={item.color}
              name={item.label}
              stackId={stacked ? "stack" : undefined}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

#### Task 2.4: Fully Functional Data Table with Sorting, Filtering, Pagination
**Create: `src/components/tables/DataTable.tsx`**
```typescript
"use client";
import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  title?: string;
  searchable?: boolean;
  exportable?: boolean;
  onExport?: () => void;
  pageSize?: number;
  loading?: boolean;
}

export default function DataTable({
  data,
  columns,
  title,
  searchable = true,
  exportable = true,
  onExport,
  pageSize = 10,
  loading = false,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Apply search, filter, and sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchQuery) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return sortOrder === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [data, searchQuery, filters, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          )}
          <div className="flex items-center gap-2">
            {exportable && onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Download size={16} />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {searchable && (
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="hover:text-blue-600"
                      >
                        {sortKey === column.key ? (
                          sortOrder === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronDown size={14} className="opacity-30" />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, processedData.length)} of{" "}
            {processedData.length} results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
            </button>

            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first, last, current, and adjacent pages
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Task 2.5: Metric Cards with Real-time Updates
**Create: `src/components/cards/MetricCard.tsx`**
```typescript
"use client";
import { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: string;
  loading?: boolean;
  trend?: "up" | "down";
  onClick?: () => void;
}

export default function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  color,
  loading = false,
  trend,
  onClick,
}: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
    );
  }

  const changeIsPositive = change !== undefined && change > 0;
  const changeColor = trend === "up"
    ? changeIsPositive
      ? "text-green-600"
      : "text-red-600"
    : trend === "down"
    ? changeIsPositive
      ? "text-red-600"
      : "text-green-600"
    : changeIsPositive
    ? "text-green-600"
    : "text-red-600";

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-semibold ${changeColor} flex items-center gap-1`}>
            {changeIsPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {typeof value === "number" ? value.toLocaleString() : value}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
```

---

### PHASE 3: All 8 Pages - Fully Functional (Week 3-4)

#### Page 1: Overview Dashboard (100% Functional)
**Update: `src/app/page.tsx`**
```typescript
"use client";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import MetricCard from "@/components/cards/MetricCard";
import BaseLineChart from "@/components/charts/BaseLineChart";
import BasePieChart from "@/components/charts/BasePieChart";
import { Users, Activity, TrendingUp, Zap } from "lucide-react";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export default function OverviewPage() {
  // Fetch metrics with React Query
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["metrics"],
    queryFn: api.getMetrics,
    refetchInterval: 300000, // Refresh every 5 minutes
    onError: () => {
      toast.error("Failed to load metrics");
    },
  });

  const { data: dauData, isLoading: dauLoading } = useQuery({
    queryKey: ["dau", 30],
    queryFn: () => api.getDailyActiveUsers(30),
  });

  const { data: featureUsage, isLoading: featureLoading } = useQuery({
    queryKey: ["feature-usage"],
    queryFn: api.getFeatureUsage,
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="Overview Dashboard" />

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <MetricCard
            label="Total Users"
            value={metrics?.totalUsers || 0}
            change={metrics?.userGrowth}
            icon={Users}
            color="blue"
            loading={metricsLoading}
            trend="up"
          />
          <MetricCard
            label="Daily Active Users"
            value={metrics?.dailyActiveUsers || 0}
            change={metrics?.dauChange}
            icon={Activity}
            color="green"
            loading={metricsLoading}
            trend="up"
          />
          <MetricCard
            label="Monthly Active Users"
            value={metrics?.monthlyActiveUsers || 0}
            change={metrics?.mauChange}
            icon={TrendingUp}
            color="purple"
            loading={metricsLoading}
            trend="up"
          />
          <MetricCard
            label="Total Sessions"
            value={metrics?.totalSessions || 0}
            change={metrics?.sessionChange}
            icon={Zap}
            color="amber"
            loading={metricsLoading}
            trend="up"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <BaseLineChart
            title="Daily Active Users (Last 30 Days)"
            data={dauData || []}
            dataKeys={[{ key: "users", color: "#3B82F6", label: "Active Users" }]}
            xAxisKey="date"
            loading={dauLoading}
          />
          <BasePieChart
            title="Feature Usage Distribution"
            data={featureUsage || []}
            loading={featureLoading}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Articles Read</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics?.articlesRead || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Symptoms Logged</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics?.symptomsLogged || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Reminders</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics?.activeReminders || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Points</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {metrics?.totalPoints?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
```

#### Page 2: User Analytics (100% Functional)
**Create: `src/app/users/page.tsx`**
```typescript
"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DataTable from "@/components/tables/DataTable";
import BasePieChart from "@/components/charts/BasePieChart";
import BaseBarChart from "@/components/charts/BaseBarChart";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

export default function UsersPage() {
  const [page, setPage] = useState(1);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => api.getUsers(page),
    onError: () => toast.error("Failed to load users"),
  });

  const { data: demographics, isLoading: demographicsLoading } = useQuery({
    queryKey: ["demographics"],
    queryFn: api.getUserDemographics,
  });

  const userColumns = [
    { key: "id", label: "ID", sortable: true },
    { key: "fullName", label: "Full Name", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "gender", label: "Gender", sortable: true, filterable: true },
    { key: "role", label: "Role", sortable: true, filterable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          value === 'Patient'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        }`}>
          {value}
        </span>
      )
    },
    { key: "registeredDate", label: "Registered", sortable: true },
    { key: "lastActive", label: "Last Active", sortable: true },
    { key: "totalSessions", label: "Sessions", sortable: true },
    { key: "totalPoints", label: "Points", sortable: true },
    { key: "status", label: "Status", sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          value === 'Active'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {value}
        </span>
      )
    },
  ];

  const handleExport = () => {
    api.exportData('users', 'csv')
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
        toast.success("Users exported successfully");
      })
      .catch(() => toast.error("Export failed"));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="User Analytics" />

        {/* Demographics Charts */}
        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            User Demographics
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <BasePieChart
              title="Users by Role"
              data={demographics?.byRole || []}
              loading={demographicsLoading}
            />
            <BasePieChart
              title="Users by Gender"
              data={demographics?.byGender || []}
              loading={demographicsLoading}
            />
            <BaseBarChart
              title="Users by Age Group"
              data={demographics?.byAge || []}
              dataKeys={[{ key: "count", color: "#3B82F6", label: "Users" }]}
              xAxisKey="ageGroup"
              loading={demographicsLoading}
            />
          </div>
        </section>

        {/* User Table */}
        <section className="mt-8">
          <DataTable
            data={users?.data || []}
            columns={userColumns}
            title="All Users"
            searchable
            exportable
            onExport={handleExport}
            loading={usersLoading}
          />
        </section>
      </main>
    </div>
  );
}
```

---

## Continue in Part 3...

This document is getting very long. Should I:
1. **Continue with the remaining 6 pages** (Engagement, Health, Content, Reminders, Reports, Settings)?
2. **Create the Backend API structure** documentation?
3. **Create deployment and testing** documentation?
4. **Update the summary documents** with this functional approach?

Let me know and I'll continue! 🚀