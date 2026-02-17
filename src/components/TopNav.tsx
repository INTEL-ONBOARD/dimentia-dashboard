"use client";
import { Search, Bell } from "lucide-react";
import { useState } from "react";

export default function TopNav() {
  const [role, setRole] = useState<"User" | "Creator">("User");

  return (
    <header className="flex items-center justify-between mb-6">
      {/* Search */}
      <div className="relative w-[400px]">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects, teams and more.."
          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-200 transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Role toggle */}
        <div className="flex bg-gray-50 border border-gray-100 rounded-2xl p-1">
          {(["User", "Creator"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                role === r
                  ? "bg-white shadow-sm text-violet-600 border border-violet-200"
                  : "text-gray-400 border border-transparent"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Notification bell */}
        <button className="relative w-11 h-11 rounded-2xl border border-gray-100 bg-white flex items-center justify-center hover:bg-gray-50 transition-all">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-2.5 right-3 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white shadow-sm" />
      </div>
    </header>
  );
}
