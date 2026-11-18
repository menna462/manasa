"use client";

import React, { useState, useEffect } from "react";
import { Plus, Zap, BookOpen, Layers } from "lucide-react";
import { CodeItem } from "@/types/dashboard";
import { GradeLevel } from "@/types/curriculum";
import { codesApi, curriculumApi } from "@/lib/api";

export interface FlatLessonOption {
  id: string;
  title: string;
  unitTitle?: string;
  gradeTitle: string;
  formattedTitle?: string;
  duration?: string;
  type?: "lesson" | "unit";
  lessonsCount?: number;
}

interface GenerateFormProps {
  onGenerate: (newCodes: CodeItem[], count: number) => void;
  lessons?: FlatLessonOption[];
  units?: FlatLessonOption[];
  isLoadingLessons?: boolean;
}

export const GenerateForm: React.FC<GenerateFormProps> = ({
  onGenerate,
  lessons: externalLessons,
  units: externalUnits,
  isLoadingLessons: externalLoading,
}) => {
  const [count, setCount] = useState<number>(50);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [groupName, setGroupName] = useState<string>("");
  // selectedValue format: "lesson:ID" or "unit:ID" or "" (general)
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [internalLessons, setInternalLessons] = useState<FlatLessonOption[]>([]);
  const [internalUnits, setInternalUnits] = useState<FlatLessonOption[]>([]);
  const [isInternalLoading, setIsInternalLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use external data if provided, otherwise internal
  const lessonOptions = externalLessons !== undefined ? externalLessons : internalLessons;
  const unitOptions = externalUnits !== undefined ? externalUnits : internalUnits;
  const isLoading = externalLoading !== undefined ? externalLoading : isInternalLoading;

  // Fallback: load curriculum directly if no external data provided
  useEffect(() => {
    if (externalLessons !== undefined) return;

    const fetchCurriculum = async () => {
      try {
        setIsInternalLoading(true);
        const res = await curriculumApi.getFlatLessons();
        if (res.data && Array.isArray(res.data)) {
          setInternalLessons(res.data.map((l: FlatLessonOption) => ({ ...l, type: l.type || "lesson" })));
        }
        // Also load units if available
        if (res.units && Array.isArray(res.units)) {
          setInternalUnits(res.units.map((u: FlatLessonOption) => ({ ...u, type: "unit" })));
        } else {
          // Fallback to tree if flat endpoint doesn't return units
          const treeRes = await curriculumApi.getTree();
          if (treeRes.data && Array.isArray(treeRes.data)) {
            const flatLessons: FlatLessonOption[] = [];
            const flatUnits: FlatLessonOption[] = [];
            treeRes.data.forEach((grade: GradeLevel) => {
              (grade.units || []).forEach((unit) => {
                flatUnits.push({
                  id: String(unit.id),
                  title: unit.title,
                  unitTitle: unit.title,
                  gradeTitle: grade.title,
                  formattedTitle: `${grade.title} ◄ ${unit.title} (${unit.lessons?.length || 0} دروس)`,
                  type: "unit",
                  lessonsCount: unit.lessons?.length || 0,
                });
                (unit.lessons || []).forEach((lesson) => {
                  flatLessons.push({
                    id: String(lesson.id),
                    title: lesson.title,
                    unitTitle: unit.title,
                    gradeTitle: grade.title,
                    formattedTitle: `${grade.title} ◄ ${lesson.title}`,
                    duration: lesson.duration,
                    type: "lesson",
                  });
                });
              });
            });
            setInternalLessons(flatLessons);
            setInternalUnits(flatUnits);
          }
        }
      } catch {
        // silent fail
      } finally {
        setIsInternalLoading(false);
      }
    };

    fetchCurriculum();
  }, [externalLessons]);

  // Keep selected value synced with available options
  useEffect(() => {
    if (selectedValue) {
      const [type, id] = selectedValue.split(":");
      if (type === "lesson" && !lessonOptions.some((opt) => opt.id === id)) {
        setSelectedValue("");
      } else if (type === "unit" && !unitOptions.some((opt) => opt.id === id)) {
        setSelectedValue("");
      }
    }
  }, [lessonOptions, unitOptions, selectedValue]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("يرجى إدخال اسم المجموعة أو ملاحظات السنتر");
      return;
    }
    if (count <= 0) {
      alert("يرجى إدخال عدد أكواد صحيح");
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse selected value
      let lessonId: number | undefined;
      let unitId: number | undefined;

      if (selectedValue) {
        const [type, id] = selectedValue.split(":");
        if (type === "lesson") {
          lessonId = Number(id);
        } else if (type === "unit") {
          unitId = Number(id);
        }
      }

      const res = await codesApi.generate({
        count,
        groupName: groupName.trim(),
        validityDays: validityDays || 30,
        lessonId,
        unitId,
      });

      if (res.data) {
        onGenerate(res.data, count);
      }
      setGroupName("");
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء توليد الأكواد في الخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine the selected scope label for the badge
  const getScopeBadge = () => {
    if (!selectedValue) return { label: "كود عام", color: "bg-gray-100 text-gray-600" };
    const [type] = selectedValue.split(":");
    if (type === "unit") return { label: "وحدة كاملة", color: "bg-indigo-50 text-indigo-700" };
    return { label: "درس محدد", color: "bg-orange-50 text-[#FF6A00]" };
  };

  const scopeBadge = getScopeBadge();

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] my-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white shrink-0">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#111827] text-base">
              توليد دفعة أكواد جديدة
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              حدد الوحدة أو المحاضرة المستهدفة والمعايير التالية لتوليد بطاقات الدخول فورياً
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-lg border ${scopeBadge.color}`}>
            {scopeBadge.label}
          </span>
          <span className="inline-block bg-orange-50 text-[#FF6A00] text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-orange-200/60">
            صيغة الكود: XXXXXXXX
          </span>
        </div>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Content Selection, Count, Validity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* 1. اختيار المحتوى المرتبط بالكود */}
          <div className="lg:col-span-6">
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FF6A00]" />
                المحتوى المرتبط بالكود (وحدة أو درس) <span className="text-[#FF6A00]">*</span>
              </span>
            </label>
            <div className="bg-[#F1F3F5] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#FF6A00] focus-within:bg-white transition-all">
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent text-gray-900 font-semibold focus:outline-hidden text-xs sm:text-sm cursor-pointer"
              >
                {isLoading ? (
                  <option value="">جاري تحميل المنهج...</option>
                ) : (
                  <>
                    <option value="">— كود تفعيل عام (غير مقيد بوحدة أو درس محدد) —</option>

                    {/* قسم الوحدات */}
                    {unitOptions.length > 0 && (
                      <optgroup label="📦 الوحدات (تفعيل الوحدة بكل دروسها)">
                        {unitOptions.map((opt) => (
                          <option key={`unit:${opt.id}`} value={`unit:${opt.id}`}>
                            🔷 {opt.formattedTitle || `${opt.gradeTitle} ◄ ${opt.title}`}
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {/* قسم الدروس الفردية */}
                    {lessonOptions.length > 0 && (
                      <optgroup label="📖 الدروس الفردية (تفعيل درس واحد فقط)">
                        {lessonOptions.map((opt) => (
                          <option key={`lesson:${opt.id}`} value={`lesson:${opt.id}`}>
                            {opt.formattedTitle || `${opt.gradeTitle} ◄ ${opt.title}`}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* 2. عدد الأكواد المطلوبة */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              عدد الأكواد المطلوبة <span className="text-[#FF6A00]">*</span>
            </label>
            <div className="bg-[#F1F3F5] rounded-xl px-4 py-2 flex items-center justify-between border border-transparent focus-within:border-[#FF6A00] focus-within:bg-white transition-all">
              <span className="text-xs font-medium text-gray-400 select-none">
                كود
              </span>
              <input
                type="number"
                min="1"
                max="5000"
                value={count || ""}
                onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-center font-bold text-gray-900 focus:outline-hidden text-sm"
              />
            </div>
          </div>

          {/* 3. مدة الصلاحية بالأيام */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              مدة الصلاحية بالأيام <span className="text-[#FF6A00]">*</span>
            </label>
            <div className="bg-[#F1F3F5] rounded-xl px-4 py-2 flex items-center justify-between border border-transparent focus-within:border-[#FF6A00] focus-within:bg-white transition-all">
              <span className="text-xs font-medium text-gray-400 select-none">
                يوم
              </span>
              <input
                type="number"
                min="1"
                max="365"
                value={validityDays || ""}
                onChange={(e) => setValidityDays(parseInt(e.target.value) || 0)}
                className="w-full bg-transparent text-center font-bold text-gray-900 focus:outline-hidden text-sm"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Group Name / Notes + Submit Button */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
          {/* 4. اسم المجموعة / ملاحظات السنتر */}
          <div className="lg:col-span-9">
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              اسم المجموعة / ملاحظات السنتر والجهة <span className="text-[#FF6A00]">*</span>
            </label>
            <div className="bg-[#F1F3F5] rounded-xl px-4 py-2.5 border border-transparent focus-within:border-[#FF6A00] focus-within:bg-white transition-all">
              <input
                type="text"
                placeholder="مثال: سنتر الأمل — مراجعة الباب الأول كيمياء دفعة الأحد"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-transparent text-right font-medium text-gray-900 placeholder:text-gray-400 focus:outline-hidden text-sm"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="lg:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF6A00] hover:bg-[#E55F00] text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? "جاري التوليد والربط..." : "توليد الأكواد الآن"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
