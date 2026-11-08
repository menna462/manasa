"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  RefreshCw,
  ShieldCheck,
  Ticket,
  BookOpen,
  Send,
  ToggleRight,
  ToggleLeft,
  Info,
} from "lucide-react";
import { NewAdminFormData, AdminRole } from "@/types/adminTeam";

interface AddAdminFormCardProps {
  onSubmit: (data: NewAdminFormData) => void;
  onCancel?: () => void;
}

const ROLE_OPTIONS: {
  value: AdminRole;
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  description: string;
  badgeColor: string;
}[] = [
  {
    value: "super_admin",
    label: "أدمن رئيسي",
    labelEn: "Super Admin",
    icon: <ShieldCheck className="w-4 h-4" />,
    description:
      "صلاحية كاملة غير مقيدة على كافة أقسام النظام وإدارة المنصة الكاملة",
    badgeColor: "border-gray-900 bg-gray-900 text-white",
  },
  {
    value: "code_manager",
    label: "مسؤول أكواد",
    labelEn: "Code Manager",
    icon: <Ticket className="w-4 h-4" />,
    description:
      "إمكانية توليد وتصدير وحظر أكواد المحاضرات والسنتر، دون صلاحية الحذف من قاعدة البيانات والتقارير",
    badgeColor: "border-orange-500 bg-orange-50 text-[#FF6A00]",
  },
  {
    value: "content_manager",
    label: "مشرف محتوى",
    labelEn: "Content Manager",
    icon: <BookOpen className="w-4 h-4" />,
    description:
      "رفع وتعديل المناهج الدراسية وترتيب الملازم والـ PDF فقط، بدون قراءة قائمة الطلاب أو الأكواد",
    badgeColor: "border-gray-300 bg-gray-100 text-gray-800",
  },
];

const generateRandomPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789#!@";
  const base = "AH-SEC#";
  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${base}${suffix}`;
};

export const AddAdminFormCard: React.FC<AddAdminFormCardProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<NewAdminFormData>({
    fullName: "",
    email: "",
    tempPassword: "AH-SEC#9821",
    role: "super_admin",
    isActive: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NewAdminFormData, string>>>({});

  const handleGeneratePassword = () => {
    setFormData((prev) => ({ ...prev, tempPassword: generateRandomPassword() }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewAdminFormData, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "الاسم الكامل مطلوب";
    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }
    if (!formData.tempPassword.trim()) newErrors.tempPassword = "كلمة المرور مطلوبة";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(formData);
    // Reset form
    setFormData({
      fullName: "",
      email: "",
      tempPassword: "AH-SEC#9821",
      role: "super_admin",
      isActive: true,
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs mb-6 overflow-hidden">
      {/* Card Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FF6A00] flex items-center justify-center text-white shadow-sm shadow-orange-300">
            <UserPlus className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
              إضافة مشرف أو مسؤول جديد
            </h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              تعبئة البيانات الأساسية ونطاق الصلاحيات المرتبطة بالحساب
            </p>
          </div>
        </div>

        {/* Active Toggle */}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
          }
          className="flex items-center gap-2 text-xs font-bold cursor-pointer group"
        >
          {formData.isActive ? (
            <>
              <ToggleRight className="w-8 h-8 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
              <span className="text-emerald-600 hidden sm:inline">
                تفعيل فورى وآمن
              </span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-8 h-8 text-gray-300 group-hover:text-gray-400 transition-colors" />
              <span className="text-gray-400 hidden sm:inline">
                تفعيل موقوف
              </span>
            </>
          )}
        </button>
      </div>

      {/* Form Body */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* Row 1: Name + Email + Password */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
              الاسم الكامل للمشرف
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="مثال: د. سارة عبد الرحمن"
                className={`w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl pr-10 pl-3.5 py-2.5 text-xs sm:text-sm font-semibold border focus:bg-white focus:outline-none transition-all text-right ${
                  errors.fullName
                    ? "border-red-400 bg-red-50/30"
                    : "border-transparent focus:border-[#FF6A00]"
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <UserPlus className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            {errors.fullName && (
              <p className="text-[10px] text-red-500 font-bold mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
              البريد الإلكتروني الوظيفي
            </label>
            <div className="relative">
              <input
                type="email"
                dir="ltr"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="sara.admin@emadhussein.edu"
                className={`w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold border focus:bg-white focus:outline-none transition-all text-left ${
                  errors.email
                    ? "border-red-400 bg-red-50/30"
                    : "border-transparent focus:border-[#FF6A00]"
                }`}
              />
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-500 font-bold mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Temp Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-gray-700">
                كلمة المرور المؤقتة
              </label>
              <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-md">
                تلقائي
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                value={formData.tempPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tempPassword: e.target.value,
                  }))
                }
                className={`w-full bg-[#F1F3F5] text-gray-900 rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold border focus:bg-white focus:outline-none transition-all text-left tracking-wider ${
                  errors.tempPassword
                    ? "border-red-400"
                    : "border-transparent focus:border-[#FF6A00]"
                }`}
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-[#FF6A00] transition-colors cursor-pointer"
                title="توليد كلمة مرور عشوائية"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Role Selector Cards */}
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-2.5">
            مستوى الصلاحية المتاحة
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROLE_OPTIONS.map((roleOpt) => {
              const isSelected = formData.role === roleOpt.value;
              return (
                <button
                  key={roleOpt.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: roleOpt.value }))
                  }
                  className={`text-right p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                    isSelected
                      ? "border-[#FF6A00] bg-orange-50/40 shadow-sm shadow-orange-200/50"
                      : "border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                  }`}
                >
                  {/* Role header */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${
                        isSelected ? roleOpt.badgeColor : "border-gray-200 bg-gray-100 text-gray-600"
                      }`}
                    >
                      {roleOpt.icon}
                      <span>{roleOpt.labelEn}</span>
                    </div>
                    {/* Radio dot */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[#FF6A00] bg-[#FF6A00]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Role name */}
                  <p className="font-extrabold text-xs text-gray-900 mb-1.5 flex items-center gap-1.5">
                    {roleOpt.icon}
                    <span>
                      {roleOpt.label} ({roleOpt.labelEn})
                    </span>
                  </p>

                  {/* Role description */}
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    {roleOpt.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer note + Submit Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          {/* Info note */}
          <div className="flex items-start gap-1.5 text-[11px] text-gray-400 font-medium max-w-sm">
            <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
            <span>
              سيتم إرسال بريد ترحيبي يحتوي على بيانات الدخول وتفعيل الحساب
              لأول مرة للمشرف الجديد.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="shrink-0 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-300/40 transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.2]" />
            <span>إنشاء الحساب وإرسال الدعوة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
