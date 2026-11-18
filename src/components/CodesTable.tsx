"use client";

import React, { useState, memo } from "react";
import { Copy, Check, BookOpen, Clock, CalendarClock, ShieldAlert, Sparkles } from "lucide-react";
import { CodeItem } from "@/types/dashboard";

interface CodesTableProps {
  codes: CodeItem[];
  selectedIds: string[];
  isLoading?: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetails: (code: CodeItem) => void;
  onToggleStatus: (id: string) => void;
  onDeleteCode: (id: string) => void;
}

/**
 * دالة حساب الأيام المتبقية لانتهاء صلاحية الكود بدقة:
 */
function calcRemainingDays(
  activatedAt?: string,
  validityDays: number = 30,
  expiresAt?: string,
  status?: string
): { label: string; subLabel: string; color: string; badgeBg: string } {
  if (status === "expired") {
    return {
      label: "منتهي",
      subLabel: "0 يوم متبقي",
      color: "text-red-600",
      badgeBg: "bg-red-50 border-red-200/80",
    };
  }

  if (status === "used") {
    let expDate: Date | null = null;
    if (expiresAt) {
      expDate = new Date(expiresAt);
    } else if (activatedAt && validityDays) {
      expDate = new Date(activatedAt);
      expDate.setDate(expDate.getDate() + validityDays);
    }

    if (expDate && !isNaN(expDate.getTime())) {
      const diffMs = expDate.getTime() - Date.now();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (days <= 0) {
        return {
          label: "منتهي اليوم",
          subLabel: "0 يوم",
          color: "text-red-600",
          badgeBg: "bg-red-50 border-red-200/80",
        };
      }
      if (days <= 5) {
        return {
          label: `فاضل ${days} ${days === 1 ? "يوم" : days === 2 ? "يومان" : days <= 10 ? "أيام" : "يوم"}`,
          subLabel: "ينتهي قريباً",
          color: "text-red-600",
          badgeBg: "bg-red-50 border-red-200/80",
        };
      }
      if (days <= 14) {
        return {
          label: `فاضل ${days} ${days <= 10 ? "أيام" : "يوم"}`,
          subLabel: "نشط ومفعل",
          color: "text-amber-700",
          badgeBg: "bg-amber-50 border-amber-200/80",
        };
      }
      return {
        label: `فاضل ${days} ${days <= 10 ? "أيام" : "يوم"}`,
        subLabel: "نشط ومفعل",
        color: "text-emerald-700",
        badgeBg: "bg-emerald-50 border-emerald-200/80",
      };
    }
  }

  const days = validityDays || 30;
  return {
    label: `فاضل ${days} ${days === 1 ? "يوم" : days === 2 ? "يومان" : days <= 10 ? "أيام" : "يوم"}`,
    subLabel: "يبدأ عند التفعيل",
    color: "text-blue-700",
    badgeBg: "bg-blue-50/80 border-blue-200/80",
  };
}

/**
 * تنسيق مدة المحاضرة بشكل عربي مقروء
 */
function formatDuration(duration?: string): string {
  if (!duration || duration === "—" || duration === "00:00:00") {
    return "غير محددة";
  }
  const parts = duration.split(":");
  if (parts.length < 2) return duration;
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  if (h > 0 && m > 0) return `${h}س ${m}د`;
  if (h > 0) return `${h} ساعة`;
  if (m > 0) return `${m} دقيقة`;
  return duration;
}

// Single Memoized Row Component
interface CodeTableRowProps {
  item: CodeItem;
  isSelected: boolean;
  copiedId: string | null;
  onCopy: (id: string, text: string, e: React.MouseEvent) => void;
  onToggleSelect: (id: string) => void;
  onViewDetails: (code: CodeItem) => void;
  onToggleStatus: (id: string) => void;
  onDeleteCode: (id: string) => void;
}

