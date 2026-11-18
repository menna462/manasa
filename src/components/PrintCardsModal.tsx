"use client";

import React, { useState, useEffect } from "react";
import { X, Printer, Download, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { CodeItem } from "@/types/dashboard";
import { exportCodesToPdf } from "@/lib/pdf";

const PLATFORM_URL = "https://emadhussein.com/";

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
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(PLATFORM_URL, {
        margin: 1,
        width: 160,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => setQrDataUrl(""));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!codes || codes.length === 0) return;
    try {
      setIsExportingPdf(true);
      await exportCodesToPdf(codes);
    } catch (err) {
      console.error("Error exporting PDF:", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Print-specific style tag injected only when modal is mounted */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-cards-container, #print-cards-container * {
            visibility: visible !important;
          }
          #print-cards-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10mm 15mm !important;
            background: white !important;
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12mm !important;
          }
          .print-card-item {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            border: 2px dashed #4b5563 !important;
            border-radius: 14px !important;
            padding: 14px 16px !important;
            min-height: 82mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header - No Print */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 no-print bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6A00] shrink-0">
              <Printer className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                معاينة وطباعة بطاقات الأكواد (A4)
              </h3>
              <p className="text-xs text-gray-500">
                جاهزة للطباعة والقص للطلاب ({codes.length} بطاقة • 6 بطاقات كبيرة وواضحة في كل صفحة A4 مع QR Code)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* تنزيل PDF مباشر بنظام 6 كروت */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="bg-[#FF6A00] hover:bg-[#E55F00] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التصدير...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.2]" />
                  <span>تنزيل ملف PDF (6 كروت/صفحة)</span>
                </>
              )}
            </button>

            {/* طباعة المتصفح */}
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4 text-gray-600" />
              <span>طباعة فورية</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Cards Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50/60">
          <div
            id="print-cards-container"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {codes.map((item) => {
              const lessonName = item.lessonTitle || "كود عام (شامل المنهج)";
              const groupName = item.groupName || "عام";
              const validity = item.validityDays || 30;

              return (
                <div
                  key={item.id}
                  className="print-card-item bg-white border-2 border-dashed border-gray-400 rounded-2xl p-5 flex flex-col justify-between shadow-xs relative overflow-hidden transition-all hover:border-[#FF6A00] min-h-[250px]"
                >
                  {/* Card Top: Platform Name & Logo */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <div className="text-right">
                      <span className="text-xs sm:text-[13px] font-extrabold text-[#FF6A00] block">
                        منصة أ/ عماد حسين التعليمية
                      </span>
                      <span className="text-[11px] font-bold text-gray-700">
                        كود تفعيل ودخول الحصة
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#0f172a] text-white flex items-center justify-center font-black text-xs tracking-wider shrink-0">
                      EH
                    </div>
                  </div>

                  {/* Card Center: Big Code Box */}
                  <div className="my-2 text-center bg-slate-50 py-3.5 px-4 rounded-xl border border-slate-200">
                    <p className="text-[11px] font-bold text-slate-500 mb-1 text-center">
                      رمز الدخول المباشر
                    </p>
                    <p className="text-2xl sm:text-3xl font-mono font-black text-[#FF6A00] tracking-widest text-center" dir="ltr">
                      {item.code}
                    </p>
                  </div>

                  {/* Card Bottom: Metadata & QR */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-[11px] gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0 text-right">
                      <p className="font-extrabold text-gray-900 truncate" title={groupName}>
                        الدفعة: {groupName}
                      </p>
                      <p className="font-bold text-indigo-700 truncate" title={lessonName}>
                        المحتوى: {lessonName}
                      </p>
                      <p className="text-[10px] font-semibold text-gray-500">
                        صلاحية الكود: {validity} يوم {item.lessonDuration && item.lessonDuration !== "—" ? `• مدة: ${item.lessonDuration}` : ""}
                      </p>
                    </div>

                    {/* QR Code Container */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="QR Code"
                          className="w-14 h-14 border border-gray-200 rounded-lg p-0.5 bg-white"
                        />
                      ) : (
                        <div className="w-14 h-14 border border-gray-200 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">
                          QR
                        </div>
                      )}
                      <span className="text-[8px] font-bold text-gray-500 mt-1 whitespace-nowrap">
                        امسح للدخول
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
