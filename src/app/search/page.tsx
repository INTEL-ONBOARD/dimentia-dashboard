"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useSearchParams } from "next/navigation";
import { Search, FileText, Users, Activity, TrendingUp, Clock, Sparkles, ArrowRight, X } from "lucide-react";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Mock search results
  const results = {
    users: [
      { id: 1, name: "John Doe", email: "john@example.com", role: "Patient" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Caregiver" },
    ],
    articles: [
      { id: 1, title: "Understanding Dementia", category: "Education", views: 1234 },
      { id: 2, title: "Memory Care Tips", category: "Caregiving", views: 987 },
    ],
    reports: [
      { id: 1, name: "Weekly Analytics Summary", date: "Feb 15, 2026" },
      { id: 2, name: "User Growth Report", date: "Feb 10, 2026" },
    ],
  };

  const recentSearches = [
    "user analytics",
    "weekly report",
    "engagement metrics",
    "patient data"
  ];

  const popularSearches = [
    "Dashboard",
    "Users",
    "Reports",
    "Analytics",
    "Settings"
  ];

  const totalResults = results.users.length + results.articles.length + results.reports.length;

  return (
    <div className="mt-6 grid grid-cols-3 gap-6">
      {/* Main Content - 2 columns */}
      <div className="col-span-2">
        {/* Search Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {query ? `Results for "${query}"` : "Search Dashboard"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {query ? `Found ${totalResults} results across all categories` : "Find users, articles, reports, and more"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['All', 'Users', 'Articles', 'Reports', 'Settings'].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {!query ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Start Searching
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Enter a search term in the search bar above to find users, articles, and reports.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Users Section */}
            {results.users.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={18} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Users ({results.users.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {results.users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {user.name}
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-lg">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Articles Section */}
            {results.articles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Articles ({results.articles.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {results.articles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <span>{article.category}</span>
                              <span>•</span>
                              <span>{article.views.toLocaleString()} views</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Section */}
            {results.reports.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={18} className="text-purple-600 dark:text-purple-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Reports ({results.reports.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {results.reports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                            <Activity size={18} className="text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {report.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Generated {report.date}
                            </p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {totalResults === 0 && query && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  We couldn't find anything matching "{query}". Try different keywords.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        {/* Recent Searches */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={16} />
              Recent Searches
            </h3>
            <button className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((search, idx) => (
              <div key={idx} className="flex items-center justify-between group">
                <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Search size={14} className="text-slate-400" />
                  {search}
                </button>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-all">
                  <X size={12} className="text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Sparkles size={16} />
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, idx) => (
              <button
                key={idx}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Search Tips */}
        <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-5">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3">
            Search Tips
          </h3>
          <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-400">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Use specific keywords
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Try different combinations
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Use filters to narrow results
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500">•</span>
              Check spelling variations
            </li>
          </ul>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Keyboard Shortcuts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Focus search</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded">⌘</kbd>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded">K</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Clear search</span>
              <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded">Esc</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Navigate results</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded">↑</kbd>
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded">↓</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="Search" />
        <Suspense fallback={
          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400">Loading search results...</p>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </main>
    </div>
  );
}
