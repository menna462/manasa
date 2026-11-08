"use client";

import React, { useState, useMemo } from "react";
import {
  initialDailyActivations,
  weeklyActivationsData,
  todayHourlyActivationsData,
} from "@/data/analyticsData";
import { TimeRangeFilter } from "@/types/analytics";

import { DailyActivationData } from "@/types/analytics";

interface DailySalesLineChartProps {
  data?: DailyActivationData[];
  timeRange?: TimeRangeFilter;
  selectedGrade?: string;
}

export const DailySalesLineChart: React.FC<DailySalesLineChartProps> = ({
  data,
  timeRange = "month",
  selectedGrade = "الصف الثالث الثانوي (العام)",
}) => {
  // Select dataset based on API data or time range
  const activeDataset = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    switch (timeRange) {
      case "today":
        return todayHourlyActivationsData;
      case "week":
        return weeklyActivationsData;
      case "month":
      case "all":
      default:
        return initialDailyActivations;
    }
  }, [data, timeRange]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(
    activeDataset.findIndex((d) => d.isPeak) >= 0
      ? activeDataset.findIndex((d) => d.isPeak)
      : Math.floor(activeDataset.length / 2)
  );

  // Dimensions for coordinate mapping
  const width = 800;
  const height = 240;
  const padLeft = 40;
  const padRight = 60;
  const padTop = 30;
  const padBottom = 30;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const maxVal = Math.max(160, ...activeDataset.map((d) => d.codes * 1.15));

  const points = activeDataset.map((item, idx) => {
    // In RTL, first item is on the right, last item is on the left
    const x = width - padRight - (idx / Math.max(1, activeDataset.length - 1)) * chartW;
    const y = padTop + chartH - (item.codes / maxVal) * chartH;
    return { ...item, x, y };
  });

  // Generate smooth SVG cubic Bezier path
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(points);
  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length - 1].x} ${height - padBottom} L ${points[0].x} ${height - padBottom} Z` : "";

  // Secondary curve (cumulative trend / background line)
  const secondaryPoints = points.map((p, i) => ({
    x: p.x,
    y: padTop + chartH - ((30 + (i / Math.max(1, points.length - 1)) * 90) / maxVal) * chartH,
  }));
  const secondaryPath = createSmoothPath(secondaryPoints);

  // Peak Point
  const peakPoint = points.find((p) => p.isPeak) || points[Math.floor(points.length / 2)];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
            معدل استهلاك الأكواد والمبيعات اليومية
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            تتبع حجم التفعيل الفعلي للأكواد مقابل منحنى العائدات لشهر مايو
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#FF6A00]" />
            <span>الأكواد المستهلكة (كود)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-gray-800" />
            <span>منحنى الإيراد التراكمي</span>
          </div>
        </div>
      </div>

      {/* Floating Peak Banner */}
      <div className="flex items-center justify-end mb-2">
        <div className="inline-flex items-center gap-1.5 bg-orange-50/70 border border-orange-200/70 px-3 py-1 rounded-full text-[11px] font-extrabold text-gray-800 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-ping" />
          <span className="text-[#FF6A00]">ذروة التفعيل:</span>
          <span>
            {peakPoint
              ? `${peakPoint.day} (${peakPoint.codes} كوداً مستهلكاً)`
              : "تسجيل الذروة"}
          </span>
        </div>
      </div>

      {/* Responsive SVG Chart Container */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Gradient for area fill */}
            <linearGradient id="orangeAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#FF6A00" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.0" />
            </linearGradient>

            <filter id="shadowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#FF6A00" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 50, 100, 150].map((val) => {
            const y = padTop + chartH - (val / maxVal) * chartH;
            return (
              <g key={val}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight + 10}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? "none" : "3 3"}
                />
                {/* Y-Axis Label on the right */}
                <text
                  x={width - padRight + 20}
                  y={y + 4}
                  textAnchor="start"
                  fontSize="11"
                  fontWeight="bold"
                  fill="#9CA3AF"
                  fontFamily="inherit"
                >
                  {val === 0 ? "0" : val === 150 ? "150" : `${val} كود`}
                </text>
              </g>
            );
          })}

          {/* Secondary cumulative line (smooth dark gray curve) */}
          <path
            d={secondaryPath}
            fill="none"
            stroke="#1E293B"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#orangeAreaGrad)" />

          {/* Main Orange Smooth Curve */}
          <path
            d={linePath}
            fill="none"
            stroke="#FF6A00"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#shadowFilter)"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            const isPeak = pt.isPeak;

            return (
              <g
                key={pt.day}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredIndex(idx)}
              >
                {/* Invisible hover target */}
                <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                {/* Outer halo on hover or peak */}
                {(isHovered || isPeak) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isPeak ? "8" : "6"}
                    fill="#FF6A00"
                    opacity="0.25"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isPeak ? "5" : isHovered ? "4.5" : "3"}
                  fill={isPeak ? "#FF6A00" : isHovered ? "#FF6A00" : "#FFFFFF"}
                  stroke="#FF6A00"
                  strokeWidth={isPeak ? "2" : "2"}
                />

                {/* Special Peak Label on 16 May */}
                {isPeak && (
                  <g>
                    {/* Black badge below the peak point */}
                    <rect
                      x={pt.x - 18}
                      y={pt.y + 12}
                      width="36"
                      height="20"
                      rx="6"
                      fill="#111827"
                    />
                    <text
                      x={pt.x}
                      y={pt.y + 26}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="bold"
                      fill="#FFFFFF"
                      fontFamily="monospace"
                    >
                      142
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* X-Axis Day Labels */}
          {points.map((pt) => {
            const isPeak = pt.isPeak;
            return (
              <text
                key={`label-${pt.day}`}
                x={pt.x}
                y={height - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight={isPeak ? "800" : "600"}
                fill={isPeak ? "#FF6A00" : "#6B7280"}
                fontFamily="inherit"
              >
                {pt.day}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Card if hovering non-peak point */}
        {hoveredIndex !== null && hoveredIndex !== 4 && (
          <div
            className="absolute pointer-events-none bg-gray-900 text-white rounded-xl px-3 py-1.5 text-[11px] font-bold shadow-xl border border-gray-700 transition-all z-20"
            style={{
              top: `${Math.max(10, points[hoveredIndex].y - 45)}px`,
              left: `${points[hoveredIndex].x - 45}px`,
            }}
          >
            <div>{points[hoveredIndex].day}: {points[hoveredIndex].codes} كود</div>
            <div className="text-orange-400 text-[10px]">
              {points[hoveredIndex].revenue.toLocaleString()} ج.م
            </div>
          </div>
        )}
      </div>

      {/* Chart Footer Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 mt-2 border-t border-gray-50 text-xs font-bold">
        <span className="text-gray-400 text-[11px]">
          * تم احتساب البيانات استناداً إلى عمليات التفعيل المعتمدة داخل قاعدة البيانات
        </span>

        <button
          type="button"
          onClick={() => alert("سيتم فتح تفاصيل التفعيل لجميع الأيام قريباً")}
          className="text-[#FF6A00] hover:text-[#E55F00] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>عرض تفاصيل الأيام بالتفصيل</span>
          <span>←</span>
        </button>
      </div>
    </div>
  );
};
