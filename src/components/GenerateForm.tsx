"use client";

import React, { useState, useEffect } from "react";
import { Plus, Zap, BookOpen, Layers } from "lucide-react";
import { CodeItem } from "@/types/dashboard";
import { GradeLevel } from "@/types/curriculum";
import { codesApi, curriculumApi } from "@/lib/api";

interface GenerateFormProps {
  onGenerate: (newCodes: CodeItem[], count: number) => void;
}

interface FlatLessonOption {
  id: string;
  title: string;
  unitTitle: string;
  gradeTitle: string;
  duration?: string;
}

export const GenerateForm: React.FC<GenerateFormProps> = ({ onGenerate }) => {
  const [count, setCount] = useState<number>(50);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [groupName, setGroupName] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [lessonOptions, setLessonOptions] = useState<FlatLessonOption[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load real curriculum tree to populate lessons dropdown
  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        setIsLoadingLessons(true);
        const res = await curriculumApi.getTree();
        if (res.data && Array.isArray(res.data)) {
          const flatList: FlatLessonOption[] = [];
          res.data.forEach((grade: GradeLevel) => {
            (grade.units || []).forEach((unit) => {
              (unit.lessons || []).forEach((lesson) => {
                flatList.push({
                  id: String(lesson.id),
                  title: lesson.title,
                  unitTitle: unit.title,
                  gradeTitle: grade.title,
                  duration: lesson.duration,
                });
              });
            });
          });
          setLessonOptions(flatList);
          // Set first lesson by default if available
          if (flatList.length > 0) {
            setSelectedLessonId(flatList[0].id);
          }
        }
      } catch (err) {
        console.warn("Could not load curriculum for generate form:", err);
      } finally {
        setIsLoadingLessons(false);
      }
    };

    fetchCurriculum();
  }, []);

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
      const res = await codesApi.generate({
        count,
        groupName: groupName.trim(),
        validityDays: validityDays || 30,
        lessonId: selectedLessonId ? Number(selectedLessonId) : undefined,
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
              حدد المحاضرة المستهدفة والمعايير التالية لتوليد بطاقات الدخول فورياً للسنتر أو المنصة
            </p>
          </div>
        </div>

        <div>
          <span className="inline-block bg-orange-50 text-[#FF6A00] text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-orange-200/60">
            صيغة الكود: XXXXXXXX (8 أرقام)
          </span>
        </div>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Lesson Selection, Count, Validity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
          {/* 1. اختيار المحاضرة أو الدرس المطلوب */}
          <div className="lg:col-span-6">
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#FF6A00]" />
                المحاضرة أو الدرس المرتبط بالكود <span className="text-[#FF6A00]">*</span>
              </span>
            </label>
            <div className="bg-[#F1F3F5] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#FF6A00] focus-within:bg-white transition-all">
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                disabled={isLoadingLessons}
                className="w-full bg-transparent text-gray-900 font-semibold focus:outline-hidden text-xs sm:text-sm cursor-pointer"
              >
                {isLoadingLessons ? (
                  <option value="">جاري تحميل المحاضرات من المنهج...</option>
                ) : lessonOptions.length === 0 ? (
                  <option value="">لا توجد محاضرات في المنهج (كود عام)</option>
                ) : (
                  <>
                    <option value="">-- كود تفعيل عام (غير مقيد بدرس محدد) --</option>
                    {lessonOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.gradeTitle} ◄ {opt.title} {opt.duration ? `(${opt.duration})` : ""}
                      </option>
                    ))}
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
