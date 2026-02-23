"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import BaseBarChart from "@/components/charts/BaseBarChart";
import BasePieChart from "@/components/charts/BasePieChart";
import MetricCard from "@/components/cards/MetricCard";
import { useSymptoms, useMoods } from "@/hooks/useApi";
import type { SymptomsResponse, MoodsResponse } from "@/lib/types";
import { AlertCircle, Activity, Smile, Target, TrendingUp, Heart, Brain, Shield } from "lucide-react";

export default function HealthInsightsPage() {
  const { data: symptomsData, isLoading: symptomsLoading } = useSymptoms() as { data: SymptomsResponse | undefined; isLoading: boolean };
  const { data: moodsData, isLoading: moodsLoading } = useMoods() as { data: MoodsResponse | undefined; isLoading: boolean };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="Health Insights" subtitle="Anonymized health data analytics" />

        {/* Privacy Notice */}
        <div className="mt-6 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
              <Shield size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-300">Privacy Notice</h3>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                All health data displayed here is anonymized and aggregated. No individual patient data is identifiable.
              </p>
            </div>
          </div>
        </div>

        {/* Health Tracking Summary */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <MetricCard
            label="Total Symptom Entries"
            value={symptomsData?.totalEntries ?? 0}
            change={symptomsData?.entriesChange ?? 0}
            icon={Activity}
            color="purple"
            loading={symptomsLoading}
          />
          <MetricCard
            label="Total Mood Entries"
            value={moodsData?.totalEntries ?? 0}
            change={moodsData?.entriesChange ?? 0}
            icon={Smile}
            color="purple"
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
            color="purple"
            loading={symptomsLoading}
          />
        </div>

        {/* Charts Section */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Symptom & Mood Analytics
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <BaseBarChart
              title="Top 10 Most Common Symptoms"
              data={symptomsData?.topSymptoms ?? []}
              dataKeys={[{ key: "count", color: "#8B5CF6", label: "Frequency" }]}
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

        {/* Health Insights Cards — derived from live symptom & mood data */}
        {(() => {
          const symptoms = symptomsData?.topSymptoms ?? [];
          const totalSymptomCount = symptoms.reduce((s, x) => s + x.count, 0);
          const pct = (count: number) =>
            totalSymptomCount > 0 ? Math.round((count / totalSymptomCount) * 100) : 0;
          const topSymptom = symptoms[0];
          const secondSymptom = symptoms[1];
          const moodDist = moodsData?.moodDistribution ?? [];
          const totalMoods = moodDist.reduce((s: number, m: { value: number }) => s + m.value, 0);
          const positiveMoods = moodDist
            .filter((m: { name: string }) => ['Happy', 'Calm', 'Okay'].includes(m.name))
            .reduce((s: number, m: { value: number }) => s + m.value, 0);
          const positiveMoodPct = totalMoods > 0 ? Math.round((positiveMoods / totalMoods) * 100) : 0;

          return (
            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                    <Heart size={24} className="text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Top Symptom</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Most reported this month</p>
                  </div>
                </div>
                {symptomsLoading ? (
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ) : topSymptom ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{topSymptom.symptom}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{pct(topSymptom.count)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${pct(topSymptom.count)}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{topSymptom.count} occurrences</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500">No data yet</p>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                    <Brain size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">2nd Most Reported</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Second common symptom</p>
                  </div>
                </div>
                {symptomsLoading ? (
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ) : secondSymptom ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{secondSymptom.symptom}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{pct(secondSymptom.count)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${pct(secondSymptom.count)}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{secondSymptom.count} occurrences</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 dark:text-slate-500">No data yet</p>
                )}
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                    <Smile size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Emotional</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Mood & wellbeing</p>
                  </div>
                </div>
                {moodsLoading ? (
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Positive Mood</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{positiveMoodPct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${positiveMoodPct}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Happy + Calm + Okay moods</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}
