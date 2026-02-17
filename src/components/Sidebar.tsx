"use client";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Heart,
  FileText,
  Bell,
  FileBarChart,
  Settings,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/" },
  { icon: Users, label: "User Analytics", href: "/users" },
  { icon: TrendingUp, label: "Engagement", href: "/engagement" },
];

const analyticsItems = [
  { icon: Heart, label: "Health Insights", href: "/health-insights" },
  { icon: FileText, label: "Content Analytics", href: "/content" },
  { icon: Bell, label: "Reminder Analytics", href: "/reminders" },
];

const managementItems = [
  { icon: FileBarChart, label: "Reports & Export", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [analyticsExpanded, setAnalyticsExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const NavLink = ({ item }: { item: typeof mainNavItems[0] }) => {
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
            ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
          }`}
        prefetch={true}
      >
        <item.icon size={18} strokeWidth={1.8} />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-60 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-5 px-3 fixed left-0 top-0 overflow-y-auto z-40">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
            <Image
              src="/logo.png"
              alt="DementiaMithura Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              DementiaMithura
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Analytics Dashboard</p>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Analytics Section */}
        <div className="mt-6">
          <button
            onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            Analytics
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${analyticsExpanded ? '' : '-rotate-90'}`}
            />
          </button>

          {analyticsExpanded && (
            <nav className="space-y-1 mt-1">
              {analyticsItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          )}
        </div>

        {/* Management */}
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-6 mb-2 px-3">
          Management
        </p>
        <nav className="space-y-1">
          {managementItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            {theme === 'dark' ? 'Dark' : 'Light'}
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${theme === 'dark' ? 'left-5' : 'left-0.5'
                }`}
            />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors w-full"
        >
          <LogOut size={16} />
          Logout
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-50 dark:bg-slate-800">
          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
            <Image
              src="/woman.png"
              alt="User Avatar"
              width={36}
              height={36}
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {user?.role || 'admin'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
