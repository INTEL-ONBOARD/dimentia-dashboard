"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import MetricCard from "@/components/cards/MetricCard";
import BaseLineChart from "@/components/charts/BaseLineChart";
import BasePieChart from "@/components/charts/BasePieChart";
import { Users, Activity, TrendingUp, Zap, BookOpen, Heart, Bell, Award } from "lucide-react";
import { useMetrics, useDailyActiveUsers, useFeatureUsage, useActivity } from "@/hooks/useApi";
import type { DashboardMetrics, DailyActiveUsersData, FeatureUsage } from "@/lib/types";

export default function Home() {
  const { data: metrics, isLoading: metricsLoading } = useMetrics() as { data: DashboardMetrics | undefined; isLoading: boolean };
  const { data: dauData, isLoading: dauLoading } = useDailyActiveUsers(7) as { data: DailyActiveUsersData[] | undefined; isLoading: boolean };
  const { data: featureUsage, isLoading: featureLoading } = useFeatureUsage() as { data: FeatureUsage[] | undefined; isLoading: boolean };
  const { data: activityData, isLoading: activityLoading } = useActivity(5) as { data: { id: string; action: string; user: string; time: string; type: string }[] | undefined; isLoading: boolean };
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="Overview Dashboard" />

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <MetricCard
            label="Total Users"
            value={metrics?.totalUsers ?? 0}
            change={metrics?.userGrowth ?? 0}
            icon={Users}
            color="indigo"
            loading={metricsLoading}
          />
          <MetricCard
            label="Daily Active Users"
            value={metrics?.dailyActiveUsers ?? 0}
            change={metrics?.dauChange ?? 0}
            icon={Activity}
            color="emerald"
            loading={metricsLoading}
          />
          <MetricCard
            label="Monthly Active Users"
            value={metrics?.monthlyActiveUsers ?? 0}
            change={metrics?.mauChange ?? 0}
            icon={TrendingUp}
            color="purple"
            loading={metricsLoading}
          />
          <MetricCard
            label="Total Sessions"
            value={metrics?.totalSessions ?? 0}
            change={metrics?.sessionChange ?? 0}
            icon={Zap}
            color="amber"
            loading={metricsLoading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <BaseLineChart
            title="Daily Active Users (Last 7 Days)"
            data={dauData ?? []}
            dataKeys={[{ key: "users", color: "#8B5CF6", label: "Active Users" }]}
            xAxisKey="date"
            loading={dauLoading}
          />
          <BasePieChart
            title="Feature Usage Distribution"
            data={featureUsage ?? []}
            loading={featureLoading}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-[0.03] transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <BookOpen size={22} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Articles Read</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {metricsLoading ? (
                  <span className="inline-block w-20 h-9 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  metrics?.articlesRead ?? 0
                )}
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1 font-medium">
                Total this month
              </p>
            </div>
          </div>

          <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-[0.03] transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Heart size={22} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Symptoms Logged</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {metricsLoading ? (
                  <span className="inline-block w-20 h-9 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  metrics?.symptomsLogged ?? 0
                )}
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1 font-medium">
                Total this month
              </p>
            </div>
          </div>

          <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-[0.03] transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Bell size={22} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Reminders</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {metricsLoading ? (
                  <span className="inline-block w-20 h-9 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  metrics?.activeReminders ?? 0
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Stable
              </p>
            </div>
          </div>

          <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-[0.03] transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <Award size={22} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Points</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {metricsLoading ? (
                  <span className="inline-block w-20 h-9 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  metrics?.totalPoints?.toLocaleString() ?? '0'
                )}
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-3 flex items-center gap-1 font-medium">
                Total accumulated
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
            <a href="/users" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium px-4 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
              View All
            </a>
          </div>
          <div className="space-y-1">
            {activityLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4 px-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-48" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-24" />
                  </div>
                </div>
              ))
            ) : (activityData ?? []).length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No recent activity yet</p>
            ) : (
              (activityData ?? []).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-500/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
