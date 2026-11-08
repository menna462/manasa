"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Pencil,
  Mail,
  User,
  ShieldCheck,
  Ticket,
  BookOpen,
  CheckCircle,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";
import { AdminMember, AdminRole, AdminStatus } from "@/types/adminTeam";

interface EditAdminModalProps {
  admin: AdminMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAdmin: AdminMember) => void;
}

export const EditAdminModal: React.FC<EditAdminModalProps> = ({
  admin,
  isOpen,
  onClose,
  onSave,
}) => {
  const [fullName, setFullName] = useState(admin.fullName);
  const [email, setEmail] = useState(admin.email);
  const [role, setRole] = useState<AdminRole>(admin.role);
  const [status, setStatus] = useState<AdminStatus>(admin.status);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  useEffect(() => {
    if (admin) {
      setFullName(admin.fullName);
      setEmail(admin.email);
      setRole(admin.role);
      setStatus(admin.status);
      setErrors({});
    }
  }, [admin]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { fullName?: string; email?: string } = {};
    if (!fullName.trim()) errs.fullName = "الاسم الكامل مطلوب";
    if (!email.trim() || !email.includes("@"))
      errs.email = "يرجى إدخال بريد إلكتروني صحيح";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const initials = fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("");

    const updated: AdminMember = {
      ...admin,
      fullName: fullName.trim(),
      email: email.trim(),
      role,
      status,
      initials: initials || admin.initials,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 via-white to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100/80 text-[#FF6A00] flex items-center justify-center shadow-inner">
              <Pencil className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                تعديل بيانات المشرف
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                تحديث بيانات وصلاحيات: <span className="font-bold text-gray-800">{admin.fullName}</span>
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

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              الاسم الكامل للمشرف <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((p) => ({ ...p, fullName: undefined }));
              }}
              placeholder="مثال: أ/ محمود عبد الله"
              className={`w-full bg-gray-50 border rounded-2xl py-3 px-4 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all ${
                errors.fullName
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#FF6A00]"
              }`}
            />
            {errors.fullName && (
              <p className="text-[11px] text-red-500 font-bold">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              البريد الإلكتروني للوصول <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              placeholder="name@platform.com"
              dir="ltr"
              className={`w-full bg-gray-50 border rounded-2xl py-3 px-4 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white transition-all text-left font-mono ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#FF6A00]"
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 font-bold">{errors.email}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 block">
              الصلاحية ونطاق الوصول <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {/* Super Admin */}
              <label
                onClick={() => setRole("super_admin")}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  role === "super_admin"
                    ? "border-gray-900 bg-gray-50/90 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="edit_role"
                  value="super_admin"
                  checked={role === "super_admin"}
                  onChange={() => setRole("super_admin")}
                  className="mt-1 accent-gray-900"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-gray-900" />
                      أدمن رئيسي (Super Admin)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-900 text-white">
                      كامل
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    صلاحية كاملة غير مقيدة على كافة أقسام النظام وإدارة المنصة بالكامل.
                  </p>
                </div>
              </label>

              {/* Code Manager */}
              <label
                onClick={() => setRole("code_manager")}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  role === "code_manager"
                    ? "border-[#FF6A00] bg-orange-50/40 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="edit_role"
                  value="code_manager"
                  checked={role === "code_manager"}
                  onChange={() => setRole("code_manager")}
                  className="mt-1 accent-[#FF6A00]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-[#FF6A00]" />
                      مسؤول أكواد (Code Manager)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6A00]">
                      أكواد فقط
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    إمكانية توليد وتصدير وحظر أكواد المحاضرات والسنتر، دون حذف البيانات.
                  </p>
                </div>
              </label>

              {/* Content Manager */}
              <label
                onClick={() => setRole("content_manager")}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  role === "content_manager"
                    ? "border-[#FF6A00] bg-orange-50/40 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="edit_role"
                  value="content_manager"
                  checked={role === "content_manager"}
                  onChange={() => setRole("content_manager")}
                  className="mt-1 accent-[#FF6A00]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-[#FF6A00]" />
                      مشرف محتوى (Content Manager)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6A00]">
                      محتوى ومناهج
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    رفع وتعديل المناهج والدروس وترتيب الملازم، دون الوصول للأكواد أو الطلاب.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Account Status Switch */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-gray-900 block">
                حالة الحساب
              </span>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {status === "active"
                  ? "الحساب نشط ويستطيع المشرف تسجيل الدخول."
                  : "الحساب معطل ومحظور من الوصول للنظام حالياً."}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setStatus((s) => (s === "active" ? "suspended" : "active"))
              }
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                status === "active"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {status === "active" ? (
                <>
                  <ToggleRight className="w-4 h-4" />
                  <span>نشط</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4" />
                  <span>معطل</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-gray-50/80 border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-orange-300/40 transition-all active:scale-95 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
