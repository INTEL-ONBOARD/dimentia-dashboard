"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import BaseBarChart from "@/components/charts/BaseBarChart";
import BasePieChart from "@/components/charts/BasePieChart";
import MetricCard from "@/components/cards/MetricCard";
import { useSymptoms, useMoods } from "@/hooks/useApi";
import type { SymptomsResponse, MoodsResponse } from "@/lib/types";
import { AlertCircle, Activity, Smile, Target, TrendingUp } from "lucide-react";

export default function HealthInsightsPage() {
  // Fetch real data with React Query
  const { data: symptomsData, isLoading: symptomsLoading } = useSymptoms() as { data: SymptomsResponse | undefined; isLoading: boolean };
  const { data: moodsData, isLoading: moodsLoading } = useMoods() as { data: MoodsResponse | undefined; isLoading: boolean };
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="Health Insights" />

        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Privacy Notice</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                All health data displayed here is anonymized and aggregated. No individual patient data is identifiable.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Symptom Analytics
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <BaseBarChart
              title="Top 10 Most Common Symptoms"
              data={symptomsData?.topSymptoms ?? []}
              dataKeys={[{ key: "count", color: "#3B82F6", label: "Frequency" }]}
              xAxisKey="symptom"
              height={400}
              loading={symptomsLoading}
            />
            <BasePieChart
              title="Mood Distribution"
              data={moodsData?.moodDistribution ?? []}
              height={400}
              loading={moodsLoading}
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Health Tracking Summary
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <MetricCard
              label="Total Symptom Entries"
              value={symptomsData?.totalEntries ?? 0}
              change={symptomsData?.entriesChange ?? 0}
              icon={Activity}
              color="blue"
              loading={symptomsLoading}
            />
            <MetricCard
              label="Total Mood Entries"
              value={moodsData?.totalEntries ?? 0}
              change={moodsData?.entriesChange ?? 0}
              icon={Smile}
              color="emerald"
              loading={moodsLoading}
            />
            <MetricCard
              label="Tracking Adherence"
              value={`${symptomsData?.trackingAdherence ?? 0}%`}
              change={symptomsData?.adherenceChange ?? 0}
              icon={Target}
              color="purple"
              loading={symptomsLoading}
            />
            <MetricCard
              label="Avg Symptoms/Entry"
              value={symptomsData?.avgSymptomsPerEntry ?? 0}
              change={symptomsData?.avgChange ?? 0}
              icon={TrendingUp}
              color="amber"
              loading={symptomsLoading}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
