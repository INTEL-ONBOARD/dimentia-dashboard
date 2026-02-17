"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import BaseBarChart from "@/components/charts/BaseBarChart";
import BasePieChart from "@/components/charts/BasePieChart";
import BaseLineChart from "@/components/charts/BaseLineChart";
import MetricCard from "@/components/cards/MetricCard";
import { useFeatureUsage, useArticles, useSessions } from "@/hooks/useApi";
import type { FeatureUsage, ArticlesResponse, SessionsResponse } from "@/lib/types";
import { Eye, CheckCircle, BarChart2, Bookmark, Clock, TrendingUp } from "lucide-react";

export default function EngagementPage() {
  const { data: featureUsage, isLoading: featureLoading } = useFeatureUsage() as { data: FeatureUsage[] | undefined; isLoading: boolean };
  const { data: articlesData, isLoading: articlesLoading } = useArticles() as { data: ArticlesResponse | undefined; isLoading: boolean };
  const { data: sessionsData, isLoading: sessionsLoading } = useSessions() as { data: SessionsResponse | undefined; isLoading: boolean };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="Engagement Analytics" subtitle="Track user interactions and content performance" />

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <MetricCard
            label="Total Views"
            value={sessionsData?.totalViews ?? 0}
            change={sessionsData?.viewsChange ?? 0}
            icon={Eye}
            color="purple"
            loading={sessionsLoading}
          />
          <MetricCard
            label="Completions"
            value={articlesData?.totalCompletions ?? 0}
            change={articlesData?.completionsChange ?? 0}
            icon={CheckCircle}
            color="purple"
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
            color="purple"
            loading={articlesLoading}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <BasePieChart
            title="Feature Usage Distribution"
            data={featureUsage ?? []}
            loading={featureLoading}
          />
          <BaseBarChart
            title="Top Articles by Views"
            data={articlesData?.topArticles ?? []}
            dataKeys={[{ key: "views", color: "#8B5CF6", label: "Views" }]}
            xAxisKey="title"
            loading={articlesLoading}
          />
        </div>

        {/* Article Performance Table */}
        <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Article Performance</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed breakdown of content engagement</p>
          </div>
          {articlesLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completions</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bookmarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(articlesData?.articles ?? []).map((article: any) => (
                    <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{article.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{article.views?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{article.completions?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${article.completionRate >= 80
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400'
                          : article.completionRate >= 60
                            ? 'bg-purple-100/70 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                          {article.completionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{article.bookmarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Engagement Insights */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                <Clock size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Average Session Duration</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Time users spend per session</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">12:45</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">↑ 8% from last week</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Engagement Score</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Overall platform engagement</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">87.3</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">↑ 5.2 points this month</p>
          </div>
        </div>
      </main>
    </div>
  );
}
