import { CodeItem, DashboardStats } from "@/types/dashboard";
import { AdminMember, NewAdminFormData } from "@/types/adminTeam";
import { GradeLevel, CurriculumStats } from "@/types/curriculum";
import {
  DailyActivationData,
  GradeDistributionItem,
  CityDistributionItem,
  HourlyActivityPoint,
  LecturePerformanceItem,
  StudentWatchRecord,
} from "@/types/analytics";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

const TOKEN_KEY = "codekedu_admin_token";
const ADMIN_USER_KEY = "codekedu_admin_user";

// ==========================================================
// 1. Token & LocalStorage Helpers
// ==========================================================
export const getAdminToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAdminAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
};

export const getAdminUser = (): AdminMember | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAdminUser = (user: AdminMember): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
};

// ==========================================================
// 2. Base API Fetcher
// ==========================================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: any;
  [key: string]: any;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      (data?.errors ? Object.values(data.errors).flat().join(" - ") : null) ||
      `حدث خطأ في الاتصال بالخادم (${response.status})`;
    throw new Error(errorMsg);
  }

  return data;
}

// ==========================================================
// 3. Admin Authentication API
// ==========================================================
export const adminApi = {
  login: async (email: string, password: string) => {
    const res = await apiFetch<{
      success: boolean;
      message: string;
      token: string;
      admin: AdminMember;
    }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.token) {
      setAdminToken(res.token);
    }
    if (res.admin) {
      setAdminUser(res.admin);
    }
    return res;
  },

  me: async () => {
    return apiFetch<{ success: boolean; admin: AdminMember }>("/admin/me");
  },

  logout: async () => {
    try {
      await apiFetch("/admin/logout", { method: "POST" });
    } finally {
      clearAdminAuth();
    }
  },

  getTeam: async () => {
    const res = await apiFetch<{ success: boolean; data: AdminMember[] }>(
      "/admin/team"
    );
    return res.data || [];
  },

  addTeamMember: async (formData: NewAdminFormData & { shortTitle?: string }) => {
    return apiFetch<{ success: boolean; message: string; data: AdminMember }>(
      "/admin/team",
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );
  },

  toggleTeamStatus: async (id: string) => {
    return apiFetch<{ success: boolean; message: string; status: string }>(
      `/admin/team/${id}/toggle-status`,
      {
        method: "PATCH",
      }
    );
  },
};

