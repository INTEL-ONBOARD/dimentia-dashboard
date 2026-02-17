import { Clock } from "lucide-react";

const categories = ["All", "Design", "Development", "Marketing"];

const projects = [
  {
    id: 1,
    title: "Brand Redesign",
    team: "Design Team",
    status: "12 tasks left",
    time: "3d 12h left",
    progress: "78%",
    gradient: "linear-gradient(135deg, #f43f5e, #ec4899, #c084fc)",
  },
  {
    id: 2,
    title: "Mobile App v2",
    team: "Dev Team",
    status: "8 tasks left",
    time: "5d 06h left",
    progress: "54%",
    gradient: "linear-gradient(135deg, #06b6d4, #14b8a6, #10b981)",
  },
];

export default function NFTCards() {
  return (
    <div>
      {/* Header + Category Tabs */}
      <div className="flex items-center justify-between mt-8 mb-5">
        <h3 className="text-[20px] font-bold text-gray-900">Active Projects</h3>
        <div className="flex gap-1">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-1.5 rounded-xl text-[13px] font-medium transition-all ${
                i === 0
                  ? "text-violet-600 border border-violet-200 bg-violet-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-2 gap-5">
        {projects.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden group"
          >
            {/* Cover */}
            <div
              className="h-52 relative flex items-center justify-center"
              style={{ background: item.gradient }}
            >
              <div className="w-32 h-32 rounded-full bg-white/20" />

              {idx === 0 && (
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl px-6 py-2.5 text-[13px] font-semibold text-gray-800 shadow-xl">
                  View Details
                </button>
              )}

              {/* Deadline */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-3.5 py-2 text-[11px] font-semibold text-white">
                <Clock size={12} />
                {item.time}
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-bold text-[14px] text-gray-900">{item.title}</span>
                <span className="text-[11px] text-gray-400 font-medium">{item.status}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <span className="text-[12px] text-gray-400">{item.team}</span>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                <span className="text-[12px] text-gray-400">Progress</span>
                <span className="text-[14px] font-bold text-violet-600">{item.progress}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Peek row */}
      <div className="grid grid-cols-2 gap-5 mt-5">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl overflow-hidden h-28" style={{
            background: i === 1
              ? "linear-gradient(135deg, #f59e0b, #f97316, #ef4444)"
              : "linear-gradient(135deg, #ec4899, #a855f7, #6366f1)"
          }} />
        ))}
      </div>
    </div>
  );
}
