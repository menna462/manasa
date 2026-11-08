"use client";

import React, { useState } from "react";
import { X, Copy, Check, QrCode, Calendar, Clock, BookOpen, CalendarClock, Shield } from "lucide-react";
import { CodeItem } from "@/types/dashboard";

interface CodeDetailsModalProps {
  codeItem: CodeItem | null;
  onClose: () => void;
  onToggleStatus: (id: string) => void;
}

function calcRemainingDaysText(
  activatedAt?: string,
  validityDays: number = 30,
  expiresAt?: string,
  status?: string
): { text: string; color: string } {
  if (status === "expired") {
    return { text: "منتهي الصلاحية (0 يوم متبقي)", color: "text-red-600" };
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
      if (days <= 0) return { text: "منتهي اليوم", color: "text-red-600" };
      return {
        text: `فاضل ${days} يوم حتى ${expDate.toLocaleDateString("ar-EG")}`,
        color: days <= 5 ? "text-red-600" : "text-emerald-700",
      };
    }
  }

  return {
    text: `فاضل ${validityDays} يوم كاملة (يبدأ العد بعد أول تفعيل للطالب)`,
    color: "text-blue-700",
  };
}

export const CodeDetailsModal: React.FC<CodeDetailsModalProps> = ({
  codeItem,
  onClose,
  onToggleStatus,
}) => {
  const [copied, setCopied] = useState(false);

  if (!codeItem) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeItem.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const remaining = calcRemainingDaysText(
    codeItem.activatedAt,
    codeItem.validityDays,
    codeItem.expiresAt,
    codeItem.status
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6A00]">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base">
              تفاصيل كود التفعيل والمحاضرة
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Code Showcase Box */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-200/60 flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-800 font-semibold mb-1">
                الكود الموحد للوصول
              </p>
              <p className="text-2xl font-mono font-extrabold text-gray-900 tracking-wider">
                {codeItem.code}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="bg-white hover:bg-orange-100 text-[#FF6A00] border border-orange-200 p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-xs active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>

          {/* Lesson Info Box */}
          <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-indigo-800 block">
                  الدرس أو المحاضرة المرتبطة:
                </span>
                <span className="font-extrabold text-xs sm:text-sm text-indigo-950">
                  {codeItem.lessonTitle || "كود عام (شامل المنهج)"}
                </span>
              </div>
            </div>
            {codeItem.lessonDuration && codeItem.lessonDuration !== "—" && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-800 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                <Clock className="w-3.5 h-3.5 text-[#FF6A00]" />
                {codeItem.lessonDuration}
              </span>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-gray-500 block mb-1">المجموعة / السنتر</span>
              <span className="font-bold text-gray-900">{codeItem.groupName}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-gray-500 block mb-1">حالة الكود</span>
              <div>
                {codeItem.status === "new" && (
                  <span className="inline-block bg-[#FF6A00] text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                    جديد / غير مستخدم
                  </span>
                )}
                {codeItem.status === "used" && (
                  <span className="inline-block bg-black text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
                    مستعمل / نشط
                  </span>
                )}
                {codeItem.status === "expired" && (
                  <span className="inline-block bg-gray-200 text-gray-700 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    منتهي الصلاحية
                  </span>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-gray-500 block mb-1">مدة الصلاحية</span>
              <span className="font-bold text-gray-900">{codeItem.validityDays} يوم</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-gray-500 block mb-1">تاريخ الإنشاء</span>
              <span className="font-bold text-gray-900">{codeItem.createdAt}</span>
            </div>
          </div>

          {/* Remaining Days Box */}
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 flex items-center gap-2.5">
            <CalendarClock className="w-5 h-5 text-[#FF6A00] shrink-0" />
            <div>
              <span className="text-xs text-gray-500 block">المتبقي لانتهاء الصلاحية:</span>
              <span className={`text-xs sm:text-sm font-extrabold ${remaining.color}`}>
                {remaining.text}
              </span>
            </div>
          </div>

          {/* Student Info if used */}
          {codeItem.usedBy && (
            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs sm:text-sm">
              <span className="text-blue-800 font-bold block mb-1">بيانات الطالب المفعل:</span>
              <p className="text-gray-800 font-medium">{codeItem.usedBy}</p>
              {codeItem.activatedAt && (
                <p className="text-gray-500 text-xs mt-1">
                  تاريخ التفعيل: {codeItem.activatedAt}
                </p>
              )}
            </div>
          )}

          {/* QR Code Simulation */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/70 flex items-center justify-between">
            <div className="text-right">
              <p className="font-bold text-gray-900 text-xs sm:text-sm">
                رمز الاستجابة السريعة (QR Code)
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                يمكن للطالب مسح الكود مباشرة للدخول إلى الدرس
              </p>
            </div>
            <div className="w-14 h-14 bg-white p-2 rounded-xl border border-gray-200 flex items-center justify-center shadow-xs">
              <QrCode className="w-10 h-10 text-gray-900" />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleStatus(codeItem.id)}
            className="text-xs sm:text-sm font-bold text-gray-700 hover:text-black border border-gray-300 bg-white hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            {codeItem.status === "new" ? "تعطيل الكود مؤقتاً" : "إعادة تنشيط الكود"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs sm:text-sm font-bold bg-[#FF6A00] hover:bg-[#E55F00] text-white px-5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
