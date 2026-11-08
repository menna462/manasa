export type CodeStatus = 'new' | 'used' | 'expired';

export interface CodeItem {
  id: string;
  code: string;
  groupName: string;
  createdAt: string;
  validityDays: number;
  status: CodeStatus;
  usedBy?: string;
  activatedAt?: string;
  expiresAt?: string;       // تاريخ انتهاء الصلاحية
  lessonTitle?: string;     // اسم الدرس المرتبط
  lessonDuration?: string;  // مدة الدرس (مثال: 01:20:00)
}

export interface DashboardStats {
  totalCodes: number;
  activeAvailable: number;
  usedActive: number;
  expired: number;
}
