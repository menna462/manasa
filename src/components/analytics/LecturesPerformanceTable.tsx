"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  PlayCircle,
  FlaskConical,
  Atom,
  Calculator,
  Flame,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { LecturePerformanceItem } from "@/types/analytics";
import { lecturesPerformanceList } from "@/data/analyticsData";

interface LecturesPerformanceTableProps {
  data?: LecturePerformanceItem[];
  onRowClick?: (lecture: LecturePerformanceItem) => void;
  selectedGrade?: string;
}

export const LecturesPerformanceTable: React.FC<LecturesPerformanceTableProps> = ({
  data,
  onRowClick,
  selectedGrade,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"engagement" | "codes" | "completion">("engagement");

  const ITEMS_PER_PAGE = 5;

  // Use API data if provided, else fall back to mock data
  const sourceList = data && data.length > 0 ? data : lecturesPerformanceList;

  const filteredLectures = useMemo(() => {
    let result = sourceList.filter((item) => {
      // Grade filter
      if (selectedGrade && !selectedGrade.includes("جميع")) {
        const gradeClean = selectedGrade.replace(" (العام)", "").trim();
        if (!item.grade.includes(gradeClean)) {
          return false;
        }
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.part.toLowerCase().includes(q) ||
        item.grade.toLowerCase().includes(q)
      );
    });

    if (sortBy === "engagement") {
      result = [...result].sort((a, b) => b.completionRate - a.completionRate);
    } else if (sortBy === "codes") {
      result = [...result].sort((a, b) => b.activatedCodes - a.activatedCodes);
    }

    return result;
  }, [sourceList, searchQuery, sortBy, selectedGrade]);

  const totalPages = Math.max(1, Math.ceil(filteredLectures.length / ITEMS_PER_PAGE));
  const paginatedLectures = filteredLectures.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Status Badge Renderer
  const renderStatusBadge = (status: LecturePerformanceItem["popularityStatus"], text: string) => {
    switch (status) {
      case "exceptional":
        return (
          <span className="bg-[#FF6A00] text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-2xs inline-block">
            {text}
          </span>
        );
      case "very_good":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/90 text-[11px] font-bold px-3 py-1 rounded-full inline-block">
            {text}
          </span>
        );
      case "excellent":
        return (
          <span className="bg-emerald-50/70 text-emerald-600 border border-emerald-100 text-[11px] font-bold px-3 py-1 rounded-full inline-block">
            {text}
          </span>
        );
      case "high_replay":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200/90 text-[11px] font-bold px-3 py-1 rounded-full inline-block">
            {text}
          </span>
        );
      case "good":
      default:
        return (
          <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-3 py-1 rounded-full inline-block">
            {text}
          </span>
        );
    }
  };

  // Row Icon Renderer
  const renderRowIcon = (index: number) => {
    switch (index % 5) {
      case 0:
        return (
          <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6A00] shrink-0">
            <PlayCircle className="w-4 h-4 stroke-[2.2]" />
          </div>
        );
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
            <Atom className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 shrink-0">
            <Flame className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden mb-6">
      {/* Header & Controls Toolbar */}
      <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
            أداء المحاضرات ومعدلات إكمال المشاهدة
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            تحليل مفصل لتفاعل الطلاب مع كل درس تم رفعه على المنصة
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSortBy(sortBy === "engagement" ? "codes" : "engagement")}
            className="bg-[#F8F9FA] hover:bg-gray-100 text-gray-700 border border-gray-200/80 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            <span>{sortBy === "engagement" ? "الأعلى تفاعلاً" : "الأكثر أكواداً"}</span>
          </button>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="البحث عن درس أو وحدة..."
              className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl pr-9 pl-3 py-2 text-xs font-semibold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all text-right"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {paginatedLectures.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm font-bold">
            {searchQuery ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد محاضرات بعد. أضف محاضرات من تبويب المنهج."}
          </div>
        ) : (
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA]/80 border-b border-gray-100 text-gray-500 text-[11px] font-bold">
                <th className="py-3 px-5 whitespace-nowrap">اسم الدرس والمحاضرة</th>
                <th className="py-3 px-5 text-center whitespace-nowrap">الأكواد المفعلة</th>
                <th className="py-3 px-5 text-center whitespace-nowrap">نسبة إكمال المشاهدة</th>
                <th className="py-3 px-5 text-center whitespace-nowrap">مرات إعادة المشاهدة</th>
                <th className="py-3 px-5 text-center whitespace-nowrap">متوسط مدة الحضور</th>
                <th className="py-3 px-5 text-center whitespace-nowrap">حالة الإقبال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {paginatedLectures.map((lecture, index) => {
                const isOrangeBar = lecture.completionRate >= 70;
                const absoluteIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;

                return (
                  <tr
                    key={lecture.id}
                    onClick={() => onRowClick?.(lecture)}
                    className="hover:bg-orange-50/20 transition-colors cursor-pointer group"
                  >
                    {/* Column 1: Title & Metadata */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {renderRowIcon(absoluteIndex)}
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-xs sm:text-sm group-hover:text-[#FF6A00] transition-colors leading-snug">
                            {lecture.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                            <span className="text-orange-600 font-bold">
                              {lecture.grade}
                            </span>
                            <span>•</span>
                            <span>المدة: {lecture.duration} دقيقة</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Activated Codes */}
                    <td className="py-4 px-5 text-center font-extrabold text-gray-900 whitespace-nowrap">
                      {lecture.activatedCodes.toLocaleString()} كود
                    </td>

                    {/* Column 3: Completion Rate with Progress Bar */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2.5 max-w-[170px] mx-auto">
                        <span className="font-extrabold text-gray-900 text-xs min-w-[32px] text-right">
                          {lecture.completionRate}%
                        </span>
                        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isOrangeBar ? "bg-[#FF6A00]" : "bg-gray-800"
                            }`}
                            style={{ width: `${lecture.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Column 4: Replay Count */}
                    <td className="py-4 px-5 text-center font-bold text-gray-700 whitespace-nowrap">
                      {lecture.replayCount.toLocaleString()} مرة
                    </td>

                    {/* Column 5: Average Attendance Duration */}
                    <td className="py-4 px-5 text-center font-bold text-gray-700 whitespace-nowrap">
                      {lecture.avgWatchMinutes} دقيقة
                    </td>

                    {/* Column 6: Popularity Status */}
                    <td className="py-4 px-5 text-center whitespace-nowrap">
                      {renderStatusBadge(lecture.popularityStatus, lecture.popularityText)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination & Footer Counter */}
      <div className="p-4 sm:px-6 bg-gray-50/60 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
        {/* Pagination Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
                page === currentPage
                  ? "bg-[#FF6A00] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Counter text */}
        <span className="text-xs font-bold text-gray-400">
          عرض {Math.min(paginatedLectures.length, ITEMS_PER_PAGE)} من أصل {filteredLectures.length} محاضرة
        </span>
      </div>
    </div>
  );
};
