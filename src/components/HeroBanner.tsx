export default function HeroBanner() {
  return (
    <div
      className="rounded-3xl p-10 flex flex-col justify-end h-[280px] relative overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #f97316 0%, #ec4899 20%, #a855f7 40%, #6366f1 55%, #06b6d4 70%, #10b981 85%, #eab308 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
      <div className="relative z-10">
        <h2 className="text-[36px] font-bold text-gray-900 leading-[1.15] max-w-[420px]">
          Build, Ship and Scale Your Projects.
        </h2>
        <div className="flex gap-3 mt-7">
          <button className="px-7 py-2.5 rounded-2xl border-2 border-violet-600 text-violet-600 bg-white text-sm font-semibold hover:bg-violet-50 transition-all">
            Explore
          </button>
          <button className="px-7 py-2.5 rounded-2xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-all">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
