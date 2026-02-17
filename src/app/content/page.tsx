"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import DataTable from "@/components/tables/DataTable";
import BaseBarChart from "@/components/charts/BaseBarChart";
import { mockArticlePerformance } from "@/lib/mockData";

export default function ContentPage() {
  const columns = [
    { key: "title", label: "Article Title", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "views", label: "Views", sortable: true },
    { key: "completions", label: "Completions", sortable: true },
    { key: "completionRate", label: "Completion Rate", sortable: true,
      render: (value: number) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          value >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
          value >= 70 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          {value}%
        </span>
      )
    },
    { key: "bookmarks", label: "Bookmarks", sortable: true },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="Content Analytics" />

        <div className="grid grid-cols-4 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Article Views</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">4,847</p>
            <p className="text-xs text-green-600 mt-2">↑ 12% from last week</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Completions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">3,716</p>
            <p className="text-xs text-green-600 mt-2">↑ 8% from last week</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Bookmarks</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1,651</p>
            <p className="text-xs text-green-600 mt-2">↑ 15% from last week</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Points Earned</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">37,160</p>
            <p className="text-xs text-green-600 mt-2">↑ 8% from last week</p>
          </div>
        </div>

        <div className="mt-6">
          <BaseBarChart
            title="Article Views by Category"
            data={[
              { category: "Health Tips", views: 2689 },
              { category: "Daily Activities", views: 1342 },
              { category: "Caregiver Resources", views: 816 },
            ]}
            dataKeys={[{ key: "views", color: "#3B82F6", label: "Views" }]}
            xAxisKey="category"
          />
        </div>

        <div className="mt-6">
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
