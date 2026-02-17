const creators = [
  { rank: 1, name: "Guy Hawkins", handle: "@hawksg", following: false },
  { rank: 2, name: "Jacob Jones", handle: "@jacobs", following: true },
  { rank: 3, name: "Jenny Wilson", handle: "@jenwils", following: false },
  { rank: 4, name: "Floyd Miles", handle: "@floydmils", following: false },
  { rank: 5, name: "Arlene McCoy", handle: "@arlenemc", following: false },
  { rank: 6, name: "Jerome Bell", handle: "@jbell", following: false },
];

export default function ActivityTable() {
  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Creator</h3>
        <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition">
          See All
        </button>
      </div>

      <div className="space-y-4">
        {creators.map((c) => (
          <div key={c.rank} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <span className="text-sm text-slate-400 dark:text-slate-500 w-4">{c.rank}.</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{c.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{c.handle}</p>
            </div>
            <button
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${c.following
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
            >
              {c.following ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
