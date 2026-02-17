export default function HeroBanner() {
  return (
    <div
      className="rounded-3xl p-10 flex flex-col justify-end h-[280px] relative overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #f97316 0%, #ec4899 20%, #a855f7 40%, #6366f1 55%, #06b6d4 70%, #10b981 85%, #eab308 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      <div className="relative z-10">
        <h2 className="text-[36px] font-bold text-white leading-[1.15] max-w-[420px] drop-shadow-lg">
          Build, Ship and Scale Your Projects.
        </h2>
        <div className="flex gap-3 mt-7">
          <button className="px-7 py-2.5 rounded-2xl border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm text-sm font-semibold hover:bg-white/20 transition-all">
            Explore
          </button>
          <button className="px-7 py-2.5 rounded-2xl bg-white text-purple-600 text-sm font-semibold hover:bg-white/90 transition-all shadow-lg shadow-black/20">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
