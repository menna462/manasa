"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Play,
  ArrowRight,
  ShieldCheck,
  FileText,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  HelpCircle,
  Sparkles,
} from "lucide-react";

import { studentApi } from "@/lib/api";

interface LessonPayload {
  id: string;
  title: string;
  description?: string | null;
  duration?: string;
  durationSeconds?: number;
  videoSource?: string;
  videoUrl?: string | null;
  videoProvider?: string;
  hasPdf?: boolean;
  pdfTitle?: string | null;
  pdfUrl?: string | null;
  gradeTitle?: string | null;
  unitTitle?: string | null;
}

interface ProgressPayload {
  currentSeconds: number;
  watchProgress: number;
  completed: boolean;
}

interface ValidityPayload {
  validityDays: number;
  status: string;
  activatedAt?: string | null;
  expiresAt?: string | null;
}

/**
 * دالة استخراج وتنسيق رابط الفيديو الحقيقي سواء كان يوتيوب أو سيرفر مباشر أو iframe
 */
function parseEmbedVideo(url?: string | null): {
  type: "youtube" | "iframe" | "video";
  src: string;
} | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // التحقق من روابط YouTube بمختلف صيغها
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // ملفات فيديو مباشرة MP4 / WebM
  if (
    trimmed.endsWith(".mp4") ||
    trimmed.endsWith(".webm") ||
    trimmed.includes(".mp4?")
  ) {
    return {
      type: "video",
      src: trimmed,
    };
  }

  // تضمين سيرفر خارجي iframe (Bunny Stream / Cloudflare / Vimeo / etc.)
  return {
    type: "iframe",
    src: trimmed,
  };
}

