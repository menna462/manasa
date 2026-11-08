"use client";

import React from "react";
import { Users, ShieldCheck, BookOpen, Wifi } from "lucide-react";

interface AdminTeamStatsCardsProps {
  totalAdmins: number;
  superAdmins: number;
  codeAndContentManagers: number;
  activeAdmins: number;
}

export const AdminTeamStatsCards: React.FC<AdminTeamStatsCardsProps> = ({
  totalAdmins,
  superAdmins,
  codeAndContentManagers,
  activeAdmins,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: إجمالي المشرفين */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] sm:text-xs font-bold text-gray-500">
            إجمالي المشرفين
          </span>
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
            <Users className="w-4 h-4 text-[#FF6A00]" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {totalAdmins}
          </span>
          <span className="text-xs font-bold text-gray-400">أعضاء</span>
        </div>
      </div>

      {/* Card 2: الأدمن الرئيسي */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] sm:text-xs font-bold text-gray-500">
            الأدمن الرئيسي
          </span>
          <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-gray-700" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {superAdmins}
          </span>
          <span className="text-xs font-bold text-gray-400">تحكم كامل</span>
        </div>
      </div>

      {/* Card 3: مسؤولو الأكواد والمحتوى */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] sm:text-xs font-bold text-gray-500">
            مسؤولو الأكواد والمحتوى
          </span>
          <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-gray-700" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {codeAndContentManagers}
          </span>
          <span className="text-xs font-bold text-gray-400">صلاحيات محدودة</span>
        </div>
      </div>

      {/* Card 4: المشرفين النشطين */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] sm:text-xs font-bold text-gray-500">
            المشرفين النشطين
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Wifi className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {activeAdmins}
          </span>
          <span className="text-xs font-bold text-gray-400">
            من أصل {totalAdmins}
          </span>
        </div>
      </div>
    </div>
  );
};
