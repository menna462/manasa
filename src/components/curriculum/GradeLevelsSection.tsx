"use client";

import React from "react";
import { GraduationCap, Plus, Pencil, Trash2, LayoutGrid } from "lucide-react";
import { GradeLevel } from "@/types/curriculum";

interface GradeLevelsSectionProps {
  grades: GradeLevel[];
  activeGradeId: string;
  onSelectGrade: (id: string) => void;
  onAddGrade: () => void;
  onEditGrade: (grade: GradeLevel) => void;
  onDeleteGrade: (id: string) => void;
}

export const GradeLevelsSection: React.FC<GradeLevelsSectionProps> = ({
  grades,
  activeGradeId,
  onSelectGrade,
  onAddGrade,
  onEditGrade,
  onDeleteGrade,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] my-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6A00] shrink-0">
            <GraduationCap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900 text-base sm:text-lg">
              المراحل الدراسية والكورسات المتاحة
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              اختر المرحلة لإدارة وحداتها ومحاضراتها، أو أضف مرحلة جديدة بضغطة زر
            </p>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={onAddGrade}
            className="bg-black hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>إضافة مرحلة دراسية جديدة</span>
          </button>
        </div>
      </div>

      {/* 3 Grade Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        {grades.map((grade) => {
          const isActive = grade.id === activeGradeId;

          return (
            <div
              key={grade.id}
              className={`rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isActive
                  ? "bg-white border-2 border-[#FF6A00] shadow-[0_6px_25px_rgba(255,106,0,0.08)]"
                  : "bg-white border border-gray-200/80 hover:border-gray-300 shadow-xs hover:shadow-md"
              }`}
            >
              <div>
                {/* Card Top Row: Badge & Action icons */}
                <div className="flex items-center justify-between">
                  {/* Status Badge */}
                  <div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-[#FF6A00] border border-orange-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
                        <span>قيد التعديل الآن</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">
                        {grade.statusText}
                      </span>
                    )}
                  </div>

                  {/* Edit & Delete Icons */}
                  <div className="flex items-center gap-1 text-gray-400">
                    <button
                      type="button"
                      onClick={() => onEditGrade(grade)}
                      className="p-1 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      title="تعديل بيانات المرحلة"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteGrade(grade.id)}
                      className="p-1 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="حذف المرحلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="text-center mt-3">
                  <h3 className="font-extrabold text-gray-900 text-base">
                    {grade.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 px-2 min-h-[32px]">
                    {grade.subtitle}
                  </p>
                </div>

                {/* Stats Box */}
                <div className="bg-[#F8F9FA] rounded-xl p-3 my-4 grid grid-cols-3 text-center border border-gray-100">
                  <div>
                    <span className="block text-base font-extrabold text-gray-900">
                      {grade.unitsCount}
                    </span>
                    <span className="block text-[11px] text-gray-500 font-medium">
                      وحدات
                    </span>
                  </div>

                  <div className="border-x border-gray-200/60">
                    <span
                      className={`block text-base font-extrabold ${
                        isActive ? "text-[#FF6A00]" : "text-gray-900"
                      }`}
                    >
                      {grade.lessonsCount}
                    </span>
                    <span className="block text-[11px] text-gray-500 font-medium">
                      محاضرة
                    </span>
                  </div>

                  <div>
                    <span className="block text-base font-extrabold text-gray-900">
                      {grade.pdfCount}
                    </span>
                    <span className="block text-[11px] text-gray-500 font-medium">
                      ملازم
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => onSelectGrade(grade.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#FF6A00] hover:bg-[#E55F00] text-white shadow-sm shadow-orange-200 active:scale-[0.98]"
                      : "bg-[#F1F3F5] hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>إدارة منهج الكورس والدروس</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
