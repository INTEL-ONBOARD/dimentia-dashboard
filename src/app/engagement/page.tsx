"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import BaseBarChart from "@/components/charts/BaseBarChart";
import BasePieChart from "@/components/charts/BasePieChart";
import MetricCard from "@/components/cards/MetricCard";
import { useFeatureUsage, useArticles, useSessions } from "@/hooks/useApi";
import type { FeatureUsage, ArticlesResponse, SessionsResponse } from "@/lib/types";
import { Eye, CheckCircle, BarChart2, Bookmark } from "lucide-react";

export default function EngagementPage() {
  // Fetch real data with React Query
  const { data: featureUsage, isLoading: featureLoading } = useFeatureUsage() as { data: FeatureUsage[] | undefined; isLoading: boolean };
  const { data: articlesData, isLoading: articlesLoading } = useArticles() as { data: ArticlesResponse | undefined; isLoading: boolean };
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions() as { data: SessionsResponse | undefined; isLoading: boolean };
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="Engagement Analytics" />

        <div className="grid grid-cols-4 gap-6 mt-6">
          <MetricCard
            label="Total Views"
            value={sessionsData?.totalViews ?? 0}
            change={sessionsData?.viewsChange ?? 0}
            icon={Eye}
            color="blue"
            loading={sessionsLoading}
          />
          <MetricCard
            label="Completions"
            value={articlesData?.totalCompletions ?? 0}
            change={articlesData?.completionsChange ?? 0}
            icon={CheckCircle}
            color="emerald"
            loading={articlesLoading}
          />
          <MetricCard
            label="Avg Completion Rate"
            value={`${articlesData?.avgCompletionRate ?? 0}%`}
            change={articlesData?.completionRateChange ?? 0}
            icon={BarChart2}
            color="purple"
            loading={articlesLoading}
          />
          <MetricCard
            label="Total Bookmarks"
            value={articlesData?.totalBookmarks ?? 0}
            change={articlesData?.bookmarksChange ?? 0}
            icon={Bookmark}
            color="amber"
            loading={articlesLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <BasePieChart
            title="Feature Usage Distribution"
            data={featureUsage ?? []}
            loading={featureLoading}
          />
          <BaseBarChart
            title="Top Articles by Views"
            data={articlesData?.topArticles ?? []}
            dataKeys={[{ key: "views", color: "#3B82F6", label: "Views" }]}
            xAxisKey="title"
            loading={articlesLoading}
          />
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Article Performance</h3>
          {articlesLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Completions</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Bookmarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {(articlesData?.articles ?? []).map((article: any) => (
                    <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{article.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{article.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{article.views}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{article.completions}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                          {article.completionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{article.bookmarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
