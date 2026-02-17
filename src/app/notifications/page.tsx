"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Bell, Check, Trash2, Settings, Filter, AlertCircle, Info, CheckCircle, AlertTriangle, MailOpen, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  const handleDeleteAll = () => {
    // In a real app, this would call a delete function
    markAllAsRead();
  };

  // Stats
  const stats = {
    total: notifications.length + 5, // +5 for static notifications
    unread: unreadCount + 2,
    system: 2,
    reports: 1,
    warnings: 1
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="Notifications" />

        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="col-span-2">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  All Notifications
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  <Check size={16} />
                  Mark All Read
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Clear
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {['All', 'Unread', 'System', 'Users', 'Reports'].map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'All'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <Bell size={24} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You're all caught up! Check back later for updates.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors ${!notification.read ? 'border-l-4 border-l-indigo-500' : ''
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notification.type === 'error'
                        ? 'bg-rose-100 dark:bg-rose-500/20'
                        : notification.type === 'warning'
                          ? 'bg-amber-100 dark:bg-amber-500/20'
                          : 'bg-purple-100 dark:bg-purple-500/20'
                        }`}>
                        {notification.type === 'error' ? (
                          <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />
                        ) : notification.type === 'warning' ? (
                          <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Info size={18} className="text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                          <div className="flex gap-3">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                              >
                                Mark as read
                              </button>
                            )}
                            {notification.actionUrl && (
                              <a
                                href={notification.actionUrl}
                                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                              >
                                View details →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* More sample notifications */}
              {notifications.length > 0 && (
                <>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                        <Settings size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          System Update Available
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-2">
                          A new version of the dashboard is available with performance improvements.
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">3 hours ago</p>
                          <button className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                            Update now →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle size={18} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          Weekly Report Generated
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-2">
                          Your weekly analytics report is ready for download.
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">1 day ago</p>
                          <button className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                            Download →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors border-l-4 border-l-amber-500">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            Storage Space Warning
                          </h4>
                          <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-2" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-2">
                          You're using 85% of your storage space. Consider archiving old data.
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">2 days ago</p>
                          <div className="flex gap-3">
                            <button className="text-xs text-purple-600 dark:text-purple-400 hover:underline">
                              Mark as read
                            </button>
                            <button className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                              Manage storage →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Load More */}
            {notifications.length > 0 && (
              <div className="mt-6 text-center">
                <button className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Load More Notifications
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Notification Stats */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.unread}</div>
                  <p className="text-xs text-slate-500">Unread</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.system}</div>
                  <p className="text-xs text-slate-500">System</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.warnings}</div>
                  <p className="text-xs text-slate-500">Warnings</p>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Filter size={16} />
                Quick Filters
              </h3>
              <div className="space-y-2">
                <button className="flex items-center justify-between w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="flex items-center gap-2">
                    <MailOpen size={14} />
                    Unread only
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">{stats.unread}</span>
                </button>
                <button className="flex items-center justify-between w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={14} />
                    Warnings
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs rounded-full">{stats.warnings}</span>
                </button>
                <button className="flex items-center justify-between w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="flex items-center gap-2">
                    <Settings size={14} />
                    System
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">{stats.system}</span>
                </button>
                <button className="flex items-center justify-between w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <span className="flex items-center gap-2">
                    <Clock size={14} />
                    Last 7 days
                  </span>
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Email alerts</span>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-purple-600 cursor-pointer transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Push notifications</span>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-purple-600 cursor-pointer transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Weekly digest</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-purple-600 cursor-pointer transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                  </div>
                </div>
              </div>
              <a href="/settings" className="block mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline">
                All notification settings →
              </a>
            </div>

            {/* Tips */}
            <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-xl p-5">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Pro Tip</h3>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                Use <kbd className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-500/20 rounded text-xs">⌘ + N</kbd> to
                quickly access notifications from anywhere in the dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
