"use client";

import React from "react";
import { LogOut, User } from "lucide-react";

interface NavbarProps {
  onLogout?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLogout,
  activeTab = "curriculum",
  setActiveTab,
}) => {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="h-16 flex items-center justify-between">
          {/* Right Section: Brand & Name & Role */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">
                عماد حسين
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00] inline-block" />
            </div>

            <span className="text-gray-300 mx-1 hidden sm:inline">|</span>

            <span className="text-gray-600 text-xs sm:text-sm font-medium hidden sm:inline-block">
              لوحة تحكم المنصة (الأدمن)
            </span>

            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              أدمن معتمد
            </span>
          </div>

          {/* Left Section: User Profile & Logout */}
          <div className="flex items-center gap-5">
            {/* Admin Profile Box */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-[#FF6A00] flex items-center justify-center text-white shadow-xs"
                title="الملف الشخصي"
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-gray-900 leading-tight">
                  م/ عماد حسين
                </span>
                <span className="block text-[11px] text-gray-400 font-medium leading-none mt-0.5">
                  صلاحيات كاملة
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-xs sm:text-sm font-semibold group cursor-pointer"
              title="تسجيل الخروج"
            >
              <span>تسجيل الخروج</span>
              <LogOut className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Sub-bar: Main Navigation Tabs Row */}
        <div className="flex items-center justify-start gap-2 py-2.5 border-t border-gray-50 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab?.("codes")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "codes"
                ? "bg-[#FF6A00] text-white shadow-sm shadow-orange-200"
                : "text-gray-600 hover:text-black hover:bg-gray-100"
            }`}
          >
            توليد وإدارة الأكواد
          </button>

          <button
            onClick={() => setActiveTab?.("curriculum")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "curriculum"
                ? "bg-[#FF6A00] text-white shadow-sm shadow-orange-200"
                : "text-gray-600 hover:text-black hover:bg-gray-100"
            }`}
          >
            إدارة المنهج والدروس
          </button>

          <button
            onClick={() => setActiveTab?.("stats")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "stats"
                ? "bg-[#FF6A00] text-white shadow-sm shadow-orange-200"
                : "text-gray-600 hover:text-black hover:bg-gray-100"
            }`}
          >
            الإحصائيات والتقارير
          </button>

          <button
            onClick={() => setActiveTab?.("admin")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "admin"
                ? "bg-[#FF6A00] text-white shadow-sm shadow-orange-200"
                : "text-gray-600 hover:text-black hover:bg-gray-100"
            }`}
          >
            إدارة الأدمن وفريق العمل
          </button>
        </div>
      </div>
    </header>
  );
};
