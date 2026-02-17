import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import HeroBanner from "@/components/HeroBanner";
import StatsCards from "@/components/StatsCards";
import NFTCards from "@/components/NFTCards";
import TopCreators from "@/components/TopCreators";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="ml-[240px] flex-1 py-6 px-8 bg-white">
        <TopNav />
        <div className="flex gap-6 mt-2">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            <HeroBanner />
            <NFTCards />
          </div>
          {/* Right column */}
          <div className="w-[300px] shrink-0 space-y-4">
            <StatsCards />
            <TopCreators />
          </div>
        </div>
      </main>
    </div>
  );
}
