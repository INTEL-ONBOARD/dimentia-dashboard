"use client";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { FileText, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const handleGenerate = (reportName: string) => {
    toast.success(`Generating ${reportName}...`);
    setTimeout(() => {
      toast.success(`${reportName} ready for download`);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8">
        <TopNav title="Reports & Export" />

        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Predefined Reports</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { name: "Weekly Analytics Summary", desc: "Complete overview of last 7 days", format: "PDF" },
              { name: "Monthly User Growth", desc: "User registration and retention metrics", format: "Excel" },
              { name: "Feature Usage Report", desc: "Detailed breakdown of feature adoption", format: "Excel" },
              { name: "Health Insights Report", desc: "Anonymized symptom and mood analytics", format: "PDF" },
              { name: "Content Performance", desc: "Article views, completions, and bookmarks", format: "Excel" },
              { name: "Reminder Analytics", desc: "Medication and voice reminder statistics", format: "Excel" },
            ].map((report, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{report.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{report.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{report.format}</span>
                      <button
                        onClick={() => handleGenerate(report.name)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
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

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Data Export</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: "Export Users", desc: "Complete user list with all metrics" },
                { name: "Export Articles", desc: "Article performance data" },
                { name: "Export Symptoms", desc: "Anonymized symptom analytics" },
                { name: "Export Moods", desc: "Anonymized mood analytics" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toast.success(`Exporting ${item.name}...`)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Scheduled Reports</h2>
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <Calendar size={20} className="text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Set up automated weekly or monthly reports delivered to your email</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Configure Scheduled Reports
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
