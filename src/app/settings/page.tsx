"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useUpdateSettings } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Settings, Bell, Shield, Database, RefreshCw, Check, Monitor, Moon, Sun, HelpCircle, MessageCircle, BookOpen, Zap } from "lucide-react";

export default function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore();
  const { setTheme } = useThemeStore();
  const { mutate: saveSettings, isPending: isSaving } = useUpdateSettings();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy'>('general');

  const handleSave = () => {
    saveSettings(settings);
  };

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    updateSettings({ theme: value });
    if (value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(value);
    }
  };

  const handleClearCache = () => {
    sessionStorage.clear();
    queryClient.clear();
    toast.success("Cache cleared successfully!");
  };

  const handleResetSettings = () => {
    updateSettings({
      theme: 'system',
      dateRange: 'last30days',
      refreshInterval: 300,
      chartAnimations: true,
      notifications: { email: true, push: true, slack: false, sms: false, weekly: true },
      privacy: { analyticsTracking: true, personalizedExperience: true, shareAnonymousData: true },
    });
    handleThemeChange('system');
    toast.success("Settings reset to defaults!");
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ];

  // Use the live theme store value so the selected card reflects actual state
  const currentTheme = settings.theme;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="Settings" subtitle="Manage your preferences" />

        <div className="mt-6 grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                {/* Appearance */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Appearance</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Customize how the dashboard looks</p>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor },
                    ].map((themeOption) => (
                      <button
                        key={themeOption.value}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${currentTheme === themeOption.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        onClick={() => handleThemeChange(themeOption.value as 'light' | 'dark' | 'system')}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentTheme === themeOption.value
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                          <themeOption.icon size={20} />
                        </div>
                        <span className={`text-sm font-medium ${currentTheme === themeOption.value
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-slate-600 dark:text-slate-400'
                          }`}>{themeOption.label}</span>
                        {currentTheme === themeOption.value && (
                          <Check size={16} className="text-purple-500 absolute top-2 right-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dashboard Preferences */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Dashboard Preferences</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Configure default behaviors</p>

                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Default Date Range
                        </label>
                        <select
                          value={settings.dateRange}
                          onChange={(e) => updateSettings({ dateRange: e.target.value as 'last7days' | 'last30days' | 'last90days' | 'custom' })}
                          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        >
                          <option value="last7days">Last 7 Days</option>
                          <option value="last30days">Last 30 Days</option>
                          <option value="last90days">Last 90 Days</option>
                          <option value="custom">Custom Range</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Auto-Refresh Interval
                        </label>
                        <select
                          value={settings.refreshInterval}
                          onChange={(e) => updateSettings({ refreshInterval: parseInt(e.target.value) })}
                          className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                        >
                          <option value="3">3 seconds</option>
                          <option value="15">15 seconds</option>
                          <option value="60">1 minute</option>
                          <option value="300">5 minutes</option>
                          <option value="600">10 minutes</option>
                          <option value="1800">30 minutes</option>
                          <option value="0">Never</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Chart Animations</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Enable smooth transitions</p>
                      </div>
                      <button
                        onClick={() => updateSettings({ chartAnimations: !settings.chartAnimations })}
                        className={`w-12 h-7 rounded-full transition-colors ${settings.chartAnimations ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-1 ${settings.chartAnimations ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Quick Actions</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Common maintenance tasks</p>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={handleClearCache}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <RefreshCw size={20} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Clear Cache</span>
                    </button>
                    <button
                      onClick={() => { window.location.href = '/reports'; }}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database size={20} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Export Data</span>
                    </button>
                    <button
                      onClick={handleResetSettings}
                      className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield size={20} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Reset Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Notification Preferences</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose how you want to be notified</p>

                <div className="space-y-1">
                  {(
                    [
                      { key: 'email', label: 'Email Notifications', desc: 'Receive important alerts via email' },
                      { key: 'push', label: 'Push Notifications', desc: 'Get real-time browser notifications' },
                      { key: 'sms', label: 'SMS Notifications', desc: 'Receive critical alerts via SMS' },
                      { key: 'weekly', label: 'Weekly Digest', desc: 'Get a summary every Monday' },
                    ] as { key: keyof typeof settings.notifications; label: string; desc: string }[]
                  ).map((item, idx) => (
                    <div key={item.key} className={`flex items-center justify-between py-4 ${idx !== 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() =>
                          updateSettings({
                            notifications: {
                              ...settings.notifications,
                              [item.key]: !settings.notifications[item.key],
                            },
                          })
                        }
                        className={`w-12 h-7 rounded-full transition-colors ${settings.notifications[item.key] ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-1 ${settings.notifications[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Data & Privacy</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your data preferences</p>

                  <div className="space-y-1">
                    {(
                      [
                        { key: 'analyticsTracking', label: 'Analytics Tracking', desc: 'Help improve the dashboard with usage data' },
                        { key: 'personalizedExperience', label: 'Personalized Experience', desc: 'Use your data to customize the dashboard' },
                        { key: 'shareAnonymousData', label: 'Share Anonymous Data', desc: 'Contribute to aggregate statistics' },
                      ] as { key: keyof typeof settings.privacy; label: string; desc: string }[]
                    ).map((item, idx) => (
                      <div key={item.key} className={`flex items-center justify-between py-4 ${idx !== 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          onClick={() =>
                            updateSettings({
                              privacy: {
                                ...settings.privacy,
                                [item.key]: !settings.privacy[item.key],
                              },
                            })
                          }
                          className={`w-12 h-7 rounded-full transition-colors ${settings.privacy[item.key] ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-1 ${settings.privacy[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Danger Zone</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Irreversible actions</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => toast.error("This action is disabled in demo mode")}
                      className="px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      Delete All Data
                    </button>
                    <button
                      onClick={() => toast.error("This action is disabled in demo mode")}
                      className="px-4 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-900 dark:text-white">Version 1.0.0</span> · Last updated Feb 17, 2026
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Help Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                <HelpCircle size={20} />
              </div>
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-white/80 mb-4">Our support team is here to help you with any questions.</p>
              <button
                onClick={() => toast.info("Opening support chat...")}
                className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                Contact Support
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-3 p-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <BookOpen size={16} />
                  Documentation
                </a>
                <a href="#" className="flex items-center gap-3 p-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <MessageCircle size={16} />
                  FAQs
                </a>
                <a href="#" className="flex items-center gap-3 p-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <Zap size={16} />
                  What's New
                </a>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">System Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Version</span>
                  <span className="font-medium text-slate-900 dark:text-white">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Environment</span>
                  <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Last Updated</span>
                  <span className="font-medium text-slate-900 dark:text-white">Feb 17, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">API Status</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="font-medium text-purple-600 dark:text-purple-400">Online</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Shortcuts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Search</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">⌘</kbd>
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">K</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Save</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">⌘</kbd>
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">S</kbd>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Toggle Theme</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">⌘</kbd>
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">D</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
