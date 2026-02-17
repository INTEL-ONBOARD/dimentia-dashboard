"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Mail, Phone, MapPin, Calendar, Shield, Key, Smartphone, Download, Clock, Activity, Lock } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="My Profile" />

        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 shadow-lg shadow-indigo-500/30">
                  <Image
                    src="/woman.png"
                    alt="User Avatar"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {user?.name}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {user?.role}
                  </p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Edit Profile
                    </button>
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <User size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Full Name</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        +94 77 123 4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Colombo, Sri Lanka
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Shield size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Role</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user?.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Member Since</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        January 2024
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Account Status</p>
                      <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-lg">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Two-Factor Auth</p>
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-lg">
                        Disabled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Activity Overview
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { value: 156, label: "Logins This Month", color: "text-purple-600 dark:text-purple-400" },
                  { value: 42, label: "Reports Generated", color: "text-purple-600 dark:text-purple-400" },
                  { value: 89, label: "Settings Changes", color: "text-purple-600 dark:text-purple-400" },
                  { value: 23, label: "Exports Created", color: "text-purple-600 dark:text-purple-400" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {[
                  { action: "Generated Weekly Analytics Report", time: "2 hours ago", type: "report" },
                  { action: "Updated notification settings", time: "5 hours ago", type: "settings" },
                  { action: "Exported user data to CSV", time: "1 day ago", type: "export" },
                  { action: "Changed dashboard date range", time: "2 days ago", type: "settings" },
                  { action: "Logged in from new device", time: "3 days ago", type: "login" },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">{activity.action}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Security Score */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Security Score</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-100 dark:text-slate-800" />
                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="301.6" strokeDashoffset="90" className="text-purple-500" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">70%</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">Your account security could be improved</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">Strong password</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-slate-600 dark:text-slate-400">Enable 2FA</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-slate-600 dark:text-slate-400">Add recovery email</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Key size={16} />
                  Change Password
                </button>
                <button className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Smartphone size={16} />
                  Enable 2FA
                </button>
                <button className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Download size={16} />
                  Export My Data
                </button>
                <button className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Clock size={16} />
                  Login History
                </button>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                      <Activity size={14} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">MacBook Pro</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Current session</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Smartphone size={14} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">iPhone 15</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 text-sm text-rose-600 dark:text-rose-400 hover:underline">
                Sign out all other sessions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
