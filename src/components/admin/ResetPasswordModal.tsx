"use client";

import React, { useState } from "react";
import {
  X,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
  Mail,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { AdminMember } from "@/types/adminTeam";

interface ResetPasswordModalProps {
  admin: AdminMember;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adminId: string, newPass: string, sendEmail: boolean) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  admin,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [sendByEmail, setSendByEmail] = useState(true);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const generateRandomPassword = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const chars = "!@#$%^&*";
    const special = chars[Math.floor(Math.random() * chars.length)];
    const generated = `AH-PASS${special}${randomNum}`;
    setNewPassword(generated);
    setError("");
  };

  const handleSave = () => {
    if (!newPassword || newPassword.trim().length < 6) {
      setError("يرجى إدخال كلمة مرور صالحة (6 أحرف أو أرقام على الأقل) أو توليد كلمة عشوائية.");
      return;
    }
    onConfirm(admin.id, newPassword, sendByEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform animate-in zoom-in-95 duration-200"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100/80 text-[#FF6A00] flex items-center justify-center shadow-inner">
              <KeyRound className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                إعادة ضبط كلمة المرور
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                للمشرف: <span className="font-bold text-gray-800">{admin.fullName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Admin Info Summary Banner */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black"
                style={{ backgroundColor: admin.avatarColor || "#FF6A00" }}
              >
                {admin.initials}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">{admin.fullName}</p>
                <p className="text-[11px] text-gray-400 font-mono dir-ltr text-right">
                  {admin.email}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 shadow-xs">
              {admin.role === "super_admin"
                ? "أدمن رئيسي"
                : admin.role === "code_manager"
                ? "مسؤول أكواد"
                : "مشرف محتوى"}
            </span>
          </div>

          {/* New Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700">
                كلمة المرور الجديدة <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-xs font-bold text-[#FF6A00] hover:text-[#E55F00] flex items-center gap-1 transition-colors cursor-pointer hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>توليد كلمة مرور عشوائية</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                placeholder="أدخل كلمة المرور الجديدة أو اضغط توليد"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 pl-20 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF6A00] focus:bg-white transition-all font-mono"
              />
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  title={showPassword ? "إخفاء" : "إظهار"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[11px] text-red-500 font-bold mt-1">
                {error}
              </p>
            )}

            <p className="text-[11px] text-gray-400">
              💡 مثال لكلمة مرور نموذجية: <span className="font-mono font-bold text-gray-600">AH-PASS#2026</span>
            </p>
          </div>

          {/* Send via Email Checkbox */}
          <div
            onClick={() => setSendByEmail((v) => !v)}
            className="flex items-start gap-3 p-3.5 bg-orange-50/50 hover:bg-orange-50 border border-orange-100 rounded-2xl cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={sendByEmail}
              onChange={() => {}}
              className="mt-0.5 w-4 h-4 accent-[#FF6A00] rounded cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-extrabold text-gray-800 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FF6A00]" />
                إرسال كلمة المرور الجديدة تلقائياً عبر البريد الإلكتروني
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                سيتم إرسال إشعار فوري إلى <span className="font-mono text-gray-700 font-semibold">{admin.email}</span> يتضمن بيانات الدخول الجديدة ورابط تسجيل الدخول.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-gray-50/80 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-orange-300/40 transition-all active:scale-95 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>حفظ وتحديث كلمة المرور</span>
          </button>
        </div>
      </div>
    </div>
  );
};
