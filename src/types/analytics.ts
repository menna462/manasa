export type TimeRangeFilter = 'today' | 'week' | 'month' | 'all';

export interface StudentWatchRecord {
  id: string;
  studentName: string;
  phone: string;
  grade: string;
  watchProgress: number; // 0 to 100%
  completed: boolean;
  totalWatchMinutes: number;
  lastWatchedAt: string;
  quizScore?: number; // e.g. 95/100
  device: 'mobile' | 'desktop' | 'tablet';
}

export interface RetentionDataPoint {
  minute: number;
  percentage: number;
  topicTag?: string;
}

export interface LecturePerformanceItem {
  id: string;
  title: string;
  part: string;
  grade: string;
  duration: number; // in minutes
  activatedCodes: number;
  completionRate: number; // percentage 0 - 100
  replayCount: number;
  avgWatchMinutes: number;
  popularityStatus: 'exceptional' | 'very_good' | 'excellent' | 'high_replay' | 'good';
  popularityText: string;
  retentionCurve?: RetentionDataPoint[];
  studentsLog?: StudentWatchRecord[];
  deviceBreakdown?: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export interface DailyActivationData {
  day: string;
  dateStr: string;
  codes: number;
  revenue: number;
  isPeak?: boolean;
}

export interface GradeDistributionItem {
  gradeName: string;
  percentage: number;
  codesCount: number;
  color: string;
}

export interface CityDistributionItem {
  cityName: string;
  percentage: number;
  studentsCount: number;
}

export interface HourlyActivityPoint {
  hourLabel: string;
  activityPercentage: number;
  isPeak?: boolean;
}

