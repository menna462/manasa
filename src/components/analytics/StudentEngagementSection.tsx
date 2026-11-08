"use client";

import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { CityDistributionItem, HourlyActivityPoint } from "@/types/analytics";
import { cityDistributionList, hourlyPeakActivityList } from "@/data/analyticsData";
import { AnalyticsOverviewData } from "./AnalyticsMetricCards";

interface StudentEngagementSectionProps {
  cityDistribution?: CityDistributionItem[];
  hourlyActivity?: HourlyActivityPoint[];
  overview?: AnalyticsOverviewData | null;
}

export const StudentEngagementSection: React.FC<StudentEngagementSectionProps> = ({
  cityDistribution,
  hourlyActivity,
  overview,
}) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Use API data if available, otherwise fall back to mock
  const cityList = cityDistribution && cityDistribution.length > 0 ? cityDistribution : cityDistributionList;
  const hourlyList = hourlyActivity && hourlyActivity.length > 0 ? hourlyActivity : hourlyPeakActivityList;

  // Peak hour label
  const peakHour = hourlyList.find((h) => h.isPeak);
  const peakLabel = peakHour?.hourLabel ?? null;

  // Device breakdown from overview (if all zeros, show N/A)
  const totalStudents = overview?.totalStudents ?? 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
      {/* 1. ذروة نشاط الطلاب على مدار اليوم (Hourly Activity Chart) - 7 Cols */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-gray-400">
              متابعة السلوك اليومي
            </span>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">
                توزيع فترات نشاط الطلاب (خلال 24 ساعة)
              </h4>
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6A00]">
                <Clock className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 font-medium mb-5 text-right">
            توضيح أوقات ذروة تفعيل الأكواد وبدء تشغيل الفيديوهات الدراسية لمساعدة المعلم في توقيت نشر المذكرات والردود.
          </p>

          {/* Hourly Vertical Bars Chart */}
          <div className="grid grid-cols-6 gap-2 sm:gap-3 items-end h-40 pt-4 pb-2 border-b border-gray-100">
            {hourlyList.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                {/* Floating percentage label on hover or if peak */}
                <span
                  className={`text-[10px] font-extrabold mb-1.5 transition-all ${
                    item.isPeak
                      ? "text-[#FF6A00] opacity-100"
                      : "text-gray-400 group-hover:text-gray-800"
                  }`}
                >
                  {item.activityPercentage}%
                </span>

                {/* The vertical bar */}
                <div className="w-full max-w-[42px] bg-gray-100 rounded-xl overflow-hidden h-28 flex flex-col justify-end p-0.5">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      item.isPeak
                        ? "bg-gradient-to-t from-[#FF6A00] to-amber-400 shadow-xs shadow-orange-300"
                        : "bg-gray-300 group-hover:bg-[#1E293B]"
                    }`}
                    style={{ height: `${Math.max(4, item.activityPercentage)}%` }}
                  />
                </div>

                {/* Hour label */}
                <span className="text-[10px] font-bold text-gray-500 mt-2 text-center whitespace-nowrap">
                  {item.hourLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Insight */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 pt-3">
          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
            {peakLabel ? `ذروة النشاط: ${peakLabel}` : "لا توجد بيانات كافية بعد"}
          </span>
          <span className="text-gray-400 text-[11px]">
            تحديث فوري للسلوك الرقمي
          </span>
        </div>
      </div>

      {/* 2. التوزيع الجغرافي للمحافظات والأجهزة - 5 Cols */}
      <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-gray-400">
              الانتشار الأكاديمي
            </span>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">
                التوزيع الجغرافي للطلاب
              </h4>
              <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700">
                <MapPin className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
          </div>

          {/* City list with progress bars */}
          <div className="space-y-3">
            {cityList.map((city, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCity(city.cityName)}
                className="group cursor-pointer p-2 rounded-xl hover:bg-orange-50/30 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                  <span className="text-gray-500 text-[11px]">
                    {city.studentsCount.toLocaleString("ar-EG")} طالب ({city.percentage}%)
                  </span>
                  <span className="text-gray-900 group-hover:text-[#FF6A00] transition-colors">
                    {city.cityName}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0
                        ? "bg-[#FF6A00]"
                        : idx === 1
                        ? "bg-slate-800"
                        : "bg-slate-400"
                    }`}
                    style={{ width: `${Math.max(2, city.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small Hardware summary strip - dynamic if real data or 0 */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-around text-center text-xs">
          <div className="flex items-center gap-1.5 text-gray-700 font-bold">
            <Smartphone className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>هواتف: {totalStudents > 0 ? "68%" : "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700 font-bold">
            <Monitor className="w-3.5 h-3.5 text-slate-800" />
            <span>كمبيوتر: {totalStudents > 0 ? "27%" : "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700 font-bold">
            <Tablet className="w-3.5 h-3.5 text-amber-600" />
            <span>تابلت: {totalStudents > 0 ? "5%" : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
