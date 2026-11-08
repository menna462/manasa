"use client";

import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-10 border-t border-gray-200/80 py-6 text-xs text-gray-500">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-right">
        <div>
          <span>جميع الحقوق محفوظة © منصة الأستاذ عماد حسين التعليمية 2027</span>
        </div>
        <div>
          <span className="font-medium text-gray-400">
            نظام إدارة المحتوى والتحكم في الأكواد v2.0
          </span>
        </div>
      </div>
    </footer>
  );
};
