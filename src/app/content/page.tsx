"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DataTable from "@/components/tables/DataTable";
import BaseBarChart from "@/components/charts/BaseBarChart";
import MetricCard from "@/components/cards/MetricCard";
import { useArticles } from "@/hooks/useApi";
import type { ArticlesResponse } from "@/lib/types";
import { Eye, FileCheck, Bookmark, Award } from "lucide-react";

export default function ContentPage() {
  const { data: articlesData, isLoading } = useArticles() as { data: ArticlesResponse | undefined; isLoading: boolean };

  const categoryMap: Record<string, number> = {};
  for (const article of articlesData?.articles ?? []) {
    categoryMap[article.category] = (categoryMap[article.category] || 0) + article.views;
  }
  const categoryData = Object.entries(categoryMap).map(([category, views]) => ({ category, views }));
  const topArticles = articlesData?.topArticles ?? [];

  const columns = [
    { key: "title", label: "Article Title", sortable: true },
    {
      key: "category", label: "Category", sortable: true,
      render: (value: string) => (
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
          {value}
        </span>
      )
    },
    { key: "views", label: "Views", sortable: true },
    { key: "completions", label: "Completions", sortable: true },
    {
      key: "completionRate", label: "Completion Rate", sortable: true,
      render: (value: number) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${value >= 80 ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400' :
          value >= 70 ? 'bg-purple-100/70 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400' :
            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}>
          {value}%
        </span>
      )
    },
    { key: "bookmarks", label: "Bookmarks", sortable: true },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="Content Analytics" subtitle="Track article performance and engagement" />

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6 mt-6">
          <MetricCard
            label="Total Article Views"
            value={articlesData?.articles.reduce((s, a) => s + a.views, 0) ?? 0}
            change={articlesData?.completionsChange ?? 0}
            icon={Eye}
            color="purple"
            loading={isLoading}
          />
          <MetricCard
            label="Total Completions"
            value={articlesData?.totalCompletions ?? 0}
            change={articlesData?.completionsChange ?? 0}
            icon={FileCheck}
            color="purple"
            loading={isLoading}
          />
          <MetricCard
            label="Total Bookmarks"
            value={articlesData?.totalBookmarks ?? 0}
            change={articlesData?.bookmarksChange ?? 0}
            icon={Bookmark}
            color="purple"
            loading={isLoading}
          />
          <MetricCard
            label="Avg Completion Rate"
            value={`${articlesData?.avgCompletionRate ?? 0}%`}
            change={articlesData?.completionRateChange ?? 0}
            icon={Award}
            color="purple"
            loading={isLoading}
          />
        </div>

        {/* Category Performance */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <BaseBarChart
            title="Article Views by Category"
            data={categoryData}
            dataKeys={[{ key: "views", color: "#8B5CF6", label: "Views" }]}
            xAxisKey="category"
          />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Performing Content</h3>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topArticles.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">No articles yet</p>
                ) : topArticles.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{item.completionRate}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Performance Table */}
        <div className="mt-8">
          <DataTable
            data={articlesData?.articles ?? []}
            columns={columns}
            title="Article Performance"
            searchable
            exportable
          />
        </div>
      </main>
    </div>
  );
}
