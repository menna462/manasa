"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  UploadCloud,
  FileVideo,
  Paperclip,
  Check,
  CheckCircle2,
  TvMinimalPlay,
  Upload,
  Link2,
  Play,
  ExternalLink,
  Server,
  AlertCircle,
  ShieldCheck,
  Video,
} from "lucide-react";
import { UnitItem, LessonItem, VideoSourceType, VideoProviderType } from "@/types/curriculum";

interface LessonEditorModalProps {
  isOpen: boolean;
  units: UnitItem[];
  defaultUnitId?: string;
  initialLesson?: LessonItem | null;
  onClose: () => void;
  onSave: (unitId: string, lessonData: Partial<LessonItem>, newUnitName?: string) => void;
}

interface ProviderOption {
  id: VideoProviderType;
  name: string;
  tag: string;
  badgeColor: string;
  dotColor: string;
  hint: string;
}

const VIDEO_PROVIDERS: ProviderOption[] = [
  {
    id: "youtube",
    name: "YouTube",
    tag: "بث عام / غير مدرج (Unlisted)",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    dotColor: "bg-red-500",
    hint: "يدعم روابط المشاهدة القياسية ومشاركة youtu.be والروابط غير المدرجة",
  },
  {
    id: "bunny",
    name: "Bunny Stream",
    tag: "DRM مشفر وبث فائق السرعة",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    dotColor: "bg-purple-500",
    hint: "حماية متقدمة ضد التحميل وتوزيع عبر شبكة CDN مخصصة",
  },
  {
    id: "cloudflare",
    name: "Cloudflare R2",
    tag: "تخزين سحابي وبث تكيفي",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
    hint: "تخزين سحابي وبث تكيفي سريع بدون رسوم نقل بيانات",
  },
  {
    id: "vimeo",
    name: "Vimeo",
    tag: "مشغل احترافي Pro بدون إعلانات",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    dotColor: "bg-sky-500",
    hint: "مشغل فيديو متطور مع خصوصية النطاق وتحكم عالي",
  },
  {
    id: "custom",
    name: "Custom Embed",
    tag: "رابط مخصص / تدفق HLS m3u8",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    dotColor: "bg-orange-500",
    hint: "روابط تدفق مباشر m3u8 أو MP4 مباشر أو كود iframe مخصص",
  },
];

