"use client";

import React, { useState, useMemo } from "react";
import { FileSpreadsheet, FileText, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeaderBanner } from "@/components/HeaderBanner";
import { StatCards } from "@/components/StatCards";
import { GenerateForm } from "@/components/GenerateForm";
import { Toolbar } from "@/components/Toolbar";
import { BulkActionBar } from "@/components/BulkActionBar";
import { CodesTable } from "@/components/CodesTable";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { CodeDetailsModal } from "@/components/CodeDetailsModal";
import { PrintCardsModal } from "@/components/PrintCardsModal";
import { Toast, ToastMessage } from "@/components/Toast";
import { CurriculumView } from "@/components/curriculum/CurriculumView";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { AdminTeamView } from "@/components/admin/AdminTeamView";
import { CodeItem, DashboardStats } from "@/types/dashboard";
import { codesApi, adminApi, getAdminToken } from "@/lib/api";

export default function AdminDashboardPage() {
  // Navigation: "codes" as active tab (توليد وإدارة الأكواد)
  const [activeTab, setActiveTab] = useState<string>("codes");
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({
    codes: true,
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setVisitedTabs((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }));
  };

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
  const itemsPerPage = 10;

  // Reset to page 1 when search or filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Check authentication & load real codes and stats on mount
  React.useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [codesRes, statsRes] = await Promise.allSettled([
          codesApi.getCodes({ per_page: 100 }),
          codesApi.getStats(),
        ]);

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
        if (err?.message?.includes("401") || err?.message?.includes("Unauthenticated")) {
          adminApi.logout();
          window.location.href = "/admin/login";
          return;
        }
        console.warn("Could not load backend data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Modals & Feedback
  const [detailItem, setDetailItem] = useState<CodeItem | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printCodesList, setPrintCodesList] = useState<CodeItem[]>([]);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [postGenerateCodes, setPostGenerateCodes] = useState<CodeItem[] | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToast({
      id: String(Date.now()),
      type,
      text,
    });
  };

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
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCodes.slice(start, start + itemsPerPage);
  }, [filteredCodes, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredCodes.length / itemsPerPage));

  // Handlers for Codes
  const handleGenerate = async (newGenerated: CodeItem[], requestedCount: number) => {
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
    // Show post-generation export dialog
    setPostGenerateCodes(newGenerated);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentVisibleIds = paginatedCodes.map((c) => c.id);
    const allSelected = currentVisibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentVisibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentVisibleIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleDeleteCode = async (id: string) => {
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
    } catch (err) {
      console.warn("Error deleting code from API:", err);
    }
  };

  const handleDeleteSelected = async () => {
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
    } catch (err) {
      console.warn("Error bulk deleting from API:", err);
    }
  };

  const handleToggleStatus = async (id: string) => {
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
    } catch (err) {
      console.warn("Error updating code status in API:", err);
    }
  };

  // Export to Excel
  const handleExportExcel = (itemsToExport?: CodeItem[]) => {
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
  };

  const handleExportSelected = () => {
    const selectedList = codes.filter((c) => selectedIds.includes(c.id));
    handleExportExcel(selectedList);
  };

  // Export to PDF (print)
  const handleExportPdf = (itemsToExport?: CodeItem[]) => {
    showToast("جاري تجهيز تقرير PDF وحفظه...", "info");
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const handlePrintSelected = () => {
    const selectedList = codes.filter((c) => selectedIds.includes(c.id));
    setPrintCodesList(selectedList);
    setIsPrintModalOpen(true);
  };

  const handlePrintCards = () => {
    setPrintCodesList(codes);
    setIsPrintModalOpen(true);
  };

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
            <CurriculumView onShowToast={showToast} />
          </div>
        )}

        {/* VIEW 2: توليد وإدارة الأكواد (Codes Management) */}
        <div className={activeTab === "codes" ? "block animate-in fade-in duration-200" : "hidden"}>
          {/* Header Title & Admin Info */}
          <HeaderBanner />

          {/* Stat Cards */}
          <StatCards stats={stats} />

          {/* Generate Codes Form */}
          <GenerateForm onGenerate={handleGenerate} />

          {/* Toolbar: Search, Filters & Export Buttons */}
          <Toolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onExportExcel={() => handleExportExcel()}
            onPrintCards={handlePrintCards}
          />

          {/* Bulk Action Bar (Visible when checkboxes are checked) */}
          <BulkActionBar
            selectedCount={selectedIds.length}
            totalCount={codes.length}
            onPrintSelected={handlePrintSelected}
            onExportSelected={handleExportSelected}
            onDeleteSelected={handleDeleteSelected}
            onClearSelection={handleClearSelection}
          />

          {/* Data Table */}
          <CodesTable
            codes={paginatedCodes}
            selectedIds={selectedIds}
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
            startIndex={filteredCodes.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            endIndex={Math.min(filteredCodes.length, currentPage * itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
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

      {/* Code Details Modal */}
      <CodeDetailsModal
        codeItem={detailItem}
        onClose={() => setDetailItem(null)}
        onToggleStatus={handleToggleStatus}
      />

      {/* Print A4 Cards Modal */}
      <PrintCardsModal
        isOpen={isPrintModalOpen}
        codes={printCodesList}
        onClose={() => setIsPrintModalOpen(false)}
      />

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
