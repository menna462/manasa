import { CodeItem, DashboardStats } from "@/types/dashboard";

export const initialStats: DashboardStats = {
  totalCodes: 1450,
  activeAvailable: 980,
  usedActive: 420,
  expired: 50,
};

export const initialCodes: CodeItem[] = [
  {
    id: "1",
    code: "AH-8923-X1",
    groupName: "سنتر الأمل — شهر 10",
    createdAt: "2025/02/15",
    validityDays: 30,
    status: "new",
  },
  {
    id: "2",
    code: "AH-7741-K9",
    groupName: "سنتر الأمل — شهر 10",
    createdAt: "2025/02/15",
    validityDays: 30,
    status: "new",
  },
  {
    id: "3",
    code: "AH-9920-M4",
    groupName: "مراجعة الباب الأول — كيمياء",
    createdAt: "2025/02/12",
    validityDays: 15,
    status: "used",
    usedBy: "محمد كريم (سنتر النور)",
    activatedAt: "2025/02/13",
  },
  {
    id: "4",
    code: "AH-3412-B8",
    groupName: "لغات المعادي — الصف الثالث",
    createdAt: "2025/02/10",
    validityDays: 60,
    status: "used",
    usedBy: "سارة طارق (أونلاين)",
    activatedAt: "2025/02/11",
  },
  {
    id: "5",
    code: "AH-6120-Z5",
    groupName: "مجموعة الأوائل — مكثف",
    createdAt: "2025/01/01",
    validityDays: 15,
    status: "expired",
    usedBy: "عمر خالد (انتهت الصلاحية)",
    activatedAt: "2025/01/02",
  },
];