export default function LectureViewerPage() {
  const params = useParams();
  const router = useRouter();

  const rawCode = (params?.code as string) || "";
  const studentCode = decodeURIComponent(rawCode).trim().toUpperCase();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [lesson, setLesson] = useState<LessonPayload | null>(null);
  const [progress, setProgress] = useState<ProgressPayload>({
    currentSeconds: 0,
    watchProgress: 0,
    completed: false,
  });
  const [validity, setValidity] = useState<ValidityPayload | null>(null);

  // العلامة المائية العائمة لمكافحة تصوير الشاشة
  const [watermarkPos, setWatermarkPos] = useState({ top: 15, right: 15 });

  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.floor(10 + Math.random() * 65),
        right: Math.floor(10 + Math.random() * 65),
      });
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  // جلب المحاضرة الحقيقية المرتبطة بهذا الكود من الباك إند
  useEffect(() => {
    if (!studentCode) {
      setErrorMessage("لم يتم توفير كود تفعيل صحيح.");
      setIsLoading(false);
      return;
    }

    const fetchLecture = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await studentApi.getLecture(studentCode);

        if (res.lesson) {
          setLesson(res.lesson);
        } else {
          setErrorMessage("لم يتم العثور على محاضرة مرتبطة بهذا الكود.");
        }

        if (res.progress) {
          setProgress(res.progress);
        }

        if (res.validity) {
          setValidity(res.validity);
        }
      } catch (err: any) {
        setErrorMessage(
          err.message || "كود التفعيل غير صالح أو انتهت صلاحيته أو حدث خطأ أثناء جلب الدرس."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecture();
  }, [studentCode]);

  // تحديث نسبة الإنجاز في الباك إند
  const handleMarkComplete = async () => {
    try {
      const nextProgress = 100;
      setProgress((prev) => ({
        ...prev,
        watchProgress: nextProgress,
        completed: true,
      }));

      await studentApi.updateProgress({
        code: studentCode,
        lesson_id: lesson?.id ? Number(lesson.id) : 1,
        current_seconds: lesson?.durationSeconds || 3600,
        watch_progress: nextProgress,
        device: "desktop",
      });
    } catch (err) {
      console.warn("Could not sync progress with backend:", err);
    }
  };

  const parsedVideo = parseEmbedVideo(lesson?.videoUrl);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0F1117] text-[#E5E7EB] font-sans antialiased selection:bg-[#FF6A00] selection:text-white flex flex-col justify-between"
    >
      {/* ── 1. Top Navbar Header ── */}
      <header className="w-full bg-[#161922] border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Right: Platform Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <span className="font-black text-white text-xl sm:text-2xl tracking-tight group-hover:text-[#FF6A00] transition-colors">
                عماد حسين
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
            </Link>

            <span className="inline-flex items-center gap-1.5 bg-orange-950/40 border border-orange-500/30 text-[#FF6A00] text-[11px] font-bold px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
              المنصة التعليمية الرسمية
            </span>
          </div>

          {/* Left: Code badge and Return Home link */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#1C202B] border border-gray-700/80 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-400 font-sans">كود التفعيل:</span>
              <span className="text-white font-bold tracking-widest">{studentCode}</span>
            </div>

            <Link
              href="/"
              className="bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>الرئيسية</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── 2. Main Content Area ── */}
      <main className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {isLoading ? (
          /* Loading State */
          <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-[#FF6A00] animate-spin" />
            <p className="text-sm font-bold text-gray-300">
              جاري التحقق من كود المحاضرة وتحميل مشغل الفيديو...
            </p>
          </div>
        ) : errorMessage || !lesson ? (
          /* Error State */
          <div className="min-h-[400px] max-w-lg mx-auto flex flex-col items-center justify-center text-center p-8 bg-[#1A1D26] border border-red-500/20 rounded-3xl mt-10">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">تعذر فتح المحاضرة</h2>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              {errorMessage || "تأكد من كتابة الكود بشكل صحيح أو تواصل مع الدعم الفني."}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="bg-[#FF6A00] hover:bg-[#E55F00] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
              >
                العودة وإدخال كود آخر
              </Link>
              <a
                href="https://wa.me/201032148482"
                target="_blank"
                rel="noreferrer"
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
              >
                تواصل مع الدعم الفني
              </a>
            </div>
          </div>
        ) : (
          /* Real Lesson View */
          <div className="space-y-6">
            {/* Top Breadcrumb & Grade Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-800/80">
              <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">
                  الرئيسية
                </Link>
                {lesson.gradeTitle && (
                  <>
                    <span>◀</span>
                    <span className="text-gray-300">{lesson.gradeTitle}</span>
                  </>
                )}
                {lesson.unitTitle && (
                  <>
                    <span>◀</span>
                    <span className="text-gray-300">{lesson.unitTitle}</span>
                  </>
                )}
                <span>◀</span>
                <span className="text-[#FF6A00] font-bold">{lesson.title}</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                {lesson.duration && (
                  <span className="inline-flex items-center gap-1.5 text-gray-300 bg-[#1C202B] px-3 py-1 rounded-lg border border-gray-700/60 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#FF6A00]" />
                    المدة: {lesson.duration}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  كود مفعل ونشط
                </span>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">
                  {lesson.description}
                </p>
              )}
            </div>

            {/* ── Real Video Player Container ── */}
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 group">
              {/* Floating Anti-Piracy Watermark */}
              <div
                className="absolute pointer-events-none select-none transition-all duration-1000 z-30 opacity-45 bg-black/75 backdrop-blur-xs text-white text-[10px] sm:text-xs font-mono font-bold px-3 py-1 rounded-xl border border-white/20"
                style={{
                  top: `${watermarkPos.top}%`,
                  right: `${watermarkPos.right}%`,
                }}
              >
                <span>عماد حسين • كود: </span>
                <span className="text-[#FF6A00] tracking-wider">{studentCode}</span>
              </div>

              {/* Video Player Display */}
              {parsedVideo?.type === "youtube" ? (
                <iframe
                  src={parsedVideo.src}
                  title={lesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : parsedVideo?.type === "video" ? (
                <video
                  src={parsedVideo.src}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full object-contain bg-black"
                />
              ) : parsedVideo?.type === "iframe" ? (
                <iframe
                  src={parsedVideo.src}
                  title={lesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* No video URL state */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#151821]">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF6A00]/10 text-[#FF6A00] flex items-center justify-center mb-3">
                    <Play className="w-8 h-8 fill-[#FF6A00]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    جاري رفع ومعالجة فيديو المحاضرة
                  </h3>
                  <p className="text-xs text-gray-400 max-w-md">
                    تم تفعيل كودك بنجاح. إذا لم يبدأ الفيديو تلقائياً، يرجى التواصل مع فريق الدعم الفني للمنصة.
                  </p>
                </div>
              )}
            </div>

            {/* ── Actions & Handout Section ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* 1. ملزمة ومذكرة المحاضرة (PDF) */}
              {lesson.hasPdf && lesson.pdfUrl ? (
                <div className="bg-[#161922] border border-gray-800 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-[#FF6A00] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 stroke-[2.3]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-orange-400 block mb-0.5">
                        ملزمة ومذكرة المحاضرة المرفقة
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[220px] sm:max-w-[260px]">
                        {lesson.pdfTitle || "تحميل ملزمة المحاضرة (PDF)"}
                      </h4>
                    </div>
                  </div>

                  <a
                    href={lesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="bg-[#FF6A00] hover:bg-[#E55F00] active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm shadow-orange-500/20 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الملزمة</span>
                  </a>
                </div>
              ) : (
                <div className="bg-[#161922] border border-gray-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-800/70 text-gray-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block mb-0.5">
                        الملزمة الدراسية
                      </span>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-300">
                        لا توجد ملزمة مرفقة لهذه المحاضرة
                      </h4>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-800/80 border border-gray-700/60 px-3 py-1.5 rounded-xl whitespace-nowrap">
                    لا يوجد ملف مرفق
                  </span>
                </div>
              )}

              {/* 2. نسبة الإنجاز والمشاهدة الفعلية */}
              <div className="bg-[#161922] border border-gray-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-300">
                    نسبة إكمال الدرس:
                  </span>
                  <span className="text-xs font-mono font-extrabold text-[#FF6A00]">
                    {progress.watchProgress}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-[#FF6A00] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, progress.watchProgress))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>
                    {progress.completed
                      ? "✅ اكتملت مشاهدة المحاضرة بنجاح"
                      : "يتم حفظ نسبة المشاهدة تلقائياً في حسابك"}
                  </span>

                  {!progress.completed && (
                    <button
                      type="button"
                      onClick={handleMarkComplete}
                      className="text-xs font-bold text-[#FF6A00] hover:underline cursor-pointer"
                    >
                      تأكيد إنهاء المحاضرة ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── 3. Clean Footer ── */}
      <footer className="w-full bg-[#12141C] text-gray-400 border-t border-gray-800 py-5 px-4 text-xs">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <p>
            جميع الحقوق محفوظة © منصة الأستاذ عماد حسين التعليمية {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4 text-gray-500">
            <span>منصة آمنة ومحمية بالكامل</span>
            <span>•</span>
            <a
              href="https://wa.me/201032148482"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              الدعم الفني عبر واتساب
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
