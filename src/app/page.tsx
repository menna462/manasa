"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
  MessageCircle,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";

import { studentApi, curriculumApi } from "@/lib/api";
import { GradeLevel } from "@/types/curriculum";

export default function StudentHomePage() {
  const router = useRouter();

  // Code Input State
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  // Real curriculum grade levels from database
  const [gradesList, setGradesList] = useState<GradeLevel[]>([]);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);

  React.useEffect(() => {
    const fetchGrades = async () => {
      try {
        setIsLoadingGrades(true);
        const res = await curriculumApi.getTree();
        if (res.data && Array.isArray(res.data)) {
          setGradesList(res.data);
        }
      } catch (err) {
        console.warn("Could not load public curriculum tree:", err);
      } finally {
        setIsLoadingGrades(false);
      }
    };
    fetchGrades();
  }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setErrorMessage("يرجى إدخال كود التفعيل المطبوع على الكارت.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await studentApi.verifyCode({
        code: trimmedCode,
        student_name: "طالب المنصة",
        device: "desktop",
      });

      router.push(`/lecture/${encodeURIComponent(res.code)}`);
    } catch (err: any) {
      setErrorMessage(err.message || "كود التفعيل غير صالح أو منتهي الصلاحية.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FDFDFE] text-[#1A1D20] font-sans antialiased selection:bg-[#FF6A00] selection:text-white flex flex-col justify-between"
    >
      {/* ── 1. Top Navbar Header ── */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Right: Platform Logo & Official Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <span className="font-black text-gray-900 text-xl sm:text-2xl tracking-tight group-hover:text-[#FF6A00] transition-colors">
                عماد حسين
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
            </Link>

            <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 text-[#FF6A00] text-[11px] font-bold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
              المنصة التعليمية الرسمية
            </span>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeNav === "home"
                  ? "text-[#FF6A00] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF6A00] after:rounded-full"
                  : "hover:text-[#FF6A00]"
              }`}
            >
              الرئيسية
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("grades")}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeNav === "grades"
                  ? "text-[#FF6A00] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF6A00] after:rounded-full"
                  : "hover:text-[#FF6A00]"
              }`}
            >
              المراحل الدراسية
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className={`transition-colors relative py-1 cursor-pointer ${
                activeNav === "how-it-works"
                  ? "text-[#FF6A00] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:bg-[#FF6A00] after:rounded-full"
                  : "hover:text-[#FF6A00]"
              }`}
            >
              كيفية التفعيل
            </button>

            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="hover:text-[#FF6A00] transition-colors py-1 cursor-pointer"
            >
              اتصل بنا
            </button>
          </nav>

          {/* Left: Support & Hotline */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="bg-orange-50 hover:bg-orange-100/90 text-[#FF6A00] border border-orange-200/80 font-bold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Phone className="w-4 h-4 stroke-[2.3]" />
              <span className="hidden sm:inline">الدعم الفني:</span>
              <span className="font-mono font-bold" dir="ltr">01032148482</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Hero & Activation Section ── */}
      <section
        id="home"
        className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100/40 via-[#FDFDFE] to-[#FDFDFE]"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Welcome Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 border border-orange-200/90 text-[#FF6A00] text-xs font-black px-4 py-1.5 rounded-full shadow-xs mb-5 animate-in fade-in duration-300">
            <span>✨</span>
            <span>المنصة الأقوى لطلاب الثانوية العامة</span>
          </div>

          {/* Big Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.25] mb-4">
            منصة الأستاذ{" "}
            <span className="text-[#FF6A00] inline-block drop-shadow-xs">
              عماد حسين
            </span>{" "}
            للتعليم الثانوي
          </h1>

          {/* Hero Subtitle */}
          <p className="text-xs sm:text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            منصتك الأولى لمتابعة الدروس، المراجعات، والمحاضرات التفاعلية بأعلى
            جودة.
          </p>

          {/* ── 3. Lecture Code Activation Card ── */}
          <div className="w-full max-w-[480px] mx-auto bg-white rounded-[32px] border border-gray-100/90 shadow-2xl shadow-orange-500/10 p-7 sm:p-9 text-center transition-all">
            {/* Orange Play Button Icon */}
            <div className="w-14 h-14 bg-[#FF6A00] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 mx-auto mb-4 transform hover:scale-105 transition-transform">
              <Play className="w-6 h-6 fill-white text-white ml-0.5" />
            </div>

            {/* Card Title */}
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              تفعيل كود المحاضرة
            </h2>

            {/* Card Helper text */}
            <p className="text-xs text-gray-400 font-medium mt-1 mb-6">
              أدخل الكود المكون من 8 أو 10 خانات لبدء الدرس فوراً
            </p>

            {/* Form */}
            <form onSubmit={handleActivate} className="text-right space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  كود المحاضرة
                </label>
                <div className="relative flex items-center bg-[#F9FAFB] border border-gray-200 rounded-2xl focus-within:border-[#FF6A00] focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder="8 أرقام (مثال: 48392310)"
                    dir="ltr"
                    className="w-full py-3.5 px-4 pr-11 text-center font-mono text-sm sm:text-base font-black text-gray-800 placeholder-gray-400 uppercase tracking-widest focus:outline-none bg-transparent"
                  />
                  <div className="absolute right-3.5 text-gray-400 pointer-events-none">
                    <KeyRound className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-500 font-bold p-2 bg-red-50 rounded-xl">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6A00] hover:bg-[#E55F00] active:scale-[0.99] text-white font-black text-base py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري التحقق من الكود...</span>
                  </>
                ) : (
                  <>
                    <span>تشغيل المحاضرة الآن</span>
                    <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>

            {/* Support Link */}
            <div className="mt-6 text-xs text-gray-400 font-medium flex items-center justify-center gap-1">
              <span>تواجه مشكلة في الكود؟</span>
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(true)}
                className="text-[#FF6A00] font-bold hover:underline cursor-pointer"
              >
                تواصل مع الدعم الفني 🎧
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. How It Works Section ── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          {/* Step Section Pill */}
          <div className="inline-block bg-orange-50/90 border border-orange-200/80 text-[#FF6A00] text-xs font-black px-3.5 py-1 rounded-full mb-2">
            خطوات بسيطة وسريعة
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-10">
            كيفية تفعيل كود المحاضرة في 3 خطوات
          </h3>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-[#FAFBFD] hover:bg-orange-50/30 border border-gray-200/80 hover:border-orange-200 rounded-2xl p-5 flex items-center justify-between text-right transition-all group shadow-2xs">
              <div>
                <span className="text-[11px] font-bold text-gray-400 block mb-0.5">
                  الخطوة الأولى
                </span>
                <h4 className="text-sm font-extrabold text-gray-900 group-hover:text-[#FF6A00] transition-colors">
                  احصل على الكود من السنتر
                </h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF6A00] font-black text-sm flex items-center justify-center shrink-0">
                1
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAFBFD] hover:bg-orange-50/30 border border-gray-200/80 hover:border-orange-200 rounded-2xl p-5 flex items-center justify-between text-right transition-all group shadow-2xs">
              <div>
                <span className="text-[11px] font-bold text-gray-400 block mb-0.5">
                  الخطوة الثانية
                </span>
                <h4 className="text-sm font-extrabold text-gray-900 group-hover:text-[#FF6A00] transition-colors">
                  أدخل الكود هنا
                </h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF6A00] font-black text-sm flex items-center justify-center shrink-0">
                2
              </div>
            </div>

            {/* Step 3 (Highlighted) */}
            <div className="bg-white hover:bg-orange-50/40 border-2 border-[#FF6A00] rounded-2xl p-5 flex items-center justify-between text-right transition-all shadow-sm group">
              <div>
                <span className="text-[11px] font-bold text-[#FF6A00] block mb-0.5">
                  الخطوة الثالثة
                </span>
                <h4 className="text-sm font-black text-gray-900">
                  ابدأ المشاهدة فوراً
                </h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#FF6A00] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-orange-300">
                3
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Real Grade Levels Section Anchor ── */}
      <section id="grades" className="py-12 px-4 sm:px-6 bg-[#FAFBFC] border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
            المراحل الدراسية المتاحة
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mb-8">
            محتوى تعليمي شامل ومحدث وفق أحدث أنظمة امتحانات الثانوية العامة
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
            {isLoadingGrades ? (
              <div className="col-span-3 py-8 text-center text-gray-400 text-xs font-medium">
                جاري تحميل المراحل الدراسية من قاعدة البيانات...
              </div>
            ) : gradesList.length === 0 ? (
              <div className="col-span-3 py-8 text-center text-gray-400 text-xs font-medium">
                لا توجد مراحل دراسية مسجلة حالياً
              </div>
            ) : (
              gradesList.map((grade, idx) => (
                <div
                  key={grade.id}
                  className={`p-5 bg-white rounded-2xl transition-all shadow-xs ${
                    idx === 0
                      ? "border-2 border-orange-200 shadow-sm"
                      : "border border-gray-200/80 hover:shadow-md"
                  }`}
                >
                  <span className="text-xs font-bold text-[#FF6A00] block mb-1">
                    المرحلة {idx === 0 ? "الأولى" : idx === 1 ? "الثانية" : idx === 2 ? "الثالثة" : `${idx + 1}`}
                  </span>
                  <h4 className="text-base font-black text-gray-900">{grade.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {grade.subtitle || "تأسيس شامل ومناهج مبسطة مع اختبارات دورية ومذكرات PDF."}
                  </p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400 font-semibold">
                    <span>{grade.unitsCount || grade.units?.length || 0} أبواب / وحدات</span>
                    <span>•</span>
                    <span>{grade.lessonsCount || 0} محاضرات</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── 5. Dark Footer Section ── */}
      <footer className="w-full bg-[#0B0D11] text-white border-t-2 border-[#FF6A00] pt-14 pb-6 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1240px] mx-auto">
          {/* Main 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 pb-12 border-b border-gray-800/80">
            {/* Col 1: Platform Brand & Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white tracking-tight">
                  عماد حسين
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
              </div>

              <p className="text-xs leading-relaxed text-gray-400 font-medium">
                المنصة التعليمية الرسمية المتخصصة في تقديم أقوى شروحات ومراجعات
                الثانوية العامة بطرق علمية حديثة، مصممة لمساعدة الطالب على التميز
                والتفوق الدراسي.
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <span className="font-semibold text-gray-300">
                  منصة آمنة ومحمية بالكامل — مخصصة لطلابنا
                </span>
              </div>
            </div>

            {/* Col 2: Quick Links */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-4 bg-[#FF6A00] rounded-full" />
                <h4 className="text-sm font-extrabold text-white">روابط سريعة</h4>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-400 font-semibold">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-[#FF6A00]">◀</span>
                    <span>الرئيسية</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("grades")}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-[#FF6A00]">◀</span>
                    <span>المراحل الثانوية</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("how-it-works")}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-[#FF6A00]">◀</span>
                    <span>إرشادات كود المحاضرة</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsSupportModalOpen(true)}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="text-[#FF6A00]">◀</span>
                    <span>شروط الاستخدام والخصوصية</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Technical Support */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-[#FF6A00] rounded-full" />
                <h4 className="text-sm font-extrabold text-white">
                  الدعم الفني والمساعدة
                </h4>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                فريق الدعم الفني متواجد طوال أيام الأسبوع للإجابة على استفسارات
                الطلاب وأولياء الأمور ومساعدتكم في تشغيل المحاضرات.
              </p>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/201032148482"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#165534]/70 hover:bg-[#165534] border border-[#22c55e]/40 text-[#4ade80] rounded-xl py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تحدث مع الدعم عبر واتساب</span>
              </a>

              {/* Direct Hotline Box */}
              <a
                href="tel:01032148482"
                className="bg-[#141824] hover:bg-[#1a1f30] border border-gray-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-gray-400 font-mono transition-colors"
              >
                <span className="font-bold text-white tracking-wider" dir="ltr">
                  01032148482
                </span>
                <span className="font-sans text-[11px] text-gray-400">
                  الخط المباشر:
                </span>
              </a>
            </div>
          </div>

          {/* Copyright Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500 font-medium">
            <p>
              جميع الحقوق محفوظة © منصة الأستاذ عماد حسين التعليمية 2027
            </p>
            <p className="text-gray-600">
              الجودة والأمان التعليمي • برمجة وتطوير المنصة
            </p>
          </div>
        </div>
      </footer>

      {/* ── Support Modal Dialog ── */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">
                  الدعم الفني والمساعدة
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-right">
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                إذا واجهتك أي مشكلة أثناء إدخال كود المحاضرة أو تشغيل الفيديو، يمكنك التواصل مباشرة مع مسؤولي الدعم:
              </p>

              <div className="space-y-2.5">
                <a
                  href="https://wa.me/201032148482"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>خدمة عملاء واتساب (متاح 24/7)</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                </a>

                <a
                  href="tel:01032148482"
                  className="w-full p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#FF6A00]" />
                    <span>الاتصال الهاتفي المباشر</span>
                  </span>
                  <span className="font-mono text-gray-600" dir="ltr">01032148482</span>
                </a>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-[11px] text-[#FF6A00] font-semibold leading-relaxed">
                💡 نصيحة: تأكد من كتابة الكود بدقة باللغة الإنجليزية وعدم مشاركة الكود مع أي جهاز آخر لأن كل كود يعمل على جهاز واحد فقط.
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
