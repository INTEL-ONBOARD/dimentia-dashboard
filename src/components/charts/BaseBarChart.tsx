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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
        <div className="animate-pulse">
          <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
          <XAxis
            type={horizontal ? "number" : "category"}
            dataKey={horizontal ? undefined : xAxisKey}
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
          />
          <YAxis
            type={horizontal ? "category" : "number"}
            dataKey={horizontal ? xAxisKey : undefined}
            stroke={isDark ? '#94a3b8' : '#64748b'}
            fontSize={12}
            tick={{ fill: isDark ? '#94a3b8' : '#64748b' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#fff',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              borderRadius: '12px',
              color: isDark ? '#f8fafc' : '#0f172a',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
