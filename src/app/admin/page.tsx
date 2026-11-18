"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { FileSpreadsheet, FileText, X, Loader2 } from "lucide-react";
import { exportCodesToPdf } from "@/lib/pdf";
import { Navbar } from "@/components/Navbar";
import { HeaderBanner } from "@/components/HeaderBanner";
import { StatCards } from "@/components/StatCards";
import { GenerateForm, FlatLessonOption } from "@/components/GenerateForm";
import { Toolbar } from "@/components/Toolbar";
import { BulkActionBar } from "@/components/BulkActionBar";
import { CodesTable } from "@/components/CodesTable";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { Toast, ToastMessage } from "@/components/Toast";
import { CodeItem, DashboardStats } from "@/types/dashboard";
import { codesApi, adminApi, curriculumApi, getAdminToken } from "@/lib/api";

// Lazy-loaded heavy components & modals (saves bundle size and boosts initial load speed)
const CodeDetailsModal = dynamic(
  () => import("@/components/CodeDetailsModal").then((mod) => mod.CodeDetailsModal),
  { ssr: false }
);

const PrintCardsModal = dynamic(
  () => import("@/components/PrintCardsModal").then((mod) => mod.PrintCardsModal),
  { ssr: false }
);

const CurriculumView = dynamic(
  () => import("@/components/curriculum/CurriculumView").then((mod) => mod.CurriculumView),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <Loader2 className="w-8 h-8 text-[#FF6A00] animate-spin mb-3" />
        <span className="text-xs font-bold text-gray-600">جاري تحميل إدارة المنهج...</span>
      </div>
    ),
    ssr: false,
  }
);

const AnalyticsView = dynamic(
  () => import("@/components/analytics/AnalyticsView").then((mod) => mod.AnalyticsView),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <Loader2 className="w-8 h-8 text-[#FF6A00] animate-spin mb-3" />
        <span className="text-xs font-bold text-gray-600">جاري تحميل لوحة الإحصائيات والتقارير...</span>
      </div>
    ),
    ssr: false,
  }
);

const AdminTeamView = dynamic(
  () => import("@/components/admin/AdminTeamView").then((mod) => mod.AdminTeamView),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <Loader2 className="w-8 h-8 text-[#FF6A00] animate-spin mb-3" />
        <span className="text-xs font-bold text-gray-600">جاري تحميل فريق الإدارة...</span>
      </div>
    ),
    ssr: false,
  }
);

