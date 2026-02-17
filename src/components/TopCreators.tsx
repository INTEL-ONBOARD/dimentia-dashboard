const contributors = [
  { rank: 1, name: "Guy Hawkins", handle: "@hawksg", following: false },
  { rank: 2, name: "Jacob Jones", handle: "@jacobs", following: true },
  { rank: 3, name: "Jenny Wilson", handle: "@jenwils", following: false },
  { rank: 4, name: "Floyd Miles", handle: "@floydmils", following: false },
  { rank: 5, name: "Arlene McCoy", handle: "@arlenemc", following: false },
  { rank: 6, name: "Jerome Bell", handle: "@jbell", following: false },
];

export default function TopCreators() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[16px] font-bold text-gray-900">Top Contributors</h3>
        <button className="text-[13px] text-gray-400 hover:text-gray-600 font-medium transition-all">
          See All
        </button>
      </div>

      <div className="space-y-4">
        {contributors.map((c) => (
          <div key={c.rank} className="flex items-center gap-3">
            <span className="text-[13px] text-gray-400 font-medium w-4">{c.rank}.</span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 truncate">{c.name}</p>
              <p className="text-[11px] text-gray-400">{c.handle}</p>
            </div>
            <button
              className={`px-4 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                c.following
                  ? "bg-violet-600 text-white"
                  : "border border-gray-200 text-gray-500 hover:border-violet-300 hover:text-violet-600"
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
