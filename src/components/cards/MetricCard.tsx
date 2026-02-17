"use client";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "amber" | "red" | "indigo" | "cyan" | "emerald" | "rose";
  loading?: boolean;
  onClick?: () => void;
}

export default function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  color,
  loading = false,
  onClick,
}: MetricCardProps) {
  const colorConfig = {
    blue: {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      glow: "shadow-blue-500/20",
      gradient: "from-blue-500 to-cyan-500",
    },
    green: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      glow: "shadow-emerald-500/20",
      gradient: "from-emerald-500 to-teal-500",
    },
    purple: {
      bg: "bg-purple-500/10 dark:bg-purple-500/20",
      text: "text-purple-600 dark:text-purple-400",
      glow: "shadow-purple-500/20",
      gradient: "from-purple-500 to-pink-500",
    },
    amber: {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      glow: "shadow-amber-500/20",
      gradient: "from-amber-500 to-orange-500",
    },
    red: {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      glow: "shadow-rose-500/20",
      gradient: "from-rose-500 to-pink-500",
    },
    indigo: {
      bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      text: "text-indigo-600 dark:text-indigo-400",
      glow: "shadow-indigo-500/20",
      gradient: "from-indigo-500 to-purple-500",
    },
    cyan: {
      bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
      text: "text-cyan-600 dark:text-cyan-400",
      glow: "shadow-cyan-500/20",
      gradient: "from-cyan-500 to-blue-500",
    },
    emerald: {
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      glow: "shadow-emerald-500/20",
      gradient: "from-emerald-500 to-green-500",
    },
    rose: {
      bg: "bg-rose-500/10 dark:bg-rose-500/20",
      text: "text-rose-600 dark:text-rose-400",
      glow: "shadow-rose-500/20",
      gradient: "from-rose-500 to-red-500",
    },
  };

  const colors = colorConfig[color] || colorConfig.indigo;

  if (loading) {
    return (
      <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 animate-pulse overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="w-20 h-7 bg-slate-200 dark:bg-slate-700 rounded-full" />
        </div>
        <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3 mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
    );
  }

  const changeIsPositive = change !== undefined && change > 0;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden ${onClick ? "cursor-pointer hover:-translate-y-1" : ""
        }`}
    >
      {/* Subtle gradient background effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg ${colors.glow}`}>
            <Icon size={24} strokeWidth={1.8} className={colors.text} />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${changeIsPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
              {changeIsPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