export default function AdminDashboardPage() {
  // Navigation: "codes" as active tab (توليد وإدارة الأكواد)
  const [activeTab, setActiveTab] = useState<string>("codes");
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({
    codes: true,
  });

  // Real curriculum lessons for code generation
  const [lessonsList, setLessonsList] = useState<FlatLessonOption[]>([]);
  const [unitsList, setUnitsList] = useState<FlatLessonOption[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState<boolean>(true);

  // Dashboard Codes State - from real database
  const [codes, setCodes] = useState<CodeItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalCodes: 0,
    activeAvailable: 0,
    usedActive: 0,
    expired: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Table selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  // Modals & Feedback
  const [detailItem, setDetailItem] = useState<CodeItem | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printCodesList, setPrintCodesList] = useState<CodeItem[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [postGenerateCodes, setPostGenerateCodes] = useState<CodeItem[] | null>(null);

  const showToast = useCallback((text: string, type: "success" | "error" | "info" = "success") => {
    setToast({
      id: String(Date.now()),
      type,
      text,
    });
  }, []);

  // Fetch real flat lessons list
  const loadLessons = useCallback(async () => {
    setIsLoadingLessons(true);
    try {
      const res = await curriculumApi.getFlatLessons();
      if (res.data && Array.isArray(res.data)) {
        setLessonsList(res.data);
      }
      if (res.units && Array.isArray(res.units)) {
        setUnitsList(res.units);
      } else {
        const treeRes = await curriculumApi.getTree();
        if (treeRes.data && Array.isArray(treeRes.data)) {
          const flatLessons: FlatLessonOption[] = [];
          const flatUnits: FlatLessonOption[] = [];
          treeRes.data.forEach((grade) => {
            (grade.units || []).forEach((unit) => {
              flatUnits.push({
                id: String(unit.id),
                title: unit.title,
                unitTitle: unit.title,
                gradeTitle: grade.title,
                formattedTitle: `${grade.title} ◄ ${unit.title} (${unit.lessons?.length || 0} دروس)`,
                type: "unit",
                lessonsCount: unit.lessons?.length || 0,
              });
              (unit.lessons || []).forEach((lesson) => {
                flatLessons.push({
                  id: String(lesson.id),
                  title: lesson.title,
                  unitTitle: unit.title,
                  gradeTitle: grade.title,
                  formattedTitle: `${grade.title} ◄ ${lesson.title}`,
                  duration: lesson.duration,
                  type: "lesson",
                });
              });
            });
          });
          if (!res.data || !Array.isArray(res.data)) {
            setLessonsList(flatLessons);
          }
          setUnitsList(flatUnits);
        }
      }
    } catch {
      // Handled silently
    } finally {
      setIsLoadingLessons(false);
    }
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setVisitedTabs((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }));
    if (tab === "codes") {
      loadLessons();
    }
  }, [loadLessons]);

  const handleItemsPerPageChange = useCallback((val: number) => {
    setItemsPerPage(val);
    setCurrentPage(1);
  }, []);

  // Reset to page 1 when search, filter or rows-per-page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, itemsPerPage]);

  // Check authentication & load real codes and stats on mount
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [codesRes, statsRes] = await Promise.allSettled([
          codesApi.getCodes({ per_page: 100 }),
          codesApi.getStats(),
        ]);

        if (!isMounted) return;

        if (codesRes.status === "fulfilled" && Array.isArray(codesRes.value.data)) {
          setCodes(codesRes.value.data);
          if (codesRes.value.data.length >= 2) {
            setSelectedIds([codesRes.value.data[0].id, codesRes.value.data[1].id]);
          } else {
            setSelectedIds([]);
          }
        } else {
          setCodes([]);
          setSelectedIds([]);
        }

        if (statsRes.status === "fulfilled" && statsRes.value) {
          setStats(statsRes.value);
        }
      } catch (err: any) {
        if (!isMounted) return;
        if (err?.message?.includes("401") || err?.message?.includes("Unauthenticated")) {
          adminApi.logout();
          window.location.href = "/admin/login";
          return;
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    fetchData();
    loadLessons();

    return () => {
      isMounted = false;
    };
  }, [loadLessons]);

  // Filtered Codes
  const filteredCodes = useMemo(() => {
    return codes.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.groupName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [codes, searchQuery, statusFilter]);

  // Paginated Codes
  const paginatedCodes = useMemo(() => {
    if (itemsPerPage >= 99999) {
      return filteredCodes;
    }
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCodes.slice(start, start + itemsPerPage);
  }, [filteredCodes, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return itemsPerPage >= 99999
      ? 1
      : Math.max(1, Math.ceil(filteredCodes.length / itemsPerPage));
  }, [filteredCodes.length, itemsPerPage]);

  // Handlers for Codes
  const handleGenerate = useCallback(async (newGenerated: CodeItem[], requestedCount: number) => {
    setCodes((prev) => [...newGenerated, ...prev]);
    try {
      const freshStats = await codesApi.getStats();
      if (freshStats) {
        setStats(freshStats);
      }
    } catch {
      setStats((prev) => ({
        ...prev,
        totalCodes: prev.totalCodes + requestedCount,
        activeAvailable: prev.activeAvailable + requestedCount,
      }));
    }
    showToast(`تم توليد ${requestedCount} كود جديد بنجاح في قاعدة البيانات وتحديث الإحصائيات!`, "success");
    setPostGenerateCodes(newGenerated);
  }, [showToast]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    const currentVisibleIds = paginatedCodes.map((c) => c.id);
    const allSelected = currentVisibleIds.length > 0 && currentVisibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentVisibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentVisibleIds])));
    }
  }, [paginatedCodes, selectedIds]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const handleSelectAllFiltered = useCallback(() => {
    setSelectedIds(filteredCodes.map((c) => c.id));
    showToast(`تم تحديد كافة الأكواد (${filteredCodes.length} كود)`, "info");
  }, [filteredCodes, showToast]);

  const handleDeleteCode = useCallback(async (id: string) => {
    const itemToDelete = codes.find((c) => c.id === id);
    if (!itemToDelete) return;

    setCodes((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));

    setStats((prev) => ({
      ...prev,
      totalCodes: Math.max(0, prev.totalCodes - 1),
      expired: itemToDelete.status === "expired" ? Math.max(0, prev.expired - 1) : prev.expired,
      activeAvailable: itemToDelete.status === "new" ? Math.max(0, prev.activeAvailable - 1) : prev.activeAvailable,
      usedActive: itemToDelete.status === "used" ? Math.max(0, prev.usedActive - 1) : prev.usedActive,
    }));

    showToast(`تم حذف الكود (${itemToDelete.code}) بنجاح`, "info");

    try {
      await codesApi.deleteCode(id);
    } catch {
      // Ignored
    }
  }, [codes, showToast]);

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(
      `هل أنت متأكد من رغبتك في حذف ${selectedIds.length} كود محدد؟`
    );
    if (!confirmDelete) return;

    const count = selectedIds.length;
    const idsToDelete = [...selectedIds];
    setCodes((prev) => prev.filter((c) => !idsToDelete.includes(c.id)));
    setSelectedIds([]);

    setStats((prev) => ({
      ...prev,
      totalCodes: Math.max(0, prev.totalCodes - count),
      activeAvailable: Math.max(0, prev.activeAvailable - count),
    }));

    showToast(`تم حذف ${count} كود محدد بنجاح`, "error");

    try {
      await codesApi.bulkDelete(idsToDelete);
    } catch {
      // Ignored
    }
  }, [selectedIds, showToast]);

  const handleToggleStatus = useCallback(async (id: string) => {
    const targetItem = codes.find((c) => c.id === id);
    if (!targetItem) return;
    const nextStatus = targetItem.status === "new" ? "expired" : "new";

    setCodes((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
    showToast("تم تحديث حالة الكود", "info");

    try {
      await codesApi.bulkUpdateStatus([id], nextStatus);
    } catch {
      // Ignored
    }
  }, [codes, showToast]);

  // Export to Excel
  const handleExportExcel = useCallback((itemsToExport?: CodeItem[]) => {
    const list = itemsToExport && itemsToExport.length > 0 ? itemsToExport : codes;
    const headers = ["الكود الموحد", "اسم المجموعة والسنتر", "تاريخ التوليد", "مدة الصلاحية", "الحالة"];
    const rows = list.map((item) => [
      item.code,
      `"${item.groupName}"`,
      item.createdAt,
      `${item.validityDays} يوم`,
      item.status === "new" ? "جديد / غير مستخدم" : item.status === "used" ? "مستعمل / نشط" : "منتهي الصلاحية",
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `اكواد_المنصة_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`تم تصدير ${list.length} كود إلى ملف Excel بنجاح`, "success");
  }, [codes, showToast]);

  const handleExportSelected = useCallback(() => {
    const selectedList = codes.filter((c) => selectedIds.includes(c.id));
    handleExportExcel(selectedList);
  }, [codes, selectedIds, handleExportExcel]);

  // Export to PDF (cards)
  const handleExportPdf = useCallback(async (itemsToExport?: CodeItem[]) => {
    const list = itemsToExport && itemsToExport.length > 0 ? itemsToExport : codes;
    if (!list || list.length === 0) {
      showToast("لا توجد أكواد للتصدير", "error");
      return;
    }
    showToast("جاري تجهيز وتوليد ملف PDF بالكروت للطباعة والقص...", "info");
    try {
      await exportCodesToPdf(list);
      showToast(`تم تصدير ${list.length} كود إلى ملف PDF بنجاح`, "success");
    } catch (err: any) {
      console.error("PDF export error:", err);
      showToast("حدث خطأ أثناء تصدير ملف PDF", "error");
    }
  }, [codes, showToast]);

  const handleExportPdfSelected = useCallback(async () => {
    const selectedList = codes.filter((c) => selectedIds.includes(c.id));
    if (selectedList.length === 0) {
      showToast("يرجى تحديد كود واحد على الأقل", "error");
      return;
    }
    await handleExportPdf(selectedList);
  }, [codes, selectedIds, handleExportPdf, showToast]);

  const handlePrintSelected = useCallback(() => {
    const selectedList = codes.filter((c) => selectedIds.includes(c.id));
    setPrintCodesList(selectedList);
    setIsPrintModalOpen(true);
  }, [codes, selectedIds]);

  const handlePrintCards = useCallback(() => {
    setPrintCodesList(codes);
    setIsPrintModalOpen(true);
  }, [codes]);

  const handleCloseDetailModal = useCallback(() => {
    setDetailItem(null);
  }, []);

  const handleClosePrintModal = useCallback(() => {
    setIsPrintModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1A1D20]">
      {/* 1. Navbar with Top Header & Secondary Nav Tabs */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onLogout={async () => {
          await adminApi.logout();
          window.location.href = "/admin/login";
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* VIEW 1: إدارة المنهج والدروس (Curriculum & Lessons) */}
        {visitedTabs["curriculum"] && (
          <div className={activeTab === "curriculum" ? "block animate-in fade-in duration-200" : "hidden"}>
            <CurriculumView onShowToast={showToast} onCurriculumChange={loadLessons} />
          </div>
        )}

        {/* VIEW 2: توليد وإدارة الأكواد (Codes Management) */}
        <div className={activeTab === "codes" ? "block animate-in fade-in duration-200" : "hidden"}>
          {/* Header Title & Admin Info */}
          <HeaderBanner />

          {/* Stat Cards */}
          <StatCards stats={stats} />

          {/* Generate Codes Form */}
          <GenerateForm
            onGenerate={handleGenerate}
            lessons={lessonsList}
            units={unitsList}
            isLoadingLessons={isLoadingLessons}
          />

          {/* Toolbar: Search, Filters & Export Buttons */}
          <Toolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onExportExcel={() => handleExportExcel()}
            onPrintCards={handlePrintCards}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />

          {/* Bulk Action Bar (Visible when checkboxes are checked) */}
          <BulkActionBar
            selectedCount={selectedIds.length}
            totalCount={codes.length}
            filteredCount={filteredCodes.length}
            onSelectAllFiltered={handleSelectAllFiltered}
            onPrintSelected={handlePrintSelected}
            onExportPdfSelected={handleExportPdfSelected}
            onExportSelected={handleExportSelected}
            onDeleteSelected={handleDeleteSelected}
            onClearSelection={handleClearSelection}
          />

          {/* Data Table with Skeleton Loader */}
          <CodesTable
            codes={paginatedCodes}
            selectedIds={selectedIds}
            isLoading={isLoadingData}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onViewDetails={(item) => setDetailItem(item)}
            onToggleStatus={handleToggleStatus}
            onDeleteCode={handleDeleteCode}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCodes.length}
            startIndex={
              filteredCodes.length === 0
                ? 0
                : itemsPerPage >= 99999
                ? 1
                : (currentPage - 1) * itemsPerPage + 1
            }
            endIndex={
              itemsPerPage >= 99999
                ? filteredCodes.length
                : Math.min(filteredCodes.length, currentPage * itemsPerPage)
            }
            onPageChange={(page) => setCurrentPage(page)}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>

        {/* VIEW 3: الإحصائيات والتقارير */}
        {visitedTabs["stats"] && (
          <div className={activeTab === "stats" ? "block animate-in fade-in duration-200" : "hidden"}>
            <AnalyticsView onShowToast={showToast} />
          </div>
        )}

        {/* VIEW 4: إدارة الأدمن وفريق العمل */}
        {visitedTabs["admin"] && (
          <div className={activeTab === "admin" ? "block animate-in fade-in duration-200" : "hidden"}>
            <AdminTeamView onShowToast={showToast} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Code Details Modal - Lazy Loaded */}
      {detailItem && (
        <CodeDetailsModal
          codeItem={detailItem}
          onClose={handleCloseDetailModal}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Print A4 Cards Modal - Lazy Loaded */}
      {isPrintModalOpen && (
        <PrintCardsModal
          isOpen={isPrintModalOpen}
          codes={printCodesList}
          onClose={handleClosePrintModal}
        />
      )}

      {/* Post-Generation Export Modal */}
      {postGenerateCodes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-gray-900 text-base">
                تم توليد {postGenerateCodes.length} كود بنجاح ✅
              </h3>
              <button
                onClick={() => setPostGenerateCodes(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              هل تريد تصدير الأكواد المولّدة الآن؟
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => {
                  handleExportExcel(postGenerateCodes);
                  setPostGenerateCodes(null);
                }}
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-sm px-4 py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>تصدير كملف Excel</span>
              </button>
              <button
                onClick={() => {
                  handleExportPdf(postGenerateCodes);
                  setPostGenerateCodes(null);
                }}
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold text-sm px-4 py-3 rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <FileText className="w-5 h-5 text-rose-400" />
                <span>تصدير كملف PDF</span>
              </button>
              <button
                onClick={() => setPostGenerateCodes(null)}
                className="w-full text-gray-500 hover:text-gray-800 font-bold text-sm py-2.5 transition-colors cursor-pointer"
              >
                تخطي
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
