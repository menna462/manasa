"use client";

import React from "react";
import { Key, ShieldCheck, Play, RotateCcw } from "lucide-react";
import { DashboardStats } from "@/types/dashboard";

interface StatCardsProps {
  stats: DashboardStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
      {/* 1. إجمالي الأكواد المولدة */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:shadow-md">
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 mb-1">
            إجمالي الأكواد المولدة
          </p>
          <p className="text-3xl font-extrabold text-[#111827] tracking-tight">
            {stats.totalCodes.toLocaleString("en-US")}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            تراكمي جميع الدفعات
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
          <Key className="w-5 h-5 text-gray-700 stroke-[2.2]" />
        </div>
      </div>

      {/* 2. أكواد نشطة ومتاحة */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:shadow-md">
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 mb-1">
            أكواد نشطة ومتاحة
          </p>
          <p className="text-3xl font-extrabold text-[#FF6A00] tracking-tight">
            {stats.activeAvailable.toLocaleString("en-US")}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            جاهزة للتوزيع للطلاب
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#FF6A00] flex items-center justify-center text-white shadow-sm shadow-orange-300">
          <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />
        </div>
      </div>

      {/* 3. أكواد تم تفعيلها */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:shadow-md">
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 mb-1">
            أكواد تم تفعيلها
          </p>
          <p className="text-3xl font-extrabold text-[#111827] tracking-tight">
            {stats.usedActive.toLocaleString("en-US")}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            قيد المشاهدة حالياً
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shadow-sm">
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </div>
      </div>

      {/* 4. أكواد منتهية الصلاحية */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between transition-all hover:shadow-md">
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 mb-1">
            أكواد منتهية الصلاحية
          </p>
          <p className="text-3xl font-extrabold text-[#111827] tracking-tight">
            {stats.expired.toLocaleString("en-US")}
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            استنفذت فترة الصلاحية
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
          <RotateCcw className="w-5 h-5 text-gray-600 stroke-[2.2]" />
        </div>
      </div>
    </div>
  );
};
