"use client";

import React from "react";
import { Search, ChevronDown, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { CodeStatus } from "@/types/dashboard";

interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onPrintCards: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onExportExcel,
  onExportPdf,
  onPrintCards,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 my-4">
      {/* Right Section: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الكود أو اسم المجموعة..."
            className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm font-medium border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all text-right"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative min-w-[150px]">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-[#F1F3F5] text-gray-800 rounded-xl px-4 py-2.5 pr-4 pl-9 text-xs sm:text-sm font-semibold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden cursor-pointer transition-all text-right"
          >
            <option value="all">جميع الحالات</option>
            <option value="new">جديد / غير مستخدم</option>
            <option value="used">مستعمل / نشط</option>
            <option value="expired">منتهي الصلاحية</option>
          </select>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Left Section: Action Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {/* تصدير Excel */}
        <button
          onClick={onExportExcel}
          className="bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] shrink-0 cursor-pointer shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>تصدير Excel</span>
        </button>

        {/* تصدير PDF */}
        <button
          onClick={onExportPdf}
          className="bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] shrink-0 cursor-pointer shadow-xs"
        >
          <FileText className="w-4 h-4 text-rose-400" />
          <span>تصدير PDF</span>
        </button>

        {/* طباعة بطاقات A4 */}
        <button
          onClick={onPrintCards}
          className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] shrink-0 cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-gray-600" />
          <span>طباعة بطاقات A4</span>
        </button>
      </div>
    </div>
  );
};
