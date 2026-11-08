"use client";

import React, { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  Calendar,
  FileDown,
  Check,
} from "lucide-react";
import { TimeRangeFilter } from "@/types/analytics";

interface AnalyticsToolbarProps {
  selectedGrade: string;
  onSelectGrade: (grade: string) => void;
  timeRange: TimeRangeFilter;
  onTimeRangeChange: (range: TimeRangeFilter) => void;
  onExport: () => void;
}

export const AnalyticsToolbar: React.FC<AnalyticsToolbarProps> = ({
  selectedGrade,
  onSelectGrade,
  timeRange,
  onTimeRangeChange,
  onExport,
}) => {
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);

  const gradeOptions = [
    "الصف الثالث الثانوي (العام)",
    "الصف الثاني الثانوي (العام)",
    "الصف الأول الثانوي (العام)",
    "جميع الصفوف الدراسية",
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-2xs mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Right Side: Action Button + Grade Dropdown + Time Range Tabs */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Orange Badge Button: التقارير والإحصائيات */}
        <div className="bg-[#FF6A00] text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-orange-300/40 select-none">
          <BarChart3 className="w-4 h-4 stroke-[2.5]" />
          <span>التقارير والإحصائيات</span>
        </div>

        {/* Grade Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsGradeDropdownOpen(!isGradeDropdownOpen)}
            className="bg-[#F8F9FA] hover:bg-gray-100 text-gray-800 border border-gray-200/80 font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>{selectedGrade}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {isGradeDropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              {gradeOptions.map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => {
                    onSelectGrade(grade);
                    setIsGradeDropdownOpen(false);
                  }}
                  className={`w-full text-right px-4 py-2 text-xs font-bold flex items-center justify-between hover:bg-orange-50/60 transition-colors cursor-pointer ${
                    selectedGrade === grade
                      ? "text-[#FF6A00] bg-orange-50/40"
                      : "text-gray-700"
                  }`}
                >
                  <span>{grade}</span>
                  {selectedGrade === grade && (
                    <Check className="w-3.5 h-3.5 text-[#FF6A00]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center bg-[#F1F3F5] p-1 rounded-xl text-xs font-bold text-gray-600">
          <button
            type="button"
            onClick={() => onTimeRangeChange("today")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeRange === "today"
                ? "bg-white text-gray-900 shadow-xs font-extrabold"
                : "hover:text-gray-900"
            }`}
          >
            اليوم
          </button>

          <button
            type="button"
            onClick={() => onTimeRangeChange("week")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeRange === "week"
                ? "bg-white text-gray-900 shadow-xs font-extrabold"
                : "hover:text-gray-900"
            }`}
          >
            هذا الأسبوع
          </button>

          <button
            type="button"
            onClick={() => onTimeRangeChange("month")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeRange === "month"
                ? "bg-white text-gray-900 shadow-xs font-extrabold"
                : "hover:text-gray-900"
            }`}
          >
            هذا الشهر
          </button>

          <button
            type="button"
            onClick={() => onTimeRangeChange("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              timeRange === "all"
                ? "bg-white text-gray-900 shadow-xs font-extrabold"
                : "hover:text-gray-900"
            }`}
          >
            المدى الكلي
          </button>
        </div>
      </div>

      {/* Left Side: Date Range Input + Black Export Button */}
      <div className="flex items-center gap-2.5 self-end lg:self-auto flex-wrap sm:flex-nowrap">
        {/* Date Display Box */}
        <div className="bg-white border border-gray-200/90 text-gray-700 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>1 مايو 2024 - 31 مايو 2024</span>
        </div>

        {/* Black Export Report Button */}
        <button
          type="button"
          onClick={onExport}
          className="bg-[#111827] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <FileDown className="w-4 h-4" />
          <span>تصدير تقرير (PDF / Excel)</span>
        </button>
      </div>
    </div>
  );
};
