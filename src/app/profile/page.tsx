"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Calendar, Shield, Key, Smartphone, Download, Clock, Activity } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editEmail, setEditEmail] = useState(user?.email ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleSaveProfile = () => {
    if (!editName.trim()) { toast.error("Name cannot be empty"); return; }
    toast.success("Profile updated successfully!");
    setEditOpen(false);
  };

  const handleChangePassword = () => {
    if (!currentPw) { toast.error("Enter your current password"); return; }
    if (newPw.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (newPw !== confirmPw) { toast.error("Passwords do not match"); return; }
    toast.success("Password changed successfully!");
    setPwOpen(false);
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const handleExportData = () => {
    toast.success("Preparing your data export...");
    setTimeout(() => toast.success("Export ready — check your email"), 2000);
  };

  const handleSignOutAll = () => {
    toast.success("All other sessions have been signed out");
  };

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
                    <button
                      onClick={() => { setEditName(user?.name ?? ""); setEditEmail(user?.email ?? ""); setEditOpen(true); }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setPwOpen(true)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Modal */}
            {editOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Edit Profile</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                      <input
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        type="email"
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleSaveProfile} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Save Changes
                    </button>
                    <button onClick={() => setEditOpen(false)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Change Password Modal */}
            {pwOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleChangePassword} className="flex-1 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Update Password
                    </button>
                    <button onClick={() => { setPwOpen(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Mail size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Phone size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">+94 77 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Colombo, Sri Lanka</p>
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
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Member Since</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">January 2024</p>
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
                <button
                  onClick={() => setPwOpen(true)}
                  className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Key size={16} />
                  Change Password
                </button>
                <button
                  onClick={() => toast.info("2FA setup is coming soon")}
                  className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Smartphone size={16} />
                  Enable 2FA
                </button>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  Export My Data
                </button>
                <button
                  onClick={() => toast.info("Login history is coming soon")}
                  className="flex items-center gap-3 w-full p-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
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
              <button
                onClick={handleSignOutAll}
                className="w-full mt-4 text-sm text-rose-600 dark:text-rose-400 hover:underline"
              >
                Sign out all other sessions
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
