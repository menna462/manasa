"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Pencil,
  Ban,
  CheckCircle,
  KeyRound,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Ticket,
  BookOpen,
  Wifi,
} from "lucide-react";
import { AdminMember, AdminRole, AdminStatus } from "@/types/adminTeam";

interface AdminTeamTableProps {
  admins: AdminMember[];
  onToggleStatus: (admin: AdminMember) => void;
  onResetPassword: (admin: AdminMember) => void;
  onEditRole: (admin: AdminMember) => void;
  onDelete: (admin: AdminMember) => void;
}

const ROLE_DISPLAY: Record<
  AdminRole,
  { label: string; labelEn: string; icon: React.ReactNode; badgeClass: string }
> = {
  super_admin: {
    label: "أدمن رئيسي",
    labelEn: "Super Admin",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    badgeClass: "bg-gray-900 text-white border-gray-900",
  },
  code_manager: {
    label: "مسؤول أكواد",
    labelEn: "Code Manager",
    icon: <Ticket className="w-3.5 h-3.5" />,
    badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
  },
  content_manager: {
    label: "مشرف محتوى",
    labelEn: "Content Manager",
    icon: <BookOpen className="w-3.5 h-3.5" />,
    badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export const AdminTeamTable: React.FC<AdminTeamTableProps> = ({
  admins,
  onToggleStatus,
  onResetPassword,
  onEditRole,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AdminStatus | "all">("all");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        admin.fullName.toLowerCase().includes(q) ||
        admin.email.toLowerCase().includes(q) ||
        ROLE_DISPLAY[admin.role].label.toLowerCase().includes(q) ||
        ROLE_DISPLAY[admin.role].labelEn.toLowerCase().includes(q);

      const matchesRole = roleFilter === "all" || admin.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || admin.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [admins, searchQuery, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / itemsPerPage));
  const paginated = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderLastActivity = (admin: AdminMember) => {
    if (admin.lastActivityType === "online") {
      return (
        <span className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {admin.lastActivity}
        </span>
      );
    }
    return (
      <span className="text-gray-500 font-medium text-xs whitespace-nowrap">
        {admin.lastActivity}
      </span>
    );
  };

  const renderStatusBadge = (status: AdminStatus) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          نشط
        </span>
      );
    }
    if (status === "suspended") {
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200/80 text-[11px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          معطل / معلق
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        معلق
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="ابحث باسم، البريد، أو التخصص..."
            className="w-full bg-[#F1F3F5] text-gray-900 placeholder:text-gray-400 rounded-xl pr-9 pl-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-transparent focus:border-[#FF6A00] focus:bg-white focus:outline-none transition-all text-right"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Role Filter Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsRoleDropdownOpen(!isRoleDropdownOpen);
              setIsStatusDropdownOpen(false);
            }}
            className="bg-[#F8F9FA] hover:bg-gray-100 text-gray-700 border border-gray-200/80 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <span>
              الصلاحية:{" "}
              {roleFilter === "all"
                ? "جميع الصلاحيات"
                : ROLE_DISPLAY[roleFilter].label}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
          {isRoleDropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
              {[
                { value: "all", label: "جميع الصلاحيات" },
                { value: "super_admin", label: "أدمن رئيسي" },
                { value: "code_manager", label: "مسؤول أكواد" },
                { value: "content_manager", label: "مشرف محتوى" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setRoleFilter(opt.value as AdminRole | "all");
                    setIsRoleDropdownOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-right px-4 py-2 text-xs font-bold hover:bg-orange-50/60 transition-colors cursor-pointer ${
                    roleFilter === opt.value
                      ? "text-[#FF6A00]"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsStatusDropdownOpen(!isStatusDropdownOpen);
              setIsRoleDropdownOpen(false);
            }}
            className="bg-[#F8F9FA] hover:bg-gray-100 text-gray-700 border border-gray-200/80 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer w-full sm:w-auto"
          >
            <span>
              الحالة:{" "}
              {statusFilter === "all"
                ? "جميع الحالات"
                : statusFilter === "active"
                ? "نشط"
                : "معطل"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
          {isStatusDropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
              {[
                { value: "all", label: "جميع الحالات" },
                { value: "active", label: "نشط" },
                { value: "suspended", label: "معطل / معلق" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(opt.value as AdminStatus | "all");
                    setIsStatusDropdownOpen(false);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-right px-4 py-2 text-xs font-bold hover:bg-orange-50/60 transition-colors cursor-pointer ${
                    statusFilter === opt.value
                      ? "text-[#FF6A00]"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-[#F8F9FA]/80 border-b border-gray-100 text-gray-500 text-[11px] font-bold">
              <th className="py-3 px-5 whitespace-nowrap">المشرف والمسمى الوظيفي</th>
              <th className="py-3 px-5 whitespace-nowrap">البريد الإلكتروني</th>
              <th className="py-3 px-5 text-center whitespace-nowrap">مستوى الصلاحية</th>
              <th className="py-3 px-5 text-center whitespace-nowrap">آخر نشاط</th>
              <th className="py-3 px-5 text-center whitespace-nowrap">الحالة</th>
              <th className="py-3 px-5 text-center whitespace-nowrap">إجراءات التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-400 text-sm font-bold">
                  لا توجد نتائج مطابقة للبحث
                </td>
              </tr>
            ) : (
              paginated.map((admin) => {
                const roleInfo = ROLE_DISPLAY[admin.role];
                const isSuspended = admin.status === "suspended";

                return (
                  <tr
                    key={admin.id}
                    className={`hover:bg-orange-50/15 transition-colors group ${
                      isSuspended ? "opacity-70" : ""
                    }`}
                  >
                    {/* Col 1: Admin Avatar + Name + Title */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {/* Avatar Circle */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0 border-2 border-white shadow-sm"
                          style={{ backgroundColor: admin.avatarColor }}
                        >
                          {admin.initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900 text-xs sm:text-sm group-hover:text-[#FF6A00] transition-colors">
                            {admin.shortTitle} {admin.fullName}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium leading-none mt-0.5">
                            {roleInfo.label}
                            {admin.isFounder && (
                              <span className="mr-1.5 text-[#FF6A00] font-bold">
                                • مالك ومؤسس المنصة
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Col 2: Email */}
                    <td className="py-4 px-5">
                      <span
                        dir="ltr"
                        className="text-xs text-gray-600 font-mono font-medium"
                      >
                        {admin.email}
                      </span>
                    </td>

                    {/* Col 3: Role Badge */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-xl border whitespace-nowrap ${roleInfo.badgeClass}`}
                      >
                        {roleInfo.icon}
                        <span>{roleInfo.labelEn}</span>
                      </span>
                    </td>

                    {/* Col 4: Last Activity */}
                    <td className="py-4 px-5 text-center">
                      {renderLastActivity(admin)}
                    </td>

                    {/* Col 5: Status */}
                    <td className="py-4 px-5 text-center">
                      {renderStatusBadge(admin.status)}
                    </td>

                    {/* Col 6: Action Buttons */}
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Founder cannot be edited */}
                        {admin.isFounder ? (
                          <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl whitespace-nowrap">
                            صلاحيات كاملة - حساب الأساس
                          </span>
                        ) : (
                          <>
                            {/* Edit Role */}
                            <button
                              type="button"
                              onClick={() => onEditRole(admin)}
                              className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-500 hover:text-[#FF6A00] flex items-center justify-center transition-all cursor-pointer"
                              title="تعديل الصلاحيات والبيانات"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Toggle Suspend / Activate */}
                            <button
                              type="button"
                              onClick={() => onToggleStatus(admin)}
                              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                isSuspended
                                  ? "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-600"
                                  : "bg-gray-50 hover:bg-red-50 border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-500"
                              }`}
                              title={
                                isSuspended ? "تفعيل الحساب" : "تعطيل الحساب"
                              }
                            >
                              {isSuspended ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                              ) : (
                                <Ban className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Reset Password */}
                            <button
                              type="button"
                              onClick={() => onResetPassword(admin)}
                              className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-500 hover:text-blue-600 flex items-center justify-center transition-all cursor-pointer"
                              title="إعادة ضبط كلمة المرور"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => onDelete(admin)}
                              className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-500 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
                              title="حذف الحساب"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-5 py-4 bg-gray-50/60 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
        {/* Page Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="الصفحة التالية"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-[#FF6A00] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-gray-700 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="الصفحة السابقة"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Total count */}
        <span className="text-xs font-bold text-gray-400">
          عرض {Math.min(paginated.length, itemsPerPage)} من أصل{" "}
          {filteredAdmins.length} حسابات مسجلة
        </span>
      </div>
    </div>
  );
};