export const LessonEditorModal: React.FC<LessonEditorModalProps> = ({
  isOpen,
  units,
  defaultUnitId,
  initialLesson,
  onClose,
  onSave,
}) => {
  // Step 1: Unit selection or new unit
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [newUnitName, setNewUnitName] = useState<string>("الوحدة 4: الكيمياء الكهربية والخلايا الجلفانية");

  // Step 2: Lecture info & video
  const [title, setTitle] = useState<string>("المحاضرة 1: الخلايا الجلفانية وتفاعلات الأكسدة والاختزال");
  const [duration, setDuration] = useState<string>("01:15:00");
  const [uploadProgress, setUploadProgress] = useState<number>(85);
  const [fileName, setFileName] = useState<string>("unit4_lecture01_galvanic.mp4");
  const [fileSize, setFileSize] = useState<string>("740 MB");

  // Video provisioning method: Upload direct or External link
  const [videoSource, setVideoSource] = useState<VideoSourceType>("upload");
  const [externalUrl, setExternalUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [videoProvider, setVideoProvider] = useState<VideoProviderType>("youtube");
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  // Step 3: Attachments & Quiz
  const [hasPdf, setHasPdf] = useState<boolean>(true);
  const [pdfFileName, setPdfFileName] = useState<string>("ملزمة_الخلايا_الجلفانية_(6.2 MB).pdf");
  const [isQuizRequired, setIsQuizRequired] = useState<boolean>(true);

  // Helpers
  const isValidUrl = (urlStr: string): boolean => {
    if (!urlStr || !urlStr.trim()) return false;
    try {
      const url = new URL(urlStr.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isUrlValid = useMemo(() => isValidUrl(externalUrl), [externalUrl]);

  const autoDetectProvider = (url: string): VideoProviderType | null => {
    const lower = url.toLowerCase();
    if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
    if (lower.includes("vimeo.com")) return "vimeo";
    if (lower.includes("bunny.net") || lower.includes("b-cdn.net") || lower.includes("mediadelivery.net")) return "bunny";
    if (lower.includes("cloudflare") || lower.includes("r2.") || lower.includes("cloudflarestream")) return "cloudflare";
    return null;
  };

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const ytVideoId = useMemo(() => {
    if (videoProvider === "youtube" && isUrlValid) {
      return getYouTubeVideoId(externalUrl);
    }
    return null;
  }, [externalUrl, videoProvider, isUrlValid]);

  const currentProviderInfo = useMemo(() => {
    return VIDEO_PROVIDERS.find((p) => p.id === videoProvider) || VIDEO_PROVIDERS[0];
  }, [videoProvider]);

  // Sync state when modal opens or lesson changes
  useEffect(() => {
    if (initialLesson) {
      setTitle(initialLesson.title);
      setDuration(initialLesson.duration);
      setFileSize(initialLesson.size);
      setFileName(`lecture_${initialLesson.orderNumber}.mp4`);
      setHasPdf(!!initialLesson.hasPdf);
      setPdfFileName(initialLesson.pdfTitle ? `${initialLesson.pdfTitle}.pdf` : "ملزمة_الشرح_المعتمدة.pdf");
      setIsQuizRequired(!!initialLesson.hasQuiz);
      if (initialLesson.videoSource) {
        setVideoSource(initialLesson.videoSource);
      } else {
        setVideoSource("upload");
      }
      if (initialLesson.videoUrl) {
        setExternalUrl(initialLesson.videoUrl);
      }
      if (initialLesson.videoProvider) {
        setVideoProvider(initialLesson.videoProvider);
      }
      if (defaultUnitId) setSelectedUnitId(defaultUnitId);
      setIsPlayingPreview(false);
    } else {
      setSelectedUnitId(defaultUnitId || units[0]?.id || "");
      setTitle("المحاضرة 1: الخلايا الجلفانية وتفاعلات الأكسدة والاختزال");
      setDuration("01:15:00");
      setNewUnitName("الوحدة 4: الكيمياء الكهربية والخلايا الجلفانية");
      setUploadProgress(85);
      setFileName("unit4_lecture01_galvanic.mp4");
      setFileSize("740 MB");
      setHasPdf(true);
      setPdfFileName("ملزمة_الخلايا_الجلفانية_(6.2 MB).pdf");
      setIsQuizRequired(true);
      setVideoSource("upload");
      setExternalUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      setVideoProvider("youtube");
      setIsPlayingPreview(false);
    }
  }, [initialLesson, defaultUnitId, units, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      alert("يرجى إدخال عنوان المحاضرة");
      return;
    }

    if (videoSource === "external" && !isUrlValid) {
      alert("يرجى إدخال رابط فيديو خارجي صالح يبدأ بـ https://");
      return;
    }

    onSave(
      selectedUnitId || units[0]?.id,
      {
        title: title.trim(),
        duration: duration || "01:00:00",
        size: videoSource === "external" ? currentProviderInfo.name : (fileSize || "740 MB"),
        hasPdf,
        pdfTitle: hasPdf ? pdfFileName.replace(".pdf", "") : undefined,
        hasQuiz: isQuizRequired,
        quizTitle: isQuizRequired ? "كويز إلكتروني مدمج (إجباري بعد 90% مشاهدة)" : undefined,
        status: "published",
        videoSource,
        videoUrl: videoSource === "external" ? externalUrl.trim() : undefined,
        videoProvider: videoSource === "external" ? videoProvider : undefined,
      },
      newUnitName.trim() ? newUnitName.trim() : undefined
    );

    onClose();
  };

  const handleSaveDraft = () => {
    onSave(
      selectedUnitId || units[0]?.id,
      {
        title: title.trim(),
        duration,
        size: videoSource === "external" ? currentProviderInfo.name : fileSize,
        hasPdf,
        pdfTitle: pdfFileName.replace(".pdf", ""),
        hasQuiz: isQuizRequired,
        status: "draft",
        videoSource,
        videoUrl: videoSource === "external" ? externalUrl.trim() : undefined,
        videoProvider: videoSource === "external" ? videoProvider : undefined,
      },
      newUnitName.trim() ? newUnitName.trim() : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* 1. Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6A00] flex items-center justify-center text-white shadow-sm shadow-orange-300">
              <TvMinimalPlay className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                  إدارة منهج: الصف الثالث الثانوي
                </h3>
                <span className="bg-[#FF6A00] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  خطوات متتالية
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                أضف اسم الوحدة أولاً، ثم زود الفيديو (رفع مباشر أو رابط خارجي) والملحقات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Multi-step Stepper Header */}
        <div className="px-6 sm:px-8 py-3.5 bg-gray-50/70 border-b border-gray-100">
          <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-lg mx-auto text-xs sm:text-sm">
            {/* Step 1: اسم الوحدة الدراسية (Completed) */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FF6A00] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                1
              </div>
              <span className="font-bold text-gray-900 whitespace-nowrap">
                اسم الوحدة الدراسية
              </span>
            </div>

            {/* Connecting line 1 */}
            <div className="h-0.5 flex-1 max-w-[60px] bg-[#FF6A00] rounded-full" />

            {/* Step 2: تزويد الفيديو والدرس (Active Orange) */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FF6A00] text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-xs shadow-orange-300">
                2
              </div>
              <span className="font-bold text-[#FF6A00] whitespace-nowrap">
                تزويد الفيديو والدرس
              </span>
            </div>

            {/* Connecting line 2 */}
            <div className="h-0.5 flex-1 max-w-[60px] bg-gray-200 rounded-full" />

            {/* Step 3: الملازم والنشر (Inactive Gray) */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <span className="font-medium text-gray-400 whitespace-nowrap">
                الملازم والنشر
              </span>
            </div>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Section 1: الخطوة 1: تحديد أو إضافة اسم الوحدة الدراسية */}
          <div className="border border-gray-200/80 rounded-2xl p-4 sm:p-5 bg-white">
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                  الخطوة 1: تحديد أو إضافة اسم الوحدة الدراسية
                </h4>
              </div>
              <span className="text-[11px] text-gray-400 font-medium hidden sm:inline-block">
                اختر وحدة حالية أو اكتب اسماً جديداً
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* اختيار وحدة قائمة في الكورس */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  اختيار وحدة قائمة في الكورس:
                </label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full bg-[#F1F3F5] text-gray-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all text-right cursor-pointer"
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.title} ({unit.lessonsCount} دروس)
                    </option>
                  ))}
                </select>
              </div>

              {/* أو إضافة اسم وحدة جديدة فورياً */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  أو إضافة اسم وحدة جديدة فورياً:
                </label>
                <input
                  type="text"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  placeholder="الوحدة 4: الكيمياء الكهربية والخلايا الجلفانية"
                  className="w-full bg-[#F1F3F5] text-gray-800 placeholder:text-gray-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all text-right"
                />
              </div>
            </div>
          </div>

          {/* Section 2: الخطوة 2: بيانات المحاضرة وتزويد الفيديو */}
          <div className="border border-gray-200/80 rounded-2xl p-4 sm:p-5 bg-white space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
                <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                  الخطوة 2: بيانات المحاضرة وتزويد الفيديو
                </h4>
              </div>
              {videoSource === "upload" ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>جاهز للرفع</span>
                </span>
              ) : isUrlValid ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>رابط صالح ومطابق</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>بانتظار إدخال الرابط</span>
                </span>
              )}
            </div>

            {/* Inputs: عنوان المحاضرة و مدة المحاضرة */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  عنوان المحاضرة
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="المحاضرة 1: الخلايا الجلفانية وتفاعلات الأكسدة والاختزال"
                  className="w-full bg-[#F1F3F5] text-gray-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all text-right"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  مدة المحاضرة المقدرة
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="01:15:00"
                  className="w-full bg-[#F1F3F5] text-gray-900 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-center border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all"
                />
              </div>
            </div>

            {/* نظام تبويب اختياري: Tabs / Toggle Buttons لطريقة تزويد الفيديو */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                طريقة تزويد الفيديو:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-[#F1F3F5] rounded-2xl border border-gray-200/60">
                {/* Option 1: رفع ملف فيديو مباشر / HLS */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPlayingPreview(false);
                    setVideoSource("upload");
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    videoSource === "upload"
                      ? "bg-white text-[#FF6A00] shadow-sm shadow-orange-500/10 border border-orange-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <UploadCloud className="w-4 h-4 shrink-0" />
                  <span>رفع ملف فيديو مباشر / HLS</span>
                  {videoSource === "upload" && (
                    <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse mr-auto sm:mr-0" />
                  )}
                </button>

                {/* Option 2: تضمين رابط فيديو خارجي */}
                <button
                  type="button"
                  onClick={() => setVideoSource("external")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                    videoSource === "external"
                      ? "bg-white text-[#FF6A00] shadow-sm shadow-orange-500/10 border border-orange-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Link2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">تضمين رابط فيديو خارجي (YouTube / Cloudflare / Bunny / Custom URL)</span>
                  {videoSource === "external" && (
                    <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse mr-auto sm:mr-0" />
                  )}
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: رفع ملف فيديو مباشر / HLS */}
            {videoSource === "upload" && (
              <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                <label className="block text-[11px] font-bold text-gray-700">
                  ملف الفيديو (رفع مباشر / HLS)
                </label>

                <div
                  onClick={() => {
                    setUploadProgress(100);
                    alert("تم تحديد ملف الفيديو بنجاح!");
                  }}
                  className="border-2 border-dashed border-orange-300 hover:border-[#FF6A00] rounded-2xl p-5 text-center bg-orange-50/20 hover:bg-orange-50/40 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 group-hover:bg-orange-200/80 flex items-center justify-center text-[#FF6A00] mx-auto mb-2 transition-colors">
                    <UploadCloud className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <p className="font-extrabold text-xs sm:text-sm text-gray-900">
                    اسحب وأفلت ملف المحاضرة هنا أو اضغط للاختيار
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1 font-medium">
                    يدعم جميع صيغ MP4, MKV حتى 4GB بأعلى جودة معالجة
                  </p>
                </div>

                {/* Active Upload Progress Bar */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <div className="flex items-center gap-1.5 text-gray-800">
                      <FileVideo className="w-4 h-4 text-[#FF6A00]" />
                      <span className="font-mono text-[11px] sm:text-xs">
                        {fileName} ({fileSize})
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      <span>السرعة: 14 MB/s | </span>
                      <span className="text-[#FF6A00] font-extrabold">
                        {uploadProgress}% تم الرفع
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF6A00] rounded-full transition-all duration-300 shadow-xs"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: تضمين رابط فيديو خارجي */}
            {videoSource === "external" && (
              <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                {/* 1. URL Input Text Field with Link Icon */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold text-gray-700">
                      رابط الفيديو الخارجي
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">
                      يقبل روابط HTTPS والمشغلات العالمية المباشرة
                    </span>
                  </div>

                  <div className="relative">
                    {/* Link Icon */}
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
                      <Link2 className="w-4 h-4 text-[#FF6A00]" />
                    </div>

                    <input
                      type="url"
                      dir="ltr"
                      value={externalUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setExternalUrl(val);
                        setIsPlayingPreview(false);
                        const detected = autoDetectProvider(val);
                        if (detected) setVideoProvider(detected);
                      }}
                      placeholder="أدخل رابط الفيديو هنا (مثال: https://... أو رابط يوتيوب)"
                      className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl pr-10 pl-24 py-2.5 text-xs sm:text-sm font-semibold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-hidden transition-all text-left placeholder:text-right"
                    />

                    {/* Quick clear & paste buttons */}
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center gap-1">
                      {externalUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setExternalUrl("");
                            setIsPlayingPreview(false);
                          }}
                          className="text-gray-400 hover:text-gray-700 p-1 text-xs rounded-lg hover:bg-gray-200/50 cursor-pointer"
                          title="مسح الرابط"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const clip = await navigator.clipboard.readText();
                            if (clip) {
                              setExternalUrl(clip);
                              setIsPlayingPreview(false);
                              const detected = autoDetectProvider(clip);
                              if (detected) setVideoProvider(detected);
                            }
                          } catch {
                            // clipboard fallback
                          }
                        }}
                        className="bg-white hover:bg-orange-50 text-gray-700 hover:text-[#FF6A00] border border-gray-200 hover:border-orange-200 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shadow-2xs cursor-pointer"
                      >
                        لصق
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Provider selection: Dropdown + Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-[#F8F9FA] p-3 rounded-2xl border border-gray-100">
                  {/* Dropdown */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      نوع السيرفر / المصدر:
                    </label>
                    <select
                      value={videoProvider}
                      onChange={(e) => {
                        setVideoProvider(e.target.value as VideoProviderType);
                        setIsPlayingPreview(false);
                      }}
                      className="w-full bg-white text-gray-800 rounded-xl px-3 py-2 text-xs font-bold border border-gray-200 focus:border-[#FF6A00] focus:outline-hidden transition-all text-right cursor-pointer"
                    >
                      <option value="youtube">YouTube (يوتيوب مباشر / غير مدرج)</option>
                      <option value="bunny">Bunny Stream (بث فائق السرعة & DRM)</option>
                      <option value="cloudflare">Cloudflare R2 (تخزين سحابي وبث)</option>
                      <option value="vimeo">Vimeo (مشغل احترافي Pro)</option>
                      <option value="custom">Custom Embed (تضمين مخصص / m3u8)</option>
                    </select>
                  </div>

                  {/* Badges / Chips */}
                  <div className="sm:col-span-7">
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">
                      شارات سريعة لاختيار المصدر:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {VIDEO_PROVIDERS.map((provider) => {
                        const isSelected = videoProvider === provider.id;
                        return (
                          <button
                            key={provider.id}
                            type="button"
                            onClick={() => {
                              setVideoProvider(provider.id);
                              setIsPlayingPreview(false);
                            }}
                            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-[#FF6A00] text-white border-[#FF6A00] shadow-sm shadow-orange-300"
                                : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50/40"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? "bg-white" : provider.dotColor
                              }`}
                            />
                            <span>{provider.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. URL Validation & Preview Card */}
                <div className="rounded-2xl border border-gray-200/90 overflow-hidden bg-gray-50/50">
                  {/* Preview Box Header */}
                  <div className="p-3 bg-white border-b border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <TvMinimalPlay className="w-4 h-4 text-[#FF6A00]" />
                      <span className="text-xs font-bold text-gray-800">
                        معاينة المشغل وفحص الرابط
                      </span>
                      <span className="text-[10px] text-gray-400">
                        ({currentProviderInfo.name})
                      </span>
                    </div>

                    {/* Green Validation Status Badge */}
                    {isUrlValid ? (
                      <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/90 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>رابط صالح ومطابق</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>رابط غير مكتمل</span>
                      </div>
                    )}
                  </div>

                  {/* Preview Box Content */}
                  <div className="p-3.5">
                    {isUrlValid ? (
                      <div className="space-y-3">
                        {/* If YouTube and video ID detected */}
                        {videoProvider === "youtube" && ytVideoId ? (
                          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[220px] mx-auto shadow-md group">
                            {isPlayingPreview ? (
                              <iframe
                                src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=1`}
                                title="معاينة فيديو يوتيوب"
                                className="w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <>
                                <img
                                  src={`https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`}
                                  alt="YouTube Thumbnail"
                                  className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-between p-3.5">
                                  <div className="flex items-center justify-between">
                                    <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                                      <span>YouTube Embed</span>
                                    </span>
                                    <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                                      {duration}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setIsPlayingPreview(true)}
                                    className="w-12 h-12 rounded-full bg-[#FF6A00] hover:bg-[#E55F00] text-white flex items-center justify-center mx-auto shadow-lg shadow-orange-500/50 active:scale-95 transition-all cursor-pointer group-hover:scale-110"
                                    title="تشغيل معاينة الفيديو"
                                  >
                                    <Play className="w-5 h-5 fill-white mr-0.5" />
                                  </button>

                                  <div className="text-right">
                                    <p className="text-white text-xs font-bold truncate">
                                      {title || "فيديو المحاضرة"}
                                    </p>
                                    <p className="text-emerald-400 text-[10px] mt-0.5 font-bold flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>تم التحقق من معرّف الفيديو (ID: {ytVideoId})</span>
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          /* Card for Bunny / Cloudflare / Vimeo / Custom */
                          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-36 h-36 bg-[#FF6A00]/15 rounded-full blur-2xl pointer-events-none" />

                            <div className="flex items-start justify-between gap-3 relative z-10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#FF6A00] shrink-0 shadow-xs">
                                  <Server className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-xs text-white">
                                      {currentProviderInfo.name}
                                    </span>
                                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                                      بث نشط 1080p HLS
                                    </span>
                                  </div>
                                  <p
                                    className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs sm:max-w-md font-mono"
                                    dir="ltr"
                                  >
                                    {externalUrl}
                                  </p>
                                </div>
                              </div>

                              <a
                                href={externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                              >
                                <span>اختبار الرابط</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>تأمين الاتصال وبث مشفر SSL / DRM</span>
                              </div>
                              <span className="text-orange-400 font-bold">
                                {currentProviderInfo.tag}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Hint note */}
                        <div className="flex items-center justify-between text-[11px] text-gray-500 bg-white p-2.5 rounded-xl border border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-medium">{currentProviderInfo.hint}</span>
                          </div>
                          <span className="text-emerald-700 font-bold text-[10px] hidden sm:inline">
                            مطابق للمشغل المدمج
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center space-y-2 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF6A00] flex items-center justify-center mx-auto">
                          <Link2 className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-gray-700">
                          أدخل رابط فيديو يبدأ بـ https:// لمعاينة الفيديو والتأكد من مطابقته
                        </p>
                        <p className="text-[11px] text-gray-400 max-w-md mx-auto">
                          يدعم روابط يوتيوب، Bunny Stream CDN، Cloudflare R2، أو روابط تدفق مباشر بصيغة m3u8.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setExternalUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
                            setVideoProvider("youtube");
                          }}
                          className="text-xs font-extrabold text-[#FF6A00] hover:text-[#E55F00] underline cursor-pointer pt-1"
                        >
                          تجربة رابط نموذج توضيحي
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: الخطوة 3: الملحقات والاختبار */}
          <div className="border border-gray-200/80 rounded-2xl p-4 sm:p-5 bg-white space-y-3.5">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-50">
              <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
              <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">
                الخطوة 3: الملحقات والاختبار
              </h4>
            </div>

            {/* Attach PDF button & Status badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8F9FA] p-3 rounded-xl border border-gray-100">
              <button
                type="button"
                onClick={() => setHasPdf(!hasPdf)}
                className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
              >
                <Paperclip className="w-3.5 h-3.5 text-gray-600" />
                <span>ارفق ملزمة الشرح (PDF)</span>
              </button>

              {hasPdf && (
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    تم تجهيز: {pdfFileName}
                  </span>
                </div>
              )}
            </div>

            {/* Quiz Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isQuizRequired}
                  onChange={(e) => setIsQuizRequired(e.target.checked)}
                  className="w-4 h-4 accent-[#FF6A00] rounded-md cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-bold text-gray-800">
                  تفعيل الكويز التابع للدرس إجبارياً بعد اكتمال مشاهدة المحاضرة بنسبة 90%
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* 5. Modal Footer Actions */}
        <div className="p-5 sm:p-6 pt-3 bg-gray-50/70 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          {/* Primary Action Button (Right in LTR, Left in RTL) */}
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="w-full sm:w-auto bg-[#FF6A00] hover:bg-[#E55F00] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-300/50 transition-all active:scale-95 cursor-pointer order-1 sm:order-2"
          >
            <Upload className="w-4 h-4 stroke-[2.5]" />
            <span>حفظ ونشر الدرس في المنهج</span>
          </button>

          {/* Secondary Actions (Left in LTR, Right in RTL) */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto order-2 sm:order-1">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-colors cursor-pointer shadow-2xs"
            >
              حفظ كمسودة
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 font-bold text-xs sm:text-sm px-3 py-3 transition-colors cursor-pointer"
            >
              إلغاء التغييرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
