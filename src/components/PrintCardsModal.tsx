"use client";

import React from "react";
import { X, Printer, QrCode } from "lucide-react";
import { CodeItem } from "@/types/dashboard";

interface PrintCardsModalProps {
  codes: CodeItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const PrintCardsModal: React.FC<PrintCardsModalProps> = ({
  codes,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header - No Print */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 no-print bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6A00]">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">
                معاينة طباعة بطاقات الدخول (A4)
              </h3>
              <p className="text-xs text-gray-500">
                جاهزة للطباعة والقص للطلاب ({codes.length} بطاقة)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#FF6A00] hover:bg-[#E55F00] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة فورية</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Cards Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {codes.map((item) => (
              <div
                key={item.id}
                className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col justify-between shadow-xs relative overflow-hidden"
              >
                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#FF6A00] block">
                      منصة أ/ عماد حسين التعليمية
                    </span>
                    <span className="text-xs font-bold text-gray-800">
                      كود دخول الحصة
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center font-bold text-[10px]">
                    EH
                  </div>
                </div>

                {/* Card Center: Code */}
                <div className="my-2 text-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  <p className="text-[10px] text-gray-500 mb-0.5">رمز التفعيل</p>
                  <p className="text-lg font-mono font-extrabold text-[#FF6A00] tracking-widest">
                    {item.code}
                  </p>
                </div>

                {/* Card Bottom: Metadata & QR */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                  <div className="space-y-0.5">
                    {item.lessonTitle && item.lessonTitle !== "كود عام (شامل المنهج)" && (
                      <p className="font-bold text-indigo-900 truncate max-w-[130px]" title={item.lessonTitle}>
                        📚 {item.lessonTitle}
                      </p>
                    )}
                    <p className="font-semibold text-gray-800 truncate max-w-[130px]">
                      {item.groupName}
                    </p>
                    <p className="text-[9px] text-gray-500">
                      صلاحية: {item.validityDays} يوم {item.lessonDuration && item.lessonDuration !== "—" ? `| مدة المحاضرة: ${item.lessonDuration}` : ""}
                    </p>
                  </div>
                  <div className="w-9 h-9 bg-white border border-gray-200 rounded-sm flex items-center justify-center p-0.5 shrink-0">
                    <QrCode className="w-7 h-7 text-gray-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
