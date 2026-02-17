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
  height = 320,
  showLegend = true,
  loading = false,
}: BaseLineChartProps) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
        <div className="h-[320px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-xs text-slate-500 dark:text-slate-400">Live</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            {dataKeys.map((item, idx) => (
              <linearGradient key={`gradient-${idx}`} id={`gradient-${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)'}
            vertical={false}
          />
          <XAxis
            dataKey={xAxisKey}
            stroke={isDark ? '#64748B' : '#94A3B8'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? '#64748B' : '#64748B' }}
            dy={10}
          />
          <YAxis
            stroke={isDark ? '#64748B' : '#94A3B8'}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? '#64748B' : '#64748B' }}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
              padding: '12px 16px',
            }}
            labelStyle={{ color: isDark ? '#E2E8F0' : '#1E293B', fontWeight: 600, marginBottom: '8px' }}
            itemStyle={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '13px' }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {dataKeys.map((item, idx) => (
            <Line
              key={item.key}
              type="monotone"
              dataKey={item.key}
              stroke={item.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: isDark ? '#0F172A' : '#FFFFFF' }}
              name={item.label}
              fill={`url(#gradient-${item.key})`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
