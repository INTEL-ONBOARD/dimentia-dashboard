"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import BasePieChart from "@/components/charts/BasePieChart";
import BaseBarChart from "@/components/charts/BaseBarChart";
import MetricCard from "@/components/cards/MetricCard";
import { useReminders } from "@/hooks/useApi";
import type { RemindersResponse } from "@/lib/types";
import { Bell, BellRing, Mic, CheckCircle } from "lucide-react";

export default function RemindersPage() {
  // Fetch real data with React Query
  const { data: remindersData, isLoading: remindersLoading } = useReminders() as { data: RemindersResponse | undefined; isLoading: boolean };
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="Reminder Analytics" />

        <div className="grid grid-cols-4 gap-6 mt-6">
          <MetricCard
            label="Total Medication Reminders"
            value={remindersData?.totalReminders ?? 0}
            change={remindersData?.remindersChange ?? 0}
            icon={Bell}
            color="blue"
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

        <div className="grid grid-cols-2 gap-6 mt-6">
          <BasePieChart
            title="Active vs Inactive Reminders"
            data={remindersData?.statusDistribution ?? []}
            loading={remindersLoading}
          />
          <BaseBarChart
            title="Reminders by Day of Week"
            data={remindersData?.byDayOfWeek ?? []}
            dataKeys={[{ key: "count", color: "#3B82F6", label: "Reminders" }]}
            xAxisKey="day"
            loading={remindersLoading}
          />
        </div>
      </main>
    </div>
  );
}
