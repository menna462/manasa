"use client";

import React from "react";
import { Check, Printer, Download, Trash2, X } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onPrintSelected: () => void;
  onExportSelected: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  onPrintSelected,
  onExportSelected,
  onDeleteSelected,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-[#111827] text-white rounded-2xl px-4 py-3 my-3 shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Right Side: Selection Counter Badge */}
      <div className="flex items-center gap-3">
        <div className="bg-[#FF6A00] text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>
            تم تحديد {selectedCount} كود من أصل {totalCount}
          </span>
        </div>
      </div>

      {/* Center/Left Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* طباعة الأكواد المحددة */}
        <button
          onClick={onPrintSelected}
          className="bg-white hover:bg-gray-100 text-gray-900 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-gray-700" />
          <span>طباعة الأكواد المحددة</span>
        </button>

        {/* تصدير المختار */}
        <button
          onClick={onExportSelected}
          className="bg-[#242A35] hover:bg-[#2F3746] text-white border border-white/10 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4 text-gray-300" />
          <span>تصدير المختار</span>
        </button>

        {/* حذف الأكواد المحددة */}
        <button
          onClick={onDeleteSelected}
          className="bg-[#E02424] hover:bg-[#C81E1E] text-white px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <Trash2 className="w-4 h-4 text-white" />
          <span>حذف الأكواد المحددة</span>
        </button>

        {/* إلغاء التحديد */}
        <button
          onClick={onClearSelection}
          className="text-gray-300 hover:text-white px-2 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>إلغاء التحديد</span>
        </button>
      </div>
    </div>
  );
};
