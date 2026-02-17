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
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f0f0f0'} />
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
