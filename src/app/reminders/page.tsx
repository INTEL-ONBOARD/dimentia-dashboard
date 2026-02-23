"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import BasePieChart from "@/components/charts/BasePieChart";
import BaseBarChart from "@/components/charts/BaseBarChart";
import MetricCard from "@/components/cards/MetricCard";
import { useReminders, useReminderInsights } from "@/hooks/useApi";
import type { RemindersResponse } from "@/lib/types";
import { Bell, BellRing, Mic, CheckCircle, Clock, Calendar, AlertTriangle } from "lucide-react";

export default function RemindersPage() {
  const { data: remindersData, isLoading: remindersLoading } = useReminders() as { data: RemindersResponse | undefined; isLoading: boolean };
  const { data: insights } = useReminderInsights() as { data: { peakTime: string; avgPerUser: number; missedToday: number; missedPercent: number; typeDistribution: { type: string; count: number }[] } | undefined };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="Reminder Analytics" subtitle="Track medication and voice reminder statistics" />

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <MetricCard
            label="Total Medication Reminders"
            value={remindersData?.totalReminders ?? 0}
            change={remindersData?.remindersChange ?? 0}
            icon={Bell}
            color="indigo"
            loading={remindersLoading}
          />
          <MetricCard
            label="Active Reminders"
            value={remindersData?.activeReminders ?? 0}
            change={remindersData?.activeChange ?? 0}
            icon={BellRing}
            color="emerald"
            loading={remindersLoading}
          />
          <MetricCard
            label="Voice Reminders"
            value={remindersData?.voiceReminders ?? 0}
            change={remindersData?.voiceChange ?? 0}
            icon={Mic}
            color="purple"
            loading={remindersLoading}
          />
          <MetricCard
            label="Completion Rate"
            value={`${remindersData?.completionRate ?? 0}%`}
            change={remindersData?.completionChange ?? 0}
            icon={CheckCircle}
            color="amber"
            loading={remindersLoading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <BasePieChart
            title="Active vs Inactive Reminders"
            data={remindersData?.statusDistribution ?? []}
            loading={remindersLoading}
          />
          <BaseBarChart
            title="Reminders by Day of Week"
            data={remindersData?.byDayOfWeek ?? []}
            dataKeys={[{ key: "count", color: "#8B5CF6", label: "Reminders" }]}
            xAxisKey="day"
            loading={remindersLoading}
          />
        </div>

        {/* Reminder Insights */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                <Clock size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Peak Time</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Most active reminder time</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{insights?.peakTime ?? '—'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Most active reminder time</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                <Calendar size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Avg. Per User</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reminders per patient</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{insights?.avgPerUser ?? '—'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Average reminders per patient</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Missed Today</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reminders not acknowledged</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{insights?.missedToday ?? '—'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{insights ? `${insights.missedPercent}% of today's reminders` : 'Loading...'}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Reminder Types Distribution</h3>
          <div className="grid grid-cols-4 gap-4">
            {(insights?.typeDistribution ?? []).map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-3 h-3 rounded-full mb-2 bg-purple-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.type}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.count}</p>
              </div>
            ))}
            {!insights && (
              [...Array(4)].map((_, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse">
                  <div className="w-3 h-3 rounded-full mb-2 bg-slate-300 dark:bg-slate-600" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 mb-2" />
                  <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-10" />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
