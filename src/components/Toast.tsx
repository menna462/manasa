"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-white text-xs sm:text-sm font-semibold border ${
          toast.type === "success"
            ? "bg-emerald-700 border-emerald-600 shadow-emerald-900/30"
            : toast.type === "error"
            ? "bg-red-600 border-red-500 shadow-red-900/30"
            : "bg-gray-900 border-gray-800"
        }`}
      >
        {toast.type === "success" && (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        )}
        {toast.type === "error" && (
          <AlertCircle className="w-5 h-5 text-white shrink-0" />
        )}
        {toast.type === "info" && (
          <Info className="w-5 h-5 text-orange-400 shrink-0" />
        )}

        <span>{toast.text}</span>

        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer mr-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
