"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages?: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
}

/**
 * دالة ذكية لتوليد أرقام الصفحات حسب العدد الحقيقي والفعلي للصفحات:
 * - إذا كان عدد الصفحات صغيراً (<= 5)، تظهر كافة الأرقام دون اختصار.
 * - إذا كان عدد الصفحات كبيراً، تظهر الأرقام حول الصفحة الحالية مع نقاط (...) ذكية.
 */
function getPaginationRange(
  currentPage: number,
  totalPages: number
): (number | "...")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // إذا كنا في البداية (صفحة 1 أو 2 أو 3)
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  // إذا كنا في النهاية
  if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // في المنتصف
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  startIndex = 1,
  endIndex = 5,
  onPageChange,
  itemsPerPage = 20,
  onItemsPerPageChange,
}) => {
  // إذا لم تكن هناك أي أكواد على الإطلاق
  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-between py-4 px-3 text-xs sm:text-sm text-gray-400">
        <span>لا توجد أكواد مسجلة مطابقة لمعايير البحث الحالية</span>
      </div>
    );
  }

  const safeTotalPages = Math.max(1, totalPages || 1);
  const pages = getPaginationRange(currentPage, safeTotalPages);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-3.5 px-4 text-xs sm:text-sm bg-white rounded-xl border border-gray-100 shadow-2xs mt-2">
      {/* Right Side: Range Counter & Rows Per Page Selector */}
      <div className="flex items-center gap-4 flex-wrap text-gray-600 font-medium">
        <div>
          <span>عرض </span>
          <span className="font-bold text-gray-900">{startIndex}</span>
          <span> إلى </span>
          <span className="font-bold text-gray-900">{endIndex}</span>
          <span> من أصل </span>
          <span className="font-bold text-gray-900">
            {totalItems.toLocaleString("ar-EG")}
          </span>
          <span> كود</span>
        </div>

        {/* Rows per page dropdown */}
        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 bg-[#F1F3F5] rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-800">
            <span>صفوف لكل صفحة:</span>
            <select
              value={itemsPerPage >= 99999 ? 99999 : itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-transparent font-extrabold text-[#FF6A00] focus:outline-hidden cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={99999}>الكل (All)</option>
            </select>
          </div>
        )}
      </div>

      {/* Left Side: Pagination Navigation Buttons */}
      {safeTotalPages > 1 ? (
        <div className="flex items-center gap-1.5" dir="rtl">
          {/* زر الصفحة السابقة (يمين في واجهة RTL) */}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-8 px-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1 font-bold text-xs transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
            aria-label="الصفحة السابقة"
            title="الصفحة السابقة"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="hidden sm:inline">السابق</span>
          </button>

          {/* أرقام الصفحات الديناميكية حسب العدد الحقيقي */}
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`dots-${idx}`}
                  className="w-7 text-center text-gray-400 font-bold select-none text-xs"
                >
                  ...
                </span>
              );
            }

            const pageNum = p as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF6A00] text-white shadow-xs scale-105"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                aria-label={`الانتقال إلى الصفحة ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}

          {/* زر الصفحة التالية (يسار في واجهة RTL) */}
          <button
            type="button"
            disabled={currentPage >= safeTotalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-8 px-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-1 font-bold text-xs transition-colors disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
            aria-label="الصفحة التالية"
            title="الصفحة التالية"
          >
            <span className="hidden sm:inline">التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* في حال صفحة واحدة فقط أو عرض الكل */
        <span className="text-xs text-gray-400 font-semibold bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
          {itemsPerPage >= 99999 ? `عرض كافة النتائج (${totalItems})` : "صفحة 1 من 1"}
        </span>
      )}
    </div>
  );
};
