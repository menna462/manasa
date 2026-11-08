"use client";

import React, { useState, useMemo, useEffect } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { AdminTeamStatsCards } from "./AdminTeamStatsCards";
import { AddAdminFormCard } from "./AddAdminFormCard";
import { AdminTeamTable } from "./AdminTeamTable";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { EditAdminModal } from "./EditAdminModal";
import { DeleteAdminModal } from "./DeleteAdminModal";
import { AdminMember, NewAdminFormData, AdminRole } from "@/types/adminTeam";
import { adminApi } from "@/lib/api";

interface AdminTeamViewProps {
  onShowToast: (message: string, type?: "success" | "info" | "error") => void;
}

export const AdminTeamView: React.FC<AdminTeamViewProps> = ({ onShowToast }) => {
  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState(true);

  // Modal Dialog states
  const [resetPasswordTarget, setResetPasswordTarget] = useState<AdminMember | null>(null);
  const [editAdminTarget, setEditAdminTarget] = useState<AdminMember | null>(null);
  const [deleteAdminTarget, setDeleteAdminTarget] = useState<AdminMember | null>(null);

  // Fetch real team members from backend
  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getTeam();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.warn("Could not load backend team:", err);
      onShowToast(err.message || "تعذر جلب قائمة فريق العمل من الخادم", "error");
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    const total = admins.length;
    const superAdmins = admins.filter((a) => a.role === "super_admin").length;
    const others = admins.filter((a) => a.role !== "super_admin").length;
    const active = admins.filter((a) => a.status === "active").length;
    return { total, superAdmins, others, active };
  }, [admins]);

  /* ── Add Admin ── */
  const handleAddAdmin = async (data: NewAdminFormData) => {
    const roleLabels: Record<AdminRole, string> = {
      super_admin: "أدمن رئيسي",
      code_manager: "مسؤول أكواد",
      content_manager: "مشرف محتوى",
    };

    try {
      const res = await adminApi.addTeamMember(data);
      if (res.data) {
        setAdmins((prev) => [res.data, ...prev]);
        onShowToast(
          `تم إنشاء حساب ${roleLabels[data.role]} (${data.fullName}) بنجاح وحفظه بقاعدة البيانات!`,
          "success"
        );
      }
    } catch (err: any) {
      onShowToast(err.message || "حدث خطأ أثناء إضافة المشرف", "error");
    }
  };

  /* ── Toggle Status (Active / Suspended) ── */
  const handleToggleStatus = async (admin: AdminMember) => {
    if (admin.isFounder) {
      onShowToast("لا يمكن تعطيل حساب مالك ومؤسس المنصة", "error");
      return;
    }
    const nextStatus = admin.status === "active" ? "suspended" : "active";
    setAdmins((prev) =>
      prev.map((a) => (a.id === admin.id ? { ...a, status: nextStatus } : a))
    );

    try {
      await adminApi.toggleTeamStatus(admin.id);
      if (nextStatus === "active") {
        onShowToast(`تم تفعيل حساب المشرف ${admin.fullName} بنجاح`, "success");
      } else {
        onShowToast(`تم تعطيل حساب المشرف ${admin.fullName} بنجاح`, "success");
      }
    } catch (err: any) {
      // Revert on failure
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, status: admin.status } : a))
      );
      onShowToast(err.message || "تعذر تغيير حالة المشرف بالخادم", "error");
    }
  };

  /* ── Reset Password ── */
  const handleOpenResetPassword = (admin: AdminMember) => {
    setResetPasswordTarget(admin);
  };

  const handleConfirmResetPassword = (
    adminId: string,
    newPass: string,
    sendEmail: boolean
  ) => {
    const target = admins.find((a) => a.id === adminId);
    if (!target) return;

    onShowToast(
      sendEmail
        ? `تم إعادة ضبط كلمة المرور للمشرف ${target.fullName} بنجاح، وتم إرسالها إلى البريد الإلكتروني.`
        : `تم تحديث كلمة المرور للمشرف ${target.fullName} بنجاح.`,
      "success"
    );
  };

  /* ── Edit Admin ── */
  const handleOpenEditAdmin = (admin: AdminMember) => {
    setEditAdminTarget(admin);
  };

  const handleSaveEditAdmin = (updatedAdmin: AdminMember) => {
    setAdmins((prev) =>
      prev.map((a) => (a.id === updatedAdmin.id ? updatedAdmin : a))
    );
    onShowToast(`تم تحديث بيانات المشرف ${updatedAdmin.fullName} بنجاح`, "success");
  };

  /* ── Delete Admin ── */
  const handleOpenDelete = (admin: AdminMember) => {
    if (admin.isFounder) {
      onShowToast("لا يمكن حذف حساب مالك ومؤسس المنصة", "error");
      return;
    }
    setDeleteAdminTarget(admin);
  };

  const handleConfirmDelete = (adminId: string) => {
    const target = admins.find((a) => a.id === adminId);
    setAdmins((prev) => prev.filter((a) => a.id !== adminId));
    if (target) {
      onShowToast(`تم حذف حساب المشرف ${target.fullName} بنجاح`, "success");
    }
  };

  if (isLoading && admins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-xs">
        <Loader2 className="w-9 h-9 text-[#FF6A00] animate-spin mb-3" />
        <span className="text-sm font-bold text-gray-700">جاري تحميل قائمة المشرفين وفريق العمل...</span>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-300 pb-4">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-3">
        {/* Breadcrumb + Title */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mb-1">
            <span>لوحة القيادة الثانية</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            فريق العمل والمشرفين
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
            إدارة حسابات الأدمن وصلاحيات الوصول للوحة تحكم منصة الأستاذ عماد
            حسين (قاعدة البيانات الحقيقية)
          </p>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={() => setShowAddForm((v) => !v)}
          className="shrink-0 bg-[#FF6A00] hover:bg-[#E55F00] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2.5 shadow-lg shadow-orange-300/40 transition-all active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 stroke-[2.3]" />
          <span>+ إضافة مشرف جديد</span>
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <AdminTeamStatsCards
        totalAdmins={stats.total}
        superAdmins={stats.superAdmins}
        codeAndContentManagers={stats.others}
        activeAdmins={stats.active}
      />

      {/* ── Add Admin Form (Collapsible) ── */}
      {showAddForm && (
        <AddAdminFormCard
          onSubmit={handleAddAdmin}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* ── Admin Team Table ── */}
      <AdminTeamTable
        admins={admins}
        onToggleStatus={handleToggleStatus}
        onResetPassword={handleOpenResetPassword}
        onEditRole={handleOpenEditAdmin}
        onDelete={handleOpenDelete}
      />

      {/* ── Reset Password Modal ── */}
      {resetPasswordTarget && (
        <ResetPasswordModal
          admin={resetPasswordTarget}
          isOpen={Boolean(resetPasswordTarget)}
          onClose={() => setResetPasswordTarget(null)}
          onConfirm={handleConfirmResetPassword}
        />
      )}

      {/* ── Edit Admin Modal ── */}
      {editAdminTarget && (
        <EditAdminModal
          admin={editAdminTarget}
          isOpen={Boolean(editAdminTarget)}
          onClose={() => setEditAdminTarget(null)}
          onSave={handleSaveEditAdmin}
        />
      )}

      {/* ── Delete Admin Modal ── */}
      {deleteAdminTarget && (
        <DeleteAdminModal
          admin={deleteAdminTarget}
          isOpen={Boolean(deleteAdminTarget)}
          onClose={() => setDeleteAdminTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};
