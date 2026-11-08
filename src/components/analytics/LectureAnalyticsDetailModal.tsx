"use client";

import React, { useState } from "react";
import {
  X,
  PlayCircle,
  Clock,
  Users,
  Repeat,
  CheckCircle2,
  Smartphone,
  Monitor,
  Tablet,
  Search,
  Bell,
  FileDown,
  Award,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { LecturePerformanceItem, StudentWatchRecord } from "@/types/analytics";

interface LectureAnalyticsDetailModalProps {
  lecture: LecturePerformanceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string, type?: "success" | "info" | "error") => void;
}

export const LectureAnalyticsDetailModal: React.FC<LectureAnalyticsDetailModalProps> = ({
  lecture,
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<"retention" | "students" | "devices">("retention");
  const [studentSearch, setStudentSearch] = useState("");
  const [filterCompletion, setFilterCompletion] = useState<"all" | "completed" | "in_progress">("all");

  if (!isOpen || !lecture) return null;

  // Filter students in log
  const studentsList: StudentWatchRecord[] = lecture.studentsLog || [];
  const filteredStudents = studentsList.filter((st) => {
    const matchesSearch =
      st.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.phone.includes(studentSearch);
    const matchesComp =
      filterCompletion === "all" ||
      (filterCompletion === "completed" && st.completed) ||
      (filterCompletion === "in_progress" && !st.completed);
    return matchesSearch && matchesComp;
  });

  // Calculate SVG Retention Graph coordinates
  const retentionCurve = lecture.retentionCurve || [
    { minute: 0, percentage: 100 },
    { minute: Math.round(lecture.duration * 0.25), percentage: 88 },
    { minute: Math.round(lecture.duration * 0.5), percentage: 80 },
    { minute: Math.round(lecture.duration * 0.75), percentage: 74 },
    { minute: lecture.duration, percentage: 68 },
  ];

  const svgW = 600;
  const svgH = 180;
  const padX = 40;
  const padY = 25;
  const chartW = svgW - padX * 2;
  const chartH = svgH - padY * 2;

  const points = retentionCurve.map((pt, i) => {
    const x = padX + (i / (retentionCurve.length - 1)) * chartW;
    const y = padY + chartH - (pt.percentage / 100) * chartH;
    return { ...pt, x, y };
  });

  let lineD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const cpx = (p1.x + p2.x) / 2;
    lineD += ` C ${cpx} ${p1.y}, ${cpx} ${p2.y}, ${p2.x} ${p2.y}`;
  }
  const areaD = `${lineD} L ${points[points.length - 1].x} ${svgH - padY} L ${points[0].x} ${svgH - padY} Z`;

  // Devices
  const devices = lecture.deviceBreakdown || { mobile: 70, desktop: 25, tablet: 5 };

  const handleSendReminder = (st: StudentWatchRecord) => {
    onShowToast(`تم إرسال إشعار تذكير للطالب: ${st.studentName} بنجاح`, "success");
  };

  const handleExportSingleReport = () => {
    onShowToast(`جاري تجهيز تقرير أداء ${lecture.title} بصيغة PDF...`, "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 bg-[#FAFAFA] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6A00] shrink-0 shadow-2xs">
              <PlayCircle className="w-6 h-6 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                  {lecture.title}
                </h3>
                <span className="bg-orange-100/70 text-[#FF6A00] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                  {lecture.grade}
                </span>
                <span className="bg-gray-100 text-gray-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  {lecture.part}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-3 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  مدة المحاضرة: {lecture.duration} دقيقة
                </span>
                <span>•</span>
                <span>متوسط وقت المشاهدة الفعلي: {lecture.avgWatchMinutes} دقيقة</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer shrink-0"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Key Metrics Quick Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 sm:px-6 bg-white border-b border-gray-100 text-right">
          <div className="bg-[#F8F9FA] rounded-2xl p-3.5 border border-gray-200/60">
            <span className="block text-[11px] font-bold text-gray-400 mb-1">
              الأكواد المفعلة
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
              {lecture.activatedCodes.toLocaleString("ar-EG")}
            </span>
            <span className="text-[11px] text-[#FF6A00] font-bold block mt-0.5">
              طالب بدأ المشاهدة
            </span>
          </div>

          <div className="bg-[#F8F9FA] rounded-2xl p-3.5 border border-gray-200/60">
            <span className="block text-[11px] font-bold text-gray-400 mb-1">
              نسبة إكمال المحاضرة
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">
              {lecture.completionRate}%
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              أكملوا حتى النهاية
            </span>
          </div>

          <div className="bg-[#F8F9FA] rounded-2xl p-3.5 border border-gray-200/60">
            <span className="block text-[11px] font-bold text-gray-400 mb-1">
              مرات إعادة المقاطع
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-600">
              {lecture.replayCount.toLocaleString("ar-EG")}
            </span>
            <span className="text-[11px] text-amber-700 font-bold block mt-0.5">
              تكرار لفهم المسائل
            </span>
          </div>

          <div className="bg-[#F8F9FA] rounded-2xl p-3.5 border border-gray-200/60">
            <span className="block text-[11px] font-bold text-gray-400 mb-1">
              التقييم العام
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#FF6A00]">
              4.9 / 5
            </span>
            <span className="text-[11px] text-gray-500 font-bold block mt-0.5">
              بناءً على 418 تقييم
            </span>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-gray-100 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("retention")}
            className={`pb-3 text-xs sm:text-sm font-extrabold px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "retention"
                ? "border-[#FF6A00] text-[#FF6A00]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            منحنى استبقاء الجمهور (Retention Rate)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`pb-3 text-xs sm:text-sm font-extrabold px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "students"
                ? "border-[#FF6A00] text-[#FF6A00]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <span>سجل الطلاب ونسب الإكمال</span>
            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded-full text-[10px]">
              {studentsList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("devices")}
            className={`pb-3 text-xs sm:text-sm font-extrabold px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === "devices"
                ? "border-[#FF6A00] text-[#FF6A00]"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            الأجهزة والتوزيع التقني
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-gray-50/40">
          {/* TAB 1: Retention Curve */}
          {activeTab === "retention" && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs text-right">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-gray-400">
                    معدل انتباه الطلاب دقيقة بدقيقة
                  </span>
                  <h4 className="font-extrabold text-gray-900 text-sm">
                    منحنى استمرار المشاهدة عبر طول الفيديو
                  </h4>
                </div>

                <div className="w-full overflow-hidden select-none mb-3">
                  <svg
                    viewBox={`0 0 ${svgW} ${svgH}`}
                    className="w-full h-44 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="modalRetentionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[100, 75, 50, 25].map((lvl) => {
                      const y = padY + chartH - (lvl / 100) * chartH;
                      return (
                        <g key={lvl}>
                          <line
                            x1={padX}
                            y1={y}
                            x2={svgW - padX}
                            y2={y}
                            stroke="#E2E8F0"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={padX - 8}
                            y={y + 3}
                            fill="#94A3B8"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="end"
                          >
                            {lvl}%
                          </text>
                        </g>
                      );
                    })}

                    {/* Area under curve */}
                    <path d={areaD} fill="url(#modalRetentionGrad)" />

                    {/* Curve Line */}
                    <path
                      d={lineD}
                      fill="none"
                      stroke="#FF6A00"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Point circles & Topic Labels */}
                    {points.map((pt, idx) => (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4.5"
                          fill="#FFFFFF"
                          stroke="#FF6A00"
                          strokeWidth="2.5"
                        />
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          fill="#1E293B"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {pt.percentage}%
                        </text>
                        <text
                          x={pt.x}
                          y={svgH - 8}
                          fill="#64748B"
                          fontSize="9"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          د {pt.minute}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Key Retention Insights List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-right">
                    <span className="text-xs font-extrabold text-emerald-800 block mb-0.5">
                      أعلى استبقاء (96%)
                    </span>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      شهدت الدقائق الأولى استقراراً مرتفعاً جداً في الحضور دون أي تسرب، وهو مؤشر على قوة المقدمة التمهيدية.
                    </p>
                  </div>

                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-right">
                    <span className="text-xs font-extrabold text-amber-800 block mb-0.5">
                      نقطة انقطاع طفيفة (الدقيقة 70)
                    </span>
                    <p className="text-[11px] text-amber-700 font-medium">
                      لوحظ انخفاض بنسبة 4% عند بدء حل المسائل الحسابية الطويلة. يُوصى بتقسيم الفقرة إلى تمرينين مستقلين.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Students Watch Log */}
          {activeTab === "students" && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="ابحث باسم الطالب أو رقم الهاتف..."
                    className="w-full bg-[#F8F9FA] rounded-xl pr-10 pl-3.5 py-2 text-xs font-medium border border-gray-200/80 focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all text-right"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFilterCompletion("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      filterCompletion === "all"
                        ? "bg-[#FF6A00] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    الكل ({studentsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterCompletion("completed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      filterCompletion === "completed"
                        ? "bg-[#FF6A00] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    مكتمل
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterCompletion("in_progress")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      filterCompletion === "in_progress"
                        ? "bg-[#FF6A00] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    قيد المشاهدة
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#F8F9FA] text-gray-500 font-extrabold border-b border-gray-200/60">
                    <tr>
                      <th className="py-3 px-4">الطالب</th>
                      <th className="py-3 px-3">الهاتف</th>
                      <th className="py-3 px-3">نسبة الإكمال</th>
                      <th className="py-3 px-3">وقت المشاهدة</th>
                      <th className="py-3 px-3">درجة الكويز</th>
                      <th className="py-3 px-3">الجهاز</th>
                      <th className="py-3 px-3 text-left">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-orange-50/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-900">
                            {st.studentName}
                          </td>
                          <td className="py-3 px-3 text-gray-500 font-mono text-[11px]" dir="ltr">
                            {st.phone}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs w-9">
                                {st.watchProgress}%
                              </span>
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    st.watchProgress === 100
                                      ? "bg-emerald-500"
                                      : "bg-[#FF6A00]"
                                  }`}
                                  style={{ width: `${st.watchProgress}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-600 font-medium">
                            {st.totalWatchMinutes} دقيقة
                          </td>
                          <td className="py-3 px-3">
                            {st.quizScore ? (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                <Award className="w-3 h-3 text-emerald-600" />
                                {st.quizScore}/100
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[11px]">لم يمتحن</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-gray-500">
                            {st.device === "mobile" && (
                              <span className="inline-flex items-center gap-1">
                                <Smartphone className="w-3.5 h-3.5 text-gray-400" /> هاتف
                              </span>
                            )}
                            {st.device === "desktop" && (
                              <span className="inline-flex items-center gap-1">
                                <Monitor className="w-3.5 h-3.5 text-gray-400" /> كمبيوتر
                              </span>
                            )}
                            {st.device === "tablet" && (
                              <span className="inline-flex items-center gap-1">
                                <Tablet className="w-3.5 h-3.5 text-gray-400" /> لوحي
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-left">
                            <button
                              type="button"
                              onClick={() => handleSendReminder(st)}
                              className="text-[11px] font-bold text-[#FF6A00] hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="إرسال تذكير"
                            >
                              <Bell className="w-3 h-3" />
                              <span>تذكير</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-400 font-medium">
                          لا توجد نتائج مطابقة للبحث
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Device Breakdown */}
          {activeTab === "devices" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF6A00] flex items-center justify-center mb-3">
                  <Smartphone className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-2xl font-extrabold text-gray-900 mb-0.5">
                  {devices.mobile}%
                </span>
                <span className="text-xs font-bold text-gray-500 mb-2">
                  الهواتف الذكية (Mobile)
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  الخيار الأكثر شيوعاً بين طلاب الثانوية
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-700 flex items-center justify-center mb-3">
                  <Monitor className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-2xl font-extrabold text-gray-900 mb-0.5">
                  {devices.desktop}%
                </span>
                <span className="text-xs font-bold text-gray-500 mb-2">
                  الكمبيوتر وأجهزة اللابتوب
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  يفضلها الطلاب عند حل التدريبات ومتابعة المعمل
                </span>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                  <Tablet className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span className="text-2xl font-extrabold text-gray-900 mb-0.5">
                  {devices.tablet}%
                </span>
                <span className="text-xs font-bold text-gray-500 mb-2">
                  أجهزة التابلت (Tablets)
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  تشمل أجهزة تابلت الوزارة وأجهزة الآيباد
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleExportSingleReport}
            className="flex items-center gap-2 bg-[#F8F9FA] hover:bg-gray-100 text-gray-800 border border-gray-200 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <FileDown className="w-4 h-4 text-[#FF6A00]" />
            <span>تصدير تقرير المحاضرة (PDF)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-6 py-2.5 rounded-xl transition-colors cursor-pointer w-full sm:w-auto"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
