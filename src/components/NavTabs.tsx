"use client";

import React from "react";
import { Zap, BookOpen, BarChart3 } from "lucide-react";

interface NavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const NavTabs: React.FC<NavTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 my-3 scrollbar-none">
      <button
        onClick={() => setActiveTab("codes")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
          activeTab === "codes"
            ? "bg-[#FF6A00] text-white shadow-orange-200"
            : "bg-white text-gray-700 hover:text-black hover:bg-gray-50 border border-gray-200"
        }`}
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>توليد وإدارة الأكواد</span>
      </button>

      <button
        onClick={() => setActiveTab("curriculum")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          activeTab === "curriculum"
            ? "bg-[#FF6A00] text-white shadow-orange-200 font-bold"
            : "bg-transparent text-gray-600 hover:text-black hover:bg-gray-100"
        }`}
      >
        <BookOpen className="w-4 h-4" />
        <span>إدارة المنهج والدروس</span>
      </button>

      <button
        onClick={() => setActiveTab("stats")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          activeTab === "stats"
            ? "bg-[#FF6A00] text-white shadow-orange-200 font-bold"
            : "bg-transparent text-gray-600 hover:text-black hover:bg-gray-100"
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        <span>الإحصائيات والتقارير</span>
      </button>
    </div>
  );
};
