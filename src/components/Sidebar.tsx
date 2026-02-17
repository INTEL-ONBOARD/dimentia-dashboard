"use client";
import {
  LayoutDashboard,
  Store,
  Activity,
  Briefcase,
  Wallet,
  Heart,
  Clock,
  Settings,
  Sun,
  Moon,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Store, label: "Marketplace" },
  { icon: Activity, label: "Analytics" },
];

const profileItems = [
  { icon: Briefcase, label: "My Projects" },
  { icon: Wallet, label: "Billing" },
  { icon: Heart, label: "Favourites" },
  { icon: Clock, label: "History" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar() {
  const [lightMode, setLightMode] = useState(true);

  return (
    <aside className="w-[240px] h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-7 px-5 fixed left-0 top-0 overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-violet-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">Apex.</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Open Framework</p>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                item.active
                  ? "text-violet-600 bg-violet-50"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <item.icon size={18} strokeWidth={item.active ? 2.2 : 1.8} />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Profile */}
        <p className="text-[10px] font-bold text-gray-300 tracking-[0.15em] uppercase mt-8 mb-2 px-3">
          Profile
        </p>
        <nav className="space-y-0.5">
          {profileItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
            >
              <item.icon size={18} strokeWidth={1.8} />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Other */}
        <p className="text-[10px] font-bold text-gray-300 tracking-[0.15em] uppercase mt-8 mb-2 px-3">
          Other
        </p>
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-3 text-[13px] font-medium text-gray-500">
            <Moon size={18} strokeWidth={1.8} />
            Light Mode
          </div>
          <button
            onClick={() => setLightMode(!lightMode)}
            className="flex items-center bg-gray-100 rounded-full p-[3px]"
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                lightMode ? "bg-white shadow-sm text-violet-600" : "text-gray-400"
              }`}
            >
              <Sun size={11} />
            </span>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                !lightMode ? "bg-white shadow-sm text-violet-600" : "text-gray-400"
              }`}
            >
              <Moon size={11} />
            </span>
          </button>
        </div>
      </div>

      {/* Plan Card */}
      <div className="mt-6 rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)" }}>
        <div className="relative">
          <p className="text-[11px] text-violet-200 font-medium">Current Plan</p>
          <p className="text-[28px] font-bold mt-1 leading-none">Pro</p>
          <div className="flex items-center gap-1.5 mt-2 text-[13px] text-violet-200">
            12 days remaining
          </div>
          <button className="mt-5 w-full flex items-center justify-between bg-white/15 hover:bg-white/25 transition-all rounded-xl px-4 py-3 text-[13px] font-semibold">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowUpRight size={13} />
              </div>
              Upgrade Plan
            </div>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
