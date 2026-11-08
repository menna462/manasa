"use client";

import React, { useState, useEffect } from "react";
import { AnalyticsToolbar } from "./AnalyticsToolbar";
import { AnalyticsMetricCards } from "./AnalyticsMetricCards";
import { DailySalesLineChart } from "./DailySalesLineChart";
import { GradeDistributionDonutChart } from "./GradeDistributionDonutChart";
import { SmartInsightsSection } from "./SmartInsightsSection";
import { LecturesPerformanceTable } from "./LecturesPerformanceTable";
import { StudentEngagementSection } from "./StudentEngagementSection";
import { LectureAnalyticsDetailModal } from "./LectureAnalyticsDetailModal";
import {
  TimeRangeFilter,
  LecturePerformanceItem,
  DailyActivationData,
  GradeDistributionItem,
  CityDistributionItem,
  HourlyActivityPoint,
} from "@/types/analytics";
import { analyticsApi } from "@/lib/api";
import { AnalyticsOverviewData } from "./AnalyticsMetricCards";

interface AnalyticsViewProps {
  onShowToast: (message: string, type?: "success" | "info" | "error") => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onShowToast }) => {
  const [selectedGrade, setSelectedGrade] = useState("الصف الثالث الثانوي (العام)");
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>("month");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedLectureForModal, setSelectedLectureForModal] = useState<LecturePerformanceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Real API data state
  const [overview, setOverview] = useState<AnalyticsOverviewData | null>(null);
  const [performanceList, setPerformanceList] = useState<LecturePerformanceItem[]>([]);
  const [dailyActivations, setDailyActivations] = useState<DailyActivationData[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistributionItem[]>([]);
  const [cityDistribution, setCityDistribution] = useState<CityDistributionItem[]>([]);
  const [hourlyActivity, setHourlyActivity] = useState<HourlyActivityPoint[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [overviewRes, perfRes, dailyRes, distRes] = await Promise.allSettled([
          analyticsApi.getOverview(),
          analyticsApi.getLecturePerformance(),
          analyticsApi.getDailyActivations(),
          analyticsApi.getDistributions(),
        ]);

        if (overviewRes.status === "fulfilled" && overviewRes.value) {
          setOverview(overviewRes.value);
        }

        if (perfRes.status === "fulfilled" && perfRes.value && perfRes.value.length > 0) {
          setPerformanceList(perfRes.value);
        }

        if (dailyRes.status === "fulfilled" && dailyRes.value && dailyRes.value.length > 0) {
          setDailyActivations(dailyRes.value);
        }

        if (distRes.status === "fulfilled" && distRes.value) {
          const dist = distRes.value;
          if (dist.gradeDistribution?.length > 0) setGradeDistribution(dist.gradeDistribution);
          if (dist.cityDistribution?.length > 0) setCityDistribution(dist.cityDistribution);
          if (dist.hourlyActivity?.length > 0) setHourlyActivity(dist.hourlyActivity);
        }
      } catch (err) {
        console.warn("Could not load analytics from API", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleDownload = (format: "pdf" | "excel") => {
    setIsExportModalOpen(false);

    if (format === "excel") {
      try {
        const headers = ["معرف المحاضرة", "عنوان المحاضرة", "الباب / الوحدة", "الصف الدراسي", "المدة (دقيقة)", "الأكواد المفعلة", "نسبة الإكمال %", "مرات الإعادة", "متوسط المشاهدة (دقيقة)", "مستوى الإقبال"];
        const rows = performanceList.map((item) => [
          item.id,
          `"${item.title.replace(/"/g, '""')}"`,
          `"${item.part}"`,
          `"${item.grade}"`,
          item.duration,
          item.activatedCodes,
          `${item.completionRate}%`,
          item.replayCount,
          item.avgWatchMinutes,
          `"${item.popularityText}"`,
        ]);

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `analytics-report-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        onShowToast("تم تنزيل ملف الإحصائيات (Excel/CSV) بنجاح!", "success");
      } catch (err) {
        onShowToast("حدث خطأ أثناء تنزيل الملف", "error");
      }
    } else {
      onShowToast("جاري تجهيز تقرير PDF للطباعة والحفظ...", "info");
      setTimeout(() => {
        window.print();
      }, 350);
    }
  };

  const handleLectureClick = (lecture: LecturePerformanceItem) => {
    setSelectedLectureForModal(lecture);
    onShowToast(`تم فتح التحليل التفصيلي لـ: ${lecture.title}`, "info");
  };

  // Top lesson for insights
  const topLesson = performanceList.length > 0
    ? [...performanceList].sort((a, b) => b.activatedCodes - a.activatedCodes)[0]
    : null;

  // Peak hour from hourly activity
  const peakHour = hourlyActivity.find((h) => h.isPeak);
  const peakHourLabel = peakHour?.hourLabel ?? null;

  return (
    <div className="w-full animate-in fade-in duration-300 pb-4">
      {/* 1. Global Filter Bar */}
      <AnalyticsToolbar
        selectedGrade={selectedGrade}
        onSelectGrade={(g) => {
          setSelectedGrade(g);
          onShowToast(`تم تصفية البيانات لعرض: ${g}`, "info");
        }}
        timeRange={timeRange}
        onTimeRangeChange={(r) => {
          setTimeRange(r);
          const labels: Record<TimeRangeFilter, string> = {
            today: "اليوم",
            week: "هذا الأسبوع",
            month: "هذا الشهر",
            all: "المدى الكلي",
          };
          onShowToast(`تم تغيير النطاق الزمني إلى: ${labels[r]}`, "info");
        }}
        onExport={handleExport}
      />

      {/* 2. Top Key Metrics Cards Grid */}
      <AnalyticsMetricCards
        overview={overview}
        topLessonTitle={topLesson?.title}
        topLessonPart={topLesson?.part}
        topLessonCodes={topLesson?.activatedCodes}
        timeRange={timeRange}
        selectedGrade={selectedGrade}
      />

      {/* 3. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        {/* Right Chart: معدل استهلاك الأكواد والمبيعات اليومية (Line Chart - 8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <DailySalesLineChart
            data={dailyActivations.length > 0 ? dailyActivations : undefined}
            timeRange={timeRange}
            selectedGrade={selectedGrade}
          />
        </div>

        {/* Left Chart: توزيع الأكواد حسب الصفوف (Donut Chart - 4 Cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <GradeDistributionDonutChart
            data={gradeDistribution.length > 0 ? gradeDistribution : undefined}
            totalCodes={overview?.totalCodes}
          />
        </div>
      </div>

      {/* 4. Smart Analytics Insights Cards */}
      <SmartInsightsSection
        peakHourLabel={peakHourLabel}
        topLesson={topLesson}
        overview={overview}
      />

      {/* 5. Student Engagement & Geographic Breakdown */}
      <StudentEngagementSection
        cityDistribution={cityDistribution.length > 0 ? cityDistribution : undefined}
        hourlyActivity={hourlyActivity.length > 0 ? hourlyActivity : undefined}
        overview={overview}
      />

      {/* 6. Lectures Performance Table */}
      <LecturesPerformanceTable
        data={performanceList.length > 0 ? performanceList : undefined}
        selectedGrade={selectedGrade}
        onRowClick={handleLectureClick}
      />

      {/* 7. Detailed Lecture Analytics Modal */}
      <LectureAnalyticsDetailModal
        lecture={selectedLectureForModal}
        isOpen={Boolean(selectedLectureForModal)}
        onClose={() => setSelectedLectureForModal(null)}
        onShowToast={onShowToast}
      />

      {/* 8. Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-right animate-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-gray-900 text-lg mb-2">
              تصدير التقرير التحليلي
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              اختر الصيغة المناسبة لتصدير تقارير استهلاك الأكواد ومعدلات إكمال المحاضرات.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleDownload("pdf")}
                className="p-4 rounded-2xl border-2 border-orange-200 bg-orange-50/40 hover:bg-orange-50 text-right transition-all cursor-pointer group"
              >
                <span className="block text-sm font-extrabold text-gray-900 group-hover:text-[#FF6A00]">
                  تقرير PDF رسمي
                </span>
                <span className="block text-[11px] text-gray-400 mt-1">
                  مطبوع وجاهز للأرشفة
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownload("excel")}
                className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 text-right transition-all cursor-pointer group"
              >
                <span className="block text-sm font-extrabold text-gray-900 group-hover:text-emerald-700">
                  ملف Excel / CSV
                </span>
                <span className="block text-[11px] text-gray-400 mt-1">
                  جداول تفصيلية للحسابات
                </span>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
