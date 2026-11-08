export type VideoSourceType = 'upload' | 'external';
export type VideoProviderType = 'youtube' | 'bunny' | 'cloudflare' | 'vimeo' | 'custom';

export interface LessonItem {
  id: string;
  orderNumber: number;
  title: string;
  duration: string;
  size: string;
  viewsCount?: string;
  hasPdf?: boolean;
  pdfTitle?: string;
  pdfUrl?: string;
  hasQuiz?: boolean;
  quizTitle?: string;
  status: 'published' | 'draft';
  videoSource?: VideoSourceType;
  videoUrl?: string;
  videoProvider?: VideoProviderType;
}

export interface UnitItem {
  id: string;
  unitNumber: number;
  title: string;
  lessonsCount: number;
  pdfCount?: number;
  isExpanded?: boolean;
  lessons: LessonItem[];
}

export interface GradeLevel {
  id: string;
  title: string;
  subtitle: string;
  unitsCount: number;
  lessonsCount: number;
  pdfCount: number;
  isActive: boolean;
  statusText: string;
  statusType: 'active' | 'published';
  units: UnitItem[];
}

export interface CurriculumStats {
  gradesCount: number;
  unitsCount: number;
  lessonsCount: number;
  pdfCount: number;
}
