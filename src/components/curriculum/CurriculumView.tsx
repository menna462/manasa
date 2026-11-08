"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, BookOpen, Layers } from "lucide-react";
import { CurriculumHeaderStats } from "./CurriculumHeaderStats";
import { GradeLevelsSection } from "./GradeLevelsSection";
import { CurriculumHierarchySection } from "./CurriculumHierarchySection";
import { LessonEditorModal } from "./LessonEditorModal";
import { AddGradeModal } from "./AddGradeModal";
import { GradeLevel, LessonItem, CurriculumStats, UnitItem } from "@/types/curriculum";
import { curriculumApi } from "@/lib/api";

interface CurriculumViewProps {
  onShowToast: (text: string, type?: "success" | "error" | "info") => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onShowToast }) => {
  const [stats, setStats] = useState<CurriculumStats>({
    gradesCount: 0,
    unitsCount: 0,
    lessonsCount: 0,
    pdfCount: 0,
  });
  const [grades, setGrades] = useState<GradeLevel[]>([]);
  const [activeGradeId, setActiveGradeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch real curriculum tree from backend API
  const loadCurriculum = async () => {
    setIsLoading(true);
    try {
      const res = await curriculumApi.getTree();
      if (res.data && Array.isArray(res.data)) {
        setGrades(res.data);
        if (res.data.length > 0) {
          // Keep current active grade if exists, else pick first
          setActiveGradeId((prev) => {
            const exists = res.data.some((g) => g.id === prev);
            return exists ? prev : res.data[0].id;
          });
        } else {
          setActiveGradeId("");
        }
      } else {
        setGrades([]);
        setActiveGradeId("");
      }

      if (res.stats) {
        setStats(res.stats);
      }
    } catch (err: any) {
      console.warn("Could not load backend curriculum:", err);
      onShowToast(err.message || "تعذر جلب بيانات المنهج من الخادم", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurriculum();
  }, []);

  // Modals state
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [targetUnitId, setTargetUnitId] = useState<string | undefined>(undefined);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);

  // Active Grade Level
  const activeGrade = grades.find((g) => g.id === activeGradeId) || grades[0] || null;

  // Handlers
  const handleSelectGrade = (id: string) => {
    setActiveGradeId(id);
    const selected = grades.find((g) => g.id === id);
    onShowToast(`تم تحديد ${selected?.title} لإدارة محتواه`, "info");
  };

  const handleAddGrade = async (newGradeData: Partial<GradeLevel>) => {
    try {
      await curriculumApi.createGrade({
        title: newGradeData.title || "مرحلة دراسية جديدة",
        subtitle: newGradeData.subtitle || "",
      });
      onShowToast(`تمت إضافة مرحلة "${newGradeData.title}" بنجاح!`, "success");
      await loadCurriculum();
    } catch (err: any) {
      onShowToast(err.message || "حدث خطأ أثناء إضافة المرحلة الدراسية", "error");
    }
  };

  const handleDeleteGrade = async (id: string) => {
    const gradeToDelete = grades.find((g) => g.id === id);
    if (!gradeToDelete) return;
    if (!window.confirm(`هل أنت متأكد من حذف ${gradeToDelete.title} وكافة وحداته ودروسه؟`)) return;

    try {
      await curriculumApi.deleteGrade(id);
      onShowToast(`تم حذف ${gradeToDelete.title} بنجاح`, "error");
      await loadCurriculum();
    } catch (err: any) {
      onShowToast(err.message || "حدث خطأ أثناء حذف المرحلة", "error");
    }
  };

  const handleSaveLesson = async (
    unitId: string,
    lessonData: Partial<LessonItem>,
    newUnitName?: string
  ) => {
    try {
      let actualUnitId = unitId;

      // If user typed a new unit name, create unit first
      if (newUnitName && newUnitName.trim()) {
        const uRes = await curriculumApi.createUnit({
          grade_level_id: activeGradeId,
          title: newUnitName.trim(),
        });
        if (uRes.data?.id) {
          actualUnitId = String(uRes.data.id);
        }
      }

      if (editingLesson) {
        await curriculumApi.updateLesson(editingLesson.id, {
          title: lessonData.title,
          duration: lessonData.duration,
          size: lessonData.size,
          video_url: lessonData.videoUrl,
          video_provider: lessonData.videoProvider || "bunny",
          has_pdf: !!lessonData.hasPdf,
          pdf_title: lessonData.pdfTitle,
          pdf_url: lessonData.pdfUrl,
          has_quiz: !!lessonData.hasQuiz,
          quiz_title: lessonData.quizTitle,
          status: lessonData.status || "published",
        });
        onShowToast("تم تحديث بيانات الدرس بنجاح!", "success");
      } else {
        await curriculumApi.createLesson({
          unit_id: actualUnitId,
          title: lessonData.title || "محاضرة جديدة",
          duration: lessonData.duration || "01:15:00",
          size: lessonData.size || "740 MB",
          video_url: lessonData.videoUrl || "",
          video_provider: lessonData.videoProvider || "bunny",
          has_pdf: !!lessonData.hasPdf,
          pdf_title: lessonData.pdfTitle,
          pdf_url: lessonData.pdfUrl,
          has_quiz: !!lessonData.hasQuiz,
          quiz_title: lessonData.quizTitle,
          status: lessonData.status || "published",
        });
        onShowToast("تم حفظ ونشر الدرس في المنهج بنجاح!", "success");
      }

      await loadCurriculum();
    } catch (err: any) {
      onShowToast(err.message || "حدث خطأ أثناء حفظ المحاضرة", "error");
    } finally {
      setEditingLesson(null);
      setIsEditorModalOpen(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه المحاضرة نهائياً؟")) return;

    try {
      await curriculumApi.deleteLesson(lessonId);
      onShowToast("تم حذف المحاضرة بنجاح", "info");
      await loadCurriculum();
    } catch (err: any) {
      onShowToast(err.message || "حدث خطأ أثناء حذف المحاضرة", "error");
    }
  };

  const handleEditLesson = (lesson: LessonItem, unitId: string) => {
    setEditingLesson(lesson);
    setTargetUnitId(unitId);
    setIsEditorModalOpen(true);
  };

  const handleSaveOrder = () => {
    onShowToast("تم حفظ ترتيب وتسلسل المنهج بنجاح لجميع الطلاب!", "success");
  };

  if (isLoading && grades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <Loader2 className="w-9 h-9 text-[#FF6A00] animate-spin mb-3" />
        <span className="text-sm font-bold text-gray-700">جاري تحميل بيانات المنهج من الخادم...</span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      {/* 1. Header Overview & Stats */}
      <CurriculumHeaderStats stats={stats} />

      {grades.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100/90 text-center my-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6A00] flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-2">
            لا توجد مراحل دراسية مسجلة حالياً
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            قاعدة البيانات الحالية لا تحتوي على أي مراحل دراسية بعد. ابدأ بإضافة مرحلة جديدة لبناء هيكل المنهج والوحدات.
          </p>
          <button
            onClick={() => setIsAddGradeOpen(true)}
            className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#e55f00] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أول مرحلة دراسية</span>
          </button>
        </div>
      ) : (
        <>
          {/* 2. Grade Levels Section */}
          <GradeLevelsSection
            grades={grades}
            activeGradeId={activeGradeId}
            onSelectGrade={handleSelectGrade}
            onAddGrade={() => setIsAddGradeOpen(true)}
            onEditGrade={(g) => {
              const newName = prompt("تعديل اسم المرحلة:", g.title);
              if (newName && newName.trim()) {
                curriculumApi
                  .createGrade({ title: newName.trim(), subtitle: g.subtitle })
                  .then(() => {
                    onShowToast("تم تعديل اسم المرحلة بنجاح", "success");
                    loadCurriculum();
                  })
                  .catch((err) => onShowToast(err.message, "error"));
              }
            }}
            onDeleteGrade={handleDeleteGrade}
          />

          {/* 3. Curriculum Hierarchy & Lessons Accordion */}
          {activeGrade && (
            <CurriculumHierarchySection
              activeGrade={activeGrade}
              onAddUnitOrLesson={() => {
                setEditingLesson(null);
                setTargetUnitId(activeGrade.units[0]?.id);
                setIsEditorModalOpen(true);
              }}
              onSaveOrder={handleSaveOrder}
              onAddLessonToUnit={(unitId) => {
                setEditingLesson(null);
                setTargetUnitId(unitId);
                setIsEditorModalOpen(true);
              }}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
            />
          )}

          {/* Complete Multi-Step Lesson Editor Modal */}
          {activeGrade && (
            <LessonEditorModal
              isOpen={isEditorModalOpen}
              units={activeGrade.units || []}
              defaultUnitId={targetUnitId}
              initialLesson={editingLesson}
              onClose={() => {
                setIsEditorModalOpen(false);
                setEditingLesson(null);
                setTargetUnitId(undefined);
              }}
              onSave={handleSaveLesson}
            />
          )}
        </>
      )}

      {/* Add Grade Modal */}
      <AddGradeModal
        isOpen={isAddGradeOpen}
        onClose={() => setIsAddGradeOpen(false)}
        onAdd={handleAddGrade}
      />
    </div>
  );
};
