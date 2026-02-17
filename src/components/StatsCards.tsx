import { ArrowUp, ArrowDown } from "lucide-react";

const stats = [
  { label: "Revenue", value: "$12.4K", change: 12.3, up: true },
  { label: "Spending", value: "$3.2K", change: 8.1, up: true },
  { label: "ROI", value: "+14.02%", change: 5.3, up: false },
  { label: "Users", value: "7,240", change: 3.2, up: true },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s, i) => (
        <div key={i} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4 hover:shadow-lg transition-shadow">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">{s.label}</p>
          <span className="text-[22px] font-bold text-slate-900 dark:text-white">{s.value}</span>
          <div className="mt-2.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${s.up
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                  : "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                }`}
            >
              {s.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {s.change}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
