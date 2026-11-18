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
  lessonTitle?: string;     // اسم الدرس أو الوحدة المرتبطة
  lessonDuration?: string;  // مدة الدرس (مثال: 01:20:00)
  contentScope?: 'unit' | 'lesson' | 'general';  // نطاق الكود
  unitId?: string;          // ID الوحدة (لو كود وحدة)
  lessonId?: string;        // ID الدرس (لو كود درس)
}

export interface DashboardStats {
  totalCodes: number;
  activeAvailable: number;
  usedActive: number;
  expired: number;
}
