"use client";

import React, { useState } from "react";
import { GradeDistributionItem } from "@/types/analytics";
import { gradeDistributionData } from "@/data/analyticsData";

interface GradeDistributionDonutChartProps {
  data?: GradeDistributionItem[];
  totalCodes?: number;
}

export const GradeDistributionDonutChart: React.FC<GradeDistributionDonutChartProps> = ({
  data,
  totalCodes,
}) => {
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  // Use API data if available, otherwise fall back to mock
  const chartData = data && data.length > 0 ? data : gradeDistributionData;
  const displayTotal = totalCodes ?? chartData.reduce((sum, d) => sum + d.codesCount, 0);

  // SVG Donut calculation
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
          توزيع الأكواد حسب الصفوف
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          الحصة النسبية لكل مرحلة دراسية
        </p>
      </div>

      {/* Donut Chart Visualization */}
      <div className="relative flex items-center justify-center my-2">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 select-none"
        >
          {chartData.map((item) => {
            const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += item.percentage;

            const isHovered = hoveredGrade === item.gradeName;

            return (
              <circle
                key={item.gradeName}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredGrade(item.gradeName)}
                onMouseLeave={() => setHoveredGrade(null)}
              />
            );
          })}
        </svg>

        {/* Center Text (Counter + Label) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-none">
            {displayTotal > 0 ? displayTotal.toLocaleString() : "0"}
          </span>
          <span className="text-[11px] font-bold text-gray-400 mt-1">
            إجمالي التفعيلات
          </span>
        </div>
      </div>

      {/* Legend & Breakdown Rows */}
      <div className="space-y-3 pt-3 border-t border-gray-50">
        {chartData.map((item) => {
          const isHovered = hoveredGrade === item.gradeName;
          return (
            <div
              key={item.gradeName}
              onMouseEnter={() => setHoveredGrade(item.gradeName)}
              onMouseLeave={() => setHoveredGrade(null)}
              className={`flex items-center justify-between p-1.5 rounded-xl transition-colors cursor-pointer ${
                isHovered ? "bg-gray-50" : ""
              }`}
            >
              {/* Right: Dot & Grade Name */}
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-bold text-gray-800">
                  {item.gradeName}
                </span>
              </div>

              {/* Left: Percentage & Count */}
              <div className="text-left">
                <span className="block text-xs font-extrabold text-gray-900">
                  {item.percentage}%
                </span>
                <span className="block text-[10px] font-medium text-gray-400 leading-none">
                  {item.codesCount.toLocaleString()} كود
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