const CodeTableRow = memo(function CodeTableRow({
  item,
  isSelected,
  copiedId,
  onCopy,
  onToggleSelect,
  onViewDetails,
  onToggleStatus,
  onDeleteCode,
}: CodeTableRowProps) {
  const remaining = calcRemainingDays(
    item.activatedAt,
    item.validityDays,
    item.expiresAt,
    item.status
  );

  const hasSpecificLesson =
    item.lessonTitle &&
    item.lessonTitle !== "كود عام (شامل المنهج)" &&
    item.lessonTitle !== "عام";

  return (
    <tr
      className={`transition-colors hover:bg-orange-50/20 ${
        isSelected ? "bg-orange-50/40" : "bg-white"
      }`}
    >
      {/* 1. Selection Checkbox */}
      <td className="py-3.5 px-3 text-center">
        <button
          type="button"
          onClick={() => onToggleSelect(item.id)}
          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors cursor-pointer mx-auto ${
            isSelected
              ? "bg-[#FF6A00] border-[#FF6A00] text-white"
              : "bg-white border-gray-300 hover:border-gray-400"
          }`}
          aria-label={`تحديد ${item.code}`}
        >
          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
        </button>
      </td>

      {/* 2. Unified Numeric Code */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => onCopy(item.id, item.code, e)}
            title="نسخ الكود"
            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          >
            {copiedId === item.id ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <span className="font-mono font-bold text-xs sm:text-sm text-gray-900 bg-gray-100/90 px-2 py-0.5 rounded-lg border border-gray-200/60 tracking-wider">
            {item.code}
          </span>
        </div>
      </td>

      {/* 3. Lesson Title */}
      <td className="py-3.5 px-3">
        {hasSpecificLesson ? (
          <div className="flex items-center gap-1.5 max-w-[220px]" title={item.lessonTitle}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
            <span className="text-xs font-bold text-indigo-900 truncate">
              {item.lessonTitle}
            </span>
          </div>
        ) : (
          <span className="inline-block text-[11px] font-semibold text-gray-500 bg-gray-100/80 px-2 py-0.5 rounded-md">
            كود عام (شامل المنهج)
          </span>
        )}
      </td>

      {/* 4. Lesson Duration */}
      <td className="py-3.5 px-3 text-center">
        {item.lessonDuration && item.lessonDuration !== "—" ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200/70 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-gray-400" />
            {formatDuration(item.lessonDuration)}
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        )}
      </td>

      {/* 5. Group Name */}
      <td className="py-3.5 px-3">
        <span className="font-semibold text-gray-800 text-xs sm:text-sm block truncate max-w-[200px]" title={item.groupName}>
          {item.groupName}
        </span>
      </td>

      {/* 6. Validity Days */}
      <td className="py-3.5 px-3 text-center">
        <span className="font-mono font-bold text-gray-800 text-xs bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200/60">
          {item.validityDays} يوم
        </span>
      </td>

      {/* 7. Remaining Days Badge */}
      <td className="py-3.5 px-3 text-center">
        <div className={`inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-xl border ${remaining.badgeBg}`}>
          <span className={`text-[11px] font-extrabold ${remaining.color} leading-tight`}>
            {remaining.label}
          </span>
          <span className="text-[9px] text-gray-500 font-medium">
            {remaining.subLabel}
          </span>
        </div>
      </td>

      {/* 8. Creation Date */}
      <td className="py-3.5 px-3 text-center text-gray-500 font-mono text-xs">
        {item.createdAt}
      </td>

      {/* 9. Status Badge */}
      <td className="py-3.5 px-3 text-center">
        {item.status === "new" && (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            جديد / متاح
          </span>
        )}
        {item.status === "used" && (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/80 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            مستعمل / نشط
          </span>
        )}
        {item.status === "expired" && (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200/80 text-[11px] font-extrabold px-2.5 py-1 rounded-full">
            <ShieldAlert className="w-3 h-3 text-red-500" />
            منتهي الصلاحية
          </span>
        )}
      </td>

      {/* 10. Actions Buttons */}
      <td className="py-3.5 px-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {item.status === "expired" ? (
            <button
              type="button"
              onClick={() => onDeleteCode(item.id)}
              className="bg-white hover:bg-red-50 text-red-600 border border-gray-200 hover:border-red-200 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              حذف
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleStatus(item.id)}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              إيقاف
            </button>
          )}
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="bg-white hover:bg-orange-50 text-gray-800 hover:text-[#FF6A00] border border-gray-200 hover:border-orange-200 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            تفاصيل
          </button>
        </div>
      </td>
    </tr>
  );
});

export const CodesTable = memo(function CodesTable({
  codes,
  selectedIds,
  isLoading = false,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onToggleStatus,
  onDeleteCode,
}: CodesTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const isAllSelected = codes.length > 0 && codes.every((c) => selectedIds.includes(c.id));
  const isSomeSelected = codes.some((c) => selectedIds.includes(c.id)) && !isAllSelected;

  return (
    <div className="bg-white rounded-2xl border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] overflow-hidden my-4">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F1F3F5] text-gray-800 text-xs font-bold border-b border-gray-200/80">
              <th className="py-4 px-3 w-10 text-center">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors cursor-pointer mx-auto ${
                    isAllSelected || isSomeSelected
                      ? "bg-[#FF6A00] border-[#FF6A00] text-white"
                      : "bg-white border-gray-300 hover:border-gray-400"
                  }`}
                  aria-label="تحديد الكل"
                >
                  {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  {isSomeSelected && <div className="w-2 h-0.5 bg-white rounded-full" />}
                </button>
              </th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-right">الكود الموحد</th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-right">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#FF6A00]" />
                  الدرس المرتبط
                </span>
              </th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-center">
                <span className="flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#FF6A00]" />
                  مدة الدرس
                </span>
              </th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-right">المجموعة والسنتر</th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-center">مدة الصلاحية</th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-center">
                <span className="flex items-center justify-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5 text-[#FF6A00]" />
                  فاضل كام يوم عشان ينتهي
                </span>
              </th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-center">تاريخ التوليد</th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-center">الحالة</th>
              <th className="py-4 px-3 font-extrabold text-gray-900 text-center">إجراءات التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Fast Skeleton Loading rows
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="py-4 px-3 text-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="w-24 h-5 bg-gray-200 rounded-lg" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="w-16 h-4 bg-gray-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-3">
                    <div className="w-36 h-4 bg-gray-200 rounded" />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="w-12 h-4 bg-gray-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="w-20 h-6 bg-gray-200 rounded-xl mx-auto" />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="w-20 h-4 bg-gray-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="w-20 h-6 bg-gray-200 rounded-full mx-auto" />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="w-16 h-6 bg-gray-200 rounded-lg mx-auto" />
                  </td>
                </tr>
              ))
            ) : codes.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-gray-400 text-sm font-medium">
                  لا توجد أكواد مسجلة مطابقة للبحث
                </td>
              </tr>
            ) : (
              codes.map((item) => (
                <CodeTableRow
                  key={item.id}
                  item={item}
                  isSelected={selectedIds.includes(item.id)}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                  onToggleSelect={onToggleSelect}
                  onViewDetails={onViewDetails}
                  onToggleStatus={onToggleStatus}
                  onDeleteCode={onDeleteCode}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