// ==========================================================
// 4. Activation Codes API
// ==========================================================
export const codesApi = {
  getCodes: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    group?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.per_page) query.append("per_page", String(params.per_page));
    if (params?.search) query.append("search", params.search);
    if (params?.status && params.status !== "all")
      query.append("status", params.status);
    if (params?.group) query.append("group", params.group);

    const qs = query.toString();
    const endpoint = `/admin/codes${qs ? `?${qs}` : ""}`;
    return apiFetch<{
      success: boolean;
      data: CodeItem[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
      };
    }>(endpoint);
  },

  getStats: async () => {
    const res = await apiFetch<{
      success: boolean;
      stats: DashboardStats;
    }>("/admin/codes/stats");
    return res.stats;
  },

  generate: async (payload: {
    count: number;
    groupName: string;
    validityDays?: number;
    lessonId?: number | string;
    gradeLevelId?: number | string;
  }) => {
    return apiFetch<{
      success: boolean;
      message: string;
      count: number;
      data: CodeItem[];
    }>("/admin/codes/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteCode: async (id: string) => {
    return apiFetch(`/admin/codes/${id}`, { method: "DELETE" });
  },

  bulkDelete: async (ids: string[]) => {
    return apiFetch("/admin/codes/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
  },

  bulkUpdateStatus: async (ids: string[], status: "new" | "used" | "expired") => {
    return apiFetch("/admin/codes/bulk-status", {
      method: "POST",
      body: JSON.stringify({ ids, status }),
    });
  },

  exportCodes: async (ids?: string[]) => {
    const res = await apiFetch<{ success: boolean; data: CodeItem[] }>(
      "/admin/codes/export",
      {
        method: "GET",
        headers: ids ? { "X-Export-Ids": ids.join(",") } : {},
      }
    );
    return res.data || [];
  },
};

// ==========================================================
// 5. Curriculum API
// ==========================================================
export const curriculumApi = {
  getTree: async () => {
    return apiFetch<{
      success: boolean;
      stats: CurriculumStats;
      data: GradeLevel[];
    }>("/admin/curriculum");
  },

  createGrade: async (data: { title: string; subtitle?: string }) => {
    return apiFetch<{ success: boolean; data: any; message: string }>(
      "/admin/curriculum/grades",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  deleteGrade: async (id: string | number) => {
    return apiFetch<{ success: boolean; message: string }>(
      `/admin/curriculum/grades/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  createUnit: async (data: {
    grade_level_id: string | number;
    title: string;
    subtitle?: string;
  }) => {
    return apiFetch<{ success: boolean; data: any; message: string }>(
      "/admin/curriculum/units",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  deleteUnit: async (id: string | number) => {
    return apiFetch<{ success: boolean; message: string }>(
      `/admin/curriculum/units/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  createLesson: async (data: any) => {
    return apiFetch<{ success: boolean; data: any; message: string }>(
      "/admin/curriculum/lessons",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  updateLesson: async (id: string | number, data: any) => {
    return apiFetch<{ success: boolean; data: any; message: string }>(
      `/admin/curriculum/lessons/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  },

  deleteLesson: async (id: string | number) => {
    return apiFetch<{ success: boolean; message: string }>(
      `/admin/curriculum/lessons/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};

// ==========================================================
// 6. Analytics API
// ==========================================================
export const analyticsApi = {
  getOverview: async () => {
    const res = await apiFetch<{
      success: boolean;
      data: {
        totalCodes: number;
        activeAvailable: number;
        usedActive: number;
        expired: number;
        totalStudents: number;
        completionRate: number;
        avgWatchProgress: number;
        totalWatchHours: number;
        estimatedRevenue: number;
      };
    }>("/admin/analytics/overview");
    return res.data;
  },

  getLecturePerformance: async () => {
    const res = await apiFetch<{
      success: boolean;
      data: LecturePerformanceItem[];
    }>("/admin/analytics/performance");
    return res.data;
  },

  getStudentsWatchLog: async () => {
    const res = await apiFetch<{
      success: boolean;
      data: StudentWatchRecord[];
    }>("/admin/analytics/students-log");
    return res.data;
  },

  getDailyActivations: async () => {
    const res = await apiFetch<{
      success: boolean;
      data: DailyActivationData[];
    }>("/admin/analytics/daily-activations");
    return res.data;
  },

  getDistributions: async () => {
    const res = await apiFetch<{
      success: boolean;
      data: {
        gradeDistribution: GradeDistributionItem[];
        cityDistribution: CityDistributionItem[];
        hourlyActivity: HourlyActivityPoint[];
      };
    }>("/admin/analytics/distributions");
    return res.data;
  },
};

// ==========================================================
// 7. Student Portal API
// ==========================================================
export const studentApi = {
  verifyCode: async (payload: {
    code: string;
    student_name?: string;
    student_phone?: string;
    device?: "mobile" | "desktop" | "tablet";
  }) => {
    return apiFetch<{
      success: boolean;
      message: string;
      redirectUrl: string;
      code: string;
      status: string;
      expiresAt: string | null;
    }>("/student/verify-code", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getLecture: async (code: string) => {
    return apiFetch<{
      success: boolean;
      code: string;
      lesson: {
        id: string;
        title: string;
        description: string;
        duration: string;
        durationSeconds: number;
        videoSource: string;
        videoUrl: string;
        videoProvider: string;
        hasPdf: boolean;
        pdfTitle: string;
        pdfUrl: string;
        hasQuiz: boolean;
        quizTitle: string;
        quizQuestionsCount: number;
        quizDuration: string;
      };
      progress: {
        currentSeconds: number;
        watchProgress: number;
        completed: boolean;
      };
      units: any[];
      savedNotes: { id: string; time: string; text: string }[];
      validity?: any;
    }>(`/student/lecture/${encodeURIComponent(code)}`);
  },

  updateProgress: async (payload: {
    code: string;
    lesson_id: string | number;
    current_seconds: number;
    watch_progress: number;
    completed?: boolean;
    device?: "mobile" | "desktop" | "tablet";
  }) => {
    return apiFetch("/student/progress", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  addNote: async (payload: {
    code?: string;
    lesson_id: string | number;
    time_formatted: string;
    time_seconds?: number;
    text: string;
  }) => {
    return apiFetch<{
      success: boolean;
      message: string;
      note: { id: string; time: string; text: string };
    }>("/student/notes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
