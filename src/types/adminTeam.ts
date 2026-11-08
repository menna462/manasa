export type AdminRole = 'super_admin' | 'code_manager' | 'content_manager';
export type AdminStatus = 'active' | 'suspended' | 'pending';
export type LastActivityType = 'online' | 'today' | 'days_ago' | 'weeks_ago';

export interface AdminMember {
  id: string;
  fullName: string;
  shortTitle: string; // e.g. "م/" "أ/" "د/"
  initials: string;   // e.g. "عح" for عماد حسين
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastActivity: string;   // display string
  lastActivityType: LastActivityType;
  avatarColor: string;    // hex for avatar bg
  isFounder?: boolean;
}

export interface NewAdminFormData {
  fullName: string;
  email: string;
  tempPassword: string;
  role: AdminRole;
  isActive: boolean;
}
