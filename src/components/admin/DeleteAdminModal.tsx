"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { AdminMember } from "@/types/adminTeam";

interface DeleteAdminModalProps {
  admin: AdminMember | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminId: string) => void;
}

export const DeleteAdminModal: React.FC<DeleteAdminModalProps> = ({
  admin,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform animate-in zoom-in-95 duration-200"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">
              تأكيد حذف حساب المشرف
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            هل أنت متأكد من رغبتك في حذف حساب المشرف:{" "}
            <span className="font-extrabold text-gray-900">{admin.fullName}</span> (
            <span className="font-mono text-gray-500 dir-ltr inline-block text-xs">
              {admin.email}
            </span>
            )؟
          </p>

          <div className="p-3.5 bg-red-50/70 border border-red-200/80 rounded-2xl text-[11px] text-red-700 leading-relaxed font-semibold">
            ⚠️ تحذير: سيتم إلغاء وصول هذا المشرف إلى لوحة التحكم فوراً ولن يتمكن من إدارة أي بيانات أو الاطلاع على التقارير. لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-gray-50/80 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(admin.id);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-red-300/40 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>نعم، حذف الحساب نهائياً</span>
          </button>
        </div>
      </div>
    </div>
  );
};
