"use client";

import React, { useState } from "react";
import { X, Plus, Video, FileText, HelpCircle } from "lucide-react";
import { UnitItem, LessonItem } from "@/types/curriculum";

interface AddLessonModalProps {
  isOpen: boolean;
  units: UnitItem[];
  defaultUnitId?: string;
  onClose: () => void;
  onAdd: (unitId: string, lesson: Partial<LessonItem>) => void;
}

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  isOpen,
  units,
  defaultUnitId,
  onClose,
  onAdd,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string>(
    defaultUnitId || units[0]?.id || ""
  );
  const [title, setTitle] = useState<string>("");
  const [duration, setDuration] = useState<string>("01:10:00");
  const [size, setSize] = useState<string>("750 MB");
  const [hasPdf, setHasPdf] = useState<boolean>(true);
  const [pdfTitle, setPdfTitle] = useState<string>("ملزمة PDF مدمجة");
  const [hasQuiz, setHasQuiz] = useState<boolean>(false);
  const [quizTitle, setQuizTitle] = useState<string>("كويز إلكتروني مدمج");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("يرجى إدخال عنوان المحاضرة");
      return;
    }

    onAdd(selectedUnitId, {
      title: title.trim(),
      duration,
      size,
      hasPdf,
      pdfTitle: hasPdf ? pdfTitle : undefined,
      hasQuiz,
      quizTitle: hasQuiz ? quizTitle : undefined,
      status: "published",
    });

    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6A00]">
              <Video className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">
              إضافة درس / محاضرة جديدة
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Unit Select */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              الوحدة الدراسية <span className="text-[#FF6A00]">*</span>
            </label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="w-full bg-[#F1F3F5] text-gray-900 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              عنوان المحاضرة <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: المحاضرة 4: أفكار ومسائل الاتزان المتقدمة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Duration & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                المدة الزمنية (ساعة:دقيقة:ثانية)
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#F1F3F5] text-gray-900 rounded-xl px-4 py-2 text-xs font-semibold text-center border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                حجم الفيديو التقريبي
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-[#F1F3F5] text-gray-900 rounded-xl px-4 py-2 text-xs font-semibold text-center border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* PDF Checkbox */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/70 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={hasPdf}
                onChange={(e) => setHasPdf(e.target.checked)}
                className="accent-[#FF6A00] w-4 h-4 rounded-sm"
              />
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>إرفاق مذكرة شرح / ملزمة PDF</span>
            </label>
            {hasPdf && (
              <input
                type="text"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                placeholder="عنوان الملزمة (مثال: ملزمة الواجب والأسئلة)"
                className="w-full bg-white text-gray-800 rounded-lg px-3 py-1.5 text-xs border border-gray-200 focus:outline-hidden"
              />
            )}
          </div>

          {/* Quiz Checkbox */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200/70 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={hasQuiz}
                onChange={(e) => setHasQuiz(e.target.checked)}
                className="accent-[#FF6A00] w-4 h-4 rounded-sm"
              />
              <HelpCircle className="w-4 h-4 text-orange-600" />
              <span>إرفاق اختبار إلكتروني (كويز)</span>
            </label>
            {hasQuiz && (
              <input
                type="text"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="عنوان الكويز"
                className="w-full bg-white text-gray-800 rounded-lg px-3 py-1.5 text-xs border border-gray-200 focus:outline-hidden"
              />
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="text-xs sm:text-sm font-bold text-gray-600 hover:text-black px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm shadow-orange-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة المحاضرة الآن</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
