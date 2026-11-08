"use client";

import React from "react";
import { Clock, Zap } from "lucide-react";
import { LecturePerformanceItem } from "@/types/analytics";
import { AnalyticsOverviewData } from "./AnalyticsMetricCards";

interface SmartInsightsSectionProps {
  peakHourLabel?: string | null;
  topLesson?: LecturePerformanceItem | null;
  overview?: AnalyticsOverviewData | null;
}

export const SmartInsightsSection: React.FC<SmartInsightsSectionProps> = ({
  peakHourLabel,
  topLesson,
  overview,
}) => {
  const peakText = peakHourLabel
    ? `تسجل المنصة أعلى نشاط عند الساعة ${peakHourLabel} وفقاً لبيانات مشاهدة المحاضرات. يُنصح بجدولة التنبيهات المنهجية والدعم الفني المباشر في هذا التوقيت.`
    : "لا توجد بيانات مشاهدة كافية بعد لتحديد ساعة الذروة. ستظهر الأنماط بعد بدء تفعيل الطلاب للأكواد.";

  const peakHourTitle = peakHourLabel
    ? `ذروة النشاط عند ${peakHourLabel}`
    : "في انتظار بيانات المشاهدة";

  const replayCount = topLesson?.replayCount ?? 0;
  const avgReplayPerStudent =
    overview && overview.totalStudents > 0 && replayCount > 0
      ? (replayCount / overview.totalStudents).toFixed(1)
      : null;

  const insightText = topLesson
    ? avgReplayPerStudent
      ? `يبلغ متوسط إعادة مقاطع "${topLesson.title}" ${avgReplayPerStudent} مرة لكل طالب، مما يشير لأهمية هذا المحتوى وحاجة الطلاب لمزيد من التمارين التطبيقية.`
      : `تُعدّ "${topLesson.title}" الأكثر تفعيلاً بـ ${topLesson.activatedCodes} كود مع نسبة إكمال ${topLesson.completionRate}%. المحتوى يحقق أداءً ممتازاً.`
    : "لا توجد بيانات أداء للمحاضرات بعد. ستظهر الرؤى الذكية عند تفعيل الطلاب للأكواد ومشاهدة المحتوى.";

  const insightTitle = topLesson
    ? `إقبال عالي على: ${topLesson.title.substring(0, 30)}...`
    : "في انتظار بيانات الأداء";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Insight Card 1: ساعات الذروة التشغيلية */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-400">
              آخر 7 أيام
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-emerald-700">
                ساعات الذروة التشغيلية
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Clock className="w-4 h-4 stroke-[2.3]" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h4 className="font-extrabold text-gray-900 text-sm sm:text-base mb-2">
            {peakHourTitle}
          </h4>

          {/* Body Text */}
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            {peakText}
          </p>
        </div>
      </div>

      {/* Insight Card 2: كثافة مراجعة المحتوى */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-gray-400">
              مؤشر الإقبال
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-amber-700">
                كثافة مراجعة المحتوى
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Zap className="w-4 h-4 fill-amber-500 stroke-[2.3]" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h4 className="font-extrabold text-gray-900 text-sm sm:text-base mb-2">
            {insightTitle}
          </h4>

          {/* Body Text */}
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            {insightText}
          </p>
        </div>
      </div>
    </div>
  );
};
