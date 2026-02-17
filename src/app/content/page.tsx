"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DataTable from "@/components/tables/DataTable";
import BaseBarChart from "@/components/charts/BaseBarChart";
import MetricCard from "@/components/cards/MetricCard";
import { mockArticlePerformance } from "@/lib/mockData";
import { Eye, FileCheck, Bookmark, Award, TrendingUp, BookOpen } from "lucide-react";

export default function ContentPage() {
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
            value={4847}
            change={12}
            icon={Eye}
            color="purple"
          />
          <MetricCard
            label="Total Completions"
            value={3716}
            change={8}
            icon={FileCheck}
            color="purple"
          />
          <MetricCard
            label="Total Bookmarks"
            value={1651}
            change={15}
            icon={Bookmark}
            color="purple"
          />
          <MetricCard
            label="Total Points Earned"
            value={37160}
            change={8}
            icon={Award}
            color="purple"
          />
        </div>

        {/* Category Performance */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <BaseBarChart
            title="Article Views by Category"
            data={[
              { category: "Health Tips", views: 2689 },
              { category: "Daily Activities", views: 1342 },
              { category: "Caregiver Resources", views: 816 },
            ]}
            dataKeys={[{ key: "views", color: "#8B5CF6", label: "Views" }]}
            xAxisKey="category"
          />
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Performing Content</h3>
            <div className="space-y-4">
              {[
                { title: "Understanding Memory Care", views: 1245, trend: "+18%" },
                { title: "Daily Exercise Guide", views: 987, trend: "+12%" },
                { title: "Nutrition Tips for Seniors", views: 856, trend: "+8%" },
                { title: "Communication Strategies", views: 723, trend: "+15%" },
              ].map((item, idx) => (
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
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">{item.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Article Performance Table */}
        <div className="mt-8">
          <DataTable
            data={mockArticlePerformance}
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
