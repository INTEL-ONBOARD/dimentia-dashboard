"use client";
import { Search, Bell, User, Settings as SettingsIcon, LogOut, Command } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { formatDistanceToNow } from "date-fns";

interface TopNavProps {
  title?: string;
  subtitle?: string;
}

export default function TopNav({ title = "Overview Dashboard", subtitle }: TopNavProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-12 py-2.5 border border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 w-72 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
            <Command size={12} />
            <span className="text-xs">K</span>
          </div>
        </form>

        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 bg-white/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700/50 rounded-xl transition-all"
          >
            <Bell size={18} className="text-slate-600 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg shadow-rose-500/30">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 z-50 max-h-[480px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{unreadCount} unread messages</p>
                </div>
                {notifications.length > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                    Mark all read
                  </button>
                )}
              </div>

              <div className="overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center text-slate-400 dark:text-slate-500">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 mx-auto mb-4 flex items-center justify-center">
                      <Bell size={24} className="opacity-50" />
                    </div>
                    <p className="text-sm font-medium">No notifications</p>
                    <p className="text-xs mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.actionUrl) {
                          router.push(notification.actionUrl);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all ${!notification.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                        }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{notification.title}</p>
                            {!notification.read && <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5 animate-pulse" />}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{notification.message}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <button
                    onClick={() => {
                      router.push('/notifications');
                      setShowNotifications(false);
                    }}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium w-full text-center py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl px-3 py-2 transition-all"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role || 'admin'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-500/30">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email || 'admin@demo.com'}</p>
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => {
                    router.push('/profile');
                    setShowProfile(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    router.push('/settings');
                    setShowProfile(false);
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <SettingsIcon size={16} />
                  Settings
                </button>
              </div>

              <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
