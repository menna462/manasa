"use client";

import React, { useState } from "react";
import { X, Plus, GraduationCap } from "lucide-react";
import { GradeLevel } from "@/types/curriculum";

interface AddGradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (grade: Partial<GradeLevel>) => void;
}

export const AddGradeModal: React.FC<AddGradeModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("يرجى إدخال اسم المرحلة الدراسية");
      return;
    }

    onAdd({
      title: title.trim(),
      subtitle: subtitle.trim() || "منهج الكيمياء الشامل والمراجعات",
      unitsCount: 0,
      lessonsCount: 0,
      pdfCount: 0,
      statusText: "مفعل ومنشور",
      statusType: "published",
      units: [],
    });

    setTitle("");
    setSubtitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6A00]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">
              إضافة مرحلة دراسية جديدة
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              اسم المرحلة الدراسية <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: الصف الثالث الإعدادي / الكيمياء المتقدمة"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              الوصف المختصر للمنهج
            </label>
            <textarea
              rows={2}
              placeholder="وصف محتوى الكورس والدروس المقررة"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden resize-none"
            />
          </div>

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
              <span>إضافة المرحلة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
