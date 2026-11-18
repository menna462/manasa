"use client";

import React, { useState, useEffect } from "react";
import { X, FolderEdit, Check, Loader2 } from "lucide-react";
import { UnitItem } from "@/types/curriculum";

interface EditUnitModalProps {
  isOpen: boolean;
  unit: UnitItem | null;
  onClose: () => void;
  onSave: (unitId: string, data: { title: string; subtitle?: string }) => Promise<void>;
}

export const EditUnitModal: React.FC<EditUnitModalProps> = ({
  isOpen,
  unit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (unit) {
      setTitle(unit.title || "");
      // If subtitle is not explicitly set, leave empty or use default
      setSubtitle(unit.subtitle || "");
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("يرجى إدخال عنوان الوحدة");
      return;
    }

    try {
      setIsSaving(true);
      await onSave(unit.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
      });
      onClose();
    } catch {
      // Error is handled in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center">
              <FolderEdit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">
                تعديل بيانات الوحدة الدراسية
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                تعديل الاسم والوصف التوضيحي للوحدة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              عنوان الوحدة <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: الوحدة 1: الاتزان والتأسيس الشامل"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-1.5">
              الوصف الإضافي / الملاحظات
            </label>
            <textarea
              rows={2}
              placeholder="مثال: مفاهيم الاتزان الكيميائي وقوانين لوشاتيليه"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden resize-none transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="text-xs sm:text-sm font-bold text-gray-600 hover:text-black px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#FF6A00] hover:bg-[#E55F00] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>حفظ التعديلات</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
