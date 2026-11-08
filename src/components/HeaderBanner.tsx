"use client";

import React from "react";
import { ShieldAlert, UserCheck } from "lucide-react";

export const HeaderBanner: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 pb-4">
      {/* Right Column: Title and Subtitle */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-[#FF6A00] rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            لوحة تحكم المنصة (الأدمن)
          </h1>
          <span className="bg-[#FF6A00] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
            أدمن معتمد
          </span>
        </div>
        <p className="mt-1.5 text-sm text-gray-500 max-w-2xl leading-relaxed pr-4">
          إدارة وتوليد أكواد الوصول، متابعة الاستهلاك، والتحكم في حزم الحصص للسناتر والمنصة الإلكترونية
        </p>
      </div>

      {/* Left Column: Admin Profile Card */}
      <div className="flex items-center gap-3 bg-transparent self-start md:self-auto">
        <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center text-white shadow-sm ring-2 ring-gray-100">
          <UserCheck className="w-5 h-5 text-white" />
        </div>
        <div className="text-right">
          <h2 className="text-sm font-bold text-gray-900 leading-tight">
            م/ عماد حسين
          </h2>
          <span className="text-xs text-gray-500">
            صلاحيات كاملة للنظام
          </span>
        </div>
      </div>
    </div>
  );
};
