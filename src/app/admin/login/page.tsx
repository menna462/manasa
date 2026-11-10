"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  AtSign,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Send,
} from "lucide-react";

import { adminApi } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Status / Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    router.prefetch("/admin");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني للوصول.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("يرجى إدخال كلمة المرور.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminApi.login(email.trim(), password.trim());
      setToastMessage(res.message || "تم تسجيل الدخول بنجاح! جاري الانتقال للوحة التحكم...");
      setTimeout(() => {
        router.push("/admin");
      }, 200);
    } catch (err: any) {
      setErrorMessage(err.message || "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      return;
    }
    setForgotSent(true);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setForgotSent(false);
      setToastMessage(`تم إرسال رابط استعادة كلمة المرور إلى ${forgotEmail}`);
    }, 1800);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F8F9FB] flex flex-col justify-between text-[#1A1D20] font-sans antialiased selection:bg-[#FF6A00] selection:text-white"
    >
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-700 border border-emerald-600 shadow-2xl shadow-emerald-900/30 text-white text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ── Top Header ── */}
      <header className="w-full px-6 py-6 sm:px-12 sm:py-8 flex items-center justify-between">
        {/* Right: Platform Logo & "الإدارة" Badge */}
        <div className="flex items-center gap-2.5">
          {/* Vertical orange capsule */}
          <div className="w-1.5 h-6 bg-[#FF6A00] rounded-full" />
          {/* Brand Name */}
          <span className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">
            عماد حسين
          </span>
          {/* Black "الإدارة" Badge */}
          <span className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-md tracking-wide">
            الإدارة
          </span>
        </div>

        {/* Left: Return to Main Platform Link */}
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-900 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors group cursor-pointer"
        >
          <span>العودة للمنصة الرئيسية</span>
          <span className="transition-transform group-hover:-translate-x-1">←</span>
        </Link>
      </header>

      {/* ── Centered Card Content ── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[430px] bg-white rounded-[28px] shadow-xl shadow-gray-200/60 border border-gray-100 p-7 sm:p-9 text-center animate-in fade-in zoom-in-95 duration-300">
          {/* Lock Icon Box with Orange Accent Dot */}
          <div className="relative inline-flex items-center justify-center w-13 h-13 bg-black rounded-2xl mb-4 shadow-md">
            <Lock className="w-6 h-6 text-white stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF6A00] rounded-full border-2 border-white" />
          </div>

          {/* Subtitle */}
          <p className="text-[#FF6A00] font-black text-xs tracking-wide">
            المنظومة التعليمية الرسمية
          </p>

          {/* Main Title */}
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1 mb-1 tracking-tight">
            لوحة التحكم — تسجيل الدخول
          </h1>

          {/* Description */}
          <p className="text-xs text-gray-400 font-medium mb-6">
            أدخل بيانات حسابك للوصول إلى أدوات الإدارة
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                البريد الإلكتروني / البريد الوظيفي{" "}
                <span className="text-[#FF6A00]">*</span>
              </label>
              <div className="relative flex items-center bg-[#F9FAFB] border border-gray-200 rounded-2xl focus-within:border-[#FF6A00] focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="admin@emadhussein.edu"
                  dir="ltr"
                  className="w-full py-3 px-4 pl-4 pr-11 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent font-mono text-right"
                  required
                />
                <div className="absolute right-3.5 text-gray-400 pointer-events-none">
                  <AtSign className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                كلمة المرور <span className="text-[#FF6A00]">*</span>
              </label>
              <div className="relative flex items-center bg-[#F9FAFB] border border-gray-200 rounded-2xl focus-within:border-[#FF6A00] focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                {/* Lock icon on right */}
                <div className="absolute right-3.5 text-gray-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="أدخل كلمة المرور"
                  dir="ltr"
                  autoComplete="current-password"
                  className="w-full py-3 px-11 text-xs sm:text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent tracking-wider text-right"
                  required
                />

                {/* Eye toggle button on left */}
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute left-3.5 text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors cursor-pointer"
                  title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Remember Me & Forgot Password Row */}
            <div className="flex items-center justify-between text-xs pt-1 pb-1">
              {/* Remember Me (Right in RTL) */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#FF6A00] cursor-pointer"
                />
                <span className="text-gray-600 font-semibold text-[11px] sm:text-xs">
                  تذكرني على هذا الجهاز
                </span>
              </label>

              {/* Forgot Password (Left in RTL) */}
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setIsForgotModalOpen(true);
                }}
                className="text-[#FF6A00] hover:text-[#E55F00] font-bold text-[11px] sm:text-xs transition-colors hover:underline cursor-pointer"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF6A00] hover:bg-[#E55F00] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice Pill */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1.5 bg-[#F3F4F6]/80 border border-gray-200/60 text-gray-500 text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-2xs">
              <Lock className="w-3 h-3 text-gray-700 stroke-[2.2]" />
              <span>منطقة مخصصة للمشرفين والمصرح لهم فقط</span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Empty footer spacer for balanced vertical alignment ── */}
      <footer className="w-full py-4 text-center text-[11px] text-gray-400 font-medium">
        منصة الأستاذ عماد حسين التعليمية © {new Date().getFullYear()} — جميع الحقوق محفوظة
      </footer>

      {/* ── Forgot Password Modal ── */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-[#FF6A00] flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">
                  استعادة كلمة المرور
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleForgotPasswordSubmit} className="p-6 space-y-4 text-right">
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                أدخل البريد الإلكتروني الوظيفي المرتبط بحساب الأدمن لإرسال رابط إعادة تعيين كلمة المرور:
              </p>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@emadhussein.edu"
                  dir="ltr"
                  required
                  className="w-full bg-[#F9FAFB] border border-gray-200 rounded-xl py-3 px-4 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF6A00] focus:bg-white text-right font-mono"
                />
              </div>

              {forgotSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>تم إرسال رابط استعادة كلمة المرور بنجاح!</span>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="px-5 py-2.5 rounded-xl bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-orange-300/40 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال الرابط</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
