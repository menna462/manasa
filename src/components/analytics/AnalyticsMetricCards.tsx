"use client";

import React, { useMemo } from "react";
import {
  Ticket,
  Video,
  Coins,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { TimeRangeFilter } from "@/types/analytics";

export interface AnalyticsOverviewData {
  totalCodes: number;
  activeAvailable: number;
  usedActive: number;
  expired: number;
  totalStudents: number;
  completionRate: number;
  avgWatchProgress: number;
  totalWatchHours: number;
  estimatedRevenue: number;
}

interface AnalyticsMetricCardsProps {
  overview?: AnalyticsOverviewData | null;
  topLessonTitle?: string;
  topLessonPart?: string;
  topLessonCodes?: number;
  timeRange?: TimeRangeFilter;
  selectedGrade?: string;
}

export const AnalyticsMetricCards: React.FC<AnalyticsMetricCardsProps> = ({
  overview,
  topLessonTitle,
  topLessonPart,
  topLessonCodes,
  timeRange = "month",
  selectedGrade = "الصف الثالث الثانوي (العام)",
}) => {
  // Dynamically computed metrics from real database overview data
  const metrics = useMemo(() => {
    let labelPeriod = "الشهر الحالي";
    let growthRate = "+0%";

    if (timeRange === "today") {
      labelPeriod = "اليوم";
    } else if (timeRange === "week") {
      labelPeriod = "هذا الأسبوع";
    } else if (timeRange === "all") {
      labelPeriod = "المدى الكلي للعام";
    }

    const totalMax = overview ? overview.totalCodes : 0;
    const usedCodes = overview ? overview.usedActive : 0;
    const remainingCodes = overview ? overview.activeAvailable : 0;
    const usedPercentage = totalMax > 0 ? Math.min(100, Math.round((usedCodes / totalMax) * 100)) : 0;

    const totalRevenue = overview ? overview.estimatedRevenue : 0;
    const completionRate = overview ? overview.completionRate : 0;

    return {
      usedCodes,
      totalMax,
      remainingCodes,
      usedPercentage,
      totalRevenue,
      completionRate,
      labelPeriod,
      growthRate,
    };
  }, [overview, timeRange, selectedGrade]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: إجمالي الأكواد المستعملة */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div>
          {/* Top Row: Label & Icon */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">
              إجمالي الأكواد المستعملة
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6A00]">
              <Ticket className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {metrics.usedCodes.toLocaleString("ar-EG")}
            </span>
            <span className="text-xs font-bold text-gray-400">
              كود مفعل
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[#FF6A00] rounded-full transition-all duration-500"
              style={{ width: `${metrics.usedPercentage}%` }}
            />
          </div>
        </div>

        {/* Bottom Details */}
        <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 pt-1">
          <span className="text-gray-500">
            {metrics.usedPercentage}% مستهلك (من {metrics.totalMax.toLocaleString("ar-EG")})
          </span>
          <span>متبقي {metrics.remainingCodes.toLocaleString("ar-EG")} كود</span>
        </div>
      </div>

      {/* Card 2: متوسط نسبة إكمال المشاهدة */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div>
          {/* Top Row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">
              متوسط نسبة إكمال المشاهدة
            </span>
            <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-200/60 flex items-center justify-center text-gray-700">
              <Video className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>

          {/* Value + Growth Badge */}
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {metrics.completionRate}%
            </span>
            <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 border border-emerald-200/80 text-[11px] font-extrabold px-2 py-0.5 rounded-md">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+4.2%</span>
            </span>
          </div>

          {/* Subtext */}
          <p className="text-[11px] text-gray-400 font-medium">
            قياس دقيق لزمن حضور المحاضرات
          </p>
        </div>

        {/* Bottom Details */}
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100/60 mt-3">
          <span>معدل انضباط مرتفع</span>
          <span>•</span>
          <span>{selectedGrade.split(" ")[1] || "العام"}</span>
        </div>
      </div>

      {/* Card 3: إجمالي الإيرادات المحققة */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div>
          {/* Top Row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500">
              إجمالي الإيرادات المحققة
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6A00]">
              <Coins className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>

          {/* Value */}
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {metrics.totalRevenue.toLocaleString("ar-EG")}
            </span>
            <span className="text-xs font-bold text-gray-500">
              ج.م
            </span>
          </div>

          {/* Subtext */}
          <p className="text-[11px] font-bold text-gray-500 mb-2">
            فترة التقرير: {metrics.labelPeriod}
          </p>
        </div>

        {/* Bottom Details */}
        <div className="flex items-center justify-between text-[11px] font-bold pt-1 border-t border-gray-50">
          <span className="text-gray-400">سعر الكود الموحد: 100 ج.م</span>
          <span className="text-emerald-600 font-extrabold">{metrics.growthRate} نمو</span>
        </div>
      </div>

      {/* Card 4: الدرس الأكثر طلباً ومشاهدة */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div>
          {/* Top Row */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500">
              الدرس الأكثر طلباً ومشاهدة
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6A00]">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            </div>
          </div>

          {/* Grade Pill */}
          <div className="mb-1.5">
            <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-0.5 rounded-md inline-block">
              الصف الثالث الثانوي
            </span>
          </div>

          {/* Title */}
          <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-1 mb-1">
            {topLessonTitle || "المحاضرة 1: التأسيس الشامل ومفهوم الاتزان"}
          </h4>

          {/* Subtitle */}
          <p className="text-[11px] text-gray-400 line-clamp-1 mb-2">
            {topLessonPart || "الوحدة الأولى"}
          </p>
        </div>

        {/* Bottom Details */}
        <div className="flex items-center justify-between text-xs font-extrabold pt-2 border-t border-gray-50">
          <span className="text-gray-900">{topLessonCodes || 0} تفعيل نشط</span>
          <span className="text-[#FF6A00]">{metrics.completionRate}% إكمال</span>
        </div>
      </div>
    </div>
  );
};

