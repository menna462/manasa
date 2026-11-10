"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  ArrowUpDown,
  Folder,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  GripVertical,
  Clock,
  HardDrive,
  Eye,
  FileText,
  HelpCircle,
  Link2,
} from "lucide-react";
import { GradeLevel, UnitItem, LessonItem } from "@/types/curriculum";

interface CurriculumHierarchySectionProps {
  activeGrade: GradeLevel;
  onAddUnitOrLesson: () => void;
  onSaveOrder: () => void;
  onAddLessonToUnit: (unitId: string) => void;
  onEditLesson: (lesson: LessonItem, unitId: string) => void;
  onDeleteLesson: (lessonId: string, unitId: string) => void;
}

export const CurriculumHierarchySection: React.FC<CurriculumHierarchySectionProps> = ({
  activeGrade,
  onAddUnitOrLesson,
  onSaveOrder,
  onAddLessonToUnit,
  onEditLesson,
  onDeleteLesson,
}) => {
  // Track expanded units
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    "u1-g3": true, // First unit expanded by default matching screenshot
  });

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: !prev[unitId],
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.02)] my-5">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        {/* Right Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shrink-0 shadow-sm shadow-orange-300">
            <Layers className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-gray-900 text-base sm:text-lg">
                هيكلية منهج: {activeGrade.title}
              </h2>
              <span className="bg-orange-50 text-[#FF6A00] text-[11px] font-bold px-2 py-0.5 rounded-full border border-orange-200/80">
                المرحلة النشطة
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              استعراض وتعديل الدروس والوحدات وترتيب التسلسل للطلاب
            </p>
          </div>
        </div>

        {/* Left Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* إضافة وحدة / درس جديد */}
          <button
            type="button"
            onClick={onAddUnitOrLesson}
            className="bg-[#FF6A00] hover:bg-[#E55F00] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm shadow-orange-200 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>إضافة وحدة / درس جديد</span>
          </button>

          {/* حفظ ترتيب المنهج */}
          <button
            type="button"
            onClick={onSaveOrder}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-600" />
            <span>حفظ ترتيب المنهج</span>
          </button>
        </div>
      </div>

      {/* Accordion List of Units */}
      <div className="space-y-4 mt-6">
        {activeGrade.units.map((unit) => {
          const isExpanded = !!expandedUnits[unit.id];

          return (
            <div
              key={unit.id}
              className="border border-gray-200/80 rounded-2xl overflow-hidden transition-all bg-white"
            >
              {/* Unit Header Bar */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:bg-gray-50/50 transition-colors">
                {/* Right: Folder Icon + Title + Badge */}
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => toggleUnit(unit.id)}
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF6A00] shrink-0">
                    <Folder className="w-4 h-4 fill-orange-100" />
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                      {unit.title}
                    </h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {isExpanded
                        ? `${unit.lessonsCount} دروس • ${unit.pdfCount || 3} ملازم PDF`
                        : `${unit.lessonsCount} دروس • قابل للتوسيع`}
                    </span>
                  </div>
                </div>

                {/* Left: Action Buttons & Expand Toggle */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* إضافة درس */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddLessonToUnit(unit.id);
                    }}
                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>إضافة درس</span>
                  </button>

                  {/* تعديل الوحدة */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`تعديل ${unit.title}`);
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer"
                    title="تعديل اسم الوحدة"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Accordion Chevron Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleUnit(unit.id)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer"
                    aria-label={isExpanded ? "طي الوحدة" : "توسيع الوحدة"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Unit Content: Lessons List (Visible when expanded) */}
              {isExpanded && (
                <div className="p-4 pt-1 border-t border-gray-100 bg-[#FAFAFA]/60 space-y-3">
                  {unit.lessons.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 text-xs">
                      لا توجد محاضرات في هذه الوحدة حتى الآن. انقر على "+ إضافة درس".
                    </div>
                  ) : (
                    unit.lessons.map((lesson) => {
                      const isFirst = lesson.orderNumber === 1;

                      return (
                        <div
                          key={lesson.id}
                          className="bg-white rounded-xl p-3.5 border border-gray-200/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-gray-300 transition-all"
                        >
                          {/* Right Side: Drag Handle, Number Badge, Title, Metadata */}
                          <div className="flex items-center gap-3 flex-1 flex-wrap sm:flex-nowrap">
                            {/* Drag handle */}
                            <div className="cursor-grab text-gray-300 hover:text-gray-500">
                              <GripVertical className="w-4 h-4" />
                            </div>

                            {/* Order Number Badge (Orange for #1, gray for others) */}
                            <div
                              className={`w-6 h-6 rounded-md font-extrabold text-xs flex items-center justify-center shrink-0 ${
                                isFirst
                                  ? "bg-[#FF6A00] text-white"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {lesson.orderNumber}
                            </div>

                            {/* Title & Metadata */}
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                                {lesson.title}
                              </h4>

                              {/* Metadata Badges */}
                              <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 flex-wrap">
                                {/* Duration */}
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{lesson.duration}</span>
                                </div>

                                {/* Size / Source */}
                                <div className="flex items-center gap-1">
                                  {lesson.videoSource === "external" ? (
                                    <>
                                      <Link2 className="w-3.5 h-3.5 text-orange-500" />
                                      <span className="text-orange-600 font-semibold">{lesson.size || "رابط خارجي"}</span>
                                    </>
                                  ) : (
                                    <>
                                      <HardDrive className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{lesson.size}</span>
                                    </>
                                  )}
                                </div>

                                {/* Views if available */}
                                {lesson.viewsCount && (
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{lesson.viewsCount}</span>
                                  </div>
                                )}

                                {/* PDF attached */}
                                {lesson.hasPdf && (
                                  <a
                                    href={lesson.pdfUrl || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => {
                                      if (!lesson.pdfUrl) {
                                        e.preventDefault();
                                        alert("لم يتم رفع ملف PDF لهذا الدرس بعد.");
                                      }
                                    }}
                                    className="flex items-center gap-1 text-emerald-700 font-semibold hover:text-emerald-900 hover:underline cursor-pointer transition-colors"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>{lesson.pdfTitle || "ملزمة PDF مدمجة"}</span>
                                  </a>
                                )}

                                {/* Quiz attached */}
                                {lesson.hasQuiz && (
                                  <div className="flex items-center gap-1 text-orange-600 font-semibold">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                    <span>{lesson.quizTitle || "كويز إلكتروني مدمج"}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Left Side: Status Badge & Actions */}
                          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                            {/* Status Badge */}
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-full">
                              منشور ومفعل
                            </span>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => onEditLesson(lesson, unit.id)}
                              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5 text-gray-500" />
                              <span>تعديل</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => onDeleteLesson(lesson.id, unit.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                              title="حذف المحاضرة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
