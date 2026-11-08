"use client";

import React from "react";
import { CurriculumStats } from "@/types/curriculum";

interface CurriculumHeaderStatsProps {
  stats: CurriculumStats;
}

export const CurriculumHeaderStats: React.FC<CurriculumHeaderStatsProps> = ({
  stats,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] my-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      {/* Right Column: Title and Description */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-[#FF6A00] rounded-full" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            إدارة المنهج والوحدات والدروس
          </h1>
        </div>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-xl leading-relaxed pr-4">
          تنظيم وتنسيق المناهج الدراسية، رفع المحاضرات ومذكرات الشرح لجميع المراحل الثانوية بدقة وسلاسة.
        </p>
      </div>

      {/* Left Column: 4 Stat Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
        {/* Stat 1: مراحل دراسية */}
        <div className="bg-[#F8F9FA] hover:bg-gray-100/80 transition-colors border border-gray-200/60 rounded-2xl px-5 py-3 text-center min-w-[95px]">
          <span className="block text-2xl font-extrabold text-gray-900 leading-tight">
            {stats.gradesCount}
          </span>
          <span className="block text-[11px] text-gray-500 font-medium mt-0.5">
            مراحل دراسية
          </span>
        </div>

        {/* Stat 2: وحدة تعليمية */}
        <div className="bg-[#F8F9FA] hover:bg-gray-100/80 transition-colors border border-gray-200/60 rounded-2xl px-5 py-3 text-center min-w-[95px]">
          <span className="block text-2xl font-extrabold text-gray-900 leading-tight">
            {stats.unitsCount}
          </span>
          <span className="block text-[11px] text-gray-500 font-medium mt-0.5">
            وحدة تعليمية
          </span>
        </div>

        {/* Stat 3: درس ومحاضرة (Orange highlight!) */}
        <div className="bg-[#F8F9FA] hover:bg-gray-100/80 transition-colors border border-gray-200/60 rounded-2xl px-5 py-3 text-center min-w-[95px]">
          <span className="block text-2xl font-extrabold text-[#FF6A00] leading-tight">
            {stats.lessonsCount}
          </span>
          <span className="block text-[11px] text-gray-500 font-medium mt-0.5">
            درس ومحاضرة
          </span>
        </div>

        {/* Stat 4: ملزمة PDF */}
        <div className="bg-[#F8F9FA] hover:bg-gray-100/80 transition-colors border border-gray-200/60 rounded-2xl px-5 py-3 text-center min-w-[95px]">
          <span className="block text-2xl font-extrabold text-gray-900 leading-tight">
            {stats.pdfCount}
          </span>
          <span className="block text-[11px] text-gray-500 font-medium mt-0.5">
            ملزمة PDF
          </span>
        </div>
      </div>
    </div>
  );
};
