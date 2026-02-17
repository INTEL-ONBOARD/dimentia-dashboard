"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { FileText, Download, Calendar, Clock, BarChart3, Users, Heart, Bell } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const handleGenerate = (reportName: string) => {
    toast.success(`Generating ${reportName}...`);
    setTimeout(() => {
      toast.success(`${reportName} ready for download`);
    }, 2000);
  };

  const reports = [
    { name: "Weekly Analytics Summary", desc: "Complete overview of last 7 days", format: "PDF", icon: BarChart3, color: "indigo" },
    { name: "Monthly User Growth", desc: "User registration and retention metrics", format: "Excel", icon: Users, color: "emerald" },
    { name: "Feature Usage Report", desc: "Detailed breakdown of feature adoption", format: "Excel", icon: BarChart3, color: "purple" },
    { name: "Health Insights Report", desc: "Anonymized symptom and mood analytics", format: "PDF", icon: Heart, color: "rose" },
    { name: "Content Performance", desc: "Article views, completions, and bookmarks", format: "Excel", icon: FileText, color: "amber" },
    { name: "Reminder Analytics", desc: "Medication and voice reminder statistics", format: "Excel", icon: Bell, color: "cyan" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="ml-60 flex-1 py-6 px-8">
        <TopNav title="Reports & Export" subtitle="Generate and download analytics reports" />

        {/* Predefined Reports */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Predefined Reports</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">6 reports available</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {reports.map((report, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all group">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${report.color === 'indigo' ? 'bg-purple-100 dark:bg-purple-500/20' :
                    report.color === 'emerald' ? 'bg-purple-100 dark:bg-purple-500/20' :
                      report.color === 'purple' ? 'bg-purple-100 dark:bg-purple-500/20' :
                        report.color === 'rose' ? 'bg-rose-100 dark:bg-rose-500/20' :
                          report.color === 'amber' ? 'bg-purple-100 dark:bg-purple-500/20' :
                            'bg-purple-100 dark:bg-purple-500/20'
                    }`}>
                    <report.icon size={22} className={
                      report.color === 'indigo' ? 'text-purple-600 dark:text-purple-400' :
                        report.color === 'emerald' ? 'text-purple-600 dark:text-purple-400' :
                          report.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                            report.color === 'rose' ? 'text-rose-600 dark:text-rose-400' :
                              report.color === 'amber' ? 'text-purple-600 dark:text-purple-400' :
                                'text-purple-600 dark:text-purple-400'
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{report.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{report.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
                        {report.format}
                      </span>
                      <button
                        onClick={() => handleGenerate(report.name)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                      >
                        <Download size={14} />
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Export */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Data Export</h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">Export raw data</span>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Export Users", desc: "Complete user list with all metrics" },
                { name: "Export Articles", desc: "Article performance data" },
                { name: "Export Symptoms", desc: "Anonymized symptom analytics" },
                { name: "Export Moods", desc: "Anonymized mood analytics" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toast.success(`Exporting ${item.name}...`)}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Scheduled Reports</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                <Clock size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Automated Report Delivery</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Set up weekly or monthly reports delivered to your email</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Configure Schedule
              </button>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                View History
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
